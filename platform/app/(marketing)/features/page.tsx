// /features (docs/14 §6.5): grouped features with real screens, an honest "not included" list and a Canva comparison.
import s from '../../../components/marketing/marketing.module.css';
import { designScreen, panelScreen } from '../../../components/marketing/media.ts';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Screen, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns, openingObject } from '../../../lib/marketing/designs.ts';
import { canvaComparison, editRightsText, LIMITS, NOT_INCLUDED, phoneClaim } from '../../../lib/marketing/facts.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/features');
export const metadata = pageMetadata(PAGE);

export default function FeaturesPage() {
  const designs = liveDesigns();
  const a = designs[0];
  const b = designs[1] ?? designs[0];
  const rights = editRightsText();
  const groups = [
    {
      id: 'opening',
      eyebrow: 'Opening',
      title: 'A sealed envelope or keepsake that opens',
      items: [
        'Your link opens on a sealed envelope with your names (in some designs a gatefold, pouch, wallet, storybook or sleeve)',
        'A tap plays the opening in the order of the design: bow, seal, flap or cover, card',
        'The card becomes the first screen of your home page',
        'A Skip link for guests in a hurry; with reduced motion on, a tap goes straight to the home page',
      ],
      screen: designScreen(b.id, 'envelope'),
      alt: `${b.name}: the sealed ${openingObject(b.copy)} page`,
    },
    {
      id: 'guests',
      eyebrow: 'For your guests',
      title: 'Four pages with everything guests look for',
      items: [
        'Home, Our Story, Details and RSVP, with a simple menu between them',
        'Add to calendar: Apple/Outlook (.ics) and Google Calendar',
        'Venue with a map link, the order of the day, dress code',
        'Travel and stay and registry links, as buttons',
        `Questions and answers (up to ${LIMITS.faqItems})`,
        'An optional live countdown to the day',
      ],
      screen: designScreen(a.id, 'schedule'),
      alt: `${a.name}: the order of the day on the Details page`,
    },
    {
      id: 'rsvp',
      eyebrow: 'RSVP',
      title: 'Replies that land in one place',
      items: [
        'Guests reply with their name, coming or not, party size and a note; no account needed',
        `Up to ${LIMITS.rsvpQuestions} questions of your own: multiple choice (up to ${LIMITS.questionOptions} options) or a short answer`,
        'Questions are shown only to guests who are coming',
        'A reply-by date: the form closes on its own after it, and you can also close it yourself',
        'Every reply and the totals in your panel, and a CSV download for spreadsheets',
      ],
      screen: panelScreen('questions'),
      alt: 'The panel section where the couple adds their own RSVP questions',
    },
    {
      id: 'editing',
      eyebrow: 'Editing',
      title: phoneClaim() === 'Designed for phone screens' ? 'A panel designed for phone screens' : 'A panel for your phone',
      items: [
        'A private edit link: no account, no password to remember, no app',
        'Changes save on their own; preview any page before you publish',
        `${LIMITS.photoSpots} photos, each cropped to its frame on your phone`,
        'Switch optional sections on or off: Our Story, countdown, dress code, registry, travel and stay, questions and answers',
        'Publish and unpublish whenever you like',
        `${rights.long}`,
      ],
      screen: panelScreen('crop'),
      alt: 'Cropping a photo to the frame of the design in the panel',
    },
    {
      id: 'sharing',
      eyebrow: 'Sharing',
      title: 'A link that looks personal when you send it',
      items: [
        'Your address is your names on our domain',
        'Link previews in messaging apps show your names and wedding date',
        'A QR code to download as PNG or SVG, for printed cards',
      ],
      screen: panelScreen('share'),
      alt: 'The share screen with the website link and the QR code (blurred in this picture)',
    },
    {
      id: 'privacy',
      eyebrow: 'Privacy',
      title: 'Your guests’ replies stay yours',
      items: [
        'Only you see the replies, in your private panel',
        'We do not sell or share guest information',
        'Photos of an unpublished website are not shown to anyone',
        'No cookies, ads or analytics on your wedding website',
      ],
      screen: null,
      alt: '',
    },
  ];

  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>Features</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            An envelope or keepsake that opens, four pages for your guests, RSVP with your own questions and an editing panel for your
            phone. And a plain list of what is not included, so you know before you buy.
          </p>
          <nav aria-label="On this page" className={s.toc}>
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.eyebrow}</a>
                </li>
              ))}
              <li>
                <a href="#not-included">Not included</a>
              </li>
              <li>
                <a href="#compare">Compared with a Canva template</a>
              </li>
            </ul>
          </nav>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>

      {groups.map((g, i) => (
        <Section key={g.id} id={g.id} band={i % 2 === 0} labelledBy={`${g.id}-title`}>
          <Container>
            <div className={`${s.split} ${i % 2 ? s.splitReverse : ''}`}>
              {g.screen ? (
                <div className={s.splitMedia}>
                  <Screen file={g.screen} alt={g.alt} sizes="(min-width: 1024px) 280px, 66vw" />
                </div>
              ) : null}
              <div className={s.splitText}>
                <Eyebrow>{g.eyebrow}</Eyebrow>
                <h2 id={`${g.id}-title`} className={s.h2}>
                  {g.title}
                </h2>
                <CheckList items={g.items} />
                {g.id === 'privacy' ? <TextLink href="/privacy">Read the privacy notice</TextLink> : null}
                {g.id === 'rsvp' ? <TextLink href="/guides/when-to-send-your-wedding-website">Choosing your reply-by date</TextLink> : null}
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <Section id="not-included" labelledBy="not-included-title">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="not-included-title" className={s.h2}>
                Not included
              </h2>
              <p className={s.muted}>Said plainly, so you can decide before you buy.</p>
              <CheckList items={NOT_INCLUDED} tone="no" />
            </div>
            <div id="compare">
              <h2 className={s.h2}>Compared with a Canva template</h2>
              <p className={s.muted}>
                Many wedding website templates on Etsy are Canva templates. Both are good choices for different people; this is
                the difference. <a href="/guides/canva-wedding-website-template-vs-hosted-website">Read the full comparison</a>.
              </p>
              <div className={s.tableWrap} role="region" aria-label="Comparison table" tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className={s.visuallyHidden}>Topic</span>
                      </th>
                      <th scope="col">Canva template (typical Etsy listing)</th>
                      <th scope="col">{MARKETING.brand.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canvaComparison().map((r) => (
                      <tr key={r.label}>
                        <th scope="row">{r.label}</th>
                        <td>{r.canva}</td>
                        <td>{r.ours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <TextLink href="/pricing">See pricing</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Features', path: '/features' },
          ]),
        )}
      />
    </>
  );
}
