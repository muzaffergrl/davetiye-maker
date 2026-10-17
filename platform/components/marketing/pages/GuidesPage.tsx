// /guides — guide index (docs/14 §6.11). G144: one body for every language; a guide without a translation is listed
// with its English title and marked as English (hreflang/lang on the link).
import { MARKETING } from '../../../lib/marketing/config.ts';
import { loadGuidesIn } from '../../../lib/marketing/guides.ts';
import type { Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage, formatDay } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, JsonLd, LastUpdated, Section } from '../ui.tsx';

export function guidesMetadata(m: Market) {
  return pageMetadata(corePage('/guides', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function GuidesPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/guides', MARKETING, t);
  const guides = loadGuidesIn(m.lang);
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>{t('Guides')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'Practical, honest help for your wedding website: what to include, when to share it, how to word it, and how to set a reply-by date that works for your caterer. Useful whichever platform you choose.',
            )}
          </p>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      <Section>
        <Container>
          <ul className={s.guideGrid}>
            {guides.map((g) => (
              <li key={g.slug} className={s.guideCard} lang={g.translated ? undefined : 'en'}>
                <h2 className={s.h3}>
                  <a href={m.href(g.path)}>{g.title}</a>
                </h2>
                <p>{g.description}</p>
                <p className={s.guideMeta} lang={m.lang === 'en' ? undefined : m.lang}>
                  {t('{n} min read', { n: g.minutes })} · {t('Updated')} <time dateTime={g.updated}>{formatDay(g.updated, m.lang)}</time>
                  {g.translated ? null : <> · {t('In English')}</>}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          itemList(
            guides.map((g) => ({ path: g.path, name: g.title })),
            MARKETING,
            m,
          ),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Guides'), path: '/guides' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
