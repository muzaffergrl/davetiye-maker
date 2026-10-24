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
//
// Search (owner request 2026-10-24, "demo menüsünde arama kutusu da olsun"): a field above the grid filters it as the
// visitor types. Each design carries its number (its collection, "07") and indexes into one shared list of search
// words (`words`): its style filters, palette, opening object and the DEMO_BAR_SEARCH_WORDS its English copy matches,
// each in English and — on a localized visit — in the visitor's language too ("gold altın"), plus the little words to
// leave out (DEMO_BAR_STOP). The matching itself (case, accents, Turkish ı/İ, every word must match) is the script's.

import assets from './assets.json' with { type: 'json' };
import { loadDict } from '../i18n/dicts.ts';
import { DEFAULT_LANG, isLang, type Lang } from '../i18n/langs.ts';
import { makeTranslator, msg } from '../i18n/translate.ts';
import { safeJsonForScript } from '../theme/engine.ts';
import type { PageName } from '../theme/theme.ts';
import { MARKETING, type MarketingConfig } from './config.ts';
import { catalogDesigns, demoPath, designOgImage, designStyles, openingObject, startPath, STYLE_FILTERS, type Design } from './designs.ts';
import { OPENING_THINGS } from './i18n.ts';
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
  /** The search field's label and placeholder. */
  search: msg('Search designs'),
  clear: msg('Clear search'),
  /** Nothing matches; {q} = what the visitor typed. */
  noMatch: msg('No designs match "{q}"'),
  showAll: msg('Show all designs'),
  /** Read out (aria-live) as the visitor types. */
  found: msg('Designs found: {n}'),
} as const;

// roses, not the colours "rose gold", "rose quartz", "dusty rose"
const ROSE = /(?<!dusty |dusky )\broses?\b(?![- ](?:gold|quartz))/;

/**
 * Search words: a design gets a word when its English text (searchText) matches the pattern, so the words follow the
 * copy in designs.ts. Each key is one or more English words a visitor may type; the market dictionaries translate it
 * into the words a visitor of that language would type, space-separated ("rustic" → "rustik kır köy"). Never shown.
 */
export const DEMO_BAR_SEARCH_WORDS: ReadonlyArray<readonly [string, RegExp]> = [
  // colours
  [msg('gold'), /gold|gilded|gilt|brass|champagne/],
  [msg('silver'), /silver/],
  [msg('white'), /\bwhite|ivory|snow|whitewash/],
  [msg('cream beige'), /cream|linen|\bsand\b|parchment|kraft|taupe|wheat|rice paper/],
  [msg('black'), /black(?!berr)|charcoal|monochrome/],
  [msg('blue navy'), /blue|navy|cobalt|azulejo|indigo|\bsky\b(?! lantern)|ocean|\bsea\b|lagoon|cornflower/],
  [msg('green'), /green|olive|sage|emerald|forest|moss|pistachio|\bleaf|\bpalm|\bpine\b|eucalyptus|fern|chartreuse/],
  [msg('teal turquoise'), /teal|peacock|turquoise|lagoon/],
  [msg('red'), /\bred\b|crimson|burgundy|\bwine\b|claret|oxblood|lacquer|popp|berry|bordeaux/],
  [msg('burgundy'), /burgundy|\bwine\b|claret|oxblood|bordeaux/],
  [msg('pink blush'), /pink|blush|rose[- ]quartz|dusty rose|dusky rose|\/rose\//],
  [msg('purple lilac'), /purple|lavender|lilac|violet|\bplum\b|aubergine/],
  [msg('yellow'), /yellow|lemon|mustard|sunflower|saffron|marigold/],
  [msg('orange terracotta'), /orange|terracotta|\brust\b|copper|sunset|amber/],
  [msg('brown'), /brown|kraft|espresso|sepia|leather|bronze|suede|cork/],
  // styles and motifs
  [msg('romantic'), new RegExp(`style:floral|love|\\blace|\\bbow\\b|blush|${ROSE.source}`)],
  [msg('flowers floral'), new RegExp(`style:floral|flower|floral|blossom|peon|dahlia|dais|popp|cornflower|lavender|lily|hibiscus|plumeria|marigold|thistle|${ROSE.source}`)],
  [msg('rose'), ROSE],
  [msg('garden'), /garden|meadow|glasshouse|wildflower/],
  [msg('rustic'), /style:rustic|rustic|kraft|barn|gingham|pampas/],
  [msg('boho'), /boho|pampas|dried/],
  [msg('vintage'), /style:storybook|vintage|antique|airmail|postage|sepia|old gold|victorian|toile/],
  [msg('art deco'), /art deco|\bdeco\b|black-tie/],
  [msg('beach sea'), /seaside|coastal|shell|\bwave|ocean|\bsea\b|beach|porthole/],
  [msg('tropical'), /tropical|plumeria|hibiscus/],
  [msg('winter'), /winter|snow|evergreen|\bpine\b/],
  [msg('autumn fall'), /autumn|\bfall\b|dahlia|blackberr/],
  [msg('spring'), /spring|blossom/],
  [msg('summer'), /summer|sunflower|lemon|seaside|coastal|tropical|sunlit/],
  [msg('forest woodland'), /forest|woodland|\bfern|toadstool|\bmoss/],
  [msg('night stars'), /(?<!\/)\b(?:mid)?night|celestial|\bstars?\b|\bmoon|crescent|astrolabe|nocturne/],
  [msg('lantern'), /lantern/],
  [msg('velvet'), /velvet/],
  [msg('lace'), /\blace|doily|chantilly/],
  [msg('pearl'), /pearl/],
  [msg('wax seal'), /\bseal\b|\bwax\b/],
  [msg('ribbon bow'), /ribbon|\bbow\b/],
  [msg('travel'), /travel|airmail|luggage|voyage|passport/],
];

/** The English text DEMO_BAR_SEARCH_WORDS look at: name | style line | /palette/ | opening object | style ids. */
export function searchText(d: Pick<Design, 'id' | 'name' | 'copy'>): string {
  const palette = `/${d.copy.palette.map((p) => p.name).join('/')}/`;
  return [d.name, d.copy.style, palette, openingObject(d.copy), ...designStyles(d.id).map((s) => `style:${s}`)].join(' | ').toLowerCase();
}

/** A design's search words (English keys): matched words, style filters, palette, opening object. */
export function searchKeys(d: Pick<Design, 'id' | 'name' | 'copy'>): string[] {
  const text = searchText(d);
  const thing = openingObject(d.copy);
  return [
    ...DEMO_BAR_SEARCH_WORDS.filter(([, re]) => re.test(text)).map(([w]) => w),
    ...designStyles(d.id).map((s) => STYLE_FILTERS.find((f) => f.id === s)!.label),
    // a colour named after roses ("Rose gold", "Dusty Rose") is no rose: its other words only
    ...d.copy.palette.map((p) => (/\brose\b/i.test(p.name) && !ROSE.test(p.name.toLowerCase()) ? p.name.replace(/\s*\brose\b\s*/i, ' ').trim() : p.name)),
    OPENING_THINGS[thing] ?? thing,
  ];
}

/**
 * Little words a visitor types between the real ones ("gold and rose", "altın ve gül", "oro y rosas"): the script leaves
 * them out of the query, unless nothing else is typed ("ve" is then the start of "velvet"), and out of the designs'
 * words. English plus the visitor's language; lower case without accents, as the script compares. Never a search word
 * ("or" is French gold).
 */
export const DEMO_BAR_STOP: Readonly<Record<Lang, readonly string[]>> = {
  en: ['a', 'an', 'and', 'the', 'of', 'with', 'in', 'for'],
  tr: ['ve', 'ile', 'de', 'da', 'icin'],
  es: ['y', 'e', 'de', 'del', 'con', 'el', 'la', 'los', 'las', 'en', 'para'],
  de: ['und', 'mit', 'der', 'die', 'das', 'den', 'dem', 'im', 'fur'],
  fr: ['et', 'avec', 'de', 'du', 'des', 'le', 'la', 'les', 'au', 'aux', 'en', 'par', 'pour'],
};

/** "07" from "07_Burgundy_Velvet_Autumn" ('' without one). */
export function designNumber(d: Pick<Design, 'copy'>): string {
  return /^(\d+)_/.exec(d.copy.collection)?.[1] ?? '';
}

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
  /** Its number ("07"; '' without one): "7" and "07" find it. */
  no: string;
  /** Its search words: indexes into DemoBarData.words. */
  k: number[];
}

export interface DemoBarData {
  /** The language of the words below (and of the Home / All designs links). */
  lang: Lang;
  current: { id: string; name: string };
  links: { home: string; designs: string; /** Only for a design on sale (status live). */ start: string | null };
  copy: { [K in keyof typeof DEMO_BAR_COPY]: string };
  groups: Array<{ id: DemoBarGroupId; label: string; items: DemoBarItem[] }>;
  /** Search words of the listed designs, each in English plus, on a localized visit, its translation ("Gold Altın"). */
  words: string[];
  /** Little words the search leaves out (DEMO_BAR_STOP: English plus the visitor's language). */
  stop: string[];
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
  // one shared list of search words, the most used first (short indexes); a word and its translation are one entry,
  // each word once ("Gold Altın")
  const entry = (key: string): string => {
    const seen = new Set<string>();
    return `${key} ${lang === DEFAULT_LANG ? '' : t(key)}`
      .split(/\s+/)
      .filter((w) => w && !seen.has(w.toLowerCase()) && seen.add(w.toLowerCase()))
      .join(' ');
  };
  const entries = new Map(designs.map((d) => [d.id, [...new Set(searchKeys(d).map(entry))]]));
  const uses = new Map<string, number>();
  for (const list of entries.values()) for (const e of list) uses.set(e, (uses.get(e) ?? 0) + 1);
  const words = [...uses.keys()].sort((a, b) => uses.get(b)! - uses.get(a)!);
  const index = new Map(words.map((w, i) => [w, i]));
  const item = (d: (typeof designs)[number]): DemoBarItem => {
    const page = opts.page === 'index' || !opts.hasPage || opts.hasPage(d.id) ? opts.page : 'index';
    const k = entries.get(d.id)!.map((e) => index.get(e)!);
    return { id: d.id, name: d.name, href: demoBarHref(d.id, page, opts.lang), thumb: demoBarThumb(d.id), no: designNumber(d), k };
  };
  return {
    lang,
    current: { id: opts.current.id, name: listed?.name ?? opts.current.name },
    links: {
      home: href(lang, '/'),
      designs: href(lang, '/designs'),
      start: listed?.status === 'live' ? startPath(listed.id) : null,
    },
    copy: Object.fromEntries(Object.entries(DEMO_BAR_COPY).map(([k, v]) => [k, t(v)])) as DemoBarData['copy'],
    groups: DEMO_BAR_GROUPS.map((g) => ({ id: g.id, label: t(g.label), items: designs.filter((d) => d.status === g.id).map(item) })).filter(
      (g) => g.items.length > 0,
    ),
    words,
    stop: [...new Set([...DEMO_BAR_STOP[DEFAULT_LANG], ...DEMO_BAR_STOP[lang]])],
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
