import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { batchFourPages, type BatchFourSlug } from '@/lib/batch-four-pages';
import { BusinessLoanCalculator, HelocCalculator, SavingsRunwayCalculator, StudentLoanInterestCalculator } from './BatchFourCalculator';
import { BusinessLoanArticle, HelocArticle, SavingsRunwayArticle, StudentLoanArticle } from './BatchFourSupportingContent';

const calculators = { business: BusinessLoanCalculator, runway: SavingsRunwayCalculator, heloc: HelocCalculator, student: StudentLoanInterestCalculator };
const articles = { business: BusinessLoanArticle, runway: SavingsRunwayArticle, heloc: HelocArticle, student: StudentLoanArticle };
const sources: Record<BatchFourSlug, { label: string; href: string }[]> = {
  'business-loan-payment-calculator': [{ label: 'CFPB: How a loan interest rate differs from APR', href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-loan-interest-rate-and-the-apr-en-733/' }],
  'how-long-will-my-savings-last-calculator': [],
  'heloc-payment-calculator': [{ label: 'CFPB: What is a HELOC?', href: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-107/' }, { label: 'CFPB HELOC consumer guide', href: 'https://files.consumerfinance.gov/f/documents/cfpb_heloc-brochure.pdf' }],
  'student-loan-interest-calculator': [{ label: 'Federal Student Aid: Student loan interest rates', href: 'https://studentaid.gov/understand-aid/types/loans/interest-rates' }, { label: 'MOHELA: Student loan interest guide', href: 'https://mohela.studentaid.gov/DL/resourceCenter/StudentLoanInterest.aspx' }],
};

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
    <main className="finance-page container-site"><Calculator/><article className="finance-article"><Article/><section className="finance-article-section"><h2>Frequently Asked Questions</h2><div className="finance-faqs">{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section><section className="finance-sources"><h2>Sources and methodology</h2><p>These calculator results are estimates for education and planning, not lender quotes, guarantees, or personalized financial advice. Review your loan documents and current servicer information for terms that apply to you.</p>{sources[slug].length > 0 && <ul>{sources[slug].map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>}<p>See the site’s <Link href="/about/">calculation methodology</Link> for general assumptions.</p></section></article><nav className="finance-related" aria-label="Related calculators"><h2>Related calculators</h2>{related.map(([name, href]) => <Link key={href} href={href}>{name}<span aria-hidden="true">→</span></Link>)}</nav></main>
  </>;
}
