'use client';
// G089 (K31): the sales site's motion layer — one small client component, no animation library. It only sets data
// attributes and CSS variables; every look lives in components/fx/fx.css.
//
// 1. Reveal on scroll (React Bits "AnimatedContent" / "FadeContent" idea): sections that start BELOW the first screen
//    get data-fx-reveal and fade up when they enter the viewport (data-fx-in); their [data-fx-stagger] / [data-fx-deal] children get
//    --fx-i for a staggered entrance. The first screen is never touched: its text and main button paint final at once.
// 2. Pointer depth (React Bits "SpotlightCard" + "TiltedCard" idea): on a fine pointer, [data-fx-spot] gets the
//    pointer position (--fx-x / --fx-y, a soft light under the cursor) and [data-fx-tilt] inside it a small 3D tilt
//    (--fx-rx / --fx-ry). Touch screens get a press effect in CSS instead.
// 3. /designs filter: the first change marks the gallery (data-fx-touched) so newly shown cards ease in.
// With prefers-reduced-motion nothing is hidden, tilted or marked; without JavaScript the page is the static page.
import { useEffect } from 'react';

const MAX_STAGGER = 8;

export function MotionRoot() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cleanups: Array<() => void> = [];

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            (e.target as HTMLElement).dataset.fxIn = '';
            io.unobserve(e.target);
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      const fold = window.innerHeight * 0.92;
      for (const sec of document.querySelectorAll<HTMLElement>('main > section')) {
        if (sec.getBoundingClientRect().top < fold) continue;
        for (const group of sec.querySelectorAll<HTMLElement>('[data-fx-stagger], [data-fx-deal]')) {
          Array.from(group.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--fx-i', String(Math.min(i, MAX_STAGGER))));
        }
        sec.dataset.fxReveal = '';
        io.observe(sec);
      }
      cleanups.push(() => io.disconnect());
    }

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let frame = 0;
      let last: HTMLElement | null = null;
      const reset = (el: HTMLElement) => {
        el.style.removeProperty('--fx-rx');
        el.style.removeProperty('--fx-ry');
      };
      const onMove = (ev: PointerEvent) => {
        const card = (ev.target as Element | null)?.closest<HTMLElement>('[data-fx-spot]') ?? null;
        if (last && last !== card) reset(last);
        last = card;
        if (!card) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const x = ev.clientX - r.left;
          const y = ev.clientY - r.top;
          card.style.setProperty('--fx-x', `${x.toFixed(0)}px`);
          card.style.setProperty('--fx-y', `${y.toFixed(0)}px`);
          // ±6° at the edges
          card.style.setProperty('--fx-rx', `${(((y / r.height) - 0.5) * -12).toFixed(2)}deg`);
          card.style.setProperty('--fx-ry', `${(((x / r.width) - 0.5) * 12).toFixed(2)}deg`);
        });
      };
      const onLeave = () => {
        if (last) reset(last);
        last = null;
      };
      document.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      cleanups.push(() => {
        cancelAnimationFrame(frame);
        document.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeave);
      });
    }

    const onChange = (ev: Event) => {
      const gallery = (ev.target as Element | null)?.closest<HTMLElement>('[data-gallery]');
      if (!gallery) return;
      gallery.querySelectorAll<HTMLElement>('[data-styles]').forEach((c, i) => c.style.setProperty('--fx-i', String(i % 6)));
      gallery.dataset.fxTouched = '';
    };
    document.addEventListener('change', onChange);
    cleanups.push(() => document.removeEventListener('change', onChange));

    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
