'use client';
// G141: compare designs side by side. The cards of a gallery carry <input type="checkbox" data-compare="<id>">; this
// host (one per gallery) listens to them, shows a tray with the picked names once one is ticked, and opens a <dialog>
// with the picked designs' REAL opening recordings playing together, their four pages and their live demo links.
// Up to SHOWCASE_COPY.compareMax designs (`max`): a further tick drops the oldest pick. Nothing loads before the dialog opens.
import { RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { interpolate } from '../../lib/i18n/translate.ts';
import type { CompareCopy } from '../../lib/marketing/showcase.ts';
import s from './marketing.module.css';

export interface CompareDesign {
  id: string;
  name: string;
  style: string;
  thing: string;
  designPath: string;
  demoPath: string;
  video: { file: string; poster: string; width: number; height: number } | null;
  pages: Array<{ name: string; src: string; srcSet: string; width: number; height: number }>;
}

/** G144: `copy` arrives translated from the server (compareCopy); `thing` and the page names too. */
export function CompareHost({ designs, gallery, copy: C, max }: { designs: CompareDesign[]; gallery: string; copy: CompareCopy; max: number }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches), []);

  // keep the checkboxes and the picked list in step
  useEffect(() => {
    const root = document.querySelector(`[data-gallery="${gallery}"]`);
    if (!root) return;
    const onChange = (e: Event) => {
      const el = e.target;
      if (!(el instanceof HTMLInputElement) || !el.dataset.compare) return;
      const id = el.dataset.compare;
      setPicked((p) => {
        if (!el.checked) return p.filter((x) => x !== id);
        const next = [...p.filter((x) => x !== id), id];
        return next.length > max ? next.slice(next.length - max) : next;
      });
    };
    root.addEventListener('change', onChange);
    return () => root.removeEventListener('change', onChange);
  }, [gallery, max]);

  useEffect(() => {
    const root = document.querySelector(`[data-gallery="${gallery}"]`);
    root?.querySelectorAll<HTMLInputElement>('input[data-compare]').forEach((el) => {
      el.checked = picked.includes(el.dataset.compare || '');
    });
    if (picked.length < 2 && open) dialog.current?.close();
  }, [picked, gallery, open]);

  useEffect(() => {
    const el = dialog.current;
    if (open && el && !el.open) el.showModal();
  }, [open]);

  const list = picked.map((id) => designs.find((d) => d.id === id)).filter((d): d is CompareDesign => !!d);
  const replay = () =>
    stage.current?.querySelectorAll('video').forEach((v) => {
      v.currentTime = 0;
      void v.play().catch(() => undefined);
    });

  if (!list.length) return null;
  return (
    <>
      <div className={s.compareTray} role="region" aria-label={C.compareTitle} data-compare-tray>
        <p className={s.compareTrayText} aria-live="polite">
          <strong>{list.length === 1 ? C.compareTrayOne : interpolate(C.compareTrayMany, { n: list.length })}</strong>
          <span className={s.compareTrayNames}>{list.map((d) => d.name).join(' · ')}</span>
        </p>
        <div className={s.compareTrayActions}>
          <button type="button" className={`${s.btn} ${s.btnSecondary} ${s.btnSmall}`} onClick={() => setPicked([])}>
            {C.compareClear}
          </button>
          <button
            type="button"
            className={`${s.btn} ${s.btnSmall}`}
            disabled={list.length < 2}
            onClick={() => {
              opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
              setOpen(true);
            }}
            data-compare-open
          >
            {C.compareOpen}
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className={s.compareDialog}
        aria-labelledby={`${gallery}-compare-title`}
        onClose={() => {
          setOpen(false);
          opener.current?.focus?.();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        {open ? (
          <div className={s.compareBody}>
            <div className={s.dialogBar}>
              <p id={`${gallery}-compare-title`} className={s.dialogTitle}>
                {C.compareTitle}
              </p>
              <button type="button" className={s.iconButton} onClick={replay} aria-label={C.replay}>
                <RotateCcw aria-hidden size={20} strokeWidth={1.75} />
              </button>
              <button type="button" className={s.iconButton} onClick={() => dialog.current?.close()} aria-label={C.compareClose} autoFocus>
                <X aria-hidden size={22} strokeWidth={1.75} />
              </button>
            </div>
            <div ref={stage} className={s.compareGrid} data-count={list.length}>
              {list.map((d) => (
                <section key={d.id} className={s.compareCol} aria-label={d.name}>
                  <h3 className={s.compareName}>{d.name}</h3>
                  <p className={s.compareStyle}>{d.style}</p>
                  {d.video ? (
                    <div className={s.compareVideo}>
                      <video
                        src={d.video.file}
                        poster={d.video.poster}
                        width={d.video.width}
                        height={d.video.height}
                        muted
                        loop
                        playsInline
                        autoPlay={!reduced}
                        controls={reduced}
                        aria-label={interpolate(C.recording, { name: d.name, thing: d.thing })}
                      />
                    </div>
                  ) : null}
                  <ul className={s.comparePages}>
                    {d.pages.map((p) => (
                      <li key={p.name}>
                        <img src={p.src} srcSet={p.srcSet} sizes="80px" width={p.width} height={p.height} alt={`${d.name}: ${p.name}`} loading="lazy" decoding="async" />
                      </li>
                    ))}
                  </ul>
                  <div className={s.compareActions}>
                    <a className={`${s.btn} ${s.btnSmall}`} href={d.demoPath} data-demo={d.id} data-demo-placement="compare">
                      {C.liveDemo}
                    </a>
                    <a className={s.compareLink} href={d.designPath}>
                      {C.seeDesign}
                    </a>
                  </div>
                </section>
              ))}
            </div>
            <p className={s.compareNote}>{C.compareNote}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
