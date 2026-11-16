'use client';
import { calculateInflation, inflationYears } from '@/lib/inflation-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField } from './ScenarioCalculator';
const yearOptions: [string, string][] = [...inflationYears].reverse().map((year) => [String(year), String(year)]);
const fields: ScenarioField[] = [
  { key: 'amount', label: 'Dollar amount', prefix: '$', max: 1e12, value: '10000' },
  { key: 'start', label: 'Starting year', value: '2000', options: yearOptions },
  { key: 'end', label: 'Ending year', value: '2025', options: yearOptions },
];
export function UsInflationCalculator() { return <ScenarioCalculator id="us-inflation-calculator" title="Your Inflation Comparison" action="Calculate Inflation" fields={fields} compute={(v) => {
  const r = calculateInflation(+v.amount, +v.start, +v.end);
  return { summary: { label: `Equivalent amount in ${v.end} dollars`, amount: money(r.adjustedAmount), period: `From ${v.start}` },
    metrics: [[`Original amount in ${v.start} dollars`, money(+v.amount)], ['Cumulative CPI change in selected direction', `${r.cumulativeInflationPercent.toFixed(2)}%`], ['Difference in equivalent dollar amount', money(r.dollarChange)], [`Purchasing power of unchanged amount (${v.start} dollars)`, money(r.unchangedAmountPurchasingPower)], ['Purchasing-power change of unchanged cash', `${r.purchasingPowerChangePercent.toFixed(2)}%`], [`Starting annual-average CPI-U (${v.start})`, String(r.startingCpi)], [`Ending annual-average CPI-U (${v.end})`, String(r.endingCpi)]] as [string, string][],
    notes: ['Uses BLS CPI-U, all items, U.S. city average, not seasonally adjusted (CUUR0000SA0), with 1982–84 = 100. Coverage: published annual averages for 1913–2025. Later calendar years and incomplete-year averages are not included.', 'The equivalent amount buys the same CPI basket as the original amount. The unchanged-cash comparison keeps the same nominal dollars and shows its purchasing power in starting-year dollars. These are different measures.', 'Reversing the years reverses the comparison direction; a negative result in that case does not by itself establish historical deflation. This is a historical index comparison, not a forecast or a personal cost-of-living measure.'],
  };
}} />; }
