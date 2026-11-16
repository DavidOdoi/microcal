import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { EarlyWithdrawalCalculator } from './EarlyWithdrawalCalculator';
import { EarlyWithdrawalSupportingContent } from './EarlyWithdrawalSupportingContent';
const slug = '401k-early-withdrawal-calculator';
const description = 'Estimate 401(k) early withdrawal taxes, the additional 10% penalty, and how much money you could keep using our free calculator.';
export const earlyWithdrawalMetadata = calculatorArticleMetadata(slug, '401(k) Early Withdrawal Calculator – Taxes & Penalties', description);
export function EarlyWithdrawalCalculatorPage() { return <CalculatorArticlePage slug={slug} name="401(k) Early Withdrawal Calculator" category="retirement" categoryName="Retirement" description={description} intro="Estimate the amount remaining after a 401(k) withdrawal, including progressive federal income tax, an assumed state tax, and any additional early withdrawal tax. Compare estimated final taxes with withholding and potential lost growth." calculator={<EarlyWithdrawalCalculator />} article={<EarlyWithdrawalSupportingContent />} />; }
