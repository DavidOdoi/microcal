import test from 'node:test';
import assert from 'node:assert/strict';
import { federalOrdinaryTax } from './federal-tax.ts';
import { calculateWithdrawal, type WithdrawalInput } from './withdrawal-calculations.ts';
const example: WithdrawalInput = { amount: 20000, age: 40, year: 2026, status: 'single', otherTaxableIncome: 60000, account: 'traditional', rothEarnings: 4000, stateRate: 5, exception: false, federalWithholdingRate: 20, stateWithholdingRate: 0, growthRate: 6, growthYears: 20 };
test('progressive incremental tax reproduces the supplied withdrawal and growth example', () => {
  const r = calculateWithdrawal(example); assert.equal(r.federalTax, 4400); assert.equal(r.stateTax, 1000); assert.equal(r.additionalTax, 2000); assert.equal(r.netWithdrawal, 12600);
  assert.ok(Math.abs(r.futureValue - 64142.71) < .01);
  assert.equal(r.immediateDeposit, 16000); assert.equal(r.taxDueAfterWithholding, 3400);
});
test('crossing federal brackets taxes only each slice at its actual rate', () => {
  const r = calculateWithdrawal({ ...example, otherTaxableIncome: 50000 }); assert.equal(r.federalTax, 4360);
  assert.equal(federalOrdinaryTax(12400, 2026, 'single').tax, 1240);
  assert.equal(federalOrdinaryTax(0, 2025, 'joint').tax, 0);
});
test('age 59½ and a confirmed exception remove only the additional tax', () => {
  assert.equal(calculateWithdrawal({ ...example, age: 59.49 }).additionalTax, 2000);
  assert.equal(calculateWithdrawal({ ...example, age: 59.5 }).additionalTax, 0);
  const exempt = calculateWithdrawal({ ...example, exception: true }); assert.equal(exempt.additionalTax, 0); assert.equal(exempt.federalTax, 4400); assert.equal(exempt.netWithdrawal, 14600);
});
test('Roth distributions distinguish qualified funds from nonqualified taxable earnings', () => {
  const qualified = calculateWithdrawal({ ...example, account: 'roth-qualified' }); assert.equal(qualified.totalTax, 0); assert.equal(qualified.netWithdrawal, 20000);
  const nonqualified = calculateWithdrawal({ ...example, account: 'roth-nonqualified' }); assert.equal(nonqualified.taxableWithdrawal, 4000); assert.equal(nonqualified.federalTax, 880); assert.equal(nonqualified.additionalTax, 400); assert.equal(nonqualified.netWithdrawal, 18520);
});
test('withholding is never counted twice, and can produce a modeled refund', () => {
  const r = calculateWithdrawal({ ...example, federalWithholdingRate: 50 }); assert.equal(r.netWithdrawal, 12600); assert.equal(r.immediateDeposit, 10000); assert.equal(r.taxDueAfterWithholding, -2600);
  assert.equal(calculateWithdrawal({ ...example, amount: 0 }).netWithdrawal, 0);
  assert.notEqual(calculateWithdrawal({ ...example, otherTaxableIncome: 49000, year: 2025 }).federalTax, calculateWithdrawal({ ...example, otherTaxableIncome: 49000, year: 2026 }).federalTax);
});
test('invalid assumptions cannot produce a withdrawal estimate', () => {
  for (const change of [{ account: 'roth-nonqualified' as const, rothEarnings: 30000 }, { federalWithholdingRate: 95, stateWithholdingRate: 10 }, { year: 2027 }, { age: NaN }, { stateRate: -1 }]) assert.throws(() => calculateWithdrawal({ ...example, ...change } as WithdrawalInput), RangeError);
});
