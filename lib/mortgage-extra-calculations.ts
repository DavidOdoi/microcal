import { calculateScheduledLoan } from './loan-calculations.ts';
export type MortgageExtraInput = { balance: number; annualRate: number; months: number; regularPayment: number | null; extraMonthly: number; lumpSum: number; lumpMonth: number; firstPaymentDate: string };
export function mortgagePaymentDate(first: string, offset: number): string {
 const date = new Date(`${first}T00:00:00Z`);
 const month = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
 const lastDay = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth()+1, 0)).getUTCDate();
 month.setUTCDate(Math.min(date.getUTCDate(), lastDay)); return month.toISOString().slice(0,10);
}
export function validateMortgageExtra(v: MortgageExtraInput): string[] {
 const errors: string[] = [];
 if (!Number.isFinite(v.balance) || v.balance <= 0 || v.balance > 1e9) errors.push('Mortgage balance must be above zero and at most $1 billion.');
 if (!Number.isFinite(v.annualRate) || v.annualRate < 0 || v.annualRate > 100) errors.push('Annual rate must be from 0% to 100%.');
 if (!Number.isInteger(v.months) || v.months < 1 || v.months > 600) errors.push('Remaining term must be 1 to 600 whole months.');
 for (const [key, n] of [['Extra monthly payment', v.extraMonthly], ['Lump-sum payment', v.lumpSum]] as const) if (!Number.isFinite(n) || n < 0 || n > 1e9) errors.push(`${key} must be from zero to $1 billion.`);
 if (!Number.isInteger(v.lumpMonth) || v.lumpMonth < 1 || v.lumpMonth > 600) errors.push('Lump-sum month must be a whole number from 1 to 600.');
 const parsed = new Date(`${v.firstPaymentDate}T00:00:00Z`);
 if (!/^\d{4}-\d{2}-\d{2}$/.test(v.firstPaymentDate) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== v.firstPaymentDate || +v.firstPaymentDate.slice(0,4) < 1900 || +v.firstPaymentDate.slice(0,4) > 2100) errors.push('Enter a valid first-payment date between 1900 and 2100.');
 if (v.regularPayment !== null) {
  const payment = v.regularPayment, rate = v.annualRate / 1200;
  if (!Number.isFinite(payment) || payment <= 0 || payment > 1e9 || payment <= v.balance * rate) errors.push('Regular payment must exceed monthly interest and be at most $1 billion.');
  else {
   const count = rate === 0 ? v.balance / payment : -Math.log1p(-v.balance * rate / payment) / Math.log1p(rate);
   if (count > 600 + 1e-8) errors.push('The entered regular payment must repay the mortgage within 600 months. Increase it or leave it blank to derive it from the term.');
  }
 }
 return errors;
}
export type MortgageExtraRow = { month: number; date: string; payment: number; interest: number; principal: number; balance: number; lumpApplied: number };
export function calculateMortgageExtra(v: MortgageExtraInput) {
 const errors = validateMortgageExtra(v); if (errors.length) throw new RangeError(errors.join(' '));
 const rate = v.annualRate / 1200, growth = Math.log1p(rate);
 const derived = calculateScheduledLoan({ amount: v.balance, annualRate: v.annualRate, term: v.months, termUnit: 'months', paymentsPerYear: 12, fee: 0, feeTreatment: 'upfront', extraPayment: 0 });
 const payment = v.regularPayment ?? derived.payment;
 const exactMonths = v.regularPayment === null ? v.months : rate === 0 ? v.balance / payment : -Math.log1p(-v.balance * rate / payment) / growth;
 const count = Math.max(1, Math.ceil(exactMonths - 1e-8));
 function amortize(extra: number, lump: number) {
  let balance = v.balance;
  const rows: MortgageExtraRow[] = [];
  for (let month = 1; month <= count && balance > 0; month++) {
   const start = balance, interest = start * rate;
   // Stable remaining-balance formula avoids cancellation between large accumulated principal and payments.
   const baseBalance = month === count || month >= exactMonths ? 0 : rate === 0 ? v.balance * (1 - month / exactMonths) : v.balance * -Math.expm1((month - exactMonths) * growth) / -Math.expm1(-exactMonths * growth);
   const recurringReduction = rate === 0 ? extra * month : extra * Math.expm1(month * growth) / rate;
   const lumpReduction = month < v.lumpMonth ? 0 : lump * Math.exp((month - v.lumpMonth) * growth);
   balance = Math.max(0, baseBalance - recurringReduction - lumpReduction);
   const principal = start - balance;
   const lumpApplied = month === v.lumpMonth ? Math.min(lump, Math.max(0, start + interest - payment - extra)) : 0;
   rows.push({ month, date: mortgagePaymentDate(v.firstPaymentDate, month - 1), payment: principal + interest, interest, principal, balance, lumpApplied });
  }
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  return { rows, months: rows.length, totalInterest, totalPayments: v.balance + totalInterest, payoffDate: rows.at(-1)!.date, lumpApplied: rows.reduce((sum,row) => sum + row.lumpApplied, 0) };
 }
 const original = amortize(0, 0), accelerated = amortize(v.extraMonthly, v.lumpSum);
 return { payment, original, accelerated, interestSaved: Math.max(0, original.totalInterest - accelerated.totalInterest), monthsSaved: original.months - accelerated.months };
}
