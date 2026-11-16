import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLoan, validateLoan, type LoanInput } from './loan-calculations.ts';

const defaults: LoanInput = { amount: 25000, annualRate: 9, term: 5, termUnit: 'years', paymentsPerYear: 12, fee: 0, feeTreatment: 'upfront', extraPayment: 0 };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);

test('matches all supplied article examples using unrounded payments', () => {
  for (const [term, payment, interest] of [[3, 794.99, 3619.76], [5, 518.96, 6137.53], [7, 402.23, 8787.06]]) {
    const result = calculateLoan({ ...defaults, term });
    near(result.payment, payment);
    near(result.totalInterest, interest);
    near(result.totalRepayment, 25000 + interest);
    near(result.payment * term * 12, result.totalRepayment);
  }
  near(calculateLoan({ ...defaults, amount: 10000, annualRate: 10, term: 3 }).payment, 322.67);
});

test('months and years give identical schedules', () => {
  assert.deepEqual(calculateLoan({ ...defaults, term: 60, termUnit: 'months' }), calculateLoan(defaults));
});

test('zero and very small interest rates remain stable for each frequency', () => {
  for (const paymentsPerYear of [12, 26, 52] as const) {
    const result = calculateLoan({ ...defaults, paymentsPerYear, annualRate: 0 });
    near(result.payment, 25000 / (5 * paymentsPerYear));
    assert.equal(result.totalInterest, 0);
    near(result.totalRepayment, 25000);
    near(calculateLoan({ ...defaults, paymentsPerYear, annualRate: 1e-12 }).payment, result.payment);
  }
});

test('biweekly and weekly schedules use the nominal annual rate divided by frequency', () => {
  for (const paymentsPerYear of [26, 52] as const) {
    const result = calculateLoan({ ...defaults, paymentsPerYear });
    const rate = .09 / paymentsPerYear;
    const count = 5 * paymentsPerYear;
    near(result.payment, 25000 * rate / (1 - (1 + rate) ** -count));
    assert.equal(result.schedule.length, count);
    near(result.schedule[0].interest, 25000 * rate);
    assert.equal(result.schedule.at(-1)!.balance, 0);
  }
});

test('partial payment periods round up with a visible flag', () => {
  const result = calculateLoan({ ...defaults, term: 1, termUnit: 'months', paymentsPerYear: 26 });
  assert.equal(result.paymentCount, 3);
  assert.equal(result.roundedTerm, true);
  assert.equal(calculateLoan(defaults).roundedTerm, false);
});

test('fee treatment includes fees exactly once in total repayment', () => {
  for (const feeTreatment of ['upfront', 'financed'] as const) {
    const result = calculateLoan({ ...defaults, fee: 500, feeTreatment });
    assert.equal(result.principal, feeTreatment === 'financed' ? 25500 : 25000);
    near(result.totalRepayment, 25000 + 500 + result.totalInterest);
  }
  const upfront = calculateLoan({ ...defaults, fee: 500 });
  near(upfront.payment, calculateLoan(defaults).payment);
  assert.ok(calculateLoan({ ...defaults, fee: 500, feeTreatment: 'financed' }).totalInterest > upfront.totalInterest);
});

test('extra principal reduces interest and payments; final payment is capped', () => {
  const result = calculateLoan({ ...defaults, extraPayment: 100 });
  assert.ok(result.interestSaved > 0);
  assert.ok(result.paymentsSaved > 0);
  assert.equal(result.paymentsSaved, 60 - result.actualPaymentCount);
  assert.ok(result.schedule.at(-1)!.payment <= result.plannedPayment + 1e-8);
  near(result.schedule.reduce((sum, row) => sum + row.principal, 0), result.principal);
  near(result.totalRepayment, result.principal + result.totalInterest);
  const single = calculateLoan({ ...defaults, extraPayment: 1e9 });
  assert.equal(single.actualPaymentCount, 1);
  near(single.totalRepayment, 25187.50);
});

test('one payment and maximum supported terms produce finite paid-off schedules', () => {
  near(calculateLoan({ ...defaults, term: 1, termUnit: 'months' }).payment, 25187.50);
  const maximum = calculateLoan({ ...defaults, amount: 1e9, annualRate: 100, term: 50, paymentsPerYear: 52, fee: 1e9, feeTreatment: 'financed' });
  assert.ok(Number.isFinite(maximum.totalRepayment));
  assert.equal(maximum.schedule.at(-1)!.balance, 0);
  assert.equal(maximum.schedule.length, 2600);
});

test('invalid inputs never enter the calculation', () => {
  for (const invalid of [{ amount: 0 }, { amount: -1 }, { amount: NaN }, { annualRate: 101 }, { term: 0 }, { term: 51 }, { fee: Infinity }, { extraPayment: -1 }]) {
    assert.ok(validateLoan({ ...defaults, ...invalid }).length);
    assert.throws(() => calculateLoan({ ...defaults, ...invalid }), RangeError);
  }
  assert.throws(() => calculateLoan({ ...defaults, paymentsPerYear: 13 } as unknown as LoanInput), RangeError);
});
