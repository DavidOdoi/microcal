import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDentalLoan, validateDentalLoan, type DentalLoanInput } from './dental-loan-calculations.ts';

const defaults: DentalLoanInput = { treatmentCost: 6000, insurance: 1000, downPayment: 500, annualRate: 10, termMonths: 36, fee: 0, financeFee: false, extraPayment: 0 };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 0.01, `${actual} ≈ ${expected}`);

test('dental payment matches an independently calculated fixed-rate example', () => {
  const result = calculateDentalLoan(defaults);
  near(result.principal, 4500);
  near(result.monthlyPayment, 145.20);
  near(result.totalInterest, 727.28);
  near(result.totalOutOfPocket, 5727.28);
  assert.equal(result.months, 36);
  assert.equal(result.schedule.at(-1)?.balance, 0);
  near(result.schedule.reduce((sum, row) => sum + row.principal, 0), 4500);
});

test('zero interest, tiny interest, and single-month terms remain stable', () => {
  const zero = calculateDentalLoan({ ...defaults, annualRate: 0 });
  assert.equal(zero.monthlyPayment, 125);
  assert.equal(zero.totalInterest, 0);
  near(calculateDentalLoan({ ...defaults, annualRate: 1e-12 }).monthlyPayment, 125);
  near(calculateDentalLoan({ ...defaults, termMonths: 1 }).monthlyPayment, 4537.50);
});

test('financed fees enter principal; upfront fees do not accrue interest', () => {
  const upfront = calculateDentalLoan({ ...defaults, fee: 200 });
  const financed = calculateDentalLoan({ ...defaults, fee: 200, financeFee: true });
  assert.equal(upfront.principal, 4500);
  assert.equal(upfront.upfrontCost, 700);
  assert.equal(financed.principal, 4700);
  assert.equal(financed.upfrontCost, 500);
  assert.ok(financed.totalInterest > upfront.totalInterest);
  near(financed.totalOutOfPocket, 5000 + 200 + financed.totalInterest);
});

test('extra payments shorten payoff, save interest, and cap the final payment', () => {
  const normal = calculateDentalLoan(defaults);
  const extra = calculateDentalLoan({ ...defaults, extraPayment: 100 });
  assert.ok(extra.months < normal.months);
  assert.ok(extra.interestSaved > 0);
  assert.equal(extra.monthsSaved, 36 - extra.months);
  assert.ok(extra.schedule.at(-1)!.payment <= extra.plannedPayment);
  const immediate = calculateDentalLoan({ ...defaults, extraPayment: 10000 });
  assert.equal(immediate.months, 1);
  near(immediate.totalLoanPayments, 4537.50);
});

test('fully covered treatment requires no loan or loan fee', () => {
  const result = calculateDentalLoan({ ...defaults, insurance: 5500, fee: 200, financeFee: true, extraPayment: 100 });
  assert.equal(result.monthlyPayment, 0);
  assert.equal(result.plannedPayment, 0);
  assert.equal(result.fee, 0);
  assert.equal(result.totalOutOfPocket, 500);
  assert.deepEqual(result.schedule, []);
});

test('invalid or excessive inputs cannot enter the calculation', () => {
  for (const change of [{ insurance: 6000 }, { downPayment: -1 }, { termMonths: 0 }, { termMonths: 1.5 }, { termMonths: 361 }, { annualRate: Infinity }, { fee: NaN }, { extraPayment: 1e10 }]) {
    assert.ok(validateDentalLoan({ ...defaults, ...change }).length);
    assert.throws(() => calculateDentalLoan({ ...defaults, ...change }), RangeError);
  }
});
