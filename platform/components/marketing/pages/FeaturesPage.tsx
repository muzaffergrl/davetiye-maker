// /features (docs/14 §6.5): grouped features with real screens, an honest "not included" list and a Canva comparison.
// G144: one body for every language.
import { MARKETING } from '../../../lib/marketing/config.ts';
import { liveDesigns, openingObject } from '../../../lib/marketing/designs.ts';
import { canvaComparison, editRightsText, LIMITS, NOT_INCLUDED, phoneClaim } from '../../../lib/marketing/facts.ts';
import { thingIn, type Market } from '../../../lib/marketing/i18n.ts';
import { breadcrumbs, graph, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { corePage } from '../../../lib/marketing/site.ts';
import s from '../marketing.module.css';
import { designScreen, panelScreen } from '../media.ts';
import { CheckList, Container, Eyebrow, JsonLd, LastUpdated, Screen, Section, TextLink } from '../ui.tsx';

export function featuresMetadata(m: Market) {
  return pageMetadata(corePage('/features', MARKETING, m.t), { lang: m.lang, t: m.t });
}

export function FeaturesPage({ m }: { m: Market }) {
  const { t } = m;
  const PAGE = corePage('/features', MARKETING, t);
  const designs = liveDesigns();
  const a = designs[0];
  const b = designs[1] ?? designs[0];
  const rights = editRightsText(MARKETING, t);
  const groups = [
    {
      id: 'opening',
      eyebrow: t('Opening'),
      title: t('A sealed envelope or keepsake that opens'),
      items: [
        t('Your link opens on a sealed envelope with your names (in some designs a gatefold, pouch, wallet, storybook or sleeve)'),
        t('A tap plays the opening in the order of the design: bow, seal, flap or cover, card'),
        t('The card becomes the first screen of your home page'),
        t('A Skip link for guests in a hurry; with reduced motion on, a tap goes straight to the home page'),
      ],
      screen: designScreen(b.id, 'envelope'),
      alt: t('{name}: the sealed {thing} page', { name: b.name, thing: thingIn(t, openingObject(b.copy)) }),
    },
    {
      id: 'guests',
      eyebrow: t('For your guests'),
      title: t('Four pages with everything guests look for'),
      items: [
        t('Home, Our Story, Details and RSVP, with a simple menu between them'),
        t('Add to calendar: Apple/Outlook (.ics) and Google Calendar'),
        t('Venue with a map link, the order of the day, dress code'),
        t('Travel and stay and registry links, as buttons'),
        t('Questions and answers (up to {n})', { n: LIMITS.faqItems }),
        t('An optional live countdown to the day'),
        // G154: G127 map, G126 music, G144 languages (the same words as "What's included", facts.ts)
        t('A map of your venue and directions with Google Maps, Apple Maps or Waze'),
        t('Music on your Our Story page (one of four tracks made for your website, or your own file) and sound effects; you can turn each off'),
        t('Your website in English, Spanish, French, German or Turkish, or in several: built-in texts come translated, and your own texts can be translated automatically as a draft you check'),
      ],
      screen: designScreen(a.id, 'schedule'),
      alt: t('{name}: the order of the day on the Details page', { name: a.name }),
    },
    {
      id: 'rsvp',
      eyebrow: t('RSVP'),
      title: t('Replies that land in one place'),
      items: [
        t('Guests reply with their name, coming or not, party size and a note; no account needed'),
        t(
          'Up to {n} questions of your own: multiple choice (up to {options} options), yes or no, a number or a written answer, each required or optional',
          { n: LIMITS.rsvpQuestions, options: LIMITS.questionOptions },
        ),
        t('Questions are shown only to guests who are coming'),
        t('A reply-by date: the form closes on its own after it, and you can also close it yourself'),
        t('Every reply and the totals in your panel, and an Excel or CSV download for spreadsheets'),
      ],
      screen: panelScreen('questions'),
      alt: t('The panel section where the couple adds their own RSVP questions'),
    },
    {
      id: 'editing',
      eyebrow: t('Editing'),
      title: phoneClaim() === 'Designed for phone screens' ? t('A panel designed for phone screens') : t('A panel for your phone'),
      items: [
        // G154 (G146/K46): the order number + email open the editor on any device; the edit link is a shortcut
        t('Your Etsy order number and email open your editor on any phone or computer: no account, no password'),
        t('Changes save on their own; preview any page before you publish'),
        t('{n} photos, each cropped to its frame on your phone', { n: LIMITS.photoSpots }),
        t('Switch optional sections on or off: Our Story, countdown, dress code, registry, travel and stay, questions and answers'),
        t('Publish and unpublish whenever you like'),
        `${rights.long}`,
      ],
      screen: panelScreen('crop'),
      alt: t('Cropping a photo to the frame of the design in the panel'),
    },
    {
      id: 'sharing',
      eyebrow: t('Sharing'),
      title: t('A link that looks personal when you send it'),
      items: [
        t('Your address is your names on our domain'),
        t('Link previews in messaging apps show your names and wedding date'),
        t('A QR code to download as PNG or SVG, for printed cards'),
        // G154: G139 downloads (Share → Downloads)
        t('Downloads: your website as a PDF, and a printable invitation in your design (5 × 7 in or A5, with bleed and crop marks for a print shop)'),
      ],
      screen: panelScreen('share'),
      alt: t('The share screen with the website link and the QR code (blurred in this picture)'),
    },
    {
      id: 'privacy',
      eyebrow: t('Privacy'),
      title: t('Your guests’ replies stay yours'),
      items: [
        t('Only you see the replies, in your private panel'),
        t('We do not sell or share guest information'),
        t('Photos of an unpublished website are not shown to anyone'),
        // G154: the guest password cookie (lib/site/access.ts) is the one cookie a wedding website can set
        t('No ads or analytics on your wedding website; its only cookie remembers a guest’s password when you turn one on'),
      ],
      screen: null,
      alt: '',
    },
  ];

  return (
    <>
      <Section className={s.pageHead}>
        <Container>
          <Eyebrow>{t('Features')}</Eyebrow>
          <h1 className={s.h1}>{PAGE.h1}</h1>
          <p className={s.lead}>
            {t(
              'An envelope or keepsake that opens, four pages for your guests, RSVP with your own questions and an editing panel for your phone. And a plain list of what is not included, so you know before you buy.',
            )}
          </p>
          <nav aria-label={t('On this page')} className={s.toc}>
            <ul>
              {groups.map((g) => (
                <li key={g.id}>
                  <a href={`#${g.id}`}>{g.eyebrow}</a>
                </li>
              ))}
              <li>
                <a href="#not-included">{t('Not included')}</a>
              </li>
              <li>
                <a href="#compare">{t('Compared with a Canva template')}</a>
              </li>
            </ul>
          </nav>
          <LastUpdated day={PAGE.updated} m={m} />
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
                {g.id === 'privacy' ? <TextLink href={m.href('/privacy')}>{t('Read the privacy notice')}</TextLink> : null}
                {g.id === 'rsvp' ? (
                  <TextLink href={m.href('/guides/when-to-send-your-wedding-website')}>{t('Choosing your reply-by date')}</TextLink>
                ) : null}
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
                {t('Not included')}
              </h2>
              <p className={s.muted}>{t('Said plainly, so you can decide before you buy.')}</p>
              <CheckList items={NOT_INCLUDED.map((x) => t(x))} tone="no" />
            </div>
            <div id="compare">
              <h2 className={s.h2}>{t('Compared with a Canva template')}</h2>
              <p className={s.muted}>
                {t('Many wedding website templates on Etsy are Canva templates. Both are good choices for different people; this is the difference.')}{' '}
                <a href={m.href('/guides/canva-wedding-website-template-vs-hosted-website')}>{t('Read the full comparison')}</a>.
              </p>
              <div className={s.tableWrap} role="region" aria-label={t('Comparison table')} tabIndex={0}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className={s.visuallyHidden}>{t('Topic')}</span>
                      </th>
                      <th scope="col">{t('Canva template (typical Etsy listing)')}</th>
                      <th scope="col">{MARKETING.brand.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canvaComparison(MARKETING, t).map((r) => (
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
          <TextLink href={m.href('/pricing')}>{t('See pricing')}</TextLink>
        </Container>
      </Section>

      <JsonLd
        data={graph(
          webPage(PAGE, MARKETING, {}, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Features'), path: '/features' },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
