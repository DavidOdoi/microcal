import Link from 'next/link';
import { Mail, MessageSquare, PencilRuler, Scale } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';

const channels = [
  { icon: Mail, title: 'General questions', email: 'hello@microfinancepost.com', note: 'Ask about our calculators or suggest a new tool.' },
  { icon: PencilRuler, title: 'Report an error', email: 'corrections@microfinancepost.com', note: 'Tell us which calculator or article needs a correction.' },
  { icon: Scale, title: 'Press & partnerships', email: 'press@microfinancepost.com', note: 'Editorial and business enquiries.' },
];

const faqs = [
  ['Do you sell the information I send?', 'We do not currently sell personal information. Calculator entries stay in your browser. If you email us, we use your message to respond and handle relevant follow-up; this does not subscribe you to marketing.'],
  ['Can you give me personal financial advice?', 'Our tools explain the math behind common financial decisions. For advice about your situation, talk to a licensed financial, tax or legal professional.'],
  ['Can I suggest a new calculator?', 'Yes. Tell us what you want to work out and why. Your feedback helps shape our tools.'],
];

export const metadata = {
  title: 'Contact MicroFinancePost — Questions & Corrections',
  description: 'Contact MicroFinancePost to ask a question, report a calculator or article error, or suggest a new personal finance tool.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to a real person.">
        Questions about a calculator, a number that looks wrong, or an idea for a tool we should build? Send it over.
      </PageHero>
      <div className="container-site contact-layout">
        <section className="contact-panel">
          <h2>Email us</h2>
          <p>For a calculator or article correction, include the page URL, the inputs or text you checked, and the result you expected. Leave out personal financial details.</p>
          <a href="mailto:corrections@microfinancepost.com" className="primary-button"><Mail size={16} aria-hidden="true" /> Report an error</a>
          <p>For general questions, email <a href="mailto:hello@microfinancepost.com">hello@microfinancepost.com</a>. See our <Link href="/privacy-policy/">Privacy Policy</Link> for how we handle messages.</p>
        </section>
        <aside className="contact-side">
          {channels.map(({ icon: Icon, title, email: address, note }) => (
            <div className="contact-channel" key={title}><Icon size={20} /><h3>{title}</h3><a href={`mailto:${address}`}>{address}</a><p>{note}</p></div>
          ))}
          <div className="contact-browse"><MessageSquare size={20} /><h3>Prefer to look it up first?</h3><p>Most answers are already in the directory or the topic guides.</p><Link href="/calculators" className="primary-button">Browse calculators</Link></div>
        </aside>
      </div>
      <section className="contact-faq"><div className="container-site narrow-content"><p className="eyebrow">Before you write</p><h2>Quick answers</h2>{faqs.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>
    </>
  );
}
