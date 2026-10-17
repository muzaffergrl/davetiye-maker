// The live demo's sample photos (G155, G090 P1-02): /start/demo/<theme> shows the design's own fictional PAKET 2
// photos (collections/<NN>/assets/gpt/photos/<slot key>.*) instead of empty "your photo here" frames, as the listing
// promises ("sample names and photos").
//
// The files are made by scripts/build-demo-photos.ts: each slot's photo centre-cropped to the theme.json aspect, WebP,
// at most DEMO_PHOTO_MAX_WIDTH wide plus the 640 px variant (lib/photo-variants.ts names, so the engine writes the same
// srcset as for a buyer's photo), in public/demo/<theme>/ — served by the CDN, never traced into a server function
// (next.config.ts); the theme folders keep their 3 MB budget. demo-photos.json (generated) lists them per theme.
//
// Like the demo's map pin (demo-map.ts) only the demo page adds them: the demo records (content.demo.json, the
// collection copies) stay as they are, a record that sets a photo itself keeps it (21 Crimson's theme photos), and a
// buyer's draft (draftFromDemo) starts with empty photo slots.

import type { ContentRecord } from '../content/types.ts';
import type { ThemeManifest } from '../theme/theme.ts';
import DEMO_PHOTO_FILES from './demo-photos.json' with { type: 'json' };

/** Widest stored sample photo (px); the engine adds the smaller variants of lib/photo-variants.ts. */
export const DEMO_PHOTO_MAX_WIDTH = 1280;

/** public/ folder of the sample photos (= their URL prefix). */
export const DEMO_PHOTO_DIR = 'demo';

export interface DemoPhotoManifest {
  _note?: string;
  /** theme id -> slot key (theme.json "photos") -> root-relative URL of the largest file (/demo/<theme>/<key>-<W>w.webp). */
  themes: Record<string, Record<string, string>>;
}

const FILES = DEMO_PHOTO_FILES as DemoPhotoManifest;

/** The sample photo URLs of a theme (slot key -> URL), or null when it has none. */
export function demoPhotoUrls(themeId: string): Readonly<Record<string, string>> | null {
  return Object.hasOwn(FILES.themes, themeId) ? FILES.themes[themeId] : null;
}

function readPath(obj: unknown, parts: string[]): unknown {
  let cur: unknown = obj;
  for (const seg of parts) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

const filled = (v: unknown) => typeof v === 'string' && v.trim() !== '';

/** Writes `value` at `parts`, creating missing objects / lists on the way; false (nothing written) when a list would get a gap. */
function writePath(obj: Record<string, unknown>, parts: string[], value: string): boolean {
  let cur: Record<string, unknown> | unknown[] = obj;
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    const last = i === parts.length - 1;
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx) || idx < 0 || idx > cur.length) return false;
      if (last) cur[idx] = value;
      else {
        if (cur[idx] === null || typeof cur[idx] !== 'object') cur[idx] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        cur = cur[idx] as Record<string, unknown>;
      }
    } else {
      if (last) cur[seg] = value;
      else {
        if (cur[seg] === null || typeof cur[seg] !== 'object') cur[seg] = /^\d+$/.test(parts[i + 1]) ? [] : {};
        cur = cur[seg] as Record<string, unknown>;
      }
    }
  }
  return true;
}

/**
 * The demo content with the theme's sample photos in its empty photo slots. Slots are filled in content-path order
 * (memory_photos.0, .1, .2 …) and a list index is only written when it does not leave a gap. Returns the same object
 * when nothing changes; otherwise a copy (the input is not modified).
 */
export function withDemoPhotos<T extends Pick<ContentRecord, 'media'>>(themeId: string, photos: ThemeManifest['photos'], content: T): T {
  const urls = demoPhotoUrls(themeId);
  if (!urls) return content;
  let out: T | null = null;
  const slots = Object.entries(photos)
    .filter(([key]) => Object.hasOwn(urls, key))
    .sort(([, a], [, b]) => a.source.localeCompare(b.source, 'en', { numeric: true }));
  for (const [key, slot] of slots) {
    const parts = slot.source.split('.');
    if (parts[0] !== 'media' || parts.length < 2) continue;
    if (filled(readPath(out ?? content, parts))) continue;
    const copy: T = out ?? structuredClone(content);
    if (writePath(copy as unknown as Record<string, unknown>, parts, urls[key])) out = copy;
  }
  return out ?? content;
}
