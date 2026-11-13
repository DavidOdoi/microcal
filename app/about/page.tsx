import { PageHero } from '@/components/site/PageHero';

const principles = [
  ['Our mission', 'We build free tools that help people understand loans, savings, investing, taxes and more, without jargon or sales pressure.'],
  ['How we build calculators', 'Each tool uses standard, published financial formulas. We document our assumptions alongside every result and review tools when rates or tax rules change.'],
  ['Editorial independence', 'Our tools are never influenced by lenders or advertisers. Results are estimates for educational purposes, not financial advice.'],
];

export const metadata = {
  title: 'About & Methodology — MicroFinancePost',
  description: 'How MicroFinancePost builds free, transparent and unbiased personal finance tools.',
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Clear numbers for confident decisions.">
        MicroFinancePost exists to make the math behind everyday money decisions simple and honest.
      </PageHero>
      <div className="container-site section-block narrow-content about-principles">
        {principles.map(([title, description]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </section>
        ))}
      </div>
    </>
  );
}
