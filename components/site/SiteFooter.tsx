import Link from 'next/link';
import { categories } from '@/lib/site-data';
import { Logo } from './Logo';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-site footer-grid">
        <div className="footer-brand">
          <Logo inverted />
          <p>Free, unbiased financial tools that help Americans make confident money decisions.</p>
        </div>

        <FooterColumn title="Borrowing" items={categories.slice(0, 3)} />
        <FooterColumn title="Growing" items={categories.slice(3, 6)} />
        <FooterColumn title="Managing" items={categories.slice(6)} />
      </div>

      <div className="footer-bottom">
        <div className="container-site footer-meta">
          <p>© {new Date().getFullYear()} MicroFinancePost.com. All rights reserved.</p>
          <div className="footer-links">
            <Link href="/calculators">Calculators</Link>
            <Link href="/about">About & Methodology</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="container-site footer-disclaimer">
          MicroFinancePost provides educational tools and information only. Results are estimates and do not constitute financial, tax, legal or investment advice. Consult a qualified professional before making financial decisions.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: typeof categories }) {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((category) => (
          <li key={category.slug}>
            <Link href={`/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
