import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSelfEmployment, type SelfEmploymentInput } from './self-employment-calculations.ts';
const base: SelfEmploymentInput = { year: 2026, status: 'single', revenue: 60000, expenses: 10000, wages: 0, socialSecurityWages: 0, otherIncome: 0, adjustments: 0, qbiDeduction: 0, credits: 0, payments: 0 };
const near = (a: number, b: number) => assert.ok(Math.abs(a-b) < 1e-7, `${a} ~= ${b}`);
test('supplied sole-proprietor example separates SE tax from progressive income tax', () => {
 const r = calculateSelfEmployment(base); assert.equal(r.profit, 50000); assert.equal(r.earnings, 46175); near(r.selfEmploymentTax, 7064.775); near(r.halfDeduction, 3532.3875); near(r.taxableIncome, 30367.6125); near(r.incomeTax, 3396.1135); near(r.totalTax, 10460.8885);
});
test('W-2 cap interaction is year-specific and does not add wage income twice', () => {
 const capped = calculateSelfEmployment({...base, wages: 184500, socialSecurityWages: 184500}); assert.equal(capped.socialSecurityTax, 0); near(capped.medicareTax, 1339.075);
 near(calculateSelfEmployment({...base, socialSecurityWages: 180000}).socialSecurityTax, 4500*.124);
 assert.equal(calculateSelfEmployment({...base, year: 2025, socialSecurityWages: 176100}).socialSecurityTax, 0);
});
test('Schedule SE $400 net-earnings boundary and zero-profit case', () => {
 assert.equal(calculateSelfEmployment({...base, revenue: 0, expenses: 0}).totalTax, 0);
 assert.equal(calculateSelfEmployment({...base, revenue: 400, expenses: 0}).selfEmploymentTax, 0);
 assert.ok(calculateSelfEmployment({...base, revenue: 434, expenses: 0}).selfEmploymentTax > 0);
});
test('Additional Medicare uses filing thresholds and is excluded from half deduction', () => {
 for (const [status, threshold] of [['single',200000],['head',200000],['joint',250000],['separate',125000]] as const) {
  const r = calculateSelfEmployment({...base, status, wages: threshold, socialSecurityWages: 184500}); near(r.additionalMedicare, 46175*.009); near(r.halfDeduction, r.selfEmploymentTax/2);
 }
});
test('entered QBI, AGI adjustments, nonrefundable credits and payments are distinct', () => {
 const r = calculateSelfEmployment({...base, adjustments: 1000, qbiDeduction: 5000, credits: 1e6, payments: 20000}); assert.equal(r.incomeTax, 0); near(r.taxableIncome, 24367.6125); near(r.balance, r.totalTax-20000);
});
test('invalid inputs and unsupported business losses fail explicitly', () => {
 for (const patch of [{ status: '' },{ year: 2024 },{ revenue: NaN },{ expenses: 60001 },{ wages: -1 },{ credits: Infinity }]) assert.throws(() => calculateSelfEmployment({...base,...patch} as SelfEmploymentInput), RangeError);
});
