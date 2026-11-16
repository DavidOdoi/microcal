export type PayrollFrequency = 12 | 24 | 26 | 52;
export type PayrollYear = 2025 | 2026;

export function annualizePay(amount: number, unit: 'annual' | 'monthly' | 'weekly' | 'hourly', hoursPerWeek = 40, weeksPerYear = 52) {
  if (!Number.isFinite(amount) || amount < 0 || amount > 1e9 || !Number.isFinite(hoursPerWeek) || hoursPerWeek < 0 || hoursPerWeek > 168 || !Number.isFinite(weeksPerYear) || weeksPerYear < 0 || weeksPerYear > 52) throw new RangeError('Enter valid earnings, weekly hours, and working weeks.');
  switch (unit) {
    case 'annual': return amount;
    case 'monthly': return amount * 12;
    case 'weekly': return amount * weeksPerYear;
    case 'hourly': return amount * hoursPerWeek * weeksPerYear;
    default: throw new RangeError('Choose annual, monthly, weekly, or hourly earnings.');
  }
}

/** Employer withholding threshold is $200,000, regardless of filing status. */
export function calculateFica(input: { currentWages: number; ytdSocialSecurityWages: number; ytdMedicareWages: number; year: PayrollYear }) {
  const { currentWages, ytdSocialSecurityWages, ytdMedicareWages, year } = input;
  for (const amount of [currentWages, ytdSocialSecurityWages, ytdMedicareWages]) if (!Number.isFinite(amount) || amount < 0 || amount > 1e10) throw new RangeError('FICA wages must be finite and nonnegative.');
  if (![2025, 2026].includes(year)) throw new RangeError('Choose a supported payroll year.');
  const wageBase = year === 2026 ? 184500 : 176100;
  const socialSecurityWages = Math.min(currentWages, Math.max(0, wageBase - ytdSocialSecurityWages));
  const additionalMedicareWages = Math.max(0, ytdMedicareWages + currentWages - 200000) - Math.max(0, ytdMedicareWages - 200000);
  return { socialSecurity: socialSecurityWages * .062, medicare: currentWages * .0145, additionalMedicare: additionalMedicareWages * .009, wageBase };
}

export function calculateNyPfl2026(grossWages: number, ytdContributions: number, covered: boolean) {
  if (!Number.isFinite(grossWages) || grossWages < 0 || !Number.isFinite(ytdContributions) || ytdContributions < 0) throw new RangeError('PFL wages and prior contributions must be nonnegative.');
  return covered ? Math.min(grossWages * .00432, Math.max(0, 411.91 - ytdContributions)) : 0;
}

export function payrollWageBases(gross: number, section125: number, traditionalRetirement: number, rothRetirement: number) {
  for (const amount of [gross, section125, traditionalRetirement, rothRetirement]) if (!Number.isFinite(amount) || amount < 0) throw new RangeError('Wages and deductions must be nonnegative.');
  if (section125 + traditionalRetirement + rothRetirement > gross) throw new RangeError('Benefit and retirement deductions cannot exceed gross pay.');
  return { incomeTaxWages: gross - section125 - traditionalRetirement, ficaWages: gross - section125, benefitDeductions: section125 + traditionalRetirement + rothRetirement };
}
