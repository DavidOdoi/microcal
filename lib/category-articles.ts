import type { ComponentType } from 'react';
import { CheckingAccountComparison } from '@/components/articles/CheckingAccountComparison';

export const articleLabels = {
  guide: 'Guide',
  best: 'Best picks',
  vs: 'Comparison',
};

interface CategoryArticle {
  category: string;
  slug: string;
  kind: keyof typeof articleLabels;
  title: string;
  description: string;
  permalink?: `/${string}/`;
  Body: ComponentType;
}

export const checkingAccountsArticle: CategoryArticle = {
  category: 'savings',
  slug: 'best-banks-for-checking-accounts',
  permalink: '/best-banks-for-checking-accounts/',
  kind: 'best',
  title: '5 Best Banks for Checking Accounts in 2026',
  description: 'Discover the best banks for checking accounts in 2026. Compare SoFi, Capital One, Ally, Chase, and Wells Fargo for fees, APYs, and ATM access.',
  Body: CheckingAccountComparison,
};

// Register complete articles with an existing category slug and a slug distinct from calculator slugs.
export const categoryArticles: CategoryArticle[] = [checkingAccountsArticle];

export function categoryArticlePath({ category, slug, permalink }: CategoryArticle) {
  return permalink ?? `/${category}/${slug}/`;
}
