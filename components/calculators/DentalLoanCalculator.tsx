'use client';

import { useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateDentalLoan, validateDentalLoan, type DentalLoanInput } from '@/lib/dental-loan-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { treatmentCost: '6000', insurance: '1000', downPayment: '500', annualRate: '10', termMonths: '36', fee: '0', financeFee: false, extraPayment: '0' };
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
function parse(values: typeof defaults): DentalLoanInput {
  const number = (key: Exclude<keyof typeof defaults, 'financeFee'>) => values[key].trim() === '' ? NaN : Number(values[key]);
  return { treatmentCost: number('treatmentCost'), insurance: number('insurance'), downPayment: number('downPayment'), annualRate: number('annualRate'), termMonths: number('termMonths'), fee: number('fee'), financeFee: values.financeFee, extraPayment: number('extraPayment') };
}

export function DentalLoanCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [submitted, setSubmitted] = useState({ ...defaults });
  const [errors, setErrors] = useState<string[]>([]);
  const result = calculateDentalLoan(parse(submitted));
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  const set = (key: Exclude<keyof typeof defaults, 'financeFee'>) => (value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateDentalLoan(parse(values));
    setErrors(invalid);
    if (!invalid.length) setSubmitted({ ...values });
  }
  return <CalculatorLayout id="dental-loan-calculator">
    <form className="finance-input-panel" onSubmit={calculate} noValidate>
      <h2>Dental financing details</h2>
      <div className="finance-fields">
        <CalculatorNumberField label="Treatment cost" value={values.treatmentCost} onChange={set('treatmentCost')} prefix="$" max={1e9} />
        <CalculatorNumberField label="Insurance contribution" value={values.insurance} onChange={set('insurance')} prefix="$" max={1e9} />
        <CalculatorNumberField label="Down payment" value={values.downPayment} onChange={set('downPayment')} prefix="$" max={1e9} />
        <CalculatorNumberField label="Annual interest rate" value={values.annualRate} onChange={set('annualRate')} unit="%" max={100} />
        <CalculatorNumberField label="Loan term" value={values.termMonths} onChange={set('termMonths')} unit="months" min={1} max={360} step="1" />
        <details className="finance-advanced"><summary>Advanced settings</summary><div className="finance-fields">
          <CalculatorNumberField label="Loan fee" value={values.fee} onChange={set('fee')} prefix="$" max={1e9} />
          <label className="finance-field"><span>Fee treatment</span><select value={values.financeFee ? 'financed' : 'upfront'} onChange={(event) => setValues((previous) => ({ ...previous, financeFee: event.target.value === 'financed' }))}><option value="upfront">Paid upfront</option><option value="financed">Added to loan balance</option></select></label>
          <CalculatorNumberField label="Extra monthly payment" value={values.extraPayment} onChange={set('extraPayment')} prefix="$" max={1e9} />
        </div></details>
      </div>
      <div className="calculator-form-actions">
        <button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />Calculate Payment</button>
        <button className="calculator-reset" type="button" onClick={() => { setValues({ ...defaults }); setSubmitted({ ...defaults }); setErrors([]); }}><RotateCcw size={17} aria-hidden="true" />Reset</button>
      </div>
      {errors.length > 0 && <div className="calculator-status error" role="alert"><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    </form>
    <section className="finance-results-panel" aria-label="Your Dental Loan Payments" aria-live="polite">
      <h2>Your Dental Loan Payments</h2>
      <PaymentSummary label="Scheduled monthly payment" amount={money(result.monthlyPayment)} period={`${submitted.termMonths} months`} />
      <dl className="finance-breakdown">
        <div><dt>Amount financed</dt><dd>{money(result.principal)}</dd></div>
        <div><dt>Planned payment with extra</dt><dd>{money(result.plannedPayment)}</dd></div>
        <div><dt>Upfront out-of-pocket cost</dt><dd>{money(result.upfrontCost)}</dd></div>
        <div><dt>Total interest</dt><dd>{money(result.totalInterest)}</dd></div>
        <div><dt>Total loan fees</dt><dd>{money(result.fee)}</dd></div>
        <div><dt>Total loan payments</dt><dd>{money(result.totalLoanPayments)}</dd></div>
        <div><dt>Total out-of-pocket cost</dt><dd>{money(result.totalOutOfPocket)}</dd></div>
        <div><dt>Estimated payoff</dt><dd>{result.months} months</dd></div>
        {Number(submitted.extraPayment) > 0 && <><div><dt>Interest saved</dt><dd>{money(result.interestSaved)}</dd></div><div><dt>Months saved</dt><dd>{result.monthsSaved}</dd></div></>}
      </dl>
      {changed && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      {result.principal === 0 && <p className="finance-note">Treatment is fully covered by insurance and your down payment. No loan or loan fee is needed.</p>}
      <details className="finance-schedule"><summary>Payment details &amp; amortization schedule</summary>
        <p className="finance-note">Fixed interest accrues monthly on the remaining balance. Extra payments reduce principal; the final payment is capped at the amount owed. Calculations retain full precision and display cents, so lender rounding may differ.</p>
        <div className="finance-table-wrap"><table><caption>Dental loan amortization schedule</caption><thead><tr>{['Month', 'Payment', 'Principal', 'Interest', 'Balance'].map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment)}</td><td>{money(row.principal)}</td><td>{money(row.interest)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details>
      <p className="finance-note">This estimates a standard installment loan, including a true 0% rate. It does not model deferred-interest promotions, variable rates, penalties, or insurance reimbursement timing. Use the interest rate for payment math; a disclosed APR may also include fees.</p>
    </section>
  </CalculatorLayout>;
}
