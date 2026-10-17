// / — home (docs/14 §6.1; G066 layout from the BKE Studio comps brand/ui/site/u1_home_*). Static. The live demo loads
// only after a tap (DemoFacade, §9.7). Every picture is a REAL theme or panel screen (or the real opening recording).
import { ShinyText } from '../../components/fx/ShinyText.tsx';
import { HeroDemo } from '../../components/marketing/Demo.tsx';
import { demoDesigns } from '../../components/marketing/demo-data.ts';
import { EditTour } from '../../components/marketing/EditTour.tsx';
import s from '../../components/marketing/marketing.module.css';
import { designScreen } from '../../components/marketing/media.ts';
import { DesignGallery, OpeningsReel } from '../../components/marketing/Showcase.tsx';
import { tourSteps } from '../../components/marketing/showcase-data.ts';
import { CheckList, Container, Eyebrow, FaqList, JsonLd, Screen, Section, TextLink } from '../../components/marketing/ui.tsx';
import { MARKETING } from '../../lib/marketing/config.ts';
import { liveDesigns, showcaseDesigns } from '../../lib/marketing/designs.ts';
import { definition, factStrip, SITE_PAGES } from '../../lib/marketing/facts.ts';
import { faqItems, HOME_FAQ_IDS } from '../../lib/marketing/faq.ts';
import { loadGuides } from '../../lib/marketing/guides.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
import { OPENINGS_COPY, SHOWCASE_COPY, TOUR_COPY } from '../../lib/marketing/showcase.ts';
import { graph, itemList, webPage } from '../../lib/marketing/schema.ts';
import { pageMetadata } from '../../lib/marketing/seo.ts';
import { corePage, displayPrice } from '../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/');
export const metadata = pageMetadata(PAGE);

const STEPS = [
  { title: 'Try a design on your phone', text: 'Open the live demo and tap to open the invitation, exactly as your guests will.' },
  { title: 'Buy it on Etsy', text: 'One payment. Your download holds the link to start your website.' },
  { title: 'Edit, preview, publish', text: 'Add your names, date, venue, photos and RSVP questions in your private panel.' },
  { title: 'Share your link', text: 'Send it by text or email, or print the QR code. Replies arrive in your panel.' },
];

export default function HomePage() {
  const designs = liveDesigns();
  // G141: the home gallery shows every live design, featured first (G099's featured designs lead)
  const showcase = showcaseDesigns();
  const demo = demoDesigns();
  const first = designs[0];
  const guides = loadGuides();
  const faq = faqItems().filter((f) => (HOME_FAQ_IDS as readonly string[]).includes(f.id));
  const prices = designs.map((d) => realPrice(d.price)).filter(Boolean) as string[];
  const fromPrice = prices.length ? displayPrice(prices.sort((a, b) => Number(a) - Number(b))[0]) : null;
  const def = definition();

  return (
    <>
      <Section className={s.heroSection}>
        <Container>
          <HeroDemo
            designs={demo}
            placement="home-hero"
            primaryLabel="Open the invitation"
            secondary={<TextLink href="/designs">See all designs</TextLink>}
            footnote={
              <ul className={s.factStrip} aria-label="At a glance">
                {factStrip().map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            }
          >
            <Eyebrow>
              <ShinyText>Wedding websites · edit on your phone</ShinyText>
            </Eyebrow>
            <h1 className={s.h1}>{PAGE.h1}</h1>
            <p className={s.lead}>
              Your guests tap a sealed envelope or keepsake and your wedding website opens: your story, the details and RSVP.
            </p>
          </HeroDemo>
        </Container>
      </Section>

      {/* G121 (docs/18 §5 P2, mobile order): the designs right after the hero. G141 (K45 item 7): every live design,
          featured first, as the interactive gallery (style chips, the real opening on hover / ▶, compare, live demo);
          then the openings, the pages and the editing tour — pictures first, short text. */}
      <Section labelledBy="designs">
        <Container>
          <Eyebrow>{SHOWCASE_COPY.eyebrow}</Eyebrow>
          <h2 id="designs" className={s.h2}>
            {SHOWCASE_COPY.title}
          </h2>
          <DesignGallery designs={showcase} placement="home-strip" id="home" />
          <TextLink href="/designs">See all {designs.length} designs</TextLink>
        </Container>
      </Section>

      <Section labelledBy="opening">
        <Container>
          <Eyebrow>{OPENINGS_COPY.eyebrow}</Eyebrow>
          <h2 id="opening" className={s.h2}>
            {OPENINGS_COPY.title}
          </h2>
          <p className={s.lead}>{OPENINGS_COPY.lead}</p>
          <OpeningsReel designs={designs} />
        </Container>
      </Section>

      <Section labelledBy="pages">
        <Container>
          <Eyebrow>After the opening</Eyebrow>
          <h2 id="pages" className={s.h2}>
            Four pages your guests will actually use
          </h2>
          <ul className={s.pageCards} data-fx-stagger>
            {SITE_PAGES.map((p) => {
              const file = designScreen(first.id, p.key);
              return (
                <li key={p.key} className={s.pageCard}>
                  {file ? (
                    <Screen
                      file={file}
                      alt={`${first.name} design, ${p.name} page (demo couple ${first.copy.demoCouple})`}
                      sizes="(min-width: 1024px) 96px, 64px"
                      className={s.pageThumb}
                    />
                  ) : null}
                  <div>
                    <h3 className={s.pageCardTitle}>{p.name}</h3>
                    <p className={s.pageCardText}>{p.short}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="edit" band>
        <Container>
          <Eyebrow>{TOUR_COPY.eyebrow}</Eyebrow>
          <h2 id="edit" className={s.h2}>
            {TOUR_COPY.title}
          </h2>
          <p className={s.lead}>{TOUR_COPY.lead}</p>
          <EditTour steps={tourSteps()} />
          <TextLink href="/features#editing">{TOUR_COPY.more}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="how">
        <Container>
          <Eyebrow>From Etsy to your guests</Eyebrow>
          <h2 id="how" className={s.h2}>
            How it works
          </h2>
          <ol className={s.stepRow} data-fx-stagger data-fx-steps>
            {STEPS.map((st, i) => (
              <li key={st.title}>
                <span className={s.stepNum} aria-hidden>
                  {i + 1}
                </span>
                <div>
                  <h3 className={s.stepTitle}>{st.title}</h3>
                  <p className={s.stepText}>{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <TextLink href="/how-it-works">See every step</TextLink>
        </Container>
      </Section>

      <Section labelledBy="what-is">
        <Container narrow>
          <h2 id="what-is" className={s.h2}>
            What is {MARKETING.brand.name}?
          </h2>
          <p className={s.definition}>{def.long}</p>
        </Container>
      </Section>

      <Section labelledBy="price">
        <Container narrow>
          <div className={s.priceBand}>
            <h2 id="price" className={s.h2}>
              One design. One payment on Etsy.
            </h2>
            <p className={s.lead}>
              {fromPrice ? `${fromPrice} per design. ` : ''}No subscription and nothing to renew: your website stays online until{' '}
              {MARKETING.hosting.monthsAfterWedding} months after your wedding date.
            </p>
            <CheckList items={['The opening and four pages', 'Editing panel and online RSVP', 'Add to calendar and QR code']} />
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
        </Container>
      </Section>

      <Section labelledBy="faq">
        <Container narrow>
          <h2 id="faq" className={s.h2}>
            Questions couples ask first
          </h2>
          <FaqList items={faq} />
          <TextLink href="/faq">All questions</TextLink>
        </Container>
      </Section>

      <Section labelledBy="final">
        <Container>
          <div className={s.finalCta}>
            <h2 id="final" className={s.h2}>
              Try it on your phone first
            </h2>
            <p className={s.lead}>Open a live demo, tap the invitation and read it the way your guests will.</p>
            <div className={s.ctaRow}>
              <a className={`${s.btn} ${s.btnLight}`} href={`/designs/${first.id}`} data-demo={first.id} data-demo-placement="home-final">
                Open a live demo
              </a>
              <TextLink href="/designs">Compare designs</TextLink>
            </div>
            <p className={s.small}>
              Planning tips: <a href={guides[0]?.path ?? '/guides'}>{guides[0]?.title ?? 'Guides'}</a>
              {guides[1] ? (
                <>
                  {' · '}
                  <a href={guides[1].path}>{guides[1].title}</a>
                </>
              ) : null}
            </p>
          </div>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE),
          // the designs shown on this page (the full list: /designs)
          itemList(showcase.map((d) => ({ path: `/designs/${d.id}`, name: d.name }))),
        )}
      />
    </>
  );
}
