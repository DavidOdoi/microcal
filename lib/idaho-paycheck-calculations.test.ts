import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateStatePaycheck, type StatePaycheckInput } from './state-paycheck-calculations.ts';
const example: StatePaycheckInput = { state: 'idaho', year: 2026, earnings: 60000, earningsUnit: 'annual', hours: 40, weeks: 52, periods: 26, federalMode: 'entered', federalWithholding: 200, stateWithholding: 90, localWithholding: 0, extraFederal: 0, extraState: 0, filingStatus: 'single', otherAnnualIncome: 0, annualDeductions: 0, annualCredits: 0, health: 0, traditional: 0, roth: 0, otherDeductions: 0, ytdSocialSecurity: 0, ytdMedicare: 0, pflCovered: false, ytdPfl: 0, residence: 'other', work: 'other' };
const near = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < .01, `${actual} ≈ ${expected}`);
test('Idaho article example uses the explicitly entered income-tax amounts', () => {
  const r = calculateStatePaycheck(example); near(r.gross, 2307.69); near(r.socialSecurity, 143.08); near(r.medicare, 33.46); near(r.net, 1841.15);
  assert.equal(r.federal, 200); assert.equal(r.state, 90); assert.equal(r.pfl, 0); assert.equal(r.local, 0);
});
test('all four Idaho pay schedules use the correct number of periods without rescaling entered taxes', () => {
  for (const periods of [12, 24, 26, 52] as const) {
    const r = calculateStatePaycheck({ ...example, periods }); near(r.gross * periods, 60000); near(r.net, 60000 / periods * .9235 - 290); assert.equal(r.state, 90);
  }
});
test('2025 and 2026 FICA wage bases remain distinct for historical paychecks', () => {
  assert.equal(calculateStatePaycheck({ ...example, year: 2025, ytdSocialSecurity: 176100 }).socialSecurity, 0);
  assert.ok(calculateStatePaycheck({ ...example, year: 2026, ytdSocialSecurity: 176100 }).socialSecurity > 0);
});
test('Idaho after-tax Roth deductions preserve FICA wages and extra withholding is separate', () => {
  const r = calculateStatePaycheck({ ...example, roth: 200, extraState: 15, extraFederal: 10 }); near(r.net, 1616.15); near(r.ficaWages, 60000 / 26); assert.equal(r.state, 105); assert.equal(r.federal, 210);
});
