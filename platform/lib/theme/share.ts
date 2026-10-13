// Share image and browser icon of a theme (G055; docs/11 §3.1, §5.4).
//
// The theme's build_images.py writes two files with fixed names:
//   img/og-1200x630.jpg   link preview image (1200 x 630, no names on it)
//   img/favicon.png       browser tab icon (square, transparent)
// When a theme has them, the engine writes og:image (absolute URL) + twitter:card and
// <link rel="icon">; templates never write these tags themselves.
//
// How "the theme has it" is decided: the file exists in the theme folder, OR the theme's
// img/manifest.json (written by the same build, tools/tema_build.py) declares it ("og": {"file":
// "og-1200x630.jpg"}, "favicon": {"file": "favicon.png"}). The second rule is what works on Vercel:
// only the theme asset route's bundle carries theme images (next.config.ts), the page routes carry
// *.html and *.json only. scripts/trace-check.cjs fails the build when a page route would not see a
// share file that is on disk (or when a manifest names a file that is missing).

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const OG_IMAGE_FILE = 'img/og-1200x630.jpg';
export const ICON_FILE = 'img/favicon.png';
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;
/** img/manifest.json keys that record the two files (tools/tema_build.py og_kaydet / ikon). */
export const MANIFEST_FILE = 'img/manifest.json';
const MANIFEST_KEYS = { ogImage: 'og', icon: 'favicon' } as const;

/** Theme-relative paths of the share files a theme has; null = none. */
export interface ThemeShareFiles {
  ogImage: string | null;
  icon: string | null;
}

export const NO_SHARE_FILES: ThemeShareFiles = Object.freeze({ ogImage: null, icon: null });

async function isFile(file: string): Promise<boolean> {
  try {
    return (await fs.stat(file)).isFile();
  } catch {
    return false;
  }
}

/** The manifest's record of a file ("og" -> {"file": "og-1200x630.jpg"}); unreadable manifest = nothing declared. */
async function declaredFiles(dir: string): Promise<Record<string, string>> {
  let raw: unknown;
  try {
    raw = JSON.parse(await fs.readFile(path.join(dir, MANIFEST_FILE), 'utf8'));
  } catch {
    return {};
  }
  const out: Record<string, string> = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const key of Object.values(MANIFEST_KEYS)) {
      const entry = (raw as Record<string, unknown>)[key];
      const file = entry && typeof entry === 'object' ? (entry as Record<string, unknown>).file : null;
      if (typeof file === 'string') out[key] = file;
    }
  }
  return out;
}

/** Which share files the theme in `dir` has (see the header for the rule). */
export async function findShareFiles(dir: string): Promise<ThemeShareFiles> {
  const declared = await declaredFiles(dir);
  const has = async (rel: string, manifestKey: string) =>
    (await isFile(path.join(dir, rel))) || declared[manifestKey] === path.posix.basename(rel);
  return {
    ogImage: (await has(OG_IMAGE_FILE, MANIFEST_KEYS.ogImage)) ? OG_IMAGE_FILE : null,
    icon: (await has(ICON_FILE, MANIFEST_KEYS.icon)) ? ICON_FILE : null,
  };
}
