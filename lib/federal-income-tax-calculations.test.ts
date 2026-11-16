import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFederalIncomeTax, type FederalIncomeTaxInput } from './federal-income-tax-calculations.ts';
import { federalOrdinaryTax } from './federal-tax.ts';
const example: FederalIncomeTaxInput = { year: 2026, status: 'single', income: 75000, adjustments: 0, deductionMode: 'standard', itemized: 0, nonrefundableCredits: 0, refundableCredits: 0, withholding: 0 };
test('matches the supplied $75,000 example and corrects the $50,000 FAQ', () => {
  const r = calculateFederalIncomeTax(example); assert.equal(r.deduction, 16100); assert.equal(r.taxableIncome, 58900); assert.equal(r.tax, 7670); assert.equal(r.marginalRate, 22); assert.equal(r.effectiveRate.toFixed(2), '10.23');
  assert.deepEqual(r.rows.filter((r) => r.tax > 0).map((r) => r.tax), [1240, 4560, 1870]);
  assert.equal(calculateFederalIncomeTax({ ...example, income: 50000 }).tax, 3820);
});
test('2025 and all filing statuses retain separate brackets and deductions', () => {
  assert.equal(calculateFederalIncomeTax({ ...example, year: 2025 }).tax, 7949);
  assert.equal(calculateFederalIncomeTax({ ...example, status: 'joint' }).tax, 4640);
  assert.equal(calculateFederalIncomeTax({ ...example, status: 'head' }).deduction, 24150);
  assert.equal(calculateFederalIncomeTax({ ...example, status: 'separate' }).deduction, 16100);
  assert.notEqual(federalOrdinaryTax(500000, 2026, 'single').tax, federalOrdinaryTax(500000, 2026, 'separate').tax);
});
test('standard and itemized deductions are alternatives; adjustments reduce AGI once', () => {
  const r = calculateFederalIncomeTax({ ...example, adjustments: 5000, deductionMode: 'itemized', itemized: 20000 });
  assert.equal(r.agi, 70000); assert.equal(r.taxableIncome, 50000); assert.equal(r.tax, 5752);
  assert.equal(calculateFederalIncomeTax({ ...example, itemized: 1000000 }).tax, 7670);
});
test('nonrefundable credits stop at zero while refundable credits affect the refund estimate', () => {
  const r = calculateFederalIncomeTax({ ...example, nonrefundableCredits: 10000, refundableCredits: 2000, withholding: 1000 });
  assert.equal(r.nonrefundableApplied, 7670); assert.equal(r.tax, 0); assert.equal(r.refundOrBalance, 3000);
  assert.equal(calculateFederalIncomeTax({ ...example, withholding: 8000 }).refundOrBalance, 330);
  assert.equal(calculateFederalIncomeTax({ ...example, income: 0 }).tax, 0);
});
test('brackets are continuous and marginal rate refers to the next dollar', () => {
  assert.equal(federalOrdinaryTax(12400, 2026, 'single').marginalRate, .12);
  assert.ok(Math.abs(federalOrdinaryTax(12401, 2026, 'single').tax - 1240.12) < 1e-8);
  assert.equal(federalOrdinaryTax(0, 2026, 'single').marginalRate, 0);
});
test('invalid tax assumptions are rejected', () => {
  for (const change of [{ income: -1 }, { adjustments: 80000 }, { nonrefundableCredits: NaN }, { year: 2027 }]) assert.throws(() => calculateFederalIncomeTax({ ...example, ...change } as FederalIncomeTaxInput), RangeError);
});
