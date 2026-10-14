// /faq (docs/14 §6.7). FAQPage JSON-LD mirrors the visible text exactly (no rich result in Google since May 2026;
// other engines can still read it).
import s from '../../../components/marketing/marketing.module.css';
import { Container, Eyebrow, FaqList, JsonLd, LastUpdated, Section } from '../../../components/marketing/ui.tsx';
import { faqGroups } from '../../../lib/marketing/faq.ts';
import { breadcrumbs, faqEntities, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/faq');
export const metadata = pageMetadata(PAGE);

export default function FaqPage() {
  const groups = faqGroups();
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>FAQ</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            Short answers about buying on Etsy, editing from your phone, guest replies, sharing, privacy and how long your
            website stays online. Tap a question to open the answer.
          </p>
          <nav aria-label="Topics" className={s.toc}>
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.title}</a>
                </li>
              ))}
            </ul>
          </nav>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      {groups.map((g, i) => (
        <Section key={g.id} id={g.id} band={i % 2 === 0} labelledBy={`${g.id}-title`} className={s.faqSection}>
          <Container narrow>
            <h2 id={`${g.id}-title`} className={s.h2}>
              {g.title}
            </h2>
            <FaqList items={g.items} />
          </Container>
        </Section>
      ))}
      <JsonLd
        data={graph(
          webPage(PAGE, undefined, { mainEntity: faqEntities(groups.flatMap((g) => g.items)) }),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
        )}
      />
    </>
  );
}
