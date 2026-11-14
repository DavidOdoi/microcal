import Link from 'next/link';

// User-supplied article; wording is preserved with internal links added.
export function MortgageAffordabilitySupportingContent() {
  return <>
    <section className="finance-article-section">
      <h2>What Is a Mortgage Affordability Calculator?</h2>
      <p>A <strong>Mortgage Affordability Calculator</strong> helps you estimate how much house you can afford based on your income, existing debts, down payment, and expected mortgage costs.</p>
      <p>Buying a home is a major financial commitment. Before choosing a property, it's important to know how much you can comfortably spend each month.</p>
      <p>Your maximum mortgage approval amount isn't necessarily the amount you should borrow.</p>
      <p>The <a href="https://www.consumerfinance.gov/ask-cfpb/how-can-i-figure-out-if-i-can-afford-to-buy-a-home-and-take-out-a-mortgage-en-118/">Consumer Financial Protection Bureau (CFPB)</a> recommends choosing a mortgage that fits your financial priorities rather than simply borrowing the maximum amount a lender offers.</p>
      <p>Our calculator helps you explore a realistic homebuying budget before applying for financing.</p>
    </section>
    <section className="finance-article-section">
      <h2>How to Use Our Mortgage Affordability Calculator</h2>
      <p>Start by entering your financial information.</p>
      <ol>
        <li><strong>Annual household income:</strong> Enter your income before taxes.</li>
        <li><strong>Monthly debt payments:</strong> Include car loans, student loans, and other required debt payments.</li>
        <li><strong>Down payment:</strong> Enter how much you can contribute upfront.</li>
        <li><strong>Mortgage interest rate:</strong> Add your estimated annual rate.</li>
        <li><strong>Loan term:</strong> Choose a repayment period, such as 15 or 30 years.</li>
        <li><strong>Property taxes and insurance:</strong> Include estimated housing costs where available.</li>
      </ol>
      <p>The calculator estimates an affordable home price, potential mortgage amount, and monthly housing payment.</p>
      <p>You can adjust your down payment or interest rate to compare different scenarios.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Much House Can You Afford Based on Income?</h2>
      <p>Your income is an important factor in determining mortgage affordability.</p>
      <p>However, lenders also consider your existing debt obligations.</p>
      <p>A commonly used starting guideline is the <strong>28/36 rule</strong>:</p>
      <ul>
        <li>Spend no more than approximately 28% of gross monthly income on housing costs.</li>
        <li>Keep total monthly debt payments, including housing, around 36% of gross income.</li>
      </ul>
      <p>These are budgeting guidelines, not universal mortgage approval requirements.</p>
      <p>The <a href="https://www.consumerfinance.gov/owning-a-home/prepare/decide-how-much-you-want-spend/">CFPB's mortgage affordability worksheet</a> explains how income, expenses, down payments, and financing terms affect your affordable home price.</p>
      <p>Some borrowers qualify with higher debt ratios, while others need a more conservative budget.</p>
    </section>
    <section className="finance-article-section">
      <h2>Mortgage Affordability Calculation Example</h2>
      <p>Suppose your household earns $72,000 annually.</p>
      <p>You have $600 in monthly debt payments and plan to purchase a home with a 20% down payment.</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Financial details</th><th scope="col">Amount</th></tr></thead><tbody>
        <tr><td>Annual household income</td><td>$72,000</td></tr>
        <tr><td>Gross monthly income</td><td>$6,000</td></tr>
        <tr><td>Existing monthly debts</td><td>$600</td></tr>
        <tr><td>Hypothetical mortgage rate</td><td>6%</td></tr>
        <tr><td>Mortgage term</td><td>30 years</td></tr>
        <tr><td>Down payment</td><td>20%</td></tr>
      </tbody></table></div>
      <p>Using the 36% total debt guideline:</p>
      <p><strong>$6,000 × 36% = $2,160</strong></p>
      <p>After subtracting your existing debt payments:</p>
      <p><strong>$2,160 − $600 = $1,560</strong></p>
      <p>This leaves approximately $1,560 per month for the qualifying housing payment.</p>
      <p>If property taxes, insurance, and association fees total $460 monthly, approximately $1,100 remains for mortgage principal and interest.</p>
      <p>At a hypothetical fixed 6% rate over 30 years, this supports a mortgage of approximately $183,500.</p>
      <p>With a 20% down payment, the corresponding home price would be around <strong>$229,400</strong>.</p>
      <p>This is an illustrative estimate, not a lender approval or guaranteed affordable purchase price.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Is a Debt-to-Income Ratio?</h2>
      <p>Your <strong><Link href="/debt/debt-to-income-ratio-calculator/">debt-to-income ratio (DTI)</Link></strong> measures the percentage of your gross monthly income committed to debt payments.</p>
      <p>The formula is:</p>
      <p><strong>DTI = Total Monthly Debt Payments ÷ Gross Monthly Income × 100</strong></p>
      <p>For example, if you earn $6,000 monthly and pay $2,100 toward qualifying debts, your DTI is 35%.</p>
      <p>Lenders use DTI to evaluate repayment capacity.</p>
      <p>According to <a href="https://selling-guide.fanniemae.com/sel/b3-6-02/debt-income-ratios">Fannie Mae's underwriting guidelines</a>, manually underwritten mortgages generally have a maximum DTI of 36%, with higher allowances when specified conditions are met.</p>
      <p>However, your personal budget may require a lower ratio.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Does Your Down Payment Affect Affordability?</h2>
      <p>A down payment reduces the amount you need to borrow.</p>
      <p>For example, putting $40,000 down on a $200,000 home leaves a $160,000 mortgage.</p>
      <p>A larger down payment generally reduces <Link href="/calculators/mortgage-calculator/">monthly principal and interest payments</Link>.</p>
      <p>It may also help you avoid private mortgage insurance on certain conventional loans.</p>
      <p>However, using all your savings for a down payment can leave you unprepared for emergencies.</p>
      <p>The <a href="https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/">CFPB recommends setting aside money for moving expenses, repairs, and emergency savings</a>.</p>
      <p>Choose a down payment that supports both your home purchase and your ongoing financial stability.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Other Costs Affect Mortgage Affordability?</h2>
      <p>Your mortgage payment isn't the only expense associated with owning a home.</p>
      <p>Additional costs may include:</p>
      <ul>
        <li>Property taxes.</li>
        <li>Homeowners insurance.</li>
        <li>Mortgage insurance.</li>
        <li>Homeowners association fees.</li>
        <li>Maintenance and repairs.</li>
        <li>Utilities.</li>
        <li>Closing costs.</li>
      </ul>
      <p>The CFPB explains that <a href="https://www.consumerfinance.gov/owning-a-home/prepare/figure-out-how-much-you-want-to-spend/">mortgage closing costs commonly range from 2% to 5% of the home's purchase price</a>, excluding the down payment.</p>
      <p>For a $250,000 property, that could mean approximately $5,000–$12,500 in additional upfront expenses.</p>
      <p>Your actual costs will depend on the property, loan, and location.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Can You Increase Your Mortgage Affordability?</h2>
      <p>There are several ways to improve your homebuying budget.</p>
      <p><strong><Link href="/calculators/debt-payoff-calculator/">Reduce existing debts</Link>.</strong> Lower monthly debt payments can improve your DTI.</p>
      <p><strong>Increase your down payment.</strong> Borrowing less generally reduces mortgage costs.</p>
      <p><strong><Link href="/calculators/loan-comparison-calculator/">Compare lenders</Link>.</strong> Different lenders may offer different interest rates and fees.</p>
      <p><strong>Improve your credit profile.</strong> A stronger credit history may help you qualify for more favorable financing.</p>
      <p><strong>Consider a less expensive home.</strong> Buying below your maximum budget can provide greater financial flexibility.</p>
      <p>Most importantly, avoid sacrificing <Link href="/savings/emergency-fund-calculator/">emergency savings</Link> or essential expenses simply to purchase a larger property.</p>
    </section>
    <section className="finance-article-section">
      <h2>Mortgage Affordability vs. Mortgage Preapproval</h2>
      <p>A mortgage affordability calculator provides an estimate based on your inputs.</p>
      <p>A mortgage preapproval involves a lender assessing your financial information to determine how much it may be willing to lend.</p>
      <p>These are different processes.</p>
      <p>The <a href="https://www.consumerfinance.gov/owning-a-home/explore/get-a-preapproval-letter/">CFPB explains that a preapproval letter</a> is a tentative lending decision, not a guaranteed mortgage offer.</p>
      <p>Actual approval depends on factors such as verified income, credit history, debts, property valuation, and underwriting requirements.</p>
      <p>Use calculator results for planning, not as proof that you'll qualify.</p>
    </section>
    <section className="finance-article-section">
      <h2>Frequently Asked Questions</h2>
      <h3>How much house can I afford with a $70,000 salary?</h3>
      <p>It depends on your existing debts, down payment, mortgage rate, and housing expenses. A $70,000 salary alone isn't enough to determine an affordable purchase price. Use the calculator to estimate a realistic budget.</p>
      <h3>Does a larger down payment increase mortgage affordability?</h3>
      <p>Generally, yes. A larger down payment reduces the loan amount and monthly principal and interest payment. However, keep enough savings for closing costs, emergencies, and unexpected home repairs.</p>
      <h3>Is mortgage affordability the same as mortgage approval?</h3>
      <p>No. Affordability is an estimate of what fits your budget. Mortgage approval requires a lender to verify your qualifications and assess the property and loan application.</p>
    </section>
    <section className="finance-article-section">
      <h2>Final Thoughts</h2>
      <p>Knowing how much house you can afford is an important first step toward responsible homeownership.</p>
      <p>Your income matters, but so do your debts, savings, mortgage rate, and ongoing housing expenses.</p>
      <p>Use the <strong><Link href="#home-affordability-calculator">Mortgage Affordability Calculator above</Link></strong> to compare different home prices, down payments, and financing assumptions.</p>
      <p>Aim for a mortgage that supports your financial goals without leaving your monthly budget unnecessarily stretched.</p>
    </section>
  </>;
}
