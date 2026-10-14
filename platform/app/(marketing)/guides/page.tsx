// /guides — guide index (docs/14 §6.11).
import s from '../../../components/marketing/marketing.module.css';
import { Container, Eyebrow, JsonLd, LastUpdated, Section } from '../../../components/marketing/ui.tsx';
import { loadGuides } from '../../../lib/marketing/guides.ts';
import { breadcrumbs, graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage, formatDay } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/guides');
export const metadata = pageMetadata(PAGE);

export default function GuidesPage() {
  const guides = loadGuides();
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>Guides</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            Practical, honest help for your wedding website: what to include, when to share it, how to word it, and how to set
            a reply-by date that works for your caterer. Useful whichever platform you choose.
          </p>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      <Section>
        <Container>
          <ul className={s.guideGrid}>
            {guides.map((g) => (
              <li key={g.slug} className={s.guideCard}>
                <h2 className={s.h3}>
                  <a href={g.path}>{g.title}</a>
                </h2>
                <p>{g.description}</p>
                <p className={s.guideMeta}>
                  {g.minutes} min read · Updated <time dateTime={g.updated}>{formatDay(g.updated)}</time>
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE),
          itemList(guides.map((g) => ({ path: g.path, name: g.title }))),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
          ]),
        )}
      />
    </>
  );
}
