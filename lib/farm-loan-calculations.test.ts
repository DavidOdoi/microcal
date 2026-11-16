import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFarmLoan, type FarmLoanInput } from './farm-loan-calculations.ts';
import { calculateLoan } from './loan-calculations.ts';
const example: FarmLoanInput = { purchaseCost: 50000, downPayment: 0, annualRate: 8, term: 5, termUnit: 'years', frequency: 12, fee: 0, feeTreatment: 'upfront', extraPayment: 0, annualRevenue: 80000, annualOperatingExpenses: 55000 };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
test('matches the farm article loan, FAQ, and affordability examples', () => {
  const r = calculateFarmLoan(example); near(r.payment, 1013.82); near(r.totalInterest, 10829.18); near(r.totalRepayment, 60829.18); near(r.annualDebtService, 12165.84); near(r.annualCashAfterScheduledDebt, 12834.16);
  near(calculateFarmLoan({ ...example, purchaseCost: 100000, term: 10 }).payment, 1213.28);
});
test('quarterly and annual loans use the selected periodic rate and payment count', () => {
  for (const frequency of [1, 4, 12] as const) {
    const r = calculateFarmLoan({ ...example, frequency });
    const rate = .08 / frequency, count = 5 * frequency;
    near(r.payment, 50000 * rate / (1 - (1 + rate) ** -count)); assert.equal(r.schedule.length, count);
    near(r.schedule[0].interest, 50000 * rate); near(r.schedule.reduce((sum, row) => sum + row.principal, 0), 50000); assert.equal(r.schedule.at(-1)!.balance, 0);
  }
});
test('months and years are equivalent, with zero interest supported for every frequency', () => {
  assert.deepEqual(calculateFarmLoan({ ...example, term: 60, termUnit: 'months' }), calculateFarmLoan(example));
  for (const frequency of [1, 4, 12] as const) {
    const r = calculateFarmLoan({ ...example, annualRate: 0, frequency }); near(r.payment, 50000 / (5 * frequency)); assert.equal(r.totalInterest, 0); near(r.totalRepayment, 50000);
  }
});
test('down payments and fees are counted once and fully covered purchases need no loan', () => {
  const r = calculateFarmLoan({ ...example, downPayment: 10000, fee: 500, feeTreatment: 'financed' });
  assert.equal(r.financedPurchase, 40000); assert.equal(r.principal, 40500); near(r.totalOutlay, 50000 + 500 + r.totalInterest);
  const upfront = calculateFarmLoan({ ...example, fee: 500 }); near(upfront.payment, calculateFarmLoan(example).payment); near(upfront.totalRepayment, 50000 + 500 + upfront.totalInterest);
  const covered = calculateFarmLoan({ ...example, downPayment: 50000, fee: 500 }); assert.equal(covered.payment, 0); assert.equal(covered.loanFee, 0); assert.equal(covered.totalOutlay, 50000); assert.deepEqual(covered.schedule, []);
});
test('extra principal shortens payoff and caps the last payment for all supported frequencies', () => {
  for (const frequency of [1, 4, 12] as const) {
    const r = calculateFarmLoan({ ...example, frequency, extraPayment: 5000 }); assert.ok(r.paymentsSaved > 0); assert.ok(r.interestSaved > 0); assert.ok(r.schedule.at(-1)!.payment <= r.plannedPayment + 1e-7); near(r.totalRepayment, 50000 + r.totalInterest);
  }
});
test('invalid inputs and partial quarterly or annual periods are rejected', () => {
  for (const invalid of [{ downPayment: 60000 }, { frequency: 4, term: 5, termUnit: 'months' }, { frequency: 1, term: 1.5 }, { annualRate: -1 }, { term: 0 }, { annualRevenue: NaN }, { frequency: 26 }]) assert.throws(() => calculateFarmLoan({ ...example, ...invalid } as FarmLoanInput), RangeError);
});
test('monthly shared-engine output stays identical to the existing general loan API', () => {
  const farm = calculateFarmLoan(example);
  const general = calculateLoan({ amount: 50000, annualRate: 8, term: 5, termUnit: 'years', paymentsPerYear: 12, fee: 0, feeTreatment: 'upfront', extraPayment: 0 });
  assert.equal(farm.payment, general.payment); assert.equal(farm.totalInterest, general.totalInterest); assert.deepEqual(farm.schedule, general.schedule);
});
test('long annual schedules do not amplify floating-point error into the final payment', () => {
  const r = calculateFarmLoan({ ...example, purchaseCost: 1e9, annualRate: 100, term: 50, frequency: 1 });
  near(r.totalRepayment, 1e9 / (1 - 2 ** -50) * 50);
  near(r.schedule.reduce((sum, row) => sum + row.principal, 0), 1e9);
  near(r.schedule.at(-1)!.payment, r.payment);
});
test('short operating loans count only payments actually due in the first year', () => {
  for (const frequency of [4, 12] as const) {
    const r = calculateFarmLoan({ ...example, frequency, term: 6, termUnit: 'months' });
    near(r.annualDebtService, r.totalPayments);
    near(r.annualCashAfterScheduledDebt, 25000 - r.totalPayments);
  }
});
