// Theme loading: platform/themes/<id>/theme.json + page templates.
// A theme is plain HTML/CSS/JS/images; see README "Theme format".

import { promises as fs } from 'node:fs';
import path from 'node:path';

export const PAGE_NAMES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
export type PageName = (typeof PAGE_NAMES)[number];

/** Pages reachable as /<slug>/<page> (index is served at /<slug>). */
export const SUB_PAGES: readonly PageName[] = PAGE_NAMES.filter((p) => p !== 'index');

export interface PhotoSlot {
  /** Panel label, English, e.g. "Hero portrait". */
  label: string;
  /** Content path that holds the photo URL, e.g. "media.hero_portrait" or "media.memory_photos.0". */
  source: string;
  /** Crop ratio hint for the panel, e.g. "4/5". */
  aspect?: string;
}

export interface ThemeManifest {
  id: string;
  name: string;
  version?: string;
  /** Internal themes (test scaffolding) are not offered to buyers. */
  internal?: boolean;
  pages: Partial<Record<PageName, string>>;
  photos: Record<string, PhotoSlot>;
}

export interface LoadedTheme {
  manifest: ThemeManifest;
  dir: string;
}

export class ThemeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThemeError';
  }
}

export const THEME_ID_RE = /^[a-z0-9_][a-z0-9_-]{0,63}$/;
const PAGE_FILE_RE = /^[a-z0-9_-]+\.html$/;
const PHOTO_KEY_RE = /^[a-z][a-z0-9_]{0,39}$/;
const SOURCE_RE = /^[a-z_][a-z0-9_]*(\.[a-z0-9_]+)*$/;

export function themesDir(): string {
  return process.env.PLATFORM_THEMES_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'themes');
}

const cache = new Map<string, unknown>();
const useCache = () => process.env.NODE_ENV === 'production';

async function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (useCache() && cache.has(key)) return cache.get(key) as T;
  const value = await load();
  if (useCache()) cache.set(key, value);
  return value;
}

/** Validates a parsed theme.json. Throws ThemeError with a precise message. */
export function parseManifest(raw: unknown, folderId: string): ThemeManifest {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new ThemeError(`${folderId}: theme.json must be an object`);
  const m = raw as Record<string, unknown>;
  if (m.id !== folderId) throw new ThemeError(`${folderId}: theme.json id "${String(m.id)}" must equal the folder name`);
  if (typeof m.name !== 'string' || !m.name.trim()) throw new ThemeError(`${folderId}: name is required`);
  if (!m.pages || typeof m.pages !== 'object' || Array.isArray(m.pages)) throw new ThemeError(`${folderId}: pages must be an object`);
  const pages: Partial<Record<PageName, string>> = {};
  for (const [name, file] of Object.entries(m.pages as Record<string, unknown>)) {
    if (!(PAGE_NAMES as readonly string[]).includes(name)) {
      throw new ThemeError(`${folderId}: unknown page "${name}" (allowed: ${PAGE_NAMES.join(', ')})`);
    }
    if (typeof file !== 'string' || !PAGE_FILE_RE.test(file)) throw new ThemeError(`${folderId}: page "${name}" must be a .html file name in the theme folder`);
    pages[name as PageName] = file;
  }
  if (!pages.index) throw new ThemeError(`${folderId}: pages.index is required`);
  const photos: Record<string, PhotoSlot> = {};
  const rawPhotos = m.photos ?? {};
  if (typeof rawPhotos !== 'object' || Array.isArray(rawPhotos)) throw new ThemeError(`${folderId}: photos must be an object`);
  for (const [key, slot] of Object.entries(rawPhotos as Record<string, unknown>)) {
    if (!PHOTO_KEY_RE.test(key)) throw new ThemeError(`${folderId}: photo key "${key}" must match ${PHOTO_KEY_RE}`);
    const s = slot as Record<string, unknown>;
    if (!s || typeof s.label !== 'string' || typeof s.source !== 'string' || !SOURCE_RE.test(s.source)) {
      throw new ThemeError(`${folderId}: photo "${key}" needs a label and a content path source (e.g. media.hero_portrait)`);
    }
    photos[key] = { label: s.label, source: s.source, ...(typeof s.aspect === 'string' ? { aspect: s.aspect } : {}) };
  }
  return {
    id: folderId,
    name: m.name,
    ...(typeof m.version === 'string' ? { version: m.version } : {}),
    ...(m.internal === true ? { internal: true } : {}),
    pages,
    photos,
  };
}

/** Loads a theme by id; null when the folder or theme.json does not exist. */
export async function loadTheme(id: string): Promise<LoadedTheme | null> {
  if (!THEME_ID_RE.test(id)) return null;
  const dir = path.join(themesDir(), id);
  return cached(`theme:${dir}`, async () => {
    let text: string;
    try {
      text = await fs.readFile(path.join(dir, 'theme.json'), 'utf8');
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw e;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw new ThemeError(`${id}: theme.json is not valid JSON`);
    }
    return { manifest: parseManifest(raw, id), dir };
  });
}

/** Template HTML for a page, or null if the theme does not declare that page. */
export async function readThemePage(theme: LoadedTheme, page: PageName): Promise<string | null> {
  const file = theme.manifest.pages[page];
  if (!file) return null;
  const full = path.join(theme.dir, file);
  return cached(`page:${full}`, async () => {
    try {
      return await fs.readFile(full, 'utf8');
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === 'ENOENT') throw new ThemeError(`${theme.manifest.id}: ${file} is declared but missing`);
      throw e;
    }
  });
}

/** All themes with a valid theme.json. Internal themes are skipped unless asked for. */
export async function listThemes(opts: { includeInternal?: boolean } = {}): Promise<ThemeManifest[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(themesDir());
  } catch {
    return [];
  }
  const out: ThemeManifest[] = [];
  for (const id of entries.sort()) {
    const theme = await loadTheme(id).catch(() => null);
    if (theme && (opts.includeInternal || !theme.manifest.internal)) out.push(theme.manifest);
  }
  return out;
}

/** Test helper: forget cached manifests/templates. */
export function clearThemeCache(): void {
  cache.clear();
}
