import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMortgageExtra, mortgagePaymentDate, type MortgageExtraInput } from './mortgage-extra-calculations.ts';
const base: MortgageExtraInput = { balance: 200000, annualRate: 6, months: 360, regularPayment: null, extraMonthly: 200, lumpSum: 0, lumpMonth: 1, firstPaymentDate: '2027-01-31' };
const near = (a: number, b: number, tolerance=1e-6) => assert.ok(Math.abs(a-b)<tolerance, `${a} ~= ${b}`);
test('supplied mortgage example repays in 252 months and saves about $79,801', () => {
 const r=calculateMortgageExtra(base); near(r.payment,1199.1010503055); assert.equal(r.original.months,360); assert.equal(r.accelerated.months,252); assert.equal(r.monthsSaved,108); near(r.interestSaved,79801,1);
 assert.equal(r.original.payoffDate,'2056-12-31'); assert.equal(r.accelerated.payoffDate,'2047-12-31');
});
test('no extras preserves baseline; zero interest has no interest savings', () => {
 const r=calculateMortgageExtra({...base,extraMonthly:0}); assert.deepEqual(r.original,r.accelerated); assert.equal(r.monthsSaved,0); assert.equal(r.interestSaved,0);
 const zero=calculateMortgageExtra({...base,balance:12000,annualRate:0,months:12,extraMonthly:1000}); assert.equal(zero.payment,1000); assert.equal(zero.accelerated.months,6); assert.equal(zero.interestSaved,0);
});
test('final payment is capped and schedules conserve principal and interest', () => {
 for (const r of [calculateMortgageExtra(base),calculateMortgageExtra({...base,extraMonthly:1e9,lumpSum:1e9})]) {
  for (const plan of [r.original,r.accelerated]) { assert.equal(plan.rows.at(-1)!.balance,0); near(plan.rows.reduce((s,row)=>s+row.principal,0),base.balance); near(plan.rows.reduce((s,row)=>s+row.payment,0),plan.totalPayments); for (const row of plan.rows) { assert.ok(row.balance>=0); assert.ok(row.principal>=0); near(row.payment,row.interest+row.principal); } }
 }
 const full=calculateMortgageExtra({...base,extraMonthly:1e9}); assert.equal(full.accelerated.months,1); near(full.accelerated.rows[0].payment,201000);
});
test('one-time payments apply only on their selected month and earlier payments save more', () => {
 const early=calculateMortgageExtra({...base,extraMonthly:0,lumpSum:10000,lumpMonth:1}); const late=calculateMortgageExtra({...base,extraMonthly:0,lumpSum:10000,lumpMonth:24}); assert.ok(early.interestSaved>late.interestSaved); assert.equal(early.accelerated.lumpApplied,10000); assert.equal(late.accelerated.rows[23].lumpApplied,10000);
 const after=calculateMortgageExtra({...base,lumpSum:10000,lumpMonth:360}); assert.equal(after.accelerated.lumpApplied,0);
 const full=calculateMortgageExtra({...base,extraMonthly:0,lumpSum:1e9}); assert.equal(full.accelerated.months,1); near(full.accelerated.lumpApplied,201000-full.payment);
});
test('an entered regular payment determines payoff without a forced balloon at the entered term', () => {
 const r=calculateMortgageExtra({...base,regularPayment:2000,months:12,extraMonthly:0}); assert.ok(r.original.months>12); assert.ok(r.original.months<360); near(r.original.rows[0].payment,2000); assert.deepEqual(r.original,r.accelerated);
});
test('month-end dates clamp to the month length without drifting in later months', () => { assert.equal(mortgagePaymentDate('2028-01-31',1),'2028-02-29'); assert.equal(mortgagePaymentDate('2028-01-31',2),'2028-03-31'); });
test('very small and high-rate mortgages remain finite and fully repay', () => {
 for (const patch of [{annualRate:100,months:600},{annualRate:.000001},{balance:.01},{regularPayment:1e9}]) {
 const r=calculateMortgageExtra({...base,...patch}); assert.ok(Number.isFinite(r.interestSaved)); assert.equal(r.original.rows.at(-1)!.balance,0); assert.equal(r.accelerated.rows.at(-1)!.balance,0); assert.ok(r.accelerated.months<=r.original.months);
 }
});
test('negative inputs, invalid dates, non-amortizing and excessive-duration payments fail', () => {
 for (const patch of [{balance:-1},{annualRate:-1},{months:0},{months:12.5},{extraMonthly:NaN},{lumpMonth:0},{firstPaymentDate:'2026-02-30'},{regularPayment:1000},{regularPayment:1000.01}]) assert.throws(()=>calculateMortgageExtra({...base,...patch}),RangeError);
});
