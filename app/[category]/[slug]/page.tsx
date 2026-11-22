import { getCustomCalculatorPage } from '@/components/calculators/custom-calculator-pages';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { articleLabels, categoryArticlePath, categoryArticles } from '@/lib/category-articles';
import { getCalculator, getCategory } from '@/lib/site-data';
import { PageHero } from '@/components/site/PageHero';
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
    const article = categoryArticles.find((item) => item.category === category && item.slug === slug);
    if (!article || !getCategory(category)) return { title: 'Page not found — MicroFinancePost', robots: { index: false } };
    const { title, description } = article;
    const canonical = `https://microfinancepost.com${categoryArticlePath(article)}`;
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'article' } };
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

export default async function CategoryContentPage({ params }: { params: Promise<RouteParams> }) {
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
  if (calc?.category === category && slug in financialPages) {
    return <FinancialCalculatorPage slug={slug as FinancialPageSlug} />;
  }

  const article = categoryArticles.find((item) => item.category === category && item.slug === slug);
  const found = getCategory(category);
  if (!article || !found) notFound();
  const { Body } = article;

  return (
    <>
      <PageHero eyebrow={articleLabels[article.kind]} title={article.title} crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={16} />
          <Link href={`/${found.slug}/`}>{found.name}</Link>
        </nav>
      }>
        {article.description}
      </PageHero>
      <article className="container-site section-block narrow-content">
        <Body />
      </article>
    </>
  );
}
