import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNationalPaycheck, calculateStatePaycheck, validateNationalPaycheck, validateStatePaycheck, type NationalPaycheckInput, type StatePaycheckInput } from './state-paycheck-calculations.ts';
const example: StatePaycheckInput = { state: 'ny', year: 2026, earnings: 60000, earningsUnit: 'annual', hours: 40, weeks: 52, periods: 12, federalMode: 'entered', federalWithholding: 450, stateWithholding: 200, localWithholding: 0, extraFederal: 0, extraState: 0, filingStatus: 'single', otherAnnualIncome: 0, annualDeductions: 0, annualCredits: 0, health: 0, traditional: 0, roth: 0, otherDeductions: 0, ytdSocialSecurity: 0, ytdMedicare: 0, pflCovered: true, ytdPfl: 0, residence: 'other', work: 'other' };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
const nationalExample: NationalPaycheckInput = {
  ...example, earnings: 75_000, periods: 26, federalMode: 'planning', stateWithholding: 100,
};

test('national biweekly worked example reconciles to the displayed cent', () => {
  const pay = calculateNationalPaycheck(nationalExample);
  assert.equal(pay.gross, 288462);
  assert.deepEqual([pay.federal, pay.state, pay.socialSecurity, pay.medicare], [29500, 10000, 17885, 4183]);
  assert.equal(pay.net, 226894);
  assert.equal(pay.net + pay.deductions, pay.gross);
});

test('California paystub example subtracts entered disability and income withholding once', () => {
  const scenario: NationalPaycheckInput = {
    ...nationalExample, earnings: 80_000, federalMode: 'entered', federalWithholding: 300,
    stateWithholding: 125, stateDisabilityWithholding: 40,
  };
  const pay = calculateNationalPaycheck(scenario);
  assert.deepEqual([pay.gross, pay.federal, pay.state, pay.stateDisability], [307692, 30000, 12500, 4000]);
  assert.deepEqual([pay.socialSecurity, pay.medicare, pay.deductions, pay.net], [19077, 4462, 70039, 237653]);
  assert.equal(calculateNationalPaycheck({ ...scenario, stateDisabilityWithholding: 0 }).net, pay.net + 4000);
  assert.ok(validateNationalPaycheck({ ...scenario, stateDisabilityWithholding: -1 }).length);
  assert.throws(() => calculateNationalPaycheck({ ...scenario, stateDisabilityWithholding: -1 }), RangeError);
});

test('national hourly pay applies only the entered overtime and double-time hours', () => {
  const hourly: NationalPaycheckInput = { ...nationalExample, earnings: 25, earningsUnit: 'hourly', overtimeHours: 5, periods: 52 };
  assert.equal(calculateNationalPaycheck(hourly).gross, 118750);
  assert.equal(calculateNationalPaycheck({ ...hourly, doubleTimeHours: 2 }).gross, 128750);
  assert.ok(validateNationalPaycheck({ ...hourly, overtimeHours: 129 }).length);
  assert.ok(validateNationalPaycheck({ ...hourly, hours: 0, overtimeHours: 0 }).length);
});

test('national pay uses entered withholding and recalculates FICA across employer wage thresholds', () => {
  const pay = calculateNationalPaycheck({
    ...nationalExample, earnings: 36_000, periods: 12, federalMode: 'entered', federalWithholding: 250,
    stateWithholding: 100, localWithholding: 25, ytdSocialSecurity: 184_000, ytdMedicare: 199_000,
  });
  assert.deepEqual([pay.federal, pay.local, pay.socialSecurity, pay.medicare, pay.additionalMedicare], [25000, 2500, 3100, 4350, 1800]);
  assert.equal(pay.net, 253250);
});
test('reproduces the NY article with explicitly entered illustrative income-tax withholding', () => {
  const r = calculateStatePaycheck(example); near(r.gross, 5000); near(r.socialSecurity, 310); near(r.medicare, 72.5); near(r.pfl, 21.6); near(r.net, 3945.9);
});
test('reproduces the Idaho illustration without claiming to implement state withholding tables', () => {
  const r = calculateStatePaycheck({ ...example, state: 'idaho', periods: 26, federalWithholding: 200, stateWithholding: 90 });
  near(r.gross, 2307.69); near(r.net, 1841.15); assert.equal(r.pfl, 0); assert.equal(r.local, 0);
});
test('locations never invent a local withholding amount or silently replace entered amounts', () => {
  assert.equal(calculateStatePaycheck({ ...example, residence: 'nyc', localWithholding: 150 }).local, 150);
  near(calculateStatePaycheck({ ...example, residence: 'yonkers', localWithholding: 33.5 }).net, 3912.4);
  near(calculateStatePaycheck({ ...example, residence: 'nonresident', work: 'yonkers', localWithholding: 25 }).net, 3920.9);
});
test('annual tax planning is distinct from entered withholding, with additional amounts applied once', () => {
  const r = calculateStatePaycheck({ ...example, federalMode: 'planning' });
  near(r.federal, 5020 / 12);
  const extra = calculateStatePaycheck({ ...example, extraFederal: 20, extraState: 10 }); near(extra.net, 3915.9);
  const traditional = calculateStatePaycheck({ ...example, federalMode: 'planning', traditional: 300 });
  const roth = calculateStatePaycheck({ ...example, federalMode: 'planning', roth: 300 });
  assert.ok(traditional.federal < roth.federal); assert.equal(traditional.socialSecurity, roth.socialSecurity);
});
test('year-to-date wage and contribution caps affect only the current paycheck', () => {
  const r = calculateStatePaycheck({ ...example, ytdSocialSecurity: 184500, ytdMedicare: 201000, ytdPfl: 411.91 });
  assert.equal(r.socialSecurity, 0); assert.equal(r.pfl, 0); near(r.additionalMedicare, 45);
  const old = calculateStatePaycheck({ ...example, state: 'idaho', year: 2025, ytdSocialSecurity: 176100 }); assert.equal(old.socialSecurity, 0);
});
test('invalid deductions, pay periods, and wages are rejected; over-withholding stays visible', () => {
  for (const invalid of [{ health: 6000 }, { earnings: NaN }, { periods: 0 }, { annualDeductions: 1e6, federalMode: 'planning' }, { federalMode: 'planning', otherAnnualIncome: 1e9 }, { state: 'idaho', localWithholding: 1 }]) {
    assert.ok(validateStatePaycheck({ ...example, ...invalid } as StatePaycheckInput).length);
    assert.throws(() => calculateStatePaycheck({ ...example, ...invalid } as StatePaycheckInput), RangeError);
  }
  assert.ok(calculateStatePaycheck({ ...example, federalWithholding: 6000 }).net < 0);
});

test('New York subtracts the entered disability contribution once, alongside calculated paid leave', () => {
  const paycheck = { ...example, earnings: 78000, periods: 26, federalWithholding: 0, stateWithholding: 0, nyDisabilityWithholding: 1.20 } as const;
  const result = calculateStatePaycheck(paycheck);
  assert.equal(result.nyDisability, 1.20);
  near(result.pfl, 12.96);
  near(result.net, 2756.34);
  assert.ok(validateStatePaycheck({ ...paycheck, nyDisabilityWithholding: -1 }).length);
});
