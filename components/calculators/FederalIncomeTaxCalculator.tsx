'use client';
import { calculateFederalIncomeTax, validateFederalIncomeTax, type FederalIncomeTaxInput } from '@/lib/federal-income-tax-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'income', label: 'Annual gross income', prefix: '$', value: '75000' },
  { key: 'year', label: 'Tax year', value: '2026', options: [['2026', '2026'], ['2025', '2025']] },
  { key: 'status', label: 'Filing status', value: 'single', options: [['single', 'Single'], ['joint', 'Married filing jointly'], ['separate', 'Married filing separately'], ['head', 'Head of household']] },
  { key: 'deduction', label: 'Deduction choice', value: 'standard', options: [['standard', 'Regular standard deduction'], ['itemized', 'Entered itemized deduction']] },
  { key: 'itemized', label: 'Itemized deduction amount', prefix: '$', value: '0' },
  { key: 'adjustments', label: 'Eligible adjustments to income', prefix: '$', value: '0', advanced: true },
  { key: 'nonrefundable', label: 'Eligible nonrefundable tax credits', prefix: '$', value: '0', advanced: true },
  { key: 'refundable', label: 'Eligible refundable tax credits', prefix: '$', value: '0', advanced: true },
  { key: 'withholding', label: 'Federal withholding and estimated payments', prefix: '$', value: '0', advanced: true },
];
function parse(v: ScenarioValues): FederalIncomeTaxInput { return { year: +v.year as FederalIncomeTaxInput['year'], status: v.status as FederalIncomeTaxInput['status'], income: +v.income, adjustments: +v.adjustments, deductionMode: v.deduction as FederalIncomeTaxInput['deductionMode'], itemized: +v.itemized, nonrefundableCredits: +v.nonrefundable, refundableCredits: +v.refundable, withholding: +v.withholding }; }
export function FederalIncomeTaxCalculator() { return <ScenarioCalculator id="income-tax-calculator" title="Your Federal Income Tax Estimate" action="Calculate Tax" fields={fields} validate={(v) => validateFederalIncomeTax(parse(v))} compute={(v) => {
  const r = calculateFederalIncomeTax(parse(v));
  return { summary: { label: 'Federal income tax after nonrefundable credits', amount: money(r.tax), period: `Tax year ${v.year}` },
    metrics: [['Adjusted gross income', money(r.agi)], ['Deduction used', money(r.deduction)], ['Taxable income', money(r.taxableIncome)], ['Tax before credits', money(r.taxBeforeCredits)], ['Nonrefundable credits applied', money(r.nonrefundableApplied)], ['Refundable credits entered', money(r.refundableCredits)], ['Marginal ordinary income rate', `${r.marginalRate.toFixed(0)}%`], ['Effective tax rate on gross income', `${r.effectiveRate.toFixed(2)}%`], ['Federal withholding / payments', money(+v.withholding)], [r.refundOrBalance >= 0 ? 'Estimated refund including refundable credits' : 'Estimated federal balance due', money(Math.abs(r.refundOrBalance))]] as [string, string][],
    notes: [`Uses ${v.year} ordinary-income brackets and regular standard deductions, or your itemized deduction. Credits and adjustments are entered as already eligible amounts; eligibility and phaseouts are not determined.`, 'This is not total tax liability. Payroll taxes, self-employment tax, AMT, NIIT, preferential capital-gain/dividend rates, age/blindness additions, and other special deductions are excluded. Refund estimates include only the withholding, payments, and refundable credits you enter.'],
    schedule: { caption: `${v.year} ordinary-income bracket calculation`, headers: ['Taxable income range', 'Rate', 'Income in bracket', 'Tax'], rows: r.rows.filter((row) => row.taxable > 0).map((row) => [`${money(row.lower)} – ${Number.isFinite(row.upper) ? money(row.upper) : 'and above'}`, `${row.rate * 100}%`, money(row.taxable), money(row.tax)]) },
  };
}} />; }
