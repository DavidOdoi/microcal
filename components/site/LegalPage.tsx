import type { ReactNode } from 'react';
import { PageHero } from './PageHero';

type LegalSection = { id: string; title: string; content: ReactNode };

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return <>
    <PageHero eyebrow="Website policies" title={title}>{intro}</PageHero>
    <article className="container-site section-block narrow-content legal-content" aria-label={title}>
      <p><strong>Effective date:</strong> <time dateTime="2026-11-16">November 16, 2026</time><br /><strong>Last updated:</strong> <time dateTime="2026-11-16">November 16, 2026</time></p>
      <nav aria-label={`${title} contents`} className="legal-contents">
        <h2>On this page</h2>
        <ul>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul>
      </nav>
      {sections.map(section => <section key={section.id} id={section.id}><h2>{section.title}</h2>{section.content}</section>)}
    </article>
  </>;
}
