import { mortgagePaymentDate } from './mortgage-extra-calculations.ts';

export const mortgageAmount = (value: number, maximum = 1e12) => Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;

export type MortgageInput = {
  homePrice: number; downPayment: number; annualRate: number; years: number;
  annualTax: number; annualInsurance: number; monthlyPmi: number; monthlyHoa: number;
  annualPmiRate?: number; extraPrincipal?: number; firstPaymentDate?: string;
};

export function calculateMortgage(input: MortgageInput) {
  const homePrice = mortgageAmount(input.homePrice);
  const downPayment = Math.min(homePrice, mortgageAmount(input.downPayment));
  const principal = homePrice - downPayment;
  const months = Math.max(1, Math.round(mortgageAmount(input.years, 50) * 12));
  const rate = mortgageAmount(input.annualRate, 100) / 1200;
  const growth = Math.log1p(rate);
  const denominator = -Math.expm1(-months * growth);
  const monthlyPrincipalInterest = rate === 0 ? principal / months : principal * rate / denominator;
  const monthlyTax = mortgageAmount(input.annualTax) / 12;
  const monthlyInsurance = mortgageAmount(input.annualInsurance) / 12;
  const monthlyPmi = principal === 0 ? 0 : input.annualPmiRate === undefined ? mortgageAmount(input.monthlyPmi)
    : principal > homePrice * .8 ? principal * mortgageAmount(input.annualPmiRate, 100) / 1200 : 0;
  const monthlyHoa = mortgageAmount(input.monthlyHoa);
  const monthlyTotal = monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa;
  const extraPrincipal = mortgageAmount(input.extraPrincipal ?? 0);
  let balance = principal;
  let totalInterest = 0;
  const schedule = [];
  for (let month = 1; month <= months && balance > 0; month++) {
    const interest = balance * rate;
    const openingBalance = balance;
    if (month === months || balance + interest <= monthlyPrincipalInterest + extraPrincipal) {
      balance = 0;
    } else {
      const baseline = rate === 0 ? principal * (1 - month / months)
        : principal * -Math.expm1((month - months) * growth) / denominator;
      const reduction = rate === 0 ? extraPrincipal * month : extraPrincipal * Math.expm1(month * growth) / rate;
      balance = Math.max(0, baseline - reduction);
    }
    const principalPaid = openingBalance - balance;
    schedule.push({ month, payment: principalPaid + interest, interest, principalPaid, balance });
    totalInterest += interest;
  }
  const payoffMonths = schedule.length;
  const payoffDate = payoffMonths && input.firstPaymentDate
    ? mortgagePaymentDate(input.firstPaymentDate, payoffMonths - 1) : undefined;
  return { homePrice, downPayment, principal, months, monthlyPrincipalInterest, monthlyTax, monthlyInsurance, monthlyPmi,
    monthlyHoa, monthlyTotal, extraPrincipal, payoffMonths, payoffDate, totalLoanPayments: principal + totalInterest, totalInterest, schedule };
}

export function annualizeMortgageSchedule(schedule: ReturnType<typeof calculateMortgage>['schedule']) {
  const years = [];
  for (let start = 0; start < schedule.length; start += 12) {
    const rows = schedule.slice(start, start + 12);
    years.push({
      year: start / 12 + 1,
      payment: rows.reduce((sum, row) => sum + row.payment, 0),
      interest: rows.reduce((sum, row) => sum + row.interest, 0),
      principalPaid: rows.reduce((sum, row) => sum + row.principalPaid, 0),
      balance: rows[rows.length - 1].balance,
    });
  }
  return years;
}
