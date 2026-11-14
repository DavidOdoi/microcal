import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DtiCalculator, EmergencyFundCalculator, CdInterestCalculator } from './FinancialCalculator';
import { financialPages, type FinancialPageSlug } from '@/lib/financial-pages';
import { DtiSupportingArticle } from './FinancialSupportingContent';
import { EmergencyFundSupportingContent } from './EmergencyFundSupportingContent';
import { CdInterestSupportingContent } from './CdInterestSupportingContent';

const sources: Record<FinancialPageSlug, { label: string; href: string }[]> = {
  'debt-to-income-ratio-calculator': [{ label: 'Consumer Financial Protection Bureau: What is a debt-to-income ratio?', href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/' }],
  'emergency-fund-calculator': [
    { label: 'CFPB: An essential guide to building an emergency fund', href: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/' },
    { label: 'CFPB: Determine your down payment', href: 'https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/' },
  ],
  'cd-interest-calculator': [
    { label: 'FDIC: Truth in Savings and APY disclosures', href: 'https://www.fdic.gov/consumer-compliance-examination-manual/vi-3-truth-savings' },
    { label: 'FDIC: Deposit insurance information for CDs', href: 'https://www.fdic.gov/resources/deposit-insurance' },
  ],
};

const calculatorComponent = {
  dti: DtiCalculator,
  emergency: EmergencyFundCalculator,
  cd: CdInterestCalculator,
};

export function FinancialCalculatorPage({ slug }: { slug: FinancialPageSlug }) {
  const page = financialPages[slug];
  const Calculator = calculatorComponent[page.type];
  const related = slug === 'debt-to-income-ratio-calculator'
    ? [['Emergency Fund Calculator', '/savings/emergency-fund-calculator/'], ['CD Interest Calculator', '/savings/cd-interest-calculator/']]
    : slug === 'emergency-fund-calculator'
      ? [['Debt-to-Income Ratio Calculator', '/debt/debt-to-income-ratio-calculator/'], ['CD Interest Calculator', '/savings/cd-interest-calculator/']]
      : [['Emergency Fund Calculator', '/savings/emergency-fund-calculator/'], ['Debt-to-Income Ratio Calculator', '/debt/debt-to-income-ratio-calculator/']];

  const baseUrl = 'https://microfinancepost.com';
  const canonical = `${baseUrl}/${page.category}/${slug}/`;
  const structuredData = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical, author: { '@type': 'Person', name: 'David' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: page.category === 'debt' ? 'Debt' : 'Savings', item: `${baseUrl}/${page.category}/` },
      { '@type': 'ListItem', position: 3, name: page.name, item: canonical },
    ] },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: page.name, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', description: page.description, url: canonical, author: { '@type': 'Person', name: 'David' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  ];
  const schema = JSON.stringify(structuredData).replace(/</g, '\\u003c');

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={15} /><Link href={`/${page.category}/`}>{page.category === 'debt' ? 'Debt' : 'Savings'}</Link><ChevronRight size={15} /><span>{page.name}</span></nav><h1>{page.name}</h1><p>{page.intro}</p><p className="finance-byline">By David · <Link href="/about/">Calculation methodology</Link></p></div></header>
    <main className="finance-page container-site">
      {slug === 'cd-interest-calculator' ? <div id="cd-interest-calculator"><Calculator /></div> : <Calculator />}
      <article className="finance-article">
        {slug === 'debt-to-income-ratio-calculator' && <DtiSupportingArticle />}
        {slug === 'emergency-fund-calculator' && <EmergencyFundSupportingContent />}
        {slug === 'cd-interest-calculator' && <CdInterestSupportingContent />}
        {slug === 'debt-to-income-ratio-calculator' && <><section className="finance-article-section"><h2>Frequently Asked Questions</h2><div className="finance-faqs">{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
        <section className="finance-sources"><h2>Sources and methodology</h2><p>We use the formulas shown above and the information from these authoritative sources. Calculator results are estimates for education and planning, not financial advice, an offer, or a loan decision. Learn more about our <Link href="/about/">editorial approach</Link>.</p><ul>{sources[slug].map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></section></>}
      </article>
      <nav className="finance-related" aria-label="Related calculators"><h2>Related calculators</h2>{related.map(([name, href]) => <Link key={href} href={href}>{name}<span aria-hidden="true">→</span></Link>)}</nav>
    </main>
  </>;
}
