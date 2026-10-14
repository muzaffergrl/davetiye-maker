// /how-it-works (docs/14 §6.4): numbered steps with the REAL screens of each step.
import { KeyRound } from 'lucide-react';
import s from '../../../components/marketing/marketing.module.css';
import { designScreen, panelScreen } from '../../../components/marketing/media.ts';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Screen, Section, TextLink } from '../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns, startPath } from '../../../lib/marketing/designs.ts';
import { editRightsText, LIMITS } from '../../../lib/marketing/facts.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';

export const dynamic = 'force-static';

const PAGE = corePage('/how-it-works');
export const metadata = pageMetadata(PAGE);

export default function HowItWorksPage() {
  const first = liveDesigns()[0];
  const rights = editRightsText();
  const steps = [
    {
      id: 'choose',
      title: 'Choose a design and try its live demo',
      time: 'A few minutes',
      body: (
        <p>
          Open any design on your phone and tap the envelope. The demo is the real website with fictional names, so you see
          exactly what guests will see. <a href="/designs">Browse the designs</a>.
        </p>
      ),
      screen: designScreen(first.id, 'envelope'),
      alt: `${first.name}: the sealed envelope page of the live demo`,
    },
    {
      id: 'buy',
      title: 'Buy it on Etsy',
      time: 'One payment',
      body: (
        <p>
          Tap <strong>Buy on Etsy</strong> on the design page. Etsy handles the payment, and your download opens as soon as the
          payment goes through. Inside it is a short PDF with the link to start your website.
        </p>
      ),
      screen: null,
      alt: '',
    },
    {
      id: 'start',
      title: 'Start your website',
      time: 'A few minutes',
      body: (
        <>
          <p>
            Open the link from your PDF. Enter your Etsy order number, your email and your first names, and choose your web
            address. Your draft website is created in the design you bought. One order starts one website.
          </p>
          <aside className={s.callout}>
            <p>
              <KeyRound aria-hidden size={18} strokeWidth={1.75} /> <strong>Save your private edit link.</strong> It opens your
              editor, and anyone who has it can edit your website. Copy it into your notes or email it to yourself right away.
            </p>
          </aside>
        </>
      ),
      screen: panelScreen('start'),
      alt: 'The start page: Etsy order number, email, first names and web address',
    },
    {
      id: 'edit',
      title: 'Edit, preview and publish',
      time: 'As long as you like',
      body: (
        <>
          <p>
            In your panel, fill in your names, date, venue, the order of the day (up to {LIMITS.scheduleRows} rows), your
            story, {LIMITS.photoSpots} photos and your RSVP questions. Changes save on their own. Preview any page, then
            publish when you are ready.
          </p>
          <p className={s.small}>
            {rights.long} {rights.rest}
          </p>
        </>
      ),
      screen: panelScreen('preview'),
      alt: 'The panel preview of the home page before publishing',
    },
    {
      id: 'share',
      title: 'Share your link or QR code',
      time: 'Whenever you are ready',
      body: (
        <p>
          Copy your link and send it by text, WhatsApp or email; most apps show a preview with your names and date. Or
          download your QR code (PNG or SVG) for printed cards. <a href="/guides/when-to-send-your-wedding-website">When to
          share it</a>.
        </p>
      ),
      screen: panelScreen('share'),
      alt: 'The share screen with the website link and a QR code (blurred in this picture)',
    },
    {
      id: 'replies',
      title: 'Guests reply; you see every answer',
      time: 'Until your reply-by date',
      body: (
        <p>
          Guests reply on your RSVP page. You see each reply and the totals in your panel and can download them as a CSV
          file. The form closes on its own after your reply-by date. <a href="/features#rsvp">More about RSVP</a>.
        </p>
      ),
      screen: panelScreen('replies'),
      alt: 'Replies in the panel with totals and a CSV download button',
    },
  ];

  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>From Etsy order to wedding website</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            You choose a design, buy it once on Etsy, and start your website with your order number. Then you edit it from
            your phone, share the link, and your guests reply online. Here is each step, with the real screens.
          </p>
          <LastUpdated day={PAGE.updated} />
        </Container>
      </Section>

      <Section>
        <Container>
          <ol className={s.timeline}>
            {steps.map((st, i) => (
              <li key={st.id} id={st.id} className={s.timelineItem}>
                <div className={s.timelineText}>
                  <p className={s.stepLabel}>
                    <span className={s.stepNum} aria-hidden>
                      {i + 1}
                    </span>
                    Step {i + 1} · {st.time}
                  </p>
                  <h2 className={s.h2}>{st.title}</h2>
                  {st.body}
                </div>
                {st.screen ? (
                  <div className={s.timelineMedia}>
                    <Screen file={st.screen} alt={st.alt} sizes="(min-width: 1024px) 240px, 60vw" />
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section band labelledBy="need">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="need" className={s.h2}>
                What you need
              </h2>
              <CheckList
                items={[
                  'A phone or a computer with a web browser',
                  'Your Etsy order number (in your Etsy order confirmation)',
                  'Your wedding details: date, time, venue and reply-by date',
                  'Photos, if you want them (optional)',
                ]}
              />
            </div>
            <div>
              <h2 className={s.h2}>After the wedding</h2>
              <p>
                Your website stays online until {MARKETING.hosting.monthsAfterWedding} months after your wedding date, so guests
                can come back to it. After that: {MARKETING.policies.extension}.
              </p>
              <p className={s.small}>
                Already bought a design? <a href={startPath()} data-track="start_click">Start your website</a>.
              </p>
            </div>
          </div>
          <TextLink href="/features">See every feature</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'How it works', path: '/how-it-works' },
          ]),
        )}
      />
    </>
  );
}
