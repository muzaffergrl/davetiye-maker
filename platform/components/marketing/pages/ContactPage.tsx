// /contact (docs/14 §6.9). No form: there is no email provider yet, and a fake form is never built.
// G144: one body for every language.
import { Mail, ShieldCheck } from 'lucide-react';
import { MARKETING } from '../../../lib/marketing/config.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { real } from '../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Section, TextLink } from '../ui.tsx';

export function contactMetadata(m: Market) {
  return pageMetadata(corePage('/contact', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function ContactPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/contact', MARKETING, t);
  const cfg = MARKETING;
  const email = real(cfg.support.email);
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>{t('Contact')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>{t('Questions about a design, your order or your wedding website? Email us and we will help.')}</p>
          <div className={s.contactCard}>
            <Mail aria-hidden size={24} strokeWidth={1.5} />
            <div>
              <p className={s.contactLabel}>{t('Email')}</p>
              {email ? (
                <a className={s.contactEmail} href={`mailto:${email}`} data-track="contact_email_click">
                  {/* a narrow phone breaks it after the @ ("name@" / "gmail.com"), never inside the domain */}
                  {email.includes('@') ? (
                    <>
                      {email.slice(0, email.indexOf('@') + 1)}
                      <wbr />
                      {email.slice(email.indexOf('@') + 1)}
                    </>
                  ) : (
                    email
                  )}
                </a>
              ) : (
                <p className={s.contactEmail}>{cfg.support.email}</p>
              )}
              <p className={s.small}>{t('We reply within {time}.', { time: t(cfg.support.responseTime) })}</p>
            </div>
          </div>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      <Section band labelledBy="include">
        <Container narrow>
          <h2 id="include" className={s.h2}>
            {t('Help us answer in one message')}
          </h2>
          <CheckList
            items={[
              t('Your Etsy order number'),
              t('Your website address (for example, the part after our domain: /clara-and-julian)'),
              t('What you expected and what happened; a screenshot helps'),
              t('Your wedding date, if something is urgent'),
            ]}
          />
          <aside className={s.callout}>
            <p>
              <ShieldCheck aria-hidden size={18} strokeWidth={1.75} /> <strong>{t('We will never ask for your edit link.')}</strong>{' '}
              {t('Do not send it to anyone, including us.')}
            </p>
          </aside>
          <p>
            {t('For questions about an Etsy order you can also message {shop} on Etsy. Answers to common questions are in the', {
              shop: cfg.etsy.shopName,
            })}{' '}
            <a href={m.href('/faq')}>{t('FAQ')}</a>
            {t(', and every step is explained in')} <a href={m.href('/how-it-works')}>{t('how it works')}</a>.
          </p>
          <TextLink href={m.href('/faq')}>{t('Read the FAQ')}</TextLink>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Contact'), path: '/contact' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
