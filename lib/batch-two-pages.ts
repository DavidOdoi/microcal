export const batchTwoPages = {
  'high-yield-savings-account-calculator': {
    type: 'hysa', category: 'savings', name: 'High-Yield Savings Account Calculator', title: 'High-Yield Savings Account Calculator (Free Tool)',
    description: 'Calculate high-yield savings interest and future balance. Enter your deposit, APY, monthly contributions, and savings period for instant results.',
    intro: 'Estimate how a starting deposit and regular monthly contributions may grow in a high-yield savings account. Enter the account’s APY, your savings timeline, and any planned withdrawals to see projected interest, deposits, and ending balance. The estimate assumes one APY for the entire period.',
    faqs: [
      ['How much interest will $10,000 earn in a high-yield savings account?', 'At a constant 4% APY with no deposits or withdrawals, $10,000 would grow to about $10,816 in two years, earning about $816. Actual savings APYs may change, so the result is a projection rather than a guaranteed account balance.'],
      ['How is high-yield savings interest calculated?', 'APY describes the annual yield after compounding. This calculator converts APY to an equivalent monthly rate, applies that rate to the balance each month, and then applies deposits and withdrawals according to their selected timing. Banks may calculate interest using daily balances and credit it on a different schedule.'],
      ['Can high-yield savings account rates change?', 'Yes. Many savings accounts have variable rates, and the bank may change the rate under the account terms. If APY changes during your savings period, actual interest will differ from a projection that holds today’s APY constant. Review your account disclosures and rate notices.'],
    ],
  },
  'auto-loan-payoff-calculator': {
    type: 'auto', category: 'auto-loans', name: 'Auto Loan Payoff Calculator', title: 'Auto Loan Payoff Calculator — Pay Off Your Car Early',
    description: 'Calculate how early you can pay off your car loan. Add extra payments to estimate interest savings and your new payoff date.',
    intro: 'Compare your current auto-loan schedule with a plan that adds monthly or one-time principal payments. Enter the outstanding balance, rate, required payment, and next due date to estimate payoff timing and interest. This calculator uses a simplified monthly-accrual model, so your lender’s payoff quote may differ.',
    faqs: [
      ['How can I pay off my car loan faster?', 'First check how your lender applies extra payments and whether your contract includes a prepayment penalty. If permitted, direct extra money to principal and continue making the required payment. This calculator estimates the effect, but confirm payment instructions and the current payoff amount with your servicer.'],
      ['How much interest can I save by making extra payments?', 'Savings depend on your remaining balance, rate, timing, regular payment, and extra amount. The calculator compares two estimated schedules using the same monthly-accrual assumptions. It cannot know daily interest, fees, or contract rules, so use your lender’s figures before deciding how much to pay.'],
      ['Is there a penalty for paying off a car loan early?', 'It depends on your contract and applicable state law. Review the loan agreement or ask the lender whether a prepayment penalty applies and how it is calculated. The CFPB recommends checking the contract; do not assume every auto loan has the same rule.'],
    ],
  },
  'loan-interest-calculator': {
    type: 'loan', category: 'loans', name: 'Loan Interest Calculator', title: 'Loan Interest Calculator — Calculate Total Interest',
    description: 'Calculate loan interest instantly. Compare simple interest and amortizing loans to understand total interest, monthly payments, and borrowing costs.',
    intro: 'Estimate interest and repayment for a loan using either a simple-interest illustration or a fixed-payment amortizing model. Enter the principal, annual interest rate, term, and payment frequency to see the payment amount and principal-versus-interest schedule. Actual lender quotes can also include fees and contract-specific terms.',
    faqs: [
      ['How do I calculate interest on a loan?', 'The method depends on the loan structure. A simple-interest estimate multiplies principal by annual rate and time. An amortizing loan calculates periodic interest on the remaining balance, then applies each payment to interest and principal. Check your agreement to identify the method and payment schedule.'],
      ['What is the difference between simple and compound interest on a loan?', 'Simple interest is calculated on principal or, for many installment loans, the outstanding balance. Compound interest adds unpaid interest to the balance so later interest can accrue on it. Loan contracts may use different methods; this calculator’s amortizing option models periodic interest on the unpaid principal.'],
      ['How can I reduce the interest I pay on a loan?', 'Depending on your contract, a lower rate, shorter term, or additional principal payments may reduce interest. Compare the total repayment and fees, not only the payment size. Check for prepayment rules and make sure extra payments are applied to principal as intended.'],
    ],
  },
} as const;

export type BatchTwoSlug = keyof typeof batchTwoPages;
