// /how-it-works (docs/14 §6.4): numbered steps with the REAL screens of each step. G144: one body for every language.
import { KeyRound } from 'lucide-react';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns, openingObject, startPath } from '../../../lib/marketing/designs.ts';
import { editRightsText, LIMITS } from '../../../lib/marketing/facts.ts';
import { thingIn, type Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { designScreen, panelScreen } from '../media.ts';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Screen, Section, TextLink } from '../ui.tsx';

export function howItWorksMetadata(m: Market) {
  return pageMetadata(corePage('/how-it-works', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function HowItWorksPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/how-it-works', MARKETING, t);
  const first = liveDesigns()[0];
  const rights = editRightsText(MARKETING, t);
  const steps = [
    {
      id: 'choose',
      title: t('Choose a design and try its live demo'),
      time: t('A few minutes'),
      body: (
        <p>
          {t('Open any design on your phone and tap to open it. The demo is the real website with fictional names, so you see exactly what guests will see.')}{' '}
          <a href={m.href('/designs')}>{t('Browse the designs')}</a>.
        </p>
      ),
      screen: designScreen(first.id, 'envelope'),
      alt: t('{name}: the sealed {thing} page of the live demo', { name: first.name, thing: thingIn(t, openingObject(first.copy)) }),
    },
    {
      id: 'buy',
      title: t('Buy it on Etsy'),
      time: t('One payment'),
      body: (
        <p>
          {t('Tap')} <strong>{t('Buy on Etsy')}</strong>{' '}
          {t('on the design page. Etsy handles the payment, and your download opens as soon as the payment goes through. Inside it is a short PDF with the link to start your website.')}
        </p>
      ),
      screen: null,
      alt: '',
    },
    {
      id: 'start',
      title: t('Start your website'),
      time: t('A few minutes'),
      body: (
        <>
          <p>
            {t(
              'Open the link from your PDF. Enter your Etsy order number, your email and your first names, and choose your web address. Your draft website is created in the design you bought. Each design you bought starts one website.',
            )}
          </p>
          <aside className={s.callout}>
            <p>
              {/* G154 (G146/K46): the order number + email are the way back on any device; the edit link is a shortcut */}
              <KeyRound aria-hidden size={18} strokeWidth={1.75} /> <strong>{t('Your order number is your key.')}</strong>{' '}
              {t('With it and your email, your editor opens on any phone or computer: no account, no password. Your private edit link is a shortcut to the same editor. Anyone who has it can edit your website, so keep it private.')}
            </p>
          </aside>
        </>
      ),
      screen: panelScreen('start'),
      alt: t('The start page: Etsy order number, email, first names and web address'),
    },
    {
      id: 'edit',
      title: t('Edit, preview and publish'),
      time: t('As long as you like'),
      body: (
        <>
          <p>
            {t(
              'In your panel, fill in your names, date, venue, the order of the day (up to {rows} rows), your story, {photos} photos and your RSVP questions. Changes save on their own. Preview any page, then publish when you are ready.',
              { rows: LIMITS.scheduleRows, photos: LIMITS.photoSpots },
            )}
          </p>
          <p className={s.small}>
            {rights.long} {rights.rest}
          </p>
        </>
      ),
      screen: panelScreen('preview'),
      alt: t('The panel preview of the home page before publishing'),
    },
    {
      id: 'share',
      title: t('Share your link or QR code'),
      time: t('Whenever you are ready'),
      body: (
        <p>
          {t(
            'Copy your link and send it by text, WhatsApp or email; most apps show a preview with your names and date. Or download your QR code (PNG or SVG) for printed cards.',
          )}{' '}
          <a href={m.href('/guides/when-to-send-your-wedding-website')}>{t('When to share it')}</a>.
        </p>
      ),
      screen: panelScreen('share'),
      alt: t('The share screen with the website link and a QR code (blurred in this picture)'),
    },
    {
      id: 'replies',
      title: t('Guests reply; you see every answer'),
      time: t('Until your reply-by date'),
      body: (
        <p>
          {t(
            'Guests reply on your RSVP page. You see each reply and the totals in your panel and can download them as an Excel file. The form closes on its own after your reply-by date.',
          )}{' '}
          <a href={m.href('/features#rsvp')}>{t('More about RSVP')}</a>.
        </p>
      ),
      screen: panelScreen('replies'),
      alt: t('Replies in the panel with totals and an Excel download button'),
    },
  ];

  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>{t('From Etsy order to wedding website')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'You choose a design, buy it once on Etsy, and start your website with your order number. Then you edit it from your phone, share the link, and your guests reply online. Here is each step, with the real screens.',
            )}
          </p>
          <LastUpdated day={PAGE.updated} m={m} />
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
                    {t('Step {n} · {time}', { n: i + 1, time: st.time })}
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
                {t('What you need')}
              </h2>
              <CheckList
                items={[
                  t('A phone or a computer with a web browser'),
                  t('Your Etsy order number (in your Etsy order confirmation)'),
                  t('Your wedding details: date, time, venue and reply-by date'),
                  t('Photos, if you want them (optional)'),
                ]}
              />
            </div>
            <div>
              <h2 className={s.h2}>{t('After the wedding')}</h2>
              <p>
                {t(
                  'Your website stays online until {months} months after your wedding date, so guests can come back to it. After that your website closes for guests; you can still see your content and download your replies. {extension}',
                  { months: MARKETING.hosting.monthsAfterWedding, extension: t(MARKETING.policies.extension) },
                )}
              </p>
              <p className={s.small}>
                {t('Already bought a design?')}{' '}
                <a href={startPath()} data-track="start_click">
                  {t('Start your website')}
                </a>
                .
              </p>
            </div>
          </div>
          <TextLink href={m.href('/features')}>{t('See every feature')}</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('How it works'), path: '/how-it-works' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
