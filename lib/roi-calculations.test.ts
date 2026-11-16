import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi, roiHoldingYears, type RoiInput } from './roi-calculations.ts';
const example: RoiInput = { investment: 4000, finalValue: 5000, additionalCosts: 0, annualization: 'none', years: 2, startDate: '', endDate: '', cashFlows: 'single' };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} ≈ ${expected}`);
test('supplied profit, loss and break-even examples use net gain over total cost', () => {
  const profit = calculateRoi(example); assert.equal(profit.netGain, 1000); assert.equal(profit.roiPercent, 25);
  const loss = calculateRoi({ ...example, finalValue: 3000 }); assert.equal(loss.netGain, -1000); assert.equal(loss.roiPercent, -25);
  assert.equal(calculateRoi({ ...example, finalValue: 4000 }).roiPercent, 0);
});
test('the supplied two-year annualization is compounded rather than total ROI divided by two', () => {
  const r = calculateRoi({ ...example, investment: 10000, finalValue: 12100, annualization: 'years' });
  near(r.roiPercent, 21); near(r.annualizedPercent!, 10);
});
test('additional costs enter ROI and the single-upfront-outlay annualization exactly once', () => {
  const r = calculateRoi({ ...example, additionalCosts: 1000, annualization: 'years' });
  assert.equal(r.totalCost, 5000); assert.equal(r.netGain, 0); assert.equal(r.roiPercent, 0); assert.equal(r.annualizedPercent, 0);
});
test('date-based annualization uses elapsed UTC days and explicitly defined 365.25-day years', () => {
  assert.equal(roiHoldingYears('2023-01-01', '2025-01-01'), 731 / 365.25);
  const r = calculateRoi({ ...example, annualization: 'dates', startDate: '2023-01-01', endDate: '2025-01-01' });
  near(r.years!, 731 / 365.25); near(r.annualizedPercent!, (1.25 ** (365.25 / 731) - 1) * 100);
});
test('complex flows, zero ending value and numerical overflow never receive a misleading CAGR', () => {
  assert.equal(calculateRoi({ ...example, annualization: 'years', cashFlows: 'multiple' }).annualizedPercent, null);
  const zero = calculateRoi({ ...example, finalValue: 0, annualization: 'years' }); assert.equal(zero.roiPercent, -100); assert.equal(zero.annualizedPercent, null);
  assert.equal(calculateRoi({ ...example, investment: .01, finalValue: 1e12, annualization: 'years', years: .001 }).annualizedPercent, null);
});
test('zero cost, invalid dates, reversed dates and nonpositive periods are rejected', () => {
  for (const invalid of [{ investment: 0 }, { finalValue: NaN }, { additionalCosts: -1 }, { annualization: 'years', years: 0 }, { annualization: 'dates', startDate: '2025-02-30', endDate: '2025-03-01' }, { annualization: 'dates', startDate: '', endDate: '' }, { annualization: 'dates', startDate: '2025-01-02', endDate: '2025-01-01' }, { annualization: 'dates', startDate: '2025-01-01', endDate: '2025-01-01' }]) assert.throws(() => calculateRoi({ ...example, ...invalid } as RoiInput), RangeError);
});
