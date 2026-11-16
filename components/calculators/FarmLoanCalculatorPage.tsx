import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { FarmLoanCalculator } from './FarmLoanCalculator';
import { FarmLoanSupportingContent } from './FarmLoanSupportingContent';
const slug = 'farm-loan-calculator';
const description = 'Calculate farm loan payments, interest, and repayment costs. Compare agricultural land, equipment, and operating loans with our free calculator.';
export const farmLoanMetadata = calculatorArticleMetadata(slug, 'Farm Loan Calculator – Estimate Loan Payments', description);
export function FarmLoanCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Farm Loan Calculator" category="business" categoryName="Business" description={description} intro="Estimate fixed-rate farm loan payments for land, equipment, or operating needs. Compare monthly, quarterly, and annual repayments, with optional down payments, fees, extra principal, and a farm cash-flow illustration." calculator={<FarmLoanCalculator />} article={<FarmLoanSupportingContent />} />; }
