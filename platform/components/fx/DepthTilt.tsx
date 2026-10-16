'use client';
// A gentle 3D tilt that follows the mouse (G089, K31). Adapted from React Bits Pro "Depth Card" (registry item
// depth-card-css, https://pro.reactbits.dev/docs/components/depth-card).
// License: React Bits Pro, single-developer license of this project's owner (https://pro.reactbits.dev/license). Allowed:
// use and modify inside our own product. Not allowed: publishing this source (public repo, gist, starter kit) or giving
// it out as a reusable component. Keep this repository private.
//
// G089 changes to the original: only the tilt is kept (no background layers, no spotlight, no fixed card size, no
// title overlay; the card's own markup stays as it is). The tilt is small (6° instead of 20°), runs only for a mouse on
// a device that hovers, and is off with prefers-reduced-motion. The original's animation frame loop runs all the time;
// here it runs only while the card is moving and stops once it has settled. Touch screens get nothing from this file.
import { useEffect, useRef, type ReactNode } from 'react';
import { tiltFor } from './fx.ts';
import s from './fx.module.css';

const FINE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

export function DepthTilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(FINE);
    const cur = { rx: 0, ry: 0 };
    let tgt = { rx: 0, ry: 0 };
    let raf = 0;

    const frame = () => {
      // The original's easing: move a tenth of the way each frame (lerp 0.1).
      cur.rx += (tgt.rx - cur.rx) * 0.1;
      cur.ry += (tgt.ry - cur.ry) * 0.1;
      const settled = Math.abs(tgt.rx - cur.rx) < 0.02 && Math.abs(tgt.ry - cur.ry) < 0.02;
      if (settled && tgt.rx === 0 && tgt.ry === 0) {
        el.style.transform = '';
        el.removeAttribute('data-tilting');
        raf = 0;
        return;
      }
      el.style.transform = `perspective(900px) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      raf = settled ? 0 : requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !mq.matches) return;
      const r = el.getBoundingClientRect();
      tgt = tiltFor(e.clientX - r.left, e.clientY - r.top, r.width, r.height, max);
      el.setAttribute('data-tilting', '');
      kick();
    };
    const leave = () => {
      tgt = { rx: 0, ry: 0 };
      kick();
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [max]);

  return (
    <div ref={ref} className={className ? `${s.tilt} ${className}` : s.tilt} data-fx="tilt">
      {children}
    </div>
  );
}
