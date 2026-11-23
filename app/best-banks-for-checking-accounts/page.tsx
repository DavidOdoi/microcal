import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/site/PageHero';
import { categoryArticlePath, checkingAccountsArticle } from '@/lib/category-articles';

const article = checkingAccountsArticle;
const canonical = `https://microfinancepost.com${categoryArticlePath(article)}`;

export const metadata: Metadata = {
  title: '5 Best Banks for Checking Accounts in 2026 | MicroFinancePost',
  description: article.description,
  alternates: { canonical },
  openGraph: { title: article.title, description: article.description, url: canonical, type: 'article' },
};

export default function BestCheckingAccountsPage() {
  const { Body } = article;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        mainEntityOfPage: canonical,
        publisher: { '@type': 'Organization', name: 'MicroFinancePost', url: 'https://microfinancepost.com/' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://microfinancepost.com/' },
          { '@type': 'ListItem', position: 2, name: 'Savings', item: 'https://microfinancepost.com/savings/' },
          { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow="Banking comparison" title={article.title} crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={16} aria-hidden="true" />
          <Link href="/savings/">Savings</Link>
        </nav>
      }>
        {article.description}
      </PageHero>
      <article className="container-site section-block">
        <Body />
      </article>
    </>
  );
}
