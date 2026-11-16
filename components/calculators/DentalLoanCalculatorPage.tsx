import Link from 'next/link';
import type { Metadata } from 'next';
import { DentalLoanCalculator } from './DentalLoanCalculator';

const canonical = 'https://microfinancepost.com/calculators/dental-loan-calculator/';
const title = 'Dental Loan Calculator — Monthly Payments and Financing Cost';
const description = 'Estimate dental loan payments after insurance and a down payment. Compare interest, fees, extra payments, and a monthly amortization schedule.';
export const dentalLoanMetadata: Metadata = { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, type: 'website' } };

export function DentalLoanCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Dental Loan Calculator', applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: canonical, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
    <header className="finance-page-heading"><div className="container-site"><nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/loans/">Loans</Link><span>›</span><span>Dental Loan Calculator</span></nav><h1>Dental Loan Calculator</h1><p>Estimate monthly payments for dental treatment after insurance and a down payment. Compare fixed-rate financing costs, optional loan fees, and the effect of paying extra toward principal.</p></div></header>
    <main className="finance-page container-site"><DentalLoanCalculator /><article className="finance-article">
      <h2>How to estimate dental financing</h2>
      <p>Start with your dentist’s written treatment estimate. Subtract the amount your insurer expects to pay and the amount you will pay upfront. The remaining treatment balance is the amount to finance. Confirm insurance coverage, annual benefit limits, and payment timing before borrowing.</p>
      <p>Enter the loan’s annual interest rate and term in months. Under advanced settings, add a loan fee and choose whether you will pay it upfront or add it to the balance. A financed fee accrues interest. No loan fee is applied when insurance and your down payment fully cover treatment.</p>
      <h2>Worked example</h2>
      <p>For $6,000 of treatment, a $1,000 insurance contribution and a $500 down payment leave $4,500 to finance. At 10% annual interest over 36 months with no fee, the monthly payment is about $145.20. Total interest is about $727.28, and total out-of-pocket cost including the down payment is about $5,727.28.</p>
      <h2>Understanding the results</h2>
      <p>Total loan payments include principal, financed fees, and interest. Total out-of-pocket cost adds your down payment and any upfront loan fee; it excludes the insurer’s contribution. Extra monthly payments can shorten repayment and reduce interest. Confirm that your lender applies extra payments to principal and check any prepayment terms.</p>
      <p>Compare terms with the <Link href="/calculators/personal-loan-calculator/">personal loan calculator</Link> or compare two offers using the <Link href="/calculators/loan-comparison-calculator/">loan comparison calculator</Link>. Use your <Link href="/calculators/budget-calculator/">monthly budget</Link> to assess whether the payment fits your other expenses.</p>
      <h2>Frequently asked questions</h2>
      <h3>Can I use this for implants, braces, or other dental work?</h3>
      <p>Yes, when financing uses a fixed-rate installment loan. Enter the treatment cost and confirmed insurance contribution. Separate treatments or loans with different rates should be modeled individually.</p>
      <h3>Is 0% financing the same as deferred interest?</h3>
      <p>No. A true 0% rate produces no interest in this model. A deferred-interest offer may charge interest from the purchase date if you do not pay the full balance by its deadline. This calculator does not model that charge; read the promotional agreement.</p>
      <h3>Should I enter the interest rate or APR?</h3>
      <p>Use the contractual interest rate to estimate monthly payments and enter the loan fee separately. APR can include certain fees, so using APR and adding those same fees can overstate costs. Compare the lender’s APR and total-payment disclosures before choosing financing.</p>
      <h3>Does the estimate guarantee insurance coverage or loan approval?</h3>
      <p>No. Your insurer determines coverage and your lender sets eligibility and final terms. The schedule assumes monthly payments beginning one month after borrowing, fixed rates, and no late fees or payment holidays.</p>
      <h2>Further reading</h2>
      <p>The <a href="https://www.consumerfinance.gov/consumer-tools/personal-loans/">Consumer Financial Protection Bureau’s personal loan resources</a> explain borrowing considerations. Review your insurance benefit statement and the lender’s agreement alongside any estimate.</p>
    </article></main>
  </>;
}
