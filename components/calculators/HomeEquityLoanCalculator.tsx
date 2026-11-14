'use client';
import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateHomeEquityLoan, type HomeEquityLoanInput } from '@/lib/home-equity-loan-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

const defaults = { homeValue: '400000', mortgageBalance: '250000', loanAmount: '30000', annualRate: '8', years: '15', fees: '0', maxCltv: '80' };
const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);
export function HomeEquityLoanCalculator() {
  const [values, setValues] = useState({ ...defaults }), [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateHomeEquityLoan(Object.fromEntries(Object.entries(submitted).map(([key, value]) => [key, Number(value)])) as HomeEquityLoanInput), [submitted]);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((old) => ({ ...old, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (Object.values(values).some((value) => value.trim() === '' || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1e12) || Number(values.homeValue) <= 0 || Number(values.loanAmount) <= 0 || Number(values.annualRate) > 100 || Number(values.maxCltv) <= 0 || Number(values.maxCltv) > 100 || Number(values.years) < 1 || Number(values.years) > 50 || !Number.isInteger(Number(values.years) * 12)) {
      setError('Enter positive home and loan amounts, nonnegative mortgage balance and fees, a rate up to 100%, a CLTV limit above 0% and up to 100%, and a term of 1–50 years in whole monthly payments.'); return;
    }
    setError(''); setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  return <CalculatorLayout id="home-equity-loan-calculator">
    <form className="finance-input-panel" onSubmit={calculate}><div className="finance-fields">
      <CalculatorNumberField label="Estimated home value" value={values.homeValue} onChange={set('homeValue')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Existing mortgage balance" value={values.mortgageBalance} onChange={set('mortgageBalance')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Home equity loan amount" value={values.loanAmount} onChange={set('loanAmount')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Annual interest rate" value={values.annualRate} onChange={set('annualRate')} unit="%" max={100} />
      <CalculatorNumberField label="Loan term" value={values.years} onChange={set('years')} unit="years" min={1} max={50} />
      <CalculatorNumberField label="Upfront closing costs and fees" value={values.fees} onChange={set('fees')} prefix="$" max={1e12} />
      <details className="finance-advanced"><summary>Assumed borrowing limit</summary><div className="finance-fields"><CalculatorNumberField label="Maximum combined loan-to-value" value={values.maxCltv} onChange={set('maxCltv')} unit="%" min={0.01} max={100} /></div><small>This is your hypothetical limit, not a lender approval. Include other outstanding liens in the existing mortgage balance.</small></details>
    </div><div className="calculator-form-actions"><button type="submit" className="calculator-calculate"><Calculator size={18} />Calculate Payment</button><button type="button" className="calculator-reset" onClick={reset}><RotateCcw size={17} />Reset</button></div>{error && <p role="alert" className="calculator-status error">{error}</p>}</form>
    <section className="finance-results-panel" aria-live="polite"><h2>Your Home Equity Loan Estimate</h2><div className="calculator-payment-summaries">
      <PaymentSummary label="Estimated monthly principal and interest" amount={money(result.monthlyPayment)} period={`${submitted.years} years`} />
      <PaymentSummary label="Additional borrowing under assumed limit" amount={money(result.borrowingCapacity)} period={`${submitted.maxCltv}% CLTV`} secondary />
    </div><dl className="calculator-totals"><div><dt>Total loan interest</dt><dd>{money(result.totalInterest)}</dd></div><div><dt>Upfront fees</dt><dd>{money(result.fees)}</dd></div><div><dt>Repayment plus fees</dt><dd>{money(result.totalCostWithFees)}</dd></div></dl>
      {JSON.stringify(values) !== JSON.stringify(submitted) && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      {result.exceedsAssumedLimit && <p role="status" className="finance-note warning">The requested loan exceeds your assumed CLTV limit. The payment shown still estimates the requested amount; it does not indicate eligibility or approval.</p>}
      <details className="finance-schedule"><summary>Equity, CLTV &amp; repayment schedule</summary><dl className="finance-breakdown"><div><dt>Current home equity</dt><dd>{money(result.equity)}</dd></div><div><dt>Combined loan-to-value after borrowing</dt><dd>{result.combinedLtv === null ? 'Not available' : `${result.combinedLtv.toFixed(2)}%`}</dd></div><div><dt>Loan repayments before upfront fees</dt><dd>{money(result.totalLoanPayments)}</dd></div></dl>
        <div className="finance-table-wrap"><table><caption>Home equity loan amortization schedule</caption><thead><tr>{['Month', 'Payment', 'Interest', 'Principal', 'Balance'].map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment)}</td><td>{money(row.interest)}</td><td>{money(row.principalPaid)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details><p className="calculator-status">Fixed-rate monthly estimate. Fees are paid upfront and are not financed. Your existing mortgage payment is separate. Calculations use unrounded payments; worked examples may round totals. Borrowing limits and eligibility depend on lender requirements, income, credit and property valuation.</p>
    </section>
  </CalculatorLayout>;
}
