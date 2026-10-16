// /guides/<slug> — one guide (docs/14 §6.12): quick answer, body, FAQ, one soft call to action, Article JSON-LD.
import { notFound } from 'next/navigation';
import s from '../../../../components/marketing/marketing.module.css';
import { Breadcrumbs, Container, Eyebrow, JsonLd, Prose, Section, TextLink } from '../../../../components/marketing/ui.tsx';
import { liveDesigns } from '../../../../lib/marketing/designs.ts';
import { loadGuide, loadGuides } from '../../../../lib/marketing/guides.ts';
import { article, breadcrumbs, graph } from '../../../../lib/marketing/schema.ts';
import { DEFAULT_OG, pageMetadata } from '../../../../lib/marketing/seo.ts';
import { formatDay } from '../../../../lib/marketing/site.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return loadGuides().map((g) => ({ guide: g.slug }));
}

type Props = { params: Promise<{ guide: string }> };

function ogFor(cover: string | null, alt: string) {
  // Guide covers (GPT MK12–MK17) are cropped to 1200×630 once they exist; until then the default share image.
  return cover ? { url: cover, width: 1200, height: 630, alt } : DEFAULT_OG;
}

export async function generateMetadata({ params }: Props) {
  const { guide } = await params;
  const g = loadGuide(guide);
  if (!g) return {};
  return pageMetadata(
    { path: g.path, title: g.title, description: g.description },
    { type: 'article', published: g.published, modified: g.updated, image: ogFor(g.cover, g.coverAlt) },
  );
}

export default async function GuidePage({ params }: Props) {
  const { guide } = await params;
  const g = loadGuide(guide);
  if (!g) notFound();
  const others = loadGuides().filter((x) => x.slug !== g.slug);
  const designs = liveDesigns();
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'Guides', href: '/guides' },
              { name: g.title, href: g.path },
            ]}
          />
          <Eyebrow>Guide · {g.minutes} min read</Eyebrow>
          <h1 className={s.h1Article}>{g.title}</h1>
          <p className={s.lead}>{g.description}</p>
          <p className={s.updated}>
            Updated <time dateTime={g.updated}>{formatDay(g.updated)}</time> · Reviewed{' '}
            <time dateTime={g.reviewed}>{formatDay(g.reviewed)}</time>
          </p>
          <aside className={s.quickAnswer} aria-label="Quick answer">
            <p className={s.quickLabel}>Quick answer</p>
            <p>{g.quickAnswer}</p>
          </aside>
        </Container>
      </Section>
      <Section className={s.articleSection}>
        <Container narrow>
          <article>
            <Prose blocks={g.blocks} />
          </article>
          <aside className={s.softCta} aria-labelledby="soft-cta">
            <h2 id="soft-cta" className={s.h3}>
              See how it looks
            </h2>
            <p>
              Our wedding websites open from a sealed envelope or keepsake and are edited from your phone. Open a live demo:{' '}
              {designs.map((d, i) => (
                <span key={d.id}>
                  {i ? ' or ' : ''}
                  <a href={`/designs/${d.id}`} data-demo={d.id} data-demo-placement={`guide-${g.slug}`} data-track="guide_cta" data-track-guide={g.slug}>
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
                More guides
              </h2>
              <ul className={s.linkList}>
                {others.slice(0, 3).map((o) => (
                  <li key={o.slug}>
                    <a href={o.path}>{o.title}</a>
                  </li>
                ))}
              </ul>
              <TextLink href="/guides">All guides</TextLink>
            </nav>
          ) : null}
        </Container>
      </Section>
      <JsonLd
        data={graph(
          article(g, undefined, g.cover ?? DEFAULT_OG.url),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: g.title, path: g.path },
          ]),
        )}
      />
    </>
  );
}
