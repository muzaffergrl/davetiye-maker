'use client';
// Sections that rise into view while the visitor scrolls (G089, K31). Our own code, not React Bits: React Bits Pro has
// no light "reveal on scroll" component (its scroll pieces are image/stack effects with their own markup), and this
// needs no library.
//
// One host for the whole page (mounted once in the marketing layout) instead of a wrapper per section, so the pages
// stay server components. Rules that keep it safe:
// - The HTML is complete and visible. Only after hydration, and only for blocks that are still BELOW the first
//   screen, the host sets data-reveal="wait" (hidden, 20 px lower); what is already on screen is never touched, so no
//   flash and no later LCP.
// - Each block shows once (data-reveal="in") the first time it reaches the screen; scrolling back never hides it.
// - prefers-reduced-motion, no IntersectionObserver, or no JavaScript: nothing is hidden at all.
// - Only opacity and transform change: no layout shift (CLS 0).
import { useEffect } from 'react';
import { revealDelay, revealTargets } from './fx.ts';

export function RevealOnScroll({ selector }: { selector: string }) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const below = revealTargets(
      els.map((el) => el.getBoundingClientRect().top),
      window.innerHeight,
    ).map((i) => els[i]);
    if (!below.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Blocks that arrive together (a fast scroll, a short section) follow each other by 70 ms, at most 4 steps.
        let k = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.transitionDelay = `${revealDelay(k++)}ms`;
          el.dataset.reveal = 'in';
          io.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -6% 0px' },
    );
    for (const el of below) {
      el.dataset.reveal = 'wait';
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of below) {
        delete el.dataset.reveal;
        el.style.transitionDelay = '';
      }
    };
  }, [selector]);
  return null;
}
