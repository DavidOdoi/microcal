import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { DscrLoanCalculator } from './DscrLoanCalculator';
import { DscrLoanSupportingContent } from './DscrLoanSupportingContent';
const slug = 'dscr-loan-calculator';
const description = 'Use our free DSCR loan calculator to calculate debt service coverage, rental property income, and annual debt payments before financing.';
export const dscrLoanMetadata = calculatorArticleMetadata(slug, 'DSCR Loan Calculator – Calculate Debt Coverage', description);
export function DscrLoanCalculatorPage() {
  return <CalculatorArticlePage slug={slug} name="DSCR Loan Calculator" category="business" categoryName="Business" description={description} intro="Estimate a rental property’s debt service coverage ratio from income, vacancies, operating expenses, and debt payments. Compare property cash flow and supportable borrowing under a target DSCR." calculator={<DscrLoanCalculator />} article={<DscrLoanSupportingContent />} />;
}
