'use client';
import { calculateStatePaycheck, validateStatePaycheck, type StatePaycheckInput } from '@/lib/state-paycheck-calculations';
import { PaycheckDistribution } from './PaycheckDistribution';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';

function fieldsFor(state: 'ny' | 'idaho'): ScenarioField[] {
  const ny = state === 'ny';
  return [
    { key: 'earnings', label: 'Gross earnings', prefix: '$', value: '60000' },
    { key: 'unit', label: 'Earnings unit', value: 'annual', options: [['annual', 'Annual salary'], ['monthly', 'Monthly pay'], ['weekly', 'Weekly pay'], ['hourly', 'Hourly wage']] },
    { key: 'periods', label: 'Pay frequency', value: ny ? '12' : '26', options: [['52', 'Weekly (52)'], ['26', 'Biweekly (26)'], ['24', 'Semimonthly (24)'], ['12', 'Monthly (12)']] },
    { key: 'federal', label: 'Federal income-tax withholding per paycheck', prefix: '$', value: ny ? '450' : '200', help: 'Enter your payroll amount based on Form W-4. The starting amount is illustrative; it is not calculated from official withholding tables.' },
    { key: 'state', label: `${ny ? 'NYS' : 'Idaho'} withholding per paycheck`, prefix: '$', value: ny ? '200' : '90', help: `Enter the amount from payroll or the official ${ny ? 'IT-2104 / NYS' : 'ID W-4 / Idaho'} tables for your pay date. It does not automatically adjust with salary or pay frequency.` },
    ...(ny ? [
      { key: 'residence', label: 'Residence', value: 'other', options: [['other', 'New York State outside NYC / Yonkers'], ['nyc', 'New York City'], ['yonkers', 'Yonkers'], ['nonresident', 'Outside New York State']] },
      { key: 'work', label: 'New York work location', value: 'other', options: [['other', 'Outside Yonkers'], ['yonkers', 'Yonkers']] },
      { key: 'local', label: 'Applicable NYC / Yonkers withholding per paycheck', prefix: '$', value: '0', help: 'Enter applicable resident or nonresident local withholding from payroll. Choosing a location does not calculate this amount.' },
      { key: 'pfl', label: 'Covered by NY Paid Family Leave', value: 'yes', options: [['yes', 'Yes'], ['no', 'No / employer pays contribution']] },
    ] as ScenarioField[] : []),
    { key: 'year', label: 'Payroll year', value: '2026', options: ny ? [['2026', '2026']] : [['2026', '2026'], ['2025', '2025']], advanced: true },
    { key: 'hours', label: 'Hours per working week', unit: 'hours', min: .01, max: 168, value: '40', advanced: true },
    { key: 'weeks', label: 'Paid working weeks per year', unit: 'weeks', min: .01, max: 52, value: '52', advanced: true },
    { key: 'health', label: 'Eligible Section 125 health premiums per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'traditional', label: 'Traditional retirement contribution per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'roth', label: 'Roth retirement contribution per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'other', label: 'Other after-tax deductions per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'extraFederal', label: 'Additional federal withholding per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'extraState', label: 'Additional state withholding per paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'ytdSs', label: 'Social Security wages before this paycheck', prefix: '$', value: '0', advanced: true },
    { key: 'ytdMed', label: 'Medicare wages before this paycheck', prefix: '$', value: '0', advanced: true },
    ...(ny ? [{ key: 'ytdPfl', label: 'NY PFL contributions before this paycheck', prefix: '$', value: '0', max: 411.91, advanced: true }] : []),
    { key: 'federalMode', label: 'Federal calculation method', value: 'entered', options: [['entered', 'Entered payroll withholding'], ['planning', 'Annual income-tax planning estimate']], help: 'The planning option uses regular annual tax brackets; it is not an official IRS Publication 15-T / Form W-4 withholding calculation.', advanced: true },
    { key: 'status', label: 'Federal planning filing status', value: 'single', options: [['single', 'Single'], ['joint', 'Married filing jointly'], ['separate', 'Married filing separately'], ['head', 'Head of household']], advanced: true },
    { key: 'otherIncome', label: 'Other annual income for federal planning', prefix: '$', value: '0', advanced: true },
    { key: 'deductions', label: 'Additional annual federal income adjustments', prefix: '$', value: '0', advanced: true },
    { key: 'credits', label: 'Eligible annual nonrefundable federal credits', prefix: '$', value: '0', advanced: true },
  ];
}
function parse(state: 'ny' | 'idaho', v: ScenarioValues): StatePaycheckInput {
  return { state, year: +v.year as StatePaycheckInput['year'], earnings: +v.earnings, earningsUnit: v.unit as StatePaycheckInput['earningsUnit'], hours: +v.hours, weeks: +v.weeks, periods: +v.periods as StatePaycheckInput['periods'], federalMode: v.federalMode as StatePaycheckInput['federalMode'], federalWithholding: +v.federal, stateWithholding: +v.state, localWithholding: +(v.local ?? 0), extraFederal: +v.extraFederal, extraState: +v.extraState, filingStatus: v.status as StatePaycheckInput['filingStatus'], otherAnnualIncome: +v.otherIncome, annualDeductions: +v.deductions, annualCredits: +v.credits, health: +v.health, traditional: +v.traditional, roth: +v.roth, otherDeductions: +v.other, ytdSocialSecurity: +v.ytdSs, ytdMedicare: +v.ytdMed, pflCovered: v.pfl === 'yes', ytdPfl: +(v.ytdPfl ?? 0), residence: (v.residence ?? 'other') as StatePaycheckInput['residence'], work: (v.work ?? 'other') as StatePaycheckInput['work'] };
}
const earningsInputs = ['earnings', 'unit', 'periods', 'year', 'hours', 'weeks'];
const federalInputs = ['federal', 'extraFederal', 'ytdSs', 'ytdMed', 'federalMode', 'status', 'otherIncome', 'deductions', 'credits'];
const stateInputs = ['state', 'residence', 'work', 'local', 'pfl', 'ytdPfl', 'extraState'];

function groupFields(fields: ScenarioField[]) {
  return fields.map(field => ({
    ...field,
    section: earningsInputs.includes(field.key) ? 'Earnings' : federalInputs.includes(field.key) ? 'Federal Taxes' :
      stateInputs.includes(field.key) ? 'State and Local Taxes' : 'Benefits',
  }));
}

const cents = (amount: number) => Math.round(amount * 100);

export function StatePaycheckCalculator({ state }: { state: 'ny' | 'idaho' }) {
  const ny = state === 'ny';
  return <ScenarioCalculator key={state} id={`${ny ? 'new-york' : 'idaho'}-paycheck-calculator`} title={`Your ${ny ? 'New York' : 'Idaho'} Paycheck Estimate`} action="Calculate Paycheck" fields={groupFields(fieldsFor(state))} copyResults validate={(v) => validateStatePaycheck(parse(state, v))} compute={(v) => {
    const r = calculateStatePaycheck(parse(state, v));
    const incomeTaxes: [string, number][] = [
      [v.federalMode === 'entered' ? 'Federal withholding (entered + extra)' : 'Federal annual-tax planning estimate + extra', cents(r.federal)],
      [`${ny ? 'NYS' : 'Idaho'} withholding (entered + extra)`, cents(r.state)],
      ...(ny ? [['Local withholding (entered)', cents(r.local)] as [string, number]] : []),
    ];
    const fica: [string, number][] = [
      ['Social Security', cents(r.socialSecurity)], ['Medicare', cents(r.medicare)], ['Additional Medicare withholding', cents(r.additionalMedicare)],
    ];
    const other: [string, number][] = [
      ...(ny ? [['NY Paid Family Leave', cents(r.pfl)] as [string, number]] : []),
      ['Benefit and retirement deductions', cents(r.benefitDeductions)], ['Other after-tax deductions', cents(+v.other)],
    ];
    const sum = (rows: [string, number][]) => rows.reduce((total, [, amount]) => total + amount, 0);
    const gross = cents(r.gross);
    const net = gross - sum(incomeTaxes) - sum(fica) - sum(other);
    return {
      summary: { label: 'Estimated take-home pay', amount: money(net / 100), period: 'Per paycheck' },
      summaryVisual: gross > 0 && net >= 0 ? <PaycheckDistribution gross={gross} net={net} federal={cents(r.federal)}
        stateAndLocal={cents(r.state) + cents(r.local)} fica={sum(fica)} other={sum(other)} /> : undefined,
      metrics: [
        ['Gross pay per paycheck', money(r.gross)],
        ...[...incomeTaxes, ...fica, ...other].map(([label, amount]): [string, string] => [label, money(amount / 100)]),
        ['Income-tax wages per paycheck', money(r.incomeTaxWages)], ['FICA wages per paycheck', money(r.ficaWages)],
      ] as [string, string][],
      notes: ['Income-tax withholding is entered from your paystub or the applicable official tables. Update those amounts when salary, benefits, elections, location, or pay frequency change. Starting amounts are illustrations, not personalized tax calculations.', `Payroll calculations use ${v.year} employee FICA rules and prior wages from this employer. Traditional retirement contributions reduce income-tax wages but not FICA wages; eligible Section 125 premiums reduce both. Roth contributions are after tax.`, ...(ny ? ['2026 NY PFL is 0.432% of gross wages, capped at $411.91 per year. Local amounts must reflect NYC residence or applicable Yonkers resident/nonresident rules; location selections do not estimate local withholding.'] : ['For 2026 Idaho withholding, use the tables applicable to the pay date, including the July 23 revision. For 2025, enter historical payroll withholding. This tool does not automate either set of state tables. Idaho local income tax is not modeled.']), ...(r.net < 0 ? ['Entered taxes and deductions exceed gross pay. Review the amounts before using this estimate.'] : []), 'This is a paycheck planning estimate, not final annual tax liability. It assumes regular covered employee wages; special payroll rules and multi-employer tax reconciliation are excluded.'],
    };
  }} />;
}
