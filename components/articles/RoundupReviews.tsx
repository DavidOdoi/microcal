import Image from 'next/image';
import { ArrowDown, ChevronDown, Minus, Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './ComparisonArticle.module.css';
import reviewStyles from './RoundupReviews.module.css';

type RoundupPick = {
  id: string;
  name: string;
  distinction: string;
  product: string;
  image?: { src: string; width: number; height: number };
  shortName?: string;
  pros: readonly string[];
  cons: readonly string[];
  offer: ReactNode;
};

function ProductMark({ image, shortName }: Pick<RoundupPick, 'image' | 'shortName'>) {
  return (
    <span className={reviewStyles.logo} aria-hidden="true">
      {image ? <Image {...image} alt="" /> : <span className={reviewStyles.wordmark}>{shortName}</span>}
    </span>
  );
}

export function ReviewDisclosure({ label, children, open }: { label: string; children: ReactNode; open?: boolean }) {
  return (
    <details className={reviewStyles.disclosure} open={open}>
      <summary>{label} <ChevronDown size={20} aria-hidden="true" /></summary>
      <div className={reviewStyles.disclosureBody}>{children}</div>
    </details>
  );
}

export function ReviewTradeoffs({ pros, cons }: Pick<RoundupPick, 'pros' | 'cons'>) {
  return (
    <div className={reviewStyles.tradeoffs}>
      <div>
        <p><strong>Pros</strong></p>
        <ul role="list">
          {pros.map(point => <li key={point}><Plus size={18} aria-hidden="true" /><span>{point}</span></li>)}
        </ul>
      </div>
      <div>
        <p><strong>Cons</strong></p>
        <ul role="list">
          {cons.map(point => <li key={point}><Minus size={18} aria-hidden="true" /><span>{point}</span></li>)}
        </ul>
      </div>
    </div>
  );
}

export function RoundupTopPicks({ picks, compareLabel }: { picks: readonly RoundupPick[]; compareLabel: string }) {
  return (
    <section aria-labelledby="top-picks" className={reviewStyles.picks}>
      <div className={reviewStyles.picksHeading}>
        <h2 id="top-picks">Our top picks</h2>
        <a href="#compare">{compareLabel} <ArrowDown size={16} aria-hidden="true" /></a>
      </div>
      <ul className={reviewStyles.picksList} role="list">
        {picks.map(({ id, name, distinction, product, image, shortName, pros, cons, offer }) => (
          <li key={id} className={reviewStyles.pick}>
            <div className={reviewStyles.pickRow}>
              <ProductMark image={image} shortName={shortName} />
              <div className={reviewStyles.pickInfo}>
                <p className={reviewStyles.distinction}>{distinction}</p>
                <h3><a href={`#${id}`}>{name}</a></h3>
              </div>
              <div className={reviewStyles.pickOffer}>
                <p className={reviewStyles.pickPrice}>{offer}</p>
                <a className={styles.productLink} href={product}>Visit site<span className={styles.srOnly}> for {name}</span></a>
              </div>
            </div>
            <ReviewDisclosure label="Pros & cons"><ReviewTradeoffs pros={pros} cons={cons} /></ReviewDisclosure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RoundupReviewHeader({ pick, rank, children }: {
  pick: Pick<RoundupPick, 'id' | 'name' | 'distinction' | 'image' | 'shortName'>;
  rank: number;
  children: ReactNode;
}) {
  const { id, name, distinction, image, shortName } = pick;
  return (
    <header className={reviewStyles.header}>
      <ProductMark image={image} shortName={shortName} />
      <div>
        <h2 id={id} className={reviewStyles.title}>
          <span>{rank}. {name}</span>
          <span className={styles.srOnly}>{' — '}</span>
          <span className={reviewStyles.distinction}>{distinction}</span>
        </h2>
        {children}
      </div>
    </header>
  );
}
