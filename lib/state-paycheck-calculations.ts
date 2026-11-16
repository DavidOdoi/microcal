import { annualizePay, calculateFica, calculateNyPfl2026, payrollWageBases, type PayrollFrequency, type PayrollYear } from './payroll-calculations.ts';
import { calculateFederalIncomeTax } from './federal-income-tax-calculations.ts';
import type { FilingStatus } from './federal-tax.ts';

export type StatePaycheckInput = {
  state: 'ny' | 'idaho'; year: PayrollYear; earnings: number; earningsUnit: 'annual' | 'monthly' | 'weekly' | 'hourly'; hours: number; weeks: number; periods: PayrollFrequency;
  federalMode: 'entered' | 'planning'; federalWithholding: number; stateWithholding: number; localWithholding: number; extraFederal: number; extraState: number;
  filingStatus: FilingStatus; otherAnnualIncome: number; annualDeductions: number; annualCredits: number;
  health: number; traditional: number; roth: number; otherDeductions: number;
  ytdSocialSecurity: number; ytdMedicare: number; pflCovered: boolean; ytdPfl: number;
  residence: 'other' | 'nyc' | 'yonkers' | 'nonresident'; work: 'other' | 'yonkers';
};

export function validateStatePaycheck(v: StatePaycheckInput): string[] {
  const errors: string[] = [];
  for (const key of ['earnings', 'federalWithholding', 'stateWithholding', 'localWithholding', 'extraFederal', 'extraState', 'otherAnnualIncome', 'annualDeductions', 'annualCredits', 'health', 'traditional', 'roth', 'otherDeductions', 'ytdSocialSecurity', 'ytdMedicare', 'ytdPfl'] as const) {
    if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e9) errors.push(`${key} must be between zero and one billion.`);
  }
  if (!['ny', 'idaho'].includes(v.state) || ![2025, 2026].includes(v.year) || (v.state === 'ny' && v.year !== 2026)) errors.push('Choose a supported state and payroll year.');
  if (![12, 24, 26, 52].includes(v.periods)) errors.push('Choose a supported pay frequency.');
  if (!['annual', 'monthly', 'weekly', 'hourly'].includes(v.earningsUnit)) errors.push('Choose a valid earnings unit.');
  if (!Number.isFinite(v.hours) || v.hours <= 0 || v.hours > 168 || !Number.isFinite(v.weeks) || v.weeks <= 0 || v.weeks > 52) errors.push('Use positive hours up to 168 per week and weeks up to 52 per year.');
  if (!['entered', 'planning'].includes(v.federalMode) || !['single', 'joint', 'separate', 'head'].includes(v.filingStatus)) errors.push('Choose a federal estimate method and filing status.');
  if (!['other', 'nyc', 'yonkers', 'nonresident'].includes(v.residence) || !['other', 'yonkers'].includes(v.work)) errors.push('Choose valid work and residence locations.');
  if (v.state === 'idaho' && v.localWithholding !== 0) errors.push('This Idaho model does not apply a local income tax.');
  if (errors.length) return errors;
  const annual = annualizePay(v.earnings, v.earningsUnit, v.hours, v.weeks);
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
  const annualGross = annualizePay(v.earnings, v.earningsUnit, v.hours, v.weeks);
  const gross = annualGross / v.periods;
  const wageBases = payrollWageBases(gross, v.health, v.traditional, v.roth);
  const fica = calculateFica({ currentWages: wageBases.ficaWages, ytdSocialSecurityWages: v.ytdSocialSecurity, ytdMedicareWages: v.ytdMedicare, year: v.year });
  const federalBase = v.federalMode === 'entered' ? v.federalWithholding : calculateFederalIncomeTax({ year: v.year, status: v.filingStatus, income: wageBases.incomeTaxWages * v.periods + v.otherAnnualIncome, adjustments: v.annualDeductions, deductionMode: 'standard', itemized: 0, nonrefundableCredits: v.annualCredits, refundableCredits: 0, withholding: 0 }).tax / v.periods;
  const federal = federalBase + v.extraFederal;
  const state = v.stateWithholding + v.extraState;
  const local = v.state === 'ny' ? v.localWithholding : 0;
  const pfl = v.state === 'ny' ? calculateNyPfl2026(gross, v.ytdPfl, v.pflCovered) : 0;
  const taxes = federal + state + local + fica.socialSecurity + fica.medicare + fica.additionalMedicare;
  const deductions = wageBases.benefitDeductions + v.otherDeductions + pfl;
  return { annualGross, gross, ...wageBases, ...fica, federal, state, local, pfl, taxes, deductions, net: gross - taxes - deductions };
}
