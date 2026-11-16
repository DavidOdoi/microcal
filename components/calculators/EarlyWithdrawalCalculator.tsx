'use client';
import { calculateWithdrawal, validateWithdrawal, type WithdrawalInput } from '@/lib/withdrawal-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'amount', label: 'Gross withdrawal', prefix: '$', value: '20000' },
  { key: 'age', label: 'Current age', unit: 'years', max: 120, value: '40' },
  { key: 'year', label: 'Tax year', value: '2026', options: [['2026', '2026'], ['2025', '2025']] },
  { key: 'status', label: 'Filing status', value: 'single', options: [['single', 'Single'], ['joint', 'Married filing jointly'], ['separate', 'Married filing separately'], ['head', 'Head of household']] },
  { key: 'income', label: 'Other federal taxable income', prefix: '$', value: '60000', help: 'Taxable income after deductions, before this withdrawal. Federal tax is the increase caused by the taxable distribution.' },
  { key: 'account', label: 'Account treatment', value: 'traditional', options: [['traditional', 'Traditional — fully pretax'], ['roth-qualified', 'Roth — qualified distribution'], ['roth-nonqualified', 'Roth — nonqualified distribution']] },
  { key: 'state', label: 'Estimated state tax rate', unit: '%', max: 20, value: '5' },
  { key: 'exception', label: 'Confirmed additional-tax exception', value: 'no', options: [['no', 'No exception'], ['yes', 'I qualify for an IRS exception']] },
  { key: 'earnings', label: 'Taxable Roth earnings in this distribution', prefix: '$', value: '4000', advanced: true, help: 'For nonqualified Roth 401(k) withdrawals only. Enter the taxable earnings portion, generally allocated pro rata; this is not Roth IRA contribution ordering.' },
  { key: 'withholding', label: 'Federal withholding assumption', unit: '%', max: 100, value: '20', advanced: true },
  { key: 'stateWithholding', label: 'State withholding assumption', unit: '%', max: 100, value: '0', advanced: true },
  { key: 'growth', label: 'Assumed annual investment return', unit: '%', min: -100, max: 100, value: '6', advanced: true },
  { key: 'years', label: 'Years of potential growth', unit: 'years', max: 80, value: '20', advanced: true },
];
function parse(v: ScenarioValues): WithdrawalInput { return { amount: +v.amount, age: +v.age, year: +v.year as WithdrawalInput['year'], status: v.status as WithdrawalInput['status'], otherTaxableIncome: +v.income, account: v.account as WithdrawalInput['account'], rothEarnings: +v.earnings, stateRate: +v.state, exception: v.exception === 'yes', federalWithholdingRate: +v.withholding, stateWithholdingRate: +v.stateWithholding, growthRate: +v.growth, growthYears: +v.years }; }
export function EarlyWithdrawalCalculator() { return <ScenarioCalculator id="401k-early-withdrawal-calculator" title="Your Withdrawal Estimate" action="Calculate Withdrawal" fields={fields} validate={(v) => validateWithdrawal(parse(v))} compute={(v) => {
  const r = calculateWithdrawal(parse(v));
  return { summary: { label: 'Estimated amount remaining after taxes', amount: money(r.netWithdrawal), period: 'After filing' },
    metrics: [['Gross withdrawal', money(+v.amount)], ['Taxable withdrawal', money(r.taxableWithdrawal)], ['Incremental federal income tax', money(r.federalTax)], ['Estimated state income tax', money(r.stateTax)], ['Additional early withdrawal tax', money(r.additionalTax)], ['Total estimated taxes', money(r.totalTax)], ['Assumed tax withholding', money(r.withholding)], ['Estimated immediate deposit', money(r.immediateDeposit)], [r.taxDueAfterWithholding < 0 ? 'Modeled excess withholding' : 'Modeled tax still due after withholding', money(Math.abs(r.taxDueAfterWithholding))], ['Potential future balance forgone', money(r.futureValue)], ['Potential investment growth forgone', money(r.forgoneGrowth)]] as [string, string][],
    notes: [`Uses ${v.year} ordinary federal brackets on other taxable income plus the taxable withdrawal. Credits, deduction phaseouts, NIIT, state-specific rules, and other income interactions are excluded. State tax uses your flat assumption.`, 'Withholding is a separate payment toward taxes, not another tax cost. The 20% default is an editable assumption, not a universal requirement; hardship and other distributions can differ.', 'Qualified Roth treatment and penalty exceptions are user-confirmed assumptions, not eligibility determinations. Traditional treatment assumes no after-tax basis. Plan permission, the Roth five-year rule, and special exceptions require confirmation. Growth is hypothetical, excludes taxes and fees, and is not guaranteed.'],
  };
}} />; }
