'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateMortgage } from '@/lib/mortgage-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { homePrice: '375000', downPayment: '75000', annualRate: '6', years: '30', annualTax: '3600', annualInsurance: '1200', monthlyPmi: '0', monthlyHoa: '0' };
const money = (number: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);
export function MortgageCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateMortgage(Object.fromEntries(Object.entries(submitted).map(([key, value]) => [key, Number(value)])) as Parameters<typeof calculateMortgage>[0]), [submitted]);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((old) => ({ ...old, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.values(values).some((value) => value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1e12) || Number(values.homePrice) <= 0 || Number(values.downPayment) > Number(values.homePrice) || Number(values.annualRate) > 100 || Number(values.years) < 1 || Number(values.years) > 50 || !Number.isInteger(Number(values.years) * 12)) {
      setError('Check your amounts. The down payment cannot exceed the home price. Enter a rate up to 100% and a term of 1–50 years in whole monthly payments.'); return;
    }
    setError(''); setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  return <CalculatorLayout id="mortgage-calculator">
    <form className="finance-input-panel" onSubmit={calculate}><div className="finance-fields">
      <CalculatorNumberField label="Home price" value={values.homePrice} onChange={set('homePrice')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Down payment" value={values.downPayment} onChange={set('downPayment')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Annual mortgage interest rate" value={values.annualRate} onChange={set('annualRate')} unit="%" max={100} />
      <CalculatorNumberField label="Loan term" value={values.years} onChange={set('years')} unit="years" min={1} max={50} />
      <CalculatorNumberField label="Annual property taxes" value={values.annualTax} onChange={set('annualTax')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Annual homeowners insurance" value={values.annualInsurance} onChange={set('annualInsurance')} prefix="$" max={1e12} />
      <details className="finance-advanced"><summary>Mortgage insurance &amp; HOA fees</summary><div className="finance-fields">
        <CalculatorNumberField label="Monthly mortgage insurance" value={values.monthlyPmi} onChange={set('monthlyPmi')} prefix="$" max={1e12} />
        <CalculatorNumberField label="Monthly HOA fees" value={values.monthlyHoa} onChange={set('monthlyHoa')} prefix="$" max={1e12} />
      </div></details>
    </div><div className="calculator-form-actions"><button type="submit" className="calculator-calculate"><Calculator size={18} />Calculate Payment</button><button type="button" className="calculator-reset" onClick={reset}><RotateCcw size={17} />Reset</button></div>{error && <p className="calculator-status error" role="alert">{error}</p>}</form>
    <section className="finance-results-panel" aria-live="polite"><h2>Your Mortgage Payments</h2><div className="calculator-payment-summaries">
      <PaymentSummary label="Estimated total monthly payment" amount={money(result.monthlyTotal)} period={`${submitted.years} years`} />
      <PaymentSummary label="Monthly principal and interest" amount={money(result.monthlyPrincipalInterest)} period={`${result.months} payments`} secondary />
    </div><dl className="calculator-totals"><div><dt>Loan amount</dt><dd>{money(result.principal)}</dd></div><div><dt>Loan interest</dt><dd>{money(result.totalInterest)}</dd></div><div><dt>Loan repayments</dt><dd>{money(result.totalLoanPayments)}</dd></div></dl>
      {JSON.stringify(values) !== JSON.stringify(submitted) && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      <details className="finance-schedule"><summary>Payment breakdown &amp; amortization schedule</summary>
        <dl className="finance-breakdown">{[['Property taxes', result.monthlyTax], ['Homeowners insurance', result.monthlyInsurance], ['Mortgage insurance', result.monthlyPmi], ['HOA fees', result.monthlyHoa]].map(([label, amount]) => <div key={label}><dt>{label}</dt><dd>{money(Number(amount))} / month</dd></div>)}</dl>
        <div className="finance-table-wrap"><table><caption>Mortgage principal and interest schedule</caption><thead><tr>{['Month', 'Payment', 'Interest', 'Principal', 'Balance'].map((label) => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment)}</td><td>{money(row.interest)}</td><td>{money(row.principalPaid)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details><p className="calculator-status">Fixed-rate estimate. Taxes, insurance, mortgage insurance, and HOA fees are held constant; actual costs and mortgage-insurance cancellation rules may differ. Loan interest excludes these separate costs.</p>
    </section>
  </CalculatorLayout>;
}
