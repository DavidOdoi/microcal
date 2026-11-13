import Link from 'next/link';

export function DtiSupportingArticle() {
  return <>
    <section className="finance-article-section">
      <h2>How to Calculate Your Debt-to-Income Ratio</h2>
      <p>A debt-to-income ratio (DTI) compares qualifying monthly debt payments with gross monthly income: income before taxes and other deductions. The <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" target="_blank" rel="noreferrer">Consumer Financial Protection Bureau describes DTI as monthly debt payments divided by gross monthly income</a>. This calculator expresses the result as a percentage.</p>
      <div className="finance-formula">DTI = (qualifying monthly debt payments ÷ gross monthly income) × 100</div>
      <ol><li>Add the monthly payments the loan program counts.</li><li>Divide that sum by gross monthly income for the same month.</li><li>Multiply the decimal result by 100.</li></ol>
      <p><strong>Worked example:</strong> Suppose qualifying debt is $1,100 for a mortgage, $300 for a car loan, and $100 in credit-card minimums. That totals $1,500. With $5,000 in gross monthly income, $1,500 ÷ $5,000 = 0.30, so the DTI is <strong>30%</strong>.</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Payment in example</th><th scope="col">Monthly amount</th></tr></thead><tbody><tr><td>Mortgage</td><td>$1,100</td></tr><tr><td>Car loan</td><td>$300</td></tr><tr><td>Credit-card minimums</td><td>$100</td></tr><tr><th scope="row">Qualifying debt total</th><th>$1,500</th></tr></tbody></table></div>
      <p>Use monthly income and monthly payments rather than mixing weekly, biweekly, and annual amounts. If income varies, use the method the lender accepts for documenting and calculating qualifying income.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Is a Good Debt-to-Income Ratio?</h2>
      <p>There is no single DTI cutoff that guarantees approval or applies to every mortgage, auto loan, or personal loan. Lenders and loan programs set their own limits and may calculate debt or income differently. Treat the percentage as one planning measure, then confirm the requirements for the specific product with the lender.</p>
      <p>A lower DTI means a smaller share of gross income is committed to the debts included in the calculation. It does not show your full monthly budget: taxes, food, utilities, childcare, savings, and many other costs may not be included. A ratio that appears manageable on paper can still feel tight after those expenses.</p>
      <p>To explore a scenario, update the monthly payments above or enter a proposed payment. The projected DTI is arithmetic only; it is not an approval prediction. Compare your spending plan with our <Link href="/budgeting/">budgeting tools</Link> or estimate a card payoff with the <Link href="/calculators/credit-card-payoff-calculator/">credit-card payoff calculator</Link>.</p>
    </section>
    <section className="finance-article-section">
      <h2>What Payments Count Toward DTI?</h2>
      <p>Common obligations include housing debt such as a mortgage, auto loans, student loans, personal loans, minimum credit-card payments, and other recurring debts required by a lender’s calculation. The exact list and payment amount used can depend on the type of loan and underwriting rules.</p>
      <p>Routine household costs such as groceries, utilities, fuel, and subscriptions matter to your personal budget, but they are not usually entered as loan payments in a standard DTI calculation. This is one reason DTI is not a complete affordability measure.</p>
      <h3>Does rent count when you are applying for a mortgage?</h3>
      <p>When a mortgage payment is being evaluated, rent is generally not added on top of the proposed mortgage payment in the standard DTI calculation. This tool lets you mark housing as rent so it is visible in your inputs but excluded from qualifying debt. Lender treatment can vary by loan product, so confirm how a particular application handles current rent, lease obligations, and the new housing payment.</p>
    </section>
  </>;
}

export function EmergencySupportingArticle() {
  return <>
    <section className="finance-article-section">
      <h2>How Much Should You Have in an Emergency Fund?</h2>
      <p>Your emergency fund target depends on your household’s essential costs, income reliability, dependents, health needs, and the unexpected expenses you may face. Three, six, nine, or twelve months are planning options in this calculator—not universal rules or required balances.</p>
      <p>The <a href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/" target="_blank" rel="noreferrer">CFPB describes an emergency fund as money set aside for unplanned expenses</a>, such as a car repair, home repair, medical bill, or loss of income. It also notes that even a small amount can help. If a large target feels out of reach, choose a first milestone you can build toward and revise it later.</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Monthly essentials</th><th scope="col">3 months</th><th scope="col">6 months</th><th scope="col">12 months</th></tr></thead><tbody><tr><th scope="row">$1,500</th><td>$4,500</td><td>$9,000</td><td>$18,000</td></tr><tr><th scope="row">$2,500</th><td>$7,500</td><td>$15,000</td><td>$30,000</td></tr></tbody></table></div>
      <p>These are simple expense multiples, not recommendations for every reader. Choose a period that reflects your circumstances and how long it could take to restore income or handle a major bill.</p>
    </section>
    <section className="finance-article-section">
      <h2>How to Calculate Your Emergency Fund</h2>
      <p>Estimate the monthly costs you would still need to cover during a disruption. Include housing, groceries, utilities, transportation, insurance, essential debt payments, and other necessary costs. Avoid including discretionary spending if you would pause it during an emergency.</p>
      <div className="finance-formula">Savings target = essential monthly expenses × chosen coverage months</div>
      <p><strong>Worked example:</strong> If essential expenses are $1,500 per month and you select six months, the target is $9,000. With $2,000 already saved, the remaining amount is $7,000. The calculator shows both the total goal and the gap.</p>
      <p>Decide what belongs in your own essentials list: some households need to account for medication, caregiving, pet care, or costs that continue when income is reduced. A budget is a useful starting point, but you can adjust the target for risks your regular budget does not capture.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Long Will It Take to Reach Your Savings Goal?</h2>
      <p>Divide the remaining goal by the amount you expect to save each month, then round up to a whole month. If you need $7,000 and can save $500 a month, $7,000 ÷ $500 = 14 months. If your contribution is zero and you have not reached the target, the calculator cannot estimate a timeline.</p>
      <div className="finance-formula">Months to goal = ceiling(remaining amount ÷ monthly contribution)</div>
      <p>This estimate assumes the contribution stays the same and ignores interest, withdrawals, fees, and changes in expenses or contributions. A savings account may earn interest, but the actual rate can change. A manageable recurring transfer and occasional review can help keep a savings plan realistic.</p>
      <p>Keep emergency savings somewhere you can access when needed and understand any withdrawal restrictions. The <a href="https://www.consumerfinance.gov/owning-a-home/prepare/determine-your-down-payment/" target="_blank" rel="noreferrer">CFPB’s home-buying guidance advises keeping an emergency cushion in mind when setting aside savings for a down payment</a>. If you compare a certificate of deposit, review its maturity and early-withdrawal terms; our <Link href="/savings/cd-interest-calculator/">CD interest calculator</Link> estimates maturity value.</p>
    </section>
  </>;
}

export function CdSupportingArticle() {
  return <>
    <section className="finance-article-section">
      <h2>How to Calculate CD Interest</h2>
      <p>A certificate of deposit (CD) holds a deposit for a stated term under the institution’s account agreement. To estimate maturity value using APY, multiply the deposit by one plus the APY raised to the number of years. Subtract the initial deposit to estimate interest earned.</p>
      <div className="finance-formula">Maturity value = deposit × (1 + APY)<sup>years</sup><br />Interest earned = maturity value − deposit</div>
      <p><strong>Worked example:</strong> A $10,000 deposit at a constant 4% APY for two years grows to $10,000 × (1.04)<sup>2</sup> = <strong>$10,816</strong>. Estimated interest is <strong>$816</strong>, before taxes or fees. This assumes the stated APY remains applicable for the full term and interest stays in the CD.</p>
      <p>The chart above shows estimated balance growth under your selected rate assumption. It is a mathematical projection, not a quote from a bank; the actual crediting schedule and maturity value follow the CD disclosure.</p>
    </section>
    <section className="finance-article-section">
      <h2>CD Interest Rate vs APY</h2>
      <p>APY expresses the annual yield after accounting for compounding under the account’s terms. A nominal annual interest rate is the stated rate before compounding is applied. They are related but not interchangeable. If a bank gives you APY, use APY mode; do not enter that APY as a nominal rate and compound it again.</p>
      <p>For comparison, a nominal 4% annual rate compounded monthly produces an effective annual yield of about 4.07%. On $10,000 for one year, that formula estimates about $407.42 in interest. At 4% APY, the one-year estimate is $400. The calculator reports the effective annual yield in nominal-rate mode so the difference is visible.</p>
      <div className="finance-formula">Nominal-rate maturity = principal × (1 + annual rate ÷ periods)<sup>periods × years</sup></div>
      <p>The <a href="https://www.fdic.gov/consumer-compliance-examination-manual/vi-3-truth-savings" target="_blank" rel="noreferrer">FDIC’s Truth in Savings materials explain APY disclosures and how compounding is reflected</a>. The institution’s CD disclosure is the source for the rate, term, compounding, and crediting details that apply to your account.</p>
    </section>
    <section className="finance-article-section">
      <h2>How CD Terms Affect Your Earnings</h2>
      <p>With the same deposit and APY, a longer term gives the balance more time to grow. This table assumes a $10,000 opening deposit, a constant 4% APY, no additional deposits, and no withdrawals:</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Term</th><th scope="col">Estimated maturity value</th><th scope="col">Estimated interest</th></tr></thead><tbody><tr><th scope="row">1 year</th><td>$10,400.00</td><td>$400.00</td></tr><tr><th scope="row">2 years</th><td>$10,816.00</td><td>$816.00</td></tr><tr><th scope="row">3 years</th><td>$11,248.64</td><td>$1,248.64</td></tr></tbody></table></div>
      <p>This comparison isolates the effect of time; actual institutions may offer different APYs for different terms, and rates can change before you open an account. Check when interest is credited, whether it stays on deposit, what happens at maturity, and any early-withdrawal penalty. Enter a penalty only when you have the actual figure or can calculate it from the CD contract—there is no universal penalty amount.</p>
      <p>CDs are time deposits. The <a href="https://www.fdic.gov/resources/deposit-insurance" target="_blank" rel="noreferrer">FDIC lists CDs among deposit products that may be covered at insured banks</a>, subject to applicable coverage rules and limits. Confirm the institution’s insurance status and consider your other deposits there; deposit insurance does not remove access restrictions before maturity.</p>
    </section>
  </>;
}
