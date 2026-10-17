// /guides/<slug> — one guide (docs/14 §6.12): quick answer, body, FAQ, one soft call to action, Article JSON-LD.
// G144: one body for every language. The article is content/guides/<lang>/<slug>.md when it exists; otherwise the
// English article is shown (marked lang="en") under a short notice in the page language.
import { notFound } from 'next/navigation';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns } from '../../../lib/marketing/designs.ts';
import { loadGuideIn, loadGuides, loadGuidesIn } from '../../../lib/marketing/guides.ts';
import { DEFAULT_LANG, type Market } from '../../../lib/marketing/i18n.ts';
import { article, breadcrumbs, graph } from '../../../lib/marketing/schema.ts';
import { DEFAULT_OG, pageMetadata } from '../../../lib/marketing/seo.ts';
import { formatDay } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { Breadcrumbs, Container, Eyebrow, JsonLd, Prose, Section, TextLink } from '../ui.tsx';

export function guideStaticParams() {
  return loadGuides().map((g) => ({ guide: g.slug }));
}

function ogFor(cover: string | null, alt: string) {
  // Guide covers (GPT MK12–MK17) are cropped to 1200×630 once they exist; until then the default share image.
  return cover ? { url: cover, width: 1200, height: 630, alt } : undefined;
}

export function guideMetadata(slug: string, m: Market) {
  const g = loadGuideIn(slug, m.lang);
  if (!g) return {};
  return pageMetadata(
    { path: g.path, title: g.title, description: g.description },
    { type: 'article', published: g.published, modified: g.updated, image: ogFor(g.cover, g.coverAlt), lang: m.lang, t: m.t },
  );
}

export function GuidePage({ slug, m }: { slug: string; m: Market }) {
  const { t } = m;
  const g = loadGuideIn(slug, m.lang);
  if (!g) notFound();
  const others = loadGuidesIn(m.lang).filter((x) => x.slug !== g.slug);
  const designs = liveDesigns();
  // the article's own language (English when it has no translation yet)
  const textLang = g.translated ? m.lang : DEFAULT_LANG;
  const en = textLang !== m.lang ? 'en' : undefined;
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Breadcrumbs
            m={m}
            items={[
              { name: t('Home'), href: m.href('/') },
              { name: t('Guides'), href: m.href('/guides') },
              { name: g.title, href: m.href(g.path) },
            ]}
          />
          <Eyebrow>{t('Guide · {n} min read', { n: g.minutes })}</Eyebrow>
          {g.translated ? null : (
            <p className={s.callout} data-guide-english="">
              {t('This guide is available in English.')}
            </p>
          )}
          <h1 className={s.h1Article} lang={en}>
            {g.title}
          </h1>
          <p className={s.lead} lang={en}>
            {g.description}
          </p>
          <p className={s.updated}>
            {t('Updated')} <time dateTime={g.updated}>{formatDay(g.updated, m.lang)}</time> · {t('Reviewed')}{' '}
            <time dateTime={g.reviewed}>{formatDay(g.reviewed, m.lang)}</time>
          </p>
          <aside className={s.quickAnswer} aria-label={t('Quick answer')}>
            <p className={s.quickLabel}>{t('Quick answer')}</p>
            <p lang={en}>{g.quickAnswer}</p>
          </aside>
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <article lang={en}>
            <Prose blocks={g.blocks} m={m} />
          </article>
          <aside className={s.softCta} aria-labelledby="soft-cta">
            <h2 id="soft-cta" className={s.h3}>
              {t('See how it looks')}
            </h2>
            <p>
              {t('Our wedding websites open from a sealed envelope or keepsake and are edited from your phone. Open a live demo:')}{' '}
              {designs.map((d, i) => (
                <span key={d.id}>
                  {i ? ` ${t('or')} ` : ''}
                  <a
                    href={m.href(`/designs/${d.id}`)}
                    data-demo={d.id}
                    data-demo-placement={`guide-${g.slug}`}
                    data-track="guide_cta"
                    data-track-guide={g.slug}
                  >
                    {d.name}
                  </a>
                </span>
              ))}
              .
            </p>
          </aside>
          {others.length ? (
            <nav aria-labelledby="more-guides" className={s.moreGuides}>
              <h2 id="more-guides" className={s.h3}>
                {t('More guides')}
              </h2>
              <ul className={s.linkList}>
                {others.slice(0, 3).map((o) => (
                  <li key={o.slug} lang={o.translated || m.lang === DEFAULT_LANG ? undefined : 'en'}>
                    <a href={m.href(o.path)}>{o.title}</a>
                  </li>
                ))}
              </ul>
              <TextLink href={m.href('/guides')}>{t('All guides')}</TextLink>
            </nav>
          ) : null}
        </Container>
      </Section>
      <JsonLd
        data={graph(
          article(g, undefined, g.cover ?? DEFAULT_OG.url, m, textLang),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Guides'), path: '/guides' },
              { name: g.title, path: g.path },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
