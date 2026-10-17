// G141: serializable data for the showcase (Showcase.tsx and its client parts), built on the server from config +
// the asset manifest. A .ts file so `npm test` can import it.
// G144: in the page language (`m`): names of pages and openings translated, design links with the language prefix.
import { demoPath, openingObject, type Design } from '../../lib/marketing/designs.ts';
import { SITE_PAGES } from '../../lib/marketing/facts.ts';
import { enMarket, thingIn, type Market, type T } from '../../lib/marketing/i18n.ts';
import { EDIT_TOUR } from '../../lib/marketing/showcase.ts';
import type { CompareDesign } from './Compare.tsx';
import type { TourStepData } from './EditTour.tsx';
import { designScreen, largest, openingVideo, panelScreen, srcSet } from './media.ts';

export function compareData(designs: readonly Design[], m: Market = enMarket): CompareDesign[] {
  const { t } = m;
  return designs.map((d) => {
    const v = openingVideo(d.id);
    return {
      id: d.id,
      name: d.name,
      style: t(d.copy.style),
      thing: thingIn(t, openingObject(d.copy)),
      designPath: m.href(`/designs/${d.id}`),
      demoPath: demoPath(d.id),
      video: v ? { file: v.file, poster: v.poster, width: v.width, height: v.height } : null,
      pages: SITE_PAGES.flatMap((p) => {
        const f = designScreen(d.id, p.key);
        return f ? [{ name: t(p.name), src: largest(f), srcSet: srcSet(f), width: f.width, height: f.height }] : [];
      }),
    };
  });
}

export function tourSteps(t: T = enMarket.t): TourStepData[] {
  return EDIT_TOUR.map((st) => {
    const f = panelScreen(st.screen);
    return {
      label: t(st.label),
      title: t(st.title),
      text: t(st.text, st.vars),
      alt: t(st.alt),
      img: { src: largest(f), srcSet: srcSet(f), width: f.width, height: f.height },
    };
  });
}

/** The first live design of each kind of opening, in config order (at most `max`). `thing` is the English word. */
export function openingKinds(designs: readonly Design[], max = 6): Array<{ design: Design; thing: string }> {
  const seen = new Set<string>();
  const out: Array<{ design: Design; thing: string }> = [];
  for (const d of designs) {
    const thing = openingObject(d.copy);
    if (seen.has(thing) || !openingVideo(d.id)) continue;
    seen.add(thing);
    out.push({ design: d, thing });
    if (out.length === max) break;
  }
  return out;
}
