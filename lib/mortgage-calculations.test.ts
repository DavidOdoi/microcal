import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMortgage } from './mortgage-calculations.ts';

const example = { homePrice: 375000, downPayment: 75000, annualRate: 6, years: 30, annualTax: 3600, annualInsurance: 1200, monthlyPmi: 0, monthlyHoa: 0 };
test('mortgage example separates principal and interest from taxes and insurance', () => {
  const result = calculateMortgage(example);
  assert.equal(result.principal, 300000);
  assert.ok(Math.abs(result.monthlyPrincipalInterest - 1798.651575) < 0.001);
  assert.ok(Math.abs(result.monthlyTotal - 2198.651575) < 0.001);
  assert.ok(Math.abs(result.totalInterest - 347514.5675) < 0.01);
  assert.equal(result.schedule.length, 360);
  assert.equal(result.schedule.at(-1)?.balance, 0);
  const higherCosts = calculateMortgage({ ...example, annualTax: 6000, monthlyHoa: 150 });
  assert.equal(higherCosts.totalInterest, result.totalInterest);
  assert.ok(higherCosts.monthlyTotal > result.monthlyTotal);
});
test('mortgage zero interest and fully funded purchase stay finite', () => {
  const zero = calculateMortgage({ ...example, annualRate: 0 });
  assert.equal(zero.monthlyPrincipalInterest, 300000 / 360);
  assert.equal(zero.totalInterest, 0);
  const cash = calculateMortgage({ ...example, downPayment: 500000 });
  assert.equal(cash.principal, 0);
  assert.equal(cash.monthlyPrincipalInterest, 0);
  assert.equal(cash.monthlyTotal, 400);
  assert.ok(Number.isFinite(calculateMortgage({ ...example, annualRate: NaN, years: 0 }).monthlyTotal));
});
