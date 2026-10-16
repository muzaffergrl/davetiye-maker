'use client';
// A calm fade when the panel changes view (G089, K31; docs/16). Our own code, not React Bits: the panel is a work
// tool, so it gets one short opacity fade (no movement, no scale) when the hash route changes. Opacity only on
// purpose: a transform on the view would move the sticky publish bar and any fixed layer inside it.
// Not on the first render (nothing delays the first paint), not with prefers-reduced-motion.
import { useEffect, useRef, type RefObject } from 'react';

export const VIEW_FADE_MS = 180;

export function useViewFade(ref: RefObject<HTMLElement | null>, key: string) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el || typeof el.animate !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: VIEW_FADE_MS, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
    return () => a.cancel();
  }, [ref, key]);
}
