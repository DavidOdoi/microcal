import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RoundupArticle, type RoundupArticleContent } from '@/components/articles/RoundupArticle';
import draft from '@/content/drafts/california-credit-unions.json';

const article: RoundupArticleContent = { ...draft, path: '/best-credit-unions-in-california/' };

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  robots: { index: false, follow: false },
};

export default function CaliforniaCreditUnionsDraft() {
  if (process.env.NODE_ENV !== 'development') notFound();
  return <RoundupArticle article={article} />;
}
