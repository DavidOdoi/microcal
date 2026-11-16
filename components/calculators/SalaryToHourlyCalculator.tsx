'use client';
import { calculateSalaryHourly, validateSalaryHourly, type SalaryHourlyInput } from '@/lib/salary-hourly-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'amount', label: 'Gross pay amount', prefix: '$', value: '65000' },
  { key: 'unit', label: 'Pay amount represents', value: 'annual', options: [['annual', 'Actual annual gross salary'], ['hourly', 'Hourly wage']] },
  { key: 'hours', label: 'Hours per week', unit: 'hours', min: .01, max: 168, value: '40' },
  { key: 'weeks', label: 'Weeks used for conversion', unit: 'weeks', min: .01, max: 52, value: '52' },
  { key: 'days', label: 'Working days per week', unit: 'days', min: .01, max: 7, value: '5', advanced: true },
  { key: 'basis', label: 'Interpretation of selected weeks', value: 'paid', options: [['paid', 'Paid-year equivalent, including paid leave'], ['worked', 'Actual working weeks, excluding leave']], advanced: true },
];
function parse(v: ScenarioValues): SalaryHourlyInput { return { amount: +v.amount, unit: v.unit as SalaryHourlyInput['unit'], hoursPerWeek: +v.hours, weeksPerYear: +v.weeks, daysPerWeek: +v.days }; }
export function SalaryToHourlyCalculator() { return <ScenarioCalculator id="salary-to-hourly-calculator" title="Your Salary Conversion" action="Calculate Pay" fields={fields} validate={(v) => validateSalaryHourly(parse(v))} compute={(v) => {
  const r = calculateSalaryHourly(parse(v));
  return { summary: { label: v.basis === 'worked' ? 'Equivalent pay per hour actually worked' : 'Equivalent gross hourly pay', amount: money(r.hourly), period: 'Per hour' },
    metrics: [['Daily pay for selected schedule', money(r.daily)], ['Average weekly pay (52 periods)', money(r.weekly)], ['Pay per selected working week', money(r.weeklyBySchedule)], ['Biweekly pay (26 periods)', money(r.biweekly)], ['Semimonthly pay (24 periods)', money(r.semimonthly)], ['Monthly pay (12 periods)', money(r.monthly)], ['Annual gross earnings', money(r.annual)], ['Annual hours used for conversion', r.annualHours.toLocaleString('en-US', { maximumFractionDigits: 2 })]] as [string, string][],
    notes: ['Gross earnings before US taxes and deductions. An hourly equivalent is not a legal overtime regular rate, and does not determine overtime eligibility.', 'Use 52 weeks for a standard paid-year conversion. To compare pay per hour actually worked, select actual-working-week interpretation and enter the weeks actually worked. Paid leave does not reduce an entered annual salary. If unpaid leave reduces your annual earnings, enter that reduced actual annual salary.', 'Hourly-to-annual projections assume every entered hour and week is paid at the same rate, without additional overtime or bonuses. Monthly, biweekly, semimonthly, and average weekly amounts divide annual earnings by 12, 26, 24, and 52 respectively.'],
  };
}} />; }
