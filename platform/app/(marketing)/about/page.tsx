// /about (docs/14 §6.8): what we make and how, honestly. No founder story, no team photo, no "since 20XX" (K25).
import s from '../../../components/marketing/marketing.module.css';
import { designScreen } from '../../../components/marketing/media.ts';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Screen, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns } from '../../../lib/marketing/designs.ts';
import { definition, phoneClaim } from '../../../lib/marketing/facts.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/about');
export const metadata = pageMetadata(PAGE);

export default function AboutPage() {
  const designs = liveDesigns();
  const d = designs[designs.length - 1];
  const story = designScreen(d.id, 'story');
  return (
    <>
      <Section className={s.pageHead}>
        <Container narrow>
          <Eyebrow>About</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>{definition().long}</p>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>

      <Section band labelledBy="why">
        <Container narrow>
          <h2 id="why" className={s.h2}>
            Why we made it
          </h2>
          <p>
            Most wedding website templates sold online are design files: you open them in a design editor, rebuild your
            details, publish them yourself and connect a separate form for replies. Free wedding platforms handle hosting and
            replies well, with their own range of templates. We wanted something in between: a first moment that feels like
            opening a real invitation, and a practical part (details, replies, changes) you can finish on a phone, in one place.
          </p>
        </Container>
      </Section>

      <Section labelledBy="how">
        <Container>
          <div className={s.split}>
            {story ? (
              <div className={s.splitMedia}>
                <Screen file={story} alt={`${d.name}: the Our Story page with demo photos`} sizes="(min-width: 1024px) 280px, 66vw" />
              </div>
            ) : null}
            <div className={s.splitText}>
              <h2 id="how" className={s.h2}>
                How we make each design
              </h2>
              <CheckList
                items={[
                  'The artwork (envelopes, paper, flowers, frames) is created with AI image tools.',
                  'We cut it into separate layers, so the envelope flap, the seal or bow, the card and the flowers can move on their own.',
                  'Layout, typography and the opening animation are built separately for each design, not from a shared template.',
                  'Your names, dates and photos are live text and images, never painted into the artwork, so every change shows right away.',
                  'Every design is checked at five screen widths, from small phones to computers, before release.',
                ]}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section band labelledBy="tested">
        <Container narrow>
          <h2 id="tested" className={s.h2}>
            What we test, and what we have not tested yet
          </h2>
          <p>
            Before a design goes live we run automated checks of the opening, every page, long names, missing photos, the RSVP
            form and the editing panel in a browser at several screen sizes. The editing panel is {phoneClaim().toLowerCase()};
            {MARKETING.verified.realDevices
              ? ' it has been tested on real iPhone and Android phones.'
              : ' it has not yet been tested on every real phone model. If something looks wrong on yours, tell us and we will fix it.'}
          </p>
          <TextLink href="/contact">Contact us</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        )}
      />
    </>
  );
}
