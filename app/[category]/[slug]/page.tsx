import { getCustomCalculatorPage } from '@/components/calculators/custom-calculator-pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCalculator } from '@/lib/site-data';
import { financialPages, type FinancialPageSlug } from '@/lib/financial-pages';
import { FinancialCalculatorPage } from '@/components/calculators/FinancialCalculatorPage';
import { batchTwoPages, type BatchTwoSlug } from '@/lib/batch-two-pages';
import { BatchTwoCalculatorPage } from '@/components/calculators/BatchTwoCalculatorPage';
import { batchFourPages, type BatchFourSlug } from '@/lib/batch-four-pages';
import { BatchFourCalculatorPage } from '@/components/calculators/BatchFourCalculatorPage';

type RouteParams = { category: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { category, slug } = await params;
  const customPage = getCustomCalculatorPage(slug);
  if (customPage) {
    if (category !== customPage.category) notFound();
    return customPage.metadata;
  }
  if (slug in batchFourPages) {
    const page = batchFourPages[slug as BatchFourSlug];
    if (page.category !== category) return { title: 'Calculator not found — MicroFinancePost', robots: { index: false } };
    const canonical = `https://microfinancepost.com/${category}/${slug}/`;
    return { title: page.title, description: page.description, alternates: { canonical }, openGraph: { title: page.title, description: page.description, url: canonical, type: 'website' } };
  }
  if (slug in batchTwoPages) {
    const page = batchTwoPages[slug as BatchTwoSlug];
    if (page.category !== category) return { title: 'Calculator not found — MicroFinancePost', robots: { index: false } };
    const canonical = `https://microfinancepost.com/${category}/${slug}/`;
    return { title: page.title, description: page.description, alternates: { canonical }, openGraph: { title: page.title, description: page.description, url: canonical, type: 'website' } };
  }
  const calc = getCalculator(slug);
  if (!calc || calc.category !== category || !(slug in financialPages)) {
    return { title: 'Calculator not found — MicroFinancePost', robots: { index: false } };
  }
  const page = financialPages[slug as FinancialPageSlug];
  const canonical = `https://microfinancepost.com/${category}/${slug}/`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: { title: page.title, description: page.description, url: canonical, type: 'website' },
  };
}

export default async function CategoryCalculatorPage({ params }: { params: Promise<RouteParams> }) {
  const { category, slug } = await params;
  const customPage = getCustomCalculatorPage(slug);
  if (customPage) {
    if (category !== customPage.category) notFound();
    const Page = customPage.Component;
    return <Page />;
  }
  if (slug in batchFourPages) {
    if (batchFourPages[slug as BatchFourSlug].category !== category) notFound();
    return <BatchFourCalculatorPage slug={slug as BatchFourSlug} />;
  }
  if (slug in batchTwoPages) {
    if (batchTwoPages[slug as BatchTwoSlug].category !== category) notFound();
    return <BatchTwoCalculatorPage slug={slug as BatchTwoSlug} />;
  }
  const calc = getCalculator(slug);
  if (!calc || calc.category !== category || !(slug in financialPages)) notFound();
  return <FinancialCalculatorPage slug={slug as FinancialPageSlug} />;
}
