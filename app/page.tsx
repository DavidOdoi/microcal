'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, BadgeCheck, Lock, Search, Sparkles } from 'lucide-react';
import { calculators, categories } from '@/lib/site-data';
import { CalculatorCard } from '@/components/site/CalculatorCard';

const popular = ['Mortgage', '401(k)', 'Paycheck', 'Credit card payoff', 'Compound interest'];

export default function HomePage() {
  return (
    <>
      <section className="hero-shell">
        <div className="container-site hero-grid">
          <div className="hero-copy">
            <h1>Run the numbers on your money.</h1>
            <p>
              Free calculators for loans, mortgages, savings, retirement, taxes and more — simple, transparent and private.
            </p>
            <HomeSearch />
            <div className="popular-tags">
              {popular.map((tag) => (
                <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="chip">
                  {tag}
                </Link>
              ))}
            </div>
            <div className="hero-trust"><span className="trust-dots"><i /><i /><i /></span><span>Built for US households. No sign-up, nothing stored.</span></div>
          </div>

          <div className="hero-panel" aria-label="Sample summary">
            <div className="mini-card top-card">
              <span className="eyebrow">Monthly budget left</span>
              <strong>$1,946<small>.10</small></strong>
              <em>+$315 vs. last month</em>
            </div>
            <div className="dashboard-pills"><span>+ Add goal</span><span>↗ Compare</span></div>
            <div className="dashboard-stats"><div><span>Savings rate</span><strong>18%</strong></div><div><span>Debt-free in</span><strong>3.2 yrs</strong></div></div>
            <div className="dashboard-heading"><strong>Upcoming</strong><span>See all</span></div>
            <div className="mini-stack">
              <div className="mini-row">
                <i /><span>Mortgage<small>Apr 02</small></span><b>$2,184</b>
              </div>
              <div className="mini-row">
                <i /><span>Auto loan<small>Apr 05</small></span><b>$412</b>
              </div>
              <div className="mini-row">
                <i /><span>401(k)<small>Apr 15</small></span><b className="lime-text">+$650</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-band">
        <div className="container-site stat-grid">
          {[
            ['9', 'Money topics covered'],
            [`${calculators.length}+`, 'Calculators planned'],
            ['100%', 'Free, always'],
            ['0', 'Data stored'],
          ].map(([value, label]) => (
            <div key={label} className="stat-item">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="container-site">
          <div className="section-heading">
            <span>Explore by topic</span>
            <h2>Every money decision, one place.</h2>
          </div>

          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.slug} href={`/${category.slug}`} className="card-interactive category-card">
                <div className="category-header">
                  <span className="category-icon">
                    <category.icon size={20} />
                  </span>
                  <span>{category.name}</span>
                  <ArrowRight size={16} />
                </div>
                <p>{category.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block muted-block">
        <div className="container-site">
          <div className="section-heading split-header">
            <div>
              <span>Most requested</span>
              <h2>Calculators on the way</h2>
            </div>
            <Link href="/calculators" className="text-link">
              Browse the full directory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="card-grid">
            {['mortgage-calculator', '401k-calculator', 'paycheck-calculator', 'credit-card-payoff-calculator'].map((slug) => {
              const calc = calculators.find((item) => item.slug === slug)!;
              return <CalculatorCard key={slug} calc={calc} />;
            })}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="container-site">
          <div className="section-heading">
            <span>Why MicroFinancePost</span>
            <h2>Built on trust, not on sales.</h2>
          </div>

          <div className="feature-grid">
            {[
              [BadgeCheck, 'Transparent math', 'Every calculator shows its formulas and assumptions, so you know exactly where numbers come from.'],
              [Lock, 'Private by design', 'Calculations run on your device. Nothing you enter is stored or sold.'],
              [Sparkles, 'Plain-English guidance', 'Clear explanations next to every result help you act with confidence.'],
            ].map(([Icon, title, text]) => {
              const IconComponent = Icon as typeof BadgeCheck;
              return (
                <div key={title as string} className="feature-card">
                  <IconComponent size={24} />
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <form
      className="search-launch"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
      }}
    >
      <Search size={18} />
      <input
        aria-label="Search calculators"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What do you want to calculate?"
      />
      <button type="submit">Search</button>
    </form>
  );
}
