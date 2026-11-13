'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Mail, MessageSquare, PencilRuler, Scale } from 'lucide-react';
import { PageHero } from '@/components/site/PageHero';

const channels = [
  { icon: Mail, title: 'General questions', email: 'hello@microfinancepost.com', note: 'We reply within 1–2 business days.' },
  { icon: PencilRuler, title: 'Report a calculation', email: 'corrections@microfinancepost.com', note: 'Tell us the tool and the numbers you expected.' },
  { icon: Scale, title: 'Press & partnerships', email: 'press@microfinancepost.com', note: 'Editorial and business enquiries.' },
];

const faqs = [
  ['Do you sell the information I send?', 'No. Calculators run in your browser and we never store what you enter. Messages are used only to reply to you.'],
  ['Can you give me personal financial advice?', 'Our tools explain the math behind common financial decisions. For advice about your situation, talk to a licensed financial, tax or legal professional.'],
  ['Can I suggest a new calculator?', 'Yes. Tell us what you want to work out and why. Your feedback helps shape our tools.'],
];

export default function ContactPage() {
  useEffect(() => { document.title = 'Contact — MicroFinancePost'; }, []);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to a real person.">
        Questions about a calculator, a number that looks wrong, or an idea for a tool we should build? Send it over.
      </PageHero>
      <div className="container-site contact-layout">
        <section className="contact-panel">
          <h2>Send a message</h2>
          <p>Fields marked with an asterisk are required. We keep replies short and useful.</p>
          {sent ? (
            <div className="contact-success" role="status">
              <CheckCircle2 size={24} />
              <div><strong>Thanks, {name || 'there'} — message noted.</strong><p>This preview does not send email yet, so nothing has left your browser. Once mail is connected, we would reply to {email} within 1–2 business days.</p></div>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>Your name *<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Jordan Smith" /></label>
              <label>Email *<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
              <label>What is this about?<select defaultValue="General question"><option>General question</option><option>Report a calculation</option><option>Press or partnership</option><option>Suggest a calculator</option></select></label>
              <label>Message *<textarea required rows={5} placeholder="Tell us what you need…" /></label>
              <button className="primary-button" type="submit">Send message <ArrowRight size={16} /></button>
            </form>
          )}
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
