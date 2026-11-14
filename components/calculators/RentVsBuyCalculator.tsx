'use client';
import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateRentVsBuy, type RentBuyInput } from '@/lib/rent-vs-buy-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { price: '300000', down: '60000', rate: '6', term: '30', rent: '1800', horizon: '5', tax: '3600', insurance: '1500', maintenance: '250', hoa: '0', pmi: '0', renterInsurance: '0', closing: '3', selling: '6', homeGrowth: '0', rentGrowth: '0', returnRate: '0' };
type Key = keyof typeof defaults;
const fields: { key: Key; label: string; unit?: string; percent?: boolean; min?: number; max?: number; step?: string }[] = [
  { key: 'price', label: 'Home price', min: 1 }, { key: 'down', label: 'Down payment' },
  { key: 'rate', label: 'Mortgage interest rate', percent: true, max: 100 }, { key: 'term', label: 'Mortgage term', unit: 'years', min: 1, max: 50, step: '1' },
  { key: 'rent', label: 'Monthly rent' }, { key: 'horizon', label: 'Time in the home', unit: 'years', min: 1, max: 50, step: '1' },
  { key: 'tax', label: 'Annual property taxes' }, { key: 'insurance', label: 'Annual homeowners insurance' },
  { key: 'maintenance', label: 'Monthly maintenance allowance' }, { key: 'hoa', label: 'Monthly HOA fees' },
  { key: 'pmi', label: 'Monthly mortgage insurance' }, { key: 'renterInsurance', label: 'Monthly renters insurance' },
  { key: 'closing', label: 'Purchase closing costs', percent: true, max: 20 }, { key: 'selling', label: 'Selling costs', percent: true, max: 20 },
  { key: 'homeGrowth', label: 'Annual home appreciation', percent: true, min: -20, max: 20 },
  { key: 'rentGrowth', label: 'Annual rent growth', percent: true, min: -20, max: 20 },
  { key: 'returnRate', label: 'Annual investment return', percent: true, min: -20, max: 20 },
];
const money = (number: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);
export function RentVsBuyCalculator() {
  const [values, setValues] = useState({ ...defaults }), [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateRentVsBuy(Object.fromEntries(Object.entries(submitted).map(([key, value]) => [key, Number(value)])) as RentBuyInput), [submitted]);
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = fields.some((field) => { const value = Number(values[field.key]); return values[field.key].trim() === '' || !Number.isFinite(value) || value < (field.min ?? 0) || value > (field.max ?? 1e12) || (field.step === '1' && !Number.isInteger(value)); });
    if (invalid || Number(values.down) > Number(values.price)) { setError('Check your inputs. The down payment cannot exceed the home price. Use whole years from 1 to 50 and growth assumptions from −20% to 20%.'); return; }
    setError(''); setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  const renderField = (field: typeof fields[number]) => <CalculatorNumberField key={field.key} label={field.label} value={values[field.key]} onChange={(value) => setValues((old) => ({ ...old, [field.key]: value }))} prefix={!field.unit && !field.percent ? '$' : undefined} unit={field.percent ? '%' : field.unit} min={field.min ?? 0} max={field.max ?? 1e12} step={field.step} />;
  return <CalculatorLayout id="rent-vs-buy-calculator">
    <form className="finance-input-panel" onSubmit={calculate}><div className="finance-fields">{fields.slice(0, 6).map(renderField)}
      <details className="finance-advanced"><summary>Ownership costs, transaction fees &amp; growth assumptions</summary><div className="finance-fields">{fields.slice(6).map(renderField)}</div></details>
    </div><div className="calculator-form-actions"><button type="submit" className="calculator-calculate"><Calculator size={18} />Compare Costs</button><button type="button" className="calculator-reset" onClick={reset}><RotateCcw size={17} />Reset</button></div>{error && <p className="calculator-status error" role="alert">{error}</p>}</form>
    <section className="finance-results-panel" aria-live="polite"><h2>Your Rent vs. Buy Comparison</h2><div className="calculator-payment-summaries">
      <PaymentSummary label="Buying: first-month housing cost" amount={money(result.firstMonthlyBuy)} period="Monthly" />
      <PaymentSummary label="Renting: first-month housing cost" amount={money(result.firstMonthlyRent)} period="Monthly" secondary />
    </div><p className="calculator-status">{Math.abs(result.buyingAdvantage) < 1 ? 'The options leave similar modeled assets' : `${result.buyingAdvantage > 0 ? 'Buying' : 'Renting'} leaves ${money(Math.abs(result.buyingAdvantage))} more in modeled assets`} after {submitted.horizon} years under these assumptions.</p>
      <dl className="calculator-totals"><div><dt>Buying: net modeled assets</dt><dd>{money(result.buyerAssets)}</dd></div><div><dt>Renting: net modeled assets</dt><dd>{money(result.renterAssets)}</dd></div><div><dt>First buying crossover</dt><dd>{result.firstCrossover === null ? 'Not in this period' : `${result.firstCrossover} months`}</dd></div></dl>
      {JSON.stringify(values) !== JSON.stringify(submitted) && <p className="calculator-status">Inputs changed. Select Compare Costs to update your results.</p>}
      <details className="finance-schedule"><summary>Year-by-year financial comparison</summary><div className="finance-table-wrap"><table><caption>Projected assets after a hypothetical home sale</caption><thead><tr>{['Year', 'Home value', 'Mortgage balance', 'Buying assets', 'Renting assets', 'Buying advantage'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{result.rows.map((row) => <tr key={row.year}><td>{row.year}</td><td>{money(row.homeValue)}</td><td>{money(row.loanBalance)}</td><td>{money(row.buyerAssets)}</td><td>{money(row.renterAssets)}</td><td>{money(row.buyingAdvantage)}</td></tr>)}</tbody></table></div></details>
      <p className="calculator-status">Both options start with the same cash. The renter invests the down payment and purchase closing costs; the cheaper option invests each month’s cost difference. Buying assets include home equity after selling costs and any investments. Growth assumptions are scenarios, not forecasts.</p>
      <p className="calculator-status">Taxes, insurance, maintenance and HOA stay constant. Entered mortgage insurance is charged while loan payments continue. This nominal-dollar estimate excludes tax benefits, rental deposits, moving costs and mortgage-insurance cancellation before payoff. A first crossover is not a guarantee that buying stays ahead.</p>
    </section>
  </CalculatorLayout>;
}
