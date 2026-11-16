export type SalaryHourlyInput = { amount: number; unit: 'annual' | 'hourly'; hoursPerWeek: number; weeksPerYear: number; daysPerWeek: number };
export function validateSalaryHourly(v: SalaryHourlyInput): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(v.amount) || v.amount < 0 || v.amount > 1e9) errors.push('Gross pay must be from $0 to $1 billion.');
  if (!['annual', 'hourly'].includes(v.unit)) errors.push('Choose annual salary or hourly pay.');
  for (const [key, label, max] of [['hoursPerWeek', 'Hours per week', 168], ['weeksPerYear', 'Weeks per year', 52], ['daysPerWeek', 'Days per week', 7]] as const) if (!Number.isFinite(v[key]) || v[key] <= 0 || v[key] > max) errors.push(`${label} must be above zero and no more than ${max}.`);
  if (v.hoursPerWeek > v.daysPerWeek * 24) errors.push('The selected working days cannot contain more than 24 hours each.');
  if (v.unit === 'hourly' && v.amount * v.hoursPerWeek * v.weeksPerYear > 1e9) errors.push('Projected annual pay cannot exceed $1 billion.');
  return errors;
}
export function calculateSalaryHourly(v: SalaryHourlyInput) {
  const errors = validateSalaryHourly(v); if (errors.length) throw new RangeError(errors.join(' '));
  const annualHours = v.hoursPerWeek * v.weeksPerYear;
  const annual = v.unit === 'annual' ? v.amount : v.amount * annualHours;
  return { annual, annualHours, hourly: annual / annualHours, daily: annual / (v.daysPerWeek * v.weeksPerYear), weekly: annual / 52, weeklyBySchedule: annual / v.weeksPerYear, biweekly: annual / 26, semimonthly: annual / 24, monthly: annual / 12 };
}
