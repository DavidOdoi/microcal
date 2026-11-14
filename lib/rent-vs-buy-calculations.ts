import { calculateMortgage, mortgageAmount } from './mortgage-calculations.ts';

export type RentBuyInput = Record<'price' | 'down' | 'rate' | 'term' | 'rent' | 'horizon' | 'tax' | 'insurance' | 'maintenance' | 'hoa' | 'pmi' | 'renterInsurance' | 'closing' | 'selling' | 'homeGrowth' | 'rentGrowth' | 'returnRate', number>;
const growth = (value: number) => Math.pow(1 + (Number.isFinite(value) ? Math.max(-20, Math.min(20, value)) : 0) / 100, 1 / 12);

export function calculateRentVsBuy(input: RentBuyInput) {
  const mortgage = calculateMortgage({ homePrice: input.price, downPayment: input.down, annualRate: input.rate, years: input.term, annualTax: input.tax, annualInsurance: input.insurance, monthlyPmi: input.pmi, monthlyHoa: input.hoa });
  const months = Math.max(12, Math.round(mortgageAmount(input.horizon, 50) * 12));
  const rent = mortgageAmount(input.rent);
  const maintenance = mortgageAmount(input.maintenance);
  const renterInsurance = mortgageAmount(input.renterInsurance);
  const closingCosts = mortgage.homePrice * mortgageAmount(input.closing, 20) / 100;
  const sellingRate = mortgageAmount(input.selling, 20) / 100;
  const ownershipOther = mortgage.monthlyTax + mortgage.monthlyInsurance + mortgage.monthlyHoa + maintenance;
  const firstMonthlyBuy = mortgage.monthlyPrincipalInterest + ownershipOther + (mortgage.principal > 0 ? mortgage.monthlyPmi : 0);
  const firstMonthlyRent = rent + renterInsurance;
  let homeValue = mortgage.homePrice;
  let balance = mortgage.principal;
  let buyerInvestments = 0;
  let renterInvestments = mortgage.downPayment + closingCosts;
  let buyingCashOut = mortgage.downPayment + closingCosts;
  let rentingCashOut = 0;
  let firstCrossover: number | null = null;
  const homeFactor = growth(input.homeGrowth), rentFactor = growth(input.rentGrowth), investmentFactor = growth(input.returnRate);
  const mortgageRate = mortgageAmount(input.rate, 100) / 1200;
  const rows: { year: number; homeValue: number; loanBalance: number; buyerAssets: number; renterAssets: number; buyingAdvantage: number }[] = [];
  let buyerAssets = mortgage.downPayment - homeValue * sellingRate;
  let renterAssets = renterInvestments;
  for (let month = 1; month <= months; month++) {
    let payment = 0;
    if (balance > 0 && month <= mortgage.months) {
      const interest = balance * mortgageRate;
      payment = Math.min(balance + interest, mortgage.monthlyPrincipalInterest);
      balance = Math.max(0, balance + interest - payment);
      if (balance < 0.0001) balance = 0;
    }
    const buying = payment + ownershipOther + (payment > 0 ? mortgage.monthlyPmi : 0);
    const renting = rent * Math.pow(rentFactor, month - 1) + renterInsurance;
    buyingCashOut += buying; rentingCashOut += renting;
    // Both households use the same monthly budget. The cheaper option invests
    // the difference at month-end; principal payments also build home equity.
    buyerInvestments = buyerInvestments * investmentFactor + Math.max(0, renting - buying);
    renterInvestments = renterInvestments * investmentFactor + Math.max(0, buying - renting);
    homeValue *= homeFactor;
    buyerAssets = homeValue * (1 - sellingRate) - balance + buyerInvestments;
    renterAssets = renterInvestments;
    const buyingAdvantage = buyerAssets - renterAssets;
    if (firstCrossover === null && buyingAdvantage >= -0.01) firstCrossover = month;
    if (month % 12 === 0 || month === months) rows.push({ year: month / 12, homeValue, loanBalance: balance, buyerAssets, renterAssets, buyingAdvantage });
  }
  return { mortgage, months, closingCosts, firstMonthlyBuy, firstMonthlyRent, buyingCashOut, rentingCashOut, buyerAssets, renterAssets, buyingAdvantage: buyerAssets - renterAssets, firstCrossover, rows };
}
