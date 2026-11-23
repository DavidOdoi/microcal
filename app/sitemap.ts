import type { MetadataRoute } from 'next';
import { categories, calculators } from '@/lib/site-data';
import { calculatorPath } from '@/lib/calculator-path';
import { categoryArticlePath, categoryArticles } from '@/lib/category-articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const root = 'https://microfinancepost.com';
  return [
    { url: `${root}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${root}/about/`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${root}/privacy-policy/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${root}/terms-of-service/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${root}/contact/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${root}/calculators/`, changeFrequency: 'monthly', priority: 0.8 },
    ...categories.map((category) => ({ url: `${root}/${category.slug}/`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...categoryArticles.map((article) => ({ url: `${root}${categoryArticlePath(article)}` })),
    ...calculators.filter((calculator) => calculator.status === 'live').map((calculator) => ({
      url: `${root}${calculatorPath(calculator)}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
