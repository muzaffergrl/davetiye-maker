// Serializable props for the client demo components (Demo.tsx), built on the server from config + assets.
import { MARKETING, type MarketingConfig } from '../../lib/marketing/config.ts';
import { demoPath, liveDesigns, openingObject } from '../../lib/marketing/designs.ts';
import { realEtsyUrl } from '../../lib/marketing/placeholders.ts';
import type { DemoDesign } from './Demo.tsx';
import { designScreen, largest, srcSet } from './media.ts';

export function demoDesigns(cfg: MarketingConfig = MARKETING): DemoDesign[] {
  return liveDesigns(cfg).map((d) => {
    const poster = designScreen(d.id, 'envelope');
    if (!poster) throw new Error(`no envelope screen for ${d.id} (run node scripts/marketing-assets.ts)`);
    return {
      id: d.id,
      name: d.name,
      style: d.copy.style,
      poster: {
        src: largest(poster),
        srcSet: srcSet(poster),
        width: poster.width,
        height: poster.height,
        alt: `${d.name}: the sealed ${openingObject(d.copy)} your guests see first, with the demo couple's names, ${d.copy.demoCouple}`,
      },
      demoPath: demoPath(d.id),
      designPath: `/designs/${d.id}`,
      etsyUrl: realEtsyUrl(d.etsyListingUrl),
    };
  });
}
