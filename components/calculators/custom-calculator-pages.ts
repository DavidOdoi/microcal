import { DscrLoanCalculatorPage, dscrLoanMetadata } from './DscrLoanCalculatorPage';
import { LoanCalculatorPage, loanMetadata } from './LoanCalculatorPage';
import { DentalLoanCalculatorPage, dentalLoanMetadata } from './DentalLoanCalculatorPage';
import { FhaHomeLoanCalculatorPage, fhaHomeLoanMetadata } from './FhaHomeLoanCalculatorPage';
import { CommercialMortgageCalculatorPage, commercialMortgageMetadata } from './CommercialMortgageCalculatorPage';
import { HomeEquityLoanCalculatorPage, homeEquityLoanMetadata } from './HomeEquityLoanCalculatorPage';
import { RentVsBuyCalculatorPage, rentVsBuyMetadata } from './RentVsBuyCalculatorPage';

// Shared by the directory and category routes so new pages cannot be published
// in one URL form while their navigation URL falls back to a placeholder.
const pages = {
  'dscr-loan-calculator': { category: 'business', metadata: dscrLoanMetadata, Component: DscrLoanCalculatorPage },
  'loan-calculator': { category: 'loans', metadata: loanMetadata, Component: LoanCalculatorPage },
  'dental-loan-calculator': { category: 'loans', metadata: dentalLoanMetadata, Component: DentalLoanCalculatorPage },
  'fha-home-loan-calculator': { category: 'mortgages', metadata: fhaHomeLoanMetadata, Component: FhaHomeLoanCalculatorPage },
  'commercial-mortgage-calculator': { category: 'business', metadata: commercialMortgageMetadata, Component: CommercialMortgageCalculatorPage },
  'home-equity-loan-calculator': { category: 'home-equity', metadata: homeEquityLoanMetadata, Component: HomeEquityLoanCalculatorPage },
  'rent-vs-buy-calculator': { category: 'mortgages', metadata: rentVsBuyMetadata, Component: RentVsBuyCalculatorPage },
};
export function getCustomCalculatorPage(slug: string) {
  return Object.hasOwn(pages, slug) ? pages[slug as keyof typeof pages] : null;
}
