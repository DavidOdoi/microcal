import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { MortgageExtraCalculator } from './MortgageExtraCalculator';
import { MortgageExtraSupportingContent } from './MortgageExtraSupportingContent';
const slug = 'mortgage-extra-payment-calculator';
const description = 'See how extra mortgage payments can reduce interest and help you pay off your home loan sooner. Compare monthly and lump-sum payments.';
export const mortgageExtraMetadata = calculatorArticleMetadata(slug, 'Mortgage Extra Payment Calculator – Interest Savings', description);
export function MortgageExtraCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Mortgage Extra Payment Calculator" heading="Mortgage Extra Payment Calculator: Estimate Interest Savings and Early Payoff" category="mortgages" categoryName="Mortgages" description={description} intro="Estimate interest and time saved by adding monthly or one-time principal payments to a fixed-rate US mortgage. Compare original and accelerated payoff dates and monthly amortization schedules." calculator={<MortgageExtraCalculator />} article={<MortgageExtraSupportingContent />} />; }
