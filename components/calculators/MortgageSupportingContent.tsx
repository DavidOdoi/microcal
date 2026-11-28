import Link from 'next/link';
import Markdown from 'react-markdown';
import content from '@/content/mortgage-pillar.json';
import { calculatorPath } from '@/lib/calculator-path';
import { getCalculator } from '@/lib/site-data';

import { stateMortgageGuides } from '@/lib/state-mortgage-guides';

function StateMortgageDirectory() {
  const links = stateMortgageGuides.flatMap(({ slug, state }) => {
    const calculator = getCalculator(slug);
    return calculator?.status === 'live' && calculator.category === 'mortgages'
      ? [{ href: calculatorPath(calculator), state }] : [];
  });
  if (!links.length) return null;
  return <nav aria-label="State mortgage calculators"><ul className="mortgage-state-directory">{links.map(({ href, state }) => (
    <li key={href}><Link href={href}>{state} Mortgage Calculator</Link></li>
  ))}</ul></nav>;
}

export type MortgageGuideContent = {
  intro: string[];
  sections: { heading: string; blocks: ({ markdown: string } | { columns: string[]; rows: string[][] })[] }[];
};

export function MortgageGuideArticle({ guide }: { guide: MortgageGuideContent }) {
  return <>{guide.sections.map(({ heading, blocks }) => (
    <section key={heading} className="finance-article-section">
      <h2>{heading}</h2>
      {blocks.map((block, index) => 'markdown' in block ? (
        <Markdown key={index} skipHtml>{block.markdown}</Markdown>
      ) : (
        <div key={index} className="finance-table-wrap"><table>
          <caption>{heading}</caption>
          <thead><tr>{block.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{block.rows.map(([label, ...values]) => (
            <tr key={label}><th scope="row">{label}</th>{values.map((value, column) => <td key={column}>{value}</td>)}</tr>
          ))}</tbody>
        </table></div>
      ))}
      {heading === 'Mortgage Calculators by State' && <StateMortgageDirectory />}
    </section>
  ))}</>;
}

export function MortgageSupportingContent() {
  return <MortgageGuideArticle guide={content} />;
}
