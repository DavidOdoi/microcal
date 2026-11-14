'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, Info, RotateCcw } from 'lucide-react';
import { calculateHeloc } from '@/lib/batch-four-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { balance: '40000', rate: '8', drawMonths: '60', repaymentYears: '15', type: 'interest-only' as 'interest-only' | 'principal-interest', drawPrincipal: '500', additionalDraw: '0', extra: '0', monthlyFee: '0', annualFee: '0', futureRate: '' };
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

function validate(values: typeof defaults) {
  const limits = { balance: 1e12, rate: 100, drawMonths: 1200, repaymentYears: 100, drawPrincipal: 1e12, additionalDraw: 1e12, extra: 1e12, monthlyFee: 1e12, annualFee: 1e12, futureRate: 100 };
  return Object.entries(limits).filter(([key, max]) => {
    const raw = values[key as keyof typeof limits];
    if (key === 'futureRate' && raw.trim() === '') return false;
    if (key === 'drawPrincipal' && values.type === 'interest-only') return false;
    const number = Number(raw);
    return raw.trim() === '' || !Number.isFinite(number) || number < 0 || number > max
      || (key === 'repaymentYears' && number === 0)
      || (key === 'drawMonths' && !Number.isInteger(number));
  }).map(([key]) => key);
}

function estimate(values: typeof defaults) {
  return calculateHeloc({ balance: Number(values.balance), annualRatePercent: Number(values.rate), drawMonths: Number(values.drawMonths), repaymentYears: Number(values.repaymentYears), drawPaymentType: values.type, drawPrincipalPayment: Number(values.drawPrincipal), additionalDraw: Number(values.additionalDraw), extraPrincipal: Number(values.extra), monthlyFee: Number(values.monthlyFee), annualFee: Number(values.annualFee), repaymentRatePercent: values.futureRate.trim() === '' ? null : Number(values.futureRate) });
}

export function HelocCalculator() {
  const [values, setValues] = useState({ ...defaults });
  const [submitted, setSubmitted] = useState({ ...defaults });
  const [errors, setErrors] = useState<string[]>([]);
  const result = useMemo(() => estimate(submitted), [submitted]);
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validate(values);
    setErrors(invalid);
    if (!invalid.length) setSubmitted({ ...values });
  }
  function reset() {
    setValues({ ...defaults });
    setSubmitted({ ...defaults });
    setErrors([]);
  }
  return <CalculatorLayout id="heloc-calculator" className="heloc-calculator">
    <form className="finance-input-panel" onSubmit={calculate}>
      <div className="finance-fields">
        <CalculatorNumberField label="HELOC balance" value={values.balance} onChange={set('balance')} prefix="$" max={1e12} />
        <CalculatorNumberField label="Interest rate (APR)" value={values.rate} onChange={set('rate')} unit="%" max={100} />
        <CalculatorNumberField label="Draw period remaining" value={values.drawMonths} onChange={set('drawMonths')} unit="months" max={1200} step="1" />
        <CalculatorNumberField label="Repayment period" value={values.repaymentYears} onChange={set('repaymentYears')} unit="years" min={0.01} max={100} />
        <fieldset className="calculator-payment-options">
          <legend>Draw-period payment type <span title="Interest-only payments cover interest; principal and interest payments also reduce the balance."><Info size={14} aria-label="Interest-only payments cover interest; principal and interest payments also reduce the balance." /></span></legend>
          <div className="calculator-radio-options">
            <label><input type="radio" name="heloc-payment-type" value="interest-only" checked={values.type === 'interest-only'} onChange={() => set('type')('interest-only')} /><span>Interest only</span></label>
            <label><input type="radio" name="heloc-payment-type" value="principal-interest" checked={values.type === 'principal-interest'} onChange={() => set('type')('principal-interest')} /><span>Principal &amp; interest</span></label>
          </div>
        </fieldset>
        {values.type === 'principal-interest' && <CalculatorNumberField label="Draw-period principal-and-interest payment" value={values.drawPrincipal} onChange={set('drawPrincipal')} prefix="$" max={1e12} />}
        <details className="finance-advanced">
          <summary>Advanced settings</summary>
          <div className="finance-fields">
            <CalculatorNumberField label="Additional draw now" value={values.additionalDraw} onChange={set('additionalDraw')} prefix="$" max={1e12} />
            <CalculatorNumberField label="Extra principal each draw month" value={values.extra} onChange={set('extra')} prefix="$" max={1e12} />
            <CalculatorNumberField label="Monthly fee" value={values.monthlyFee} onChange={set('monthlyFee')} prefix="$" max={1e12} />
            <CalculatorNumberField label="Annual fee" value={values.annualFee} onChange={set('annualFee')} prefix="$" max={1e12} />
            <CalculatorNumberField label="Repayment interest rate (optional)" value={values.futureRate} onChange={set('futureRate')} unit="%" max={100} />
          </div>
        </details>
      </div>
      <div className="calculator-form-actions">
        <button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />Calculate Payment</button>
        <button className="calculator-reset" type="button" onClick={reset}><RotateCcw size={17} aria-hidden="true" />Reset</button>
      </div>
      {errors.length > 0 && <p className="calculator-status error" role="alert">Check your inputs. Use nonnegative amounts, a rate up to 100%, whole draw months up to 1,200, and a repayment period above zero and up to 100 years.</p>}
    </form>
    <section className="finance-results-panel" aria-live="polite" aria-label="Your HELOC Payments">
      <h2>Your HELOC Payments</h2>
      <div className="calculator-payment-summaries">
        <PaymentSummary label="During draw period (monthly)" amount={money(result.drawMonthlyCost)} period={`Next ${submitted.drawMonths} months`} />
        <PaymentSummary label="During repayment period (monthly)" amount={money(result.repaymentMonthlyCost)} period={`${submitted.repaymentYears} years`} secondary />
      </div>
      <dl className="calculator-totals">
        <div><dt>Total interest</dt><dd>{money(result.totalInterest)}</dd></div>
        <div><dt>Total fees</dt><dd>{money(result.totalFees)}</dd></div>
        <div><dt>Total repayment</dt><dd>{money(result.totalRepayment)}</dd></div>
      </dl>
      {changed && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      <details className="finance-schedule"><summary>Payment details &amp; amortization schedule</summary>
        <dl className="finance-breakdown"><div><dt>Balance entering repayment</dt><dd>{money(result.endingDrawBalance)}</dd></div><div><dt>Monthly payment increase</dt><dd>{money(result.paymentIncrease)}</dd></div></dl>
        <p className="finance-note">The estimate uses {result.drawRatePercent}% during the draw period and {result.repaymentRatePercent}% during repayment. Annual fees are spread evenly over modeled months. Actual lender payments may differ.</p>
        <div className="finance-table-wrap"><table><caption>HELOC amortization schedule</caption><thead><tr>{['Month', 'Phase', 'Interest', 'Principal', 'Payment', 'Fees', 'Balance'].map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{row.phase}</td><td>{money(row.interest)}</td><td>{money(row.principalPaid)}</td><td>{money(row.payment)}</td><td>{money(row.fees)}</td><td>{money(row.endingBalance)}</td></tr>)}</tbody></table></div>
      </details>
    </section>
  </CalculatorLayout>;
}
