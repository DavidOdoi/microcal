import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { CalculatorCard } from '@/components/site/CalculatorCard';
import { PageHero } from '@/components/site/PageHero';
import { calculatorsIn, categories, getCategory } from '@/lib/site-data';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) return { title: 'Topic not found — MicroFinancePost', robots: { index: false } };
  const title = `${found.name} Calculators & Guides — MicroFinancePost`;
  return { title, description: found.description, openGraph: { title, description: found.description } };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const found = getCategory(category);

  if (!found) {
    notFound();
  }

  const items = calculatorsIn(category);

  return (
    <>
      <PageHero eyebrow={`${found.name} tools`} title={found.tagline} crumbs={
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={16} />
          <span>{found.name}</span>
        </nav>
      }>
        {found.description}
      </PageHero>

      <div className="container-site category-layout">
        <div>
          <h2 className="section-title">{found.name} calculators</h2>
          <div className="card-grid">
            {items.map((calc) => (
              <CalculatorCard key={calc.slug} calc={calc} />
            ))}
          </div>

          <h2 className="section-title extra-space">Key topics</h2>
          <div className="topics-grid">
            {found.topics.map((topic, index) => (
              <div key={topic} className="topic-box">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="side-column">
          <div className="side-card">
            <h3>Other topics</h3>
            <ul>
              {categories.filter((item) => item.slug !== category).map((item) => (
                <li key={item.slug}>
                  <Link href={`/${item.slug}`}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="side-highlight">
            <p>Looking for something specific?</p>
            <Link href="/calculators" className="primary-button">
              See all calculators
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
