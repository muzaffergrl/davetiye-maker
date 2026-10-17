'use client';
// Live demo "facade" (docs/14 §9.7): the first load shows only a REAL poster screen; the theme's demo
// (/start/demo/<id>, ~1.2 MB of theme assets) loads only after a tap.
// - DemoHost (once, in the marketing layout): any <a data-demo="<id>"> opens the demo in a <dialog> (showModal: focus
//   stays inside, Esc closes, focus returns). Without JavaScript the link simply opens /start/demo/<id>.
// - HeroDemo: poster + design chips; on wide screens the demo loads in place, on phones it opens the dialog.
// Same origin only: theme responses allow frame-ancestors 'self' (lib/site/render.ts).

import { Play, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { interpolate } from '../../lib/i18n/translate.ts';
import { track } from '../../lib/marketing/analytics.ts';
import s from './marketing.module.css';

/**
 * G144: the demo's own words, translated on the server (demoCopy in demo-data.ts) — the browser gets only the page
 * language. {name} / {n} are filled here.
 */
export type DemoCopy = Record<
  | 'dialogTitle'
  | 'close'
  | 'frameTitle'
  | 'seeDesign'
  | 'comingSoon'
  | 'buy'
  | 'posterLabel'
  | 'tapToOpen'
  | 'replay'
  | 'closeInline'
  | 'chooseDesign'
  | 'showMore'
  | 'more',
  string
>;

export interface DemoDesign {
  id: string;
  name: string;
  style: string;
  poster: { src: string; srcSet: string; width: number; height: number; alt: string };
  demoPath: string;
  designPath: string;
  /** Real Etsy listing link, or null while it is a placeholder. */
  etsyUrl: string | null;
}

/** G094: design chips shown before "+N more" on wide screens when there are more than eight designs. */
const CHIPS_WIDE = 7;
const FRAME_W = 390;
const FRAME_H = 844;
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** A 390 × 844 iframe scaled to the width of its box (box keeps the phone's aspect ratio in CSS). */
function ScaledFrame({ src, title, fit }: { src: string; title: string; fit: 'width' | 'contain' }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useIsoLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const next = fit === 'width' ? r.width / FRAME_W : Math.min(r.width / FRAME_W, r.height / FRAME_H);
      setK(Math.max(0.2, Math.min(1, next)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);
  return (
    <div ref={box} className={fit === 'width' ? s.scaledBox : s.containBox}>
      <div className={s.scaledInner} style={{ width: FRAME_W * k, height: FRAME_H * k }}>
        <iframe
          src={src}
          title={title}
          width={FRAME_W}
          height={FRAME_H}
          style={{ transform: `scale(${k})`, visibility: k ? 'visible' : 'hidden' }}
          className={s.scaledFrame}
        />
      </div>
    </div>
  );
}

function EtsyAction({ d, placement, copy }: { d: DemoDesign; placement: string; copy: DemoCopy }) {
  if (!d.etsyUrl) {
    return (
      <span className={`${s.btn} ${s.btnDisabled}`} aria-disabled="true">
        {copy.comingSoon}
      </span>
    );
  }
  return (
    <a className={s.btn} href={d.etsyUrl} onClick={() => track('etsy_click', { design: d.id, placement })}>
      {copy.buy}
    </a>
  );
}

export function DemoHost({ designs, copy }: { designs: DemoDesign[]; copy: DemoCopy }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [current, setCurrent] = useState<{ d: DemoDesign; placement: string; n: number } | null>(null);
  const [wide, setWide] = useState(false);

  const open = useCallback(
    (id: string, placement: string) => {
      const d = designs.find((x) => x.id === id);
      if (!d) return false;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setWide(window.matchMedia('(min-width: 768px)').matches);
      setCurrent((c) => ({ d, placement, n: (c?.n ?? 0) + 1 }));
      track('demo_open', { design: id, placement });
      return true;
    },
    [designs],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[data-demo]') : null;
      if (!a) return;
      if (open(a.getAttribute('data-demo') || '', a.getAttribute('data-demo-placement') || 'link')) e.preventDefault();
    };
    const onEvent = (e: Event) => {
      const { id, placement } = (e as CustomEvent<{ id: string; placement: string }>).detail;
      open(id, placement);
    };
    document.addEventListener('click', onClick);
    window.addEventListener('mk:demo', onEvent);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('mk:demo', onEvent);
    };
  }, [open]);

  useEffect(() => {
    const el = dialog.current;
    if (current && el && !el.open) el.showModal();
  }, [current]);

  const close = () => dialog.current?.close();
  const onClose = () => {
    setCurrent(null);
    opener.current?.focus?.();
  };

  return (
    <dialog
      ref={dialog}
      className={s.demoDialog}
      aria-labelledby="mk-demo-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) close(); // click on the backdrop
      }}
    >
      {current ? (
        <div className={s.dialogBody}>
          <div className={s.dialogBar}>
            <p id="mk-demo-title" className={s.dialogTitle}>
              {interpolate(copy.dialogTitle, { name: current.d.name })}
            </p>
            <button type="button" className={s.iconButton} onClick={close} aria-label={copy.close} autoFocus>
              <X aria-hidden size={22} strokeWidth={1.75} />
            </button>
          </div>
          <div className={s.dialogStage}>
            {wide ? (
              <ScaledFrame key={current.n} src={current.d.demoPath} title={interpolate(copy.frameTitle, { name: current.d.name })} fit="contain" />
            ) : (
              <iframe key={current.n} className={s.fullFrame} src={current.d.demoPath} title={interpolate(copy.frameTitle, { name: current.d.name })} />
            )}
          </div>
          <div className={s.dialogActions}>
            <a className={`${s.btn} ${s.btnSecondary}`} href={current.d.designPath}>
              {copy.seeDesign}
            </a>
            <EtsyAction d={current.d} placement={`dialog-${current.placement}`} copy={copy} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * Hero with the live demo facade. `children` = the server-rendered text (eyebrow, H1, intro). The primary button and
 * the poster open the selected design: in place on wide screens (≥ 1024 px), in the dialog on phones and tablets.
 * Layout (G066 comps): phone = text, poster + design chips, buttons, fact strip; wide = text, design chips (G093) and
 * buttons beside the poster, the fact strip across the bottom.
 * G099: `action` (a design page's Etsy button) comes first and is the one primary action; `demoVariant="secondary"` then
 * draws the demo button as the secondary one (docs/18 §5: one primary action per design page).
 */
export function HeroDemo({
  designs,
  placement,
  primaryLabel,
  action,
  demoVariant = 'primary',
  secondary,
  footnote,
  className,
  copy,
  children,
}: {
  designs: DemoDesign[];
  copy: DemoCopy;
  placement: string;
  primaryLabel: string;
  action?: ReactNode;
  demoVariant?: 'primary' | 'secondary';
  secondary?: ReactNode;
  footnote?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [sel, setSel] = useState(0);
  const [inline, setInline] = useState<{ n: number } | null>(null);
  const [allChips, setAllChips] = useState(false);
  // G089: set once a chip changes the design, so the new poster eases in (the first poster is the LCP image: never)
  const [swapped, setSwapped] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const d = designs[sel];
  // G094: up to eight names show in full on wide screens (two rows at 1280 px, G093); beyond that, the first
  // CHIPS_WIDE and a "+N more" chip
  const collapse = designs.length > 8 && !allChips;

  const start = (from: string) => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setInline((x) => ({ n: (x?.n ?? 0) + 1 }));
      track('demo_open', { design: d.id, placement: `${placement}-${from}` });
    } else {
      window.dispatchEvent(new CustomEvent('mk:demo', { detail: { id: d.id, placement: `${placement}-${from}` } }));
    }
  };

  const choose = (i: number) => {
    setSwapped(true);
    setSel(i);
    setInline(null);
  };

  return (
    <div className={className ? `${s.hero} ${className}` : s.hero}>
      <div className={s.heroText}>{children}</div>
      <div className={s.heroVisual}>
        <div className={s.heroStage} data-fx-glow>
          <div className={s.heroScreen} data-fx-swap={swapped || undefined}>
            {inline ? (
              <ScaledFrame key={`${d.id}-${inline.n}`} src={d.demoPath} title={interpolate(copy.frameTitle, { name: d.name })} fit="width" />
            ) : (
              <a
                className={s.posterButton}
                href={d.demoPath}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  start('poster');
                }}
                aria-label={interpolate(copy.posterLabel, { name: d.name })}
              >
                <img
                  key={d.id}
                  src={d.poster.src}
                  srcSet={d.poster.srcSet}
                  sizes="(min-width: 1024px) 300px, (min-width: 600px) 220px, 46vw"
                  width={d.poster.width}
                  height={d.poster.height}
                  alt={d.poster.alt}
                  fetchPriority={sel === 0 ? 'high' : 'auto'}
                  loading="eager"
                  decoding="async"
                />
                <span className={s.tapLabel}>
                  <Play aria-hidden size={14} strokeWidth={2} />
                  {copy.tapToOpen}
                </span>
              </a>
            )}
          </div>
        </div>
        {inline ? (
          <div className={s.inlineControls}>
            <button type="button" className={s.smallButton} onClick={() => setInline((x) => ({ n: (x?.n ?? 0) + 1 }))}>
              <RotateCcw aria-hidden size={16} strokeWidth={1.75} />
              {copy.replay}
            </button>
            <button type="button" className={s.smallButton} onClick={() => setInline(null)}>
              <X aria-hidden size={16} strokeWidth={1.75} />
              {copy.closeInline}
            </button>
          </div>
        ) : null}
        {designs.length > 1 ? (
          <p className={s.heroCaption}>
            <a href={d.designPath}>{d.name}</a>: {d.style.charAt(0).toLowerCase() + d.style.slice(1)}.
          </p>
        ) : null}
      </div>
      {/* G093: the chips are their own grid item — under the poster on phones and tablets, in the text column above
          the main button on wide screens (eight names wrapped to four rows under the poster at 1280 px and pushed the
          button out of the first screen). */}
      {/* G094: with more than eight designs, wide screens show the first CHIPS_WIDE names and a "+N more" chip that
          reveals the rest (fourteen names wrapped to four rows and pushed the main button below the first screen at
          1280 × 800). Phones and tablets keep every chip in the sideways strip; the more chip is hidden there. */}
      {designs.length > 1 ? (
        <div ref={chipsRef} className={s.chips} role="group" aria-label={copy.chooseDesign} data-scroll-x data-all={collapse ? undefined : ''}>
          {designs.map((x, i) => (
            <button
              key={x.id}
              type="button"
              className={i >= CHIPS_WIDE ? `${s.chip} ${s.chipExtra}` : s.chip}
              aria-pressed={i === sel}
              onClick={() => choose(i)}
            >
              {x.name}
            </button>
          ))}
          {collapse ? (
            <button
              type="button"
              className={`${s.chip} ${s.chipMore}`}
              aria-label={interpolate(copy.showMore, { n: designs.length - CHIPS_WIDE })}
              onClick={() => {
                setAllChips(true);
                // the more chip goes away: focus moves to the first name it revealed
                requestAnimationFrame(() => chipsRef.current?.querySelectorAll('button')[CHIPS_WIDE]?.focus());
              }}
            >
              {interpolate(copy.more, { n: designs.length - CHIPS_WIDE })}
            </button>
          ) : null}
        </div>
      ) : null}
      <div className={s.heroCta}>
        {action}
        <a
          className={demoVariant === 'secondary' ? `${s.btn} ${s.btnSecondary} ${s.btnLarge}` : `${s.btn} ${s.btnLarge}`}
          href={d.demoPath}
          data-fx-sheen={demoVariant === 'secondary' ? undefined : ''}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            start('button');
          }}
        >
          {primaryLabel}
        </a>
        {secondary}
      </div>
      {footnote ? <div className={s.heroFoot}>{footnote}</div> : null}
    </div>
  );
}
