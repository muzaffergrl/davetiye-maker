// What the browser checks need to know about one theme (G052): theme.json, img/manifest.json, the theme's own demo
// record and PAKET 2 sample photos, its W1 comps, page titles, Google Fonts and the theme-specific expectations.
// Used by scripts/theme-check.cjs, tests/g051-browser.ts and tests/final-smoke.ts (`--theme <id>`, default
// blush-garden-rose). Nothing here is specific to one design: what a check cannot derive from the standard
// (docs/11_TEMA_STANDARDI.md) comes from the optional `theme_check` table of the theme's img/manifest.json (below).
//
// Sources, in order (each choice is reported in `notes`, and in checks.json):
//   demo record  --content <file> → themes/<id>/content.demo.json → bundled copy (lib/claim/demo) →
//                collections/<NN_*>/content.demo.json → the 03 record (fallback, noted)
//   photos       --photos <dir> → collections/<NN_*>/assets/gpt/photos/<photo key>.(jpg|jpeg|png|webp) (PAKET 2) →
//                the 03 sample photos (fallback, noted)
//   collection   --collection <dir> → tools/katalog.py (theme slug = tema_slug(design name) → collections/<klasor>)
//   W1 comps     <collection>/assets/gpt/comps/web_1_envelope.png … web_5_rsvp.png (plain names only; _vN are drafts)
//
// Theme-specific table — img/manifest.json "theme_check" (optional; written by the theme's build_images.py; not the
// build's own "checks" results of G054). Every key has
// a default derived from the standard, so a theme that follows docs/11 needs none of them:
//   "cards":     { "<css selector>": "<manifest key with free_zone>" }
//                default: auto — every <img> of a manifest part that has a `free_zone` (img/<key>-<width>.webp) is a
//                painted card; its parent element (the <picture>'s parent) holds the card text. Set this only when a
//                card is not an <img> (e.g. a CSS background) or its text is not inside the image's parent.
//   "particles": "<css selector>"  JS particle layers (exempt from the "past the edge" check, removed for screenshots)
//                default ".petal-layer, .accent-layer"
//   "envelope_text": { "closed": "<sel>", "opened": "<sel>" }  index texts that must sit on plain painted ground
//                default closed "h1, p" (outside .stage, [data-skip], .nojs-only), opened ".replay"
//   "backdrop":  { "edge_max": 2.2, "dark_max": 0.05, "dark_below": 170, "light_above": 256 }  thresholds of that
//                measurement: mean horizontal grey gradient ≤ edge_max, and share of "busy" pixels (grey < dark_below or
//                > light_above) ≤ dark_max. Calibrated on 03's light wash (plain ≤ 1.3 / 0.03, florals ≥ 2.7 / 0.06); a
//                dark design (06, 19) sets e.g. dark_below 0 + light_above 110 from its own measurements, which
//                theme-check writes to checks.json (info.envelope_backdrop).
//   "clusters":  "<css selector>"  the theme's painted decor clusters (default "": not checked). Each one is never shortened
//                by a clipping ancestor (overflow / clip-path) except at the screen's or the page's own edge, and never
//                runs under the fixed site nav's band, on the first screen and at the page end (G402 review: a hero box and
//                an opaque nav band cut the roses with a straight line).
//   "first_screen": { "landscape": false, "names_min_px": 32 }  home's first screen (flow "home first screen"): at
//                360×640 / 375×553 every theme must end above the nav; "landscape": true adds 844×390 and 667×375 (a
//                phone on its side) to that rule and the envelope checks (a theme with a short-landscape layout, e.g.
//                01); without it they are measured and reported in checks.json only. The hero's h1 (names) is never
//                smaller than names_min_px there, with the demo and the --stress record (qa-kontrol 2026-10-14, G401).

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUNDLED_DEMO_CONTENT } from '../../lib/claim/demo/index.ts';
import type { ContentRecord } from '../../lib/content/types.ts';
import { PAGE_NAMES, parseManifest, type PageName, type ThemeManifest } from '../../lib/theme/theme.ts';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REPO = path.resolve(ROOT, '..');
export const DEFAULT_THEME = 'blush-garden-rose';
/** The 03 collection: fallback demo record and sample photos for themes that bring none (e.g. _sample). */
export const COLLECTION_03 = path.join(REPO, 'collections/03_Blush_Garden_Rose');
/** docs/11 §2: photo keys are fixed (= PAKET 2 file names). */
export const STANDARD_PHOTO_KEYS = ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue'];
/** W1 comp file per page (docs/11 §5.1: plain names only). */
export const COMP_NAMES: Record<PageName, string> = {
  index: 'web_1_envelope.png', home: 'web_2_home.png', story: 'web_3_story.png', details: 'web_4_details.png', rsvp: 'web_5_rsvp.png',
};
const PHOTO_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

export interface CheckProfile {
  /** selector → manifest key; null = auto-detect the cards from their <img>. */
  cards: Record<string, string> | null;
  /** manifest key → free_zone rows [y %, left %, right %] (left/right null = no plain paper on that row). */
  freeZones: Record<string, Array<[number, number | null, number | null]>>;
  particles: string;
  clusters: string;
  envelopeText: { closed: string; opened: string };
  backdrop: { edge_max: number; dark_max: number; dark_below: number; light_above: number };
  firstScreen: { landscape: boolean; names_min_px: number };
  /** Where the table came from. */
  source: 'img/manifest.json theme_check' | 'defaults';
}

export interface FontFamily {
  family: string;
  /** e.g. ["400", "italic 500"]; empty = the family's default (regular). */
  variants: string[];
}

export interface TitleSpec {
  /** data-text template, data-field path, or the static text of a <title> without markers. */
  kind: 'text' | 'field' | 'static' | 'missing';
  value: string;
}

export interface ThemeEnv {
  id: string;
  dir: string;
  manifest: ThemeManifest;
  internal: boolean;
  /** G151: a private custom design (theme.json "private"): its /start demo is admin-only, so that check is skipped. */
  private: boolean;
  /** img/manifest.json (null when the theme has none). */
  images: Record<string, any> | null;
  catalog: { no: number; folder: string } | null;
  collectionDir: string | null;
  demo: ContentRecord;
  demoSource: string;
  photosDir: string | null;
  photosSource: string;
  /** Photo files found for the theme's slot keys in photosDir. */
  photoFiles: Record<string, string>;
  /** Existing W1 comps per page. */
  comps: Partial<Record<PageName, string>>;
  titles: Record<PageName, TitleSpec>;
  fonts: { href: string | null; display: string | null; families: FontFamily[] };
  /** Does the theme's site.js mark the end of its boot (html[data-js="ready"], like 03)? */
  jsReadyFlag: boolean;
  profile: CheckProfile;
  /** Setup notes (fallbacks, missing pieces): printed and written to checks.json. */
  notes: string[];
}

export interface ThemeArgs {
  theme: string;
  content?: string;
  photos?: string;
  collection?: string;
  out?: string;
  compare?: string;
  video: boolean;
  /** --stress: also render the docs/11 §12 stress record (stressRecord) and check it. */
  stress: boolean;
}

/**
 * --theme <id> (or --theme=<id>), --content, --photos, --collection, --out, --compare, --no-video, --stress.
 * Unknown flags are ignored.
 */
export function themeArgs(argv: string[] = process.argv.slice(2)): ThemeArgs {
  const out: ThemeArgs = { theme: DEFAULT_THEME, video: true, stress: false };
  const keys = ['theme', 'content', 'photos', 'collection', 'out', 'compare'] as const;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-video') {
      out.video = false;
      continue;
    }
    if (a === '--stress') {
      out.stress = true;
      continue;
    }
    const m = /^--([a-z]+)(?:=(.*))?$/.exec(a);
    if (!m || !(keys as readonly string[]).includes(m[1])) continue;
    const value = m[2] ?? argv[++i];
    if (value === undefined || value.startsWith('--')) throw new Error(`${a} needs a value`);
    out[m[1] as (typeof keys)[number]] = value;
  }
  return out;
}

function readJson(file: string): any {
  return JSON.parse(readFileSync(file, 'utf8'));
}

/** tools/katalog.py: theme slug → [design number, collection folder] (D + EK_TEMALAR, G142). Null when python/katalog is not usable. */
function catalogMap(): Record<string, [number, string]> | null {
  const code = 'import json,sys\nsys.path.insert(0, sys.argv[1])\nimport katalog as k\nprint(json.dumps({k.tema_slug(t): [t["no"], t["klasor"]] for t in k.D + getattr(k, "EK_TEMALAR", [])}))';
  const r = spawnSync('python3', ['-I', '-c', code, path.join(REPO, 'tools')], { encoding: 'utf8' });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

function decodeEntities(s: string): string {
  return s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function attr(tag: string, name: string): string | null {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag);
  return m ? decodeEntities(m[2] ?? m[3] ?? '') : null;
}

function titleSpec(html: string | null): TitleSpec {
  if (html === null) return { kind: 'missing', value: '' };
  const m = /<title\b([^>]*)>([\s\S]*?)<\/title>/i.exec(html);
  if (!m) return { kind: 'missing', value: '' };
  const tag = `<title${m[1]}>`;
  const text = attr(tag, 'data-text');
  if (text !== null) return { kind: 'text', value: text };
  const field = attr(tag, 'data-field');
  if (field !== null) return { kind: 'field', value: field };
  return { kind: 'static', value: decodeEntities(m[2].replace(/\s+/g, ' ').trim()) };
}

/** Families and variants of the first Google Fonts stylesheet link of a page. */
export function parseGoogleFonts(html: string | null): ThemeEnv['fonts'] {
  const none = { href: null, display: null, families: [] };
  if (!html) return none;
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const href = attr(m[0], 'href');
    if (!href || !/^https:\/\/fonts\.googleapis\.com\/css2?\?/.test(href)) continue;
    const url = new URL(href);
    const families = url.searchParams.getAll('family').map((spec) => {
      const [name, axes] = spec.split(':');
      const variants: string[] = [];
      if (axes && axes.includes('@')) {
        const [names, values] = axes.split('@');
        const axisNames = names.split(',');
        for (const tuple of values.split(';')) {
          const v = Object.fromEntries(tuple.split(',').map((x, i) => [axisNames[i], x]));
          const italic = v.ital === '1' ? 'italic ' : '';
          variants.push(`${italic}${v.wght ?? '400'}`.trim());
        }
      }
      return { family: name.replace(/\+/g, ' '), variants };
    });
    return { href, display: url.searchParams.get('display'), families };
  }
  return none;
}

const DEFAULT_PROFILE = {
  particles: '.petal-layer, .accent-layer',
  clusters: '',
  envelopeText: { closed: 'h1, p', opened: '.replay' },
  backdrop: { edge_max: 2.2, dark_max: 0.05, dark_below: 170, light_above: 256 },
  firstScreen: { landscape: false, names_min_px: 32 },
};

function profileFor(images: Record<string, any> | null, notes: string[]): CheckProfile {
  const freeZones: CheckProfile['freeZones'] = {};
  for (const [key, v] of Object.entries(images ?? {})) {
    if (v && typeof v === 'object' && Array.isArray((v as any).free_zone)) freeZones[key] = (v as any).free_zone;
  }
  const t = (images?.theme_check ?? null) as Record<string, any> | null;
  const cards = t?.cards && typeof t.cards === 'object' ? (t.cards as Record<string, string>) : null;
  if (cards) {
    for (const [sel, key] of Object.entries(cards)) {
      if (!freeZones[key]) notes.push(`img/manifest.json theme_check.cards["${sel}"] = "${key}": that part has no free_zone`);
    }
  }
  return {
    cards,
    freeZones,
    particles: typeof t?.particles === 'string' ? t.particles : DEFAULT_PROFILE.particles,
    clusters: typeof t?.clusters === 'string' ? t.clusters : DEFAULT_PROFILE.clusters,
    envelopeText: { ...DEFAULT_PROFILE.envelopeText, ...(t?.envelope_text ?? {}) },
    backdrop: { ...DEFAULT_PROFILE.backdrop, ...(t?.backdrop ?? {}) },
    firstScreen: { ...DEFAULT_PROFILE.firstScreen, ...(t?.first_screen ?? {}) },
    source: t ? 'img/manifest.json theme_check' : 'defaults',
  };
}

/** Collects everything the browser checks need about theme `id`. Throws when the theme itself cannot be loaded. */
export function loadThemeEnv(args: Partial<ThemeArgs> & { theme: string }): ThemeEnv {
  const id = args.theme;
  const dir = path.join(ROOT, 'themes', id);
  if (!existsSync(path.join(dir, 'theme.json'))) throw new Error(`theme "${id}" not found (no ${path.relative(REPO, dir)}/theme.json)`);
  const manifest = parseManifest(readJson(path.join(dir, 'theme.json')), id);
  const notes: string[] = [];
  const imagesFile = path.join(dir, 'img/manifest.json');
  const images = existsSync(imagesFile) ? readJson(imagesFile) : null;
  if (!images) notes.push('no img/manifest.json: card text ↔ free_zone is not checked (docs/11 §5.4)');

  // collection (design folder) of the theme
  let catalog: ThemeEnv['catalog'] = null;
  let collectionDir: string | null = null;
  if (args.collection) {
    collectionDir = path.resolve(args.collection);
  } else {
    const map = catalogMap();
    if (!map) notes.push('tools/katalog.py could not be read (python3): collection unknown — pass --collection');
    else if (map[id]) {
      catalog = { no: map[id][0], folder: map[id][1] };
      collectionDir = path.join(REPO, 'collections', map[id][1]);
    }
  }
  if (collectionDir && !existsSync(collectionDir)) {
    notes.push(`collection folder ${path.relative(REPO, collectionDir)} does not exist`);
    collectionDir = null;
  }
  if (!collectionDir) notes.push(`theme "${id}" has no design collection (not in tools/katalog.py): no W1 comps, no PAKET 2 photos of its own`);

  // demo record
  let demo: ContentRecord;
  let demoSource: string;
  const own = path.join(dir, 'content.demo.json');
  const fromCollection = collectionDir ? path.join(collectionDir, 'content.demo.json') : null;
  if (args.content) {
    demo = readJson(path.resolve(args.content));
    demoSource = path.relative(REPO, path.resolve(args.content));
  } else if (existsSync(own)) {
    demo = readJson(own);
    demoSource = path.relative(REPO, own);
  } else if (Object.hasOwn(BUNDLED_DEMO_CONTENT, id)) {
    demo = structuredClone(BUNDLED_DEMO_CONTENT[id]) as ContentRecord;
    demoSource = `platform/lib/claim/demo/${id}.json (bundled copy)`;
  } else if (fromCollection && existsSync(fromCollection)) {
    demo = readJson(fromCollection);
    demoSource = path.relative(REPO, fromCollection);
    notes.push(`theme has no content.demo.json (docs/11 §2.1): using ${demoSource}`);
  } else {
    demo = readJson(path.join(COLLECTION_03, 'content.demo.json'));
    demoSource = 'collections/03_Blush_Garden_Rose/content.demo.json (fallback)';
    notes.push(`theme has no demo record of its own (content.demo.json, docs/11 §2.1): checks run with the 03 record`);
  }

  // PAKET 2 sample photos
  const keys = Object.keys(manifest.photos);
  const filesIn = (d: string) => {
    const found: Record<string, string> = {};
    for (const key of keys) {
      const f = PHOTO_EXTS.map((e) => path.join(d, `${key}.${e}`)).find((p) => existsSync(p));
      if (f) found[key] = f;
    }
    return found;
  };
  let photosDir: string | null = null;
  let photosSource = '';
  let photoFiles: Record<string, string> = {};
  const candidates: Array<[string, string]> = [];
  if (args.photos) candidates.push([path.resolve(args.photos), '--photos']);
  else {
    if (collectionDir) candidates.push([path.join(collectionDir, 'assets/gpt/photos'), 'PAKET 2']);
    candidates.push([path.join(COLLECTION_03, 'assets/gpt/photos'), '03 sample photos (fallback)']);
  }
  for (const [d, label] of candidates) {
    if (!existsSync(d)) continue;
    const found = filesIn(d);
    if (Object.keys(found).length || label === '--photos' || d === candidates.at(-1)![0]) {
      photosDir = d;
      photosSource = `${path.relative(REPO, d)} (${label})`;
      photoFiles = found;
      break;
    }
  }
  if (photosDir && photosSource.includes('fallback') && collectionDir) notes.push(`no PAKET 2 photos in ${path.relative(REPO, collectionDir)}/assets/gpt/photos: using the 03 sample photos`);
  const missingPhotos = keys.filter((k) => !photoFiles[k]);
  if (photosDir && missingPhotos.length) {
    notes.push(`no sample photo for ${missingPhotos.join(', ')} in ${path.relative(REPO, photosDir)} (file names = photo keys, docs/11 §2)`);
  }

  // W1 comps (plain names only)
  const comps: ThemeEnv['comps'] = {};
  if (collectionDir) {
    for (const p of PAGE_NAMES) {
      const f = path.join(collectionDir, 'assets/gpt/comps', COMP_NAMES[p]);
      if (existsSync(f)) comps[p] = f;
    }
  }

  // templates: titles, fonts
  const pageHtml = (p: PageName) => {
    const file = manifest.pages[p];
    return file && existsSync(path.join(dir, file)) ? readFileSync(path.join(dir, file), 'utf8') : null;
  };
  const titles = Object.fromEntries(PAGE_NAMES.map((p) => [p, titleSpec(pageHtml(p))])) as Record<PageName, TitleSpec>;
  const fonts = parseGoogleFonts(pageHtml('index'));
  const siteJs = existsSync(path.join(dir, 'site.js')) ? readFileSync(path.join(dir, 'site.js'), 'utf8') : '';
  const jsReadyFlag = /dataset\.js\s*=\s*['"]ready['"]|setAttribute\(\s*['"]data-js['"]\s*,\s*['"]ready['"]/.test(siteJs);
  if (!jsReadyFlag) notes.push('site.js does not set html[data-js="ready"]: the end of its boot is not checked (page errors still are)');
  if (manifest.private) notes.push('private theme (theme.json "private", G151): a custom design for one buyer; its /start demo is admin-only, so the demo check is skipped');
  if (manifest.internal) notes.push('internal theme (theme.json "internal": true): not offered on /start, so the /start demo and buyer checks are skipped');

  return {
    id, dir, manifest, internal: Boolean(manifest.internal), private: Boolean(manifest.private), images, catalog, collectionDir, demo, demoSource, photosDir, photosSource,
    photoFiles, comps, titles, fonts, jsReadyFlag, profile: profileFor(images, notes), notes,
  };
}

/** Slug from the demo names ("Clara", "Julian" → clara-and-julian), like /start suggests it. */
/**
 * docs/11 §12 "zorlama kaydı" (stress record), built on the theme's demo record: 40-character first names and full names,
 * the names line at 83 of 85, an 80-character venue, a long host line, 10 schedule rows with 60-character labels and
 * places, a long dress code (the dress code block switched on). Every value is valid under the schema (G055 limits).
 */
export function stressRecord(demo: ContentRecord): ContentRecord {
  const c = structuredClone(demo) as ContentRecord;
  const a = 'Charlotte-Elizabeth Anne Montgomery Hale'; // 40
  const b = 'Maximilian Alexander Fitzwilliam-Reid Jr'; // 40
  c.partners[0].display_name = a;
  c.partners[0].full_name = a;
  c.partners[1].display_name = b;
  c.partners[1].full_name = b;
  c.name_display = `${a} & ${b}`; // 83
  c.host_line = 'Together with their families, Mr. and Mrs. Whitfield and Mr. and Mrs. Montgomery-Reid';
  c.venue = { ...c.venue, name: 'The Grand Rosewater Conservatory and Botanical Gardens at Forsyth Park, Savannah' }; // 80
  const label = 'Champagne toast, speeches and the first dance of the evening'; // 60
  const place = 'The Glasshouse Pavilion by the old lake and the rose garden.'; // 60
  c.schedule = Array.from({ length: 10 }, (_, i) => ({
    time: `${String(14 + Math.floor(i * 0.9)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`,
    label,
    location: place,
  }));
  c.ceremony_time = c.schedule[0].time;
  c.dress_code = 'Garden formal: light colours, flat shoes for the lawn and a shawl for the cooler evening by the lake';
  c.optional_blocks = { ...c.optional_blocks, dress_code: true };
  return c;
}

/**
 * docs/11 §12 "tasarım aralığı" (design range, level 1), built on the theme's demo record: the long end of what the design
 * itself must hold — 16-character names ("Alexandrina Rose" / "Maximilian James", qa-kontrol 2026-10-14), a 60-character
 * venue, the full British date (en-GB, "Wednesday · 29 September 2027": the longest weekday and month), 6 schedule rows.
 * The countdown stays on (a future date). Every value is valid under the schema (G055 limits).
 */
export function rangeRecord(demo: ContentRecord): ContentRecord {
  const c = structuredClone(demo) as ContentRecord;
  const a = 'Alexandrina Rose'; // 16
  const b = 'Maximilian James'; // 16
  c.partners = [
    { ...(c.partners?.[0] ?? {}), display_name: a, full_name: `${a} Whitmore` },
    { ...(c.partners?.[1] ?? {}), display_name: b, full_name: `${b} Ashworth` },
  ];
  c.name_display = `${a} & ${b}`;
  c.initials = 'A & M';
  c.locale = 'en-GB';
  c.date = '2027-09-29'; // a Wednesday
  c.venue = { ...c.venue, name: 'The Orangery and Walled Rose Gardens at Ashcombe Hall Estate' }; // 60
  const rows: [string, string, string][] = [
    ['14:00', 'Ceremony', 'The Walled Rose Garden'],
    ['15:00', 'Drinks on the lawn', 'The South Lawn'],
    ['16:30', 'Wedding breakfast', 'The Orangery'],
    ['18:00', 'Speeches and toasts', 'The Orangery'],
    ['19:30', 'First dance', 'The Long Gallery'],
    ['23:30', 'Carriages', 'The Front Courtyard'],
  ];
  c.schedule = rows.map(([time, label, location]) => ({ time, label, location }));
  c.ceremony_time = c.schedule[0].time;
  c.rsvp = { ...c.rsvp, deadline: '2027-08-15' };
  c.optional_blocks = { ...c.optional_blocks, countdown: true };
  return c;
}

export function demoSlug(content: ContentRecord, fallback = 'demo-site'): string {
  const names = (content.partners ?? []).map((p) => p.display_name).filter(Boolean);
  const s = names.join(' and ').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return s.length >= 3 && s.length <= 48 ? s : fallback;
}

// ------------------------------------------------------------------ independent formatting (never the engine's code)
const isoDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const isUS = (c: ContentRecord) => (c.locale ?? 'en-US') === 'en-US';
/** "May 15, 2027" (en-US) / "15 May 2027" (others), never numeric. */
export function fmtDate(iso: string, us = true, o: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }): string {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString(us ? 'en-US' : 'en-GB', { timeZone: 'UTC', ...o });
}
export function fmtTime(hm: string, us = true): string {
  const [h, m] = hm.split(':').map(Number);
  const suffix = h < 12 ? 'AM' : 'PM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${us ? suffix : suffix.toLowerCase()}`;
}
export const getPath = (obj: unknown, p: string): any => p.split('.').reduce((o: any, k) => (o == null ? undefined : o[k]), obj);
const join = (...parts: unknown[]) => parts.filter((x) => typeof x === 'string' && x.trim()).join(', ');

/** Expected text of a [data-field] (with data-format) for a content record. */
export function fieldValue(content: ContentRecord, field: string, format = ''): string {
  const us = isUS(content);
  const venue = (content.venue ?? {}) as unknown as Record<string, unknown>;
  let v: unknown;
  if (field === 'venue.city_region') v = join(venue.city, venue.region);
  else if (field === 'venue.city_region_country') v = join(venue.city, venue.region, venue.country);
  else if (field === 'date_weekday') v = content.date && isoDate(content.date) ? fmtDate(content.date, us, { weekday: 'long' }) : null;
  else if (field === 'date_long') v = content.date && isoDate(content.date) ? `${fmtDate(content.date, us, { weekday: 'long' })}, ${fmtDate(content.date, us)}` : null;
  else if (field === 'countdown_target_utc') v = expectedCountdownUtc(content);
  else v = getPath(content, field);
  if (v === null || v === undefined || typeof v === 'boolean' || typeof v === 'object') return '';
  const s = String(v);
  const f = format.split(/\s+/).find((x) => x && x !== 'amp') ?? '';
  if (f === 'raw') return s;
  if (isoDate(s)) {
    if (f === 'weekday') return fmtDate(s, us, { weekday: 'long' });
    if (f === 'month') return fmtDate(s, us, { month: 'long' });
    if (f === 'day') return String(Number(s.slice(8)));
    if (f === 'year') return s.slice(0, 4);
    if (f === 'date-long') return `${fmtDate(s, us, { weekday: 'long' })}, ${fmtDate(s, us)}`;
    return fmtDate(s, us);
  }
  if (/^\d{2}:\d{2}$/.test(s)) return fmtTime(s, us);
  return s;
}

/** Expected <title> of a page (template of the theme's own <title>). */
export function expectedTitle(spec: TitleSpec, content: ContentRecord): string {
  if (spec.kind === 'text') return spec.value.replace(/\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g, (_m, p: string, f?: string) => fieldValue(content, p, f ?? ''));
  if (spec.kind === 'field') return fieldValue(content, spec.value);
  return spec.value;
}

function zoneOffset(utcMs: number, tz: string): number {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })
    .formatToParts(new Date(utcMs)).map((p) => [p.type, Number(p.value)]));
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second) - utcMs;
}

/** date + ceremony_time in the record's time zone → UTC ISO (null without a readable date/time/zone). */
export function expectedCountdownUtc(c: ContentRecord): string | null {
  if (!c.date || !isoDate(c.date) || !c.ceremony_time || !/^\d{2}:\d{2}$/.test(c.ceremony_time) || !c.timezone) return null;
  const [y, mo, d] = c.date.split('-').map(Number);
  const [h, mi] = c.ceremony_time.split(':').map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  try {
    let utc = wall - zoneOffset(wall, c.timezone);
    utc = wall - zoneOffset(utc, c.timezone);
    return new Date(utc).toISOString();
  } catch {
    return null;
  }
}

/** Words of the demo record that must disappear after a content change (names, venue, city). */
export function personalWords(c: ContentRecord): string[] {
  const words = [...(c.partners ?? []).map((p) => p.display_name), c.venue?.name, c.venue?.city];
  return [...new Set(words.filter((w): w is string => typeof w === 'string' && w.trim().length > 2))];
}
