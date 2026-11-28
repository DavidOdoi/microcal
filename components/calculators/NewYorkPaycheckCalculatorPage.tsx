import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { StatePaycheckCalculator } from './StatePaycheckCalculator';
import { StatePaystubGuideArticle } from './StatePaystubGuidePage';
import content from '@/content/paychecks/new-york.json';
const slug = 'new-york-paycheck-calculator';
const description = 'Estimate 2026 New York take-home pay using entered federal, state, and local withholding, with calculated Social Security, Medicare, and Paid Family Leave.';
export const newYorkPaycheckMetadata = calculatorArticleMetadata(slug, content.title, content.metaDescription);
export function NewYorkPaycheckCalculatorPage() { return <CalculatorArticlePage slug={slug} name="New York Paycheck Calculator" category="taxes" categoryName="Taxes" description={description} intro="Estimate your New York paycheck using income-tax withholding from your payroll records, alongside calculated Social Security, Medicare, and applicable Paid Family Leave contributions. Enter any disability withholding shown on your paystub. Compare pay frequencies and benefit deductions in US dollars." calculator={<StatePaycheckCalculator state="ny" />} article={<StatePaystubGuideArticle content={content} />} />; }
