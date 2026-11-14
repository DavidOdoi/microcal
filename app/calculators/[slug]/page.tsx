import { getCustomCalculatorPage } from '@/components/calculators/custom-calculator-pages';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MortgageSupportingContent } from '@/components/calculators/MortgageSupportingContent';
import { CalculatorRenderer } from '@/components/calculators/CalculatorRenderer';
import { CalculatorCard } from '@/components/site/CalculatorCard';
import { CalculatorTemplate } from '@/components/site/CalculatorTemplate';
import { PageHero } from '@/components/site/PageHero';
import { calculatorsIn, getCalculator, getCategory } from '@/lib/site-data';
import type { Metadata } from 'next';
import { financialPages, type FinancialPageSlug } from '@/lib/financial-pages';
import { FinancialCalculatorPage } from '@/components/calculators/FinancialCalculatorPage';
import { remainingPages } from '@/lib/remaining-pages';
import type { RemainingSlug } from '@/lib/remaining-calculations';
import { RemainingCalculatorPage } from '@/components/calculators/RemainingCalculatorPage';
import { batchTwoPages, type BatchTwoSlug } from '@/lib/batch-two-pages';
import { BatchTwoCalculatorPage } from '@/components/calculators/BatchTwoCalculatorPage';
import { batchFourPages, type BatchFourSlug } from '@/lib/batch-four-pages';
import { BatchFourCalculatorPage } from '@/components/calculators/BatchFourCalculatorPage';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customPage = getCustomCalculatorPage(slug);
  if (customPage) return customPage.metadata;
  const categoryPage = batchFourPages[slug as BatchFourSlug] ?? batchTwoPages[slug as BatchTwoSlug];
  if (categoryPage) {
    const canonical = `https://microfinancepost.com/${categoryPage.category}/${slug}/`;
    return { title: categoryPage.title, description: categoryPage.description, alternates: { canonical }, openGraph: { title: categoryPage.title, description: categoryPage.description, url: canonical, type: 'website' } };
  }
  if (slug in remainingPages) {
    const page = remainingPages[slug as RemainingSlug];
    const canonical = `https://microfinancepost.com/calculators/${slug}/`;
    return { title: page.title, description: page.description, alternates: { canonical }, openGraph: { title: page.title, description: page.description, url: canonical, type: 'website' } };
  }
  if (slug in financialPages) {
    const page = financialPages[slug as FinancialPageSlug];
    const canonical = `https://microfinancepost.com/${page.category}/${slug}/`;
    return { title: page.title, description: page.description, alternates: { canonical }, openGraph: { title: page.title, description: page.description, url: canonical, type: 'website' } };
  }
  const calc = getCalculator(slug);
  if (!calc) return { title: 'Calculator not found — MicroFinancePost', robots: { index: false } };
  const title = `${calc.name} — MicroFinancePost`;
  return { title, description: calc.description, openGraph: { title, description: calc.description } };
}

export default async function CalculatorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const customPage = getCustomCalculatorPage(slug);
  if (customPage) { const Page = customPage.Component; return <Page />; }
  if (slug in batchFourPages) return <BatchFourCalculatorPage slug={slug as BatchFourSlug} />;
  if (slug in batchTwoPages) return <BatchTwoCalculatorPage slug={slug as BatchTwoSlug} />;
  if (slug in remainingPages) return <RemainingCalculatorPage slug={slug as RemainingSlug} />;
  if (slug in financialPages) return <FinancialCalculatorPage slug={slug as FinancialPageSlug} />;
  const calc = getCalculator(slug);

  if (!calc) {
    notFound();
  }

  const category = getCategory(calc.category)!;
  const related = calculatorsIn(category.slug).filter((item) => item.slug !== slug);

  return (
    <>
      <PageHero eyebrow={category.name} title={calc.name} crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={16} />
          <Link href={`/${category.slug}`}>{category.name}</Link>
          <ChevronRight size={16} />
          <span>{calc.name}</span>
        </nav>
      }>
        {calc.description}
      </PageHero>

      <CalculatorTemplate inputs={<CalculatorRenderer slug={slug} />} />
      {slug === 'mortgage-calculator' && <div className="container-site"><article className="finance-article"><MortgageSupportingContent /></article></div>}

      <section className="container-site section-block">
        <h2 className="section-title">More {category.name.toLowerCase()} tools</h2>
        <div className="card-grid">
          {related.slice(0, 3).map((item) => (
            <CalculatorCard key={item.slug} calc={item} />
          ))}
        </div>
      </section>
    </>
  );
}
