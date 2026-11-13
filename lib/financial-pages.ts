export const financialPages = {
  'debt-to-income-ratio-calculator': {
    type: 'dti', category: 'debt', name: 'Debt-to-Income Ratio Calculator', title: 'Debt-to-Income Ratio Calculator (Free DTI Tool)',
    description: 'Calculate your debt-to-income ratio instantly. Enter your monthly income and debt payments to understand your DTI percentage.',
    intro: 'A debt-to-income ratio calculator shows how much of your gross monthly income goes toward qualifying monthly debt payments. Enter your income and current obligations to estimate your DTI, see the payment breakdown, and optionally check how a proposed loan could change the result.',
    faqs: [
      ['How do I calculate my debt-to-income ratio?', 'Add the monthly payments a lender counts toward debt, then divide that total by your gross monthly income before taxes and deductions. Multiply by 100 to get a percentage. For example, $1,500 in qualifying debt payments divided by $5,000 in gross income equals 30%.'],
      ['What is a good debt-to-income ratio?', 'There is no single DTI percentage that guarantees approval or works for every borrower. Lenders and loan programs set different limits and may calculate obligations differently. A lower ratio generally means less of your income is committed to debt, but review the requirements for the specific loan you are considering.'],
      ['Does rent count toward debt-to-income ratio?', 'Rent is generally not included as a debt payment in a mortgage DTI calculation when the proposed mortgage payment is counted. Lenders may review housing expenses in other ways, and treatment can differ by loan product. Avoid adding both rent and the replacement mortgage payment to one standard DTI estimate.'],
    ],
  },
  'emergency-fund-calculator': {
    type: 'emergency', category: 'savings', name: 'Emergency Fund Calculator', title: 'Emergency Fund Calculator — How Much Should You Save?',
    description: 'Use our free emergency fund calculator to estimate your savings goal, months of expenses covered, and how long it may take to reach your target.',
    intro: 'Estimate an emergency savings target from the essential monthly costs you enter, then compare it with your current savings and monthly contributions. Choose a coverage period that fits your situation; the result is a planning estimate, not a one-size-fits-all rule.',
    faqs: [
      ['How much should I save for an emergency fund?', 'There is no amount that fits every household. A useful starting point is to total essential monthly costs and choose a coverage period based on your income stability, dependents, health needs, and likely risks. Even a smaller first target can provide a useful cushion while you keep building savings.'],
      ['Is three months of expenses enough?', 'Three months may be a workable milestone for some people, while others may prefer a larger reserve because income is irregular, dependents rely on them, or replacing income could take longer. Choose a target you can work toward and revisit it as your expenses or circumstances change.'],
      ['What expenses should an emergency fund cover?', 'Use essential costs you would need to keep paying during an unexpected disruption, such as housing, food, utilities, transportation, insurance, and required debt payments. The fund is for unplanned costs or income shocks, not routine spending already included in your monthly budget.'],
    ],
  },
  'cd-interest-calculator': {
    type: 'cd', category: 'savings', name: 'CD Interest Calculator', title: 'CD Interest Calculator — Estimate Your Earnings',
    description: 'Calculate CD interest earnings and maturity value instantly. Enter your deposit, rate, term, and compounding frequency.',
    intro: 'Estimate how much interest a certificate of deposit may earn and its value at maturity. Enter an APY or a nominal annual interest rate with its compounding frequency. Results are estimates; your bank’s CD agreement determines the actual rate, crediting schedule, maturity terms, and any early-withdrawal penalty.',
    faqs: [
      ['How do I calculate interest on a CD?', 'With APY, multiply the deposit by (1 + APY) raised to the number of years, then subtract the original deposit to estimate interest. With a nominal rate, use the stated rate and compounding frequency in the compound-interest formula. The calculator keeps these rate modes separate so APY is not compounded twice.'],
      ['How much interest will $10,000 earn in a CD?', 'At a constant 4% APY for two years, $10,000 would grow to about $10,816, or roughly $816 in interest, before any taxes or fees. This example assumes the APY remains applicable for the full term and interest stays in the account until maturity.'],
      ['Does CD interest compound daily or monthly?', 'It depends on the institution and the CD agreement. A disclosed APY reflects the effect of the account’s rate and compounding terms; a nominal interest rate does not. Check the account disclosure for how interest is compounded, credited, and paid, as well as what happens if you withdraw early.'],
    ],
  },
} as const;

export type FinancialPageSlug = keyof typeof financialPages;
