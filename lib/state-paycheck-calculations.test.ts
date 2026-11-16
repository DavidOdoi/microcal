import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStatePaycheck, validateStatePaycheck, type StatePaycheckInput } from './state-paycheck-calculations.ts';
const example: StatePaycheckInput = { state: 'ny', year: 2026, earnings: 60000, earningsUnit: 'annual', hours: 40, weeks: 52, periods: 12, federalMode: 'entered', federalWithholding: 450, stateWithholding: 200, localWithholding: 0, extraFederal: 0, extraState: 0, filingStatus: 'single', otherAnnualIncome: 0, annualDeductions: 0, annualCredits: 0, health: 0, traditional: 0, roth: 0, otherDeductions: 0, ytdSocialSecurity: 0, ytdMedicare: 0, pflCovered: true, ytdPfl: 0, residence: 'other', work: 'other' };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
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
