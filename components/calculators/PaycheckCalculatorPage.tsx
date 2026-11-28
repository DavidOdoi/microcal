import Link from 'next/link';
import { CalculatorArticlePage, calculatorArticleMetadata } from './CalculatorArticlePage';
import { NationalPaycheckCalculator } from './NationalPaycheckCalculator';

const slug = 'paycheck-calculator';
const description = 'Estimate your US take-home pay for salary or hourly work. See Social Security, Medicare, income-tax withholding, and payroll deductions by pay frequency.';

const stateCalculators = [
  { name: 'California Paycheck Calculator', href: '/calculators/california-paycheck-calculator/' },
  { name: 'Illinois Paycheck Calculator', href: '/calculators/illinois-paycheck-calculator/' },
  { name: 'Idaho Paycheck Calculator', href: '/calculators/idaho-paycheck-calculator/' },
  { name: 'New York Paycheck Calculator', href: '/calculators/new-york-paycheck-calculator/' },
];

const example = [
  ['Gross pay', '$2,884.62'],
  ['Federal annual-tax estimate', '$295.00'],
  ['Entered state withholding', '$100.00'],
  ['Social Security', '$178.85'],
  ['Medicare', '$41.83'],
  ['Estimated take-home pay', '$2,268.94'],
];

export const paycheckMetadata = calculatorArticleMetadata(slug, 'Paycheck Calculator – Estimate US Take-Home Pay', description);

export function PaycheckCalculatorPage() {
  return (
    <CalculatorArticlePage
      slug={slug}
      name="Paycheck Calculator"
      category="taxes"
      categoryName="Taxes"
      description={description}
      intro="Estimate your take-home pay from a salary or hourly wage. Compare weekly, biweekly, semimonthly, and monthly pay after federal payroll taxes and the state, local, and benefit deductions you enter."
      calculator={<NationalPaycheckCalculator />}
      article={<PaycheckSupportingContent />}
    />
  );
}

function PaycheckSupportingContent() {
  return <>
    <section className="finance-article-section" aria-labelledby="paycheck-by-state">
      <h2 id="paycheck-by-state">Paycheck Calculators by State</h2>
      <p>Use the national calculator for any state by entering your state and local withholding from your paystub. These state guides explain local rules and show which deductions the state calculators can estimate directly.</p>
      <ul>{stateCalculators.map(({ name, href }) => <li key={href}><Link href={href}>{name}</Link></li>)}</ul>
    </section>

    <section className="finance-article-section">
      <h2>How to Use the Paycheck Calculator</h2>
      <ol>
        <li><strong>Enter your gross pay.</strong> Choose annual salary, monthly pay, weekly pay, or hourly wage. For hourly pay, enter your regular hours, qualifying overtime, and weeks worked under Advanced settings.</li>
        <li><strong>Choose your pay frequency and payroll year.</strong> Use the schedule your employer uses. A biweekly schedule generally has 26 paychecks, while a semimonthly schedule has 24.</li>
        <li><strong>Set your income-tax withholding.</strong> Enter federal withholding from your paystub or select the annual federal income-tax estimate. Enter any state or local withholding per paycheck.</li>
        <li><strong>Include benefits and other deductions.</strong> Use per-paycheck amounts for health premiums, retirement contributions, and other deductions. For a late-year paycheck or a bonus period, use the prior taxable wages from this employer when applicable.</li>
      </ol>
      <p>If you only know your salary, the <Link href="/calculators/salary-to-hourly-calculator/">Salary to Hourly Calculator</Link> can help you compare an hourly offer with what you earn now.</p>
    </section>

    <section className="finance-article-section">
      <h2>How Take-Home Pay Is Calculated</h2>
      <p>Gross pay is what you earn before deductions. Net or take-home pay is the amount left after payroll taxes, income-tax withholding, and deductions such as health insurance or retirement contributions.</p>
      <p className="finance-formula">Take-home pay = Gross pay − Income taxes − Payroll taxes − Other deductions</p>
      <h3>Federal income tax</h3>
      <p>Federal payroll withholding depends on your wages and elections on Form W-4. Use the entered withholding option to match your paystub. The optional annual estimate uses ordinary federal income-tax brackets, the standard deduction, and any eligible adjustments or credits you enter. It divides the estimated annual amount by your pay frequency.</p>
      <p>For employer withholding methods, see <a href="https://www.irs.gov/publications/p15t">IRS Publication 15-T</a>. For a separate annual calculation, use the <Link href="/calculators/income-tax-calculator/">Federal Income Tax Calculator</Link>.</p>
      <h3>Social Security and Medicare</h3>
      <p>For 2026, employees generally pay 6.2% for Social Security on covered wages up to $184,500 and 1.45% for Medicare. An employer generally withholds another 0.9% for Additional Medicare Tax on covered wages it pays you above $200,000 in a calendar year. The calculator uses year-to-date wages from this employer to show how crossing a threshold affects the current paycheck.</p>
      <p>See the <a href="https://www.irs.gov/publications/p15">IRS Employer’s Tax Guide</a> and the <a href="https://www.ssa.gov/oact/cola/cbb.html">Social Security contribution and benefit base</a> for the rates and year-specific limits.</p>
      <h3>State and local taxes</h3>
      <p>State income-tax withholding can depend on your pay, filing elections, and where you live or work. Some places also have local income tax or separate employee payroll contributions. Enter the state and local income-tax amounts separately, and include any other employee payroll deductions in Advanced settings. A zero amount means the calculation excludes that item.</p>
      <h3>Benefits and retirement contributions</h3>
      <p>Eligible Section 125 health premiums generally reduce the wage base for federal income tax and FICA. Traditional 401(k) contributions generally reduce federal income-tax wages while Social Security and Medicare still apply. Roth 401(k) contributions come out of take-home pay after tax. Use your paystub to check how each deduction is treated.</p>
    </section>

    <section className="finance-article-section">
      <h2>Example Biweekly Paycheck on a $75,000 Salary</h2>
      <p>In this 2026 example, a single filer earns $75,000 over 26 paychecks and enters $100 of state withholding per paycheck. The federal estimate assumes the standard deduction and no additional income or credits. The worker has no pre-tax deductions or local withholding and is below the Social Security and Additional Medicare thresholds.</p>
      <div className="finance-table-wrap"><table>
        <caption>Estimated amounts per biweekly paycheck</caption>
        <thead><tr><th scope="col">Pay or deduction</th><th scope="col">Amount</th></tr></thead>
        <tbody>{example.map(([label, amount]) => <tr key={label}><th scope="row">{label}</th><td>{amount}</td></tr>)}</tbody>
      </table></div>
      <p>For a quick comparison between pay schedules, the calculator also shows what a year or an average month would look like if each paycheck stayed the same. A bonus, a change in benefits, or reaching a payroll tax limit can change the actual amount.</p>
    </section>

    <section className="finance-article-section">
      <h2>Frequently Asked Questions</h2>
      <h3>How do I calculate an hourly paycheck with overtime?</h3>
      <p>Enter your hourly rate and regular weekly hours. If your employer confirms that some hours qualify for time-and-a-half or double time, enter those separately. For example, $25 per hour for 40 regular hours and five hours at time-and-a-half produces $1,187.50 in weekly gross pay before taxes.</p>
      <h3>What’s the difference between biweekly and semimonthly pay?</h3>
      <p>Biweekly pay comes every two weeks, usually for 26 paychecks a year. Semimonthly pay comes twice a month for 24 paychecks. On the same annual salary, each semimonthly gross paycheck is generally larger.</p>
      <h3>Why is my actual paycheck different?</h3>
      <p>Check your W-4, state and local withholding, gross taxable wages, and whether benefits were deducted before or after tax. Your employer may also handle bonuses, tips, or unusual pay periods differently. The <a href="https://www.irs.gov/individuals/tax-withholding-estimator">IRS Tax Withholding Estimator</a> can help you evaluate your federal withholding.</p>
    </section>
  </>;
}
