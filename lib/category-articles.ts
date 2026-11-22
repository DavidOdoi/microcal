import type { ComponentType } from 'react';

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
  Body: ComponentType;
}

// Register complete articles with an existing category slug and a slug distinct from calculator slugs.
export const categoryArticles: CategoryArticle[] = [];

export function categoryArticlePath({ category, slug }: CategoryArticle) {
  return `/${category}/${slug}/`;
}
