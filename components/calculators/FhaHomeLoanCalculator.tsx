'use client';
import { useMemo, useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { calculateFhaLoan } from '@/lib/fha-loan-calculations';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';
const defaults = { price: '300000', down: '10500', rate: '6.5', years: '30', tax: '0', insurance: '0', hoa: '0', upfrontRate: '1.75', mipRate: '0.55', finance: 'financed' as 'financed' | 'cash', duration: 'auto' as 'auto' | 'term' | '11-years', closing: '0', limit: '541287' };
const money = (number: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(number);
export function FhaHomeLoanCalculator() {
  const [values, setValues] = useState({ ...defaults }), [submitted, setSubmitted] = useState({ ...defaults });
  const [error, setError] = useState('');
  const result = useMemo(() => calculateFhaLoan({ homePrice: Number(submitted.price), downPayment: Number(submitted.down), annualRate: Number(submitted.rate), years: Number(submitted.years), upfrontMipRate: Number(submitted.upfrontRate), annualMipRate: Number(submitted.mipRate), financeUpfrontMip: submitted.finance === 'financed', mipDuration: submitted.duration, annualTax: Number(submitted.tax), annualInsurance: Number(submitted.insurance), monthlyHoa: Number(submitted.hoa), closingCosts: Number(submitted.closing), countyLimit: Number(submitted.limit) }), [submitted]);
  const set = (key: keyof typeof defaults) => (value: string) => setValues((old) => ({ ...old, [key]: value }));
  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = Object.entries(values).filter(([key]) => key !== 'finance' && key !== 'duration').some(([, raw]) => raw.trim() === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0 || Number(raw) > 1e12);
    if (invalid || Number(values.price) <= 0 || Number(values.down) >= Number(values.price) || Number(values.rate) > 100 || Number(values.years) < 1 || Number(values.years) > 30 || !Number.isInteger(Number(values.years) * 12) || Number(values.upfrontRate) > 10 || Number(values.mipRate) > 10) {
      setError('Check your amounts. The down payment must be below the home price. Use nonnegative costs, a rate up to 100%, MIP rates up to 10%, and a term of 1–30 years in whole monthly payments.'); return;
    }
    setError(''); setSubmitted({ ...values });
  }
  function reset() { setValues({ ...defaults }); setSubmitted({ ...defaults }); setError(''); }
  return <CalculatorLayout id="fha-home-loan-calculator">
    <form className="finance-input-panel" onSubmit={calculate}><div className="finance-fields">
      <CalculatorNumberField label="Home price" value={values.price} onChange={set('price')} prefix="$" min={1} max={1e12} />
      <CalculatorNumberField label="Down payment" value={values.down} onChange={set('down')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Annual mortgage interest rate" value={values.rate} onChange={set('rate')} unit="%" max={100} />
      <CalculatorNumberField label="Loan term" value={values.years} onChange={set('years')} unit="years" min={1} max={30} />
      <CalculatorNumberField label="Annual property taxes" value={values.tax} onChange={set('tax')} prefix="$" max={1e12} />
      <CalculatorNumberField label="Annual homeowners insurance" value={values.insurance} onChange={set('insurance')} prefix="$" max={1e12} />
      <details className="finance-advanced"><summary>FHA insurance, fees &amp; county limit</summary><div className="finance-fields">
        <CalculatorNumberField label="Assumed upfront MIP rate" value={values.upfrontRate} onChange={set('upfrontRate')} unit="%" max={10} />
        <CalculatorNumberField label="Assumed annual MIP rate" value={values.mipRate} onChange={set('mipRate')} unit="%" max={10} />
        <label className="finance-field"><span>Upfront MIP payment</span><select aria-label="Upfront MIP payment" value={values.finance} onChange={(event) => set('finance')(event.target.value)}><option value="financed">Finance into the mortgage</option><option value="cash">Pay at closing</option></select></label>
        <label className="finance-field"><span>Annual MIP duration assumption</span><select aria-label="Annual MIP duration assumption" value={values.duration} onChange={(event) => set('duration')(event.target.value)}><option value="auto">11 years at base LTV ≤ 90%; otherwise full term</option><option value="term">Full mortgage term</option><option value="11-years">11 years, capped at the loan term</option></select></label>
        <CalculatorNumberField label="Monthly HOA fees" value={values.hoa} onChange={set('hoa')} prefix="$" max={1e12} />
        <CalculatorNumberField label="Other upfront closing costs" value={values.closing} onChange={set('closing')} prefix="$" max={1e12} />
        <CalculatorNumberField label="Entered county base-loan limit (0 to skip)" value={values.limit} onChange={set('limit')} prefix="$" max={1e12} />
      </div><small>Default limit is the 2026 one-unit low-cost figure. Enter your applicable county and property limit. MIP rates depend on loan amount, LTV, term and applicable HUD rules; use your Loan Estimate.</small></details>
    </div><div className="calculator-form-actions"><button className="calculator-calculate" type="submit"><Calculator size={18} />Calculate Payment</button><button className="calculator-reset" type="button" onClick={reset}><RotateCcw size={17} />Reset</button></div>{error && <p role="alert" className="calculator-status error">{error}</p>}</form>
    <section className="finance-results-panel" aria-live="polite"><h2>Your FHA Home Loan Estimate</h2><div className="calculator-payment-summaries">
      <PaymentSummary label="Estimated initial total monthly payment" amount={money(result.firstMonthlyPayment)} period={`${submitted.years} years`} />
      <PaymentSummary label="Monthly principal and interest" amount={money(result.monthlyPrincipalInterest)} period="Fixed rate" secondary />
    </div><dl className="calculator-totals"><div><dt>Financed loan balance</dt><dd>{money(result.financedLoan)}</dd></div><div><dt>Upfront MIP</dt><dd>{money(result.upfrontMip)}</dd></div><div><dt>Initial monthly MIP</dt><dd>{money(result.initialMonthlyMip)}</dd></div></dl>
      <p className="calculator-status">Annual MIP assumption: {submitted.mipRate}%. Estimated insurance duration: {result.mipMonths / 12} years. Add property taxes and homeowners insurance above for a fuller monthly housing estimate.</p>
      {JSON.stringify(values) !== JSON.stringify(submitted) && <p className="calculator-status">Inputs changed. Select Calculate Payment to update your results.</p>}
      {result.exceedsEnteredCountyLimit && <p role="status" className="finance-note warning">The base loan exceeds your entered county limit. Verify the applicable HUD limit; this is not an eligibility decision.</p>}
      {result.belowStandardDownPayment && <p role="status" className="finance-note warning">This down payment is below the standard 3.5% maximum-financing assumption. Credit and other eligibility requirements are not evaluated.</p>}
      <details className="finance-schedule"><summary>Insurance, cash costs &amp; payment schedule</summary><dl className="finance-breakdown"><div><dt>Base loan before upfront MIP</dt><dd>{money(result.baseLoan)}</dd></div><div><dt>Original base loan-to-value</dt><dd>{result.baseLtv?.toFixed(2)}%</dd></div><div><dt>Down payment percentage</dt><dd>{result.downPercent.toFixed(2)}%</dd></div><div><dt>Down payment and entered cash closing costs</dt><dd>{money(result.cashAtClosing)}</dd></div><div><dt>Loan interest over the term</dt><dd>{money(result.loanInterest)}</dd></div><div><dt>Estimated annual MIP premiums over the term</dt><dd>{money(result.totalAnnualMip)}</dd></div><div><dt>Total upfront and annual mortgage insurance</dt><dd>{money(result.totalMortgageInsurance)}</dd></div></dl>
        <div className="finance-table-wrap"><table><caption>Estimated FHA payment and insurance schedule</caption><thead><tr>{['Month', 'Principal & interest', 'Interest', 'Annual MIP installment', 'Total housing payment', 'Loan balance'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month}><td>{row.month}</td><td>{money(row.payment)}</td><td>{money(row.interest)}</td><td>{money(row.mip)}</td><td>{money(row.housingPayment)}</td><td>{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details><p className="calculator-status">Planning estimate, not a qualification or lender quote. Annual MIP is approximated using the base-loan balance at each loan year’s start and is reset annually; HUD and lender calculations may differ. Taxes, insurance and HOA stay constant. Other closing costs are paid in cash. Loan-limit checks use the base loan, excluding financed upfront MIP.</p>
    </section>
  </CalculatorLayout>;
}
