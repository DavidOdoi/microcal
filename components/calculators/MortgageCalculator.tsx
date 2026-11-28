'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { annualizeMortgageSchedule, calculateMortgage } from '@/lib/mortgage-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = {
  homePrice: '300000', downPayment: '60000', annualRate: '6', years: '30', annualTax: '3600', annualInsurance: '1800',
  monthlyPmi: '0', annualPmiRate: '.5', monthlyHoa: '0', extraPrincipal: '0', firstPaymentDate: '',
};
type MortgageInputs = typeof defaults;
type PmiMode = 'auto' | 'manual';
const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const money = (amount: number) => formatter.format(amount);
const chartColors = ['#216755', '#8cb943', '#4c7593', '#ad704c', '#79628e'];
const amountLimit = 1e12;

function getResult(values: MortgageInputs, mode: PmiMode) {
  const { firstPaymentDate, ...numeric } = values;
  const fields = Object.entries(numeric).filter(([key]) => key !== (mode === 'auto' ? 'monthlyPmi' : 'annualPmiRate'));
  if (fields.some(([, value]) => !value.trim() || !Number.isFinite(+value) || +value < 0 || +value > amountLimit)) return null;
  const { homePrice, downPayment, annualRate, years, annualPmiRate } = values;
  if (+homePrice <= 0 || +downPayment > +homePrice || +annualRate > 100 ||
      +years < 1 || +years > 50 || Math.abs(+years * 12 - Math.round(+years * 12)) > 1e-8 ||
      (mode === 'auto' && +annualPmiRate > 100)) return null;
  if (firstPaymentDate) {
    const date = new Date(`${firstPaymentDate}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(firstPaymentDate) || !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== firstPaymentDate || +firstPaymentDate.slice(0, 4) < 1900 || +firstPaymentDate.slice(0, 4) > 2100) return null;
  }
  return calculateMortgage({
    homePrice: +homePrice, downPayment: +downPayment, annualRate: +annualRate, years: +years,
    annualTax: +values.annualTax, annualInsurance: +values.annualInsurance, monthlyHoa: +values.monthlyHoa,
    monthlyPmi: +values.monthlyPmi, annualPmiRate: mode === 'auto' ? +annualPmiRate : undefined,
    extraPrincipal: +values.extraPrincipal, firstPaymentDate,
  });
}

const roundDollars = (value: number) => String(Math.round(value * 100) / 100);
const downFromPercent = (price: string, percentage: string) =>
  price && percentage ? (+percentage === 100 ? price : roundDollars(+price * +percentage / 100)) : '';
const percent = (down: string, price: string) => +price > 0 && down !== '' ? String(Number((100 * +down / +price).toFixed(4))) : '';

export function MortgageCalculator({ initialValues, id = 'mortgage-calculator' }: {
  initialValues?: Partial<MortgageInputs>; id?: string;
} = {}) {
  const initial = { ...defaults, ...initialValues };
  const [values, setValues] = useState(initial);
  const [downMode, setDownMode] = useState<'dollars' | 'percent'>('dollars');
  const [percentEntry, setPercentEntry] = useState('');
  const [pmiMode, setPmiMode] = useState<PmiMode>('auto');
  const invalidPercent = downMode === 'percent' && (!percentEntry || !Number.isFinite(+percentEntry) || +percentEntry < 0 || +percentEntry > 100);
  const result = useMemo(() => invalidPercent ? null : getResult(values, pmiMode), [invalidPercent, values, pmiMode]);
  const set = (key: keyof MortgageInputs) => (value: string) => setValues(old => ({ ...old, [key]: value }));
  function setPrice(value: string) {
    setValues(old => ({
      ...old, homePrice: value,
      downPayment: downMode === 'percent' ? downFromPercent(value, percentEntry) : old.downPayment,
    }));
  }
  function reset() {
    setValues(initial);
    setDownMode('dollars');
    setPercentEntry('');
    setPmiMode('auto');
  }
  return <div className="mortgage-tool">
    <CalculatorLayout id={id}>
      <form className="finance-input-panel" onSubmit={event => event.preventDefault()} noValidate>
        <h2>Loan and housing costs</h2>
        <p className="finance-note">Starting values are editable examples. Use the interest rate from your quote and local tax and insurance amounts for the property.</p>
        <div className="finance-fields">
          <CalculatorNumberField label="Home price" value={values.homePrice} onChange={setPrice} prefix="$" min={1} max={amountLimit} />
          <div className="mortgage-down-payment">
            <CalculatorNumberField label="Down payment" value={values.downPayment} onChange={value => {
              setDownMode('dollars');
              set('downPayment')(value);
            }} prefix="$" max={+values.homePrice || amountLimit} />
            <CalculatorNumberField label="Down payment percentage" value={downMode === 'percent' ? percentEntry : percent(values.downPayment, values.homePrice)} onChange={value => {
              setDownMode('percent');
              setPercentEntry(value);
              set('downPayment')(downFromPercent(values.homePrice, value));
            }} unit="%" max={100} />
          </div>
          <CalculatorNumberField label="Annual mortgage interest rate" value={values.annualRate} onChange={set('annualRate')} unit="%" max={100} />
          <CalculatorNumberField label="Loan term" value={values.years} onChange={set('years')} unit="years" min={1} max={50} />
          <CalculatorNumberField label="Annual property taxes" value={values.annualTax} onChange={set('annualTax')} prefix="$" max={amountLimit} />
          <CalculatorNumberField label="Annual homeowners insurance" value={values.annualInsurance} onChange={set('annualInsurance')} prefix="$" max={amountLimit} />
          <details className="finance-advanced">
            <summary>Mortgage insurance, HOA and extra payments</summary>
            <div className="finance-fields">
              <label className="finance-field"><span>Mortgage insurance method</span>
                <select value={pmiMode} onChange={event => setPmiMode(event.target.value as PmiMode)}>
                  <option value="auto">Estimate conventional PMI</option><option value="manual">Enter a monthly amount</option>
                </select>
              </label>
              {pmiMode === 'auto' ? <>
                <CalculatorNumberField label="Annual PMI rate" value={values.annualPmiRate} onChange={set('annualPmiRate')} unit="%" max={100} />
                <p className="finance-note">Below 20% down, the estimate multiplies the original loan amount by this editable rate. The starting 0.5% is illustrative. Use the monthly option for a quote or to enter zero.</p>
              </> : <CalculatorNumberField label="Monthly mortgage insurance" value={values.monthlyPmi} onChange={set('monthlyPmi')} prefix="$" max={amountLimit} />}
              <CalculatorNumberField label="Monthly HOA fees" value={values.monthlyHoa} onChange={set('monthlyHoa')} prefix="$" max={amountLimit} />
              <CalculatorNumberField label="Additional monthly principal" value={values.extraPrincipal} onChange={set('extraPrincipal')} prefix="$" max={amountLimit} />
              <label className="finance-field"><span>First payment date (optional)</span>
                <input type="date" value={values.firstPaymentDate} onChange={event => set('firstPaymentDate')(event.target.value)} min="1900-01-01" max="2100-12-31" />
              </label>
            </div>
          </details>
        </div>
        <div className="calculator-form-actions"><button type="button" className="calculator-reset" onClick={reset}><RotateCcw size={17} aria-hidden="true" />Reset</button></div>
      </form>
      {result ? <MortgageResults result={result} /> : <section className="finance-results-panel" aria-label="Mortgage payment results">
        <h2>Your Mortgage Payments</h2>
        <p className="calculator-status error" role="alert">Enter valid amounts. The down payment must be between 0% and 100%, the interest rate between 0% and 100%, and the loan term between 1 and 50 years in whole months. Use a first payment date between 1900 and 2100, or leave it blank.</p>
      </section>}
    </CalculatorLayout>
    {result && result.schedule.length > 0 && <MortgageSchedule result={result} />}
  </div>;
}

type MortgageResult = ReturnType<typeof calculateMortgage>;

function MortgageResults({ result }: { result: MortgageResult }) {
  const [selected, setSelected] = useState<number>();
  const rows = [
    ['Principal and interest', result.monthlyPrincipalInterest], ['Property taxes', result.monthlyTax],
    ['Homeowners insurance', result.monthlyInsurance], ['Mortgage insurance', result.monthlyPmi], ['HOA fees', result.monthlyHoa],
  ] as const;
  const extra = result.schedule[0] ? Math.max(0, result.schedule[0].payment - result.monthlyPrincipalInterest) : 0;
  const date = result.payoffDate ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(result.payoffDate)) : '';
  return <section className="finance-results-panel" aria-label="Mortgage payment results">
    <h2>Your Mortgage Payments</h2>
    <div aria-live="polite">
      <PaymentSummary label="Estimated monthly payment" amount={money(result.monthlyTotal)} period="per month" />
    </div>
    <div className="mortgage-payment-chart" aria-hidden="true">
      {rows.map(([name, amount], index) => amount > 0 && <span key={name} style={{
        flexBasis: `${100 * amount / result.monthlyTotal}%`, backgroundColor: chartColors[index], opacity: selected === undefined || selected === index ? 1 : .28,
      }} />)}
    </div>
    <ul className="mortgage-legend" aria-label="Monthly payment breakdown">
      {rows.map(([name, amount], index) => <li key={name}><button type="button" aria-pressed={selected === index} onClick={() => setSelected(selected === index ? undefined : index)}>
        <span className="mortgage-swatch" style={{ backgroundColor: chartColors[index] }} aria-hidden="true" />
        <span>{name}</span><strong>{money(amount)}</strong>
      </button></li>)}
    </ul>
    <dl className="finance-breakdown">
      <div><dt>Loan amount</dt><dd>{money(result.principal)}</dd></div>
      {extra >= .01 && <div><dt>First payment with extra principal</dt><dd>{money(result.monthlyTotal + extra)}</dd></div>}
      <div><dt>Total interest</dt><dd>{money(result.totalInterest)}</dd></div>
      <div><dt>Total principal and interest paid</dt><dd>{money(result.totalLoanPayments)}</dd></div>
      <div><dt>Estimated payoff</dt><dd>{date || (result.payoffMonths ? `${result.payoffMonths} monthly payments` : 'No loan balance')}</dd></div>
    </dl>
    <p className="finance-note">This fixed-rate estimate shows starting monthly costs. Taxes, insurance and fees can change. Loan totals exclude those costs and PMI. Enter the first payment date to see a calendar payoff date.</p>
  </section>;
}

function MortgageSchedule({ result }: { result: MortgageResult }) {
  const [view, setView] = useState<'annual' | 'monthly'>('annual');
  const annual = annualizeMortgageSchedule(result.schedule);
  const interval = Math.ceil(annual.length / 6);
  const milestones = annual.filter((row, index) => (index + 1) % interval === 0 || index === annual.length - 1);
  const rows = view === 'annual'
    ? annual.map(row => ({ ...row, period: row.year })) : result.schedule.map(row => ({ ...row, period: row.month }));
  return <details className="finance-schedule mortgage-schedule">
    <summary>Balance over time and amortization schedule</summary>
    <h2>Remaining balance</h2>
    <ul className="mortgage-balance-chart">{milestones.map(row => <li key={row.year}>
      <span>Year {row.year}</span><span className="mortgage-balance-track" aria-hidden="true">
        <span style={{ width: `${100 * row.balance / result.principal}%` }} />
      </span><strong>{money(row.balance)}</strong>
    </li>)}</ul>
    <label className="finance-field"><span>Amortization schedule view</span>
      <select value={view} onChange={event => setView(event.target.value as 'annual' | 'monthly')}>
        <option value="annual">Annual</option><option value="monthly">Monthly</option>
      </select>
    </label>
    <div className="finance-table-wrap" tabIndex={0} role="region" aria-label="Mortgage amortization table">
      <table>
        <caption>{view === 'annual' ? 'Annual' : 'Monthly'} mortgage principal and interest</caption>
        <thead><tr><th scope="col">{view === 'annual' ? 'Year' : 'Month'}</th><th scope="col">Payment</th><th scope="col">Principal</th><th scope="col">Interest</th><th scope="col">Balance</th></tr></thead>
        <tbody>{rows.map(row => <tr key={row.period}><th scope="row">{row.period}</th><td>{money(row.payment)}</td><td>{money(row.principalPaid)}</td><td>{money(row.interest)}</td><td>{money(row.balance)}</td></tr>)}</tbody>
      </table>
    </div>
  </details>;
}
