import Markdown from 'react-markdown';
import { ComparisonArticlePage } from './ComparisonArticlePage';
import { ComparisonTable, type ComparisonTableRow } from './ComparisonTable';
import { ReviewDisclosure, ReviewTradeoffs, RoundupReviewHeader, RoundupTopPicks, type ReviewPhoto } from './RoundupReviews';
import styles from './ComparisonArticle.module.css';
import reviewStyles from './RoundupReviews.module.css';

export type RoundupArticleContent = {
  title: string;
  description: string;
  path: `/${string}/`;
  category: { name: string; slug: string };
  intro: string;
  editorialNote: string;
  picks: {
    id: string;
    name: string;
    shortName: string;
    distinction: string;
    product: string;
    image?: { src: string; width: number; height: number };
    photo?: ReviewPhoto;
    summary: string;
    pros: string[];
    cons: string[];
    overview: string;
    bottomLine: string;
    why: string;
    audience: string;
    facts: { label: string; value: string }[];
  }[];
  comparison: { title: string; rowHeader: string; columns: string[] };
  sections: {
    id: string;
    title: string;
    body: string;
    table?: { rowHeader: string; columns: string[]; rows: ComparisonTableRow[] };
    afterTable?: string;
  }[];
};

export function RoundupArticle({ article }: { article: RoundupArticleContent }) {
  const { title, description, path, category, picks, comparison, sections } = article;
  const contents = [
    { id: 'top-picks', label: 'Top picks' },
    { id: 'detailed-reviews', label: 'Detailed reviews' },
    ...picks.map(({ id, name }) => ({ id, label: name })),
    { id: 'compare', label: 'Compare the picks' },
    ...sections.map(({ id, title }) => ({ id, label: title })),
  ];
  return (
    <ComparisonArticlePage title={title} description={description} path={path} category={category} contents={contents} layout="roundup">
      <div className={styles.introduction}><Markdown skipHtml>{article.intro}</Markdown></div>
      <RoundupTopPicks
        compareLabel={`Compare all ${picks.length}`}
        picks={picks.map(pick => ({ ...pick, offer: pick.summary }))}
        compact
      />
      <header className={reviewStyles.reviewsHeading}>
        <h2 id="detailed-reviews">A closer look at our picks</h2>
        <div className={reviewStyles.editorialNote}><Markdown skipHtml>{article.editorialNote}</Markdown></div>
      </header>
      {picks.map((pick, index) => (
        <section key={pick.id} className={reviewStyles.review} aria-labelledby={pick.id}>
          <RoundupReviewHeader pick={pick} rank={index + 1} feature={{ photo: pick.photo }}>
            <div className={reviewStyles.reviewSummary}><Markdown skipHtml>{pick.overview}</Markdown></div>
          </RoundupReviewHeader>
          <ReviewDisclosure label="Pros & cons" open><ReviewTradeoffs pros={pick.pros} cons={pick.cons} /></ReviewDisclosure>
          <div className={reviewStyles.reviewIntro}><Markdown skipHtml>{`**Bottom line.** ${pick.bottomLine}`}</Markdown></div>
          <ReviewDisclosure label="Why we picked it"><Markdown skipHtml>{pick.why}</Markdown></ReviewDisclosure>
          <ReviewDisclosure label="Who it’s for"><Markdown skipHtml>{pick.audience}</Markdown></ReviewDisclosure>
          <ReviewDisclosure label="Key account features">
            <dl className={reviewStyles.reviewFacts}>
              {pick.facts.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </ReviewDisclosure>
          <footer className={reviewStyles.actions}>
            <a className={styles.productLink} href={pick.product}>Visit {pick.shortName}</a>
          </footer>
        </section>
      ))}
      <section className={styles.comparison} aria-labelledby="compare">
        <h2 id="compare">{comparison.title}</h2>
        <ComparisonTable
          headingId="compare"
          caption={comparison.title}
          rowHeader={comparison.rowHeader}
          columns={['Best for', ...comparison.columns]}
          rows={picks.map(pick => ({
            name: pick.shortName,
            href: `#${pick.id}`,
            values: [pick.distinction, ...comparison.columns.map(column => pick.facts.find(fact => fact.label === column)?.value ?? '—')],
          }))}
        />
      </section>
      {sections.map(({ id, title, body, table, afterTable }) => (
        <section key={id} aria-labelledby={id}>
          <h2 id={id}>{title}</h2>
          <Markdown skipHtml>{body}</Markdown>
          {table && <ComparisonTable headingId={id} caption={title} {...table} />}
          {afterTable && <Markdown skipHtml>{afterTable}</Markdown>}
        </section>
      ))}
    </ComparisonArticlePage>
  );
}
