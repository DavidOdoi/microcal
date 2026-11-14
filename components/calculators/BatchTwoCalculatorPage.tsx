import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { batchTwoPages, type BatchTwoSlug } from '@/lib/batch-two-pages';
import { HighYieldSavingsCalculator, AutoLoanPayoffCalculator, LoanInterestCalculator } from './BatchTwoCalculator';
import { LoanInterestArticle } from './BatchTwoSupportingContent';

import { AutoLoanPayoffSupportingContent } from './AutoLoanPayoffSupportingContent';
import { HighYieldSavingsSupportingContent } from './HighYieldSavingsSupportingContent';

const calculators = { hysa: HighYieldSavingsCalculator, auto: AutoLoanPayoffCalculator, loan: LoanInterestCalculator };
const articles = { hysa: HighYieldSavingsSupportingContent, auto: AutoLoanPayoffSupportingContent, loan: LoanInterestArticle };
const sources: Record<BatchTwoSlug, { label: string; href: string }[]> = {
  'high-yield-savings-account-calculator': [{ label: 'CFPB Regulation DD, Appendix A: Annual Percentage Yield Calculation', href: 'https://www.consumerfinance.gov/rules-policy/regulations/1030/a/' }],
  'auto-loan-payoff-calculator': [
    { label: 'CFPB: Simple interest and precomputed interest on auto loans', href: 'https://www.consumerfinance.gov/ask-cfpb/whats-the-difference-between-a-simple-interest-rate-and-precomputed-interest-on-an-auto-loan-en-841/' },
    { label: 'CFPB: Prepaying a loan and possible penalties', href: 'https://www.consumerfinance.gov/ask-cfpb/can-i-prepay-my-loan-at-any-time-without-penalty-en-843/' },
  ],
  'loan-interest-calculator': [
    { label: 'CFPB: Loan interest rate compared with APR', href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/' },
    { label: 'CFPB: Fees on personal installment loans', href: 'https://www.consumerfinance.gov/ask-cfpb/do-personal-installment-loans-have-fees-en-2120/' },
  ],
};

export function BatchTwoCalculatorPage({ slug }: { slug: BatchTwoSlug }) {
  const page = batchTwoPages[slug];
  const Calculator = calculators[page.type];
  const Article = articles[page.type];
  const related = slug === 'high-yield-savings-account-calculator'
    ? [['Emergency Fund Calculator', '/savings/emergency-fund-calculator/'], ['CD Interest Calculator', '/savings/cd-interest-calculator/']]
    : slug === 'auto-loan-payoff-calculator'
      ? [['Auto Loan Calculator', '/calculators/auto-loan-calculator/'], ['Loan Interest Calculator', '/loans/loan-interest-calculator/']]
      : [['Personal Loan Calculator', '/calculators/personal-loan-calculator/'], ['Auto Loan Payoff Calculator', '/auto-loans/auto-loan-payoff-calculator/']];
  const baseUrl = 'https://microfinancepost.com';
  const canonical = `${baseUrl}/${page.category}/${slug}/`;
  const schema = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: canonical, author: { '@type': 'Person', name: 'David' } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: page.category, item: `${baseUrl}/${page.category}/` },
      { '@type': 'ListItem', position: 3, name: page.name, item: canonical },
    ] },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: page.name, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', description: page.description, url: canonical, author: { '@type': 'Person', name: 'David' }, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  ]).replace(/</g, '\\u003c');

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight size={15}/><Link href={`/${page.category}/`}>{page.category}</Link><ChevronRight size={15}/><span>{page.name}</span></nav><h1>{page.name}</h1><p>{page.intro}</p><p className="finance-byline">By David · <Link href="/about/">Calculation methodology</Link></p></div></header>
    <main className="finance-page container-site">{slug !== 'loan-interest-calculator' ? <div id={slug}><Calculator/></div> : <Calculator/>}<article className="finance-article"><Article/>{slug === 'loan-interest-calculator' && <><section className="finance-article-section"><h2>Frequently Asked Questions</h2><div className="finance-faqs">{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section><section className="finance-sources"><h2>Sources and methodology</h2><p>This page explains the assumptions used by the calculator and links to official consumer guidance. Results are estimates for education and planning, not lender quotes, guarantees, or personalized financial advice. For calculations, see the <Link href="/about/">site methodology</Link>.</p><ul>{sources[slug].map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul></section></>}</article><nav className="finance-related" aria-label="Related calculators"><h2>Related calculators</h2>{related.map(([name, href])=><Link key={href} href={href}>{name}<span aria-hidden="true">→</span></Link>)}</nav></main>
  </>;
}
