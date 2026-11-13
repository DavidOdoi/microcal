export const batchFourPages = {
  'business-loan-payment-calculator': {
    type: 'business', category: 'business', name: 'Business Loan Payment Calculator', title: 'Business Loan Payment Calculator — Estimate Payments',
    description: 'Calculate estimated business loan payments, total interest, and borrowing costs. Compare loan amounts, terms, rates, and fees.',
    intro: 'Estimate a fixed-rate business loan payment, total interest, origination fee, and cash proceeds before you borrow. Compare payment frequency, term, and fee treatment to see how financing choices change the cost. This model is for fully amortizing installment loans; other business financing may follow different rules.',
    faqs: [
      ['How much is a $50,000 business loan per month?', 'At 10% annual nominal interest for five years, a $50,000 loan with monthly payments is about $1,062.35 per month before fees. Using the unrounded formula payment, the estimated total of 60 payments is about $63,741.13, including about $13,741.13 of interest. Lender schedules and fees can change the amount.'],
      ['How is interest calculated on a business loan?', 'This estimate divides the annual nominal rate by the number of payment periods per year, calculates interest on the outstanding balance each period, and applies the rest of each payment to principal. As the principal falls, the interest portion generally falls. Contracts may use different day counts or repayment structures.'],
      ['What is the difference between a business loan interest rate and APR?', 'The stated interest rate is the rate used to calculate interest on the balance. APR is a broader annualized borrowing-cost measure that can include certain fees. This calculator displays entered interest and origination fees separately; it does not calculate a legally disclosed APR. Compare lender disclosures and fee definitions.'],
    ],
  },
  'how-long-will-my-savings-last-calculator': {
    type: 'runway', category: 'savings', name: 'How Long Will My Savings Last Calculator', title: 'How Long Will My Savings Last? Free Calculator',
    description: 'Find out how long your savings could last. Enter your balance, monthly spending, income, and estimated interest rate to calculate your savings runway.',
    intro: 'Use this how long will my savings last calculator to estimate how many months your available savings could cover planned spending. Enter your current balance, essential expenses, other spending, and income that offsets those costs. Optional return, inflation, and income-growth assumptions show how changing conditions could affect the estimate over time.',
    faqs: [
      ['How long will $20,000 last if I spend $1,500 per month?', 'With no interest, inflation, or income, $20,000 divided by $1,500 is about 13.33 months. With monthly withdrawals, the account would have enough for 13 full withdrawals and would run short during month 14. The result changes if you receive income or have other cash flows.'],
      ['How can I make my savings last longer?', 'Review recurring costs, separate essential from flexible spending, look for reliable income, and model realistic changes before relying on them. Keep emergency needs and near-term cash separate from money intended for long-term investing. Consider speaking with a qualified adviser about major retirement or investment decisions.'],
      ['Does this calculator account for inflation?', 'Yes, if you enter an annual spending-inflation assumption. It converts that annual rate to an equivalent monthly growth rate and raises modeled spending over time. The default is zero. Actual inflation varies by household and year, so compare several scenarios rather than treating one projection as certain.'],
    ],
  },
  'heloc-payment-calculator': {
    type: 'heloc', category: 'home-equity', name: 'HELOC Payment Calculator', title: 'HELOC Payment Calculator — Estimate Monthly Payments',
    description: 'Estimate HELOC draw-period interest payments and repayment-period costs. Compare balances, rates, and repayment terms.',
    intro: 'Estimate a home equity line of credit payment during the draw period and compare it with a fully amortizing repayment payment. Enter your balance, draw time remaining, rate, and repayment term. Optional fees, extra principal, additional borrowing, and a separate repayment-rate scenario make assumptions visible.',
    faqs: [
      ['How much is a monthly payment on a $40,000 HELOC?', 'At 8% annual interest, an interest-only estimate on $40,000 is about $266.67 per month before fees. If that balance is later amortized over 15 years at the same monthly rate, principal and interest would be about $382.26 per month. Your lender’s payment method, rate, fees, and dates may differ.'],
      ['Do HELOC payments increase after the draw period?', 'They can. At the end of the draw period, new borrowing usually stops and the outstanding balance may have to be repaid over a shorter schedule. A payment that previously covered mostly interest can rise when principal repayment begins. Some agreements require a balloon payment, so review your HELOC terms.'],
      ['Can HELOC interest rates change?', 'Many HELOCs have variable rates, so payment amounts can change even if you do not borrow more. Check the index, margin, adjustment frequency, rate caps, and any introductory terms in your agreement. The optional rate scenario here is a what-if assumption, not a forecast.'],
    ],
  },
  'student-loan-interest-calculator': {
    type: 'student', category: 'student-loans', name: 'Student Loan Interest Calculator', title: 'Student Loan Interest Calculator — Estimate Interest',
    description: 'Calculate estimated daily and accrued student loan interest. Enter your loan balance, interest rate, and dates to understand borrowing costs.',
    intro: 'Estimate daily interest and accrued interest over a date range using your student loan principal and annual rate. Add unpaid interest or model a payment to see how it is applied to interest first and then principal. The tool uses a simplified daily-interest estimate and does not assume all federal or private loans have the same subsidy or capitalization rules.',
    faqs: [
      ['How much interest does a $20,000 student loan accrue monthly?', 'At 6% annual interest using a 365.25-day year, $20,000 accrues about $3.29 per day, or about $98.56 over 30 days before payments. A calendar month can have a different number of days, and your loan servicer’s balance and rules determine the actual amount.'],
      ['Do student loans accumulate interest every day?', 'Many student loans accrue interest daily, but the rate, subsidy, and treatment depend on the loan type and status. This estimate uses a daily simple-interest formula on principal. Check your promissory note and servicer account to confirm the formula and whether interest is currently accruing.'],
      ['What happens when student loan interest capitalizes?', 'Capitalization is an event that adds unpaid interest to principal. Once added, future interest may accrue on the increased principal. It does not automatically happen every month in this model; whether and when it applies depends on the loan terms and applicable rules.'],
    ],
  },
} as const;

export type BatchFourSlug = keyof typeof batchFourPages;
