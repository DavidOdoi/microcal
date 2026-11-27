import type { Metadata } from 'next';
import { checkingAccountContents } from '@/components/articles/CheckingAccountComparison';
import { ComparisonArticlePage } from '@/components/articles/ComparisonArticlePage';
import { categoryArticlePath, checkingAccountsArticle } from '@/lib/category-articles';

const article = checkingAccountsArticle;
const path = categoryArticlePath(article);
const canonical = `https://microfinancepost.com${path}`;

export const metadata: Metadata = {
  title: '5 Best Banks for Checking Accounts in 2026 (Fees & APYs Compared)',
  description: article.description,
  alternates: { canonical },
  openGraph: { title: article.title, description: article.description, url: canonical, type: 'article' },
};

export default function BestCheckingAccountsPage() {
  const { Body, title, description, category } = article;
  return (
    <ComparisonArticlePage title={title} description={description} path={path} category={{ name: 'Savings', slug: category }} contents={checkingAccountContents} layout="roundup">
      <Body />
    </ComparisonArticlePage>
  );
}
