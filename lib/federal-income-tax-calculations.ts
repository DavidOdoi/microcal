import { federalOrdinaryTax, standardDeductions, type FilingStatus, type TaxYear } from './federal-tax.ts';
export type FederalIncomeTaxInput = { year: TaxYear; status: FilingStatus; income: number; adjustments: number; deductionMode: 'standard' | 'itemized'; itemized: number; nonrefundableCredits: number; refundableCredits: number; withholding: number };
export function validateFederalIncomeTax(v: FederalIncomeTaxInput): string[] {
  const errors: string[] = [];
  for (const key of ['income', 'adjustments', 'itemized', 'nonrefundableCredits', 'refundableCredits', 'withholding'] as const) if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e9) errors.push(`${key} must be between zero and one billion.`);
  if (v.adjustments > v.income) errors.push('Income adjustments cannot exceed entered income in this simplified estimate.');
  if (![2025, 2026].includes(v.year) || !['single', 'joint', 'separate', 'head'].includes(v.status)) errors.push('Choose a supported tax year and filing status.');
  if (!['standard', 'itemized'].includes(v.deductionMode)) errors.push('Choose standard or itemized deductions.');
  return errors;
}
export function calculateFederalIncomeTax(v: FederalIncomeTaxInput) {
  const errors = validateFederalIncomeTax(v); if (errors.length) throw new RangeError(errors.join(' '));
  const agi = v.income - v.adjustments;
  const deduction = v.deductionMode === 'standard' ? standardDeductions[v.year][v.status] : v.itemized;
  const taxableIncome = Math.max(0, agi - deduction);
  const ordinary = federalOrdinaryTax(taxableIncome, v.year, v.status);
  const nonrefundableApplied = Math.min(v.nonrefundableCredits, ordinary.tax);
  const tax = ordinary.tax - nonrefundableApplied;
  const refundOrBalance = v.withholding + v.refundableCredits - tax;
  return { agi, deduction, taxableIncome, taxBeforeCredits: ordinary.tax, nonrefundableApplied, tax, refundableCredits: v.refundableCredits, refundOrBalance, effectiveRate: v.income > 0 ? tax / v.income * 100 : 0, marginalRate: ordinary.marginalRate * 100, rows: ordinary.rows };
}
