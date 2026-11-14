import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { batchFourPages, type BatchFourSlug } from '@/lib/batch-four-pages';
import { BusinessLoanCalculator, SavingsRunwayCalculator, StudentLoanInterestCalculator } from './BatchFourCalculator';
import { HelocCalculator } from './HelocCalculator';
import { HelocSupportingContent } from './HelocSupportingContent';
import { SavingsRunwaySupportingContent } from './SavingsRunwaySupportingContent';
import { BusinessLoanSupportingContent } from './BusinessLoanSupportingContent';
import { StudentLoanInterestSupportingContent } from './StudentLoanInterestSupportingContent';

const calculators = { business: BusinessLoanCalculator, runway: SavingsRunwayCalculator, heloc: HelocCalculator, student: StudentLoanInterestCalculator };
const articles = { business: BusinessLoanSupportingContent, runway: SavingsRunwaySupportingContent, heloc: HelocSupportingContent, student: StudentLoanInterestSupportingContent };
export function BatchFourCalculatorPage({ slug }: { slug: BatchFourSlug }) {
  const page = batchFourPages[slug];
  const Calculator = calculators[page.type];
  const Article = articles[page.type];
  const related = slug === 'business-loan-payment-calculator'
    ? [['Loan Interest Calculator', '/loans/loan-interest-calculator/'], ['Auto Loan Payoff Calculator', '/auto-loans/auto-loan-payoff-calculator/']]
    : slug === 'how-long-will-my-savings-last-calculator'
      ? [['Emergency Fund Calculator', '/savings/emergency-fund-calculator/'], ['High-Yield Savings Account Calculator', '/savings/high-yield-savings-account-calculator/']]
      : slug === 'heloc-payment-calculator'
        ? [['Mortgage Calculator', '/calculators/mortgage-calculator/'], ['Loan Interest Calculator', '/loans/loan-interest-calculator/']]
        : [['Loan Interest Calculator', '/loans/loan-interest-calculator/'], ['Emergency Fund Calculator', '/savings/emergency-fund-calculator/']];
  const baseUrl = 'https://microfinancepost.com';
  const canonical = `${baseUrl}/${page.category}/${slug}/`;
  const structuredData = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical, author: { '@type': 'Person', name: 'David' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: page.category, item: `${baseUrl}/${page.category}/` },
      { '@type': 'ListItem', position: 3, name: page.name, item: canonical },
    ] },
  ]).replace(/</g, '\\u003c');
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }}/>
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={15}/><Link href={`/${page.category}/`}>{page.category.replaceAll('-', ' ')}</Link><ChevronRight size={15}/><span>{page.name}</span></nav><h1>{page.name}</h1><p>{page.intro}</p><p className="finance-byline">By David · <Link href="/about/">Calculation methodology</Link></p></div></header>
    <main className="finance-page container-site"><div id={slug}><Calculator/></div><article className="finance-article"><Article/></article>{slug !== 'heloc-payment-calculator' && <nav className="finance-related" aria-label="Related calculators"><h2>Related calculators</h2>{related.map(([name, href]) => <Link key={href} href={href}>{name}<span aria-hidden="true">→</span></Link>)}</nav>}</main>
  </>;
}
