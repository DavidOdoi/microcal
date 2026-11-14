import { calculateMortgage, mortgageAmount } from './mortgage-calculations.ts';
export type CommercialMortgageInput = { propertyPrice: number; loanAmount: number; annualRate: number; amortizationYears: number; maturityYears: number; upfrontFees: number; annualNoi: number | null };
export function calculateCommercialMortgage(input: CommercialMortgageInput) {
  const propertyPrice = mortgageAmount(input.propertyPrice), loanAmount = mortgageAmount(input.loanAmount), upfrontFees = mortgageAmount(input.upfrontFees);
  const loan = calculateMortgage({ homePrice: loanAmount, downPayment: 0, annualRate: input.annualRate, years: input.amortizationYears, annualTax: 0, annualInsurance: 0, monthlyPmi: 0, monthlyHoa: 0 });
  const maturityMonths = Math.min(loan.months, Math.max(1, Math.round(mortgageAmount(input.maturityYears, 50) * 12)));
  const schedule = loan.schedule.slice(0, maturityMonths);
  const balloon = schedule.length ? schedule[schedule.length - 1].balance : loanAmount;
  const regularPayments = schedule.reduce((total, row) => total + row.payment, 0);
  const interestDuringTerm = schedule.reduce((total, row) => total + row.interest, 0);
  const annualDebtService = loan.monthlyPrincipalInterest * 12;
  return { propertyPrice, loanAmount, downPayment: propertyPrice - loanAmount, ltv: propertyPrice > 0 ? loanAmount / propertyPrice * 100 : null, maturityMonths, monthlyPayment: loan.monthlyPrincipalInterest, balloon, regularPayments, interestDuringTerm, upfrontFees, totalRepaymentWithBalloonAndFees: regularPayments + balloon + upfrontFees, annualDebtService, dscr: input.annualNoi !== null && annualDebtService > 0 ? mortgageAmount(input.annualNoi) / annualDebtService : null, schedule };
}
