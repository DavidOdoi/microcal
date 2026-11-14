import Link from 'next/link';
import type { Metadata } from 'next';
import { HomeEquityLoanCalculator } from './HomeEquityLoanCalculator';
import { HomeEquityLoanSupportingContent } from './HomeEquityLoanSupportingContent';
const canonical = 'https://microfinancepost.com/calculators/home-equity-loan-calculator/';
const title = 'Home Equity Loan Calculator — Payments and Borrowing Capacity';
const description = 'Estimate fixed-rate home equity loan payments, interest, fees and borrowing capacity under your chosen combined loan-to-value limit.';
export const homeEquityLoanMetadata: Metadata = { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };
export function HomeEquityLoanCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Home Equity Loan Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/home-equity/">Home Equity</Link><span>›</span><span>Home Equity Loan Calculator</span></nav><h1>Home Equity Loan Calculator</h1><p>Estimate a fixed-rate home equity loan payment and your borrowing capacity under a chosen combined loan-to-value limit. Include upfront fees to compare interest and total repayment costs.</p></div></header>
    <main className="finance-page container-site"><HomeEquityLoanCalculator /><article className="finance-article"><HomeEquityLoanSupportingContent /></article></main>
  </>;
}
