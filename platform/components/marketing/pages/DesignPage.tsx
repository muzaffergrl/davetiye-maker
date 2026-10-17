// /designs/<id> — one design (docs/14 §6.3; G066 comp u1_design_detail_390). Static for every live design; anything
// else is a 404. G144: one body for every language; the design's own copy (lib/marketing/designs.ts) is translated
// through the dictionary like every other text.
import { Play } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MARKETING } from '../../../lib/marketing/config.ts';
import { demoPath, designOgImage, liveDesign, liveDesigns, openingObject, startPath } from '../../../lib/marketing/designs.ts';
import { editable, FIXED, included, LIMITS, NOT_INCLUDED, SITE_PAGES, sitePageNames } from '../../../lib/marketing/facts.ts';
import { loadGuideIn } from '../../../lib/marketing/guides.ts';
import { thingIn, type Market, type T } from '../../../lib/marketing/i18n.ts';
import { realPrice } from '../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, product, videoObject, webPage } from '../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../lib/marketing/seo.ts';
import { DESIGN_GALLERY_COPY } from '../../../lib/marketing/showcase.ts';
import { designPage, displayPrice } from '../../../lib/marketing/site.ts';
import { HeroDemo } from '../Demo.tsx';
import { DesignCard } from '../DesignCard.tsx';
import { demoCopy, demoDesigns } from '../demo-data.ts';
import { LoopVideo } from '../LoopVideo.tsx';
import s from '../marketing.module.css';
import { designScreen, openingVideo } from '../media.ts';
import { DesignScreens } from '../Showcase.tsx';
import {
  Breadcrumbs,
  CheckList,
  Container,
  EtsyButton,
  Eyebrow,
  FaqList,
  JsonLd,
  Screen,
  Section,
  Swatches,
  TextLink,
} from '../ui.tsx';

export function designStaticParams() {
  return liveDesigns().map((d) => ({ design: d.id }));
}

export function designMetadata(id: string, m: Market) {
  const page = designPage(id, MARKETING, m.t);
  if (!page) return {};
  const d = liveDesign(id)!;
  const { t } = m;
  return pageMetadata(page, {
    lang: m.lang,
    t: m.t,
    image: {
      url: designOgImage(d.id),
      width: 1200,
      height: 630,
      alt: t('{name} wedding website artwork: {style}', { name: d.name, style: t(d.copy.style).toLowerCase() }),
    },
  });
}

/** `thing` = the opening object in the page language. */
function designFaq(name: string, thing: string, t: T, palettes: number) {
  return [
    {
      id: 'colors',
      q: t('Can I change the colors of {name}?', { name }),
      // G153: a design with live colour palettes offers them (the artwork itself is still painted to match)
      a:
        palettes > 0
          ? t(
              'Yes, within the design: {name} comes in its original colors and {n} more palettes, each with the {thing}, cards and frames painted to match. You choose a palette when you start and can switch in your editor at any time; your texts and photos stay as they are.',
              { name, n: palettes, thing },
            )
          : t(
              'No. The artwork, colors and fonts stay as designed, because the {thing}, cards and frames are painted to match. You change the content: names, details, photos and questions. [See all designs](/designs) to compare palettes.',
              { thing },
            ),
    },
    {
      id: 'photos',
      q: t('How many photos can I add?'),
      a: t(
        '{n}: a portrait on the invitation card, {story} photos for Our Story and one of the venue. You crop each one to its frame in the panel, on your phone. Our Story can be switched off if you prefer fewer photos.',
        { n: LIMITS.photoSpots, story: LIMITS.storyPhotos },
      ),
    },
    {
      id: 'no-photos',
      q: t('Does it work without photos?'),
      a: t(
        `Yes. Until you add your own, each photo spot shows a soft, neutral image made from the design's artwork, never a sample couple. The "Your photo here" label is only visible to you in preview, not to guests.`,
      ),
    },
    {
      id: 'save-the-date',
      q: t('Is there a matching save the date?'),
      a: t(
        'Not yet. You can share your website link early, as a digital save the date, and add the full details later: guests always see the latest version. [Read about timing](/guides/when-to-send-your-wedding-website).',
      ),
    },
  ];
}

export function DesignPage({ id, m }: { id: string; m: Market }) {
  const { t } = m;
  const d = liveDesign(id);
  const page = designPage(id, MARKETING, t);
  if (!d || !page) notFound();
  const demo = demoDesigns(MARKETING, m).filter((x) => x.id === d.id);
  const video = openingVideo(d.id);
  const price = realPrice(d.price);
  const others = liveDesigns().filter((x) => x.id !== d.id);
  const related = d.copy.relatedGuides.map((g) => loadGuideIn(g, m.lang)).filter((g) => !!g);
  // G099: what guests tap first here (envelope, gatefold, pouch, wallet, book or sleeve), from the design's own opening
  const thing = thingIn(t, openingObject(d.copy));
  const faq = designFaq(d.name, thing, t, Math.max(0, (demo[0]?.palettes?.length ?? 0) - 1));
  const etsyPrice = price ? displayPrice(price) : null;
  const opening = t('{thing} opening', { thing });

  return (
    <>
      <Section className={s.heroSection}>
        <Container>
          <Breadcrumbs
            m={m}
            items={[
              { name: t('Home'), href: m.href('/') },
              { name: t('Designs'), href: m.href('/designs') },
              { name: d.name, href: m.href(page.path) },
            ]}
          />
          {/* G099 (docs/18 §5 P1): large preview, a short summary and ONE primary action — Buy on Etsy ("Coming soon on
              Etsy", not a link, while the listing link is a placeholder); the live demo is the secondary action. */}
          <HeroDemo
            designs={demo}
            copy={demoCopy(t)}
            placement="design-hero"
            primaryLabel={t('View live demo')}
            demoVariant="secondary"
            action={<EtsyButton design={d} placement="design-hero" className={s.btnLarge} withPrice={etsyPrice} m={m} />}
            className={`${s.heroStickyActions} ${s.heroDesign}`}
            footnote={
              <p className={s.small}>
                <a href={startPath(d.id)} data-track="start_click" data-track-design={d.id}>
                  {t('Already bought it? Start your website')}
                </a>
              </p>
            }
          >
            <h1 className={s.h1}>{page.h1}</h1>
            <p className={s.lead}>{t(d.copy.style)}.</p>
          </HeroDemo>
        </Container>
      </Section>

      <Section labelledBy="pages" className={s.pagesSection}>
        <Container>
          <h2 id="pages" className={s.h2}>
            {t('What your guests see after the {thing} opens', { thing })}
          </h2>
          <p className={s.lead}>{t(d.copy.intro)}</p>
          <ul className={s.thumbRow} data-fx-deal>
            {SITE_PAGES.map((p) => {
              const file = designScreen(d.id, p.key);
              return (
                <li key={p.key}>
                  {file ? (
                    <Screen
                      file={file}
                      alt={t('{name}: {page} page with demo content', { name: d.name, page: t(p.name) })}
                      sizes="(min-width: 1024px) 220px, 22vw"
                      className={s.thumb}
                    />
                  ) : null}
                  <p className={s.thumbLabel}>{t(p.name)}</p>
                </li>
              );
            })}
          </ul>
          <dl className={s.pageNotes}>
            {SITE_PAGES.map((p) => (
              <div key={p.key}>
                <dt>{t(p.name)}</dt>
                <dd>{t(d.copy.pages[p.key])}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* G141 (K45 item 7): every real screen of the design, then the panel that edits it */}
      <Section labelledBy="screens" band>
        <Container>
          <h2 id="screens" className={s.h2}>
            {t(DESIGN_GALLERY_COPY.title, { thing })}
          </h2>
          <DesignScreens design={d} m={m} />
          <TextLink href={m.href('/#edit')}>{t(DESIGN_GALLERY_COPY.tourLink)}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="change">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="change" className={s.h2}>
                {t('What you can edit')}
              </h2>
              <CheckList items={editable(t)} />
            </div>
            <div>
              <h2 className={s.h2}>{t('What stays the same')}</h2>
              <CheckList items={FIXED.map((f) => t(f))} tone="no" />
              <h3 className={s.h3}>{t('Details')}</h3>
              <dl className={s.specs}>
                <div>
                  <dt>{t('Colors')}</dt>
                  <dd>
                    <Swatches palette={d.copy.palette} m={m} />
                  </dd>
                </div>
                <div>
                  <dt>{t('Fonts')}</dt>
                  <dd>{d.copy.fonts.join(', ')}</dd>
                </div>
                <div>
                  <dt>{t('Pages')}</dt>
                  <dd>
                    {opening.charAt(0).toUpperCase() + opening.slice(1)}, {sitePageNames(t)}
                  </dd>
                </div>
                <div>
                  <dt>{t('Photos')}</dt>
                  <dd>{t('{n} spots, cropped in the panel', { n: LIMITS.photoSpots })}</dd>
                </div>
                <div>
                  <dt>{t('Date style')}</dt>
                  <dd>{t('US, UK, Canadian or Australian (June 12, 2027 or 12 June 2027)')}</dd>
                </div>
                <div>
                  <dt>{t('Screens')}</dt>
                  <dd>{t('Made for phones; also checked at tablet and computer widths')}</dd>
                </div>
              </dl>
            </div>
          </div>
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
                    label={t('Screen recording: the {name} {thing} opens', { name: d.name, thing })}
                  />
                </div>
              ) : null}
            </div>
            <div className={s.splitText}>
              <Eyebrow>{t('The opening')}</Eyebrow>
              <h2 id="opening" className={s.h2}>
                {t('How {name} opens', { name: d.name })}
              </h2>
              <p className={s.lead}>{t(d.copy.opening)}</p>
              <p className={s.muted}>
                {t(
                  'This is a real screen recording of the design with demo content ({couple} are fictional). Guests can skip the animation, and on a phone set to reduce motion a tap goes straight to the home page.',
                  { couple: d.copy.demoCouple },
                )}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="included">
        <Container>
          <div className={s.twoCol}>
            <div id="included">
              <h2 className={s.h2}>{t('Included')}</h2>
              <CheckList items={included(MARKETING, t)} />
            </div>
            <div>
              <h2 className={s.h2}>{t('Not included')}</h2>
              <CheckList items={NOT_INCLUDED.map((x) => t(x))} tone="no" />
            </div>
          </div>
          <div className={s.ctaRow}>
            <EtsyButton design={d} placement="design-included" withPrice={price ? displayPrice(price) : null} m={m} />
            <TextLink href={m.href('/pricing')}>{t('Pricing details')}</TextLink>
          </div>
        </Container>
      </Section>

      <Section labelledBy="design-faq">
        <Container narrow>
          <h2 id="design-faq" className={s.h2}>
            {t('Questions about {name}', { name: d.name })}
          </h2>
          <FaqList items={faq} m={m} />
          <TextLink href={m.href('/faq')}>{t('All questions')}</TextLink>
        </Container>
      </Section>

      <Section labelledBy="related">
        <Container>
          <h2 id="related" className={s.h2}>
            {others.length ? t('Other designs') : t('Keep planning')}
          </h2>
          {others.length ? (
            <div className={s.cardGrid} data-fx-stagger>
              {others.map((o) => (
                <DesignCard key={o.id} design={o} placement="design-related" m={m} />
              ))}
            </div>
          ) : null}
          {related.length ? (
            <ul className={s.linkList}>
              {related.map((g) => (
                <li key={g!.slug}>
                  <a href={m.href(g!.path)}>{g!.title}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>

      {/* phones: the same order — Etsy (primary) first, the live demo second */}
      <div className={s.stickyBar}>
        <EtsyButton design={d} placement="design-sticky" m={m} />
        <a className={`${s.btn} ${s.btnSecondary}`} href={demoPath(d.id)} data-demo={d.id} data-demo-placement="design-sticky">
          <Play aria-hidden size={16} strokeWidth={2} />
          {t('Live demo')}
        </a>
      </div>

      <JsonLd
        data={graph(
          webPage(page, MARKETING, { mainEntity: { '@id': `${product(d, MARKETING, m)['@id']}` } }, m),
          product(d, MARKETING, m),
          videoObject(d, MARKETING, m),
          breadcrumbs(
            [
              { name: t('Home'), path: '/' },
              { name: t('Designs'), path: '/designs' },
              { name: d.name, path: page.path },
            ],
            MARKETING,
            m,
          ),
        )}
      />
    </>
  );
}
