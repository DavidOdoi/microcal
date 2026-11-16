'use client';
import { calculateSelfEmployment, validateSelfEmployment, type SelfEmploymentInput } from '@/lib/self-employment-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioValues, type ScenarioField } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'year', label: 'Tax year', value: '2026', options: [['2026', '2026'], ['2025', '2025']] },
  { key: 'status', label: 'Filing status', value: 'single', options: [['single', 'Single'], ['joint', 'Married filing jointly'], ['separate', 'Married filing separately'], ['head', 'Head of household']] },
  { key: 'revenue', label: 'Annual business revenue', prefix: '$', value: '60000' },
  { key: 'expenses', label: 'Deductible business expenses', prefix: '$', value: '10000' },
  { key: 'wages', label: 'Household W-2 taxable wages', prefix: '$', value: '0', help: 'Assumes Medicare wages equal these wages. Include both spouses for a joint return. Standard employee Social Security and Medicare payroll taxes are excluded from the federal tax total.' },
  { key: 'socialSecurityWages', label: 'Your W-2 Social Security wages', prefix: '$', value: '0', help: 'Enter box 3 wages for the person earning this business profit, excluding a spouse’s wages. This is a separate input and does not add to income again.' },
  { key: 'otherIncome', label: 'Other ordinary taxable income', prefix: '$', value: '0', advanced: true },
  { key: 'adjustments', label: 'Other eligible AGI adjustments', prefix: '$', value: '0', advanced: true, help: 'Exclude the half-SE-tax deduction; it is calculated automatically. Enter only adjustments for which you qualify.' },
  { key: 'qbiDeduction', label: 'Qualified business income deduction', prefix: '$', value: '0', advanced: true, help: 'Enter an independently determined allowable QBI deduction. This calculator does not determine QBI eligibility, phaseouts, wage or property limits.' },
  { key: 'credits', label: 'Nonrefundable federal income tax credits', prefix: '$', value: '0', advanced: true },
  { key: 'payments', label: 'Federal withholding and estimated payments', prefix: '$', value: '0', advanced: true },
];
function parse(v: ScenarioValues): SelfEmploymentInput { return { ...Object.fromEntries(Object.entries(v).map(([k, value]) => [k, k === 'status' ? value : +value])) } as SelfEmploymentInput; }
export function SelfEmploymentCalculator() { return <ScenarioCalculator id="1099-tax-calculator" title="Your 1099 Tax Estimate" action="Calculate Taxes" fields={fields} validate={(v) => validateSelfEmployment(parse(v))} compute={(v) => {
 const r = calculateSelfEmployment(parse(v));
 return { summary: { label: 'Total estimated federal taxes', amount: money(r.totalTax), period: `Annual ${v.year} estimate` }, metrics: [
 ['Net business profit', money(r.profit)], ['Net earnings for SE threshold', money(r.earnings)], ['Self-employment tax', money(r.selfEmploymentTax)], ['SE Social Security portion', money(r.socialSecurityTax)], ['SE Medicare portion', money(r.medicareTax)], ['Half-SE-tax AGI deduction', money(r.halfDeduction)], ['Adjusted gross income', money(r.agi)], ['Standard deduction', money(r.standardDeduction)], ['Federal taxable income', money(r.taxableIncome)], ['Federal income tax after entered credits', money(r.incomeTax)], ['Additional Medicare tax', money(r.additionalMedicare)], [r.balance < 0 ? 'Estimated overpayment' : 'Estimated balance after payments', money(Math.abs(r.balance))], ['Remaining balance divided by four', money(Math.max(0, r.balance) / 4)]
 ], notes: [
 'US federal planning estimate for one sole proprietor using the regular Schedule SE method and standard deduction. Net earnings below $400 produce no standard SE tax. The Social Security wage cap applies separately to each spouse.',
 'W-2 taxable wages are assumed equal to household Medicare wages. Additional Medicare tax uses filing-status thresholds and is shown separately; it is not part of the half-SE-tax deduction. Enter corresponding federal withholding in payments.',
 'QBI is not calculated automatically: the default zero deduction may overestimate income tax for eligible taxpayers. Enter a separately verified allowable amount in Advanced settings. Other income is taxed at ordinary rates. Business losses, multiple self-employed spouses, preferential capital gains, AMT, NIIT, refundable credits, itemized or age/blind deductions, and state/local taxes are not modeled.',
 'Dividing the remaining balance by four is a savings illustration, not a required quarterly payment or safe-harbor calculation. Prior-year tax, payment dates, uneven income and withholding timing can change estimated-payment requirements.'
 ], schedule: { caption: 'Federal ordinary-income bracket calculation before entered credits', headers: ['Rate', 'Income in bracket', 'Tax'], rows: r.bracketRows.filter(row => row.taxable > 0).map(row => [`${(row.rate * 100).toFixed(0)}%`, money(row.taxable), money(row.tax)]) } };
 }} />; }
