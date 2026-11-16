import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { UsInflationCalculator } from './UsInflationCalculator';
import { UsInflationSupportingContent } from './UsInflationSupportingContent';
const slug = 'us-inflation-calculator';
const description = 'Calculate how US inflation changes the value of money between years using historical Consumer Price Index data.';
export const usInflationMetadata = calculatorArticleMetadata(slug, 'US Inflation Calculator – Dollar Value by Year', description);
export function UsInflationCalculatorPage() { return <CalculatorArticlePage slug={slug} name="US Inflation Calculator" heading="US Inflation Calculator: Compare the Value of Money Over Time" category="savings" categoryName="Savings" description={description} intro="Compare a dollar amount between calendar years using published US CPI-U annual averages. See the equivalent dollar value, cumulative price change, and purchasing power of unchanged cash." calculator={<UsInflationCalculator />} article={<UsInflationSupportingContent />} />; }
