'use client';
import { calculateFarmLoan, validateFarmLoan, type FarmLoanInput } from '@/lib/farm-loan-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';
const fields: ScenarioField[] = [
  { key: 'cost', label: 'Purchase cost / borrowing need', prefix: '$', value: '50000', help: 'Enter the amount before a down payment. For a direct borrowing request, enter the loan amount here and leave down payment at zero.' },
  { key: 'down', label: 'Down payment', prefix: '$', value: '0' },
  { key: 'rate', label: 'Annual interest rate', unit: '%', max: 100, value: '8' },
  { key: 'term', label: 'Loan term', min: .01, max: 600, value: '5' },
  { key: 'unit', label: 'Term unit', value: 'years', options: [['years', 'Years'], ['months', 'Months']] },
  { key: 'frequency', label: 'Payment frequency', value: '12', options: [['12', 'Monthly'], ['4', 'Quarterly'], ['1', 'Annual']] },
  { key: 'fee', label: 'Loan fee', prefix: '$', value: '0', advanced: true },
  { key: 'feeTreatment', label: 'Fee treatment', value: 'upfront', options: [['upfront', 'Paid upfront'], ['financed', 'Added to loan balance']], advanced: true },
  { key: 'extra', label: 'Extra principal per payment', prefix: '$', value: '0', advanced: true },
  { key: 'revenue', label: 'Annual farm revenue', prefix: '$', value: '80000', advanced: true },
  { key: 'expenses', label: 'Annual farm operating expenses', prefix: '$', value: '55000', advanced: true },
];
function parse(v: ScenarioValues): FarmLoanInput { return { purchaseCost: +v.cost, downPayment: +v.down, annualRate: +v.rate, term: +v.term, termUnit: v.unit as FarmLoanInput['termUnit'], frequency: +v.frequency as FarmLoanInput['frequency'], fee: +v.fee, feeTreatment: v.feeTreatment as FarmLoanInput['feeTreatment'], extraPayment: +v.extra, annualRevenue: +v.revenue, annualOperatingExpenses: +v.expenses }; }
const frequencyNames = { 12: ['Monthly', 'month'], 4: ['Quarterly', 'quarter'], 1: ['Annual', 'year'] } as const;
export function FarmLoanCalculator() { return <ScenarioCalculator id="farm-loan-calculator" title="Your Farm Loan Estimate" action="Calculate Payment" fields={fields} validate={(v) => validateFarmLoan(parse(v))} compute={(v) => {
  const input = parse(v), r = calculateFarmLoan(input), frequency = frequencyNames[input.frequency];
  return { summary: { label: `Scheduled ${frequency[0].toLowerCase()} payment`, amount: money(r.payment), period: `Per ${frequency[1]}` },
    metrics: [['Total interest', money(r.totalInterest)], ['Total loan repayment including fees', money(r.totalRepayment)], ['Amount financed', money(r.principal)], ['Down payment', money(input.downPayment)], ['Loan fees', money(r.loanFee)], ['Total outlay including down payment', money(r.totalOutlay)], ['Number of payments', String(r.actualPaymentCount)], ['First-year scheduled debt service before extras', money(r.annualDebtService)], ['Annual operating surplus before debt', money(r.annualOperatingSurplus)], ['First-year cash after scheduled debt', money(r.annualCashAfterScheduledDebt)], ...(input.extraPayment > 0 ? [['Planned payment with extra', money(r.plannedPayment)], ['Interest saved', money(r.interestSaved)], ['Payments saved', String(r.paymentsSaved)]] as [string, string][] : [])] as [string, string][],
    notes: [...(r.principal === 0 ? ['The purchase is fully covered by the down payment. No financing or loan fee is needed.'] : []), `This models regular ${frequency[0].toLowerCase()} installments at a fixed nominal annual rate, divided by ${input.frequency} for each payment period. Payments start one period after borrowing. The 8% starting rate is hypothetical, not a current USDA offer.`, 'Annual cash flow excludes extra payments, down payments, upfront fees, other debts, taxes, capital expenditures, and reserves. It does not test USDA eligibility, loan approval, or whether seasonal cash arrives before a payment is due.', 'Irregular seasonal schedules, interest-only periods, variable rates, and balloon loans are not modeled. Calculations retain full precision; displayed payments are rounded to cents. Extra principal is applied each selected payment period, subject to your lender’s terms.'],
    schedule: { caption: `${frequency[0]} farm loan amortization schedule`, headers: ['Payment number', 'Payment', 'Principal', 'Interest', 'Balance'], rows: r.schedule.map((row) => [String(row.period), money(row.payment), money(row.principal), money(row.interest), money(row.balance)]) },
  };
}} />; }
