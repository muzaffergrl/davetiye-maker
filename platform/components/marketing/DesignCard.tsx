// A design card (home strip, /designs, related designs; G066 comp u1_designs_390): the REAL envelope screen (the home
// screen fades in on hover), the name (link to the design page), the style line on wide cards, the Etsy price once it
// is real, and "Live demo" (opens the demo dialog; a plain link to the demo without JavaScript).
// G141: the media is interactive (CardOpening: the REAL opening recording plays on hover or after ▶), the live demo is a
// button ("Try the live demo"), and gallery cards carry a "Compare" tick (Compare.tsx).
import { Play } from 'lucide-react';
import type { Design } from '../../lib/marketing/designs.ts';
import { demoPath, designOgImage } from '../../lib/marketing/designs.ts';
import { enMarket, type Market } from '../../lib/marketing/i18n.ts';
import { realPrice } from '../../lib/marketing/placeholders.ts';
import { SHOWCASE_COPY } from '../../lib/marketing/showcase.ts';
import { displayPrice } from '../../lib/marketing/site.ts';
import { CardOpening } from './CardOpening.tsx';
import { EnvelopeCover, hasEnvelopeCover } from './InvitationCover.tsx';
import { designScreen, openingVideo } from './media.ts';
import s from './marketing.module.css';
import { Screen } from './ui.tsx';

export function DesignCard({
  design,
  placement,
  headingLevel = 3,
  styles,
  compare = false,
  m = enMarket,
}: {
  design: Design;
  placement: string;
  headingLevel?: 2 | 3;
  /** G121: the design's styles for the /designs filter (data-styles; CSS hides the cards of other styles). */
  styles?: readonly string[];
  /** G141: show the "Compare" tick (inside a DesignGallery, which hosts the comparison). */
  compare?: boolean;
  /** G144: the page language. */
  m?: Market;
}) {
  const { t } = m;
  const page = m.href(`/designs/${design.id}`);
  const env = designScreen(design.id, 'envelope');
  const home = designScreen(design.id, 'home');
  const v = openingVideo(design.id);
  const video = v ? { file: v.file, poster: v.poster, width: v.width, height: v.height } : null;
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const hasCover = hasEnvelopeCover(design.id);
  const price = realPrice(design.price);
  const sizes = '(min-width: 1024px) 220px, (min-width: 600px) 30vw, 34vw';
  return (
    <article className={hasCover ? s.designCard + ' ' + s.envelopeDesignCard : s.designCard} data-fx-spot data-status={design.status} data-styles={styles?.length ? styles.join(' ') : undefined}>
      <CardOpening href={page} name={design.name} video={video} copy={{ play: t(SHOWCASE_COPY.play), stop: t(SHOWCASE_COPY.stop) }}>
        {hasCover ? <EnvelopeCover design={design} /> : env ? <Screen file={env} alt="" sizes={sizes} className={s.cardScreen} /> : design.status === 'preview' ? <img src={designOgImage(design.id)} alt="" width={1200} height={630} loading="lazy" decoding="async" className={s.cardArtwork} /> : null}
        {home && !video ? <Screen file={home} alt="" sizes={sizes} className={`${s.cardScreen} ${s.cardScreenHover}`} /> : null}
      </CardOpening>
      <H className={s.designCardTitle}>
        <a href={page}>{design.name}</a>
      </H>
      {/* The style line shows on wider cards only (container query); phones get the comp's name-and-demo card. */}
      {design.status === 'preview' ? <p className={s.designCardStatus}>{t('Coming soon on Etsy')}</p> : null}
      <p className={s.designCardStyle}>{t(design.copy.style)}.</p>
      {price ? <p className={s.designCardPrice}>{t('{price} on Etsy', { price: displayPrice(price) })}</p> : null}
      <div className={s.cardFoot}>
        <a className={`${s.btn} ${s.btnSmall} ${s.cardDemo}`} href={demoPath(design.id)} data-demo={design.id} data-demo-placement={placement}>
          <Play aria-hidden size={14} strokeWidth={2} />
          <span className={s.cardDemoLong}>{t(SHOWCASE_COPY.liveDemo)}</span>
          <span className={s.cardDemoShort}>{t(SHOWCASE_COPY.liveDemoShort)}</span>
          <span className={s.visuallyHidden}>: {design.name}</span>
        </a>
        {compare ? (
          <label className={s.cardCompare}>
            <input type="checkbox" data-compare={design.id} />
            {t(SHOWCASE_COPY.compare)}
            <span className={s.visuallyHidden}> {design.name}</span>
          </label>
        ) : null}
      </div>
    </article>
  );
}
