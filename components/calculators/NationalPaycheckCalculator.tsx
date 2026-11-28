'use client';

import { calculateNationalPaycheck, validateNationalPaycheck, type NationalPaycheckInput } from '@/lib/state-paycheck-calculations';
import { PaycheckDistribution } from './PaycheckDistribution';
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

const paystubExcludedFields = new Set(['federalMode', 'status', 'extraFederal', 'otherIncome', 'adjustments', 'credits']);
type PaystubState = { name: string; localTax?: string; noStateIncomeTax?: boolean; combinedStateAndLocal?: boolean; californiaSdi?: boolean };

function paystubStateTaxLabel(state: PaystubState) {
  return state.combinedStateAndLocal ? `${state.name} state and local income tax` : `${state.name} income tax`;
}

function fieldsForPaystub(state: PaystubState): ScenarioField[] {
  return fields.flatMap((field): ScenarioField[] => {
    if (paystubExcludedFields.has(field.key)) return [];
    if (field.key === 'year') return [{ ...field, options: [['2026', '2026']] }];
    if (field.key === 'earnings') return [{ ...field, value: '' }];
    if (field.key === 'federal') return [{
      ...field, value: '', help: 'Enter the full federal withholding shown on the paystub, including any extra withholding. Enter 0 if none was withheld.',
    }];
    if (field.key === 'local') return state.localTax ? [{
      ...field, label: `${state.localTax} withheld per paycheck`,
      help: 'Enter the total for this paycheck from your paystub. Enter 0 when none was withheld.',
    }] : [];
    if (field.key === 'state' && state.noStateIncomeTax) return [];
    if (field.key === 'state') return [
      { ...field, label: `${paystubStateTaxLabel(state)} withheld per paycheck`, value: '',
        help: state.combinedStateAndLocal ? 'Enter the total state and local income tax shown on this paystub. If your paystub lists them separately, add them together first. Enter 0 if none was withheld.'
          : `Enter the ${state.name} income tax shown on this paystub. Enter 0 if none was withheld.` },
      ...(state.californiaSdi ? [{ key: 'stateDisability', section: 'State and Local Taxes', label: 'California SDI withheld per paycheck', prefix: '$', value: '',
        help: 'Enter CA SDI or CASDI from your paystub. If a separate voluntary disability plan deduction applies, enter it under Benefits and enter 0 for SDI.' }] : []),
    ];
    if (field.key === 'other') return [{ ...field, help: 'Enter after-tax deductions that you have not listed in any other field.' }];
    return [field];
  });
}

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
    federalMode: (values.federalMode ?? 'entered') as NationalPaycheckInput['federalMode'],
    filingStatus: (values.status ?? 'single') as NationalPaycheckInput['filingStatus'],
    federalWithholding: Number(values.federal),
    extraFederal: Number(values.extraFederal ?? 0),
    stateWithholding: Number(values.state ?? 0),
    localWithholding: Number(values.local ?? 0),
    extraState: 0,
    otherAnnualIncome: Number(values.otherIncome ?? 0),
    annualDeductions: Number(values.adjustments ?? 0),
    annualCredits: Number(values.credits ?? 0),
    health: Number(values.health),
    traditional: Number(values.traditional),
    roth: Number(values.roth),
    otherDeductions: Number(values.other),
    stateDisabilityWithholding: Number(values.stateDisability ?? 0),
    ytdSocialSecurity: Number(values.ytdSs),
    ytdMedicare: Number(values.ytdMed),
  };
}

const money = (cents: number) => scenarioMoney(cents / 100);

export function NationalPaycheckCalculator({ paystubState }: { paystubState?: PaystubState } = {}) {
  const californiaPaystub = paystubState?.californiaSdi;
  const stateName = paystubState?.name;
  const enteredWithholding = paystubState?.noStateIncomeTax ? 'federal withholding' : `federal and ${stateName} withholding`;
  return <ScenarioCalculator
    id={paystubState ? `${paystubState.name.toLowerCase().replaceAll(' ', '-')}-paycheck-calculator` : 'paycheck-calculator'}
    title={paystubState ? `Your ${stateName} Paycheck Estimate` : 'Your Paycheck Estimate'}
    action="Calculate Paycheck"
    fields={paystubState ? fieldsForPaystub(paystubState) : fields}
    emptyMessage={paystubState ? `Enter gross pay and ${enteredWithholding}${californiaPaystub ? ', plus SDI' : ''} to see your estimated take-home pay.` : undefined}
    validate={values => validateNationalPaycheck(input(values))}
    copyResults
    compute={values => {
      const scenario = input(values);
      const pay = calculateNationalPaycheck(scenario);
      const federalLabel = scenario.federalMode === 'entered' ? 'Federal withholding entered, including any extra' : 'Federal annual-tax estimate, including any extra';
      return {
        summary: { label: 'Estimated take-home pay', amount: money(pay.net), period: 'Per paycheck' },
        summaryVisual: pay.gross > 0 && pay.net >= 0 ? <PaycheckDistribution gross={pay.gross} net={pay.net} federal={pay.federal} stateAndLocal={pay.state + pay.local}
          fica={pay.socialSecurity + pay.medicare + pay.additionalMedicare} other={pay.health + pay.traditional + pay.roth + pay.other + pay.stateDisability} /> : undefined,
        metrics: [
          ['Gross pay per paycheck', money(pay.gross)],
          [federalLabel, money(pay.federal)],
          ...(!paystubState?.noStateIncomeTax ? [[paystubState ? `${paystubStateTaxLabel(paystubState)} withholding entered` : 'State income-tax withholding entered', money(pay.state)] as [string, string]] : []),
          ...(californiaPaystub ? [['California SDI entered', money(pay.stateDisability)] as [string, string]] : []),
          ...(!paystubState || paystubState.localTax ? [[paystubState?.localTax ? `${paystubState.localTax} entered` : 'Local income-tax withholding entered', money(pay.local)] as [string, string]] : []),
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
          ...(paystubState ? [
            `Income-tax withholding and any other deductions you enter are taken from the amounts on your paystub. Social Security and Medicare are calculated from the wages and year-to-date amounts you provide.`,
            'If your paystub shows different Social Security or Medicare taxable wages, payroll adjustments, or nonstandard deductions, the estimate can differ from your actual net pay.',
          ] : [
            'State and local income taxes and any state payroll contributions are based on the amounts you enter. A zero entry excludes that deduction.',
            'The optional annual federal calculation spreads estimated income tax across your paychecks. Use actual paystub withholding for a payroll comparison.',
          ]),
          'Monthly and annual figures repeat this paycheck. Actual amounts can change during the year as payroll taxes reach their limits or withholding changes.',
          ...(pay.net < 0 ? ['Entered taxes and deductions exceed gross pay. Review your amounts before using this result.'] : []),
        ],
      };
    }}
  />;
}
