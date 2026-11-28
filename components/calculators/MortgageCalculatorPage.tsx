import content from '@/content/mortgage-pillar.json';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { MortgageCalculator } from './MortgageCalculator';
import { MortgageSupportingContent } from './MortgageSupportingContent';

const slug = 'mortgage-calculator';
const description = 'Use our free mortgage calculator to estimate monthly payments, including principal, interest, property taxes, insurance, PMI and HOA fees.';
export const mortgageMetadata = calculatorArticleMetadata(slug, 'Mortgage Calculator – Estimate Your Monthly Payment', description);

export function MortgageCalculatorPage() {
  return <CalculatorArticlePage
    slug={slug} name="Mortgage Calculator" category="mortgages" categoryName="Mortgages"
    intro={content.intro} description={description} pageDetails={{ dateModified: '2026-11-28', publisher: 'MicroFinancePost' }}
    calculator={<MortgageCalculator />} article={<MortgageSupportingContent />}
  />;
}
