import SearchResults from './SearchResults';

export const metadata = {
  title: 'Search — MicroFinancePost',
  description: 'Search MicroFinancePost calculators and money topics.',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  return <SearchResults initialQuery={q} />;
}
