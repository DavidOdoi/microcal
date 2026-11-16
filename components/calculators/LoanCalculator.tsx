'use client';

import { useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateLoan, validateLoan, type LoanInput } from '@/lib/loan-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { amount: '25000', annualRate: '9', term: '5', termUnit: 'years', paymentsPerYear: '12', fee: '0', feeTreatment: 'upfront', extraPayment: '0' };
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
const frequencies = { 12: { label: 'Monthly', unit: 'month' }, 26: { label: 'Biweekly', unit: 'two weeks' }, 52: { label: 'Weekly', unit: 'week' } };
function parse(values: typeof defaults): LoanInput {
  const number = (key: keyof typeof defaults) => values[key].trim() === '' ? NaN : Number(values[key]);
  return { amount: number('amount'), annualRate: number('annualRate'), term: number('term'), termUnit: values.termUnit as LoanInput['termUnit'], paymentsPerYear: number('paymentsPerYear') as LoanInput['paymentsPerYear'], fee: number('fee'), feeTreatment: values.feeTreatment as LoanInput['feeTreatment'], extraPayment: number('extraPayment') };
}

export function LoanCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [submitted, setSubmitted] = useState({ ...defaults });
  const [errors, setErrors] = useState<string[]>([]);
  const input = parse(submitted);
  const result = calculateLoan(input);
  const frequency = frequencies[input.paymentsPerYear];
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateLoan(parse(values));
    setErrors(invalid);
    if (!invalid.length) setSubmitted({ ...values });
  }
  return <CalculatorLayout id="loan-calculator">
    <form className="finance-input-panel" onSubmit={calculate} noValidate>
      <h2>Loan details</h2>
      <div className="finance-fields">
        <CalculatorNumberField label="Loan amount" value={values.amount} onChange={set('amount')} prefix="$" min={0.01} max={1e9} />
        <CalculatorNumberField label="Annual interest rate" value={values.annualRate} onChange={set('annualRate')} unit="%" max={100} />
        <CalculatorNumberField label="Loan term" value={values.term} onChange={set('term')} unit={values.termUnit} min={0.01} max={values.termUnit === 'months' ? 600 : 50} />
        <label className="finance-field"><span>Term unit</span><select value={values.termUnit} onChange={(event) => set('termUnit')(event.target.value)}><option value="years">Years</option><option value="months">Months</option></select></label>
        <label className="finance-field"><span>Payment frequency</span><select value={values.paymentsPerYear} onChange={(event) => set('paymentsPerYear')(event.target.value)}><option value="12">Monthly (12 per year)</option><option value="26">Biweekly (26 per year)</option><option value="52">Weekly (52 per year)</option></select></label>
        <details className="finance-advanced"><summary>Advanced settings</summary><div className="finance-fields">
          <CalculatorNumberField label="Loan fee" value={values.fee} onChange={set('fee')} prefix="$" max={1e9} />
          <label className="finance-field"><span>Fee treatment</span><select value={values.feeTreatment} onChange={(event) => set('feeTreatment')(event.target.value)}><option value="upfront">Paid upfront</option><option value="financed">Added to loan balance</option></select></label>
          <CalculatorNumberField label="Extra principal per payment" value={values.extraPayment} onChange={set('extraPayment')} prefix="$" max={1e9} />
        </div></details>
      </div>
      <div className="calculator-form-actions">
        <button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />Calculate Payment</button>
        <button className="calculator-reset" type="button" onClick={() => { setValues({ ...defaults }); setSubmitted({ ...defaults }); setErrors([]); }}><RotateCcw size={17} aria-hidden="true" />Reset</button>
      </div>
      {errors.length > 0 && <div className="calculator-status error" role="alert"><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    </form>
    <section className="finance-results-panel" aria-label="Your Loan Payments" aria-live="polite">
      <h2>Your Loan Payments</h2>
      <PaymentSummary label={`${frequency.label} payment`} amount={money(result.payment)} period={`Per ${frequency.unit}`} />
      <dl className="finance-breakdown">
        <div><dt>Total interest</dt><dd>{money(result.totalInterest)}</dd></div>
        <div><dt>Total repayment including fees</dt><dd>{money(result.totalRepayment)}</dd></div>
        <div><dt>Amount financed</dt><dd>{money(result.principal)}</dd></div>
        <div><dt>Loan fees ({input.feeTreatment})</dt><dd>{money(input.fee)}</dd></div>
        <div><dt>Number of payments</dt><dd>{result.actualPaymentCount}</dd></div>
        {input.extraPayment > 0 && <><div><dt>Planned payment with extra</dt><dd>{money(result.plannedPayment)}</dd></div><div><dt>Interest saved</dt><dd>{money(result.interestSaved)}</dd></div><div><dt>Payments saved</dt><dd>{result.paymentsSaved}</dd></div></>}
      </dl>
      <div className="finance-progress-label"><span>Principal {money(result.principal)}</span><span>Interest {money(result.totalInterest)}</span></div>
      <div className="finance-progress" role="img" aria-label={`Financed principal is ${(result.principal / result.totalPayments * 100).toFixed(1)}% of loan payments; the remainder is interest. Upfront fees are excluded.`}><span style={{ width: `${result.principal / result.totalPayments * 100}%` }} /></div>
      {changed && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      {result.roundedTerm && <p className="finance-note">Your term contains a partial payment period, so it is rounded up to {result.paymentCount} regular payments before any extra principal.</p>}
      <details className="finance-schedule"><summary>View amortization schedule</summary>
        <p className="finance-note">The nominal annual interest rate is divided by {input.paymentsPerYear}. Payments begin one period after borrowing. Extra payments go to principal, and the final payment is capped at the amount owed. Amounts retain full precision internally and display cents.</p>
        <div className="finance-table-wrap"><table><caption>Loan amortization schedule</caption><thead><tr>{['Payment number', 'Payment', 'Principal', 'Interest', 'Balance'].map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.period}><td>{row.period}</td><td>{money(row.payment)}</td><td>{money(row.principal)}</td><td>{money(row.interest)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details>
      <p className="finance-note">This models a fixed-rate, fully amortizing installment loan. Enter the interest rate rather than a fee-inclusive APR when fees are entered separately. The estimate does not model interest-only, balloon, variable-rate, or deferred-interest loans. Check prepayment penalties and lender disclosures.</p>
    </section>
  </CalculatorLayout>;
}
