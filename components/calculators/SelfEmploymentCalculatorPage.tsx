import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { SelfEmploymentCalculator } from './SelfEmploymentCalculator';
import { SelfEmploymentSupportingContent } from './SelfEmploymentSupportingContent';
const slug = '1099-tax-calculator';
const description = 'Estimate 2026 federal income tax and self-employment tax on freelance and 1099 income, including deductible expenses.';
export const selfEmploymentMetadata = calculatorArticleMetadata(slug, '1099 Tax Calculator 2026 – Freelancer Tax Estimate', description);
export function SelfEmploymentCalculatorPage() { return <CalculatorArticlePage slug={slug} name="1099 Tax Calculator" heading="1099 Tax Calculator: Estimate Taxes on Freelance Income" category="taxes" categoryName="Taxes" description={description} intro="Estimate US federal taxes on sole-proprietor income for 2025 or 2026. Compare self-employment tax, progressive federal income tax, and Additional Medicare tax with W-2 wages, standard deductions, and supported adjustments." calculator={<SelfEmploymentCalculator />} article={<SelfEmploymentSupportingContent />} />; }
