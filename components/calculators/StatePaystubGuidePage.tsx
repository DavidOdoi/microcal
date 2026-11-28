import Link from 'next/link';
import Markdown from 'react-markdown';
import { paycheckGuideDescription, paycheckGuides, type PaycheckGuide } from '@/lib/paycheck-guides';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { NationalPaycheckCalculator } from './NationalPaycheckCalculator';

type GuideContent = {
  title: string;
  metaDescription?: string;
  heading: string;
  parts: ({ markdown: string } | { caption: string; columns: string[]; rows: string[][] })[];
};

export function createStatePaystubGuidePage(guide: PaycheckGuide, content: GuideContent) {
  const description = paycheckGuideDescription(guide);
  return {
    category: 'taxes',
    metadata: calculatorArticleMetadata(guide.slug, content.title, content.metaDescription ?? description),
    Component: function StatePaystubGuidePage() {
      return <CalculatorArticlePage
        slug={guide.slug}
        name={content.heading}
        category="taxes"
        categoryName="Taxes"
        description={description}
        intro={description}
        calculator={<NationalPaycheckCalculator paystubState={{ name: guide.state, localTax: guide.localTax, noStateIncomeTax: guide.noStateIncomeTax, combinedStateAndLocal: guide.combinedStateAndLocal }} />}
        article={<StatePaystubGuideArticle content={content} guide={guide} />}
      />;
    },
  };
}

export function StatePaystubGuideArticle({ content, guide }: { content: GuideContent; guide?: PaycheckGuide }) {
  const nearby = guide ? paycheckGuides.filter(other =>
    guide.relatedStates?.includes(other.slug) || other.relatedStates?.includes(guide.slug),
  ).sort((first, second) => first.state.localeCompare(second.state)) : [];

  return <>
    {content.parts.map((part, index) => 'markdown' in part ? (
      <Markdown key={index} skipHtml>{part.markdown}</Markdown>
    ) : (
      <div key={index} className="finance-table-wrap">
        <table>
          <caption>{part.caption}</caption>
          <thead><tr>{part.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{part.rows.map(([label, ...values]) => (
            <tr key={label}><th scope="row">{label}</th>{values.map((value, cell) => <td key={cell}>{value}</td>)}</tr>
          ))}</tbody>
        </table>
      </div>
    ))}
    {nearby.length > 0 && <nav className="finance-article-section" aria-label="Neighboring state paycheck calculators">
      <h2>Compare Paychecks in Nearby States</h2>
      <ul>{nearby.map(other => <li key={other.slug}>
        <Link href={`/calculators/${other.slug}/`}>{other.state} Paycheck Calculator</Link>
      </li>)}</ul>
    </nav>}
    <p><Link href="/calculators/paycheck-calculator/">US Paycheck Calculator and state directory</Link></p>
  </>;
}
