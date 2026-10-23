// The demo bar (owner request 2026-10-23): on a live demo (/start/demo/<theme>[/<page>]) a slim pill shows the design's
// name; tapping it opens a catalogue of the other designs — one tap opens another demo on the same page (its first page
// if that design has no such page) in the same ?lang= — plus "Home" and "All designs" of the sales site in that language
// and, for a design on sale, the usual "Already bought it? Start your website" link to /start?theme=<id>.
// The language: ?lang= of the demo address, else the localized sales-site page the visitor came from (demoBarLang); the
// demo's own page links keep it (lib/theme/engine.ts linkLang), while the demo itself stays in its content's language.
//
// Where it shows: ONLY the demo pages (lib/claim/demo-page.ts adds it); never a couple's website (/<slug>), the panel or
// /start. Not when the demo is framed (the /start preview, the sales site's demo dialog): the server leaves it out for
// `Sec-Fetch-Dest: iframe`, and /static/demo-bar.js does nothing when window.self !== window.top (browsers without the
// header).
//
// The list mirrors the /designs catalogue (catalogDesigns: live and preview designs; hidden 'coming' designs have no
// public demo link): "Available now" (live), then "Coming soon on Etsy" (preview, the catalogue's own label), each in
// config order. Thumbnails: the design's real envelope screen (assets.json, 320 px), else its share image.
//
// The page gets this as inline JSON (#demo-bar-data) in the visitor's language plus two static files — no framework:
// /static/demo-bar.css (in <head>) and /static/demo-bar.js (deferred). Texts are market keys (lib/i18n/dict/market).

import assets from './assets.json' with { type: 'json' };
import { loadDict } from '../i18n/dicts.ts';
import { DEFAULT_LANG, isLang, type Lang } from '../i18n/langs.ts';
import { makeTranslator, msg } from '../i18n/translate.ts';
import { safeJsonForScript } from '../theme/engine.ts';
import type { PageName } from '../theme/theme.ts';
import { MARKETING, type MarketingConfig } from './config.ts';
import { catalogDesigns, demoPath, designOgImage, startPath } from './designs.ts';
import { href, PREFIXED_LANGS } from './lang-path.ts';

export const DEMO_BAR_CSS = '/static/demo-bar.css';
export const DEMO_BAR_JS = '/static/demo-bar.js';
/** id of the inline JSON the script reads. */
export const DEMO_BAR_DATA_ID = 'demo-bar-data';
/** Marks the tags the server adds (tests, and so a page never gets them twice). */
export const DEMO_BAR_ATTR = 'data-demo-bar';
/** Query parameter of the visitor's language (the sales site's language the demo was opened from). */
export const DEMO_LANG_PARAM = 'lang';

/** The bar's words (market namespace; keys = the English text). */
export const DEMO_BAR_COPY = {
  eyebrow: msg('Live demo'),
  dialog: msg('Choose a design'),
  close: msg('Close'),
  home: msg('Home'),
  designs: msg('All designs'),
  start: msg('Already bought it? Start your website'),
} as const;

/** Group headings, in this order: the catalogue's live designs, then its previews. */
export const DEMO_BAR_GROUPS = [
  { id: 'live', label: msg('Available now') },
  { id: 'preview', label: msg('Coming soon on Etsy') },
] as const;

export type DemoBarGroupId = (typeof DEMO_BAR_GROUPS)[number]['id'];

/** A demo page: 'index' (the closed envelope) or one of the theme's other pages. */
export type DemoBarPage = PageName;

export interface DemoBarItem {
  id: string;
  name: string;
  /** Its demo on the same page (or its first page), with ?lang= when the visitor came with one. */
  href: string;
  /** Root-relative thumbnail (the real envelope screen), or null. */
  thumb: string | null;
}

export interface DemoBarData {
  /** The language of the words below (and of the Home / All designs links). */
  lang: Lang;
  current: { id: string; name: string };
  links: { home: string; designs: string; /** Only for a design on sale (status live). */ start: string | null };
  copy: { [K in keyof typeof DEMO_BAR_COPY]: string };
  groups: Array<{ id: DemoBarGroupId; label: string; items: DemoBarItem[] }>;
}

type ScreenManifest = { designs: Record<string, { screens?: Record<string, { files?: Record<string, string> }> }> };

/** The smallest real envelope screen of a design (assets.json), else its share image. */
export function demoBarThumb(id: string): string | null {
  const files = (assets as unknown as ScreenManifest).designs[id]?.screens?.envelope?.files;
  if (files) {
    const widths = Object.keys(files)
      .map(Number)
      .filter((w) => Number.isFinite(w))
      .sort((a, b) => a - b);
    if (widths.length) return files[String(widths[0])];
  }
  return designOgImage(id);
}

/**
 * The visitor's language on a demo, null for English: ?lang= of the demo address when it is one of ours; else, for a
 * visit from a localized page of the sales site on this host (a "Live demo" link opened in a new tab from /tr/designs),
 * that page's language. Page links of the demo keep it (lib/theme/engine.ts linkLang), so it lasts from page to page.
 */
export function demoBarLang(url: URL, headers?: Headers): Lang | null {
  const asked = url.searchParams.get(DEMO_LANG_PARAM);
  if (isLang(asked)) return asked === DEFAULT_LANG ? null : asked;
  const referer = headers?.get('referer');
  if (!referer) return null;
  let from: URL;
  try {
    from = new URL(referer);
  } catch {
    return null;
  }
  const hosts = [url.host, headers?.get('host'), headers?.get('x-forwarded-host')?.split(',').pop()?.trim()].filter(Boolean);
  if (!hosts.includes(from.host)) return null;
  const m = /^\/([a-z]{2})(?:\/|$)/.exec(from.pathname);
  return m && (PREFIXED_LANGS as readonly string[]).includes(m[1]) ? (m[1] as Lang) : null;
}

/** /start/demo/<id>[/<page>][?lang=<lang>] */
export function demoBarHref(id: string, page: DemoBarPage, lang: Lang | null): string {
  const path = page === 'index' ? demoPath(id) : `${demoPath(id)}/${page}`;
  return lang && lang !== DEFAULT_LANG ? `${path}?${DEMO_LANG_PARAM}=${lang}` : path;
}

/**
 * The bar's data for one demo page. `hasPage(id)` says whether design `id` has `page` (default: every design has every
 * page); a design without it links to its first page. `dict`: the language's market dictionary (null = English).
 */
export function demoBarData(opts: {
  current: { id: string; name: string };
  page: DemoBarPage;
  lang: Lang | null;
  dict?: Readonly<Record<string, string>> | null;
  hasPage?: (id: string) => boolean;
  cfg?: MarketingConfig;
}): DemoBarData {
  const lang: Lang = opts.lang ?? DEFAULT_LANG;
  const { t } = makeTranslator(lang, opts.dict ?? null);
  const cfg = opts.cfg ?? MARKETING;
  const designs = catalogDesigns(cfg);
  const listed = designs.find((d) => d.id === opts.current.id);
  const item = (d: (typeof designs)[number]): DemoBarItem => {
    const page = opts.page === 'index' || !opts.hasPage || opts.hasPage(d.id) ? opts.page : 'index';
    return { id: d.id, name: d.name, href: demoBarHref(d.id, page, opts.lang), thumb: demoBarThumb(d.id) };
  };
  return {
    lang,
    current: { id: opts.current.id, name: listed?.name ?? opts.current.name },
    links: {
      home: href(lang, '/'),
      designs: href(lang, '/designs'),
      start: listed?.status === 'live' ? startPath(listed.id) : null,
    },
    copy: {
      eyebrow: t(DEMO_BAR_COPY.eyebrow),
      dialog: t(DEMO_BAR_COPY.dialog),
      close: t(DEMO_BAR_COPY.close),
      home: t(DEMO_BAR_COPY.home),
      designs: t(DEMO_BAR_COPY.designs),
      start: t(DEMO_BAR_COPY.start),
    },
    groups: DEMO_BAR_GROUPS.map((g) => ({ id: g.id, label: t(g.label), items: designs.filter((d) => d.status === g.id).map(item) })).filter(
      (g) => g.items.length > 0,
    ),
  };
}

/**
 * demoBarData in the visitor's language (`lang`: demoBarLang; only that language's market dictionary is loaded).
 * `hasPage(id)` (async, e.g. from the theme's manifest) is asked for every listed design when the page is not the first.
 */
export async function demoBarFor(
  lang: Lang | null,
  current: { id: string; name: string },
  page: DemoBarPage,
  hasPage?: (id: string) => Promise<boolean>,
): Promise<DemoBarData> {
  const dict = lang && lang !== DEFAULT_LANG ? await loadDict('market', lang) : null;
  let has: ((id: string) => boolean) | undefined;
  if (hasPage && page !== 'index') {
    const ids = catalogDesigns().map((d) => d.id);
    const ok = await Promise.all(ids.map((id) => hasPage(id).catch(() => false)));
    const yes = new Set(ids.filter((_, i) => ok[i]));
    has = (id) => yes.has(id);
  }
  return demoBarData({ current, page, lang, dict, hasPage: has });
}

/** True for a request the browser makes for an <iframe> (the /start preview, the sales site's demo dialog). */
export function framedRequest(headers: Headers): boolean {
  return headers.get('sec-fetch-dest') === 'iframe';
}

/**
 * The page with the bar: its stylesheet at the end of <head>, the JSON and the deferred script at the end of <body>.
 * The pill itself is drawn by the script (nothing visible without JavaScript, nothing inside a frame).
 */
export function withDemoBar(html: string, data: DemoBarData): string {
  if (html.includes(`id="${DEMO_BAR_DATA_ID}"`)) return html;
  const css = `<link rel="stylesheet" href="${DEMO_BAR_CSS}" ${DEMO_BAR_ATTR}>`;
  const tail =
    `<script type="application/json" id="${DEMO_BAR_DATA_ID}" ${DEMO_BAR_ATTR}>${safeJsonForScript(data)}</script>` +
    `<script src="${DEMO_BAR_JS}" defer ${DEMO_BAR_ATTR}></script>`;
  const lower = html.toLowerCase();
  const headEnd = lower.indexOf('</head');
  const bodyEnd = lower.lastIndexOf('</body');
  if (headEnd < 0 || bodyEnd < headEnd) return css + html + tail;
  return html.slice(0, headEnd) + css + html.slice(headEnd, bodyEnd) + tail + html.slice(bodyEnd);
}
