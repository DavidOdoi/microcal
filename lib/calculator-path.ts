import { batchFourPages } from './batch-four-pages';
import { batchTwoPages } from './batch-two-pages';
import { financialPages } from './financial-pages';
import type { Calculator } from './site-data';

export function calculatorPath({ slug, category }: Pick<Calculator, 'slug' | 'category'>) {
  const hasCategoryCanonical = [financialPages, batchTwoPages, batchFourPages].some((pages) => Object.hasOwn(pages, slug));
  return `/${hasCategoryCanonical ? category : 'calculators'}/${slug}/`;
}
