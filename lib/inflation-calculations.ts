import { usCpiAnnual } from './us-cpi-data.ts';
export const inflationYears = Object.keys(usCpiAnnual).map(Number).sort((a, b) => a - b);

export function inflationFromIndexes(amount: number, startingCpi: number, endingCpi: number) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e12) throw new RangeError('Dollar amount must be from $0 to $1 trillion.');
  if (![startingCpi, endingCpi].every((cpi) => Number.isFinite(cpi) && cpi > 0)) throw new RangeError('CPI observations must be finite and above zero.');
  const ratio = endingCpi / startingCpi;
  return { adjustedAmount: amount * ratio, cumulativeInflationPercent: (ratio - 1) * 100, dollarChange: amount * (ratio - 1), unchangedAmountPurchasingPower: amount / ratio, purchasingPowerChangePercent: (1 / ratio - 1) * 100 };
}
export function calculateInflation(amount: number, startYear: number, endYear: number) {
  if (![startYear, endYear].every((year) => Number.isInteger(year) && Object.hasOwn(usCpiAnnual, year))) throw new RangeError('Choose published annual-average years from 1913 through 2025.');
  const startingCpi = usCpiAnnual[startYear], endingCpi = usCpiAnnual[endYear];
  return { ...inflationFromIndexes(amount, startingCpi, endingCpi), startYear, endYear, startingCpi, endingCpi };
}
