import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service — MicroFinancePost',
  description: 'Terms for using MicroFinancePost’s free financial calculators and content, including estimates, acceptable use, advertising and affiliate disclosures.',
  alternates: { canonical: 'https://microfinancepost.com/terms-of-service/' },
};

export default function TermsOfServicePage() {
  return <LegalPage title="Terms of Service" intro="Please read these terms before using MicroFinancePost.com and its financial calculators." sections={[
    { id: 'agreement', title: 'Using this website', content: <>
      <p>These Terms of Service govern your use of MicroFinancePost.com (MicroFinancePost, “we,” “us,” or “our”), including its calculators, articles, and other website features. By using the site, you agree to these terms. If you do not agree, discontinue use.</p>
      <p>Our tools are primarily designed for the United States market and use US dollars and US financial or tax assumptions unless a page says otherwise. The site currently offers free calculators without user accounts. We do not accept deposits, process loan applications, execute investments, or prepare or file tax returns through these calculators.</p>
    </> },
    { id: 'educational-use', title: 'Educational information, not professional advice', content: <>
      <p>Calculators and supporting content provide general educational estimates. They are not personalized financial, investment, tax, legal, accounting, or other professional advice. Using this website does not create an adviser-client, fiduciary, or other professional relationship.</p>
      <p>A result is not a loan offer, credit decision, investment recommendation, tax determination, benefit entitlement, or guarantee of savings or returns. Consult a qualified professional and the relevant lender, servicer, employer, tax authority, or government agency when a decision requires advice or an official determination.</p>
    </> },
    { id: 'estimates', title: 'Calculator assumptions and your responsibility', content: <>
      <p>Results depend on the values you enter, the selected tax year, and the assumptions described on each page. Simplifications, rounding, payment timing, lender rules, taxes, fees, market changes, and facts outside the model can cause actual outcomes to differ.</p>
      <p>You are responsible for checking your inputs, reading the calculator’s limitations, and verifying results against current official guidance, statements, contracts, and professional advice before acting. Do not treat an estimate as an exact payoff quote, payroll withholding instruction, filed tax calculation, or prediction of future performance.</p>
      <p>We aim to provide useful and accurate tools, but errors or outdated information may occur. We may correct, revise, suspend, or remove a tool or article. Report a suspected error through our <Link href="/contact/">contact page</Link>, identifying the calculator and a non-sensitive example.</p>
    </> },
    { id: 'permitted-use', title: 'Permitted use and site content', content: <>
      <p>You may use the calculators for lawful personal, educational, or internal business planning and may save or share the results you generate. When sharing results, preserve relevant assumptions and do not present them as official decisions or guaranteed outcomes.</p>
      <p>Our site design, original text, code, and branding are protected by applicable intellectual property laws. Except as permitted by law or with our permission, you may not republish substantial portions of our articles, copy the website for redistribution, or imply that we endorse you. Third-party data, quotations, names, and trademarks remain subject to their owners’ rights. Nothing here limits lawful quotation, fair use, or rights in public-domain material.</p>
    </> },
    { id: 'unacceptable-use', title: 'Acceptable use', content: <>
      <p>Do not use the website to violate the law, infringe others’ rights, distribute malicious code, impersonate someone, attempt unauthorized access, interfere with security, or overload the service. Do not misrepresent a calculator result as a statement issued by a lender, the IRS, the Social Security Administration, or another authority.</p>
      <p>We may restrict access where reasonably necessary to address abuse, protect users or the service, or comply with law.</p>
    </> },
    { id: 'third-parties', title: 'External links, affiliates, and advertising', content: <>
      <p>Links to government agencies, financial providers, and other websites are provided for context or convenience. Those websites have their own terms and privacy practices, and we do not control their availability, accuracy, products, or services. A link does not imply government affiliation or an endorsement of every claim on the destination site.</p>
      <p>We plan to introduce affiliate links and Google AdSense advertising. When a recommendation or link is identified as an affiliate link, we may earn a commission if you take a qualifying action. Affiliate relationships will be disclosed near the relevant recommendation or link. Compensation does not change calculator formulas or guarantee the suitability of a product.</p>
      <p>Advertisements will be distinguished from editorial content. An ad, sponsored placement, or affiliate listing is not a promise of approval, a specific rate, investment performance, or a tax outcome. Verify the provider’s pricing, eligibility rules, disclosures, and contract before signing up. Advertising and affiliate tracking are not active as of the date above.</p>
    </> },
    { id: 'privacy-email', title: 'Privacy, contact messages, and email updates', content: <>
      <p>Our <Link href="/privacy-policy/">Privacy Policy</Link> explains current information handling and our plans for advertising, affiliate links, and email marketing. Calculator entries are processed in your browser and are not submitted to us by the calculators.</p>
      <p>The contact form currently produces an on-screen preview and does not deliver messages. To reach us, use the email address on our contact page. Do not send confidential financial records or account credentials.</p>
      <p>If we launch an email newsletter, signup terms will explain the updates offered. You may unsubscribe from marketing emails using the link included in those messages. Sending us a question does not automatically subscribe you to marketing.</p>
    </> },
    { id: 'availability', title: 'Availability and warranties', content: <>
      <p>To the extent permitted by applicable law, the website and its content are provided “as is” and “as available,” without warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, or uninterrupted operation. We do not guarantee that the site will always be available, free of errors, or compatible with every device.</p>
      <p>We may change features or temporarily interrupt service for maintenance, security, or other operational reasons. This section does not exclude warranties or rights that cannot lawfully be excluded.</p>
    </> },
    { id: 'liability', title: 'Limits on liability', content: <>
      <p>To the extent permitted by applicable law, MicroFinancePost is not liable for indirect, incidental, special, consequential, or punitive losses arising from use of, or inability to use, the website or reliance on an estimate, including lost profits, missed opportunities, or lost data.</p>
      <p>Nothing in these terms excludes or limits liability for fraud, willful misconduct, or any other liability that applicable law does not allow to be excluded or limited. Some jurisdictions do not permit particular limitations, so parts of this section may not apply to you. Your non-waivable consumer rights remain in effect.</p>
    </> },
    { id: 'changes', title: 'Changes to these terms', content: <>
      <p>We may update these terms as the service changes. Revised terms will show a new last-updated date, and material changes will be communicated where required by law. Changes apply prospectively; your use after revised terms take effect is subject to those terms, to the extent permitted by law.</p>
      <p>If a provision is found unenforceable, the remaining provisions continue to apply to the extent legally permitted. A delay in enforcing a provision does not by itself waive it.</p>
    </> },
    { id: 'contact', title: 'Questions and concerns', content: <>
      <p>For questions about these terms or to raise a concern about the website, email <a href="mailto:hello@microfinancepost.com">hello@microfinancepost.com</a> or review the contact channels on our <Link href="/contact/">contact page</Link>.</p>
    </> },
  ]} />;
}
