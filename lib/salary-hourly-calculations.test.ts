import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryHourly, type SalaryHourlyInput } from './salary-hourly-calculations.ts';
const example: SalaryHourlyInput = { amount: 65000, unit: 'annual', hoursPerWeek: 40, weeksPerYear: 52, daysPerWeek: 5 };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
test('reproduces every pay-period amount in the $65,000 article example', () => {
  const r = calculateSalaryHourly(example); assert.equal(r.hourly, 31.25); assert.equal(r.daily, 250); assert.equal(r.weekly, 1250); assert.equal(r.biweekly, 2500); near(r.semimonthly, 2708.33); near(r.monthly, 5416.67); assert.equal(r.annualHours, 2080);
});
test('all supplied working-hour and job-offer comparisons match', () => {
  for (const [hoursPerWeek, expected] of [[30, 38.46], [35, 32.97], [40, 28.85], [45, 25.64], [50, 23.08]]) near(calculateSalaryHourly({ ...example, amount: 60000, hoursPerWeek }).hourly, expected);
  near(calculateSalaryHourly({ ...example, amount: 55000 }).hourly, 26.44);
  near(calculateSalaryHourly({ ...example, amount: 50000 }).hourly, 24.04);
});
test('paid-year and actual-working-week comparisons preserve actual salary', () => {
  assert.equal(calculateSalaryHourly({ ...example, amount: 52000 }).hourly, 25);
  const actualHours = calculateSalaryHourly({ ...example, amount: 52000, weeksPerYear: 48 });
  near(actualHours.hourly, 27.08); assert.equal(actualHours.annual, 52000); assert.equal(actualHours.weekly, 1000);
});
test('hourly-to-annual conversion works in reverse and distinguishes pay periods', () => {
  const r = calculateSalaryHourly({ ...example, unit: 'hourly', amount: 25 }); assert.equal(r.annual, 52000); assert.equal(r.hourly, 25); assert.notEqual(r.biweekly, r.semimonthly);
  assert.equal(calculateSalaryHourly({ ...example, amount: 0 }).hourly, 0);
});
test('zero schedules, impossible days, invalid numbers and oversized projections are rejected', () => {
  for (const change of [{ hoursPerWeek: 0 }, { weeksPerYear: 0 }, { daysPerWeek: 0 }, { daysPerWeek: 1 }, { amount: NaN }, { unit: 'hourly', amount: 1e9 }]) assert.throws(() => calculateSalaryHourly({ ...example, ...change } as SalaryHourlyInput), RangeError);
});
