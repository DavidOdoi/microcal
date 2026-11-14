import Link from 'next/link';
import type { Metadata } from 'next';
import { FhaHomeLoanCalculator } from './FhaHomeLoanCalculator';
import { FhaHomeLoanSupportingContent } from './FhaHomeLoanSupportingContent';
const canonical = 'https://microfinancepost.com/calculators/fha-home-loan-calculator/';
const title = 'FHA Home Loan Calculator — Payments and Mortgage Insurance';
const description = 'Estimate FHA loan payments, financed or cash upfront MIP, annual mortgage insurance, property taxes and homeowners insurance using adjustable assumptions.';
export const fhaHomeLoanMetadata: Metadata = { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };
export function FhaHomeLoanCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'FHA Home Loan Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/mortgages/">Mortgages</Link><span>›</span><span>FHA Home Loan Calculator</span></nav><h1>FHA Home Loan Calculator</h1><p>Estimate a fixed-rate FHA mortgage payment with upfront and annual mortgage insurance. Compare down payments, insurance assumptions and housing costs without treating the result as a lender approval.</p></div></header>
    <main className="finance-page container-site"><FhaHomeLoanCalculator /><article className="finance-article"><FhaHomeLoanSupportingContent /></article></main>
  </>;
}
