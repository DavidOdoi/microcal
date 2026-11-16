import { federalOrdinaryTax, standardDeductions, type FilingStatus, type TaxYear } from './federal-tax.ts';
export type SelfEmploymentInput = { year: TaxYear; status: FilingStatus; revenue: number; expenses: number; wages: number; socialSecurityWages: number; otherIncome: number; adjustments: number; qbiDeduction: number; credits: number; payments: number };
export function validateSelfEmployment(v: SelfEmploymentInput): string[] {
  const errors: string[] = [];
  if (![2025, 2026].includes(v.year) || !['single', 'joint', 'separate', 'head'].includes(v.status)) errors.push('Choose a supported tax year and filing status.');
  for (const [key, amount] of Object.entries(v)) if (!['year', 'status'].includes(key) && (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 1e9)) errors.push(`${key}: enter an amount from zero to $1 billion.`);
  if (v.expenses > v.revenue) errors.push('Business losses are outside this estimate. Expenses cannot exceed revenue.');
  return errors;
}
/** Ordinary sole-proprietor income only; Schedule SE regular method, no optional farm/nonfarm method. */
export function calculateSelfEmployment(v: SelfEmploymentInput) {
  const errors = validateSelfEmployment(v); if (errors.length) throw new RangeError(errors.join(' '));
  const profit = v.revenue - v.expenses;
  const earnings = profit * .9235;
  const wageBase = v.year === 2026 ? 184500 : 176100;
  const taxableEarnings = earnings >= 400 ? earnings : 0;
  const socialSecurityTax = Math.min(taxableEarnings, Math.max(0, wageBase - v.socialSecurityWages)) * .124;
  const medicareTax = taxableEarnings * .029;
  const selfEmploymentTax = socialSecurityTax + medicareTax;
  const halfDeduction = selfEmploymentTax / 2;
  const medicareThreshold = v.status === 'joint' ? 250000 : v.status === 'separate' ? 125000 : 200000;
  const additionalMedicare = Math.max(0, v.wages + taxableEarnings - medicareThreshold) * .009;
  const agi = Math.max(0, profit + v.wages + v.otherIncome - halfDeduction - v.adjustments);
  const standardDeduction = standardDeductions[v.year][v.status];
  const taxableIncome = Math.max(0, agi - standardDeduction - v.qbiDeduction);
  const bracketTax = federalOrdinaryTax(taxableIncome, v.year, v.status);
  const incomeTax = Math.max(0, bracketTax.tax - v.credits);
  const totalTax = incomeTax + selfEmploymentTax + additionalMedicare;
  const balance = totalTax - v.payments;
  return { profit, earnings, taxableEarnings, wageBase, socialSecurityTax, medicareTax, selfEmploymentTax, halfDeduction, additionalMedicare, agi, standardDeduction, taxableIncome, incomeTax, totalTax, balance, bracketRows: bracketTax.rows };
}
