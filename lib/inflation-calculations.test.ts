import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateInflation, inflationFromIndexes, inflationYears } from './inflation-calculations.ts';
import { usCpiAnnual } from './us-cpi-data.ts';
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
test('supplied hypothetical acceptance examples are isolated from the historical dataset', () => {
  const inflation = inflationFromIndexes(1000, 120, 180); assert.equal(inflation.adjustedAmount, 1500); assert.equal(inflation.cumulativeInflationPercent, 50); near(inflation.purchasingPowerChangePercent, -33.333333);
  const deflation = inflationFromIndexes(1000, 200, 180); assert.equal(deflation.adjustedAmount, 900); near(deflation.cumulativeInflationPercent, -10);
  assert.equal(inflationFromIndexes(1000, 150, 150).adjustedAmount, 1000);
});
test('the data snapshot contains only contiguous published annual-average CPI-U observations', () => {
  assert.equal(inflationYears.length, 113); assert.equal(inflationYears[0], 1913); assert.equal(inflationYears.at(-1), 2025);
  assert.ok(inflationYears.every((year, index) => year === 1913 + index && usCpiAnnual[year] > 0));
  assert.equal(usCpiAnnual[1913], 9.9); assert.equal(usCpiAnnual[2000], 172.2); assert.equal(usCpiAnnual[2024], 313.689); assert.equal(usCpiAnnual[2025], 321.943);
});
test('historical year conversion uses the selected real observations', () => {
  const r = calculateInflation(10000, 2000, 2025); near(r.adjustedAmount, 18695.88); near(r.cumulativeInflationPercent, 86.9587688734);
  near(calculateInflation(r.adjustedAmount, 2025, 2000).adjustedAmount, 10000);
  near(r.unchangedAmountPurchasingPower, 10000 * 172.2 / 321.943);
});
test('same-year, zero amounts, reverse years and an actual deflation period remain valid', () => {
  assert.equal(calculateInflation(1000, 2025, 2025).adjustedAmount, 1000);
  assert.equal(calculateInflation(0, 1913, 2025).adjustedAmount, 0);
  assert.ok(calculateInflation(1000, 2025, 2000).cumulativeInflationPercent < 0);
  assert.ok(calculateInflation(1000, 2008, 2009).cumulativeInflationPercent < 0);
});
test('invalid indexes, missing years and incomplete-year data cannot enter production comparisons', () => {
  for (const [amount, start, end] of [[-1, 120, 180], [NaN, 120, 180], [1000, 0, 180], [1000, 120, Infinity]]) assert.throws(() => inflationFromIndexes(amount, start, end), RangeError);
  for (const year of [1912, 2026, 2025.5, NaN]) assert.throws(() => calculateInflation(1000, year, 2025), RangeError);
});
