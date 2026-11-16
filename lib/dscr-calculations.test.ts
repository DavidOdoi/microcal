import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDscr, type DscrInput } from './dscr-calculations.ts';
const example: DscrInput = { annualRent: 96000, vacancyPercent: 5, otherIncome: 0, operatingExpenses: 19200, debtMode: 'direct', annualDebtService: 60000, loanAmount: 500000, annualRate: 7, years: 30, requiredDscr: 1.25 };
test('reproduces the supplied NOI, DSCR, cash flow, and maximum debt-service examples', () => {
  const r = calculateDscr(example);
  assert.equal(r.vacancyLoss, 4800); assert.equal(r.noi, 72000); assert.equal(r.dscr, 1.2);
  assert.equal(r.cashFlowAfterDebt, 12000); assert.equal(r.maximumAnnualDebtService, 57600); assert.equal(r.maximumMonthlyDebtService, 4800);
});
test('loan mode uses principal and interest once and inverts the payment formula', () => {
  const r = calculateDscr({ ...example, debtMode: 'loan' });
  assert.ok(Math.abs(r.monthlyLoanPayment - 3326.51) < .01);
  assert.ok(Math.abs(r.dscr! - 72000 / (r.monthlyLoanPayment * 12)) < 1e-10);
  const supported = calculateDscr({ ...example, debtMode: 'loan', loanAmount: r.supportableLoan });
  assert.ok(Math.abs(supported.dscr! - 1.25) < 1e-10);
});
test('negative NOI stays negative; absent debt produces an undefined ratio', () => {
  const loss = calculateDscr({ ...example, operatingExpenses: 100000 });
  assert.ok(loss.dscr! < 0); assert.equal(loss.supportableLoan, 0);
  assert.equal(calculateDscr({ ...example, annualDebtService: 0 }).dscr, null);
  assert.equal(calculateDscr({ ...example, debtMode: 'loan', loanAmount: 0 }).dscr, null);
});
test('zero rate, other income, and total vacancy are modeled consistently', () => {
  const r = calculateDscr({ ...example, annualRate: 0, otherIncome: 1200, vacancyPercent: 100 });
  assert.equal(r.effectiveIncome, 1200); assert.equal(r.noi, -18000);
  assert.equal(calculateDscr({ ...example, annualRate: 0, debtMode: 'loan' }).monthlyLoanPayment, 500000 / 360);
});
test('invalid inputs cannot create misleading ratios', () => {
  for (const change of [{ vacancyPercent: 101 }, { requiredDscr: 0 }, { operatingExpenses: NaN }, { annualRate: -1 }, { years: 0 }]) assert.throws(() => calculateDscr({ ...example, ...change }), RangeError);
});
