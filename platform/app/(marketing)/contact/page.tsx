// /contact (docs/14 §6.9). No form: there is no email provider yet, and a fake form is never built.
import { Mail, ShieldCheck } from 'lucide-react';
import s from '../../../components/marketing/marketing.module.css';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { real } from '../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/contact');
export const metadata = pageMetadata(PAGE);

export default function ContactPage() {
  const cfg = MARKETING;
  const email = real(cfg.support.email);
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>Contact</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>Questions about a design, your order or your wedding website? Email us and we will help.</p>
          <div className={s.contactCard}>
            <Mail aria-hidden size={24} strokeWidth={1.5} />
            <div>
              <p className={s.contactLabel}>Email</p>
              {email ? (
                <a className={s.contactEmail} href={`mailto:${email}`} data-track="contact_email_click">
                  {email}
                </a>
              ) : (
                <p className={s.contactEmail}>{cfg.support.email}</p>
              )}
              <p className={s.small}>We reply within {cfg.support.responseTime}.</p>
            </div>
          </div>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      <Section band labelledBy="include">
        <Container narrow>
          <h2 id="include" className={s.h2}>
            Help us answer in one message
          </h2>
          <CheckList
            items={[
              'Your Etsy order number',
              'Your website address (for example, the part after our domain: /clara-and-julian)',
              'What you expected and what happened; a screenshot helps',
              'Your wedding date, if something is urgent',
            ]}
          />
          <aside className={s.callout}>
            <p>
              <ShieldCheck aria-hidden size={18} strokeWidth={1.75} /> <strong>We will never ask for your edit link.</strong> Do not
              send it to anyone, including us.
            </p>
          </aside>
          <p>
            For questions about an Etsy order you can also message {cfg.etsy.shopName} on Etsy. Answers to common questions are
            in the <a href="/faq">FAQ</a>, and every step is explained in <a href="/how-it-works">how it works</a>.
          </p>
          <TextLink href="/faq">Read the FAQ</TextLink>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
          ]),
        )}
      />
    </>
  );
}
