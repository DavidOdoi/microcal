import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSocialSecurity, claimingFactor, fullRetirementAgeMonths, pia2026, type SocialSecurityInput } from './social-security-calculations.ts';
const example: SocialSecurityInput = { birthYear: 1964, claimYears: 67, claimMonths: 0, mode: 'statement', fullBenefit: 2000, aime: 4000, colaPercent: 0 };
test('2026 formula reproduces the supplied AIME example and floors to a dime', () => {
  assert.equal(pia2026(4000), 2025.8); assert.equal(pia2026(0), 0); assert.equal(pia2026(1286), 1157.4);
  assert.equal(pia2026(7749), 3225.5); assert.equal(pia2026(7750), 3225.7);
  const r = calculateSocialSecurity({ ...example, mode: 'aime2026' });
  assert.equal(r.basePia, 2025.8); assert.equal(r.monthlyBenefit, 2025);
});
test('claiming at 62, FRA, and 70 matches the supplied $2,000 example', () => {
  assert.deepEqual(calculateSocialSecurity(example).comparisons.map((r) => r.monthly), [1400, 2000, 2480]);
  assert.equal(calculateSocialSecurity({ ...example, claimYears: 62 }).monthlyBenefit, 1400);
  assert.equal(calculateSocialSecurity({ ...example, claimYears: 70 }).annualBenefit, 29760);
});
test('birth-year FRA and exact-month reductions and credits are distinct', () => {
  assert.equal(fullRetirementAgeMonths(1954), 792); assert.equal(fullRetirementAgeMonths(1955), 794);
  assert.equal(fullRetirementAgeMonths(1959), 802); assert.equal(fullRetirementAgeMonths(1960), 804);
  assert.ok(Math.abs(claimingFactor(1964, 803) - (1 - .05 / 9)) < 1e-10);
  assert.ok(Math.abs(claimingFactor(1964, 805) - (1 + .02 / 3)) < 1e-10);
  assert.equal(calculateSocialSecurity({ ...example, birthYear: 1955, claimYears: 66, claimMonths: 2 }).monthlyBenefit, 2000);
});
test('COLA is an explicit one-time benefit adjustment, never a bend-point change', () => {
  const r = calculateSocialSecurity({ ...example, colaPercent: 3.6 });
  assert.equal(r.basePia, 2000); assert.equal(r.adjustedPia, 2072); assert.equal(r.monthlyBenefit, 2072);
  assert.equal(pia2026(4000), 2025.8);
});
test('wrong eligibility cohort and invalid ages cannot use the 2026 formula', () => {
  for (const change of [{ birthYear: 1960, mode: 'aime2026' as const }, { birthYear: 1942 }, { claimYears: 70, claimMonths: 1 }, { claimMonths: .5 }, { aime: NaN }, { colaPercent: -1 }]) assert.throws(() => calculateSocialSecurity({ ...example, ...change }), RangeError);
});
