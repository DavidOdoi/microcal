import type { Metadata } from 'next';
import { californiaCreditUnionsArticle, categoryArticlePath } from '@/lib/category-articles';

const article = californiaCreditUnionsArticle;
const canonical = `https://microfinancepost.com${categoryArticlePath(article)}`;

export const metadata: Metadata = {
  title: article.title,
  description: article.description,
  alternates: { canonical },
  openGraph: { title: article.title, description: article.description, url: canonical, type: 'article' },
};

export default function BestCaliforniaCreditUnionsPage() {
  const { Body } = article;
  return <Body />;
}
