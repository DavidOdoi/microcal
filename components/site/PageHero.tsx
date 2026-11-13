import type { ReactNode } from 'react';

export function PageHero({
  eyebrow,
  title,
  children,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  crumbs?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container-site py-12 md:py-16">
        {crumbs}
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          {eyebrow}
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-ink-foreground md:text-6xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-foreground/80">{children}</p>
      </div>
    </section>
  );
}
