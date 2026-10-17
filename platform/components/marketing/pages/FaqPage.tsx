// /faq (docs/14 §6.7). FAQPage JSON-LD mirrors the visible text exactly (no rich result in Google since May 2026;
// other engines can still read it). G144: one body for every language.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { faqGroups } from '../../../lib/marketing/faq.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, faqEntities, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, FaqList, JsonLd, LastUpdated, Section } from '../ui.tsx';

export function faqMetadata(m: Market) {
  return pageMetadata(corePage('/faq', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function FaqPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/faq', MARKETING, t);
  const groups = faqGroups(MARKETING, t);
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>{t('FAQ')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'Short answers about buying on Etsy, editing from your phone, guest replies, sharing, privacy and how long your website stays online. Tap a question to open the answer.',
            )}
          </p>
          <nav aria-label={t('Topics')} className={s.toc}>
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      {groups.map((g, i) => (
        <Section key={g.id} id={g.id} band={i % 2 === 0} labelledBy={`${g.id}-title`} className={s.faqSection}>
          <Container narrow>
            <h2 id={`${g.id}-title`} className={s.h2}>
              {g.title}
            </h2>
            <FaqList items={g.items} m={m} />
          </Container>
        </Section>
      ))}
      <JsonLd
        data={graph(
          webPage(PAGE, undefined, { mainEntity: faqEntities(groups.flatMap((g) => g.items)) }, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('FAQ'), path: '/faq' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
