'use client';
// Click events for links that are plain server-rendered anchors: <a data-track="etsy_click" data-track-design="…">.
// One document listener; no personal data (docs/14 §9.9).
import { useEffect } from 'react';
import { track, type MarketingEvent } from '../../lib/marketing/analytics.ts';

export function Tracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target.closest('[data-track]') : null;
      if (!el) return;
      const data: Record<string, string> = {};
      for (const a of Array.from(el.attributes)) {
        if (a.name.startsWith('data-track-')) data[a.name.slice('data-track-'.length)] = a.value;
      }
      track(el.getAttribute('data-track') as MarketingEvent, data);
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
