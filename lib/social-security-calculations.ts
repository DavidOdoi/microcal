export type SocialSecurityInput = { birthYear: number; claimYears: number; claimMonths: number; mode: 'statement' | 'aime2026'; fullBenefit: number; aime: number; colaPercent: number };
const floorDime = (n: number) => Math.floor(n * 10 + 1e-8) / 10;
const floorDollar = (n: number) => Math.floor(n + 1e-8);

export function fullRetirementAgeMonths(birthYear: number): number {
  if (!Number.isInteger(birthYear) || birthYear < 1943 || birthYear > 2010) throw new RangeError('This estimator supports birth years 1943–2010.');
  return birthYear <= 1954 ? 66 * 12 : birthYear < 1960 ? 66 * 12 + (birthYear - 1954) * 2 : 67 * 12;
}
export function pia2026(aime: number): number {
  if (!Number.isFinite(aime) || aime < 0 || aime > 100000) throw new RangeError('AIME must be from $0 to $100,000.');
  const wholeAime = Math.floor(aime);
  return floorDime(.9 * Math.min(wholeAime, 1286) + .32 * Math.max(0, Math.min(wholeAime, 7749) - 1286) + .15 * Math.max(0, wholeAime - 7749));
}
export function claimingFactor(birthYear: number, claimAgeMonths: number): number {
  const fra = fullRetirementAgeMonths(birthYear);
  if (!Number.isInteger(claimAgeMonths) || claimAgeMonths < 62 * 12 || claimAgeMonths > 70 * 12) throw new RangeError('Claiming age must be from 62 through 70 in whole months.');
  const early = Math.max(0, fra - claimAgeMonths);
  if (early > 0) return 1 - Math.min(36, early) * (5 / 9 / 100) - Math.max(0, early - 36) * (5 / 12 / 100);
  return 1 + Math.max(0, claimAgeMonths - fra) * (2 / 3 / 100);
}
export function validateSocialSecurity(input: SocialSecurityInput): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(input.birthYear) || input.birthYear < 1943 || input.birthYear > 2010) errors.push('Birth year must be a whole year from 1943 to 2010.');
  if (!Number.isInteger(input.claimYears) || input.claimYears < 62 || input.claimYears > 70 || !Number.isInteger(input.claimMonths) || input.claimMonths < 0 || input.claimMonths > 11 || input.claimYears * 12 + input.claimMonths > 840) errors.push('Claiming age must be between 62 years and 70 years, with whole additional months from 0 to 11.');
  if (!['statement', 'aime2026'].includes(input.mode)) errors.push('Choose a benefit estimate method.');
  if (input.mode === 'aime2026' && input.birthYear !== 1964) errors.push('The 2026 AIME formula applies only to workers first eligible in 2026 (normally born in 1964). For other birth years, use your statement benefit. January 1 births need SSA-specific age rules.');
  for (const key of ['fullBenefit', 'aime'] as const) if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > 100000) errors.push(`${key === 'aime' ? 'AIME' : 'Full retirement benefit'} must be from $0 to $100,000.`);
  if (!Number.isFinite(input.colaPercent) || input.colaPercent < 0 || input.colaPercent > 20) errors.push('The one-time COLA assumption must be from 0% to 20%.');
  return errors;
}
export function calculateSocialSecurity(input: SocialSecurityInput) {
  const errors = validateSocialSecurity(input);
  if (errors.length) throw new RangeError(errors.join(' '));
  const fraMonths = fullRetirementAgeMonths(input.birthYear);
  const basePia = input.mode === 'aime2026' ? pia2026(input.aime) : floorDime(input.fullBenefit);
  const adjustedPia = floorDime(basePia * (1 + input.colaPercent / 100));
  const monthlyAt = (ageMonths: number) => floorDollar(adjustedPia * claimingFactor(input.birthYear, ageMonths));
  const claimAgeMonths = input.claimYears * 12 + input.claimMonths;
  const monthlyBenefit = monthlyAt(claimAgeMonths);
  return { fraMonths, basePia, adjustedPia, monthlyBenefit, annualBenefit: monthlyBenefit * 12,
    benefitPercent: claimingFactor(input.birthYear, claimAgeMonths) * 100,
    comparisons: [62 * 12, fraMonths, 70 * 12].map((ageMonths) => ({ ageMonths, percent: claimingFactor(input.birthYear, ageMonths) * 100, monthly: monthlyAt(ageMonths) })),
  };
}
