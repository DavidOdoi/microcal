/** Pure calculation helpers shared by the calculator UI and tests. */
const MAX_INPUT = 1_000_000_000_000;

export function safeAmount(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_INPUT, Math.max(0, value)) : 0;
}

export function roundCurrency(value: number): number {
  const safe = Number.isFinite(value) ? value : 0;
  return Math.round((safe + Math.sign(safe) * Number.EPSILON * Math.abs(safe)) * 100) / 100;
}

export function resetCalculatorValues<T extends Record<string, string>>(defaults: T): T {
  return { ...defaults };
}

export function cdTermMonths(value: number, unit: 'months' | 'years'): number {
  return safeAmount(value) * (unit === 'years' ? 12 : 1);
}

export function calculateDti(input: {
  grossMonthlyIncome: number;
  housingPayment: number;
  housingType: 'mortgage' | 'rent';
  carPayment: number;
  studentLoanPayment: number;
  personalLoanPayment: number;
  creditCardMinimums: number;
  otherDebt: number;
  proposedLoanPayment: number;
}) {
  const income = safeAmount(input.grossMonthlyIncome);
  const housing = safeAmount(input.housingPayment);
  const qualifyingDebt =
    (input.housingType === 'mortgage' ? housing : 0) +
    safeAmount(input.carPayment) +
    safeAmount(input.studentLoanPayment) +
    safeAmount(input.personalLoanPayment) +
    safeAmount(input.creditCardMinimums) +
    safeAmount(input.otherDebt);
  const proposed = safeAmount(input.proposedLoanPayment);
  const percent = income > 0 ? (qualifyingDebt / income) * 100 : null;
  const projectedPercent = income > 0 ? ((qualifyingDebt + proposed) / income) * 100 : null;
  return {
    qualifyingDebt,
    grossMonthlyIncome: income,
    dtiPercent: percent,
    projectedDtiPercent: proposed > 0 ? projectedPercent : null,
    remainingPercent: percent === null ? null : 100 - percent,
    rentExcluded: input.housingType === 'rent' && housing > 0,
  };
}

export function calculateEmergencyFund(input: {
  housing: number; groceries: number; utilities: number; transportation: number;
  insurance: number; essentialDebt: number; otherEssential: number;
  currentSavings: number; monthlyContribution: number; targetMonths: number;
}) {
  const monthlyExpenses = [input.housing, input.groceries, input.utilities, input.transportation,
    input.insurance, input.essentialDebt, input.otherEssential].reduce((sum, value) => sum + safeAmount(value), 0);
  const currentSavings = safeAmount(input.currentSavings);
  const contribution = safeAmount(input.monthlyContribution);
  const months = Number.isFinite(input.targetMonths) ? Math.min(120, Math.max(1, input.targetMonths)) : 6;
  const target = Math.min(MAX_INPUT, monthlyExpenses * months);
  const remaining = Math.max(0, target - currentSavings);
  const monthsToGoal = remaining === 0 ? 0 : contribution > 0 ? Math.ceil(remaining / contribution) : null;
  return {
    monthlyExpenses,
    targetMonths: months,
    target,
    currentSavings,
    remaining,
    monthsCovered: monthlyExpenses > 0 ? currentSavings / monthlyExpenses : null,
    monthsToGoal,
    progressPercent: target > 0 ? Math.min(100, (currentSavings / target) * 100) : 0,
  };
}

export type CdRateMode = 'apy' | 'nominal';
export type CdCompounding = 1 | 2 | 4 | 12 | 365;

export function calculateCd(input: {
  principal: number; annualRatePercent: number; termMonths: number;
  mode: CdRateMode; compounding: CdCompounding; earlyWithdrawalPenalty: number;
}) {
  const principal = safeAmount(input.principal);
  const rate = Number.isFinite(input.annualRatePercent) ? Math.min(100, Math.max(0, input.annualRatePercent)) / 100 : 0;
  const termMonths = Number.isFinite(input.termMonths) ? Math.min(1200, Math.max(0, input.termMonths)) : 0;
  const years = termMonths / 12;
  const frequency = input.compounding;
  const maturityValue = input.mode === 'apy'
    ? principal * Math.pow(1 + rate, years)
    : principal * Math.pow(1 + rate / frequency, frequency * years);
  const effectiveAnnualYield = input.mode === 'apy' ? rate : Math.pow(1 + rate / frequency, frequency) - 1;
  const penalty = Math.min(maturityValue, safeAmount(input.earlyWithdrawalPenalty));
  const chartSteps = Math.min(10, Math.max(1, Math.ceil(years))) + 1;
  const chart = Array.from({ length: chartSteps }, (_, index) => {
    const year = years * index / (chartSteps - 1);
    const balance = input.mode === 'apy'
      ? principal * Math.pow(1 + rate, year)
      : principal * Math.pow(1 + rate / frequency, frequency * year);
    return { year, balance };
  });
  return {
    principal,
    interestEarned: maturityValue - principal,
    maturityValue,
    effectiveAnnualYield,
    estimatedPenalty: penalty,
    netAfterPenalty: maturityValue - penalty,
    chart,
  };
}
