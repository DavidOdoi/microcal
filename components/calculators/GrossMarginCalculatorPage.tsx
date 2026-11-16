import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { GrossMarginCalculator } from './GrossMarginCalculator';
import { GrossMarginSupportingContent } from './GrossMarginSupportingContent';
const slug = 'gross-margin-calculator';
const description = 'Calculate gross profit, gross margin percentage, markup, and target selling price with our free business calculator.';
export const grossMarginMetadata = calculatorArticleMetadata(slug, 'Gross Margin Calculator – Profit & Markup', description);
export function GrossMarginCalculatorPage() { return <CalculatorArticlePage slug={slug} name="Gross Margin Calculator" heading="Gross Margin Calculator: Calculate Gross Profit and Profit Margin" category="business" categoryName="Business" description={description} intro="Compare revenue and direct costs to calculate gross profit, margin, and markup. Switch to selling-price mode to estimate the price needed for a target gross margin using US dollar amounts." calculator={<GrossMarginCalculator />} article={<GrossMarginSupportingContent />} />; }
