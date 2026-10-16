// / — home (docs/14 §6.1; G066 layout from the BKE Studio comps brand/ui/site/u1_home_*). Static. The live demo loads
// only after a tap (DemoFacade, §9.7). Every picture is a REAL theme or panel screen (or the real opening recording).
import { ArrowRight } from 'lucide-react';
import { ShinyText } from '../../components/fx/ShinyText.tsx';
import { HeroDemo } from '../../components/marketing/Demo.tsx';
import { DesignCard } from '../../components/marketing/DesignCard.tsx';
import { demoDesigns } from '../../components/marketing/demo-data.ts';
import { LoopVideo } from '../../components/marketing/LoopVideo.tsx';
import s from '../../components/marketing/marketing.module.css';
import { designScreen, openingVideo, panelScreen } from '../../components/marketing/media.ts';
import { CheckList, Container, Eyebrow, FaqList, JsonLd, Screen, Section, TextLink } from '../../components/marketing/ui.tsx';
import { MARKETING } from '../../lib/marketing/config.ts';
import { featuredDesigns, liveDesigns, openingObject } from '../../lib/marketing/designs.ts';
import { DEMO_REPLY_TOTALS, definition, editRightsText, factStrip, LIMITS, phoneClaim, REPLIES_SCREEN_ALT, SITE_PAGES } from '../../lib/marketing/facts.ts';
import { faqItems, HOME_FAQ_IDS } from '../../lib/marketing/faq.ts';
import { loadGuides } from '../../lib/marketing/guides.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
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
  // G099: the design showcase shows the featured designs (config.ts); the rest are on /designs ("See all N designs").
  const featured = featuredDesigns();
  const demo = demoDesigns();
  const first = designs[0];
  // The hero shows the first design; the opening row shows the next one, so visitors see two openings.
  const second = designs[1] ?? first;
  const secondThing = openingObject(second.copy);
  const video = openingVideo(second.id);
  const sealed = designScreen(second.id, 'envelope');
  const opened = designScreen(second.id, 'home');
  const guides = loadGuides();
  const faq = faqItems().filter((f) => (HOME_FAQ_IDS as readonly string[]).includes(f.id));
  const prices = designs.map((d) => realPrice(d.price)).filter(Boolean) as string[];
  const fromPrice = prices.length ? displayPrice(prices.sort((a, b) => Number(a) - Number(b))[0]) : null;
  const def = definition();
  const rights = editRightsText();
  const totals = [
    { n: DEMO_REPLY_TOTALS.coming, label: 'Coming' },
    { n: DEMO_REPLY_TOTALS.notComing, label: 'Not coming' },
    { n: DEMO_REPLY_TOTALS.replies, label: 'Replies' },
  ];

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
              Your guests tap a sealed envelope or keepsake and your wedding website opens: your story, the details and RSVP. You
              edit everything from your phone.
            </p>
          </HeroDemo>
        </Container>
      </Section>

      {/* G121 (docs/18 §5 P2, mobile order): the designs right after the hero — hero preview → designs → what they do
          (opening, pages, editing, RSVP) → how it works → price → questions → try it. */}
      <Section labelledBy="designs">
        <Container>
          <Eyebrow>Designs</Eyebrow>
          <h2 id="designs" className={s.h2}>
            Choose the design your guests will open
          </h2>
          <div className={s.cardGrid} data-fx-stagger>
            {featured.map((d) => (
              <DesignCard key={d.id} design={d} placement="home-strip" />
            ))}
          </div>
          {featured.length < designs.length ? (
            <div className={s.seeAll}>
              <a className={`${s.btn} ${s.btnSecondary}`} href="/designs" data-see-all>
                See all {designs.length} designs
              </a>
            </div>
          ) : (
            <TextLink href="/designs">See all designs</TextLink>
          )}
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

      <Section labelledBy="opening">
        <Container>
          <Eyebrow>The first moment</Eyebrow>
          <h2 id="opening" className={s.h2}>
            How the opening works
          </h2>
          <ol className={s.flowRow} data-fx-stagger data-fx-flow aria-label={`The ${second.name} ${secondThing}, from sealed to open`}>
            <li className={s.flowItem}>
              {sealed ? <Screen file={sealed} alt={`${second.name}: the sealed ${secondThing} with the demo couple's names`} sizes="(min-width: 1024px) 220px, 27vw" /> : null}
              <p className={s.flowLabel}>Sealed</p>
              <ArrowRight aria-hidden className={s.flowArrow} size={28} strokeWidth={1.5} />
            </li>
            <li className={s.flowItem}>
              {video ? (
                <div className={s.videoFrame}>
                  <LoopVideo
                    src={video.file}
                    poster={video.poster}
                    width={video.width}
                    height={video.height}
                    label={`Screen recording: the ${second.name} ${secondThing} opens into the home page`}
                  />
                </div>
              ) : null}
              <p className={s.flowLabel}>Opening</p>
              <ArrowRight aria-hidden className={s.flowArrow} size={28} strokeWidth={1.5} />
            </li>
            <li className={s.flowItem}>
              {opened ? <Screen file={opened} alt={`${second.name}: the home page after the ${secondThing} opens`} sizes="(min-width: 1024px) 220px, 27vw" /> : null}
              <p className={s.flowLabel}>Your website</p>
            </li>
          </ol>
          <div className={s.flowText}>
            <ol className={s.steps}>
              <li>
                <strong>Your link opens on a sealed envelope</strong> with your names, the way a paper invitation arrives. Some
                designs use a gatefold, a linen pouch, a travel wallet, a storybook or a vellum sleeve instead.
              </li>
              <li>
                <strong>Guests tap it.</strong> It opens in the order of its design: a bow slides, a seal lifts, a cover swings
                open, a card rises.
              </li>
              <li>
                <strong>The card becomes your home page.</strong> From there guests read your story, the details and reply.
              </li>
            </ol>
            <p className={s.small}>
              Every design opens in its own way. Guests can skip the animation, and on a phone set to reduce motion a tap goes
              straight to the home page.
            </p>
          </div>
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

      <Section labelledBy="edit">
        <Container>
          <Eyebrow>{phoneClaim()}</Eyebrow>
          <h2 id="edit" className={s.h2}>
            Made to edit from your phone
          </h2>
          <p className={s.lead}>No Canva, no app. Open your private edit link and change what you need, between other plans.</p>
          <div className={s.editSplit}>
            <Screen
              file={panelScreen('panel')}
              alt="The editing panel on a phone: the couple's names, a draft notice and the Publish button"
              sizes="(min-width: 1024px) 280px, 36vw"
            />
            <CheckList
              variant="soft"
              items={[
                `Names, date and time, venue and map link, the order of the day (up to ${LIMITS.scheduleRows} rows)`,
                `${LIMITS.photoSpots} photos, each cropped to its frame on your phone`,
                `Your story, questions and answers (up to ${LIMITS.faqItems}), dress code, registry and travel links`,
                'Preview every page before you publish; changes save on their own',
                rights.short,
              ]}
            />
          </div>
          <TextLink href="/features#editing">Everything you can edit</TextLink>
        </Container>
      </Section>

      <Section labelledBy="rsvp">
        <Container>
          <div className={s.rsvpSplit}>
            <div className={s.rsvpText}>
              <Eyebrow>RSVP built in</Eyebrow>
              <h2 id="rsvp" className={s.h2}>
                RSVPs without the spreadsheet chaos
              </h2>
              <dl className={s.tiles} data-fx-stagger>
                {totals.map((t) => (
                  <div key={t.label} className={s.tile}>
                    <dt className={s.tileLabel}>{t.label}</dt>
                    <dd className={s.tileNumber}>{t.n}</dd>
                  </div>
                ))}
              </dl>
              <p className={s.tilesNote}>Example totals from the demo panel (fictional guests)</p>
              <CheckList
                variant="soft"
                items={[
                  'Guests reply on your website: coming or not, party size and a note. No account for them.',
                  `Up to ${LIMITS.rsvpQuestions} questions of your own, such as a meal choice`,
                  'A reply-by date; the form closes on its own after it',
                  'Every reply and the totals in your panel, plus a CSV download',
                ]}
              />
              <TextLink href="/features#rsvp">More about RSVP</TextLink>
            </div>
            <div className={s.rsvpMedia}>
              {designScreen(first.id, 'form') ? (
                <Screen file={designScreen(first.id, 'form')!} alt="A guest's reply form: attending or not, number of guests and a meal choice question" sizes="220px" />
              ) : null}
              <Screen file={panelScreen('replies')} alt={REPLIES_SCREEN_ALT} sizes="220px" />
            </div>
          </div>
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
          itemList(featured.map((d) => ({ path: `/designs/${d.id}`, name: d.name }))),
        )}
      />
    </>
  );
}
