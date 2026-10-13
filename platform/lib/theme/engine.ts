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
//   data-if="venue.address"        element kept only when the value is non-empty ("!path" negates)
//   data-repeat="schedule"         element repeated per array item; inner paths start with "." (".time")
//   data-attr-<name>="path"        attribute <name> = raw value, or a {template} (allow-listed attributes only)
//   data-calendar="ics|google"     <a> href = /<slug>/event.ics or a Google Calendar link (lib/calendar.ts);
//                                  removed when the content has no readable date
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
import { formatDate, formatDateLong, formatTime, monthName, parseIsoDate, weekdayName } from '../content/format.ts';
import { photoCandidates } from '../photo-variants.ts';
import type { ThemeShareFiles } from './share.ts';
import { OG_IMAGE_SIZE } from './share.ts';
import type { PageName, ThemeManifest } from './theme.ts';
import { cssUrl, isRelativeReference, safeLinkUrl, safePhotoUrl, splitSuffix, themeAssetUrl } from './urls.ts';

export interface RenderOptions {
  html: string;
  content: unknown;
  theme: Pick<ThemeManifest, 'id' | 'pages' | 'photos'>;
  page: PageName;
  slug: string;
  variant?: string | null;
  /** When set, links between theme pages keep ?preview=<key> so draft navigation works. */
  previewKey?: string | null;
  /**
   * Absolute public origin (https://example.com; PLATFORM_PUBLIC_URL or the request's) for og:image and the
   * calendar's website link. Without it no og:image is written (it must be an absolute URL).
   */
  origin?: string | null;
  /** Share image / tab icon of the theme (LoadedTheme.share). Absent: no og:image, no icon tags. */
  share?: ThemeShareFiles | null;
}

export interface RenderResult {
  html: string;
  warnings: string[];
  /** True when <html>/<body> carries a data-optional / data-if that is off: serve 404. */
  disabled: boolean;
  /** CSP hashes ('sha256-…') of the theme's inline scripts, for script-src. */
  scriptHashes: string[];
}

const RAW_TEXT = new Set(['script', 'style', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext', 'noscript']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const TEXT_FORMATS = new Set(['auto', 'raw', 'date', 'date-long', 'weekday', 'month', 'day', 'year', 'time']);
const KNOWN_BLOCKS = new Set(['our_story', 'countdown', 'dress_code', 'registry', 'travel_stay', 'faq', 'guest_policy']);
const URL_KEYS = new Set(['website', 'rsvp_form', 'map', 'registry', 'accommodation']);
const ATTR_ALLOW = new Set(['alt', 'title', 'content', 'aria-label', 'datetime', 'value', 'placeholder']);
const ENGINE_ATTRS = new Set(['data-field', 'data-format', 'data-text', 'data-photo', 'data-optional', 'data-url', 'data-if', 'data-repeat', 'data-calendar']);
const SRC_ELEMENTS = new Set(['img', 'script', 'source', 'video', 'audio', 'track', 'embed', 'iframe', 'input']);
const OG_IMAGE = new Set(['og:image', 'og:image:url', 'twitter:image']);
const DATA_SCRIPT_TYPES = new Set(['application/json', 'application/ld+json', 'text/template', 'text/plain']);
const TEMPLATE_RE = /\{\s*([^{}|\s]+)\s*(?:\|\s*([a-z-]+)\s*)?\}/g;

/** Page route for a theme page: index -> /<slug>, others -> /<slug>/<page>. */
export function pageRoute(slug: string, page: PageName): string {
  return page === 'index' ? `/${slug}` : `/${slug}/${page}`;
}

function withPreview(route: string, previewKey: string | null | undefined, extraQuery = ''): string {
  const params = new URLSearchParams(extraQuery.replace(/^\?/, ''));
  if (previewKey) params.set('preview', previewKey);
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
function writeShareTags($: cheerio.CheerioAPI, themeId: string, share: ThemeShareFiles | null, origin: string | null, alt: string): void {
  const head = $('head').first();
  if (!share || !head.length) return;
  const tags: AnyNode[] = [];
  const meta = (key: 'property' | 'name', name: string, content: string) => {
    const el = $('<meta>');
    el.attr(key, name);
    el.attr('content', content);
    tags.push(el[0]);
  };
  const ogUrl = share.ogImage ? themeAssetUrl(themeId, share.ogImage) : null;
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
  const iconUrl = share.icon ? themeAssetUrl(themeId, share.icon) : null;
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

export function renderTemplate(opts: RenderOptions): RenderResult {
  const { theme, page, slug } = opts;
  const warnings = new Set<string>();
  const warn = (msg: string) => warnings.add(msg);
  const $ = cheerio.load(opts.html);
  const view = buildView(opts.content);
  const locale = typeof view.locale === 'string' ? view.locale : 'en-US';
  const blocks = (view.optional_blocks ?? {}) as Record<string, unknown>;

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
        return formatDate(s, locale) ?? s;
      case 'date-long':
        return formatDateLong(s, locale) ?? s;
      case 'weekday':
        return weekdayName(s) ?? s;
      case 'month':
        return monthName(s) ?? s;
      case 'day':
        return iso ? String(iso.day) : s;
      case 'year':
        return iso ? String(iso.year) : s;
      case 'time':
        return formatTime(s, locale) ?? s;
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
    setText(el, formatValue(value, abs, formats), formats);
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
      calendar = calendarEvent(opts.content, { siteUrl: opts.origin ? `${opts.origin}${pageRoute(slug, 'index')}` : null });
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
      el.attribs.href = withPreview(`${pageRoute(slug, 'index')}/event.ics`, opts.previewKey);
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
      let expr = a['data-if'].trim();
      const negate = expr.startsWith('!');
      if (negate) expr = expr.slice(1);
      const abs = resolvePath(expr, scope);
      a['data-if'] = (negate ? '!' : '') + abs;
      if (isPresent(getPath(view, abs)) === negate) return false;
    }
    return true;
  };

  const walk = (el: Element, scope: string | null): void => {
    const a = el.attribs;
    if (!passes(el, scope)) {
      $(el).remove();
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
    if ('data-photo' in a) applyPhoto(el);
    if ('data-url' in a) applyUrl(el);
    applyAttrs(el, scope);
    // A placeholder image is decoration: a data-attr-alt written for the couple's photo does not apply.
    if (el.name === 'img' && a['data-photo-state'] === 'placeholder' && 'data-attr-alt' in a) a.alt = '';
    if (replaced) return;
    for (const child of [...el.children]) {
      if (isTag(child)) walk(child, scope);
    }
  };

  // A page whose <html> or <body> is switched off (e.g. <body data-optional="our_story">) is not served.
  const pageSwitches = [$('html')[0], $('body')[0]].filter((n): n is Element => Boolean(n) && isTag(n));
  const disabled = pageSwitches.some((n) => !passes(n, null));
  for (const n of pageSwitches) {
    delete n.attribs['data-optional'];
    delete n.attribs['data-if'];
  }
  if (disabled) return { html: '', warnings: [...warnings], disabled: true, scriptHashes: [] };

  for (const node of [...$.root()[0].children]) {
    if (isTag(node)) walk(node, null);
  }

  // Asset and page-link rewriting (only theme-authored relative references remain at this point).
  const fileToPage = new Map<string, PageName>();
  for (const [p, file] of Object.entries(theme.pages)) if (file) fileToPage.set(file, p as PageName);

  const rewriteAsset = (value: string): string | null => {
    const out = themeAssetUrl(theme.id, value);
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
      return withPreview(pageRoute(slug, target), opts.previewKey, query) + hash;
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
  writeShareTags($, theme.id, opts.share ?? null, opts.origin ?? null, names ? `${names} wedding invitation` : 'Wedding invitation');

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
    variant: opts.variant ?? null,
    page,
    preview: Boolean(opts.previewKey),
    pages: Object.fromEntries(
      Object.keys(theme.pages).map((p) => [p, withPreview(pageRoute(slug, p as PageName), opts.previewKey)]),
    ),
    derived: {
      date_display: formatDate(view.date, locale),
      date_long: view.date_long ?? null,
      date_weekday: view.date_weekday ?? null,
      ceremony_time_display: formatTime(view.ceremony_time, locale),
      rsvp_deadline_display: formatDate(rsvp.deadline, locale),
      venue_city_region: venue.city_region ?? null,
      venue_city_region_country: venue.city_region_country ?? null,
      countdown_target_utc: view.countdown_target_utc ?? null,
    },
  };
  $('#site-data').remove();
  const dataScript = $('<script type="application/json" id="site-data"></script>');
  dataScript.text(safeJsonForScript(payload));
  const firstHeadScript = $('head script').first();
  if (firstHeadScript.length) firstHeadScript.before(dataScript);
  else $('head').append(dataScript);

  // Template comments are notes for theme developers (task ids, build steps), not for guests.
  const dropComments = (nodes: readonly AnyNode[]) => {
    for (const n of nodes) {
      if (n.type === 'comment') $(n).remove();
      else if (hasChildren(n)) dropComments([...n.children]);
    }
  };
  dropComments([...$.root()[0].children]);

  const html = $('html');
  if (!html.attr('lang')) html.attr('lang', 'en');
  html.attr('data-theme', theme.id);
  html.attr('data-page', page);
  if (opts.variant) html.attr('data-variant', opts.variant);
  if (opts.previewKey) html.attr('data-preview', 'true');

  return { html: $.html(), warnings: [...warnings], disabled: false, scriptHashes: [...scriptHashes] };
}
