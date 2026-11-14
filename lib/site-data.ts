import {
  Banknote,
  Home,
  Car,
  PiggyBank,
  TrendingUp,
  Palmtree,
  Receipt,
  CreditCard,
  Wallet,
  BriefcaseBusiness,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';
import { remainingSlugs } from '@/lib/remaining-pages';

export type CalculatorStatus = 'live' | 'coming-soon';

export interface Calculator {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: CalculatorStatus;
}

export interface Category {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  topics: string[];
}

export const categories: Category[] = [
  {
    slug: 'loans',
    name: 'Loans',
    short: 'Personal & student loans',
    icon: Banknote,
    tagline: 'Borrow smarter, pay less over time.',
    description: 'Compare payments, total interest and payoff timelines for personal and student loans before you sign anything.',
    topics: ['Personal loans', 'Student loans', 'Loan consolidation', 'APR vs. interest rate'],
  },
  {
    slug: 'business',
    name: 'Business',
    short: 'Small business finance',
    icon: BriefcaseBusiness,
    tagline: 'Plan business borrowing with clearer numbers.',
    description: 'Estimate installment-loan payments, interest, fees, and cash proceeds before comparing business financing offers.',
    topics: ['Business loan payments', 'Origination fees', 'Loan terms', 'Borrowing costs'],
  },
  {
    slug: 'student-loans',
    name: 'Student Loans',
    short: 'Student loan costs',
    icon: GraduationCap,
    tagline: 'Understand interest and repayment assumptions.',
    description: 'Estimate student loan interest and learn how daily accrual, payments, subsidies, and capitalization affect balances.',
    topics: ['Daily interest', 'Accrued interest', 'Capitalization', 'Loan rates'],
  },
  {
    slug: 'home-equity',
    name: 'Home Equity',
    short: 'HELOC payment planning',
    icon: Home,
    tagline: 'See how home equity borrowing payments can change.',
    description: 'Explore HELOC draw-period costs, repayment payments, rate scenarios, and home equity borrowing assumptions.',
    topics: ['HELOC payments', 'Draw periods', 'Repayment periods', 'Variable rates'],
  },
  {
    slug: 'mortgages',
    name: 'Mortgages',
    short: 'Buy, refinance, afford',
    icon: Home,
    tagline: 'Know exactly what home you can afford.',
    description: 'Model monthly payments, closing costs, refinancing break-even points and how much house fits your budget.',
    topics: ['Home affordability', 'Refinancing', 'PMI & escrow', '15 vs. 30-year terms'],
  },
  {
    slug: 'auto-loans',
    name: 'Auto Loans',
    short: 'New, used & lease',
    icon: Car,
    tagline: 'Drive away with a deal that makes sense.',
    description: 'Estimate car payments, compare leasing to buying, and see the real cost of trade-ins and dealer financing.',
    topics: ['Car payments', 'Lease vs. buy', 'Trade-in value', 'Auto refinancing'],
  },
  {
    slug: 'savings',
    name: 'Savings',
    short: 'Grow your cash safely',
    icon: PiggyBank,
    tagline: 'Make every dollar you save work harder.',
    description: 'Project the growth of high-yield savings, CDs and emergency funds with compound interest.',
    topics: ['High-yield savings', 'Certificates of deposit', 'Emergency funds', 'Compound interest'],
  },
  {
    slug: 'investments',
    name: 'Investments',
    short: 'Build long-term wealth',
    icon: TrendingUp,
    tagline: 'See your money compound over decades.',
    description: 'Understand returns, fees, dollar-cost averaging and the long-run impact of consistent investing.',
    topics: ['Investment returns', 'Index funds', 'Dollar-cost averaging', 'Fees & expense ratios'],
  },
  {
    slug: 'retirement',
    name: 'Retirement',
    short: '401(k), IRA & more',
    icon: Palmtree,
    tagline: 'Plan the retirement you actually want.',
    description: 'Estimate what you need to retire, maximize employer matches, and compare Roth and traditional accounts.',
    topics: ['401(k) planning', 'Roth vs. traditional IRA', 'Social Security', 'Retirement income'],
  },
  {
    slug: 'taxes',
    name: 'Taxes',
    short: 'Federal & state estimates',
    icon: Receipt,
    tagline: 'No surprises when April comes around.',
    description: 'Estimate federal income tax, paycheck withholding, capital gains and self-employment taxes.',
    topics: ['Income tax brackets', 'Paycheck withholding', 'Capital gains', 'Self-employment tax'],
  },
  {
    slug: 'debt',
    name: 'Debt',
    short: 'Credit cards & payoff',
    icon: CreditCard,
    tagline: 'A clear path to becoming debt-free.',
    description: 'Compare snowball and avalanche strategies, balance transfers and credit card payoff timelines.',
    topics: ['Credit card payoff', 'Debt snowball vs. avalanche', 'Balance transfers', 'Debt-to-income ratio'],
  },
  {
    slug: 'budgeting',
    name: 'Budgeting',
    short: 'Plan your monthly money',
    icon: Wallet,
    tagline: 'Give every dollar a job.',
    description: 'Build a realistic budget, track net worth, and find room for the goals that matter to you.',
    topics: ['50/30/20 budget', 'Net worth', 'Cost of living', 'Savings goals'],
  },
];

const liveCalculatorSlugs = new Set([
  'fha-home-loan-calculator', 'commercial-mortgage-calculator', 'home-equity-loan-calculator', 'rent-vs-buy-calculator', 'mortgage-calculator', '401k-calculator', 'paycheck-calculator', 'credit-card-payoff-calculator',
  'compound-interest-calculator', 'savings-calculator', 'budget-calculator',
  'debt-to-income-ratio-calculator', 'emergency-fund-calculator', 'cd-interest-calculator',
  'high-yield-savings-account-calculator', 'auto-loan-payoff-calculator', 'loan-interest-calculator',
  'business-loan-payment-calculator', 'how-long-will-my-savings-last-calculator', 'heloc-payment-calculator', 'student-loan-interest-calculator',
  ...remainingSlugs,
]);

const makeCalculator = (
  category: string,
  slug: string,
  name: string,
  description: string,
): Calculator => ({ slug, name, description, category, status: liveCalculatorSlugs.has(slug) ? 'live' : 'coming-soon' });

export const calculators: Calculator[] = [
  makeCalculator('loans', 'personal-loan-calculator', 'Personal Loan Calculator', 'Monthly payment and total interest for a personal loan.'),
  makeCalculator('loans', 'student-loan-calculator', 'Student Loan Calculator', 'Plan repayment for federal and private student loans.'),
  makeCalculator('loans', 'loan-comparison-calculator', 'Loan Comparison Calculator', 'Compare two loan offers side by side.'),
  makeCalculator('loans', 'loan-interest-calculator', 'Loan Interest Calculator', 'Estimate total interest and repayment for simple-interest and amortizing loans.'),
  makeCalculator('business', 'commercial-mortgage-calculator', 'Commercial Mortgage Calculator', 'Compare commercial loan payments, balloon balances, loan-to-value and DSCR.'),
  makeCalculator('business', 'business-loan-payment-calculator', 'Business Loan Payment Calculator', 'Estimate business loan payments, interest, fees, and cash proceeds.'),
  makeCalculator('student-loans', 'student-loan-interest-calculator', 'Student Loan Interest Calculator', 'Estimate daily and accrued student loan interest over selected dates.'),
  makeCalculator('mortgages', 'rent-vs-buy-calculator', 'Rent vs. Buy Calculator', 'Compare renting and buying a home by monthly costs and projected financial position.'),
  makeCalculator('mortgages', 'fha-home-loan-calculator', 'FHA Home Loan Calculator', 'Estimate FHA mortgage payments, upfront and annual MIP, taxes and insurance.'),
  makeCalculator('mortgages', 'mortgage-calculator', 'Mortgage Calculator', 'Estimate your monthly mortgage payment with taxes and insurance.'),
  makeCalculator('mortgages', 'home-affordability-calculator', 'Home Affordability Calculator', 'Find out how much house you can afford.'),
  makeCalculator('mortgages', 'refinance-calculator', 'Refinance Calculator', 'See if refinancing saves you money and when you break even.'),
  makeCalculator('home-equity', 'home-equity-loan-calculator', 'Home Equity Loan Calculator', 'Estimate fixed-rate payments, loan costs and borrowing capacity against your home equity.'),
  makeCalculator('home-equity', 'heloc-payment-calculator', 'HELOC Payment Calculator', 'Compare HELOC draw-period and repayment-period payment estimates.'),
  makeCalculator('auto-loans', 'auto-loan-calculator', 'Auto Loan Calculator', 'Estimate monthly car payments and total cost.'),
  makeCalculator('auto-loans', 'lease-vs-buy-calculator', 'Lease vs. Buy Calculator', 'Compare the true cost of leasing and buying.'),
  makeCalculator('auto-loans', 'auto-loan-payoff-calculator', 'Auto Loan Payoff Calculator', 'Estimate the time and interest saved by paying extra toward an existing car loan.'),
  makeCalculator('savings', 'savings-calculator', 'Savings Calculator', 'Project how your savings grow over time.'),
  makeCalculator('savings', 'cd-interest-calculator', 'CD Interest Calculator', 'Estimate CD interest, effective yield, and maturity value.'),
  makeCalculator('savings', 'emergency-fund-calculator', 'Emergency Fund Calculator', 'Find the right size for your safety net.'),
  makeCalculator('savings', 'how-long-will-my-savings-last-calculator', 'How Long Will My Savings Last Calculator', 'Estimate how long savings may support spending after income, returns, and inflation.'),
  makeCalculator('savings', 'high-yield-savings-account-calculator', 'High-Yield Savings Account Calculator', 'Estimate savings interest and future balance using APY and monthly deposits.'),
  makeCalculator('investments', 'compound-interest-calculator', 'Compound Interest Calculator', 'Watch your money compound over time.'),
  makeCalculator('investments', 'investment-return-calculator', 'Investment Return Calculator', 'Estimate future value of your investments.'),
  makeCalculator('retirement', '401k-calculator', '401(k) Calculator', 'Project your 401(k) balance at retirement.'),
  makeCalculator('retirement', 'retirement-calculator', 'Retirement Calculator', 'Find out if you are on track to retire.'),
  makeCalculator('retirement', 'roth-ira-calculator', 'Roth IRA Calculator', 'Estimate tax-free growth in a Roth IRA.'),
  makeCalculator('taxes', 'income-tax-calculator', 'Income Tax Calculator', 'Estimate your federal income tax.'),
  makeCalculator('taxes', 'paycheck-calculator', 'Paycheck Calculator', 'See your take-home pay after taxes.'),
  makeCalculator('taxes', 'capital-gains-tax-calculator', 'Capital Gains Tax Calculator', 'Estimate tax owed on investment gains.'),
  makeCalculator('debt', 'credit-card-payoff-calculator', 'Credit Card Payoff Calculator', 'See how long it takes to pay off a card.'),
  makeCalculator('debt', 'debt-payoff-calculator', 'Debt Snowball & Avalanche Calculator', 'Compare payoff strategies for multiple debts.'),
  makeCalculator('debt', 'debt-to-income-ratio-calculator', 'Debt-to-Income Ratio Calculator', 'Calculate what percentage of gross monthly income goes toward qualifying debt payments.'),
  makeCalculator('budgeting', 'budget-calculator', 'Budget Calculator', 'Build a 50/30/20 monthly budget.'),
  makeCalculator('budgeting', 'net-worth-calculator', 'Net Worth Calculator', 'Add up assets and liabilities.'),
];

export const getCategory = (slug: string) => categories.find((item) => item.slug === slug);
export const getCalculator = (slug: string) => calculators.find((item) => item.slug === slug);
export const calculatorsIn = (slug: string) => calculators.filter((item) => item.category === slug);

export function searchSite(q: string) {
  const term = q.trim().toLowerCase();

  if (!term) {
    return { categories: [], calculators: [] };
  }

  const matches = (...value: string[]) => value.some((item) => item.toLowerCase().includes(term));

  return {
    categories: categories.filter((category) => matches(category.name, category.description, ...category.topics)),
    calculators: calculators.filter((calculator) => matches(calculator.name, calculator.description, getCategory(calculator.category)?.name ?? '')),
  };
}
