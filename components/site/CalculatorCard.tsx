import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategory, type Calculator } from '@/lib/site-data';
import { batchFourPages } from '@/lib/batch-four-pages';

export function CalculatorCard({ calc }: { calc: Calculator }) {
  const category = getCategory(calc.category);
  const categoryRouteSlugs = ['debt-to-income-ratio-calculator', 'emergency-fund-calculator', 'cd-interest-calculator', 'high-yield-savings-account-calculator', 'auto-loan-payoff-calculator', 'loan-interest-calculator'];
  const href = categoryRouteSlugs.includes(calc.slug) || calc.slug in batchFourPages ? `/${calc.category}/${calc.slug}/` : `/calculators/${calc.slug}`;

  return (
    <Link href={href} className="card-interactive block p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
          {category?.name ?? 'Calculator'}
        </span>
        <span className="text-xs text-muted-foreground">{calc.status === 'live' ? 'Live' : 'Coming soon'}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-foreground">{calc.name}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{calc.description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Open tool <ArrowRight size={16} />
      </div>
    </Link>
  );
}
