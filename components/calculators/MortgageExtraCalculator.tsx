'use client';
import { calculateMortgageExtra, validateMortgageExtra, type MortgageExtraInput } from '@/lib/mortgage-extra-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioValues, type ScenarioField } from './ScenarioCalculator';
const now = new Date();
const firstDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth()+1, 1)).toISOString().slice(0,10);
const fields: ScenarioField[] = [
 { key: 'balance', label: 'Outstanding mortgage balance', prefix: '$', min: .01, value: '200000' },
 { key: 'rate', label: 'Annual interest rate', unit: '%', max: 100, value: '6' },
 { key: 'months', label: 'Remaining term', unit: 'months', min: 1, max: 600, step: '1', value: '360' },
 { key: 'extra', label: 'Extra monthly principal payment', prefix: '$', value: '200' },
 { key: 'firstDate', label: 'Next scheduled payment date', type: 'date', value: firstDate, help: 'Payoff dates count monthly payments from this date. Calendar dates do not change the monthly interest model.' },
 { key: 'regular', label: 'Regular monthly principal and interest', prefix: '$', optional: true, min: .01, value: '', advanced: true, help: 'Leave blank to derive the payment from the balance, rate, and remaining term. If entered, this payment determines the original payoff horizon instead of the term. Exclude escrow, taxes, insurance, PMI, and HOA.' },
 { key: 'lump', label: 'One-time principal payment', prefix: '$', value: '0', advanced: true },
 { key: 'lumpMonth', label: 'Lump-sum payment month', unit: 'month', min: 1, max: 600, step: '1', value: '1', advanced: true, help: '1 means alongside the next monthly payment, after that month’s interest. A payment scheduled after payoff is not applied.' },
];
function parse(v: ScenarioValues): MortgageExtraInput { return { balance: +v.balance, annualRate: +v.rate, months: +v.months, regularPayment: v.regular.trim() === '' ? null : +v.regular, extraMonthly: +v.extra, lumpSum: +v.lump, lumpMonth: +v.lumpMonth, firstPaymentDate: v.firstDate }; }
export function MortgageExtraCalculator() { return <ScenarioCalculator id="mortgage-extra-payment-calculator" title="Your Mortgage Extra Payment Results" action="Calculate Savings" fields={fields} validate={v => validateMortgageExtra(parse(v))} compute={v => {
 const r = calculateMortgageExtra(parse(v));
 return { summary: { label: 'Interest saved', amount: money(r.interestSaved), period: 'USD' }, secondarySummary: { label: 'Months saved', amount: `${r.monthsSaved} months`, period: `${Math.floor(r.monthsSaved/12)} years, ${r.monthsSaved%12} months` }, metrics: [
 ['Regular monthly principal and interest', money(r.payment)], ['Monthly payment with recurring extra', money(r.payment + +v.extra)], ['Original payoff time', `${r.original.months} months`], ['Accelerated payoff time', `${r.accelerated.months} months`], ['Original estimated payoff date', r.original.payoffDate], ['Accelerated estimated payoff date', r.accelerated.payoffDate], ['Original remaining interest', money(r.original.totalInterest)], ['Accelerated remaining interest', money(r.accelerated.totalInterest)], ['Original total remaining payments', money(r.original.totalPayments)], ['Accelerated total remaining payments', money(r.accelerated.totalPayments)], ['One-time payment actually applied', money(r.accelerated.lumpApplied)]
 ], notes: ['Fixed-rate, fully amortizing US mortgage model with monthly interest at annual rate ÷ 12. Recurring extras start with the next scheduled payment; the lump sum is applied after interest in its selected month. No fees, prepayment penalties, tax benefits, escrow, PMI cancellation, daily interest, or recasting are modeled.',
 'Extra payments reduce principal and shorten the term; the regular required payment stays constant. Final payments, including extras, are capped at the amount due. Calculations retain full precision; displayed monthly amounts are rounded to cents.',
 ...(+v.lump > 0 && r.accelerated.lumpApplied === 0 ? ['The planned lump-sum payment falls after payoff and is not applied.'] : [])],
 schedule: { caption: 'Original and accelerated monthly amortization comparison (USD)', headers: ['Month', 'Payment date', 'Original payment', 'Original interest', 'Original principal', 'Original balance', 'With extras payment', 'With extras interest', 'With extras principal', 'With extras balance'], rows: r.original.rows.map((row,index) => { const extra = r.accelerated.rows[index]; return [String(row.month), row.date, money(row.payment), money(row.interest), money(row.principal), money(row.balance), extra ? money(extra.payment) : '—', extra ? money(extra.interest) : '—', extra ? money(extra.principal) : '—', extra ? money(extra.balance) : 'Paid off']; }) }
 };
 }} />; }
