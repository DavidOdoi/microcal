import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './ComparisonArticle.module.css';

const site = 'https://microfinancepost.com';

export function ComparisonArticlePage({ title, description, path, category, contents, children }: {
  title: string;
  description: string;
  path: string;
  category: { name: string; slug: string };
  contents: readonly { id: string; label: string }[];
  children: ReactNode;
}) {
  const canonical = `${site}${path}`;
  const categoryPath = `/${category.slug}/`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        mainEntityOfPage: canonical,
        publisher: { '@type': 'Organization', name: 'MicroFinancePost', url: `${site}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: category.name, item: `${site}${categoryPath}` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <article aria-labelledby="comparison-title">
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={14} aria-hidden="true" />
              <Link href={categoryPath}>{category.name}</Link>
            </nav>
            <h1 id="comparison-title">{title}</h1>
          </div>
        </header>
        <div className={styles.article}>
          <nav className={styles.contents} aria-labelledby="contents-title">
            <h2 id="contents-title">Table of contents</h2>
            <ul className={styles.contentsList}>
              {contents.map(({ id, label }) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ul>
          </nav>
          {children}
        </div>
      </article>
    </>
  );
}
