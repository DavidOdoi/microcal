import Link from 'next/link';
import { getStateMortgageGuide } from '@/lib/state-mortgage-guides';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { MortgageCalculator } from './MortgageCalculator';
import { MortgageGuideArticle, type MortgageGuideContent } from './MortgageSupportingContent';

export function getStateMortgageCalculatorPage(slug: string) {
  const guide = getStateMortgageGuide(slug);
  if (!guide) return null;
  const { state, title, description, initialValues } = guide;
  const paycheckPath = `/calculators/${slug.replace('-mortgage-calculator', '-paycheck-calculator')}/`;
  const metadata = calculatorArticleMetadata(slug, title, description);
  return {
    category: 'mortgages',
    metadata,
    Component: async function StateMortgageCalculatorPage() {
      const { default: content } = await import(`@/content/mortgages/${slug}.json`) as { default: MortgageGuideContent };
      const hasPaycheckLink = content.sections.some(section => section.blocks.some(block =>
        'markdown' in block && block.markdown.includes(`](${paycheckPath})`),
      ));
      return <CalculatorArticlePage
        slug={slug}
        name={`${state} Mortgage Calculator`}
        category="mortgages"
        categoryName="Mortgages"
        intro={content.intro}
        description={description}
        pageDetails={{ dateModified: '2026-11-28', publisher: 'MicroFinancePost' }}
        calculator={<MortgageCalculator id={slug} initialValues={initialValues} />}
        article={<>
          <MortgageGuideArticle guide={content} />
          <section className="finance-article-section">
            <h2>Compare Your Housing Budget</h2>
            <p>Use the <Link href="/calculators/mortgage-calculator/">US Mortgage Calculator and state directory</Link> to compare locations.</p>
            {!hasPaycheckLink && <p>Check the proposed payment against your net income with the <Link href={paycheckPath}>{state} Paycheck Calculator</Link>.</p>}
            <p>Starting values are illustrative. Confirm the property’s tax bill, insurance quote, and any assistance eligibility with the relevant source before relying on an estimate.</p>
          </section>
        </>}
      />;
    },
  };
}
