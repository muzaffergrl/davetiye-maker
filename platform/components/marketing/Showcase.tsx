// G141 (K45 item 7, "templates always in front"): the server parts of the interactive showcase.
// - DesignGallery: style chips (CSS-only filter, G121) + interactive design cards (CardOpening: the real opening plays
//   on hover / ▶) + "Compare" ticks and their host (Compare.tsx). Used by the home page and /designs.
// - OpeningsReel: one real opening recording per kind of opening (envelope, gatefold, pouch, wallet, book, sleeve).
// Data builders (compare, tour, openings): showcase-data.ts.
// Copy: lib/marketing/showcase.ts.
import { designStyles, STYLE_FILTER_MIN_DESIGNS, styleFilterChips, type Design } from '../../lib/marketing/designs.ts';
import { DESIGN_GALLERY_COPY as G, EDIT_TOUR, OPENINGS_COPY, SHOWCASE_COPY } from '../../lib/marketing/showcase.ts';
import { CompareHost } from './Compare.tsx';
import { DesignCard } from './DesignCard.tsx';
import { LazyLoopVideo } from './LazyLoopVideo.tsx';
import s from './marketing.module.css';
import { designScreen, openingVideo, panelScreen } from './media.ts';
import { compareData, openingKinds } from './showcase-data.ts';
import { Screen } from './ui.tsx';

/** `id` keeps the radio names and the compare host of two galleries apart (unique per page). */
export function DesignGallery({ designs, placement, id, headingLevel = 3 }: { designs: Design[]; placement: string; id: string; headingLevel?: 2 | 3 }) {
  const chips = designs.length >= STYLE_FILTER_MIN_DESIGNS ? styleFilterChips(designs) : [];
  return (
    <div className={s.gallery} data-gallery={id}>
      {chips.length ? (
        <fieldset className={s.styleFilter} data-style-filter="" data-scroll-x="">
          <legend className={s.visuallyHidden}>{SHOWCASE_COPY.filterLegend}</legend>
          <span className={s.filterItem}>
            <input type="radio" name={`${id}-style`} id={`${id}-style-all`} value="all" defaultChecked className={s.filterInput} />
            <label htmlFor={`${id}-style-all`} className={s.filterChip}>
              {SHOWCASE_COPY.filterAll} <span className={s.filterCount}>{designs.length}</span>
            </label>
          </span>
          {chips.map((c) => (
            <span key={c.id} className={s.filterItem}>
              <input type="radio" name={`${id}-style`} id={`${id}-style-${c.id}`} value={c.id} className={s.filterInput} />
              <label htmlFor={`${id}-style-${c.id}`} className={s.filterChip}>
                {c.label} <span className={s.filterCount}>{c.count}</span>
              </label>
            </span>
          ))}
        </fieldset>
      ) : null}
      <p className={s.galleryHint}>{SHOWCASE_COPY.hint}</p>
      <div className={s.cardGrid} data-fx-stagger>
        {designs.map((d) => (
          <DesignCard
            key={d.id}
            design={d}
            placement={placement}
            headingLevel={headingLevel}
            styles={chips.length ? designStyles(d.id) : undefined}
            compare
          />
        ))}
      </div>
      <CompareHost designs={compareData(designs)} gallery={id} />
    </div>
  );
}

export function OpeningsReel({ designs }: { designs: readonly Design[] }) {
  const kinds = openingKinds(designs);
  return (
    <>
      <ul className={s.reel} data-scroll-x data-fx-stagger>
        {kinds.map(({ design: d, thing }) => {
          const v = openingVideo(d.id)!;
          return (
            <li key={d.id} className={s.reelItem}>
              <div className={s.reelVideo}>
                <LazyLoopVideo src={v.file} poster={v.poster} width={v.width} height={v.height} label={`Screen recording: the ${d.name} ${thing} opens`} />
              </div>
              <p className={s.reelLabel}>
                <a href={`/designs/${d.id}`}>{d.name}</a>
                <span className={s.reelThing}>{thing}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <p className={s.small}>{OPENINGS_COPY.note}</p>
    </>
  );
}

/**
 * Design page (G141, docs/18 §5): every real screen of the design in order (sealed → pages → reply form), then the
 * same panel editing it. A sideways strip on phones (scroll-snap, no JavaScript), a wrapped row on wide screens.
 */
export function DesignScreens({ design }: { design: Design }) {
  const screens = G.screens.flatMap((x) => {
    const f = designScreen(design.id, x.key);
    return f ? [{ ...x, f }] : [];
  });
  const panel = G.panel.map((key) => ({ step: EDIT_TOUR.find((st) => st.screen === key)!, f: panelScreen(key) }));
  return (
    <>
      <ul className={s.screenStrip} data-scroll-x aria-label={G.designLabel(design.name)} tabIndex={0}>
        {screens.map((x) => (
          <li key={x.key}>
            <Screen file={x.f} alt={`${design.name}: ${x.label} (demo content)`} sizes="(min-width: 1024px) 200px, 40vw" />
            <p className={s.stripLabel}>{x.label}</p>
          </li>
        ))}
      </ul>
      <h3 className={s.h3}>{G.panelTitle}</h3>
      <p className={s.muted}>{G.panelNote}</p>
      <ul className={`${s.screenStrip} ${s.screenStripPanel}`} data-scroll-x aria-label={G.panelTitle} tabIndex={0}>
        {panel.map(({ step, f }) => (
          <li key={step.screen}>
            <Screen file={f} alt={step.alt} sizes="(min-width: 1024px) 180px, 36vw" />
            <p className={s.stripLabel}>{step.label}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
