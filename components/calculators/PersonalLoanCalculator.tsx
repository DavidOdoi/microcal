'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateRemaining } from '@/lib/remaining-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

// Match the worked example in the supplied personal-loan guide.
const defaults = { amount: '15000', rate: '12', term: '4', termUnit: 'years', fee: '5', feeMode: 'percent', feeTreatment: 'deducted', extra: '0' };
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);

export function PersonalLoanCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateRemaining('personal-loan-calculator', submitted), [submitted]);
  const amount = Number(submitted.amount);
  const fee = Math.min(amount, submitted.feeMode === 'percent' ? amount * Number(submitted.fee) / 100 : Number(submitted.fee));
  const proceeds = submitted.feeTreatment === 'deducted' ? amount - fee : amount;
  const months = Math.round(Number(submitted.term) * (submitted.termUnit === 'years' ? 12 : 1));
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((old) => ({ ...old, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const limits = { amount: 1e12, rate: 100, term: values.termUnit === 'years' ? 100 : 1200, fee: values.feeMode === 'percent' ? 100 : 1e12, extra: 1e12 };
    const invalid = Object.entries(limits).some(([key, maximum]) => {
      const raw = values[key as keyof typeof limits], number = Number(raw);
      return raw.trim() === '' || !Number.isFinite(number) || number < 0 || number > maximum;
    });
    const termMonths = Number(values.term) * (values.termUnit === 'years' ? 12 : 1);
    if (invalid || Number(values.amount) <= 0 || termMonths < 1 || !Number.isInteger(termMonths)) {
      setError('Enter a positive loan amount and a whole number of monthly payments. Use nonnegative fees and extra payments, an interest rate up to 100%, and a term up to 100 years.');
      return;
    }
    setError('');
    setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  return <CalculatorLayout id="personal-loan-calculator">
    <form className="finance-input-panel" onSubmit={calculate}>
      <div className="finance-fields">
        <CalculatorNumberField label="Loan amount" value={values.amount} onChange={set('amount')} prefix="$" min={0.01} max={1e12} />
        <CalculatorNumberField label="Annual interest rate" value={values.rate} onChange={set('rate')} unit="%" max={100} />
        <CalculatorNumberField label="Loan term" value={values.term} onChange={set('term')} min={values.termUnit === 'years' ? 1 / 12 : 1} max={values.termUnit === 'years' ? 100 : 1200} />
        <label className="finance-field"><span>Term unit</span><select aria-label="Term unit" value={values.termUnit} onChange={(event) => set('termUnit')(event.target.value)}><option value="years">Years</option><option value="months">Months</option></select></label>
        <details className="finance-advanced"><summary>Origination fee &amp; extra payments</summary><div className="finance-fields">
          <CalculatorNumberField label="Origination fee" value={values.fee} onChange={set('fee')} max={values.feeMode === 'percent' ? 100 : 1e12} />
          <label className="finance-field"><span>Fee input</span><select aria-label="Fee input" value={values.feeMode} onChange={(event) => set('feeMode')(event.target.value)}><option value="percent">Percent of loan amount</option><option value="dollars">Dollar amount</option></select></label>
          <label className="finance-field"><span>Fee treatment</span><select aria-label="Fee treatment" value={values.feeTreatment} onChange={(event) => set('feeTreatment')(event.target.value)}><option value="deducted">Deducted from proceeds</option><option value="upfront">Paid upfront</option><option value="financed">Added to balance</option></select></label>
          <CalculatorNumberField label="Extra monthly principal" value={values.extra} onChange={set('extra')} prefix="$" max={1e12} />
        </div></details>
      </div>
      <div className="calculator-form-actions"><button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />Calculate Payment</button><button className="calculator-reset" type="button" onClick={reset}><RotateCcw size={17} aria-hidden="true" />Reset</button></div>
      <p className="calculator-status">Fixed-rate monthly payments. Enter the annual interest rate, not a fee-inclusive APR. Use your lender’s APR disclosure to compare offers.</p>
      {error && <p className="calculator-status error" role="alert">{error}</p>}
    </form>
    <section className="finance-results-panel" aria-live="polite" aria-label="Your Personal Loan Payments">
      <h2>Your Personal Loan Payments</h2>
      <div className="calculator-payment-summaries">
        <PaymentSummary label="Estimated monthly payment" amount={result.metrics[0].value} period={`${months} months`} />
        <PaymentSummary label="Estimated cash received" amount={money(proceeds)} period={submitted.feeTreatment === 'deducted' ? 'Fee deducted' : 'Full amount'} secondary />
      </div>
      <dl className="calculator-totals"><div><dt>Total interest</dt><dd>{result.metrics[2].value}</dd></div><div><dt>Origination fee</dt><dd>{result.metrics[3].value}</dd></div><div><dt>Payments to lender</dt><dd>{result.metrics[1].value}</dd></div></dl>
      {changed && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      <details className="finance-schedule"><summary>Loan details &amp; amortization schedule</summary>
        <dl className="finance-breakdown"><div><dt>Principal used for schedule</dt><dd>{result.metrics[5].value}</dd></div><div><dt>Total interest and fees</dt><dd>{result.metrics[4].value}</dd></div></dl>
        <p className="finance-note">{submitted.feeTreatment === 'upfront' ? 'An upfront fee is paid separately and is not included in payments to the lender shown above.' : submitted.feeTreatment === 'financed' ? 'The fee is added to principal and included in the payments to the lender.' : 'The fee reduces cash received; interest is charged on the full principal.'} Extra monthly principal is added to the scheduled payment and can shorten repayment. The schedule shows each total payment.</p>
        <div className="finance-table-wrap"><table><caption>Monthly personal loan repayment schedule</caption><thead><tr>{result.tableHeaders?.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{result.rows?.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>
      </details>
    </section>
  </CalculatorLayout>;
}
