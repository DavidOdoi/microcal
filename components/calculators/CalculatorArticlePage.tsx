import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export function calculatorArticleMetadata(slug: string, title: string, description: string): Metadata {
  const canonical = `https://microfinancepost.com/calculators/${slug}/`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };
}

export function CalculatorArticlePage({ slug, name, heading, category, categoryName, intro, description, calculator, article }: {
  slug: string; name: string; heading?: string; category: string; categoryName: string; intro: string; description: string; calculator: ReactNode; article: ReactNode;
}) {
  const canonical = `https://microfinancepost.com/calculators/${slug}/`;
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebApplication', name, description, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://microfinancepost.com/' },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `https://microfinancepost.com/${category}/` },
      { '@type': 'ListItem', position: 3, name, item: canonical },
    ] },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href={`/${category}/`}>{categoryName}</Link><span>›</span><span>{name}</span></nav><h1>{heading ?? name}</h1><p>{intro}</p></div></header>
    <div className="finance-page container-site">{calculator}<article className="finance-article">{article}</article></div>
  </>;
}
