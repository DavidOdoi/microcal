import { calculateScheduledLoan, validateScheduledLoan, type ScheduledLoanInput } from './loan-calculations.ts';
export type FarmLoanInput = { purchaseCost: number; downPayment: number; annualRate: number; term: number; termUnit: 'years' | 'months'; frequency: 1 | 4 | 12; fee: number; feeTreatment: 'upfront' | 'financed'; extraPayment: number; annualRevenue: number; annualOperatingExpenses: number };
function loanInput(v: FarmLoanInput): ScheduledLoanInput { return { amount: Math.max(1, v.purchaseCost - v.downPayment), annualRate: v.annualRate, term: v.term, termUnit: v.termUnit, paymentsPerYear: v.frequency, fee: v.fee, feeTreatment: v.feeTreatment, extraPayment: v.extraPayment }; }
export function validateFarmLoan(v: FarmLoanInput): string[] {
  const errors: string[] = [];
  for (const [key, label] of [['purchaseCost', 'Purchase cost'], ['downPayment', 'Down payment'], ['annualRevenue', 'Annual revenue'], ['annualOperatingExpenses', 'Annual operating expenses']] as const) if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e9) errors.push(`${label} must be between $0 and $1 billion.`);
  if (v.downPayment > v.purchaseCost) errors.push('Down payment cannot exceed the purchase cost or borrowing need.');
  if (![1, 4, 12].includes(v.frequency)) errors.push('Choose monthly, quarterly, or annual farm loan payments.');
  errors.push(...validateScheduledLoan(loanInput(v)));
  const periods = v.term * (v.termUnit === 'months' ? 1 / 12 : 1) * v.frequency;
  if (Number.isFinite(periods) && (periods < 1 || Math.abs(periods - Math.round(periods)) > 1e-8)) errors.push('Choose a term containing whole payment periods: monthly terms use whole months, quarterly terms use multiples of 3 months, and annual terms use whole years.');
  return errors;
}
export function calculateFarmLoan(v: FarmLoanInput) {
  const errors = validateFarmLoan(v); if (errors.length) throw new RangeError(errors.join(' '));
  const financedPurchase = v.purchaseCost - v.downPayment;
  const loan = financedPurchase > 0 ? calculateScheduledLoan({ ...loanInput(v), amount: financedPurchase }) : {
    principal: 0, upfrontFee: 0, payment: 0, plannedPayment: 0, paymentCount: 0, roundedTerm: false, totalInterest: 0, totalPayments: 0, totalRepayment: 0, actualPaymentCount: 0, paymentsSaved: 0, interestSaved: 0, schedule: [] as ReturnType<typeof calculateScheduledLoan>['schedule'],
  };
  const annualDebtService = loan.payment * Math.min(loan.paymentCount, v.frequency);
  return { ...loan, financedPurchase, loanFee: financedPurchase > 0 ? v.fee : 0, totalOutlay: v.downPayment + loan.totalRepayment,
    annualDebtService, annualOperatingSurplus: v.annualRevenue - v.annualOperatingExpenses,
    annualCashAfterScheduledDebt: v.annualRevenue - v.annualOperatingExpenses - annualDebtService,
  };
}
