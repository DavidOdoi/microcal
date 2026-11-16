import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — MicroFinancePost',
  description: 'How MicroFinancePost handles calculator inputs, website visits and email, plus our plans for affiliate links, Google AdSense and email marketing.',
  alternates: { canonical: 'https://microfinancepost.com/privacy-policy/' },
};

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" intro="How we handle information when you use MicroFinancePost.com, our financial calculators, and our contact channels." sections={[
    { id: 'scope', title: 'Who we are and what this policy covers', content: <>
      <p>This Privacy Policy applies to MicroFinancePost.com (MicroFinancePost, “we,” “us,” or “our”). We provide educational financial calculators and supporting information, primarily for a United States audience. For privacy questions, email <a href="mailto:hello@microfinancepost.com">hello@microfinancepost.com</a>.</p>
      <p>At the date above, we do not operate user accounts, an email marketing subscription service, Google AdSense advertising, or analytics or affiliate-tracking tools. We plan to introduce affiliate links, AdSense, and email marketing. The sections below distinguish current practices from those planned features.</p>
    </> },
    { id: 'calculator-inputs', title: 'Calculator inputs and results', content: <>
      <p>Our calculators process the values you enter in your browser. We do not send those values or results to our servers, maintain calculator-input records, or require you to provide a name or email address to calculate an estimate. Current calculators do not save your entries in cookies or browser local storage.</p>
      <p>If you copy, download, print, email, or share a result, that copy is controlled by you and the services you choose. Avoid entering Social Security numbers, account credentials, bank account numbers, or other identifying information into calculator fields.</p>
    </> },
    { id: 'visits-search', title: 'Website visits and search', content: <>
      <p>Our hosting provider, Vercel, may process technical information needed to deliver and protect the website, such as IP addresses, request URLs, browser or device details, timestamps, and error or security logs. These requests are separate from the financial values entered into a calculator.</p>
      <p>Site search puts your search phrase in the page URL. URLs may appear in browser history and hosting request logs. Do not include private financial or identifying information in search phrases.</p>
    </> },
    { id: 'contact', title: 'Messages you send us', content: <>
      <p>If you email us, we receive your email address, the contents of your message, and any information or attachments you choose to include. We use this information to respond, investigate reported problems, and maintain relevant correspondence. We do not automatically add people who contact us to a marketing list.</p>
      <p>The form on our <Link href="/contact/">contact page</Link> currently provides an on-screen preview only; it does not deliver a message. Use the email address listed on that page if you need to reach us. Do not send passwords, full account numbers, Social Security numbers, or tax-return documents.</p>
    </> },
    { id: 'providers-cookies', title: 'Service providers, fonts, and cookies', content: <>
      <p>We use Vercel to host the site and Google Fonts to deliver a display font. Loading externally hosted fonts sends a request from your browser to Google, which can include your IP address, browser details, and referrer information according to your browser settings.</p>
      <p>We do not currently use analytics, advertising, or affiliate-tracking cookies on this site. Hosting and service providers may process information for delivery, fraud prevention, and security under their own policies. See <a href="https://vercel.com/legal/privacy-policy">Vercel’s Privacy Policy</a>, <a href="https://developers.google.com/fonts/faq/privacy">Google Fonts’ privacy information</a>, and <a href="https://policies.google.com/privacy">Google’s Privacy Policy</a>.</p>
      <p>You can manage cookies and site storage in your browser. Blocking third-party requests may affect fonts or other features. We do not currently use tracking that changes based on a Do Not Track browser signal.</p>
    </> },
    { id: 'affiliates', title: 'Affiliate links and partner websites — planned', content: <>
      <p>We plan to include affiliate links to relevant products or services. When these links are introduced, a clear disclosure near the recommendation or link will explain that we may earn a commission if you click, apply, sign up, or make a purchase. A policy-page disclosure alone does not replace that notice.</p>
      <p>An affiliate link may contain a referral identifier. After you follow it, the partner or affiliate network may receive information about the referral and may use cookies or similar technologies to attribute a transaction. We do not send your calculator entries to partners. The partner’s privacy policy governs information you provide on its site.</p>
      <p>Before activating affiliate tracking on our own pages, we will describe the actual tracking practices and provide any choices or consent required by applicable law.</p>
    </> },
    { id: 'advertising', title: 'Google AdSense advertising — planned', content: <>
      <p>We plan to display advertising through Google AdSense, but AdSense is not active on the site as of this policy’s last update. Once enabled, Google and its advertising partners may use cookies, device identifiers, IP addresses, and similar technologies to deliver ads, limit repeated ads, measure performance, and prevent fraud. Depending on consent, settings, and applicable law, ads may be personalized using visits to this and other websites.</p>
      <p>Non-personalized ads may still use technologies for purposes such as fraud prevention and measurement. Read <a href="https://policies.google.com/technologies/partner-sites">how Google uses information from sites that use its services</a> and <a href="https://policies.google.com/technologies/ads">Google’s advertising information</a>. Google provides personalized-ad controls through <a href="https://myadcenter.google.com/">My Ad Center</a>.</p>
      <p>Before advertising starts, we will update this policy to reflect the configuration in use and provide the consent and opt-out controls required for visitors in relevant locations. Advertising-related disclosures here do not mean that a consent or opt-out mechanism is already operating.</p>
    </> },
    { id: 'email-marketing', title: 'Email newsletters and marketing — planned', content: <>
      <p>We plan to offer email updates. There is no newsletter signup service currently active on this site. When subscriptions become available, we will explain what you are signing up for and collect the email address and any optional information you choose to provide. We will identify the email service provider in this policy before using it.</p>
      <p>Subscription information will be used to deliver the updates you request and manage your preferences. Marketing emails will identify the sender and include an unsubscribe option. Unsubscribing will stop marketing messages; we may retain a limited suppression record to respect your choice and may still respond to a separate request you send us.</p>
      <p>If we introduce email open or click measurement, we will disclose it before use and explain available choices. We do not currently track newsletter engagement or sell email lists.</p>
    </> },
    { id: 'sharing-retention', title: 'Sharing, retention, and security', content: <>
      <p>We do not currently sell personal information or share it for cross-context behavioral advertising. Once advertising or tracking is introduced, some disclosures to advertising providers may qualify as a “sale,” “sharing,” or targeted advertising under certain state laws, even without a direct payment for data. We will update the policy and provide applicable controls before that processing starts.</p>
      <p>Information may be processed by providers helping us host the site or handle correspondence. We may disclose information when reasonably necessary to comply with law, respond to valid legal process, protect rights and safety, or investigate misuse.</p>
      <p>We keep correspondence only as reasonably needed for its purpose, relevant follow-up, and legal or security needs. Hosting and email providers have their own retention practices. We do not maintain a database of calculator entries. Information may be processed in the United States or other locations where our providers operate.</p>
      <p>We use reasonable safeguards appropriate to the information handled, but no website, transmission, or storage method can be guaranteed completely secure.</p>
    </> },
    { id: 'privacy-choices', title: 'Your choices and privacy requests', content: <>
      <p>You can use the calculators without an account, limit the information you email us, manage browser storage, and review the policies of websites you visit through our links. Where applicable law grants rights, you may request access, correction, deletion, or a copy of personal information, or object to or opt out of certain processing. Rights and exceptions depend on your location and the law that applies.</p>
      <p>Send requests to <a href="mailto:hello@microfinancepost.com">hello@microfinancepost.com</a>. We may need proportionate information to verify a request and will respond as required by applicable law. If a privacy-request appeal is available under your state’s law, you may use the same address to request a review. We will not discriminate against you for exercising applicable privacy rights.</p>
    </> },
    { id: 'children-changes', title: 'Children and policy updates', content: <>
      <p>This site is intended for a general audience and is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information to us, contact us so we can investigate and address it.</p>
      <p>We will revise this policy when our practices change and update the date above. Material changes will be communicated as required by law. See our <Link href="/terms-of-service/">Terms of Service</Link> for the rules governing use of the website.</p>
    </> },
  ]} />;
}
