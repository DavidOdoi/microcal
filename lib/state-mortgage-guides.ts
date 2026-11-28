import guides from '@/content/state-mortgage-guides.json';

export const stateMortgageGuides = guides;

export function getStateMortgageGuide(slug: string) {
  return stateMortgageGuides.find(guide => guide.slug === slug);
}
