'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { calculators, categories } from '@/lib/site-data';
import { CalculatorCard } from '@/components/site/CalculatorCard';
import { PageHero } from '@/components/site/PageHero';

export default function CalculatorsDirectoryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const list = useMemo(() => calculators.filter((calc) =>
    (category === 'all' || calc.category === category) && calc.name.toLowerCase().includes(query.toLowerCase().trim())
  ), [category, query]);

  return (
    <>
      <PageHero eyebrow="Calculator directory" title="Every tool you need, organized.">
        Filter by topic or search by name. New calculators are added regularly.
      </PageHero>
      <div className="container-site directory-page">
        <div className="directory-filters">
          <label className="directory-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter calculators" aria-label="Filter calculators" /></label>
          <div className="filter-chips" aria-label="Filter by category">
            {[{ slug: 'all', name: 'All' }, ...categories].map((item) => (
              <button key={item.slug} type="button" aria-pressed={category === item.slug} className={category === item.slug ? 'filter-chip active' : 'filter-chip'} onClick={() => setCategory(item.slug)}>{item.name}</button>
            ))}
          </div>
        </div>
        {list.length ? <div className="card-grid">{list.map((calc) => <CalculatorCard key={calc.slug} calc={calc} />)}</div> : <p className="directory-empty">No calculators match “{query}”.</p>}
      </div>
    </>
  );
}
