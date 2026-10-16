// /designs — gallery (docs/14 §6.2; G066 comp u1_designs_390). Only live designs; the style filter appears from 6
// designs on.
import { StaggeredText } from '../../../components/fx/StaggeredText.tsx';
import { DesignCard } from '../../../components/marketing/DesignCard.tsx';
import s from '../../../components/marketing/marketing.module.css';
import { CheckList, Container, JsonLd, LastUpdated, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { liveDesigns } from '../../../lib/marketing/designs.ts';
import { FIXED, SITE_PAGES } from '../../../lib/marketing/facts.ts';
import { breadcrumbs, graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/designs');
export const metadata = pageMetadata(PAGE);

export default function DesignsPage() {
  const designs = liveDesigns();
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <h1 className={s.h1}>
            <StaggeredText text={PAGE.h1} />
          </h1>
          <p className={s.lead}>
            Every design opens from a sealed envelope and has the same four pages: {SITE_PAGES.map((p) => p.name).join(', ')}.
            Each one has its own envelope, opening, artwork and fonts. Open a live demo on your phone and tap the envelope,
            the way your guests will.
          </p>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className={s.cardGrid}>
            {designs.map((d) => (
              <DesignCard key={d.id} design={d} placement="gallery" headingLevel={2} />
            ))}
          </div>
        </Container>
      </Section>
      <Section band labelledBy="same">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="same" className={s.h2}>
                The same in every design
              </h2>
              <CheckList
                items={[
                  'The envelope opening page, then Home, Our Story, Details and RSVP',
                  'The editing panel, designed for phone screens',
                  'Online RSVP with your own questions, replies and CSV',
                  'Add to calendar, link preview and QR code',
                ]}
              />
            </div>
            <div>
              <h2 className={s.h2}>What makes each one different</h2>
              <CheckList items={['The envelope and how it opens', 'The painted artwork and frames', 'Colors and fonts']} />
              <p className={s.small}>
                {FIXED.join(', ')} stay as designed; you change the content. Not sure which to pick? Read{' '}
                <a href="/guides/what-to-put-on-your-wedding-website">what to put on your wedding website</a> or see{' '}
                <a href="/how-it-works">how it works</a>.
              </p>
            </div>
          </div>
          <TextLink href="/pricing">See pricing</TextLink>
        </Container>
      </Section>
      <JsonLd
        data={graph(
          webPage(PAGE),
          itemList(designs.map((d) => ({ path: `/designs/${d.id}`, name: d.name }))),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Designs', path: '/designs' },
          ]),
        )}
      />
    </>
  );
}
