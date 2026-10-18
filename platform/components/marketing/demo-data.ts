// Serializable props for the client demo components (Demo.tsx), built on the server from config + assets.
// G144: in the page language (`m`); the design links keep its prefix.
import { MARKETING, type MarketingConfig } from '../../lib/marketing/config.ts';
import { demoPath, designOgImage, liveDesigns, openingObject, type Design } from '../../lib/marketing/designs.ts';
import { enMarket, thingIn, type Market, type T } from '../../lib/marketing/i18n.ts';
import { designPalettes } from '../../lib/marketing/palettes.ts';
import { realEtsyUrl } from '../../lib/marketing/placeholders.ts';
import type { DemoCopy, DemoDesign } from './Demo.tsx';
import { designScreen, largest, srcSet } from './media.ts';

export function demoDesigns(cfg: MarketingConfig = MARKETING, m: Market = enMarket, sourceDesigns: readonly Design[] = liveDesigns(cfg)): DemoDesign[] {
  const { t } = m;
  return sourceDesigns.map((d) => {
    const poster = designScreen(d.id, 'envelope');
    const posterUrl = poster ? largest(poster) : designOgImage(d.id);
    const posterSrcSet = poster ? srcSet(poster) : `${posterUrl} 1200w`;
    return {
      id: d.id,
      name: d.name,
      style: t(d.copy.style),
      poster: {
        src: posterUrl,
        srcSet: posterSrcSet,
        width: poster?.width ?? 1200,
        height: poster?.height ?? 630,
        alt: t("{name}: the sealed {thing} your guests see first, with the demo couple's names, {couple}", {
          name: d.name,
          thing: thingIn(t, openingObject(d.copy)),
          couple: d.copy.demoCouple,
        }),
      },
      demoPath: demoPath(d.id),
      designPath: m.href(`/designs/${d.id}`),
      etsyUrl: realEtsyUrl(d.etsyListingUrl),
      // G153: the design's live color palettes (the original first; translated name), [] when it has none
      palettes: designPalettes(d.id, d.copy.palette.map((c) => c.hex)).map((p) => (p.id === null ? { ...p, name: t('Original') } : p)),
    };
  });
}

/** G144: the demo's words in the page language ({name} / {n} are filled in the browser). */
export function demoCopy(t: T = enMarket.t): DemoCopy {
  return {
    dialogTitle: t('Live demo · {name}'),
    close: t('Close the demo'),
    frameTitle: t('Live demo: {name}'),
    seeDesign: t('See this design'),
    comingSoon: t('Coming soon on Etsy'),
    buy: t('Buy on Etsy'),
    posterLabel: t('Tap to open the live demo of {name}'),
    tapToOpen: t('Tap to open'),
    replay: t('Replay'),
    closeInline: t('Close demo'),
    chooseDesign: t('Choose a design'),
    showMore: t('Show {n} more designs'),
    more: t('+{n} more'),
    palette: t('Color palette'),
    paletteShown: t('Live demo in {name}'),
  };
}
