// / — home (docs/14 §6.1). Static. The live demo loads only after a tap (DemoFacade, §9.7).
import { CalendarDays, Eye, ListChecks, Lock, MessageCircle, Pencil, Smartphone } from 'lucide-react';
import { HeroDemo } from '../../components/marketing/Demo.tsx';
import { DesignCard } from '../../components/marketing/DesignCard.tsx';
import { demoDesigns } from '../../components/marketing/demo-data.ts';
import { LoopVideo } from '../../components/marketing/LoopVideo.tsx';
import s from '../../components/marketing/marketing.module.css';
import { designScreen, openingVideo, panelScreen } from '../../components/marketing/media.ts';
import { CheckList, Container, Eyebrow, FaqList, JsonLd, Screen, Section, TextLink } from '../../components/marketing/ui.tsx';
import { MARKETING } from '../../lib/marketing/config.ts';
import { liveDesigns } from '../../lib/marketing/designs.ts';
import { definition, editRightsText, factStrip, LIMITS, phoneClaim, SITE_PAGES } from '../../lib/marketing/facts.ts';
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
  { title: 'Try a design on your phone', text: 'Open the live demo and tap the envelope, exactly as your guests will.' },
  { title: 'Buy it on Etsy', text: 'One payment. Your download holds the link to start your website.' },
  { title: 'Edit, preview, publish', text: 'Add your names, date, venue, photos and RSVP questions in your private panel.' },
  { title: 'Share your link', text: 'Send it by text or email, or print the QR code. Replies arrive in your panel.' },
];

export default function HomePage() {
  const designs = liveDesigns();
  const demo = demoDesigns();
  const first = designs[0];
  // The hero shows the first design; the opening video shows the next one, so visitors see two envelopes.
  const second = designs[1] ?? first;
  const video = openingVideo(second.id);
  const guides = loadGuides();
  const faq = faqItems().filter((f) => (HOME_FAQ_IDS as readonly string[]).includes(f.id));
  const prices = designs.map((d) => realPrice(d.price)).filter(Boolean) as string[];
  const fromPrice = prices.length ? displayPrice(prices.sort((a, b) => Number(a) - Number(b))[0]) : null;
  const def = definition();
  const rights = editRightsText();

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
            <Eyebrow>Wedding websites · edit on your phone</Eyebrow>
            <h1 className={s.h1}>{PAGE.h1}</h1>
            <p className={s.lead}>
              Your guests tap a sealed envelope, it opens, and your wedding website appears: your story, the details and RSVP.
              You edit everything from your phone.
            </p>
          </HeroDemo>
        </Container>
      </Section>

      <Section band labelledBy="what-is">
        <Container narrow>
          <h2 id="what-is" className={s.h2}>
            What is {MARKETING.brand.name}?
          </h2>
          <p className={s.definition}>{def.long}</p>
        </Container>
      </Section>

      <Section labelledBy="opening">
        <Container>
          <div className={s.split}>
            <div className={s.splitMedia}>
              {video ? (
                <div className={s.videoFrame}>
                  <LoopVideo
                    src={video.file}
                    poster={video.poster}
                    width={video.width}
                    height={video.height}
                    label={`Screen recording: the ${second.name} envelope opens into the home page`}
                  />
                </div>
              ) : null}
            </div>
            <div className={s.splitText}>
              <Eyebrow>The first moment</Eyebrow>
              <h2 id="opening" className={s.h2}>
                How the opening works
              </h2>
              <ol className={s.steps}>
                <li>
                  <strong>Your link opens on a sealed envelope</strong> with your names, the way a paper invitation arrives.
                </li>
                <li>
                  <strong>Guests tap it.</strong> The envelope opens in the order of its design: a bow slides, a seal lifts, a card
                  rises.
                </li>
                <li>
                  <strong>The card becomes your home page.</strong> From there guests read your story, the details and reply.
                </li>
              </ol>
              <p className={s.muted}>
                Every design opens in its own way. Guests can skip the animation, and on a phone set to reduce motion a tap goes
                straight to the home page.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section band labelledBy="pages">
        <Container>
          <Eyebrow>After the envelope</Eyebrow>
          <h2 id="pages" className={s.h2}>
            Four pages your guests will actually use
          </h2>
          <ul className={s.screenRow}>
            {SITE_PAGES.map((p) => {
              const file = designScreen(first.id, p.key === 'home' ? 'home' : p.key);
              return (
                <li key={p.key} className={s.screenItem}>
                  {file ? (
                    <Screen file={file} alt={`${first.name} design, ${p.name} page (demo couple ${first.copy.demoCouple})`} sizes="(min-width: 1024px) 240px, 62vw" />
                  ) : null}
                  <h3 className={s.h3}>{p.name}</h3>
                  <p className={s.small}>{p.summary}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="edit">
        <Container>
          <div className={`${s.split} ${s.splitReverse}`}>
            <div className={s.splitMedia}>
              <Screen file={panelScreen('panel')} alt="The editing panel on a phone: the couple's names, a draft notice and the Publish button" sizes="(min-width: 1024px) 300px, 70vw" />
            </div>
            <div className={s.splitText}>
              <Eyebrow>{phoneClaim()}</Eyebrow>
              <h2 id="edit" className={s.h2}>
                Made to edit from your phone
              </h2>
              <p className={s.lead}>No Canva, no app. Open your private edit link and change what you need, between other plans.</p>
              <ul className={s.iconList}>
                <li>
                  <Pencil aria-hidden size={20} strokeWidth={1.75} />
                  Names, date and time, venue and map link, the order of the day (up to {LIMITS.scheduleRows} rows)
                </li>
                <li>
                  <Smartphone aria-hidden size={20} strokeWidth={1.75} />
                  {LIMITS.photoSpots} photos, each cropped to its frame on your phone
                </li>
                <li>
                  <ListChecks aria-hidden size={20} strokeWidth={1.75} />
                  Your story, questions and answers (up to {LIMITS.faqItems}), dress code, registry and travel links
                </li>
                <li>
                  <Eye aria-hidden size={20} strokeWidth={1.75} />
                  Preview every page before you publish; changes save on their own
                </li>
                <li>
                  <Lock aria-hidden size={20} strokeWidth={1.75} />
                  {rights.short}
                </li>
              </ul>
              <TextLink href="/features#editing">Everything you can edit</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <Section band labelledBy="rsvp">
        <Container>
          <div className={s.split}>
            <div className={`${s.splitMedia} ${s.pair}`}>
              {designScreen(first.id, 'form') ? (
                <Screen file={designScreen(first.id, 'form')!} alt="A guest's reply form: attending or not, number of guests and a meal choice question" sizes="(min-width: 1024px) 220px, 42vw" />
              ) : null}
              <Screen file={panelScreen('replies')} alt="Replies in the couple's panel: totals, each reply and a Download all replies (CSV) button" sizes="(min-width: 1024px) 220px, 42vw" />
            </div>
            <div className={s.splitText}>
              <Eyebrow>RSVP built in</Eyebrow>
              <h2 id="rsvp" className={s.h2}>
                RSVPs without the spreadsheet chaos
              </h2>
              <ul className={s.iconList}>
                <li>
                  <MessageCircle aria-hidden size={20} strokeWidth={1.75} />
                  Guests reply on your website: coming or not, party size and a note. No account for them.
                </li>
                <li>
                  <ListChecks aria-hidden size={20} strokeWidth={1.75} />
                  Up to {LIMITS.rsvpQuestions} questions of your own, such as a meal choice
                </li>
                <li>
                  <CalendarDays aria-hidden size={20} strokeWidth={1.75} />
                  A reply-by date; the form closes on its own after it
                </li>
                <li>
                  <Eye aria-hidden size={20} strokeWidth={1.75} />
                  Every reply and the totals in your panel, plus a CSV download
                </li>
              </ul>
              <TextLink href="/features#rsvp">More about RSVP</TextLink>
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
          <ol className={s.stepGrid}>
            {STEPS.map((st, i) => (
              <li key={st.title}>
                <span className={s.stepNum} aria-hidden>
                  {i + 1}
                </span>
                <h3 className={s.h3}>{st.title}</h3>
                <p className={s.small}>{st.text}</p>
              </li>
            ))}
          </ol>
          <TextLink href="/how-it-works">See every step</TextLink>
        </Container>
      </Section>

      <Section band labelledBy="designs">
        <Container>
          <Eyebrow>Designs</Eyebrow>
          <h2 id="designs" className={s.h2}>
            Choose the envelope your guests will open
          </h2>
          <div className={s.cardGrid}>
            {designs.map((d) => (
              <DesignCard key={d.id} design={d} placement="home-strip" />
            ))}
          </div>
          <TextLink href="/designs">See all designs</TextLink>
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
            <CheckList items={['Envelope opening and four pages', 'Editing panel and online RSVP', 'Add to calendar and QR code']} />
            <TextLink href="/pricing">See pricing</TextLink>
          </div>
        </Container>
      </Section>

      <Section band labelledBy="faq">
        <Container narrow>
          <h2 id="faq" className={s.h2}>
            Questions couples ask first
          </h2>
          <FaqList items={faq} />
          <TextLink href="/faq">All questions</TextLink>
        </Container>
      </Section>

      <Section labelledBy="final">
        <Container narrow>
          <div className={s.finalCta}>
            <h2 id="final" className={s.h2}>
              Try it on your phone first
            </h2>
            <p className={s.lead}>Open a live demo, tap the envelope and read it the way your guests will.</p>
            <div className={s.ctaRow}>
              <a className={s.btn} href={`/designs/${first.id}`} data-demo={first.id} data-demo-placement="home-final">
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
          itemList(designs.map((d) => ({ path: `/designs/${d.id}`, name: d.name }))),
        )}
      />
    </>
  );
}
