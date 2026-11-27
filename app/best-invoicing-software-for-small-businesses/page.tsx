import type { Metadata } from 'next';
import { ComparisonArticlePage } from '@/components/articles/ComparisonArticlePage';
import { invoicingSoftwareContents } from '@/components/articles/InvoicingSoftwareComparison';
import { categoryArticlePath, invoicingSoftwareArticle } from '@/lib/category-articles';

const article = invoicingSoftwareArticle;
const path = categoryArticlePath(article);
const canonical = `https://microfinancepost.com${path}`;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical },
  openGraph: { title: article.title, description: article.description, url: canonical, type: 'article' },
};

export default function BestInvoicingSoftwarePage() {
  const { Body, title, description, category } = article;
  return (
    <ComparisonArticlePage title={title} description={description} path={path} category={{ name: 'Business', slug: category }} contents={invoicingSoftwareContents} layout="roundup">
      <Body />
    </ComparisonArticlePage>
  );
}
