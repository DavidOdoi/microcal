import { ArrowDown, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/articles/CheckingAccountComparison.module.css';
import { categoryArticlePath, checkingAccountsArticle } from '@/lib/category-articles';

const article = checkingAccountsArticle;
const canonical = `https://microfinancepost.com${categoryArticlePath(article)}`;
const cover = {
  url: '/images/checking-accounts/checking-account-comparison.webp',
  width: 1200,
  height: 800,
  alt: 'An unbranded debit card beside a calculator and notebook',
};

export const metadata: Metadata = {
  title: '5 Best Banks for Checking Accounts in 2026 (Fees & APYs Compared)',
  description: article.description,
  alternates: { canonical },
  openGraph: {
    title: article.title,
    description: article.description,
    url: canonical,
    type: 'article',
    images: [cover],
  },
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
        image: new URL(cover.url, canonical).href,
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
      <article aria-labelledby="checking-title">
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Link href="/savings/">Savings</Link>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <h1 id="checking-title">{article.title}</h1>
                <nav className={styles.jumps} aria-label="On this page">
                  <a href="#compare">Compare <ArrowDown size={15} aria-hidden="true" /></a>
                  <a href="#how-to-choose">How to choose</a>
                  <a href="#faq">FAQs</a>
                </nav>
              </div>
              <Image className={styles.coverImage} src={cover.url} width={cover.width} height={cover.height} alt={cover.alt} priority />
            </div>
          </div>
        </header>
        <div className={styles.article}>
          <Body />
        </div>
      </article>
    </>
  );
}
