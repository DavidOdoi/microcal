'use client';
import { calculateGrossMargin, validateGrossMargin, type GrossMarginInput } from '@/lib/gross-margin-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioValues, type ScenarioField } from './ScenarioCalculator';
const fields: ScenarioField[] = [
 { key: 'mode', label: 'Calculation mode', value: 'margin', options: [['margin', 'Calculate Margin'], ['price', 'Calculate Selling Price']] },
 { key: 'revenue', label: 'Revenue', prefix: '$', max: 1e12, value: '120000', help: 'For Calculate Margin: use revenue and COGS from the same period. These totals are not used in selling-price mode.' },
 { key: 'cogs', label: 'Cost of goods sold', prefix: '$', max: 1e12, value: '72000' },
 { key: 'unitCost', label: 'Unit cost', prefix: '$', max: 1e12, optional: true, value: '', help: 'Required for selling-price mode. For margin mode, enter both unit cost and selling price to see an optional per-item comparison.' },
 { key: 'sellingPrice', label: 'Selling price per unit', prefix: '$', max: 1e12, optional: true, value: '', help: 'Optional in margin mode; not used to determine the target selling price.' },
 { key: 'targetMargin', label: 'Target gross margin', unit: '%', max: 100, value: '40', help: 'Used in Calculate Selling Price mode. A 100% target has no finite price for a positive unit cost.' },
];
function parse(v: ScenarioValues): GrossMarginInput { return { mode: v.mode as GrossMarginInput['mode'], revenue: +v.revenue, cogs: +v.cogs, unitCost: v.unitCost.trim() === '' ? null : +v.unitCost, sellingPrice: v.sellingPrice.trim() === '' ? null : +v.sellingPrice, targetMargin: +v.targetMargin }; }
const percent = (n: number | null) => n === null ? 'Undefined' : `${n.toFixed(2)}%`;
export function GrossMarginCalculator() { return <ScenarioCalculator id="gross-margin-calculator" title="Your Gross Margin Results" action="Calculate" fields={fields} validate={v => validateGrossMargin(parse(v))} compute={v => {
 const input = parse(v), r = calculateGrossMargin(input), pricing = input.mode === 'price';
 return { summary: { label: pricing ? 'Required selling price per unit' : 'Gross margin', amount: pricing ? r.targetPrice === null ? 'No finite price' : money(r.targetPrice) : percent(r.margin), period: pricing ? `${v.targetMargin}% target margin` : 'Revenue less direct costs' },
 metrics: pricing ? [['Unit cost', money(input.unitCost!)], ['Target gross margin', `${v.targetMargin}%`], ['Gross profit at target price', r.targetPrice === null ? 'Undefined' : money(r.targetPrice - input.unitCost!)], ['Markup at target price', input.unitCost === 0 || r.targetPrice === null ? 'Undefined' : percent((r.targetPrice - input.unitCost!) / input.unitCost! * 100)]] : [
 ['Revenue', money(input.revenue)], ['Cost of goods sold', money(input.cogs)], ['Gross profit', money(r.profit)], ['Markup on COGS', percent(r.markup)], ...(r.unitProfit !== null ? [['Gross profit per unit', money(r.unitProfit)], ['Gross margin per unit', percent(r.unitMargin)], ['Markup per unit', percent(r.unitMarkup)]] as [string,string][] : [])
 ], notes: ['Margin divides gross profit by revenue or selling price. Markup divides gross profit by cost. For a $100 sale and $60 cost, margin is 40% and markup is 66.67%. Gross profit excludes operating expenses, financing costs, and taxes.',
 ...(pricing ? [r.targetPrice === null ? 'At a 100% target margin, positive cost leaves no finite selling price; zero cost makes the formula indeterminate. Choose a target below 100%.' : 'Required price = unit cost ÷ (1 − target margin / 100). Price is rounded to cents for display; actual pricing increments can change the achieved margin. Zero-cost, zero-price sales have undefined margin.'] : [input.revenue === 0 ? 'Gross margin is undefined when revenue is zero. Gross profit can still be calculated; no division-by-zero percentage is displayed.' : 'A negative margin means direct costs exceed revenue. Use consistently classified revenue and COGS for the same accounting period.', ...(input.cogs === 0 ? ['Markup on COGS is undefined when COGS is zero.'] : [])])]
 };
 }} />; }
