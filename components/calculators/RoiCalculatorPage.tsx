import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { RoiCalculator } from './RoiCalculator';
import { RoiSupportingContent } from './RoiSupportingContent';
const slug = 'roi-calculator';
const description = 'Calculate return on investment, net profit, ROI percentage, and annualized investment returns with our free ROI calculator.';
export const roiMetadata = calculatorArticleMetadata(slug, 'ROI Calculator – Return on Investment', description);
export function RoiCalculatorPage() { return <CalculatorArticlePage slug={slug} name="ROI Calculator" heading="ROI Calculator: Calculate Return on Investment" category="investments" categoryName="Investments" description={description} intro="Calculate simple return on investment from total costs and final proceeds. Add an optional holding period or dates for a compounded annualized comparison when the cash-flow assumptions support it." calculator={<RoiCalculator />} article={<RoiSupportingContent />} />; }
