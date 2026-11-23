import Link from 'next/link';
import styles from './CheckingAccountComparison.module.css';

const accounts = [
  {
    id: 'sofi',
    bank: 'SoFi',
    name: 'Checking and Savings',
    bestFor: 'Online banking with interest',
    monthlyFee: 'No monthly fee',
    interest: 'Earns interest',
    access: 'ATM network, online banking',
    summary: 'SoFi combines checking and savings in one banking experience. It suits people who are paid electronically, pay bills online, and want to move extra cash into a separate savings balance.',
    tradeoff: 'Checking and savings have separate rates. Check which balance qualifies for the advertised rate, and review cash-deposit fees and overdraft eligibility if you use those services.',
    url: 'https://www.sofi.com/banking/',
  },
  {
    id: 'capital-one',
    bank: 'Capital One',
    name: '360 Checking',
    bestFor: 'Low-fee everyday banking',
    monthlyFee: 'No monthly fee',
    interest: 'Earns interest',
    access: 'ATM network, select locations',
    summary: 'Capital One 360 Checking is a practical all-around pick if you want to bank online without having to maintain a minimum balance to avoid a monthly fee. It also offers in-person options in select locations.',
    tradeoff: 'Check which fee-free ATMs, branches, and cash-deposit locations are near you. An ATM operator outside the network may charge a fee.',
    url: 'https://www.capitalone.com/bank/checking-accounts/online-checking-account/',
  },
  {
    id: 'ally',
    bank: 'Ally Bank',
    name: 'Spending Account',
    bestFor: 'ATM fee reimbursements',
    monthlyFee: 'No monthly fee',
    interest: 'Tiered interest',
    access: 'Network ATMs, fee rebates',
    summary: 'Ally suits people who bank online and occasionally need to use a cash machine outside their bank’s network. Eligible ATM reimbursements can matter more than interest for someone who keeps a modest checking balance.',
    tradeoff: 'Reimbursements are capped per statement cycle. Check which ATM transactions qualify, which APY applies to your balance, and how you would deposit cash before switching.',
    url: 'https://www.ally.com/bank/interest-checking-account/',
  },
  {
    id: 'chase',
    bank: 'Chase',
    name: 'Total Checking',
    bestFor: 'Nationwide branch access',
    monthlyFee: 'Waivable fee',
    interest: 'None',
    access: 'Branches and ATMs',
    summary: 'Chase Total Checking is worth comparing if you regularly deposit cash, use branches, or prefer in-person help. It works best when you can meet a waiver condition each month.',
    tradeoff: 'Compare the current waiver rules against your actual electronic deposits or balances. If you expect to miss the waiver, calculate what the fee would cost over a full year.',
    url: 'https://www.chase.com/personal/checking/total-checking',
  },
  {
    id: 'wells-fargo',
    bank: 'Wells Fargo',
    name: 'Everyday Checking',
    bestFor: 'In-person banking and an age-based waiver',
    monthlyFee: 'Waivable fee',
    interest: 'None',
    access: 'Branches and ATMs',
    summary: 'Wells Fargo Everyday Checking is another option if you want branch and ATM access. An age-based waiver may make it worth comparing for eligible younger customers.',
    tradeoff: 'Confirm the age range, account ownership requirements, and the waiver you would use once you no longer qualify. Check local branch hours and out-of-network ATM fees.',
    url: 'https://www.wellsfargo.com/checking/everyday/',
  },
];

const sections = [
  ['compare', 'Compare accounts'],
  ['picks', 'Individual picks'],
  ['how-to-choose', 'How to choose'],
  ['deposit-insurance', 'Deposit insurance'],
  ['how-to-open', 'How to open an account'],
  ['faq', 'FAQs'],
  ['methodology', 'How we compared'],
];

export function CheckingAccountComparison() {
  return (
    <div className={styles.layout}>
      <nav className={styles.contents} aria-label="On this page">
        <strong>On this page</strong>
        <ul>
          {sections.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
        </ul>
      </nav>
      <div className={styles.article}>
        <section className={styles.summary} aria-labelledby="quick-answer">
          <h2 id="quick-answer">Which checking account fits you?</h2>
          <p>Start with <a href="#capital-one">Capital One 360 Checking</a> for low-fee everyday banking or <a href="#sofi">SoFi Checking and Savings</a> if you want online banking and interest. <a href="#ally">Ally</a> stands out for ATM reimbursements. Compare <a href="#chase">Chase</a> and <a href="#wells-fargo">Wells Fargo</a> if you regularly need a branch and can qualify for a fee waiver.</p>
        </section>
        <p className={styles.disclosure}>Links in this guide go to the banks’ official product pages. Review the current terms before applying.</p>

        <section aria-labelledby="compare">
          <h2 id="compare">Compare the five checking accounts</h2>
          <p id="comparison-note">Interest rates can change. Use the bank links in the individual reviews for current checking APYs, fees, and eligibility.</p>
          <div className={styles.tableScroll} role="region" aria-label="Checking account comparison" tabIndex={0}>
            <table className={styles.table} aria-describedby="comparison-note">
              <caption className={styles.srOnly}>Monthly fees, checking interest, and access by account</caption>
              <thead>
                <tr><th scope="col">Account</th><th scope="col">Monthly fee</th><th scope="col">Checking interest</th><th scope="col">Cash access</th></tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <th scope="row"><a href={`#${account.id}`}>{account.bank}</a><span>{account.name}</span></th>
                    <td>{account.monthlyFee}</td><td>{account.interest}</td><td>{account.access}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="picks">
          <h2 id="picks">Which bank is best for your needs?</h2>
          <div className={styles.picks}>
            {accounts.map((account) => (
              <section className={styles.pick} key={account.id} aria-labelledby={account.id}>
                <h3 id={account.id}>{account.bank} {account.name}</h3>
                <p className={styles.fit}>{account.bestFor}</p>
                <p>{account.summary}</p>
                <p><strong>What to check.</strong> {account.tradeoff}</p>
                <a className={styles.bankLink} href={account.url}>See {account.bank} account terms <span aria-hidden="true">↗</span></a>
              </section>
            ))}
          </div>
        </section>

        <section aria-labelledby="how-to-choose">
          <h2 id="how-to-choose">How to choose a checking account</h2>
          <dl className={styles.factors}>
            <div><dt>Start with fees</dt><dd>Multiply any monthly fee by 12 to compare annual costs. A $15 monthly fee costs $180 a year if you never qualify for a waiver.</dd></div>
            <div><dt>Put APY in dollar terms</dt><dd>On $5,000 held for a full year, a hypothetical 0.50% APY earns about $25 and a 0.10% APY earns about $5. If your checking balance is usually lower or you pay fees, the rate matters less. For money you can set aside, estimate potential savings earnings with our <Link href="/savings/high-yield-savings-account-calculator/">High-Yield Savings Account Calculator</Link>.</dd></div>
            <div><dt>Check ATM and branch access</dt><dd>Look up fee-free ATMs near home and work. If you deposit cash or travel often, ask about retail deposit limits, ATM reimbursement caps, and international fees.</dd></div>
            <div><dt>Read the overdraft policy</dt><dd>Check whether the bank will decline transactions, transfer funds from linked savings, or offer coverage if you overspend. Review what qualifies and what each option costs.</dd></div>
            <div><dt>Try the app and check support hours</dt><dd>Look for mobile check deposit, transaction alerts, debit card controls, and a way to reach support when you need it.</dd></div>
          </dl>
        </section>

        <section aria-labelledby="deposit-insurance">
          <h2 id="deposit-insurance">Are online checking accounts safe?</h2>
          <p>FDIC insurance covers eligible deposits if an insured bank fails. The standard limit is $250,000 per depositor, per insured bank, per ownership category. Check the institution in <a href="https://banks.data.fdic.gov/bankfind-suite/bankfind">FDIC BankFind</a> and use multifactor authentication and transaction alerts to protect access to your account.</p>
        </section>

        <section aria-labelledby="how-to-open">
          <h2 id="how-to-open">How to open a checking account</h2>
          <ol>
            <li>Choose an account based on fees, access, and the opening deposit.</li>
            <li>Gather the identification and address information the bank requests.</li>
            <li>Apply through the bank’s website or at a branch.</li>
            <li>Fund the account and set up direct deposit if it fits your needs.</li>
            <li>If you’re switching banks, move automatic payments and check that pending transactions have cleared before closing the old account.</li>
          </ol>
        </section>

        <section aria-labelledby="faq">
          <h2 id="faq">Frequently asked questions</h2>
          <div className={styles.questions}>
            <details><summary>Which bank is best for checking accounts in 2026?</summary><p>Capital One is a strong starting point for everyday use, SoFi for online banking with checking interest, and Ally for eligible ATM fee reimbursements. Chase and Wells Fargo are worth comparing if you use branches and can qualify for a fee waiver.</p></details>
            <details><summary>Which accounts have no monthly maintenance fee?</summary><p>SoFi Checking and Savings, Capital One 360 Checking, and Ally Bank Spending are the no-monthly-maintenance-fee picks in this guide. Check each bank’s fee schedule for other charges that may apply.</p></details>
            <details><summary>Do you need a Social Security number to open an account?</summary><p>Banks verify your identity. Some accept an ITIN, passport, or other permitted documents. Ask your chosen bank which documents it accepts for that account.</p></details>
          </div>
        </section>

        <section className={styles.methodology} aria-labelledby="methodology">
          <h2 id="methodology">How we compared the accounts</h2>
          <p>We compared five U.S. checking accounts for monthly costs, interest on checking balances, cash access, and how customers typically use the account. The picks are based on product information and apply to different needs. This is a desk comparison. Use the linked product disclosures for current terms, and <Link href="/contact/">contact us</Link> if you spot an error.</p>
        </section>
      </div>
    </div>
  );
}
