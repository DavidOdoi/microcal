import data from '@/content/california-credit-unions.json';
import { RoundupArticle, type RoundupArticleContent } from './RoundupArticle';

export const californiaCreditUnionsContent = {
  ...data,
  path: '/best-credit-unions-in-california/',
} satisfies RoundupArticleContent;

export function CaliforniaCreditUnions() {
  return <RoundupArticle article={californiaCreditUnionsContent} />;
}
