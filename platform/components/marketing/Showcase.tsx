// G141 (K45 item 7, "templates always in front"): the server parts of the interactive showcase.
// - DesignGallery: style chips (CSS-only filter, G121) + interactive design cards (CardOpening: the real opening plays
//   on hover / ▶) + "Compare" ticks and their host (Compare.tsx). Used by the home page and /designs.
// - OpeningsReel: one real opening recording per kind of opening (envelope, gatefold, pouch, wallet, book, sleeve).
// Data builders (compare, tour, openings): showcase-data.ts.
// Copy: lib/marketing/showcase.ts.
import { designStyles, STYLE_FILTER_MIN_DESIGNS, styleFilterChips, type Design } from '../../lib/marketing/designs.ts';
import { enMarket, thingIn, type Market } from '../../lib/marketing/i18n.ts';
import { compareCopy, DESIGN_GALLERY_COPY as G, EDIT_TOUR, OPENINGS_COPY, SHOWCASE_COPY } from '../../lib/marketing/showcase.ts';
import { CompareHost } from './Compare.tsx';
import { DesignCard } from './DesignCard.tsx';
import { LazyLoopVideo } from './LazyLoopVideo.tsx';
import s from './marketing.module.css';
import { designScreen, openingVideo, panelScreen } from './media.ts';
import { compareData, openingKinds } from './showcase-data.ts';
import { Screen } from './ui.tsx';
import { EnvelopeCover, hasEnvelopeCover } from './InvitationCover.tsx';

/** `id` keeps the radio names and the compare host of two galleries apart (unique per page). */
export function DesignGallery({
  designs,
  placement,
  id,
  headingLevel = 3,
  m = enMarket,
}: {
  designs: Design[];
  placement: string;
  id: string;
  headingLevel?: 2 | 3;
  m?: Market;
}) {
  const { t } = m;
  const chips = designs.length >= STYLE_FILTER_MIN_DESIGNS ? styleFilterChips(designs) : [];
  return (
    <div className={s.gallery} data-gallery={id}>
      {chips.length ? (
        <fieldset className={s.styleFilter} data-style-filter="" data-scroll-x="">
          <legend className={s.visuallyHidden}>{t(SHOWCASE_COPY.filterLegend)}</legend>
          <span className={s.filterItem}>
            <input type="radio" name={`${id}-style`} id={`${id}-style-all`} value="all" defaultChecked className={s.filterInput} />
            <label htmlFor={`${id}-style-all`} className={s.filterChip}>
              {t(SHOWCASE_COPY.filterAll)} <span className={s.filterCount}>{designs.length}</span>
            </label>
          </span>
          {chips.map((c) => (
            <span key={c.id} className={s.filterItem}>
              <input type="radio" name={`${id}-style`} id={`${id}-style-${c.id}`} value={c.id} className={s.filterInput} />
              <label htmlFor={`${id}-style-${c.id}`} className={s.filterChip}>
                {t(c.label)} <span className={s.filterCount}>{c.count}</span>
              </label>
            </span>
          ))}
        </fieldset>
      ) : null}
      <p className={s.galleryHint}>{t(SHOWCASE_COPY.hint)}</p>
      <div className={s.cardGrid} data-fx-stagger>
        {designs.map((d) => (
          <DesignCard
            key={d.id}
            design={d}
            placement={placement}
            headingLevel={headingLevel}
            styles={chips.length ? designStyles(d.id) : undefined}
            compare
            m={m}
          />
        ))}
      </div>
      <CompareHost designs={compareData(designs, m)} gallery={id} copy={compareCopy(t)} max={SHOWCASE_COPY.compareMax} />
    </div>
  );
}

export function OpeningsReel({ designs, m = enMarket }: { designs: readonly Design[]; m?: Market }) {
  const { t } = m;
  const kinds = openingKinds(designs);
  return (
    <>
      <ul className={s.reel} data-scroll-x data-fx-stagger>
        {kinds.map(({ design: d, thing: en }) => {
          const v = openingVideo(d.id)!;
          const thing = thingIn(t, en);
          return (
            <li key={d.id} className={s.reelItem}>
              <div className={s.reelVideo}>
                <LazyLoopVideo src={v.file} poster={v.poster} width={v.width} height={v.height} label={t('Screen recording: the {name} {thing} opens', { name: d.name, thing })} />
              </div>
              <p className={s.reelLabel}>
                <a href={m.href(`/designs/${d.id}`)}>{d.name}</a>
                <span className={s.reelThing}>{thing}</span>
              </p>
            </li>
          );
        })}
      </ul>
      <p className={s.small}>{t(OPENINGS_COPY.note)}</p>
    </>
  );
}

/**
 * Design page (G141, docs/18 §5): every real screen of the design in order (sealed → pages → reply form), then the
 * same panel editing it. A sideways strip on phones (scroll-snap, no JavaScript), a wrapped row on wide screens.
 */
export function DesignScreens({ design, m = enMarket }: { design: Design; m?: Market }) {
  const { t } = m;
  const screens = G.screens.flatMap((x) => {
    const f = designScreen(design.id, x.key);
    return f ? [{ ...x, f }] : [];
  });
  const panel = G.panel.map((key) => ({ step: EDIT_TOUR.find((st) => st.screen === key)!, f: panelScreen(key) }));
  return (
    <>
      <ul className={s.screenStrip} data-scroll-x aria-label={t(G.designLabel, { name: design.name })} tabIndex={0}>
        {hasEnvelopeCover(design.id) && screens.length === 0 ? (
          <li key="envelope-cover">
            <EnvelopeCover design={design} />
            <p className={s.stripLabel}>{t(G.screens[0].label)}</p>
          </li>
        ) : screens.map((x) => (
          <li key={x.key}>
            <Screen file={x.f} alt={t('{name}: {screen} (demo content)', { name: design.name, screen: t(x.label) })} sizes="(min-width: 1024px) 200px, 40vw" />
            <p className={s.stripLabel}>{t(x.label)}</p>
          </li>
        ))}
      </ul>
      <h3 className={s.h3}>{t(G.panelTitle)}</h3>
      <p className={s.muted}>{t(G.panelNote)}</p>
      <ul className={`${s.screenStrip} ${s.screenStripPanel}`} data-scroll-x aria-label={t(G.panelTitle)} tabIndex={0}>
        {panel.map(({ step, f }) => (
          <li key={step.screen}>
            <Screen file={f} alt={t(step.alt)} sizes="(min-width: 1024px) 180px, 36vw" />
            <p className={s.stripLabel}>{t(step.label)}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
