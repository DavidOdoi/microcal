import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { StatePaycheckCalculator } from './StatePaycheckCalculator';
import { IdahoPaycheckSupportingContent } from './IdahoPaycheckSupportingContent';
const slug = 'idaho-paycheck-calculator';
const description = 'Estimate Idaho take-home pay using entered federal and state withholding, calculated Social Security and Medicare, and employee benefit deductions.';
export const idahoPaycheckMetadata = calculatorArticleMetadata(slug, 'Idaho Paycheck Calculator 2026 – Take-Home Pay', description);
export function IdahoPaycheckCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Idaho Paycheck Calculator" category="taxes" categoryName="Taxes" description={description} intro="Estimate Idaho take-home pay using income-tax withholding from your payroll records, with calculated Social Security and Medicare contributions. Compare pay schedules, benefit deductions, and 2025 or 2026 payroll scenarios in US dollars." calculator={<StatePaycheckCalculator state="idaho" />} article={<IdahoPaycheckSupportingContent />} />; }
