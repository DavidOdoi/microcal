import { federalOrdinaryTax, type FilingStatus, type TaxYear } from './federal-tax.ts';
export type WithdrawalInput = { amount: number; age: number; year: TaxYear; status: FilingStatus; otherTaxableIncome: number; account: 'traditional' | 'roth-qualified' | 'roth-nonqualified'; rothEarnings: number; stateRate: number; exception: boolean; federalWithholdingRate: number; stateWithholdingRate: number; growthRate: number; growthYears: number };
export function validateWithdrawal(v: WithdrawalInput): string[] {
  const errors: string[] = [];
  for (const key of ['amount', 'otherTaxableIncome', 'rothEarnings'] as const) if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e9) errors.push(`${key} must be from zero to one billion.`);
  for (const [key, min, max] of [['age', 0, 120], ['stateRate', 0, 20], ['federalWithholdingRate', 0, 100], ['stateWithholdingRate', 0, 100], ['growthRate', -100, 100], ['growthYears', 0, 80]] as const) if (!Number.isFinite(v[key]) || v[key] < min || v[key] > max) errors.push(`${key} must be from ${min} to ${max}.`);
  if (v.federalWithholdingRate + v.stateWithholdingRate > 100) errors.push('Combined withholding cannot exceed 100% of the withdrawal.');
  if (v.account === 'roth-nonqualified' && v.rothEarnings > v.amount) errors.push('Taxable Roth earnings in this distribution cannot exceed the gross withdrawal.');
  if (!['traditional', 'roth-qualified', 'roth-nonqualified'].includes(v.account)) errors.push('Choose a supported account treatment.');
  if (![2025, 2026].includes(v.year) || !['single', 'joint', 'separate', 'head'].includes(v.status)) errors.push('Choose a supported tax year and filing status.');
  return errors;
}
export function calculateWithdrawal(v: WithdrawalInput) {
  const errors = validateWithdrawal(v); if (errors.length) throw new RangeError(errors.join(' '));
  const taxableWithdrawal = v.account === 'traditional' ? v.amount : v.account === 'roth-nonqualified' ? v.rothEarnings : 0;
  const federalTax = federalOrdinaryTax(v.otherTaxableIncome + taxableWithdrawal, v.year, v.status).tax - federalOrdinaryTax(v.otherTaxableIncome, v.year, v.status).tax;
  const stateTax = taxableWithdrawal * v.stateRate / 100;
  const additionalTax = v.age < 59.5 && !v.exception ? taxableWithdrawal * .1 : 0;
  const totalTax = federalTax + stateTax + additionalTax;
  const withholding = v.amount * (v.federalWithholdingRate + v.stateWithholdingRate) / 100;
  const futureValue = v.amount * (1 + v.growthRate / 100) ** v.growthYears;
  return { taxableWithdrawal, federalTax, stateTax, additionalTax, totalTax, netWithdrawal: v.amount - totalTax,
    withholding, immediateDeposit: v.amount - withholding, taxDueAfterWithholding: totalTax - withholding,
    futureValue, forgoneGrowth: futureValue - v.amount,
  };
}
