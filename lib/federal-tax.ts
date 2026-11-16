export type TaxYear = 2025 | 2026;
export type FilingStatus = 'single' | 'joint' | 'separate' | 'head';
export const standardDeductions: Record<TaxYear, Record<FilingStatus, number>> = {
  2025: { single: 15750, joint: 31500, separate: 15750, head: 23625 },
  2026: { single: 16100, joint: 32200, separate: 16100, head: 24150 },
};
// Ordinary-income brackets, IRS Rev. Proc. 2024-40 / 2025-32.
// 2025 standard deductions reflect the subsequent statutory increase.
const thresholds: Record<TaxYear, Record<FilingStatus, number[]>> = {
  2025: {
    single: [11925, 48475, 103350, 197300, 250525, 626350],
    joint: [23850, 96950, 206700, 394600, 501050, 751600],
    separate: [11925, 48475, 103350, 197300, 250525, 375800],
    head: [17000, 64850, 103350, 197300, 250500, 626350],
  },
  2026: {
    single: [12400, 50400, 105700, 201775, 256225, 640600],
    joint: [24800, 100800, 211400, 403550, 512450, 768700],
    separate: [12400, 50400, 105700, 201775, 256225, 384350],
    head: [17700, 67450, 105700, 201750, 256200, 640600],
  },
};
export function federalOrdinaryTax(taxableIncome: number, year: TaxYear, status: FilingStatus) {
  if (!Number.isFinite(taxableIncome) || taxableIncome < 0 || taxableIncome > 2e9 || !Object.hasOwn(thresholds, year) || !Object.hasOwn(thresholds[year], status)) throw new RangeError('Use a supported tax year, filing status, and nonnegative taxable income.');
  const rates = [.1, .12, .22, .24, .32, .35, .37];
  let lower = 0;
  const rows = [...thresholds[year][status], Infinity].map((upper, index) => {
    const amount = Math.max(0, Math.min(taxableIncome, upper) - lower);
    const row = { lower, upper, rate: rates[index], taxable: amount, tax: amount * rates[index] };
    lower = upper; return row;
  });
  const marginalRate = taxableIncome === 0 ? 0 : rows.find((row) => taxableIncome < row.upper)!.rate;
  return { tax: rows.reduce((sum, row) => sum + row.tax, 0), marginalRate, rows };
}
