import './globals.css';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader, type MenuCategory } from '@/components/site/SiteHeader';
import { categoryArticlePath, categoryArticles } from '@/lib/category-articles';
import { plannedCategoryArticles } from '@/lib/planned-category-articles';
import { calculatorsIn, categories } from '@/lib/site-data';
import type { Metadata } from 'next';

const articleGroups = [
  { kind: 'guide', title: 'Guides' },
  { kind: 'best', title: 'Best picks' },
  { kind: 'vs', title: 'Comparisons' },
] as const;

const menuCategories: MenuCategory[] = categories.map(({ slug, name }) => {
  const articles = categoryArticles.filter((article) => article.category === slug);
  const groups = [
    {
      title: 'Calculators',
      links: calculatorsIn(slug)
        .filter((calculator) => calculator.status === 'live')
        .map((calculator) => ({ title: calculator.name, href: `/calculators/${calculator.slug}/` })),
    },
    ...articleGroups.map(({ kind, title }) => ({
      title,
      links: articles.filter((article) => article.kind === kind)
        .map((article) => ({ title: article.title, href: categoryArticlePath(article) })),
    })),
  ];
  return {
    slug,
    name,
    groups: groups.filter((group) => group.links.length > 0),
    planned: (plannedCategoryArticles[slug] ?? []).map((article) => article.title),
  };
});

export const metadata: Metadata = {
  title: 'MicroFinancePost',
  description: 'Free calculators for mortgages, debt, budgeting, taxes, retirement and savings.',
  verification: { google: 'f3Vd7topcQTp-5X6zpLxNf8RNBpGoPfeDUwA7nLEeuk' },
  icons: {
    icon: [
      { url: '/favicon.ico?v=money-1', type: 'image/x-icon', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
      { url: '/favicon.png?v=money-1', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico?v=money-1',
    apple: [{ url: '/apple-touch-icon.png?v=money-1', type: 'image/png', sizes: '180x180' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteHeader categories={menuCategories} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
