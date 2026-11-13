import type { MetadataRoute } from 'next';
import { categories, calculators } from '@/lib/site-data';
import { financialPages } from '@/lib/financial-pages';
import { batchTwoPages } from '@/lib/batch-two-pages';
import { batchFourPages } from '@/lib/batch-four-pages';

export default function sitemap(): MetadataRoute.Sitemap {
  const root = 'https://microfinancepost.com';
  return [
    { url: `${root}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${root}/about/`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${root}/contact/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${root}/calculators/`, changeFrequency: 'monthly', priority: 0.8 },
    ...categories.map((category) => ({ url: `${root}/${category.slug}/`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...calculators.filter((calculator) => calculator.status === 'live').map((calculator) => ({
      url: `${root}/${calculator.slug in financialPages || calculator.slug in batchTwoPages || calculator.slug in batchFourPages ? `${calculator.category}/${calculator.slug}` : `calculators/${calculator.slug}`}/`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
