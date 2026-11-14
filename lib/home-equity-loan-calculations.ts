import { calculateMortgage, mortgageAmount } from './mortgage-calculations.ts';

export type HomeEquityLoanInput = { homeValue: number; mortgageBalance: number; loanAmount: number; annualRate: number; years: number; fees: number; maxCltv: number };
export function calculateHomeEquityLoan(input: HomeEquityLoanInput) {
  const homeValue = mortgageAmount(input.homeValue);
  const mortgageBalance = mortgageAmount(input.mortgageBalance);
  const loanAmount = mortgageAmount(input.loanAmount);
  const fees = mortgageAmount(input.fees);
  const maxCltv = mortgageAmount(input.maxCltv, 100);
  const equity = homeValue - mortgageBalance;
  const borrowingCapacity = Math.max(0, homeValue * maxCltv / 100 - mortgageBalance);
  const combinedLtv = homeValue > 0 ? (mortgageBalance + loanAmount) / homeValue * 100 : null;
  const loan = calculateMortgage({ homePrice: loanAmount, downPayment: 0, annualRate: input.annualRate, years: input.years, annualTax: 0, annualInsurance: 0, monthlyPmi: 0, monthlyHoa: 0 });
  return { homeValue, mortgageBalance, equity, loanAmount, fees, maxCltv, borrowingCapacity, combinedLtv, exceedsAssumedLimit: loanAmount > borrowingCapacity, monthlyPayment: loan.monthlyPrincipalInterest, totalInterest: loan.totalInterest, totalLoanPayments: loan.totalLoanPayments, totalCostWithFees: loan.totalLoanPayments + fees, schedule: loan.schedule };
}
