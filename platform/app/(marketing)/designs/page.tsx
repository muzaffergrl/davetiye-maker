// /designs — gallery (docs/14 §6.2; G066 comp u1_designs_390). Only live designs. G121 (docs/18 §5 P2): the style filter
// appears from 6 designs on — radio chips and CSS only (:has), so it works without JavaScript and never writes the URL;
// "All" is the default and shows every card.
import { DesignCard } from '../../../components/marketing/DesignCard.tsx';
import s from '../../../components/marketing/marketing.module.css';
import { CheckList, Container, JsonLd, LastUpdated, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { designStyles, liveDesigns, STYLE_FILTER_MIN_DESIGNS, styleFilterChips } from '../../../lib/marketing/designs.ts';
import { FIXED, SITE_PAGES } from '../../../lib/marketing/facts.ts';
import { breadcrumbs, graph, itemList, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/designs');
export const metadata = pageMetadata(PAGE);

export default function DesignsPage() {
  const designs = liveDesigns();
  const chips = designs.length >= STYLE_FILTER_MIN_DESIGNS ? styleFilterChips(designs) : [];
  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            Every design opens from a sealed envelope or keepsake and has the same four pages:{' '}
            {SITE_PAGES.map((p) => p.name).join(', ')}. Each one has its own opening, artwork and fonts. Open a live demo on
            your phone and tap to open it, the way your guests will.
          </p>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>
      <Section>
        <Container>
          <div className={s.gallery} data-gallery="">
            {chips.length ? (
              <fieldset className={s.styleFilter} data-style-filter="" data-scroll-x="">
                <legend className={s.visuallyHidden}>Show designs by style</legend>
                <span className={s.filterItem}>
                  <input type="radio" name="style" id="style-all" value="all" defaultChecked className={s.filterInput} />
                  <label htmlFor="style-all" className={s.filterChip}>
                    All <span className={s.filterCount}>{designs.length}</span>
                  </label>
                </span>
                {chips.map((c) => (
                  <span key={c.id} className={s.filterItem}>
                    <input type="radio" name="style" id={`style-${c.id}`} value={c.id} className={s.filterInput} />
                    <label htmlFor={`style-${c.id}`} className={s.filterChip}>
                      {c.label} <span className={s.filterCount}>{c.count}</span>
                    </label>
                  </span>
                ))}
              </fieldset>
            ) : null}
            <div className={s.cardGrid}>
              {designs.map((d) => (
                <DesignCard key={d.id} design={d} placement="gallery" headingLevel={2} styles={chips.length ? designStyles(d.id) : undefined} />
              ))}
            </div>
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
                  'The opening page, then Home, Our Story, Details and RSVP',
                  'The editing panel, designed for phone screens',
                  'Online RSVP with your own questions, replies and CSV',
                  'Add to calendar, link preview and QR code',
                ]}
              />
            </div>
            <div>
              <h2 className={s.h2}>What makes each one different</h2>
              <CheckList items={['The envelope or keepsake and how it opens', 'The painted artwork and frames', 'Colors and fonts']} />
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
