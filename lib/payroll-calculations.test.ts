import test from 'node:test';
import assert from 'node:assert/strict';
import { annualizePay, calculateFica, calculateNyPfl2026, payrollWageBases } from './payroll-calculations.ts';
test('USA salary units annualize without confusing biweekly and semimonthly', () => {
  assert.equal(annualizePay(60000, 'annual'), 60000); assert.equal(annualizePay(5000, 'monthly'), 60000);
  assert.equal(annualizePay(25, 'hourly'), 52000); assert.equal(annualizePay(1000, 'weekly'), 52000);
  assert.equal(annualizePay(1000, 'weekly', 40, 48), 48000);
  assert.notEqual(60000 / 26, 60000 / 24);
});
test('2026 FICA matches the supplied monthly salary example', () => {
  const r = calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 0, ytdMedicareWages: 0, year: 2026 });
  assert.equal(r.socialSecurity, 310); assert.equal(r.medicare, 72.5); assert.equal(r.additionalMedicare, 0);
});
test('Social Security applies only to the remaining wage base for the selected year', () => {
  assert.equal(calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 183500, ytdMedicareWages: 183500, year: 2026 }).socialSecurity, 62);
  assert.equal(calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 184500, ytdMedicareWages: 184500, year: 2026 }).socialSecurity, 0);
  assert.equal(calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 176100, ytdMedicareWages: 176100, year: 2025 }).socialSecurity, 0);
});
test('Additional Medicare starts only on wages crossing the employer $200,000 threshold', () => {
  assert.ok(Math.abs(calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 198000, ytdMedicareWages: 198000, year: 2026 }).additionalMedicare - 27) < 1e-10);
  assert.equal(calculateFica({ currentWages: 5000, ytdSocialSecurityWages: 210000, ytdMedicareWages: 210000, year: 2026 }).additionalMedicare, 45);
});
test('2026 Paid Family Leave respects coverage and the exact annual cap', () => {
  assert.ok(Math.abs(calculateNyPfl2026(5000, 0, true) - 21.6) < 1e-10);
  assert.ok(Math.abs(calculateNyPfl2026(5000, 410, true) - 1.91) < 1e-10);
  assert.equal(calculateNyPfl2026(5000, 411.91, true), 0); assert.equal(calculateNyPfl2026(5000, 0, false), 0);
});
test('traditional retirement reduces income-tax wages, Roth does not, and section 125 reduces FICA wages', () => {
  assert.deepEqual(payrollWageBases(5000, 200, 300, 100), { incomeTaxWages: 4500, ficaWages: 4800, benefitDeductions: 600 });
  assert.throws(() => payrollWageBases(100, 100, 100, 0), RangeError);
  assert.throws(() => calculateFica({ currentWages: NaN, ytdSocialSecurityWages: 0, ytdMedicareWages: 0, year: 2026 }), RangeError);
});
