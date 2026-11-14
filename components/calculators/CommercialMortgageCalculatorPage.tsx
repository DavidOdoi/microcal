import Link from 'next/link';
import type { Metadata } from 'next';
import { CommercialMortgageCalculator } from './CommercialMortgageCalculator';
import { CommercialMortgageSupportingContent } from './CommercialMortgageSupportingContent';
const canonical = 'https://microfinancepost.com/calculators/commercial-mortgage-calculator/';
const title = 'Commercial Mortgage Calculator — Payments, Balloon and DSCR';
const description = 'Estimate commercial property loan payments, interest during the term, balloon payments, loan-to-value and illustrative debt service coverage.';
export const commercialMortgageMetadata: Metadata = { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };
export function CommercialMortgageCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Commercial Mortgage Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/business/">Business</Link><span>›</span><span>Commercial Mortgage Calculator</span></nav><h1>Commercial Mortgage Calculator</h1><p>Estimate the scheduled payment on a commercial property loan and see whether a balloon remains at maturity. Compare amortization periods, loan terms, fees and property cash flow.</p></div></header>
    <main className="finance-page container-site"><CommercialMortgageCalculator /><article className="finance-article"><CommercialMortgageSupportingContent /></article></main>
  </>;
}
