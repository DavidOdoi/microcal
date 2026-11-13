'use client';

import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { calculateCd, calculateDti, calculateEmergencyFund, cdTermMonths, resetCalculatorValues, roundCurrency, type CdCompounding, type CdRateMode } from '@/lib/financial-calculations';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const percent = (value: number | null) => value === null || !Number.isFinite(value) ? '—' : `${value.toFixed(1)}%`;
const amount = (value: number) => money.format(roundCurrency(value));
const numeric = (value: string) => { const n = Number(value); return Number.isFinite(n) ? Math.min(1_000_000_000_000, Math.max(0, n)) : 0; };

function NumberField({ label, value, onChange, help, min = 0, max = 1_000_000_000 }: {
  label: string; value: string; onChange: (value: string) => void; help?: string; min?: number; max?: number;
}) {
  const id = `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <label className="finance-field" htmlFor={id}><span>{label}</span><input id={id} type="number" inputMode="decimal" min={min} max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} aria-describedby={help ? `${id}-help` : undefined} />{help && <small id={`${id}-help`}>{help}</small>}</label>;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return <button className="finance-utility-button" type="button" onClick={async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); }
  }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy results'}</button>;
}

function UtilityButtons({ reset, copyText }: { reset: () => void; copyText: string }) {
  return <div className="finance-utilities"><button className="finance-utility-button" type="button" onClick={reset}><RotateCcw size={16} />Reset</button><CopyButton text={copyText} /></div>;
}

function ResultMetric({ label, value, primary = false }: { label: string; value: string; primary?: boolean }) {
  return <div className={primary ? 'finance-result-metric primary' : 'finance-result-metric'}><span>{label}</span><strong>{value}</strong></div>;
}

const initialDti = { income: '5000', housing: '1500', housingType: 'mortgage' as 'mortgage' | 'rent', car: '300', student: '0', personal: '0', cards: '100', other: '0', proposed: '0' };
export function DtiCalculator() {
  const [v, setV] = useState(initialDti);
  const set = (key: keyof typeof initialDti) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  const result = calculateDti({ grossMonthlyIncome: numeric(v.income), housingPayment: numeric(v.housing), housingType: v.housingType,
    carPayment: numeric(v.car), studentLoanPayment: numeric(v.student), personalLoanPayment: numeric(v.personal),
    creditCardMinimums: numeric(v.cards), otherDebt: numeric(v.other), proposedLoanPayment: numeric(v.proposed) });
  const rows = [['Housing (mortgage)', v.housingType === 'mortgage' ? numeric(v.housing) : 0], ['Auto loan', numeric(v.car)], ['Student loans', numeric(v.student)], ['Personal loans', numeric(v.personal)], ['Credit card minimums', numeric(v.cards)], ['Other debt', numeric(v.other)]] as const;
  const copy = `Debt-to-income ratio: ${percent(result.dtiPercent)}\nQualifying monthly debt: ${amount(result.qualifyingDebt)}\nGross monthly income: ${amount(result.grossMonthlyIncome)}${result.projectedDtiPercent === null ? '' : `\nProjected DTI: ${percent(result.projectedDtiPercent)}`}`;
  return <div className="finance-calculator-grid"><section className="finance-input-panel"><div className="finance-panel-heading"><div><span className="finance-kicker">Your monthly numbers</span><h2>Enter income and payments</h2></div><UtilityButtons reset={() => setV(resetCalculatorValues(initialDti))} copyText={copy} /></div>
    <div className="finance-fields"><NumberField label="Gross monthly income" value={v.income} onChange={set('income')} help="Before taxes and payroll deductions." />
      <NumberField label={v.housingType === 'mortgage' ? 'Monthly mortgage payment' : 'Monthly rent payment'} value={v.housing} onChange={set('housing')} />
      <label className="finance-field"><span>Housing payment type</span><select value={v.housingType} onChange={(e) => setV((old) => ({ ...old, housingType: e.target.value as 'mortgage' | 'rent' }))}><option value="mortgage">Mortgage (count in DTI)</option><option value="rent">Rent (shown, excluded from standard DTI)</option></select><small>Lender treatment can vary by loan program.</small></label>
      <NumberField label="Car loan payment" value={v.car} onChange={set('car')} /><NumberField label="Student loan payment" value={v.student} onChange={set('student')} />
      <NumberField label="Personal loan payment" value={v.personal} onChange={set('personal')} /><NumberField label="Minimum credit card payments" value={v.cards} onChange={set('cards')} />
      <NumberField label="Other monthly debt" value={v.other} onChange={set('other')} /><NumberField label="Proposed new loan payment (optional)" value={v.proposed} onChange={set('proposed')} help="Used only for the projected DTI." />
    </div></section>
    <section className="finance-results-panel" aria-live="polite"><span className="finance-kicker">Your estimate</span><h2>Debt-to-income ratio</h2>
      {result.dtiPercent === null ? <div className="finance-empty-result">Enter gross monthly income above zero to calculate your DTI.</div> : <>
        <ResultMetric label="Current DTI" value={percent(result.dtiPercent)} primary /><div className="finance-result-grid"><ResultMetric label="Qualifying monthly debt" value={amount(result.qualifyingDebt)} /><ResultMetric label="Gross monthly income" value={amount(result.grossMonthlyIncome)} /><ResultMetric label="Income remaining before taxes & other expenses" value={percent(result.remainingPercent)} />{result.projectedDtiPercent !== null && <ResultMetric label="Projected DTI with new loan" value={percent(result.projectedDtiPercent)} />}</div>
        <h3 className="finance-breakdown-title">Monthly payment breakdown</h3><dl className="finance-breakdown">{rows.map(([label, val]) => <div key={label}><dt>{label}</dt><dd>{amount(val)}</dd></div>)}</dl>
        {result.rentExcluded && <p className="finance-note">Rent is displayed but excluded from this standard DTI estimate. When evaluating a mortgage, lenders generally count the proposed mortgage payment rather than rent; treatment may vary by loan product.</p>}
        {result.dtiPercent > 100 && <p className="finance-note warning">Your entered qualifying debt is greater than your gross monthly income. Check the amounts and payment periods.</p>}
      </>}
    </section>
  </div>;
}

const initialEmergency = { housing: '1200', groceries: '450', utilities: '180', transportation: '250', insurance: '180', debt: '250', other: '100', savings: '2000', contribution: '500', coverage: '6' };
export function EmergencyFundCalculator() {
  const [v, setV] = useState(initialEmergency);
  const set = (key: keyof typeof initialEmergency) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  const result = calculateEmergencyFund({ housing: numeric(v.housing), groceries: numeric(v.groceries), utilities: numeric(v.utilities), transportation: numeric(v.transportation), insurance: numeric(v.insurance), essentialDebt: numeric(v.debt), otherEssential: numeric(v.other), currentSavings: numeric(v.savings), monthlyContribution: numeric(v.contribution), targetMonths: numeric(v.coverage) });
  const copy = `Emergency fund target: ${amount(result.target)} (${result.targetMonths} months)\nEssential monthly expenses: ${amount(result.monthlyExpenses)}\nCurrent savings: ${amount(result.currentSavings)}\nRemaining to goal: ${amount(result.remaining)}\nMonths to goal: ${result.monthsToGoal ?? 'Cannot estimate without a savings contribution'}`;
  return <div className="finance-calculator-grid"><section className="finance-input-panel"><div className="finance-panel-heading"><div><span className="finance-kicker">Monthly essentials</span><h2>Estimate your savings goal</h2></div><UtilityButtons reset={() => setV(resetCalculatorValues(initialEmergency))} copyText={copy} /></div>
      <div className="finance-fields"><NumberField label="Housing" value={v.housing} onChange={set('housing')} /><NumberField label="Groceries" value={v.groceries} onChange={set('groceries')} /><NumberField label="Utilities" value={v.utilities} onChange={set('utilities')} /><NumberField label="Transportation" value={v.transportation} onChange={set('transportation')} /><NumberField label="Insurance" value={v.insurance} onChange={set('insurance')} /><NumberField label="Essential debt payments" value={v.debt} onChange={set('debt')} /><NumberField label="Other essential expenses" value={v.other} onChange={set('other')} /><NumberField label="Current emergency savings" value={v.savings} onChange={set('savings')} /><NumberField label="Monthly savings contribution" value={v.contribution} onChange={set('contribution')} />
      <div className="finance-field"><label htmlFor="coverage-months">Target coverage</label><select id="coverage-months" value={['3','6','9','12'].includes(v.coverage) ? v.coverage : 'custom'} onChange={(e) => { if (e.target.value === 'custom') set('coverage')('5'); else set('coverage')(e.target.value); }}><option value="3">3 months</option><option value="6">6 months</option><option value="9">9 months</option><option value="12">12 months</option><option value="custom">Custom</option></select>{(!['3','6','9','12'].includes(v.coverage)) && <NumberField label="Custom coverage (months)" value={v.coverage} onChange={set('coverage')} min={1} max={120} />}</div>
    </div></section>
    <section className="finance-results-panel" aria-live="polite"><span className="finance-kicker">Your savings plan</span><h2>Emergency fund target</h2><ResultMetric label={`${result.targetMonths} months of essential expenses`} value={amount(result.target)} primary />
      <div className="finance-result-grid"><ResultMetric label="Essential monthly expenses" value={amount(result.monthlyExpenses)} /><ResultMetric label="Current savings" value={amount(result.currentSavings)} /><ResultMetric label="Still needed" value={amount(result.remaining)} /><ResultMetric label="Expenses currently covered" value={result.monthsCovered === null ? '—' : `${result.monthsCovered.toFixed(1)} months`} /><ResultMetric label="Estimated time to goal" value={result.monthsToGoal === null ? 'Cannot estimate without a savings contribution' : `${result.monthsToGoal} months`} /></div>
      <div className="finance-progress-label"><span>Progress</span><strong>{result.progressPercent.toFixed(0)}%</strong></div><div className="finance-progress" role="progressbar" aria-label="Emergency savings progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(result.progressPercent)}><span style={{ width: `${result.progressPercent}%` }} /></div>
      <p className="finance-note">This target is a planning choice, not a universal requirement. The estimate assumes no interest, withdrawals, or changes to expenses while saving.</p><UtilityButtons reset={() => setV(resetCalculatorValues(initialEmergency))} copyText={copy} />
    </section>
  </div>;
}

const initialCd = { deposit: '10000', rate: '4', term: '24', termUnit: 'months' as 'months' | 'years', mode: 'apy' as CdRateMode, compounding: '12' as `${CdCompounding}`, penalty: '0' };
export function CdInterestCalculator() {
  const [v, setV] = useState(initialCd);
  const set = (key: keyof typeof initialCd) => (value: string) => setV((old) => ({ ...old, [key]: value }));
  const termMonths = cdTermMonths(numeric(v.term), v.termUnit);
  const compounding = Number(v.compounding) as CdCompounding;
  const result = calculateCd({ principal: numeric(v.deposit), annualRatePercent: numeric(v.rate), termMonths, mode: v.mode, compounding, earlyWithdrawalPenalty: numeric(v.penalty) });
  const copy = `CD maturity value: ${amount(result.maturityValue)}\nInitial deposit: ${amount(result.principal)}\nInterest earned: ${amount(result.interestEarned)}\nEffective annual yield: ${(result.effectiveAnnualYield * 100).toFixed(2)}%${numeric(v.penalty) > 0 ? `\nNet after entered penalty: ${amount(result.netAfterPenalty)}` : ''}`;
  const points = result.chart.map((point) => `${(point.year / Math.max(termMonths / 12, 0.001) * 100).toFixed(2)},${(50 - (point.balance / Math.max(result.maturityValue, 1)) * 50).toFixed(2)}`).join(' ');
  return <div className="finance-calculator-grid"><section className="finance-input-panel"><div className="finance-panel-heading"><div><span className="finance-kicker">Deposit and rate</span><h2>Set your CD terms</h2></div><UtilityButtons reset={() => setV(resetCalculatorValues(initialCd))} copyText={copy} /></div>
    <div className="finance-fields"><NumberField label="Initial deposit" value={v.deposit} onChange={set('deposit')} /><NumberField label={v.mode === 'apy' ? 'Annual percentage yield (APY)' : 'Nominal annual interest rate'} value={v.rate} onChange={set('rate')} help={v.mode === 'apy' ? 'APY already reflects compounding. It is not compounded again.' : 'The stated annual interest rate before compounding.'} max={100} />
      <div className="finance-field"><span>Rate input type</span><div className="finance-radio-row"><label><input type="radio" name="rate-mode" checked={v.mode === 'apy'} onChange={() => setV((old) => ({ ...old, mode: 'apy' }))} />APY</label><label><input type="radio" name="rate-mode" checked={v.mode === 'nominal'} onChange={() => setV((old) => ({ ...old, mode: 'nominal' }))} />Nominal rate</label></div></div>
      <div className="finance-fields inline"><NumberField label="CD term" value={v.term} onChange={set('term')} max={v.termUnit === 'years' ? 100 : 1200} /><label className="finance-field"><span>Term unit</span><select value={v.termUnit} onChange={(e) => setV((old) => ({ ...old, termUnit: e.target.value as 'months' | 'years' }))}><option value="months">Months</option><option value="years">Years</option></select></label></div>
      {v.mode === 'nominal' && <label className="finance-field"><span>Compounding frequency</span><select value={v.compounding} onChange={(e) => set('compounding')(e.target.value)}><option value="1">Annually</option><option value="2">Semiannually</option><option value="4">Quarterly</option><option value="12">Monthly</option><option value="365">Daily</option></select></label>}
      <NumberField label="Actual early-withdrawal penalty (optional)" value={v.penalty} onChange={set('penalty')} help="Enter the dollar penalty from your CD agreement. Leave at $0 if unknown." />
    </div></section>
    <section className="finance-results-panel" aria-live="polite"><span className="finance-kicker">At maturity</span><h2>CD interest estimate</h2><ResultMetric label="Maturity value" value={amount(result.maturityValue)} primary />
      <div className="finance-result-grid"><ResultMetric label="Initial deposit" value={amount(result.principal)} /><ResultMetric label="Interest earned" value={amount(result.interestEarned)} /><ResultMetric label="Effective annual yield" value={`${(result.effectiveAnnualYield * 100).toFixed(2)}%`} />{numeric(v.penalty) > 0 && <><ResultMetric label="Entered withdrawal penalty" value={amount(result.estimatedPenalty)} /><ResultMetric label="Estimated amount after penalty" value={amount(result.netAfterPenalty)} /></>}</div>
      <div className="cd-chart-wrap"><h3>Estimated balance growth</h3><svg className="cd-chart" viewBox="0 0 100 55" role="img" aria-label="Chart showing CD balance increasing from the deposit to maturity"><line x1="0" y1="54" x2="100" y2="54" /><polyline points={points} /></svg><div className="cd-chart-labels"><span>Deposit</span><span>Maturity</span></div></div>
      <p className="finance-note">APY mode assumes the stated APY remains applicable for the full term. Actual maturity value, compounding, interest crediting, penalties, and renewal terms depend on the institution’s account agreement.</p><UtilityButtons reset={() => setV(resetCalculatorValues(initialCd))} copyText={copy} />
    </section>
  </div>;
}
