import { calculateMortgage, mortgageAmount } from './mortgage-calculations.ts';
export type FhaLoanInput = { homePrice: number; downPayment: number; annualRate: number; years: number; upfrontMipRate: number; annualMipRate: number; financeUpfrontMip: boolean; mipDuration: 'auto' | 'term' | '11-years'; annualTax: number; annualInsurance: number; monthlyHoa: number; closingCosts: number; countyLimit: number };
export function calculateFhaLoan(input: FhaLoanInput) {
  const homePrice = mortgageAmount(input.homePrice), downPayment = Math.min(homePrice, mortgageAmount(input.downPayment));
  const baseLoan = homePrice - downPayment;
  const baseLtv = homePrice > 0 ? baseLoan / homePrice * 100 : null;
  const downPercent = homePrice > 0 ? downPayment / homePrice * 100 : 0;
  const upfrontMip = baseLoan * mortgageAmount(input.upfrontMipRate, 10) / 100;
  const financedLoan = baseLoan + (input.financeUpfrontMip ? upfrontMip : 0);
  const loan = calculateMortgage({ homePrice: financedLoan, downPayment: 0, annualRate: input.annualRate, years: input.years, annualTax: 0, annualInsurance: 0, monthlyPmi: 0, monthlyHoa: 0 });
  const shortDuration = input.mipDuration === '11-years' || (input.mipDuration === 'auto' && baseLtv !== null && baseLtv <= 90);
  const mipMonths = baseLoan > 0 ? Math.min(loan.months, shortDuration ? 132 : loan.months) : 0;
  const annualMipRate = mortgageAmount(input.annualMipRate, 10) / 100;
  const monthlyTax = mortgageAmount(input.annualTax) / 12, monthlyInsurance = mortgageAmount(input.annualInsurance) / 12, monthlyHoa = mortgageAmount(input.monthlyHoa);
  const initialMonthlyMip = mipMonths > 0 ? baseLoan * annualMipRate / 12 : 0;
  const baseShare = financedLoan > 0 ? baseLoan / financedLoan : 0;
  let totalAnnualMip = 0;
  const schedule = loan.schedule.map((row) => {
    const yearStart = Math.floor((row.month - 1) / 12) * 12;
    const beginningYearLoanBalance = yearStart === 0 ? financedLoan : loan.schedule[yearStart - 1].balance;
    // Planning approximation: premium is reset annually using base-loan
    // balance at the start of that year, excluding financed upfront MIP.
    const mip = row.month <= mipMonths ? beginningYearLoanBalance * baseShare * annualMipRate / 12 : 0;
    totalAnnualMip += mip;
    return { ...row, mip, housingPayment: row.payment + mip + monthlyTax + monthlyInsurance + monthlyHoa };
  });
  const closingCosts = mortgageAmount(input.closingCosts), countyLimit = mortgageAmount(input.countyLimit);
  return { homePrice, downPayment, downPercent, baseLoan, baseLtv, upfrontMip, financedLoan, monthlyPrincipalInterest: loan.monthlyPrincipalInterest, initialMonthlyMip, firstMonthlyPayment: loan.monthlyPrincipalInterest + initialMonthlyMip + monthlyTax + monthlyInsurance + monthlyHoa, monthlyTax, monthlyInsurance, monthlyHoa, mipMonths, totalAnnualMip, totalMortgageInsurance: upfrontMip + totalAnnualMip, loanInterest: loan.totalInterest, totalLoanPayments: loan.totalLoanPayments, cashAtClosing: downPayment + closingCosts + (input.financeUpfrontMip ? 0 : upfrontMip), exceedsEnteredCountyLimit: countyLimit > 0 && baseLoan > countyLimit, belowStandardDownPayment: downPercent < 3.5 - 1e-8, schedule };
}
