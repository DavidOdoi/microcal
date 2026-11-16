import { calculateLoan } from './loan-calculations.ts';

export type DscrInput = { annualRent: number; vacancyPercent: number; otherIncome: number; operatingExpenses: number; debtMode: 'direct' | 'loan'; annualDebtService: number; loanAmount: number; annualRate: number; years: number; requiredDscr: number };
export function calculateDscr(input: DscrInput) {
  for (const key of ['annualRent', 'otherIncome', 'operatingExpenses', 'annualDebtService', 'loanAmount'] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > 1e9) throw new RangeError(`${key} must be between zero and one billion.`);
  }
  if (!Number.isFinite(input.vacancyPercent) || input.vacancyPercent < 0 || input.vacancyPercent > 100) throw new RangeError('Vacancy must be from 0% to 100%.');
  if (!Number.isFinite(input.requiredDscr) || input.requiredDscr <= 0 || input.requiredDscr > 10) throw new RangeError('Required DSCR must be above zero and no more than 10.');
  if (!['direct', 'loan'].includes(input.debtMode)) throw new RangeError('Choose a debt-service mode.');
  const vacancyLoss = input.annualRent * input.vacancyPercent / 100;
  const effectiveIncome = input.annualRent - vacancyLoss + input.otherIncome;
  const noi = effectiveIncome - input.operatingExpenses;
  // Reuse the tested fixed-rate loan math; operating expenses never enter debt service.
  const loan = calculateLoan({ amount: input.loanAmount || 1, annualRate: input.annualRate, term: input.years, termUnit: 'years', paymentsPerYear: 12, fee: 0, feeTreatment: 'upfront', extraPayment: 0 });
  const monthlyLoanPayment = input.loanAmount > 0 ? loan.payment : 0;
  const annualDebtService = input.debtMode === 'direct' ? input.annualDebtService : monthlyLoanPayment * 12;
  const maximumAnnualDebtService = Math.max(0, noi) / input.requiredDscr;
  const paymentPerDollar = loan.payment / loan.principal;
  return { vacancyLoss, effectiveIncome, noi, annualDebtService, monthlyLoanPayment,
    dscr: annualDebtService > 0 ? noi / annualDebtService : null,
    cashFlowAfterDebt: noi - annualDebtService,
    maximumAnnualDebtService, maximumMonthlyDebtService: maximumAnnualDebtService / 12,
    supportableLoan: maximumAnnualDebtService / 12 / paymentPerDollar,
    requiredNoi: annualDebtService * input.requiredDscr,
  };
}
