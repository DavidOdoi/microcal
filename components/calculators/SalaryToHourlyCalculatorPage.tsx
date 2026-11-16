import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { SalaryToHourlyCalculator } from './SalaryToHourlyCalculator';
import { SalaryToHourlySupportingContent } from './SalaryToHourlySupportingContent';
const slug = 'salary-to-hourly-calculator';
const description = 'Convert annual salary into hourly, weekly, biweekly, and monthly pay. Compare working hours and calculate your equivalent hourly wage for free.';
export const salaryToHourlyMetadata = calculatorArticleMetadata(slug, 'Salary to Hourly Calculator – Convert Your Pay', description);
export function SalaryToHourlyCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Salary to Hourly Calculator" category="taxes" categoryName="Taxes" description={description} intro="Convert annual salary into an equivalent hourly wage, or project annual gross earnings from an hourly rate. Compare working hours, weeks, and pay frequencies before US taxes and deductions." calculator={<SalaryToHourlyCalculator />} article={<SalaryToHourlySupportingContent />} />; }
