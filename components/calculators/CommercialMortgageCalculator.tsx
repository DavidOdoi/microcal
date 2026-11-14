'use client';
import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateCommercialMortgage } from '@/lib/commercial-mortgage-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';
const defaults = { price: '750000', down: '250000', loan: '500000', rate: '7', amortization: '20', maturity: '20', fees: '0', noi: '60000' };
const money = (number: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);
export function CommercialMortgageCalculator() {
  const [values, setValues] = useState({ ...defaults }), [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateCommercialMortgage({ propertyPrice: Number(submitted.price), loanAmount: Number(submitted.loan), annualRate: Number(submitted.rate), amortizationYears: Number(submitted.amortization), maturityYears: Number(submitted.maturity), upfrontFees: Number(submitted.fees), annualNoi: submitted.noi.trim() === '' ? null : Number(submitted.noi) }), [submitted]);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((old) => {
    const next = { ...old, [key]: value };
    if (key === 'price' || key === 'down') next.loan = next.price.trim() === '' || next.down.trim() === '' ? '' : String(Math.max(0, Number(next.price) - Number(next.down)));
    if (key === 'loan') next.down = next.price.trim() === '' || value.trim() === '' ? '' : String(Number(next.price) - Number(value));
    return next;
  });
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = Object.entries(values).some(([key, raw]) => !(key === 'noi' && raw.trim() === '') && (raw.trim() === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0 || Number(raw) > 1e12));
    if (invalid || Number(values.price) <= 0 || Number(values.loan) <= 0 || Number(values.loan) > Number(values.price) || Number(values.rate) > 100 || Number(values.amortization) < 1 || Number(values.amortization) > 50 || Number(values.maturity) < 1 || Number(values.maturity) > Number(values.amortization) || !Number.isInteger(Number(values.amortization) * 12) || !Number.isInteger(Number(values.maturity) * 12)) {
      setError('Check the property and loan amounts. Use a rate up to 100%, amortization of 1–50 years, and a maturity no longer than amortization. Terms must contain whole monthly payments.'); return;
    }
    setError(''); setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  return <CalculatorLayout id="commercial-mortgage-calculator">
    <form className="finance-input-panel" onSubmit={calculate}><div className="finance-fields">
      <CalculatorNumberField label="Property price" value={values.price} onChange={set('price')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Down payment" value={values.down} onChange={set('down')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Loan amount" value={values.loan} onChange={set('loan')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Annual interest rate" value={values.rate} onChange={set('rate')} unit="%" max={100} />
      <CalculatorNumberField label="Amortization period" value={values.amortization} onChange={set('amortization')} unit="years" min={1} max={50} />
      <CalculatorNumberField label="Loan term to maturity" value={values.maturity} onChange={set('maturity')} unit="years" min={1} max={50} />
      <details className="finance-advanced"><summary>Fees and property cash flow</summary><div className="finance-fields"><CalculatorNumberField label="Upfront lender and closing fees" value={values.fees} onChange={set('fees')} prefix="$" max={1e12} /><CalculatorNumberField label="Annual net operating income (optional)" value={values.noi} onChange={set('noi')} prefix="$" max={1e12} /></div></details>
    </div><div className="calculator-form-actions"><button className="calculator-calculate" type="submit"><Calculator size={18} />Calculate Payment</button><button className="calculator-reset" type="button" onClick={reset}><RotateCcw size={17} />Reset</button></div>{error && <p role="alert" className="calculator-status error">{error}</p>}</form>
    <section className="finance-results-panel" aria-live="polite"><h2>Your Commercial Mortgage Estimate</h2><div className="calculator-payment-summaries">
      <PaymentSummary label="Monthly principal and interest" amount={money(result.monthlyPayment)} period={`${submitted.amortization}-year amortization`} />
      <PaymentSummary label="Balloon due after scheduled term payments" amount={money(result.balloon)} period={`At ${submitted.maturity} years`} secondary />
    </div><dl className="calculator-totals"><div><dt>Interest during term</dt><dd>{money(result.interestDuringTerm)}</dd></div><div><dt>Upfront fees</dt><dd>{money(result.upfrontFees)}</dd></div><div><dt>Payments + balloon + fees</dt><dd>{money(result.totalRepaymentWithBalloonAndFees)}</dd></div></dl>
      {JSON.stringify(values) !== JSON.stringify(submitted) && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      <details className="finance-schedule"><summary>LTV, debt coverage &amp; amortization</summary><dl className="finance-breakdown"><div><dt>Loan amount</dt><dd>{money(result.loanAmount)}</dd></div><div><dt>Down payment</dt><dd>{money(result.downPayment)}</dd></div><div><dt>Loan-to-value</dt><dd>{result.ltv === null ? 'Not available' : `${result.ltv.toFixed(2)}%`}</dd></div><div><dt>Annual scheduled debt service</dt><dd>{money(result.annualDebtService)}</dd></div><div><dt>Illustrative DSCR</dt><dd>{result.dscr === null ? 'Enter annual NOI' : result.dscr.toFixed(2)}</dd></div></dl>
        <div className="finance-table-wrap"><table><caption>Regular payments before the balloon</caption><thead><tr>{['Month', 'Payment', 'Interest', 'Principal', 'Balance'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment)}</td><td>{money(row.interest)}</td><td>{money(row.principalPaid)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details><p className="calculator-status">Fixed-rate amortizing estimate. Fees are paid upfront. Taxes, insurance, operating expenses and interest-only periods are excluded from loan payments. DSCR uses entered annual NOI divided by scheduled annual payments, excluding the balloon; lender definitions differ. A balloon requires separate repayment or refinancing.</p>
    </section>
  </CalculatorLayout>;
}
