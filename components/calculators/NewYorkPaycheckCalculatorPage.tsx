import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { StatePaycheckCalculator } from './StatePaycheckCalculator';
import { NewYorkPaycheckSupportingContent } from './NewYorkPaycheckSupportingContent';
const slug = 'new-york-paycheck-calculator';
const description = 'Estimate 2026 New York take-home pay using entered federal, state, and local withholding, with calculated Social Security, Medicare, and Paid Family Leave.';
export const newYorkPaycheckMetadata = calculatorArticleMetadata(slug, 'New York Paycheck Calculator 2026 – Take-Home Pay', description);
export function NewYorkPaycheckCalculatorPage() { return <CalculatorArticlePage slug={slug} name="New York Paycheck Calculator" category="taxes" categoryName="Taxes" description={description} intro="Estimate your New York paycheck using income-tax withholding from your payroll records, alongside calculated Social Security, Medicare, and applicable Paid Family Leave contributions. Compare pay frequencies and benefit deductions in US dollars." calculator={<StatePaycheckCalculator state="ny" />} article={<NewYorkPaycheckSupportingContent />} />; }
