'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { CalculatorCard } from '@/components/site/CalculatorCard';
import { searchSite } from '@/lib/site-data';

export default function SearchResults({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const query = initialQuery.trim();
  const results = searchSite(query);
  const total = results.categories.length + results.calculators.length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : '/search');
  }

  return (
    <div className="container-site section-block">
      <h1 className="page-title">Search</h1>
      <form className="search-form" onSubmit={submit}>
        <Search size={20} aria-hidden="true" />
        <input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="Try ‘mortgage’ or ‘retirement’" aria-label="Search" />
        <button className="primary-button">Search</button>
      </form>
      {query && <p className="search-count">{total} result{total === 1 ? '' : 's'} for “{query}”</p>}
      {results.categories.length > 0 && <section className="search-section"><h2>Topics</h2><div className="category-list">{results.categories.map((category) => <Link key={category.slug} href={`/${category.slug}`} className="search-item"><category.icon size={17} />{category.name}</Link>)}</div></section>}
      {results.calculators.length > 0 && <section className="search-section"><h2>Calculators</h2><div className="card-grid">{results.calculators.map((calc) => <CalculatorCard key={calc.slug} calc={calc} />)}</div></section>}
      {query && total === 0 && <p className="search-empty">Nothing found. <Link href="/calculators">Browse all calculators</Link>.</p>}
    </div>
  );
}
