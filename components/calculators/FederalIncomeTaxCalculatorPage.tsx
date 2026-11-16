import { permanentRedirect } from 'next/navigation';
import { remainingPages } from '@/lib/remaining-pages';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { FederalIncomeTaxCalculator } from './FederalIncomeTaxCalculator';
import { FederalIncomeTaxSupportingContent } from './FederalIncomeTaxSupportingContent';
const slug = 'income-tax-calculator';
const description = 'Calculate your estimated 2026 federal income tax using IRS tax brackets, filing status, and deductions. Understand your tax rate with our free calculator.';
export const federalIncomeTaxMetadata = calculatorArticleMetadata(slug, 'Federal Income Tax Calculator 2026 – Free Tool', description);
export function FederalIncomeTaxCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Federal Income Tax Calculator" category="taxes" categoryName="Taxes" description={description} intro={remainingPages['income-tax-calculator'].intro} calculator={<FederalIncomeTaxCalculator />} article={<FederalIncomeTaxSupportingContent />} />; }
export function FederalIncomeTaxAliasPage(): never { return permanentRedirect('/calculators/income-tax-calculator/'); }
