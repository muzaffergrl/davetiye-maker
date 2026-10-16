// /designs/<id> — one design (docs/14 §6.3; G066 comp u1_design_detail_390). Static for every live design; anything
// else is a 404.
import { Play } from 'lucide-react';
import { notFound } from 'next/navigation';
import { HeroDemo } from '../../../../components/marketing/Demo.tsx';
import { DesignCard } from '../../../../components/marketing/DesignCard.tsx';
import { demoDesigns } from '../../../../components/marketing/demo-data.ts';
import { LoopVideo } from '../../../../components/marketing/LoopVideo.tsx';
import s from '../../../../components/marketing/marketing.module.css';
import { designScreen, openingVideo } from '../../../../components/marketing/media.ts';
import {
  Breadcrumbs,
  CheckList,
  Container,
  EtsyButton,
  Eyebrow,
  FaqList,
  JsonLd,
  LastUpdated,
  Screen,
  Section,
  Swatches,
  TextLink,
} from '../../../../components/marketing/ui.tsx';
import { MARKETING } from '../../../../lib/marketing/config.ts';
import { demoPath, designOgImage, liveDesign, liveDesigns, openingObject, startPath } from '../../../../lib/marketing/designs.ts';
import { EDITABLE, FIXED, included, LIMITS, NOT_INCLUDED, SITE_PAGES } from '../../../../lib/marketing/facts.ts';
import { loadGuide } from '../../../../lib/marketing/guides.ts';
import { realPrice } from '../../../../lib/marketing/placeholders.ts';
import { breadcrumbs, graph, product, videoObject, webPage } from '../../../../lib/marketing/schema.ts';
import { pageMetadata } from '../../../../lib/marketing/seo.ts';
import { designPage, displayPrice } from '../../../../lib/marketing/site.ts';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return liveDesigns().map((d) => ({ design: d.id }));
}

type Props = { params: Promise<{ design: string }> };

export async function generateMetadata({ params }: Props) {
  const { design } = await params;
  const page = designPage(design);
  if (!page) return {};
  const d = liveDesign(design)!;
  return pageMetadata(page, {
    image: { url: designOgImage(d.id), width: 1200, height: 630, alt: `${d.name} wedding website artwork: ${d.copy.style.toLowerCase()}` },
  });
}

function designFaq(name: string, thing: string) {
  return [
    {
      id: 'colors',
      q: `Can I change the colors of ${name}?`,
      a: `No. The artwork, colors and fonts stay as designed, because the ${thing}, cards and frames are painted to match. You change the content: names, details, photos and questions. [See all designs](/designs) to compare palettes.`,
    },
    {
      id: 'photos',
      q: 'How many photos can I add?',
      a: `${LIMITS.photoSpots}: a portrait on the invitation card, ${LIMITS.storyPhotos} photos for Our Story and one of the venue. You crop each one to its frame in the panel, on your phone. Our Story can be switched off if you prefer fewer photos.`,
    },
    {
      id: 'no-photos',
      q: 'Does it work without photos?',
      a: `Yes. Until you add your own, each photo spot shows a soft, neutral image made from the design's artwork, never a sample couple. The "Your photo here" label is only visible to you in preview, not to guests.`,
    },
    {
      id: 'save-the-date',
      q: 'Is there a matching save the date?',
      a: `Not yet. You can share your website link early, as a digital save the date, and add the full details later: guests always see the latest version. [Read about timing](/guides/when-to-send-your-wedding-website).`,
    },
  ];
}

export default async function DesignPage({ params }: Props) {
  const { design: id } = await params;
  const d = liveDesign(id);
  const page = designPage(id);
  if (!d || !page) notFound();
  const demo = demoDesigns().filter((x) => x.id === d.id);
  const video = openingVideo(d.id);
  const price = realPrice(d.price);
  const others = liveDesigns().filter((x) => x.id !== d.id);
  const related = d.copy.relatedGuides.map((g) => loadGuide(g)).filter((g) => !!g);
  // G099: what guests tap first here (envelope, gatefold, pouch, wallet, book or sleeve), from the design's own opening
  const thing = openingObject(d.copy);
  const faq = designFaq(d.name, thing);
  const etsyPrice = price ? displayPrice(price) : null;

  return (
    <>
      <Section className={s.heroSection}>
        <Container>
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'Designs', href: '/designs' },
              { name: d.name, href: page.path },
            ]}
          />
          {/* G099 (docs/18 §5 P1): large preview, a short summary and ONE primary action — Buy on Etsy ("Coming soon on
              Etsy", not a link, while the listing link is a placeholder); the live demo is the secondary action. */}
          <HeroDemo
            designs={demo}
            placement="design-hero"
            primaryLabel="View live demo"
            demoVariant="secondary"
            action={<EtsyButton design={d} placement="design-hero" className={s.btnLarge} withPrice={etsyPrice} />}
            className={`${s.heroStickyActions} ${s.heroDesign}`}
            footnote={
              <p className={s.small}>
                <a href={startPath(d.id)} data-track="start_click" data-track-design={d.id}>
                  Already bought it? Start your website
                </a>
              </p>
            }
          >
            <h1 className={s.h1}>{page.h1}</h1>
            <p className={s.lead}>{d.copy.style}.</p>
          </HeroDemo>
        </Container>
      </Section>

      <Section labelledBy="pages" className={s.pagesSection}>
        <Container>
          <h2 id="pages" className={s.h2}>
            What your guests see after the {thing} opens
          </h2>
          <p className={s.lead}>{d.copy.intro}</p>
          <ul className={s.thumbRow} data-fx-deal>
            {SITE_PAGES.map((p) => {
              const file = designScreen(d.id, p.key);
              return (
                <li key={p.key}>
                  {file ? <Screen file={file} alt={`${d.name}: ${p.name} page with demo content`} sizes="(min-width: 1024px) 220px, 22vw" className={s.thumb} /> : null}
                  <p className={s.thumbLabel}>{p.name}</p>
                </li>
              );
            })}
          </ul>
          <dl className={s.pageNotes}>
            {SITE_PAGES.map((p) => (
              <div key={p.key}>
                <dt>{p.name}</dt>
                <dd>{d.copy.pages[p.key]}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <Section labelledBy="change">
        <Container>
          <div className={s.twoCol}>
            <div>
              <h2 id="change" className={s.h2}>
                What you can edit
              </h2>
              <CheckList items={EDITABLE} />
            </div>
            <div>
              <h2 className={s.h2}>What stays the same</h2>
              <CheckList items={FIXED} tone="no" />
              <h3 className={s.h3}>Details</h3>
              <dl className={s.specs}>
                <div>
                  <dt>Colors</dt>
                  <dd>
                    <Swatches palette={d.copy.palette} />
                  </dd>
                </div>
                <div>
                  <dt>Fonts</dt>
                  <dd>{d.copy.fonts.join(', ')}</dd>
                </div>
                <div>
                  <dt>Pages</dt>
                  <dd>
                    {thing.charAt(0).toUpperCase() + thing.slice(1)} opening, {SITE_PAGES.map((p) => p.name).join(', ')}
                  </dd>
                </div>
                <div>
                  <dt>Photos</dt>
                  <dd>{LIMITS.photoSpots} spots, cropped in the panel</dd>
                </div>
                <div>
                  <dt>Date style</dt>
                  <dd>US, UK, Canadian or Australian (June 12, 2027 or 12 June 2027)</dd>
                </div>
                <div>
                  <dt>Screens</dt>
                  <dd>Made for phones; also checked at tablet and computer widths</dd>
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
                  <LoopVideo src={video.file} poster={video.poster} width={video.width} height={video.height} label={`Screen recording: the ${d.name} ${thing} opens`} />
                </div>
              ) : null}
            </div>
            <div className={s.splitText}>
              <Eyebrow>The opening</Eyebrow>
              <h2 id="opening" className={s.h2}>
                How {d.name} opens
              </h2>
              <p className={s.lead}>{d.copy.opening}</p>
              <p className={s.muted}>
                This is a real screen recording of the design with demo content ({d.copy.demoCouple} are fictional). Guests can
                skip the animation, and on a phone set to reduce motion a tap goes straight to the home page.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="included">
        <Container>
          <div className={s.twoCol}>
            <div id="included">
              <h2 className={s.h2}>Included</h2>
              <CheckList items={included()} />
            </div>
            <div>
              <h2 className={s.h2}>Not included</h2>
              <CheckList items={NOT_INCLUDED} tone="no" />
            </div>
          </div>
          <div className={s.ctaRow}>
            <EtsyButton design={d} placement="design-included" withPrice={price ? displayPrice(price) : null} />
            <TextLink href="/pricing">Pricing details</TextLink>
          </div>
        </Container>
      </Section>

      <Section labelledBy="design-faq">
        <Container narrow>
          <h2 id="design-faq" className={s.h2}>
            Questions about {d.name}
          </h2>
          <FaqList items={faq} />
          <TextLink href="/faq">All questions</TextLink>
        </Container>
      </Section>

      <Section labelledBy="related">
        <Container>
          <h2 id="related" className={s.h2}>
            {others.length ? 'Other designs' : 'Keep planning'}
          </h2>
          {others.length ? (
            <div className={s.cardGrid} data-fx-stagger>
              {others.map((o) => (
                <DesignCard key={o.id} design={o} placement="design-related" />
              ))}
            </div>
          ) : null}
          {related.length ? (
            <ul className={s.linkList}>
              {related.map((g) => (
                <li key={g!.slug}>
                  <a href={g!.path}>{g!.title}</a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </Section>

      {/* phones: the same order — Etsy (primary) first, the live demo second */}
      <div className={s.stickyBar}>
        <EtsyButton design={d} placement="design-sticky" />
        <a className={`${s.btn} ${s.btnSecondary}`} href={demoPath(d.id)} data-demo={d.id} data-demo-placement="design-sticky">
          <Play aria-hidden size={16} strokeWidth={2} />
          Live demo
        </a>
      </div>

      <JsonLd
        data={graph(
          webPage(page, MARKETING, { mainEntity: { '@id': `${product(d)['@id']}` } }),
          product(d),
          videoObject(d),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Designs', path: '/designs' },
            { name: d.name, path: page.path },
          ]),
        )}
      />
    </>
  );
}
