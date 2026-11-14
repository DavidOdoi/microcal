import Link from 'next/link';
import type { Metadata } from 'next';
import { RentVsBuyCalculator } from './RentVsBuyCalculator';
import { RentVsBuySupportingContent } from './RentVsBuySupportingContent';
const canonical = 'https://microfinancepost.com/calculators/rent-vs-buy-calculator/';
export const rentVsBuyMetadata: Metadata = {
  title: 'Rent vs. Buy Calculator — Compare Housing Costs',
  description: 'Compare the monthly costs and projected financial position of renting and buying a home, including mortgage equity, transaction costs and growth assumptions.',
  alternates: { canonical },
};
export function RentVsBuyCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Rent vs. Buy Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/mortgages/">Mortgages</Link><span>›</span><span>Rent vs. Buy Calculator</span></nav><h1>Rent vs. Buy Calculator</h1><p>Compare renting with buying a home over the time you expect to stay. Include your mortgage, ownership costs and transaction fees, then explore how different growth assumptions affect the comparison.</p></div></header>
    <main className="finance-page container-site"><RentVsBuyCalculator /><article className="finance-article"><RentVsBuySupportingContent /></article></main>
  </>;
}
