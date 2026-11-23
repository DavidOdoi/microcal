import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCategory, type Calculator } from '@/lib/site-data';
import { calculatorPath } from '@/lib/calculator-path';

export function CalculatorCard({ calc }: { calc: Calculator }) {
  const category = getCategory(calc.category);
  return (
    <Link href={calculatorPath(calc)} className="card-interactive block p-5">
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
