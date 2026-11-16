'use client';
import { calculateDscr } from '@/lib/dscr-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioField, type ScenarioValues } from './ScenarioCalculator';

const fields: ScenarioField[] = [
  { key: 'rent', label: 'Gross annual rental income', prefix: '$', value: '96000' },
  { key: 'vacancy', label: 'Vacancy and collection allowance', unit: '%', max: 100, value: '5' },
  { key: 'expenses', label: 'Annual operating expenses', prefix: '$', value: '19200', help: 'Include property taxes and insurance here; exclude mortgage payments, depreciation, and income taxes.' },
  { key: 'mode', label: 'Debt service method', value: 'direct', options: [['direct', 'Enter annual debt payments'], ['loan', 'Calculate from loan details']] },
  { key: 'debt', label: 'Annual principal and interest payments', prefix: '$', value: '60000', help: 'Used only with entered annual debt payments.' },
  { key: 'amount', label: 'Loan amount', prefix: '$', value: '500000', advanced: true },
  { key: 'rate', label: 'Annual interest rate', unit: '%', max: 100, value: '7', advanced: true },
  { key: 'years', label: 'Amortization period', unit: 'years', min: .01, max: 50, value: '30', advanced: true },
  { key: 'other', label: 'Other annual property income', prefix: '$', value: '0', advanced: true },
  { key: 'required', label: 'Required DSCR', unit: '×', min: .01, max: 10, value: '1.25', advanced: true },
];
function compute(v: ScenarioValues) {
  const r = calculateDscr({ annualRent: +v.rent, vacancyPercent: +v.vacancy, otherIncome: +v.other, operatingExpenses: +v.expenses, debtMode: v.mode as 'direct' | 'loan', annualDebtService: +v.debt, loanAmount: +v.amount, annualRate: +v.rate, years: +v.years, requiredDscr: +v.required });
  return { summary: { label: 'Debt service coverage ratio', amount: r.dscr === null ? 'Not defined' : `${r.dscr.toFixed(2)}×`, period: 'Annual basis' },
    metrics: [['Net operating income (NOI)', money(r.noi)], ['Annual debt service', money(r.annualDebtService)], ['Vacancy and collection loss', money(r.vacancyLoss)], ['Effective annual income', money(r.effectiveIncome)], ['Cash flow after debt service', money(r.cashFlowAfterDebt)], ['Maximum annual debt service at target DSCR', money(r.maximumAnnualDebtService)], ['Maximum monthly debt service at target DSCR', money(r.maximumMonthlyDebtService)], ['Supportable loan at entered rate and amortization', money(r.supportableLoan)]] as [string, string][],
    notes: [r.dscr === null ? 'DSCR is not defined when annual debt service is zero.' : `Your property generates ${money(r.dscr)} in net operating income for every $1 of debt payments.`, 'This is property-level NOI divided by principal and interest, not a business-wide ratio or a gross-rent/PITIA underwriting model. Capital expenditures, income taxes, reserves, and lender adjustments are excluded. A favorable ratio is not loan approval.', `Loan details use a fixed ${v.rate}% rate over ${v.years} amortization years. They determine supportable borrowing in both modes and debt service only in loan-details mode. Actual borrowing may also be limited by LTV and underwriting.`],
  };
}
export function DscrLoanCalculator() { return <ScenarioCalculator id="dscr-loan-calculator" title="Your DSCR Results" action="Calculate DSCR" fields={fields} compute={compute} />; }
