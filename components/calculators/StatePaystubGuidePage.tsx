import Link from 'next/link';
import Markdown from 'react-markdown';
import { paycheckGuideDescription, type PaycheckGuide } from '@/lib/paycheck-guides';
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
        article={<StatePaystubGuideArticle content={content} />}
      />;
    },
  };
}

export function StatePaystubGuideArticle({ content }: { content: GuideContent }) {
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
    <p><Link href="/calculators/paycheck-calculator/">US Paycheck Calculator and state directory</Link></p>
  </>;
}
