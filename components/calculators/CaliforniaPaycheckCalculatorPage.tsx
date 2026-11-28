import Link from 'next/link';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { NationalPaycheckCalculator } from './NationalPaycheckCalculator';

const slug = 'california-paycheck-calculator';
const description = 'Estimate 2026 California take-home pay using federal withholding, California income tax, and SDI from your paystub. Calculate Social Security and Medicare.';
const example = [
  ['Gross pay', '$3,076.92'],
  ['Federal withholding entered', '$300.00'],
  ['California income-tax withholding entered', '$125.00'],
  ['California SDI entered', '$40.00'],
  ['Social Security calculated', '$190.77'],
  ['Medicare calculated', '$44.62'],
  ['Estimated take-home pay', '$2,376.53'],
];

export const californiaPaycheckMetadata = calculatorArticleMetadata(slug, 'California Paycheck Calculator 2026 – Take-Home Pay', description);

export function CaliforniaPaycheckCalculatorPage() {
  return <CalculatorArticlePage
    slug={slug}
    name="California Paycheck Calculator"
    category="taxes"
    categoryName="Taxes"
    description={description}
    intro="Use your paystub to estimate your California take-home pay for 2026. Enter federal withholding, California withholding, and state disability insurance. The calculator estimates Social Security and Medicare from the wages you provide."
    calculator={<NationalPaycheckCalculator californiaPaystub />}
    article={<CaliforniaPaycheckSupportingContent />}
  />;
}

function CaliforniaPaycheckSupportingContent() {
  return <>
    <section className="finance-article-section">
      <h2>How to Use the California Paycheck Calculator</h2>
      <p>Use a recent paystub to compare gross pay and take-home pay. Choose the pay schedule shown on your stub. Enter your annual salary or hourly wage as labeled. For hourly pay, include regular hours and eligible overtime under Advanced settings in the Earnings tab.</p>
      <ol>
        <li>Under Federal Taxes, enter the full federal income tax withheld from that paycheck.</li>
        <li>Under State and Local Taxes, enter California income-tax withholding and the amount labeled CA SDI or CASDI. Enter zero for any of those lines with no withholding.</li>
        <li>Under Benefits, enter applicable health premiums, retirement contributions, and other deductions. Enter each deduction once.</li>
        <li>Select Calculate Paycheck to see how Social Security, Medicare, entered withholding, and benefits affect estimated net pay.</li>
      </ol>
      <p>If you are near a federal payroll tax threshold, enter prior year-to-date Social Security and Medicare wages from the same employer in Advanced settings under Federal Taxes.</p>
    </section>
    <section className="finance-article-section">
      <h2>California Paycheck Taxes in 2026</h2>
      <p>Federal and California income-tax withholding depend on wages and the elections you give your employer. Those elections can differ between federal Form W-4 and California Form DE 4. This tool uses the dollar amounts already shown on your paystub, so updating your filing elections requires entering the new withholding amounts once they appear.</p>
      <p>California’s <a href="https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/">Employment Development Department</a> publishes withholding and contribution guidance. Refer to <a href="https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de4.pdf">California Form DE 4</a> for state withholding elections and <a href="https://www.irs.gov/publications/p15t">IRS Publication 15-T</a> for federal withholding procedures.</p>
      <h3>Social Security and Medicare</h3>
      <p>The calculator uses 2026 employee payroll rules to estimate these deductions from the modeled taxable wages. For the standard rates and limits used in the estimate, see the <a href="https://www.irs.gov/publications/p15">IRS Employer’s Tax Guide</a> and the <a href="https://www.ssa.gov/oact/cola/cbb.html">Social Security wage base</a>. If your employer has already paid you wages this year, use the year-to-date amounts before the paycheck you’re modeling.</p>
      <h3>California State Disability Insurance</h3>
      <p>California State Disability Insurance is a separate deduction from California income tax. Use the amount on your paystub as shown. Some workers have a voluntary disability plan deduction instead. Enter that amount under other deductions and use zero for SDI if the stub shows no separate SDI contribution. For program details, see the <a href="https://edd.ca.gov/en/disability/">California Disability Insurance program</a>.</p>
    </section>
    <section className="finance-article-section">
      <h2>California Paycheck Example: $80,000 Salary</h2>
      <p>Suppose you earn $80,000 across 26 biweekly paychecks, have no benefit deductions, and are below the federal wage thresholds. Enter the illustrative federal, California, and SDI amounts below. In your own calculation, replace them with the actual amounts from your paystub.</p>
      <div className="finance-table-wrap"><table>
        <caption>Example biweekly paycheck using entered withholding</caption>
        <thead><tr><th scope="col">Item</th><th scope="col">Amount</th></tr></thead>
        <tbody>{example.map(([label, amount]) => <tr key={label}><th scope="row">{label}</th><td>{amount}</td></tr>)}</tbody>
      </table></div>
      <p>This example shows one paycheck. The monthly and annual projections assume each paycheck stays the same. A change in withholding, overtime, or reaching a payroll tax limit can change later paychecks.</p>
    </section>
    <section className="finance-article-section">
      <h2>California Hourly Pay and Overtime</h2>
      <p>Enter your regular hours, time-and-a-half hours and double-time hours separately. For example, $28 per hour for 40 regular hours and four qualifying hours at time-and-a-half gives $1,288 in weekly gross pay. Use your employer’s time records to determine qualifying hours and consult the <a href="https://www.dir.ca.gov/dlse/faq_overtime.htm">California overtime guidance</a> for details.</p>
      <p>When comparing jobs listed with different pay units, use the <Link href="/calculators/salary-to-hourly-calculator/">Salary to Hourly Calculator</Link> to compare gross rates first.</p>
    </section>
    <section className="finance-article-section">
      <h2>Frequently Asked Questions</h2>
      <h3>How much is taken out of a paycheck in California?</h3>
      <p>It depends on your gross wages, income-tax withholding, Social Security, Medicare, disability deductions and benefits. The calculator itemizes the inputs and estimates so you can compare them with your paystub.</p>
      <h3>Where do I find California withholding and SDI?</h3>
      <p>Look for California income tax in the tax section of your paystub. State Disability Insurance is often labeled CA SDI or CASDI. Both fields use the dollar amount for the current pay period instead of the year-to-date total.</p>
      <h3>Why does my California paycheck differ from the calculator?</h3>
      <p>Your employer may use different taxable wage amounts, rounding rules, benefit deductions, or year-to-date figures. Check that each amount comes from the same pay period and appears only once in the calculator.</p>
    </section>
    <section className="finance-article-section">
      <h2>Related Paycheck Calculators</h2>
      <ul>
        <li><Link href="/calculators/paycheck-calculator/">US Paycheck Calculator and state directory</Link></li>
        <li><Link href="/calculators/idaho-paycheck-calculator/">Idaho Paycheck Calculator</Link></li>
        <li><Link href="/calculators/new-york-paycheck-calculator/">New York Paycheck Calculator</Link></li>
      </ul>
    </section>
  </>;
}
