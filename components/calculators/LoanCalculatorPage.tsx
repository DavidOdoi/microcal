import Link from 'next/link';
import type { Metadata } from 'next';
import { LoanCalculator } from './LoanCalculator';
import { LoanSupportingContent } from './LoanSupportingContent';

const canonical = 'https://microfinancepost.com/calculators/loan-calculator/';
const title = 'Loan Calculator – Estimate Monthly Payments & Interest';
const description = 'Calculate monthly loan payments, total interest, and repayment costs. Compare loan amounts, interest rates, and terms with our free calculator.';
export const loanMetadata: Metadata = { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };

export function LoanCalculatorPage() {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebApplication', name: 'Loan Calculator', description, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://microfinancepost.com/' },
      { '@type': 'ListItem', position: 2, name: 'Loans', item: 'https://microfinancepost.com/loans/' },
      { '@type': 'ListItem', position: 3, name: 'Loan Calculator', item: canonical },
    ] },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/loans/">Loans</Link><span>›</span><span>Loan Calculator</span></nav><h1>Loan Calculator</h1><p>Estimate monthly loan payments, total interest, and repayment costs. Compare loan amounts, interest rates, and terms, with optional fees and extra principal payments.</p></div></header>
    <div className="finance-page container-site"><LoanCalculator /><article className="finance-article"><LoanSupportingContent /></article></div>
  </>;
}
