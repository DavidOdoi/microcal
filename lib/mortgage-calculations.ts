export const mortgageAmount = (value: number, maximum = 1e12) => Number.isFinite(value) ? Math.min(maximum, Math.max(0, value)) : 0;

export function calculateMortgage(input: {
  homePrice: number; downPayment: number; annualRate: number; years: number;
  annualTax: number; annualInsurance: number; monthlyPmi: number; monthlyHoa: number;
}) {
  const homePrice = mortgageAmount(input.homePrice);
  const downPayment = Math.min(homePrice, mortgageAmount(input.downPayment));
  const principal = homePrice - downPayment;
  const months = Math.max(1, Math.round(mortgageAmount(input.years, 50) * 12));
  const rate = mortgageAmount(input.annualRate, 100) / 1200;
  const monthlyPrincipalInterest = rate > 0 ? principal * rate / (1 - Math.pow(1 + rate, -months)) : principal / months;
  const monthlyTax = mortgageAmount(input.annualTax) / 12;
  const monthlyInsurance = mortgageAmount(input.annualInsurance) / 12;
  const monthlyPmi = mortgageAmount(input.monthlyPmi);
  const monthlyHoa = mortgageAmount(input.monthlyHoa);
  const monthlyTotal = monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyPmi + monthlyHoa;
  let balance = principal;
  const schedule = [];
  for (let month = 1; month <= months && balance > 0; month++) {
    const interest = balance * rate;
    const payment = Math.min(balance + interest, monthlyPrincipalInterest);
    const principalPaid = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    if (balance < 0.0001) balance = 0;
    schedule.push({ month, payment, interest, principalPaid, balance });
  }
  const totalLoanPayments = monthlyPrincipalInterest * months;
  return { homePrice, downPayment, principal, months, monthlyPrincipalInterest, monthlyTax, monthlyInsurance, monthlyPmi, monthlyHoa, monthlyTotal, totalLoanPayments, totalInterest: Math.max(0, totalLoanPayments - principal), schedule };
}
