import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { SocialSecurityBenefitsCalculator } from './SocialSecurityBenefitsCalculator';
import { SocialSecurityBenefitsSupportingContent } from './SocialSecurityBenefitsSupportingContent';
const slug = 'social-security-benefits-calculator';
const description = 'Estimate Social Security retirement benefits using earnings and claiming age. Compare monthly payments at ages 62, 67, and 70 with our free calculator.';
export const socialSecurityBenefitsMetadata = calculatorArticleMetadata(slug, 'Social Security Benefits Calculator – Estimate Pay', description);
export function SocialSecurityBenefitsCalculatorPage() {
  return <CalculatorArticlePage slug={slug} name="Social Security Benefits Calculator" category="retirement" categoryName="Retirement" description={description} intro="Compare estimated Social Security retirement benefits at different claiming ages using your SSA statement or the 2026 eligibility formula. Explore full retirement age, monthly claiming adjustments, and an optional COLA assumption." calculator={<SocialSecurityBenefitsCalculator />} article={<SocialSecurityBenefitsSupportingContent />} />;
}
