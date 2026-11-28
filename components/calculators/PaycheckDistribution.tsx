import { scenarioMoney } from './ScenarioCalculator';

const money = (cents: number) => scenarioMoney(cents / 100);

export function PaycheckDistribution({ gross, net, federal, stateAndLocal, fica, other }: {
  gross: number; net: number; federal: number; stateAndLocal: number; fica: number; other: number;
}) {
  const categories = [
    { label: 'Take-home pay', amount: net, color: '#25643e' },
    { label: 'Federal income tax', amount: federal, color: '#345a93' },
    { label: 'State and local tax', amount: stateAndLocal, color: '#875929' },
    { label: 'Social Security and Medicare', amount: fica, color: '#6d568a' },
    { label: 'Other deductions', amount: other, color: '#596362' },
  ].filter(({ amount }) => amount > 0);
  let position = 0;
  const segments = categories.map(({ amount, color }) => {
    const start = position;
    position += amount;
    return `${color} ${start / gross * 100}% ${position / gross * 100}%`;
  });
  return <figure className="finance-paycheck-distribution">
    <figcaption>Where your gross pay goes</figcaption>
    <div className="finance-paycheck-ring" style={{ backgroundImage: `conic-gradient(${segments.join(', ')})` }}>
      <div className="finance-paycheck-ring-center">
        <span>Take-home pay</span>
        <strong>{money(net)}</strong>
        <span>Per paycheck</span>
      </div>
    </div>
    <ul>{categories.map(({ label, amount, color }) => <li key={label}>
      <span aria-hidden="true" style={{ backgroundColor: color }} />{label} <strong>{money(amount)}</strong>
    </li>)}</ul>
  </figure>;
}
