export type RoiInput = { investment: number; finalValue: number; additionalCosts: number; annualization: 'none' | 'years' | 'dates'; years: number; startDate: string; endDate: string; cashFlows: 'single' | 'multiple' };
function dateMillis(value: string): number {
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new RangeError('Enter valid start and end calendar dates.');
  return date.getTime();
}
export function roiHoldingYears(startDate: string, endDate: string): number {
  const days = (dateMillis(endDate) - dateMillis(startDate)) / 86400000;
  if (days <= 0 || days / 365.25 > 100) throw new RangeError('End date must follow start date, with a holding period no longer than 100 years.');
  return days / 365.25;
}
export function validateRoi(v: RoiInput): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(v.investment) || v.investment <= 0 || v.investment > 1e12) errors.push('Initial investment must be above $0 and no more than $1 trillion.');
  for (const [key, label] of [['finalValue', 'Final value'], ['additionalCosts', 'Additional costs']] as const) if (!Number.isFinite(v[key]) || v[key] < 0 || v[key] > 1e12) errors.push(`${label} must be from $0 to $1 trillion.`);
  if (!['none', 'years', 'dates'].includes(v.annualization) || !['single', 'multiple'].includes(v.cashFlows)) errors.push('Choose valid annualization and cash-flow assumptions.');
  if (v.annualization === 'years' && (!Number.isFinite(v.years) || v.years <= 0 || v.years > 100)) errors.push('Holding period must be above zero and no more than 100 years.');
  if (v.annualization === 'dates') { try { roiHoldingYears(v.startDate, v.endDate); } catch (error) { errors.push((error as Error).message); } }
  return errors;
}
export function calculateRoi(v: RoiInput) {
  const errors = validateRoi(v); if (errors.length) throw new RangeError(errors.join(' '));
  const totalCost = v.investment + v.additionalCosts, netGain = v.finalValue - totalCost;
  const roiPercent = netGain / totalCost * 100;
  const years = v.annualization === 'none' ? null : v.annualization === 'dates' ? roiHoldingYears(v.startDate, v.endDate) : v.years;
  let annualizedPercent: number | null = null, annualizationNote = 'Annualization was not selected.';
  if (years !== null) {
    if (v.cashFlows !== 'single') annualizationNote = 'Multiple dated cash flows require IRR/XIRR analysis; simple CAGR is not calculated.';
    else if (v.finalValue <= 0) annualizationNote = 'Annualized return is not shown without a positive ending value.';
    else {
      const rate = Math.expm1(Math.log(v.finalValue / totalCost) / years) * 100;
      if (Number.isFinite(rate)) { annualizedPercent = rate; annualizationNote = 'Annualization assumes every cost is paid at the beginning and all proceeds are received at the end, with no intermediate cash flows.'; }
      else annualizationNote = 'Annualized return exceeds the supported numerical range for this value and holding period.';
    }
  }
  return { totalCost, netGain, roiPercent, years, annualizedPercent, annualizationNote };
}
