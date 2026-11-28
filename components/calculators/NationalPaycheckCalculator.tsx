'use client';

import { calculateNationalPaycheck, validateNationalPaycheck, type NationalPaycheckInput } from '@/lib/state-paycheck-calculations';
import { ScenarioCalculator, scenarioMoney, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';

const fields: ScenarioField[] = [
  { key: 'periods', section: 'Earnings', label: 'Pay frequency', value: '26', options: [['52', 'Weekly (52)'], ['26', 'Biweekly (26)'], ['24', 'Semimonthly (24)'], ['12', 'Monthly (12)']] },
  { key: 'year', section: 'Earnings', label: 'Payroll year', value: '2026', options: [['2026', '2026'], ['2025', '2025']] },
  { key: 'unit', section: 'Earnings', label: 'Pay type', value: 'annual', options: [['annual', 'Annual salary'], ['monthly', 'Monthly pay'], ['weekly', 'Weekly pay'], ['hourly', 'Hourly wage']], help: 'For hourly and weekly pay, set your paid weeks and any eligible overtime in Advanced settings.' },
  { key: 'earnings', section: 'Earnings', label: 'Gross pay or hourly rate', prefix: '$', value: '75000' },
  { key: 'hours', section: 'Earnings', label: 'Regular hours per week for hourly pay', unit: 'hours', value: '40', max: 168, advanced: true },
  { key: 'overtime', section: 'Earnings', label: 'Time-and-a-half hours per week', unit: 'hours', value: '0', max: 168, help: 'Enter qualifying hours separately from regular hours. The calculator does not determine overtime eligibility.', advanced: true },
  { key: 'doubleTime', section: 'Earnings', label: 'Double-time hours per week', unit: 'hours', value: '0', max: 168, advanced: true },
  { key: 'weeks', section: 'Earnings', label: 'Paid weeks per year for hourly or weekly pay', unit: 'weeks', value: '52', min: .01, max: 52, advanced: true },

  { key: 'federalMode', section: 'Federal Taxes', label: 'Federal income tax method', value: 'planning', options: [['planning', 'Annual income-tax estimate'], ['entered', 'Enter paystub withholding']], help: 'The annual estimate uses federal income-tax brackets and the standard deduction. To match the federal withholding on your paystub, select the entered method and enter the amount below.' },
  { key: 'status', section: 'Federal Taxes', label: 'Federal filing status for the annual estimate', value: 'single', options: [['single', 'Single'], ['joint', 'Married filing jointly'], ['separate', 'Married filing separately'], ['head', 'Head of household']] },
  { key: 'federal', section: 'Federal Taxes', label: 'Federal withholding from your paystub per paycheck', prefix: '$', value: '0', help: 'Used only with the entered withholding method. Enter the full amount including any extra withholding already deducted.' },
  { key: 'extraFederal', section: 'Federal Taxes', label: 'Additional federal withholding per paycheck', prefix: '$', value: '0', help: 'Enter extra withholding only if it is outside the amount already entered.', advanced: true },
  { key: 'otherIncome', section: 'Federal Taxes', label: 'Other annual income for the federal estimate', prefix: '$', value: '0', advanced: true },
  { key: 'adjustments', section: 'Federal Taxes', label: 'Eligible annual income adjustments for the federal estimate', prefix: '$', value: '0', advanced: true },
  { key: 'credits', section: 'Federal Taxes', label: 'Annual nonrefundable federal credits', prefix: '$', value: '0', advanced: true },
  { key: 'ytdSs', section: 'Federal Taxes', label: 'Year-to-date Social Security wages before this paycheck', prefix: '$', value: '0', advanced: true },
  { key: 'ytdMed', section: 'Federal Taxes', label: 'Year-to-date Medicare wages before this paycheck', prefix: '$', value: '0', advanced: true },

  { key: 'state', section: 'State and Local Taxes', label: 'State income tax withheld per paycheck', prefix: '$', value: '0', help: 'Enter your amount from payroll. Zero leaves state income-tax withholding out of the estimate.' },
  { key: 'local', section: 'State and Local Taxes', label: 'Local income tax withheld per paycheck', prefix: '$', value: '0', help: 'Enter your amount from payroll if applicable.' },

  { key: 'health', section: 'Benefits', label: 'Eligible Section 125 health premiums per paycheck', prefix: '$', value: '0', advanced: true },
  { key: 'traditional', section: 'Benefits', label: 'Traditional 401(k) per paycheck', prefix: '$', value: '0', advanced: true },
  { key: 'roth', section: 'Benefits', label: 'Roth 401(k) per paycheck', prefix: '$', value: '0', advanced: true },
  { key: 'other', section: 'Benefits', label: 'Other deductions per paycheck', prefix: '$', value: '0', help: 'Enter any state payroll contributions or other after-tax deductions from your paystub. These amounts do not reduce taxable wages in this estimate.', advanced: true },
];

function input(values: ScenarioValues): NationalPaycheckInput {
  return {
    year: Number(values.year) as NationalPaycheckInput['year'],
    earningsUnit: values.unit as NationalPaycheckInput['earningsUnit'],
    earnings: Number(values.earnings),
    periods: Number(values.periods) as NationalPaycheckInput['periods'],
    hours: Number(values.hours),
    weeks: Number(values.weeks),
    overtimeHours: Number(values.overtime),
    doubleTimeHours: Number(values.doubleTime),
    federalMode: values.federalMode as NationalPaycheckInput['federalMode'],
    filingStatus: values.status as NationalPaycheckInput['filingStatus'],
    federalWithholding: Number(values.federal),
    extraFederal: Number(values.extraFederal),
    stateWithholding: Number(values.state),
    localWithholding: Number(values.local),
    extraState: 0,
    otherAnnualIncome: Number(values.otherIncome),
    annualDeductions: Number(values.adjustments),
    annualCredits: Number(values.credits),
    health: Number(values.health),
    traditional: Number(values.traditional),
    roth: Number(values.roth),
    otherDeductions: Number(values.other),
    ytdSocialSecurity: Number(values.ytdSs),
    ytdMedicare: Number(values.ytdMed),
  };
}

const money = (cents: number) => scenarioMoney(cents / 100);

function PaycheckDistribution({ pay }: { pay: ReturnType<typeof calculateNationalPaycheck> }) {
  const categories = [
    { label: 'Take-home pay', amount: pay.net, color: '#25643e' },
    { label: 'Federal income tax', amount: pay.federal, color: '#345a93' },
    { label: 'State and local tax', amount: pay.state + pay.local, color: '#875929' },
    { label: 'Social Security and Medicare', amount: pay.socialSecurity + pay.medicare + pay.additionalMedicare, color: '#6d568a' },
    { label: 'Other deductions', amount: pay.health + pay.traditional + pay.roth + pay.other, color: '#596362' },
  ].filter(({ amount }) => amount > 0);
  let position = 0;
  const segments = categories.map(({ amount, color }) => {
    const start = position;
    position += amount;
    return `${color} ${start / pay.gross * 100}% ${position / pay.gross * 100}%`;
  });
  return <figure className="finance-paycheck-distribution">
    <figcaption>Where your gross pay goes</figcaption>
    <div className="finance-paycheck-ring" style={{ backgroundImage: `conic-gradient(${segments.join(', ')})` }}>
      <div className="finance-paycheck-ring-center">
        <span>Take-home pay</span>
        <strong>{money(pay.net)}</strong>
        <span>Per paycheck</span>
      </div>
    </div>
    <ul>{categories.map(({ label, amount, color }) => <li key={label}>
      <span aria-hidden="true" style={{ backgroundColor: color }} />{label} <strong>{money(amount)}</strong>
    </li>)}</ul>
  </figure>;
}

export function NationalPaycheckCalculator() {
  return <ScenarioCalculator
    id="paycheck-calculator"
    title="Your Paycheck Estimate"
    action="Calculate Paycheck"
    fields={fields}
    validate={values => validateNationalPaycheck(input(values))}
    copyResults
    compute={values => {
      const scenario = input(values);
      const pay = calculateNationalPaycheck(scenario);
      const federalLabel = scenario.federalMode === 'entered' ? 'Federal withholding entered, including any extra' : 'Federal annual-tax estimate, including any extra';
      return {
        summary: { label: 'Estimated take-home pay', amount: money(pay.net), period: 'Per paycheck' },
        summaryVisual: pay.gross > 0 && pay.net >= 0 ? <PaycheckDistribution pay={pay} /> : undefined,
        metrics: [
          ['Gross pay per paycheck', money(pay.gross)],
          [federalLabel, money(pay.federal)],
          ['State income-tax withholding entered', money(pay.state)],
          ['Local income-tax withholding entered', money(pay.local)],
          ['Social Security', money(pay.socialSecurity)],
          ['Medicare', money(pay.medicare)],
          ['Additional Medicare withholding', money(pay.additionalMedicare)],
          ['Eligible health premiums', money(pay.health)],
          ['Traditional 401(k)', money(pay.traditional)],
          ['Roth 401(k)', money(pay.roth)],
          ['Other deductions entered', money(pay.other)],
          ['Total taxes and deductions', money(pay.deductions)],
          ['Federal income-tax wages per paycheck', money(pay.incomeTaxWages)],
          ['Social Security and Medicare wages before caps', money(pay.ficaWages)],
          ['Gross pay kept', pay.gross > 0 ? `${(pay.net / pay.gross * 100).toFixed(1)}%` : '—'],
          ['Average monthly net at this paycheck amount', money(pay.net * scenario.periods / 12)],
          ['Annual net at this paycheck amount', money(pay.net * scenario.periods)],
        ],
        notes: [
          'State and local income taxes and any state payroll contributions are based on the amounts you enter. A zero entry excludes that deduction.',
          'The optional annual federal calculation spreads estimated income tax across your paychecks. Use actual paystub withholding for a payroll comparison.',
          'Monthly and annual figures repeat this paycheck. Actual amounts can change during the year as payroll taxes reach their limits or withholding changes.',
          ...(pay.net < 0 ? ['Entered taxes and deductions exceed gross pay. Review your amounts before using this result.'] : []),
        ],
      };
    }}
  />;
}
