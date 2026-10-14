'use client';
// Live demo "facade" (docs/14 §9.7): the first load shows only a REAL poster screen; the theme's demo
// (/start/demo/<id>, ~1.2 MB of theme assets) loads only after a tap.
// - DemoHost (once, in the marketing layout): any <a data-demo="<id>"> opens the demo in a <dialog> (showModal: focus
//   stays inside, Esc closes, focus returns). Without JavaScript the link simply opens /start/demo/<id>.
// - HeroDemo: poster + design chips; on wide screens the demo loads in place, on phones it opens the dialog.
// Same origin only: theme responses allow frame-ancestors 'self' (lib/site/render.ts).

import { Play, RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '../../lib/marketing/analytics.ts';
import s from './marketing.module.css';

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

function EtsyAction({ d, placement }: { d: DemoDesign; placement: string }) {
  if (!d.etsyUrl) {
    return (
      <span className={`${s.btn} ${s.btnDisabled}`} aria-disabled="true">
        Coming soon on Etsy
      </span>
    );
  }
  return (
    <a className={s.btn} href={d.etsyUrl} onClick={() => track('etsy_click', { design: d.id, placement })}>
      Buy on Etsy
    </a>
  );
}

export function DemoHost({ designs }: { designs: DemoDesign[] }) {
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
              Live demo · {current.d.name}
            </p>
            <button type="button" className={s.iconButton} onClick={close} aria-label="Close the demo" autoFocus>
              <X aria-hidden size={22} strokeWidth={1.75} />
            </button>
          </div>
          <div className={s.dialogStage}>
            {wide ? (
              <ScaledFrame key={current.n} src={current.d.demoPath} title={`Live demo: ${current.d.name}`} fit="contain" />
            ) : (
              <iframe key={current.n} className={s.fullFrame} src={current.d.demoPath} title={`Live demo: ${current.d.name}`} />
            )}
          </div>
          <div className={s.dialogActions}>
            <a className={`${s.btn} ${s.btnSecondary}`} href={current.d.designPath}>
              See this design
            </a>
            <EtsyAction d={current.d} placement={`dialog-${current.placement}`} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * Hero with the live demo facade. `children` = the server-rendered text (eyebrow, H1, intro). The primary button and
 * the poster open the selected design: in place on wide screens (≥ 1024 px), in the dialog on phones and tablets.
 * Layout (G066 comps): phone = text, poster + design chips, buttons, fact strip; wide = text and buttons beside the
 * poster, the fact strip across the bottom.
 */
export function HeroDemo({
  designs,
  placement,
  primaryLabel,
  secondary,
  footnote,
  className,
  children,
}: {
  designs: DemoDesign[];
  placement: string;
  primaryLabel: string;
  secondary?: ReactNode;
  footnote?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [sel, setSel] = useState(0);
  const [inline, setInline] = useState<{ n: number } | null>(null);
  const d = designs[sel];

  const start = (from: string) => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setInline((x) => ({ n: (x?.n ?? 0) + 1 }));
      track('demo_open', { design: d.id, placement: `${placement}-${from}` });
    } else {
      window.dispatchEvent(new CustomEvent('mk:demo', { detail: { id: d.id, placement: `${placement}-${from}` } }));
    }
  };

  const choose = (i: number) => {
    setSel(i);
    setInline(null);
  };

  return (
    <div className={className ? `${s.hero} ${className}` : s.hero}>
      <div className={s.heroText}>{children}</div>
      <div className={s.heroVisual}>
        <div className={s.heroStage}>
          <div className={s.heroScreen}>
            {inline ? (
              <ScaledFrame key={`${d.id}-${inline.n}`} src={d.demoPath} title={`Live demo: ${d.name}`} fit="width" />
            ) : (
              <a
                className={s.posterButton}
                href={d.demoPath}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  e.preventDefault();
                  start('poster');
                }}
                aria-label={`Tap to open the live demo of ${d.name}`}
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
                  Tap to open
                </span>
              </a>
            )}
          </div>
        </div>
        {inline ? (
          <div className={s.inlineControls}>
            <button type="button" className={s.smallButton} onClick={() => setInline((x) => ({ n: (x?.n ?? 0) + 1 }))}>
              <RotateCcw aria-hidden size={16} strokeWidth={1.75} />
              Replay
            </button>
            <button type="button" className={s.smallButton} onClick={() => setInline(null)}>
              <X aria-hidden size={16} strokeWidth={1.75} />
              Close demo
            </button>
          </div>
        ) : null}
        {designs.length > 1 ? (
          <div className={s.chips} role="group" aria-label="Choose a design" data-scroll-x>
            {designs.map((x, i) => (
              <button key={x.id} type="button" className={s.chip} aria-pressed={i === sel} onClick={() => choose(i)}>
                {x.name}
              </button>
            ))}
          </div>
        ) : null}
        {designs.length > 1 ? (
          <p className={s.heroCaption}>
            <a href={d.designPath}>{d.name}</a>: {d.style.charAt(0).toLowerCase() + d.style.slice(1)}.
          </p>
        ) : null}
      </div>
      <div className={s.heroCta}>
        <a
          className={`${s.btn} ${s.btnLarge}`}
          href={d.demoPath}
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
