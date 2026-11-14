import Link from 'next/link';

// User-supplied article; wording is preserved with internal links added.
export function MortgageSupportingContent() {
  return <>
    <section className="finance-article-section">
      <h2>What Is a Mortgage Payment Calculator?</h2>
      <p>A <strong>Mortgage Payment Calculator</strong> helps you estimate how much you'll pay each month when buying a home with a mortgage.</p>
      <p>Your monthly payment depends on several factors, including the home's price, your <Link href="/calculators/home-affordability-calculator/">down payment</Link>, the interest rate, and the repayment period.</p>
      <p>However, the loan payment isn't always your entire housing cost.</p>
      <p>According to the <a href="https://www.consumerfinance.gov/ask-cfpb/on-a-mortgage-whats-the-difference-between-my-principal-and-interest-payment-and-my-total-monthly-payment-en-1941/">Consumer Financial Protection Bureau (CFPB)</a>, mortgage payments often include property taxes, homeowners insurance, and mortgage insurance.</p>
      <p>Our calculator helps you estimate these costs before committing to a home loan.</p>
    </section>
    <section className="finance-article-section">
      <h2>How to Use Our Mortgage Payment Calculator</h2>
      <p>Enter a few details about the home and loan you're considering.</p>
      <ol>
        <li><strong>Home price:</strong> Enter the property's purchase price.</li>
        <li><strong>Down payment:</strong> Add the amount you'll pay upfront.</li>
        <li><strong>Interest rate:</strong> Enter your expected annual mortgage rate.</li>
        <li><strong>Loan term:</strong> Choose your repayment period, such as 15 or 30 years.</li>
        <li><strong>Property taxes:</strong> Include estimated annual property taxes.</li>
        <li><strong>Insurance and fees:</strong> Add homeowners insurance, mortgage insurance, or HOA fees where applicable.</li>
      </ol>
      <p>The calculator estimates your monthly payment, loan interest, and total repayment costs.</p>
      <p>You can adjust the inputs to compare different home prices and financing options.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Is Included in a Monthly Mortgage Payment?</h2>
      <p>A mortgage payment commonly includes four components, often called <strong>PITI</strong>.</p>
      <h3>Principal</h3>
      <p>Principal is the amount you borrowed to purchase the property.</p>
      <p>Each principal payment reduces your outstanding loan balance.</p>
      <h3>Interest</h3>
      <p>Interest is the amount your lender charges for providing the loan.</p>
      <p>Early mortgage payments typically contain more interest than principal.</p>
      <h3>Property taxes</h3>
      <p>Local governments may charge property taxes based on the assessed value of your home.</p>
      <p>These costs vary depending on your location.</p>
      <h3>Homeowners insurance</h3>
      <p>Homeowners insurance helps protect your property against certain covered losses.</p>
      <p>Some borrowers also pay mortgage insurance.</p>
      <p>The <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-piti-en-152/">CFPB's explanation of PITI</a> describes these components and why they're important when budgeting.</p>
    </section>
    <section className="finance-article-section">
      <h2>Mortgage Payment Calculation Example</h2>
      <p>Suppose you're purchasing a home for $375,000.</p>
      <p>You make a 20% down payment and finance the remaining amount over 30 years.</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Mortgage details</th><th scope="col">Amount</th></tr></thead><tbody>
        <tr><td>Home price</td><td>$375,000</td></tr>
        <tr><td>Down payment</td><td>$75,000</td></tr>
        <tr><td>Loan amount</td><td>$300,000</td></tr>
        <tr><td>Annual interest rate</td><td>6%</td></tr>
        <tr><td>Loan term</td><td>30 years</td></tr>
        <tr><td>Annual property taxes</td><td>$3,600</td></tr>
        <tr><td>Annual homeowners insurance</td><td>$1,200</td></tr>
      </tbody></table></div>
      <p>Your estimated monthly costs would be:</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Payment component</th><th scope="col">Monthly amount</th></tr></thead><tbody>
        <tr><td>Principal and interest</td><td>$1,798.65</td></tr>
        <tr><td>Property taxes</td><td>$300</td></tr>
        <tr><td>Homeowners insurance</td><td>$100</td></tr>
        <tr><td><strong>Total estimated monthly payment</strong></td><td><strong>$2,198.65</strong></td></tr>
      </tbody></table></div>
      <p>Over 30 years, you'd pay approximately $347,514 in loan interest if the rate remains fixed and you make all scheduled payments.</p>
      <p>These estimates exclude closing costs, maintenance, and HOA fees.</p>
      <p>The 6% interest rate is hypothetical, not a current mortgage quote.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Are Mortgage Payments Calculated?</h2>
      <p>For a standard fixed-rate mortgage, lenders generally use an amortization formula.</p>
      <p><strong>M = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]</strong></p>
      <p>Where:</p>
      <ul>
        <li><strong>M:</strong> Monthly principal and interest payment</li>
        <li><strong>P:</strong> Original loan amount</li>
        <li><strong>r:</strong> Monthly interest rate</li>
        <li><strong>n:</strong> Total number of monthly payments</li>
      </ul>
      <p>For example, a 30-year mortgage has 360 monthly payments.</p>
      <p>The <a href="https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/">CFPB explains how mortgage lenders calculate payments</a>.</p>
      <p>Property taxes and insurance are added separately to estimate your total monthly housing payment.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Does Your Down Payment Affect Your Mortgage?</h2>
      <p>A down payment reduces the amount you need to borrow.</p>
      <p>For example, making a $75,000 down payment on a $375,000 home leaves a $300,000 mortgage.</p>
      <p>A smaller down payment increases the loan balance and generally raises your monthly principal and interest payment.</p>
      <p>For conventional loans, putting down less than 20% often means paying <strong>private mortgage insurance (PMI)</strong>.</p>
      <p>The <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-private-mortgage-insurance-en-122/">CFPB explains mortgage insurance requirements</a> and how PMI affects borrowing costs.</p>
      <p>However, don't use all your savings for a larger down payment. Remember to budget for closing costs and <Link href="/savings/emergency-fund-calculator/">emergencies</Link>.</p>
    </section>
    <section className="finance-article-section">
      <h2>Should You Choose a 15-Year or 30-Year Mortgage?</h2>
      <p>A shorter mortgage term usually means higher monthly payments but lower total interest.</p>
      <p>Consider a $300,000 mortgage at a fixed 6% interest rate:</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Loan term</th><th scope="col">Monthly principal and interest</th><th scope="col">Total interest</th></tr></thead><tbody>
        <tr><td>15 years</td><td>$2,531.57</td><td>$155,682</td></tr>
        <tr><td>30 years</td><td>$1,798.65</td><td>$347,514</td></tr>
      </tbody></table></div>
      <p>The 15-year mortgage costs approximately $733 more per month but saves around $191,832 in interest.</p>
      <p>These comparisons assume the same rate for both terms, although actual lenders may offer different rates.</p>
      <p>Choose a term that balances <Link href="/calculators/budget-calculator/">monthly affordability</Link> and long-term costs.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Other Costs Should Homebuyers Consider?</h2>
      <p>Beyond your mortgage payment, homeownership brings additional expenses.</p>
      <p>These may include:</p>
      <ul>
        <li>Closing costs and lender fees.</li>
        <li>Home inspections and appraisals.</li>
        <li>Repairs and ongoing maintenance.</li>
        <li>Utilities and moving costs.</li>
        <li>HOA or condominium fees.</li>
        <li>Unexpected property expenses.</li>
      </ul>
      <p>According to the <a href="https://www.consumerfinance.gov/owning-a-home/prepare/figure-out-how-much-you-want-to-spend/">CFPB's homebuying guide</a>, closing costs commonly range from 2% to 5% of the purchase price, excluding the down payment.</p>
      <p>Your actual costs depend on the property, location, and loan.</p>
    </section>
    <section className="finance-article-section">
      <h2>How to Reduce Your Mortgage Payments</h2>
      <p>There are several ways to manage your monthly mortgage costs.</p>
      <p><strong>Increase your down payment.</strong> Borrowing less generally reduces principal and interest payments.</p>
      <p><strong><Link href="/calculators/loan-comparison-calculator/">Compare multiple lenders</Link>.</strong> Interest rates, closing costs, and other charges vary between mortgage offers.</p>
      <p><strong>Consider a longer term.</strong> This can reduce monthly payments but usually increases lifetime interest.</p>
      <p><strong>Improve your credit profile.</strong> A stronger credit history may help you qualify for better loan terms.</p>
      <p><strong>Review insurance costs.</strong> Comparing homeowners insurance policies may reduce your overall housing expenses.</p>
      <p>The <a href="https://www.consumerfinance.gov/owning-a-home/compare/compare-loan-estimates/">CFPB recommends comparing Loan Estimates</a> rather than choosing a mortgage based only on its advertised rate.</p>
    </section>
    <section className="finance-article-section">
      <h2>Frequently Asked Questions</h2>
      <h3>How much is a $300,000 mortgage per month?</h3>
      <p>At a hypothetical 6% fixed interest rate over 30 years, a $300,000 mortgage costs approximately $1,798.65 per month in principal and interest. Property taxes, insurance, and other applicable charges increase the total payment.</p>
      <h3>Does a 20% down payment eliminate mortgage insurance?</h3>
      <p>A 20% down payment generally eliminates the need for private mortgage insurance on a conventional mortgage. However, government-backed loans may have different mortgage insurance requirements.</p>
      <h3>Can my mortgage payment increase over time?</h3>
      <p>Yes. Even with a fixed-rate mortgage, your total payment may change if property taxes or insurance premiums increase. Adjustable-rate mortgages can also experience changes to their principal and interest payments.</p>
    </section>
    <section className="finance-article-section">
      <h2>Final Thoughts</h2>
      <p>Understanding your mortgage payment is essential before purchasing a home.</p>
      <p>The most affordable mortgage isn't necessarily the one with the lowest monthly payment. You should also consider total interest, taxes, insurance, and long-term ownership costs.</p>
      <p>Use the <strong><Link href="#mortgage-calculator">Mortgage Payment Calculator above</Link></strong> to compare different home prices, down payments, interest rates, and repayment terms before making your decision.</p>
    </section>
  </>;
}
