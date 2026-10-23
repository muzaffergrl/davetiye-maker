// Theme template engine: plain theme HTML + content record -> final page HTML (server side,
// so names, dates, <title> and OG tags are correct without JavaScript).
//
// Markers (full reference in README):
//   data-field="venue.name"        text = value (always escaped; ISO dates / HH:MM times formatted)
//                                  on <img>: src = photo URL; on <a> with a urls.* path: href
//   data-format="date|date-long|weekday|month|day|year|time|raw amp"
//   data-text="Our Story · {name_display}"   text from a template ({path} or {path|format})
//   data-photo="hero"              photo slot from theme.json -> <img src> or --photo CSS variable
//   data-url="map"                 href = urls.map (http/https/mailto/tel only), else href="#" + data-url-missing
//   data-optional="our_story"      element kept only when optional_blocks.our_story === true
//                                  (on <html>/<body>: the whole page is off -> 404)
//   data-if="venue.address"        element kept only when the value is non-empty ("!path" negates); several
//                                  conditions separated by spaces must all hold ("dress_code !thank_you_on", G075)
//   data-repeat="schedule"         element repeated per array item; inner paths start with "." (".time")
//   data-attr-<name>="path"        attribute <name> = raw value, or a {template} (allow-listed attributes only)
//   data-calendar="ics|google"     <a> href = /<slug>/event.ics or a Google Calendar link (lib/calendar.ts);
//                                  removed when the content has no readable date
//   data-copy="envelope_kicker"    G068: an editable design text — content.copy.<key> (one line, escaped, at most the
//                                  key's theme.json max) replaces the element's text; empty = the template's text stays
//   data-copy-attr="aria-label:k"  the same for attributes (alt, title, content, aria-label, placeholder)
//   {copy.<key>}                   inside data-text / data-attr-* templates: the couple's text, else theme.json's default
//   data-map                       G127: the shared map + directions block (lib/theme/map-block.ts) for the content's places
//                                  (lib/maps.ts); data-map-btn="btn btn-ghost" / data-map-btn-sm = the theme's classes for "Show map" /
//                                  the directions links. Removed
//                                  when no place is on or in thank-you mode. The page then links /static/map.css + /static/map.js
//                                  and its CSP allows the Google Maps frame. View values: map_on (a place is switched on —
//                                  hide the old "View map" link), map_block (the block or the old link has something to show).
//   data-travel / data-menu / data-blocks   G138: the shared Details blocks (lib/theme/extras-block.ts) — travel & stay
//                                  (content.travel), the menu (meal.served) and 0–10 free blocks (details_blocks). Their
//                                  words are data-copy labels inside the marker; data-pex-btn / data-pex-title = the theme's
//                                  classes. Removed when empty or in thank-you mode; the page then links /static/extras.css.
//                                  View values: travel_block (link or travel content), menu_block, info_blocks.
// Relative asset paths become /themes/<theme>/..., links to theme pages become /<slug>/<page>.
// Buyer photos with size variants (lib/photo-variants.ts) get srcset (+ the template's sizes).
// Share image and tab icon (G055): when the theme has img/og-1200x630.jpg / img/favicon.png
// (lib/theme/share.ts), the engine writes og:image (absolute URL) + twitter:card and <link rel="icon">.
// The page also receives <script type="application/json" id="site-data"> for theme JS: only what
// theme JS needs (slug, page map, derived countdown target …), never the content record itself, so
// sections the couple switched off do not leak through the page source. HTML comments of the
// template (internal production notes) are dropped.

import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import { Text, hasChildren, isTag, type AnyNode, type Element } from 'domhandler';
import { calendarEvent, googleCalendarUrl, type CalendarEvent } from '../calendar.ts';
import { buildView, fieldKind, getPath } from '../content/derive.ts';
import { formScriptConfig } from '../rsvp/form-config.ts';
import { formatDate, formatDateLong, formatTime, monthName, parseIsoDate, weekdayName } from '../content/format.ts';
import { THANK_YOU_DEFAULT_TITLE } from '../content/thank-you.ts';
import { MAP_FRAME_ORIGIN, mapPlaces } from '../maps.ts';
import { photoCandidates } from '../photo-variants.ts';
import { MAP_CSS, MAP_JS, mapBlockHtml } from './map-block.ts';
import { blocksHtml, EXTRAS_CSS, EXTRAS_LABELS, infoBlocks, menuData, menuHtml, travelData, travelHtml, type ExtrasLabel } from './extras-block.ts';
import { AUDIO_SCRIPT_SRC, siteSound } from '../audio/site-sound.ts';
import { COPY_ATTRS, ownCopy, parseCopyAttr, resolveCopy, type CopyManifest } from './copy.ts';
import type { ThemeShareFiles } from './share.ts';
import { OG_IMAGE_SIZE } from './share.ts';
import type { PageName, ThemeManifest } from './theme.ts';
import { resolveVariant, VARIANTS_CSS, type ThemeVariant } from './variants.ts';
import { localizedContent, siteLangs } from '../i18n/content.ts';
import { dateIn, dateLongIn, monthIn, timeIn, weekdayIn } from '../i18n/format.ts';
import { LANG_NAMES, type Lang } from '../i18n/langs.ts';
import { scriptTexts } from '../i18n/site.ts';
import { interpolate, type Dict, type Vars } from '../i18n/translate.ts';
import { translateTemplateSpec, visitTemplateTexts } from '../i18n/template-texts.ts';
import { cssUrl, isRelativeReference, safeLinkUrl, safePhotoUrl, splitSuffix, themeAssetUrl } from './urls.ts';

export interface RenderOptions {
  html: string;
  content: unknown;
  /** `copy` (G068): the theme's editable texts; absent = none (data-copy elements keep their template text). */
  theme: Pick<ThemeManifest, 'id' | 'pages' | 'photos'> & { copy?: CopyManifest; variants?: readonly ThemeVariant[] };
  page: PageName;
  slug: string;
  /**
   * G153: the colour palette (lib/theme/variants.ts), used only when the theme declares it (live or coming; callers decide
   * who may pick a coming one). Sets html[data-variant], links the theme's variants.css and points theme assets at the
   * variant's folder /themes/<theme>/~<id>/… (image overrides, else the originals). Unknown / null = the original palette.
   */
  variant?: string | null;
  /** G153: links between pages keep ?variant=<id> (the demo, where the palette comes from the address, not a site). */
  variantInLinks?: boolean;
  /** When set, links between theme pages keep ?preview=<key> so draft navigation works. */
  previewKey?: string | null;
  /**
   * Absolute public origin (https://example.com; PLATFORM_PUBLIC_URL or the request's) for og:image and the
   * calendar's website link. Without it no og:image is written (it must be an absolute URL).
   */
  origin?: string | null;
  /** Share image / tab icon of the theme (LoadedTheme.share). Absent: no og:image, no icon tags. */
  share?: ThemeShareFiles | null;
  /**
   * Password-protected website (G076): <title>, description, og:/twitter: title and description carry only the couple's
   * names and "You're invited" (no date, venue or place), and a robots noindex meta is added.
   */
  guestOnlyMeta?: boolean;
  /** The moment of the render: thank-you mode (G075) depends on it. Default: now. */
  now?: Date;
  /**
   * The couple's preview of the thank-you version (?thanks=1 next to a preview key, G075): thank_you_on is true whatever
   * the mode and the date, and links between pages keep thanks=1. Ignored without a previewKey (guests never get it).
   */
  thankYouPreview?: boolean;
  /**
   * G144: the page's language (?lang=; one of the site's content.languages, else its primary language) and the site
   * dictionary of that language (lib/i18n/site.ts siteDict). Fixed texts are looked up there by their English text;
   * the couple's own text comes from content.translations (approved, up to date) or stays in the primary language.
   */
  lang?: Lang | null;
  dict?: Dict;
  /**
   * Demo bar (owner request 2026-10-23, lib/marketing/demo-bar.ts): the visitor's language on a live demo. Links between
   * pages keep ?lang=<it> although the page itself stays in the content's language, so the bar keeps the visitor's
   * language from page to page. Only when the page is in the site's primary language.
   */
  linkLang?: Lang | null;
}

/** Query parameter of a page's language (G144): /<slug>/details?lang=de. Absent = the site's primary language. */
export const LANG_PARAM = 'lang';

/** Platform files of the language switcher (only on a site with more than one language). */
export const LANG_CSS = '/static/lang.css';
export const LANG_JS = '/static/lang.js';

export interface RenderResult {
  html: string;
  warnings: string[];
  /** True when <html>/<body> carries a data-optional / data-if that is off: serve 404. */
  disabled: boolean;
  /** CSP hashes ('sha256-…') of the theme's inline scripts, for script-src. */
  scriptHashes: string[];
  /** Origins the page may frame (G127: the Google Maps embed behind "Show map"), for frame-src. */
  frameSources: string[];
}

const RAW_TEXT = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const TEXT_FORMATS = new Set(['auto', 'raw', 'date', 'date-long', 'weekday', 'month', 'day', 'year', 'time']);
const KNOWN_BLOCKS = new Set(['our_story', 'countdown', 'dress_code', 'registry', 'travel_stay', 'faq', 'guest_policy']);
const URL_KEYS = new Set(['website', 'rsvp_form', 'map', 'registry', 'accommodation']);
const ATTR_ALLOW = new Set(['alt', 'title', 'content', 'aria-label', 'datetime', 'value', 'placeholder']);
const ENGINE_ATTRS = new Set([
  'data-field',
  'data-format',
  'data-text',
  'data-photo',
  'data-optional',
  'data-url',
  'data-if',
  'data-repeat',
  'data-calendar',
  'data-copy',
  'data-copy-attr',
  'data-copy-fixed',
  'data-map',
  'data-map-btn',
  'data-map-btn-sm',
  'data-travel',
  'data-menu',
  'data-blocks',
  'data-pex-btn',
  'data-pex-title',
]);
const SRC_ELEMENTS = new Set(['img', 'script', 'source', 'video', 'audio', 'track', 'embed', 'iframe', 'input']);
const OG_IMAGE = new Set(['og:image', 'og:image:url', 'twitter:image']);
const DATA_SCRIPT_TYPES = new Set(['application/json', 'application/ld+json', 'text/template', 'text/plain']);
const TEMPLATE_RE = /\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g;

/** Page route for a theme page: index -> /<slug>, others -> /<slug>/<page>. */
export function pageRoute(slug: string, page: PageName): string {
  return page === 'index' ? `/${slug}` : `/${slug}/${page}`;
}

/** Query value that shows the thank-you version in a preview (G075): /<slug>?preview=<key>&thanks=1. */
export const THANK_YOU_PREVIEW_PARAM = 'thanks';

/** Query parameter of the demo's colour palette (G153): /start/demo/<theme>?variant=<id>. */
export const VARIANT_PARAM = 'variant';

function withPreview(
  route: string,
  previewKey: string | null | undefined,
  extraQuery = '',
  thanks = false,
  lang: string | null = null,
  variant: string | null = null,
): string {
  const params = new URLSearchParams(extraQuery.replace(/^\?/, ''));
  if (variant) params.set(VARIANT_PARAM, variant);
  if (lang) params.set(LANG_PARAM, lang);
  if (previewKey) params.set('preview', previewKey);
  if (previewKey && thanks) params.set(THANK_YOU_PREVIEW_PARAM, '1');
  const q = params.toString();
  return q ? `${route}?${q}` : route;
}

/** JSON for an inline <script type="application/json">: no "<", ">", "&", U+2028/2029 left raw. */
export function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isPresent(v: unknown): boolean {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/**
 * og:image (+ type, size, twitter:card) and <link rel="icon"> for the theme's share files, after the last
 * <meta> of <head>. A tag the template already has is left as it is (no duplicates). og:image needs an
 * absolute URL, so it is written only with an origin; the icon is a root-relative link.
 */
function writeShareTags(
  $: cheerio.CheerioAPI,
  themeId: string,
  share: ThemeShareFiles | null,
  origin: string | null,
  alt: string,
  variant: string | null = null,
): void {
  const head = $('head').first();
  if (!share || !head.length) return;
  const tags: AnyNode[] = [];
  const meta = (key: 'property' | 'name', name: string, content: string) => {
    const el = $('<meta>');
    el.attr(key, name);
    el.attr('content', content);
    tags.push(el[0]);
  };
  const ogUrl = share.ogImage ? themeAssetUrl(themeId, share.ogImage, variant) : null;
  if (ogUrl && origin && !$('meta[property="og:image"], meta[property="og:image:url"]').length) {
    meta('property', 'og:image', `${origin}${ogUrl}`);
    meta('property', 'og:image:type', 'image/jpeg');
    meta('property', 'og:image:width', String(OG_IMAGE_SIZE.width));
    meta('property', 'og:image:height', String(OG_IMAGE_SIZE.height));
    // the image carries no text (names are never baked in, K24): its description comes from the content
    if (!$('meta[property="og:image:alt"]').length) meta('property', 'og:image:alt', alt);
    if (!$('meta[name="twitter:card"]').length) meta('name', 'twitter:card', 'summary_large_image');
    if (!$('meta[name="twitter:image:alt"]').length) meta('name', 'twitter:image:alt', alt);
  }
  const iconUrl = share.icon ? themeAssetUrl(themeId, share.icon, variant) : null;
  if (iconUrl && !$('link[rel~="icon"]').length) {
    const link = $('<link>');
    link.attr('rel', 'icon');
    link.attr('type', 'image/png');
    link.attr('href', iconUrl);
    tags.push(link[0]);
  }
  if (!tags.length) return;
  const lastMeta = head.children('meta').last();
  if (lastMeta.length) lastMeta.after(tags);
  else head.prepend(tags);
}

/** "You're invited" — the only words besides the names a protected website shows to link previews (G076). */
const INVITED = "You're invited";

/** Its counterpart in thank-you mode (G075): the fixed default title, never the couple's own words. */
const THANKED = THANK_YOU_DEFAULT_TITLE;

/**
 * Meta tags of a password-protected website (G076): names + "You're invited" (thank-you mode: "Thank you for celebrating
 * with us") only, whatever the template wrote (its description and og:description name the date and the place). Adds
 * <meta name="robots" content="noindex, nofollow">.
 */
function guestOnlyMeta($: cheerio.CheerioAPI, names: string, phrase: string = INVITED): void {
  const head = $('head').first();
  if (!head.length) return;
  const set = (attr: 'name' | 'property', key: string, value: string) => {
    const found = head.find(`meta[${attr}="${key}"]`);
    if (found.length) found.attr('content', value);
    else {
      const el = $('<meta>');
      el.attr(attr, key);
      el.attr('content', value);
      head.append(el);
    }
  };
  const title = head.find('title').first();
  if (title.length) title.text(names);
  else head.prepend($('<title></title>').text(names));
  set('name', 'description', phrase);
  set('property', 'og:title', names);
  set('property', 'og:description', phrase);
  head.find('meta[name="twitter:title"]').attr('content', names);
  head.find('meta[name="twitter:description"]').attr('content', phrase);
  head.find('meta[property="og:url"], meta[name="keywords"]').remove();
  set('name', 'robots', 'noindex, nofollow');
}

export function renderTemplate(opts: RenderOptions): RenderResult {
  const { theme, page, slug } = opts;
  const warnings = new Set<string>();
  const warn = (msg: string) => warnings.add(msg);
  const $ = cheerio.load(opts.html);
  // G144: the page's language. The couple's words: approved translations (lib/i18n/content.ts); fixed words: the dictionary.
  const langs = siteLangs(opts.content);
  const lang: Lang = opts.lang && langs.all.includes(opts.lang) ? opts.lang : langs.primary;
  /** ?lang= that page links carry (none for the primary language, except a demo visitor's linkLang). */
  const langParam = lang !== langs.primary ? lang : opts.linkLang && opts.linkLang !== langs.primary ? opts.linkLang : null;
  const dict: Dict = lang === 'en' ? {} : (opts.dict ?? {});
  const lookup = (en: string): string | null => dict[en.replace(/\s+/g, ' ').trim()] ?? null;
  const t = (en: string, vars?: Vars): string => interpolate(lookup(en) ?? en, vars);
  const content = localizedContent(opts.content, lang);
  // The thank-you preview (G075) needs a preview key: a guest's ?thanks=1 changes nothing.
  const thanksPreview = Boolean(opts.thankYouPreview && opts.previewKey);
  // G153: a palette the theme declares, else the original
  const variant = resolveVariant(theme.variants, opts.variant, { includeComing: true });
  const linkVariant = opts.variantInLinks ? variant : null;
  const view = buildView(content, { now: opts.now, thankYou: thanksPreview });
  // G068: {copy.<key>} in templates reads the text the site shows (the couple's, else the design's), never the raw record
  const copyManifest: CopyManifest = theme.copy ?? {};
  view.copy = Object.fromEntries(Object.entries(resolveCopy(content, copyManifest)).map(([k, v]) => [k, v === copyManifest[k].default ? t(v) : v]));
  const locale = typeof view.locale === 'string' ? view.locale : 'en-US';
  if (lang !== 'en') {
    view.date_long = dateLongIn(view.date, lang, locale);
    view.date_weekday = weekdayIn(view.date, lang);
    if (view.thank_you_title === THANK_YOU_DEFAULT_TITLE) view.thank_you_title = t(THANK_YOU_DEFAULT_TITLE);
  }
  const blocks = (view.optional_blocks ?? {}) as Record<string, unknown>;
  // G127: places with a map / directions. After the wedding the block is not shown (no one travels there any more).
  const placesOn = mapPlaces(content);
  const placesShown = view.thank_you_on === true ? [] : placesOn;
  view.map_on = placesOn.length > 0;
  view.map_block = placesShown.length > 0 || (!view.map_on && isPresent(getPath(view, 'urls.map')));
  let mapUsed = false;
  let mapFrame = false;
  // G138: travel & stay, the menu and the free Details blocks (none after the wedding)
  const travel = travelData(content);
  const menu = view.thank_you_on === true ? null : menuData(content);
  const infos = view.thank_you_on === true ? [] : infoBlocks(content);
  const travelOn = view.thank_you_on !== true && (travel.transport.length > 0 || travel.stays.length > 0);
  view.travel_block = travelOn || isPresent(getPath(view, 'urls.accommodation'));
  view.menu_block = menu !== null;
  view.info_blocks = infos.length > 0;
  let extrasUsed = false;

  const resolvePath = (expr: string, scope: string | null): string => {
    const e = expr.trim();
    if (!e.startsWith('.')) return e;
    if (!scope) {
      warn(`relative path "${e}" used outside data-repeat`);
      return e.slice(1);
    }
    return e === '.' ? scope : `${scope}${e}`;
  };

  /** Display text for a value; null when there is nothing to show. */
  const formatValue = (value: unknown, absPath: string, formats: string[]): string | null => {
    if (value === null || value === undefined || typeof value === 'boolean') return null;
    if (typeof value === 'object') {
      warn(`"${absPath}" points to an object/array, not text`);
      return null;
    }
    const s = String(value);
    for (const f of formats) if (f !== 'amp' && !TEXT_FORMATS.has(f)) warn(`unknown data-format "${f}"`);
    let format = formats.find((f) => TEXT_FORMATS.has(f)) ?? 'auto';
    if (format === 'auto') {
      const kind = fieldKind(absPath);
      format = kind === 'date' ? 'date' : kind === 'time' ? 'time' : 'raw';
    }
    const iso = parseIsoDate(s);
    switch (format) {
      case 'date':
        return dateIn(s, lang, locale) ?? s;
      case 'date-long':
        return dateLongIn(s, lang, locale) ?? s;
      case 'weekday':
        return weekdayIn(s, lang) ?? s;
      case 'month':
        return monthIn(s, lang) ?? s;
      case 'day':
        return iso ? String(iso.day) : s;
      case 'year':
        return iso ? String(iso.year) : s;
      case 'time':
        return timeIn(s, lang, locale) ?? s;
      default:
        return s;
    }
  };

  /** "{name_display} · {date|date-long}" -> text. Missing values become "". */
  const fillTemplate = (template: string, scope: string | null): string =>
    template.replace(TEMPLATE_RE, (_m, p: string, f: string | undefined) => {
      const abs = resolvePath(p, scope);
      return formatValue(getPath(view, abs), abs, f ? [f] : []) ?? '';
    });

  const setAmpText = (el: Element, text: string) => {
    $(el).empty();
    const parts = text.split('&');
    parts.forEach((part, i) => {
      if (part) $(el).append(new Text(part));
      if (i < parts.length - 1) {
        const amp = $('<span class="amp"></span>');
        amp.text('&');
        $(el).append(amp);
      }
    });
  };

  const setText = (el: Element, text: string | null, formats: string[]) => {
    if (text === null || text.trim() === '') {
      $(el).empty();
      el.attribs['data-empty'] = '';
      return;
    }
    delete el.attribs['data-empty'];
    if (formats.includes('amp')) setAmpText(el, text);
    else $(el).text(text);
  };

  const markPhotoState = (el: Element, state: 'user' | 'placeholder') => {
    el.attribs['data-photo-state'] = state;
    const slotEl = $(el).closest('[data-slot]')[0];
    if (slotEl && slotEl !== el && isTag(slotEl)) slotEl.attribs['data-photo-state'] = state;
  };

  // Platform photos (/media/…) are only served for published content, or with the preview key
  // (lib/site/static.ts): a draft preview passes the key on.
  const withPhotoKey = (url: string): string =>
    opts.previewKey && url.startsWith('/media/') ? `${url}${url.includes('?') ? '&' : '?'}preview=${encodeURIComponent(opts.previewKey)}` : url;

  /**
   * Puts a content photo on an element: <img> src (placeholder srcset/<source> removed) or --photo CSS variable.
   * A photo stored with size variants (G055) gets srcset = variants + photo; sizes = the template's (the slot's
   * CSS width, written for the placeholder); without one "auto, 100vw" on a lazy image (the browser uses the laid-out
   * width; one without `auto` support reads 100vw), else "100vw". 100vw never picks a file larger than the photo
   * itself, so a template without sizes downloads at most what it did before G055.
   */
  const applyPhotoValue = (el: Element, raw: unknown, label: string) => {
    const safe = safePhotoUrl(raw);
    if (raw && !safe) warn(`photo "${label}" has an unsafe URL and was ignored`);
    const src = safe ? withPhotoKey(safe) : null;
    if (!src) {
      markPhotoState(el, 'placeholder');
      return;
    }
    if (el.name === 'img') {
      el.attribs.src = src;
      const candidates = safe ? photoCandidates(safe) : null;
      if (candidates && candidates.length > 1) {
        el.attribs.srcset = candidates.map((c) => `${withPhotoKey(c.url)} ${c.width}w`).join(', ');
        el.attribs.sizes = el.attribs.sizes?.trim() || (el.attribs.loading === 'lazy' ? 'auto, 100vw' : '100vw');
      } else {
        delete el.attribs.srcset;
        delete el.attribs.sizes;
      }
      const parent = el.parent;
      if (parent && isTag(parent) && parent.name === 'picture') $(parent).children('source').remove();
    } else {
      const style = (el.attribs.style ?? '').trim();
      el.attribs.style = `${style ? style.replace(/;?\s*$/, '; ') : ''}--photo: ${cssUrl(src)}`;
    }
    markPhotoState(el, 'user');
  };

  /** href from a content URL; missing/unsafe -> href="#" + data-url-missing (theme JS may show a notice). */
  const applyLinkValue = (el: Element, raw: unknown) => {
    const href = safeLinkUrl(raw);
    if (href) {
      el.attribs.href = href;
      delete el.attribs['data-url-missing'];
      delete el.attribs['aria-disabled'];
      if (el.attribs.target) el.attribs.rel = 'noopener noreferrer';
    } else {
      el.attribs.href = '#';
      el.attribs['data-url-missing'] = '';
      el.attribs['aria-disabled'] = 'true';
    }
  };

  /** Returns true when the element's children were replaced (no further walking). */
  const applyField = (el: Element, scope: string | null): boolean => {
    const abs = resolvePath(el.attribs['data-field'], scope);
    el.attribs['data-field'] = abs;
    const value = getPath(view, abs);
    if (el.name === 'img') {
      applyPhotoValue(el, value, abs);
      return true;
    }
    if ((el.name === 'a' || el.name === 'area') && abs.startsWith('urls.')) {
      applyLinkValue(el, value);
      return false; // link text/children stay as authored
    }
    if (RAW_TEXT.has(el.name) || VOID.has(el.name)) {
      warn(`data-field ignored on <${el.name}> (use data-attr-* for attributes)`);
      return true;
    }
    const formats = (el.attribs['data-format'] ?? '').split(/\s+/).filter(Boolean);
    // G144: the Yes / No choices of a yes-no RSVP question are the platform's words (their value stays "Yes" / "No")
    const yesNo = /^rsvp\.questions\.\d+\.options\.\d+$/.test(abs) && getPath(view, abs.replace(/\.options\.\d+$/, '.type')) === 'yesno';
    setText(el, yesNo && typeof value === 'string' ? t(value) : formatValue(value, abs, formats), formats);
    return true;
  };

  const applyText = (el: Element, scope: string | null): boolean => {
    if (RAW_TEXT.has(el.name) || VOID.has(el.name)) {
      warn(`data-text ignored on <${el.name}>`);
      return true;
    }
    const formats = (el.attribs['data-format'] ?? '').split(/\s+/).filter(Boolean);
    setText(el, fillTemplate(el.attribs['data-text'], scope), formats);
    return true;
  };

  /** The couple's own text for a copy key ('' = keep the design's text written in the template). */
  const ownText = (key: string): string => {
    const entry = copyManifest[key];
    if (!entry) {
      if (theme.copy) warn(`copy key "${key}" is not in theme.json copy`);
      return '';
    }
    return ownCopy(content, key, entry.max);
  };

  /** data-copy: the couple's text replaces the element's (true); without one the template's text stays (false). */
  const applyCopy = (el: Element): boolean => {
    if (RAW_TEXT.has(el.name) || VOID.has(el.name)) {
      warn(`data-copy ignored on <${el.name}> (use data-copy-attr for attributes)`);
      return true;
    }
    const text = ownText(el.attribs['data-copy'].trim());
    if (!text) return false;
    // a heading written with the script type's "&" (Travel <span class="amp">&amp;</span> Stay) keeps that styling
    const formats = (el.attribs['data-format'] ?? '').split(/\s+/).filter(Boolean);
    if (formats.includes('amp') || $(el).find('.amp').length) setAmpText(el, text);
    else $(el).text(text);
    return true;
  };

  const applyCopyAttrs = (el: Element): void => {
    for (const [attr, key] of parseCopyAttr(el.attribs['data-copy-attr'])) {
      if (!COPY_ATTRS.has(attr)) {
        warn(`data-copy-attr: "${attr}" is not allowed`);
        continue;
      }
      const text = ownText(key);
      if (text) el.attribs[attr] = text;
    }
  };

  const applyPhoto = (el: Element): void => {
    const key = el.attribs['data-photo'].trim();
    const slot = theme.photos[key];
    if (!slot) {
      warn(`data-photo="${key}" is not declared in theme.json photos`);
      markPhotoState(el, 'placeholder');
      return;
    }
    applyPhotoValue(el, getPath(view, slot.source), key);
  };

  const applyUrl = (el: Element): void => {
    const key = el.attribs['data-url'].trim();
    if (!URL_KEYS.has(key)) warn(`data-url="${key}" is not a urls.* field`);
    applyLinkValue(el, getPath(view, `urls.${key}`));
  };

  // "Add to calendar" (G051): one event per render, built only when a page asks for it.
  let calendar: CalendarEvent | null | undefined;
  const getCalendar = (): CalendarEvent | null => {
    if (calendar === undefined) {
      calendar = calendarEvent(content, { siteUrl: opts.origin ? `${opts.origin}${withPreview(pageRoute(slug, 'index'), null, '', false, langParam)}` : null });
    }
    return calendar;
  };

  /** href of a data-calendar link; false = remove the element (no date yet, unknown kind, not a link). */
  const applyCalendar = (el: Element): boolean => {
    const kind = el.attribs['data-calendar'].trim();
    if (el.name !== 'a') {
      warn(`data-calendar is only for <a>, not <${el.name}>`);
      return false;
    }
    if (kind !== 'ics' && kind !== 'google') {
      warn(`data-calendar="${kind}" is not "ics" or "google"`);
      return false;
    }
    const event = getCalendar();
    if (!event) return false;
    if (kind === 'ics') {
      el.attribs.href = withPreview(`${pageRoute(slug, 'index')}/event.ics`, opts.previewKey, '', false, langParam);
    } else {
      el.attribs.href = googleCalendarUrl(event);
      if (el.attribs.target) el.attribs.rel = 'noopener noreferrer';
    }
    return true;
  };

  const applyAttrs = (el: Element, scope: string | null): void => {
    for (const name of Object.keys(el.attribs)) {
      if (!name.startsWith('data-attr-')) continue;
      const target = name.slice('data-attr-'.length);
      const allowed =
        ATTR_ALLOW.has(target) ||
        (/^data-[a-z0-9-]+$/.test(target) && !ENGINE_ATTRS.has(target) && !target.startsWith('data-attr-'));
      if (!allowed) {
        warn(`data-attr-${target} is not allowed`);
        continue;
      }
      const spec = el.attribs[name];
      if (spec.includes('{')) {
        el.attribs[target] = fillTemplate(spec, scope);
        continue;
      }
      const abs = resolvePath(spec, scope);
      el.attribs[name] = abs;
      const v = getPath(view, abs);
      el.attribs[target] = v === null || v === undefined || typeof v === 'object' ? '' : String(v);
    }
  };

  /** Evaluates data-optional / data-if; false means "remove this element". */
  const passes = (el: Element, scope: string | null): boolean => {
    const a = el.attribs;
    if ('data-optional' in a) {
      const key = a['data-optional'].trim();
      if (!KNOWN_BLOCKS.has(key)) warn(`data-optional="${key}" is not an optional_blocks key`);
      if (blocks[key] !== true) return false;
    }
    if ('data-if' in a) {
      // One condition ("path" / "!path") or several separated by spaces, all of which must hold (G075).
      const conditions = a['data-if'].trim().split(/\s+/).filter(Boolean);
      let ok = true;
      a['data-if'] = conditions
        .map((cond) => {
          const negate = cond.startsWith('!');
          const abs = resolvePath(negate ? cond.slice(1) : cond, scope);
          if (isPresent(getPath(view, abs)) === negate) ok = false;
          return (negate ? '!' : '') + abs;
        })
        .join(' ');
      if (!ok) return false;
    }
    return true;
  };

  const walk = (el: Element, scope: string | null): void => {
    const a = el.attribs;
    if (!passes(el, scope)) {
      $(el).remove();
      return;
    }
    if ('data-map' in a) {
      if (!placesShown.length) {
        $(el).remove();
        return;
      }
      $(el).html(mapBlockHtml(placesShown, { buttonClass: a['data-map-btn'], smallButtonClass: a['data-map-btn-sm'], t }));
      delete a['data-map-btn'];
      delete a['data-map-btn-sm'];
      a['data-map'] = String(placesShown.length);
      mapUsed = true;
      mapFrame = placesShown.some((p) => p.showMap);
      return;
    }
    if ('data-travel' in a || 'data-menu' in a || 'data-blocks' in a) {
      // the block's words: the couple's text for each data-copy label, else the template's, else the built-in default
      const labels = new Map<string, string>();
      $(el)
        .find('[data-copy]')
        .each((_, n) => {
          if (!isTag(n)) return;
          const key = n.attribs['data-copy'].trim();
          labels.set(key, ownText(key) || $(n).text().trim());
        });
      const label = (key: ExtrasLabel) => labels.get(key) || t(EXTRAS_LABELS[key]);
      const o = { buttonClass: a['data-pex-btn'], titleClass: a['data-pex-title'] };
      const html =
        'data-travel' in a
          ? travelOn
            ? travelHtml(travel, label, o)
            : ''
          : 'data-menu' in a
            ? menu
              ? menuHtml(menu, label, o)
              : ''
            : blocksHtml(infos, label, o);
      if (!html) {
        $(el).remove();
        return;
      }
      $(el).html(html);
      delete a['data-pex-btn'];
      delete a['data-pex-title'];
      if ('data-blocks' in a) a['data-count'] = String(infos.length);
      extrasUsed = true;
      return;
    }
    if ('data-repeat' in a) {
      const abs = resolvePath(a['data-repeat'], scope);
      const items = getPath(view, abs);
      if (!Array.isArray(items)) warn(`data-repeat="${abs}" is not a list`);
      (Array.isArray(items) ? items : []).forEach((_, i) => {
        const clone = $(el).clone();
        clone.removeAttr('data-repeat');
        clone.attr('data-repeat-item', `${abs}.${i}`);
        $(el).before(clone);
        walk(clone[0] as Element, `${abs}.${i}`);
      });
      $(el).remove();
      return;
    }
    if ('data-calendar' in a && !applyCalendar(el)) {
      $(el).remove();
      return;
    }
    let replaced = false;
    if ('data-field' in a) replaced = applyField(el, scope);
    else if ('data-text' in a) replaced = applyText(el, scope);
    // a link to a urls.* value keeps its text from the field: its words can still be the couple's (View map)
    if ('data-copy' in a && !replaced) replaced = applyCopy(el);
    if ('data-copy-attr' in a) applyCopyAttrs(el);
    if ('data-photo' in a) applyPhoto(el);
    if ('data-url' in a) applyUrl(el);
    applyAttrs(el, scope);
    // A placeholder image is decoration: a data-attr-alt written for the couple's photo does not apply.
    if (el.name === 'img' && a['data-photo-state'] === 'placeholder' && 'data-attr-alt' in a) a.alt = '';
    if (replaced) return;
    for (const child of [...el.children]) {
      if (isTag(child)) walk(child, scope);
      // <template> content is a fragment of its own (e.g. the RSVP form's guest row, G069): its markers count too
      else if (child.type === 'root' && hasChildren(child)) for (const c of [...child.children]) if (isTag(c)) walk(c, scope);
    }
  };

  // A page whose <html> or <body> is switched off (e.g. <body data-optional="our_story">) is not served.
  const pageSwitches = [$('html')[0], $('body')[0]].filter((n): n is Element => Boolean(n) && isTag(n));
  const disabled = pageSwitches.some((n) => !passes(n, null));
  for (const n of pageSwitches) {
    delete n.attribs['data-optional'];
    delete n.attribs['data-if'];
  }
  if (disabled) return { html: '', warnings: [...warnings], disabled: true, scriptHashes: [], frameSources: [] };

  // G144: the template's fixed English words in the page's language (before the content goes in: the couple's own
  // text replaces a data-copy element later, so it always wins)
  if (lang !== 'en') {
    visitTemplateTexts($, (key) => copyManifest[key]?.default, {
      text: (el, en) => {
        const tr = lookup(en);
        if (!tr) return;
        if ($(el).find('.amp').length) setAmpText(el, tr);
        else $(el).text(tr);
      },
      attr: (el, name, en) => {
        const tr = lookup(en);
        if (tr) el.attribs[name] = tr;
      },
      template: (el, name, spec) => {
        el.attribs[name] = translateTemplateSpec(spec, lookup);
      },
    });
  }

  for (const node of [...$.root()[0].children]) {
    if (isTag(node)) walk(node, null);
  }

  // Asset and page-link rewriting (only theme-authored relative references remain at this point).
  const fileToPage = new Map<string, PageName>();
  for (const [p, file] of Object.entries(theme.pages)) if (file) fileToPage.set(file, p as PageName);

  const rewriteAsset = (value: string): string | null => {
    const out = themeAssetUrl(theme.id, value, variant);
    if (!out) warn(`asset path "${value}" leaves the theme folder and was removed`);
    return out;
  };
  const rewriteLink = (value: string): string | null => {
    const { path: p, suffix } = splitSuffix(value.trim());
    const file = p.replace(/^\.\//, '');
    const target = fileToPage.get(file);
    if (target) {
      const hashAt = suffix.indexOf('#');
      const query = hashAt === -1 ? suffix : suffix.slice(0, hashAt);
      const hash = hashAt === -1 ? '' : suffix.slice(hashAt);
      return withPreview(pageRoute(slug, target), opts.previewKey, query, thanksPreview, langParam, linkVariant) + hash;
    }
    if (file.endsWith('.html')) warn(`link to "${file}" is not a declared theme page`);
    return rewriteAsset(value);
  };
  const rewriteCss = (css: string): string =>
    css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, _q, ref: string) => {
      if (!isRelativeReference(ref)) return match;
      const out = rewriteAsset(ref);
      return out ? cssUrl(out) : 'none';
    });
  const setOrDrop = (el: Element, attr: string, value: string | null) => {
    if (value === null) delete el.attribs[attr];
    else el.attribs[attr] = value;
  };

  $('*').each((_, node) => {
    if (!isTag(node)) return;
    const el = node;
    const a = el.attribs;
    if (a.href !== undefined && isRelativeReference(a.href)) {
      setOrDrop(el, 'href', el.name === 'a' || el.name === 'area' ? rewriteLink(a.href) : rewriteAsset(a.href));
    }
    if (a['xlink:href'] !== undefined && isRelativeReference(a['xlink:href'])) {
      setOrDrop(el, 'xlink:href', rewriteAsset(a['xlink:href']));
    }
    if (a.src !== undefined && SRC_ELEMENTS.has(el.name) && isRelativeReference(a.src)) {
      setOrDrop(el, 'src', rewriteAsset(a.src));
    }
    if (a.poster !== undefined && isRelativeReference(a.poster)) setOrDrop(el, 'poster', rewriteAsset(a.poster));
    if (a.srcset !== undefined) {
      a.srcset = a.srcset
        .split(',')
        .map((candidate) => {
          const [url, ...descriptor] = candidate.trim().split(/\s+/);
          if (!url || !isRelativeReference(url)) return candidate.trim();
          const out = rewriteAsset(url);
          return out ? [out, ...descriptor].join(' ') : '';
        })
        .filter(Boolean)
        .join(', ');
    }
    if (a.style !== undefined && a.style.includes('url(')) a.style = rewriteCss(a.style);
    if (el.name === 'style') {
      const css = $(el).text();
      if (css.includes('url(')) $(el).text(rewriteCss(css));
    }
    if (el.name === 'meta' && a.content && OG_IMAGE.has(a.property ?? a.name ?? '') && isRelativeReference(a.content)) {
      const out = rewriteAsset(a.content);
      setOrDrop(el, 'content', out && opts.origin ? `${opts.origin}${out}` : out);
    }
  });

  const names = typeof view.name_display === 'string' ? view.name_display.trim() : '';
  writeShareTags($, theme.id, opts.share ?? null, opts.origin ?? null, names ? t('{names} wedding invitation', { names }) : t('Wedding invitation'), variant);

  // G153: a theme with palettes: variants.css (:root = the colour channels site.css uses, html[data-variant="<id>"] = each
  // palette's tokens), after the theme's own stylesheets — on every page of the theme, the original palette too
  if (variant || theme.variants?.length) {
    const href = themeAssetUrl(theme.id, VARIANTS_CSS, variant);
    const sheets = $('head link[rel~="stylesheet"]');
    const link = $('<link rel="stylesheet">').attr('href', href ?? '');
    if (sheets.length) sheets.last().after(link);
    else $('head').first().append(link);
  }
  if (opts.guestOnlyMeta) guestOnlyMeta($, names || t('Our wedding'), t(view.thank_you_on === true ? THANKED : INVITED));

  // G144: a site in several languages — hreflang alternates (needs the public origin), the switcher and its suggestion
  if (langs.all.length > 1) {
    const head = $('head').first();
    const hrefOf = (l: Lang, absolute: boolean) =>
      `${absolute ? (opts.origin ?? '') : ''}${withPreview(pageRoute(slug, page), opts.previewKey, '', thanksPreview, l === langs.primary ? null : l, linkVariant)}`;
    if (opts.origin && !opts.previewKey) {
      for (const l of langs.all) head.append($('<link rel="alternate">').attr('hreflang', l).attr('href', hrefOf(l, true)));
      head.append($('<link rel="alternate" hreflang="x-default">').attr('href', hrefOf(langs.primary, true)));
    }
    head.append($('<link rel="stylesheet">').attr('href', LANG_CSS));
    head.append($('<script defer></script>').attr('src', LANG_JS));
    const items = langs.all
      .map((l) => {
        const current = l === lang ? ' aria-current="true"' : '';
        return `<li><a href="${esc(hrefOf(l, false))}" hreflang="${l}" lang="${l}"${current} data-lang="${l}">${esc(LANG_NAMES[l])}</a></li>`;
      })
      .join('');
    $('body')
      .first()
      .append(
        `<nav class="pl-lang" aria-label="${esc(t('Language'))}" data-pl-lang><details><summary><span class="pl-lang-globe" aria-hidden="true"></span>` +
          `<span class="pl-lang-code">${lang.toUpperCase()}</span><span class="pl-lang-sr">${esc(t('Language'))}: ${esc(LANG_NAMES[lang])}</span></summary>` +
          `<ul>${items}</ul></details></nav>`,
      );
  }

  // G127: the shared map block's stylesheet and script (platform files, script-src 'self'), only on a page that has it.
  if (mapUsed) {
    const head = $('head').first();
    head.append($('<link rel="stylesheet">').attr('href', MAP_CSS));
    head.append($('<script defer></script>').attr('src', MAP_JS));
  }

  // G138: the shared Details blocks' stylesheet, only on a page that shows one
  if (extrasUsed) $('head').first().append($('<link rel="stylesheet">').attr('href', EXTRAS_CSS));

  // Theme inline scripts are trusted template code (content can never create a <script>:
  // every inserted value is text). Their hashes go into the page CSP.
  const scriptHashes = new Set<string>();
  $('script').each((_, node) => {
    if (!isTag(node) || node.attribs.src !== undefined) return;
    const type = (node.attribs.type ?? '').trim().toLowerCase();
    if (DATA_SCRIPT_TYPES.has(type)) return;
    const code = $(node).text();
    scriptHashes.add(`'sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}'`);
  });

  // Data for theme JS (countdown, choreography, navigation). Deliberately NOT the content record or
  // the photo map: theme JS never writes personal text (the server already did), and a record in the
  // page source would expose sections the couple switched off (story, registry, hotel links …).
  const venue = (view.venue ?? {}) as Record<string, unknown>;
  const rsvp = (view.rsvp ?? {}) as Record<string, unknown>;
  const payload = {
    slug,
    theme: theme.id,
    variant,
    page,
    preview: Boolean(opts.previewKey),
    pages: Object.fromEntries(
      Object.keys(theme.pages).map((p) => [p, withPreview(pageRoute(slug, p as PageName), opts.previewKey, '', thanksPreview, langParam, linkVariant)]),
    ),
    // G144: the page's language, the site's languages and the guest scripts' texts in this language (null = English)
    lang,
    langs: langs.all,
    lang_primary: langs.primary,
    i18n: scriptTexts(dict, lang),
    derived: {
      date_display: dateIn(view.date, lang, locale),
      date_long: view.date_long ?? null,
      date_weekday: view.date_weekday ?? null,
      ceremony_time_display: timeIn(view.ceremony_time, lang, locale),
      rsvp_deadline_display: dateIn(rsvp.deadline, lang, locale),
      venue_city_region: venue.city_region ?? null,
      venue_city_region_country: venue.city_region_country ?? null,
      countdown_target_utc: view.countdown_target_utc ?? null,
      // G075: theme JS may skip what has no place after the wedding (countdown, accents of the invitation)
      thank_you_on: view.thank_you_on === true,
    },
    // G128: the reply form's required fields and answer types for /rsvp/form.js (ids and flags only, no texts)
    rsvp_form: formScriptConfig(view),
  };
  // G126: music (story page) and sound effects for public/audio/audio.js; the music URL must be safe like a photo's.
  const sound = siteSound(content, theme.id, page, (u) => {
    const safe = safePhotoUrl(u);
    return safe ? withPhotoKey(safe) : '';
  });
  if (sound) {
    if (sound.music === '') sound.music = null;
    (payload as Record<string, unknown>).sound = sound;
  }
  $('#site-data').remove();
  const dataScript = $('<script type="application/json" id="site-data"></script>');
  dataScript.text(safeJsonForScript(payload));
  const firstHeadScript = $('head script').first();
  if (firstHeadScript.length) firstHeadScript.before(dataScript);
  else $('head').append(dataScript);
  if (sound && !$(`script[src="${AUDIO_SCRIPT_SRC}"]`).length) $('head').append(`<script src="${AUDIO_SCRIPT_SRC}" defer></script>`);

  // Template comments are notes for theme developers (task ids, build steps), not for guests.
  const dropComments = (nodes: readonly AnyNode[]) => {
    for (const n of nodes) {
      if (n.type === 'comment') $(n).remove();
      else if (hasChildren(n)) dropComments([...n.children]);
    }
  };
  dropComments([...$.root()[0].children]);

  const html = $('html');
  // G144: the page's language (the template's lang="en" is the design's default)
  html.attr('lang', lang);
  html.attr('data-theme', theme.id);
  html.attr('data-page', page);
  if (variant) html.attr('data-variant', variant);
  if (opts.previewKey) html.attr('data-preview', 'true');
  // CSS hook of thank-you mode (G075): html[data-thank-you] (the content itself switches with data-if="thank_you_on").
  if (view.thank_you_on === true) html.attr('data-thank-you', '');

  return {
    html: $.html(),
    warnings: [...warnings],
    disabled: false,
    scriptHashes: [...scriptHashes],
    frameSources: mapFrame ? [MAP_FRAME_ORIGIN] : [],
  };
}
