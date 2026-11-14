import Link from 'next/link';

// User-supplied content; the unfinished trailing sentence is intentionally omitted.
export function EmergencyFundSupportingContent() {
  return <>
    <section className="finance-article-section">
      <h2>What Is an Emergency Fund?</h2>
      <p>An <strong>emergency fund</strong> is money you set aside for unexpected expenses or financial difficulties.</p>
      <p>It helps cover situations such as losing your job, emergency medical bills, urgent car repairs, or unexpected home maintenance.</p>
      <p>Instead of relying on <Link href="/calculators/credit-card-payoff-calculator/">credit cards</Link> or borrowing money, you can use your savings to manage the situation.</p>
      <p>According to the <a href="https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/">Consumer Financial Protection Bureau (CFPB)</a>, having dedicated emergency savings can help you recover from financial setbacks without accumulating additional debt.</p>
      <p>Even a small emergency fund can make a difference.</p>
    </section>
    <section className="finance-article-section">
      <h2>How to Use Our Emergency Fund Calculator</h2>
      <p>Our Emergency Fund Calculator helps you estimate how much money you should save and how long it may take to reach your goal.</p>
      <p>Start by entering your <Link href="/calculators/budget-calculator/">essential monthly expenses</Link>, including housing, food, utilities, transportation, insurance, and minimum debt payments.</p>
      <p>Next, choose how many months of expenses you want your emergency fund to cover.</p>
      <p>Then enter your current emergency savings and the amount you can contribute each month.</p>
      <p>The calculator estimates:</p>
      <ul>
        <li>Your recommended emergency fund.</li>
        <li>How much you've already saved.</li>
        <li>How much more money you need.</li>
        <li>Your progress toward the goal.</li>
        <li>How long it may take to reach your target.</li>
      </ul>
      <p>You can adjust your <Link href="/calculators/savings-calculator/">monthly savings amount</Link> to explore different timelines.</p>
    </section>
    <section className="finance-article-section">
      <h2>How Much Should You Save in an Emergency Fund?</h2>
      <p>A common recommendation is to save enough to cover <strong>three to six months of essential living expenses</strong>.</p>
      <p>The <a href="https://www.fdic.gov/consumer-resource-center/2025-02/preparing-tax-season">Federal Deposit Insurance Corporation (FDIC)</a> explains that the appropriate amount depends on factors such as your income, expenses, and household size.</p>
      <p>Here is a simple guide:</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Your situation</th><th scope="col">Possible savings target</th></tr></thead><tbody>
        <tr><td>Stable income and relatively low expenses</td><td>3 months</td></tr>
        <tr><td>Supporting children or other dependents</td><td>3–6 months</td></tr>
        <tr><td>Irregular or seasonal income</td><td>6 months or more</td></tr>
        <tr><td>Self-employed or financially responsible for several people</td><td>6 months or more</td></tr>
      </tbody></table></div>
      <p>These are planning guidelines, not strict financial requirements.</p>
      <p>If saving three months of expenses feels overwhelming, start with a smaller goal, such as $500 or $1,000.</p>
      <p>You can increase your target as your financial situation improves.</p>
    </section>
    <section className="finance-article-section">
      <h2>Emergency Fund Calculation Example</h2>
      <p>Suppose your essential monthly expenses are $2,000.</p>
      <p>You want enough savings to cover six months without regular income.</p>
      <p>Your target would be:</p>
      <p><strong>$2,000 × 6 = $12,000</strong></p>
      <p>Now assume you've already saved $3,000 and can contribute $300 per month.</p>
      <div className="finance-table-wrap"><table><thead><tr><th scope="col">Savings details</th><th scope="col">Amount</th></tr></thead><tbody>
        <tr><td>Essential monthly expenses</td><td>$2,000</td></tr>
        <tr><td>Emergency coverage target</td><td>6 months</td></tr>
        <tr><td>Recommended emergency fund</td><td>$12,000</td></tr>
        <tr><td>Current savings</td><td>$3,000</td></tr>
        <tr><td>Amount still needed</td><td>$9,000</td></tr>
        <tr><td>Monthly contribution</td><td>$300</td></tr>
        <tr><td>Time to reach your goal</td><td>30 months</td></tr>
      </tbody></table></div>
    </section>
  </>;
}
