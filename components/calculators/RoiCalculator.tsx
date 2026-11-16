'use client';
import { calculateRoi, validateRoi, type RoiInput } from '@/lib/roi-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioValues, type ScenarioField } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'investment', label: 'Initial investment', prefix: '$', min: .01, max: 1e12, value: '4000' },
  { key: 'final', label: 'Final value / total proceeds', prefix: '$', max: 1e12, value: '5000', help: 'Include income or distributions only once. Simple ROI uses total costs and proceeds without modeling their dates.' },
  { key: 'costs', label: 'Additional costs', prefix: '$', max: 1e12, value: '0' },
  { key: 'annualization', label: 'Annualized comparison', value: 'none', options: [['none', 'Not requested'], ['years', 'Enter a holding period in years'], ['dates', 'Use start and end dates']], advanced: true },
  { key: 'years', label: 'Holding period', unit: 'years', optional: true, min: .0001, max: 100, value: '', advanced: true },
  { key: 'start', label: 'Investment start date', type: 'date', optional: true, value: '', advanced: true },
  { key: 'end', label: 'Investment end date', type: 'date', optional: true, value: '', advanced: true },
  { key: 'flows', label: 'Cash-flow pattern', value: 'single', options: [['single', 'All costs upfront; all proceeds at the end'], ['multiple', 'Intermediate or multiple dated cash flows']], advanced: true },
];
function parse(v: ScenarioValues): RoiInput { return { investment: +v.investment, finalValue: +v.final, additionalCosts: +v.costs, annualization: v.annualization as RoiInput['annualization'], years: +v.years, startDate: v.start, endDate: v.end, cashFlows: v.flows as RoiInput['cashFlows'] }; }
export function RoiCalculator() { return <ScenarioCalculator id="roi-calculator" title="Your ROI Results" action="Calculate ROI" fields={fields} validate={(v) => validateRoi(parse(v))} compute={(v) => {
  const r = calculateRoi(parse(v));
  return { summary: { label: 'Simple return on investment', amount: `${r.roiPercent.toFixed(2)}%`, period: 'Overall ROI' },
    metrics: [['Total investment cost', money(r.totalCost)], ['Final value / proceeds', money(+v.final)], ['Net gain / loss', money(r.netGain)], ...(r.years !== null ? [['Holding period in years', r.years.toFixed(4)], ['Annualized compounded return', r.annualizedPercent === null ? 'Not available' : `${r.annualizedPercent.toFixed(2)}%`]] as [string, string][] : [])] as [string, string][],
    notes: ['Simple ROI does not automatically adjust for inflation, taxes, risk, or the timing of cash flows. Proceeds and costs must be entered consistently without double counting.', r.annualizationNote, ...(v.annualization === 'dates' ? ['Date-based annualization uses elapsed UTC calendar days divided by 365.25. A calendar-year interval can differ slightly from a manually entered number of years.'] : [])],
  };
}} />; }
