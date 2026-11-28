import { annualizePay, calculateFica, calculateNyPfl2026, payrollWageBases, type PayrollFrequency, type PayrollYear } from './payroll-calculations.ts';
import { calculateFederalIncomeTax } from './federal-income-tax-calculations.ts';
import type { FilingStatus } from './federal-tax.ts';

export type StatePaycheckInput = {
  state: 'us' | 'ny' | 'idaho'; year: PayrollYear; earnings: number; earningsUnit: 'annual' | 'monthly' | 'weekly' | 'hourly'; hours: number; weeks: number; periods: PayrollFrequency;
  overtimeHours?: number; doubleTimeHours?: number;
  federalMode: 'entered' | 'planning'; federalWithholding: number; stateWithholding: number; localWithholding: number; extraFederal: number; extraState: number;
  filingStatus: FilingStatus; otherAnnualIncome: number; annualDeductions: number; annualCredits: number;
  health: number; traditional: number; roth: number; otherDeductions: number;
  ytdSocialSecurity: number; ytdMedicare: number; pflCovered: boolean; ytdPfl: number;
  residence: 'other' | 'nyc' | 'yonkers' | 'nonresident'; work: 'other' | 'yonkers';
};

function annualizeEarnings(v: StatePaycheckInput) {
  const regular = annualizePay(v.earnings, v.earningsUnit, v.hours, v.weeks);
  if (v.earningsUnit !== 'hourly') return regular;
  return regular + v.earnings * v.weeks * (1.5 * (v.overtimeHours ?? 0) + 2 * (v.doubleTimeHours ?? 0));
}

export function validateStatePaycheck(v: StatePaycheckInput): string[] {
  const errors: string[] = [];
  for (const key of ['earnings', 'federalWithholding', 'stateWithholding', 'localWithholding', 'extraFederal', 'extraState', 'otherAnnualIncome', 'annualDeductions', 'annualCredits', 'health', 'traditional', 'roth', 'otherDeductions', 'ytdSocialSecurity', 'ytdMedicare', 'ytdPfl'] as const) {
    if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e9) errors.push(`${key} must be between zero and one billion.`);
  }
  if (!['us', 'ny', 'idaho'].includes(v.state) || ![2025, 2026].includes(v.year) || (v.state === 'ny' && v.year !== 2026)) errors.push('Choose a supported payroll location and year.');
  if (![12, 24, 26, 52].includes(v.periods)) errors.push('Choose a supported pay frequency.');
  if (!['annual', 'monthly', 'weekly', 'hourly'].includes(v.earningsUnit)) errors.push('Choose a valid earnings unit.');
  const overtime = v.overtimeHours ?? 0;
  const doubleTime = v.doubleTimeHours ?? 0;
  if (![v.hours, overtime, doubleTime].every(hours => Number.isFinite(hours) && hours >= 0) || v.hours > 168 || (v.state !== 'us' && v.hours === 0)
    || (v.earningsUnit === 'hourly' && (v.hours + overtime + doubleTime <= 0 || v.hours + overtime + doubleTime > 168))) errors.push('Enter between 0 and 168 regular hours. For hourly pay, total regular, overtime, and double-time hours must be greater than zero and no more than 168 per week.');
  if (!Number.isFinite(v.weeks) || v.weeks <= 0 || v.weeks > 52) errors.push('Enter more than 0 and up to 52 paid weeks per year.');
  if (!['entered', 'planning'].includes(v.federalMode) || !['single', 'joint', 'separate', 'head'].includes(v.filingStatus)) errors.push('Choose a federal estimate method and filing status.');
  if (!['other', 'nyc', 'yonkers', 'nonresident'].includes(v.residence) || !['other', 'yonkers'].includes(v.work)) errors.push('Choose valid work and residence locations.');
  if (v.state === 'idaho' && v.localWithholding !== 0) errors.push('This Idaho model does not apply a local income tax.');
  if (errors.length) return errors;
  const annual = annualizeEarnings(v);
  if (annual > 1e9) return ['Annualized earnings cannot exceed $1 billion.'];
  const gross = annual / v.periods;
  if (v.health + v.traditional + v.roth > gross) return ['Benefit and retirement deductions cannot exceed gross pay per period.'];
  const wageBases = payrollWageBases(gross, v.health, v.traditional, v.roth);
  const federalIncome = wageBases.incomeTaxWages * v.periods + v.otherAnnualIncome;
  if (v.federalMode === 'planning' && federalIncome > 1e9) return ['Combined annual wages and other federal income cannot exceed $1 billion.'];
  if (v.federalMode === 'planning' && v.annualDeductions > federalIncome) return ['Annual federal adjustments cannot exceed annualized taxable wages plus other income.'];
  return errors;
}

export function calculateStatePaycheck(v: StatePaycheckInput) {
  const errors = validateStatePaycheck(v); if (errors.length) throw new RangeError(errors.join(' '));
  const annualGross = annualizeEarnings(v);
  const gross = annualGross / v.periods;
  const wageBases = payrollWageBases(gross, v.health, v.traditional, v.roth);
  const fica = calculateFica({ currentWages: wageBases.ficaWages, ytdSocialSecurityWages: v.ytdSocialSecurity, ytdMedicareWages: v.ytdMedicare, year: v.year });
  const federalBase = v.federalMode === 'entered' ? v.federalWithholding : calculateFederalIncomeTax({ year: v.year, status: v.filingStatus, income: wageBases.incomeTaxWages * v.periods + v.otherAnnualIncome, adjustments: v.annualDeductions, deductionMode: 'standard', itemized: 0, nonrefundableCredits: v.annualCredits, refundableCredits: 0, withholding: 0 }).tax / v.periods;
  const federal = federalBase + v.extraFederal;
  const state = v.stateWithholding + v.extraState;
  const local = v.state === 'idaho' ? 0 : v.localWithholding;
  const pfl = v.state === 'ny' ? calculateNyPfl2026(gross, v.ytdPfl, v.pflCovered) : 0;
  const taxes = federal + state + local + fica.socialSecurity + fica.medicare + fica.additionalMedicare;
  const deductions = wageBases.benefitDeductions + v.otherDeductions + pfl;
  return { annualGross, gross, ...wageBases, ...fica, federal, state, local, pfl, taxes, deductions, net: gross - taxes - deductions };
}

export type NationalPaycheckInput = Omit<StatePaycheckInput, 'state' | 'pflCovered' | 'ytdPfl' | 'residence' | 'work'> & {
  stateDisabilityWithholding?: number;
};

function nationalPayroll(input: NationalPaycheckInput): StatePaycheckInput {
  return { ...input, state: 'us', pflCovered: false, ytdPfl: 0, residence: 'other', work: 'other' };
}

export function validateNationalPaycheck(input: NationalPaycheckInput) {
  return [...validateStatePaycheck(nationalPayroll(input)), ...validateStateDisability(input)];
}

function validateStateDisability(input: NationalPaycheckInput) {
  const amount = input.stateDisabilityWithholding ?? 0;
  return Number.isFinite(amount) && amount >= 0 && amount <= 1e9 ? [] : ['Enter a nonnegative state disability deduction up to $1 billion.'];
}

export function calculateNationalPaycheck(input: NationalPaycheckInput) {
  const disabilityErrors = validateStateDisability(input);
  if (disabilityErrors.length) throw new RangeError(disabilityErrors[0]);
  const result = calculateStatePaycheck(nationalPayroll(input));
  const toCents = (amount: number) => Math.round(amount * 100);
  const gross = toCents(result.gross);
  const federal = toCents(result.federal);
  const state = toCents(result.state);
  const local = toCents(result.local);
  const socialSecurity = toCents(result.socialSecurity);
  const medicare = toCents(result.medicare);
  const additionalMedicare = toCents(result.additionalMedicare);
  const health = toCents(input.health);
  const traditional = toCents(input.traditional);
  const roth = toCents(input.roth);
  const other = toCents(input.otherDeductions);
  const stateDisability = toCents(input.stateDisabilityWithholding ?? 0);
  const deductions = federal + state + local + socialSecurity + medicare + additionalMedicare + health + traditional + roth + other + stateDisability;
  return { gross, federal, state, local, socialSecurity, medicare, additionalMedicare, health, traditional, roth, other, stateDisability, deductions, net: gross - deductions,
    incomeTaxWages: toCents(result.incomeTaxWages), ficaWages: toCents(result.ficaWages) };
}
