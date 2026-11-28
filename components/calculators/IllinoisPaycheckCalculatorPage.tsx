import Link from 'next/link';
import Markdown from 'react-markdown';
import content from '@/content/illinois-paycheck.json';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { NationalPaycheckCalculator } from './NationalPaycheckCalculator';

const slug = 'illinois-paycheck-calculator';
const description = 'Estimate 2026 Illinois take-home pay using federal and Illinois withholding from your paystub, plus estimates for Social Security and Medicare.';
export const illinoisPaycheckMetadata = calculatorArticleMetadata(slug, content.title, description);

export function IllinoisPaycheckCalculatorPage() {
  return <CalculatorArticlePage
    slug={slug}
    name={content.heading}
    category="taxes"
    categoryName="Taxes"
    description={description}
    intro="Use your paystub to estimate your Illinois take-home pay for 2026. Enter federal and Illinois income tax withholding. The calculator estimates Social Security and Medicare from the wages you provide."
    calculator={<NationalPaycheckCalculator paystubState={{ name: 'Illinois' }} />}
    article={<>
      {content.parts.map((part, index) => part.markdown !== undefined ? (
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
    </>}
  />;
}
