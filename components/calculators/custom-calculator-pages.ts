import kansasPaycheckContent from '@/content/paychecks/kansas.json';
import iowaPaycheckContent from '@/content/paychecks/iowa.json';
import indianaPaycheckContent from '@/content/paychecks/indiana.json';
import { paycheckGuides } from '@/lib/paycheck-guides';
import { createStatePaystubGuidePage } from './StatePaystubGuidePage';
import { IllinoisPaycheckCalculatorPage, illinoisPaycheckMetadata } from './IllinoisPaycheckCalculatorPage';
import { CaliforniaPaycheckCalculatorPage, californiaPaycheckMetadata } from './CaliforniaPaycheckCalculatorPage';
import { PaycheckCalculatorPage, paycheckMetadata } from './PaycheckCalculatorPage';
import { MortgageExtraCalculatorPage, mortgageExtraMetadata } from './MortgageExtraCalculatorPage';
import { GrossMarginCalculatorPage, grossMarginMetadata } from './GrossMarginCalculatorPage';
import { SelfEmploymentCalculatorPage, selfEmploymentMetadata } from './SelfEmploymentCalculatorPage';
import { RoiCalculatorPage, roiMetadata } from './RoiCalculatorPage';
import { UsInflationCalculatorPage, usInflationMetadata } from './UsInflationCalculatorPage';
import { FarmLoanCalculatorPage, farmLoanMetadata } from './FarmLoanCalculatorPage';
import { IdahoPaycheckCalculatorPage, idahoPaycheckMetadata } from './IdahoPaycheckCalculatorPage';
import { SalaryToHourlyCalculatorPage, salaryToHourlyMetadata } from './SalaryToHourlyCalculatorPage';
import { NewYorkPaycheckCalculatorPage, newYorkPaycheckMetadata } from './NewYorkPaycheckCalculatorPage';
import { FederalIncomeTaxCalculatorPage, FederalIncomeTaxAliasPage, federalIncomeTaxMetadata } from './FederalIncomeTaxCalculatorPage';
import { EarlyWithdrawalCalculatorPage, earlyWithdrawalMetadata } from './EarlyWithdrawalCalculatorPage';
import { SocialSecurityBenefitsCalculatorPage, socialSecurityBenefitsMetadata } from './SocialSecurityBenefitsCalculatorPage';
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
  'mortgage-extra-payment-calculator': { category: 'mortgages', metadata: mortgageExtraMetadata, Component: MortgageExtraCalculatorPage },
  'gross-margin-calculator': { category: 'business', metadata: grossMarginMetadata, Component: GrossMarginCalculatorPage },
  '1099-tax-calculator': { category: 'taxes', metadata: selfEmploymentMetadata, Component: SelfEmploymentCalculatorPage },
  'roi-calculator': { category: 'investments', metadata: roiMetadata, Component: RoiCalculatorPage },
  'us-inflation-calculator': { category: 'savings', metadata: usInflationMetadata, Component: UsInflationCalculatorPage },
  'farm-loan-calculator': { category: 'business', metadata: farmLoanMetadata, Component: FarmLoanCalculatorPage },
  'california-paycheck-calculator': { category: 'taxes', metadata: californiaPaycheckMetadata, Component: CaliforniaPaycheckCalculatorPage },
  'illinois-paycheck-calculator': { category: 'taxes', metadata: illinoisPaycheckMetadata, Component: IllinoisPaycheckCalculatorPage },
  'idaho-paycheck-calculator': { category: 'taxes', metadata: idahoPaycheckMetadata, Component: IdahoPaycheckCalculatorPage },
  'salary-to-hourly-calculator': { category: 'taxes', metadata: salaryToHourlyMetadata, Component: SalaryToHourlyCalculatorPage },
  'paycheck-calculator': { category: 'taxes', metadata: paycheckMetadata, Component: PaycheckCalculatorPage },
  'new-york-paycheck-calculator': { category: 'taxes', metadata: newYorkPaycheckMetadata, Component: NewYorkPaycheckCalculatorPage },
  'income-tax-calculator': { category: 'taxes', metadata: federalIncomeTaxMetadata, Component: FederalIncomeTaxCalculatorPage },
  'federal-income-tax-calculator': { category: 'taxes', metadata: federalIncomeTaxMetadata, Component: FederalIncomeTaxAliasPage },
  '401k-early-withdrawal-calculator': { category: 'retirement', metadata: earlyWithdrawalMetadata, Component: EarlyWithdrawalCalculatorPage },
  'social-security-benefits-calculator': { category: 'retirement', metadata: socialSecurityBenefitsMetadata, Component: SocialSecurityBenefitsCalculatorPage },
  'dscr-loan-calculator': { category: 'business', metadata: dscrLoanMetadata, Component: DscrLoanCalculatorPage },
  'loan-calculator': { category: 'loans', metadata: loanMetadata, Component: LoanCalculatorPage },
  'dental-loan-calculator': { category: 'loans', metadata: dentalLoanMetadata, Component: DentalLoanCalculatorPage },
  'fha-home-loan-calculator': { category: 'mortgages', metadata: fhaHomeLoanMetadata, Component: FhaHomeLoanCalculatorPage },
  'commercial-mortgage-calculator': { category: 'business', metadata: commercialMortgageMetadata, Component: CommercialMortgageCalculatorPage },
  'home-equity-loan-calculator': { category: 'home-equity', metadata: homeEquityLoanMetadata, Component: HomeEquityLoanCalculatorPage },
  'rent-vs-buy-calculator': { category: 'mortgages', metadata: rentVsBuyMetadata, Component: RentVsBuyCalculatorPage },
};
const stateContent: Record<string, Parameters<typeof createStatePaystubGuidePage>[1]> = {
  'kansas-paycheck-calculator': kansasPaycheckContent,
  'iowa-paycheck-calculator': iowaPaycheckContent,
  'indiana-paycheck-calculator': indianaPaycheckContent,
};

const statePaystubPages = new Map(paycheckGuides.map(guide => [
  guide.slug, createStatePaystubGuidePage(guide, stateContent[guide.slug]),
]));

export function getCustomCalculatorPage(slug: string) {
  return Object.hasOwn(pages, slug) ? pages[slug as keyof typeof pages] : statePaystubPages.get(slug) ?? null;
}
