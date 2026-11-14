import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHomeEquityLoan } from './home-equity-loan-calculations.ts';
const example = { homeValue: 400000, mortgageBalance: 250000, loanAmount: 30000, annualRate: 8, years: 15, fees: 0, maxCltv: 80 };
test('home equity loan matches the supplied equity, CLTV and payment examples', () => {
  const result = calculateHomeEquityLoan(example);
  assert.equal(result.equity, 150000);
  assert.equal(result.borrowingCapacity, 70000);
  assert.equal(result.combinedLtv, 70);
  const payment = 30000 * (.08 / 12) / (1 - Math.pow(1 + .08 / 12, -180));
  assert.ok(Math.abs(result.monthlyPayment - payment) < 1e-8);
  assert.equal(result.monthlyPayment.toFixed(2), '286.70');
  assert.equal(result.schedule.length, 180);
  assert.equal(result.schedule.at(-1)?.balance, 0);
  assert.equal(calculateHomeEquityLoan({ ...example, loanAmount: 50000 }).monthlyPayment.toFixed(2), '477.83');
});
test('an assumed borrowing limit warns without silently changing the requested loan', () => {
  const above = calculateHomeEquityLoan({ ...example, loanAmount: 80000 });
  assert.equal(above.exceedsAssumedLimit, true);
  assert.equal(above.loanAmount, 80000);
  assert.equal(above.combinedLtv, 82.5);
  const underwater = calculateHomeEquityLoan({ ...example, homeValue: 200000 });
  assert.equal(underwater.equity, -50000);
  assert.equal(underwater.borrowingCapacity, 0);
});
test('upfront fees affect total cash cost without changing the payment or equity', () => {
  const base = calculateHomeEquityLoan(example);
  const fees = calculateHomeEquityLoan({ ...example, fees: 1500 });
  assert.equal(fees.monthlyPayment, base.monthlyPayment);
  assert.equal(fees.totalCostWithFees, base.totalLoanPayments + 1500);
  assert.equal(fees.combinedLtv, base.combinedLtv);
  const zero = calculateHomeEquityLoan({ ...example, annualRate: 0 });
  assert.equal(zero.monthlyPayment, 30000 / 180);
  assert.equal(zero.totalInterest, 0);
  assert.equal(calculateHomeEquityLoan({ ...example, homeValue: 0 }).combinedLtv, null);
});
