// /kvkk (G961, decision 7, 2026-10-23): the KVKK notice (Turkey's personal data protection law, art. 10). The body is
// lib/marketing/legal.ts: the Turkish original on /tr/kvkk, the English version on /kvkk and, with a note, on /es, /de and
// /fr (the notice exists in these two languages only). The data controller's legal name and postal address come from
// config `legal`; while they are not decided the page says they are given on request by email (docs/39).
import { MARKETING } from '../../../lib/marketing/config.ts';
import { enT, type Market } from '../../../lib/marketing/i18n.ts';
import { kvkkLang, kvkkMarkdown } from '../../../lib/marketing/legal.ts';
import { parseBlocks } from '../../../lib/marketing/markdown.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Container, Eyebrow, JsonLd, LastUpdated, Prose, Section } from '../ui.tsx';

export function kvkkMetadata(m: Market) {
  return pageMetadata(corePage('/kvkk', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function KvkkPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/kvkk', MARKETING, t);
  const lang = kvkkLang(m.lang);
  // Policy sentences from config in the notice's own language (Turkish dictionary on /tr, English everywhere else).
  const blocks = parseBlocks(kvkkMarkdown(lang, MARKETING, lang === 'tr' ? t : enT));
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>{t('KVKK')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'Our notice under Turkey’s personal data protection law (KVKK, Law No. 6698): who is responsible for your data, what we process and why, where it goes and how to use your rights.',
            )}
          </p>
          <LastUpdated day={PAGE.updated} m={m} />
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <aside className={s.callout} data-kvkk-lang={lang}>
            {m.lang === 'tr' ? (
              <p>
                {t('This notice is also available in English.')}{' '}
                <a href="/kvkk" hrefLang="en" lang="en">
                  English
                </a>
              </p>
            ) : (
              <p>
                {m.lang === 'en'
                  ? t('The Turkish text of this notice is the original; this is its English version.')
                  : t('This notice exists in Turkish, the original, and in English. The English version is shown below.')}{' '}
                <a href="/tr/kvkk" hrefLang="tr" lang="tr">
                  Türkçe
                </a>
              </p>
            )}
          </aside>
          <div lang={lang}>
            <Prose blocks={blocks} m={m} />
          </div>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('KVKK'), path: '/kvkk' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
