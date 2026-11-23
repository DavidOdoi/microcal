import { CalculatorsDirectory } from './CalculatorsDirectory';

export const metadata = {
  title: 'Financial Calculator Directory — MicroFinancePost',
  description: 'Browse free calculators for mortgages, loans, savings, retirement, taxes, debt payoff and more. Filter by topic or calculator name.',
  alternates: { canonical: '/calculators/' },
};

export default function CalculatorsDirectoryPage() {
  return <CalculatorsDirectory />;
}
