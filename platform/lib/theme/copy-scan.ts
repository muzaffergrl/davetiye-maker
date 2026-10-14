// Template side of the editable design texts (G068): which copy keys a theme's templates use and with which default, which
// visible text is still unmarked (docs/11 §3.7), and the theme.json "copy" manifest written from that
// (scripts/copy-manifest.ts). Server / tooling only (cheerio); the panel uses lib/theme/copy.ts.

import * as cheerio from 'cheerio';
import { isTag, type AnyNode, type Element } from 'domhandler';
import { COPY_ATTRS, COPY_KEY_RE, parseCopyAttr, STANDARD_COPY, type CopyEntry, type CopyManifest } from './copy.ts';

const PAGE_ORDER = ['index', 'home', 'story', 'details', 'rsvp'] as const;
type Page = (typeof PAGE_ORDER)[number];

/** Elements whose text is never shown as page text. */
const NOT_TEXT = new Set(['script', 'style', 'noscript', 'title', 'head', 'svg', 'math']);

/**
 * Text the couple cannot change that is still allowed without a key (docs/11 §3.7 allow list):
 *  - `.ph-mark` — "Your photo here", shown only in the couple's own preview;
 *  - `[data-rsvp-message]` — the platform writes its message there (/rsvp/form.js, the RSVP API);
 *  - `[data-copy-fixed]` — explicitly fixed by the theme (a platform/system sentence, e.g. "turn on JavaScript"), with a
 *    reason in a template comment.
 * Text made only of signs (·, &, →, ‹ ›, –, digits) needs no key.
 */
export const COPY_ALLOW_SELECTORS = ['.ph-mark', '[data-rsvp-message]', '[data-copy-fixed]'] as const;

const HAS_LETTER = /\p{L}/u;

/** Element text as one line (the default of a data-copy element). */
export function elementText($: cheerio.CheerioAPI, el: Element): string {
  return $(el).text().replace(/\s+/g, ' ').trim();
}

export interface CopyUse {
  key: string;
  page: Page;
  /** element text / attribute value; null for a {copy.key} inside a data-text / data-attr template. */
  default: string | null;
  where: string;
}

/** Every copy key a page uses: data-copy elements, data-copy-attr pairs and {copy.<key>} in templates. */
export function copyUses(page: Page, html: string): { uses: CopyUse[]; problems: string[] } {
  const $ = cheerio.load(html);
  const uses: CopyUse[] = [];
  const problems: string[] = [];
  const where = (el: Element) => `${page}: <${el.name}${el.attribs.class ? ` class="${el.attribs.class}"` : ''}>`;
  $('*').each((_, node) => {
    if (!isTag(node)) return;
    const el = node;
    const a = el.attribs;
    if ('data-copy' in a) {
      const key = a['data-copy'].trim();
      if (!COPY_KEY_RE.test(key)) problems.push(`${where(el)} data-copy="${key}" is not a copy key (${COPY_KEY_RE})`);
      else if ('data-text' in a || ('data-field' in a && !(el.name === 'a' && a['data-field'].trim().startsWith('urls.')))) {
        problems.push(`${where(el)} data-copy="${key}" together with data-field / data-text (the field would replace the text)`);
      } else if ($(el).find('[data-copy], [data-field], [data-text]').length) {
        problems.push(`${where(el)} data-copy="${key}" holds other markers (mark the text in a <span> of its own)`);
      } else {
        const text = elementText($, el);
        if (!text) problems.push(`${where(el)} data-copy="${key}" has no text (the text is the design's default)`);
        uses.push({ key, page, default: text, where: where(el) });
      }
    }
    if ('data-copy-attr' in a) {
      for (const [attr, key] of parseCopyAttr(a['data-copy-attr'])) {
        if (!COPY_ATTRS.has(attr)) problems.push(`${where(el)} data-copy-attr: "${attr}" is not one of ${[...COPY_ATTRS].join(', ')}`);
        else if (!COPY_KEY_RE.test(key)) problems.push(`${where(el)} data-copy-attr: "${key}" is not a copy key`);
        else if (`data-attr-${attr}` in a) problems.push(`${where(el)} data-copy-attr="${attr}:…" together with data-attr-${attr}`);
        else if (!(a[attr] ?? '').trim()) problems.push(`${where(el)} data-copy-attr="${attr}:${key}": the ${attr} attribute (the default) is empty`);
        else uses.push({ key, page, default: a[attr].replace(/\s+/g, ' ').trim(), where: `${where(el)} ${attr}` });
      }
    }
    for (const [name, value] of Object.entries(a)) {
      if (name !== 'data-text' && !name.startsWith('data-attr-')) continue;
      for (const m of value.matchAll(/\{\s*copy\.([^{}|\s]+)\s*(?:\|[^}]*)?\}/g)) {
        if (!COPY_KEY_RE.test(m[1])) problems.push(`${where(el)} ${name}: {copy.${m[1]}} is not a copy key`);
        else uses.push({ key: m[1], page, default: null, where: `${where(el)} ${name}` });
      }
    }
  });
  return { uses, problems };
}

/** Is this element (or an ancestor) one whose text the engine writes, a marked copy text, or allow-listed? */
function covered(el: Element | null): boolean {
  for (let cur: AnyNode | null = el; cur; cur = cur.parent) {
    if (!isTag(cur)) continue;
    const a = cur.attribs;
    if (NOT_TEXT.has(cur.name)) return true;
    if ('data-copy' in a || 'data-text' in a || 'data-copy-fixed' in a || 'data-rsvp-message' in a) return true;
    // data-field writes the element's text — except on a link to a urls.* value, whose text stays as written
    if ('data-field' in a && !((cur.name === 'a' || cur.name === 'area') && a['data-field'].trim().startsWith('urls.'))) return true;
    if (/(^|\s)ph-mark(\s|$)/.test(a.class ?? '')) return true;
  }
  return false;
}

export interface UnmarkedText {
  page: string;
  text: string;
  /** Closest element, e.g. <p class="kicker">. */
  where: string;
}

/**
 * Visible fixed text without a copy key (docs/11 §3.7): every text node with a letter that is not inside a data-copy /
 * data-field / data-text element or an allow-listed one. Read from the template, so states that are hidden in a normal
 * visit (thank-you mode, the reply panels, the form's guest rows, the no-JavaScript fallback) count too.
 */
export function unmarkedText(page: string, html: string): UnmarkedText[] {
  const $ = cheerio.load(html);
  const out: UnmarkedText[] = [];
  const visit = (nodes: readonly AnyNode[]) => {
    for (const n of nodes) {
      if (n.type === 'text') {
        const text = ((n as unknown as { data: string }).data ?? '').replace(/\s+/g, ' ').trim();
        if (!text || !HAS_LETTER.test(text)) continue;
        const parent = n.parent && isTag(n.parent) ? n.parent : null;
        if (covered(parent)) continue;
        out.push({ page, text, where: parent ? `<${parent.name}${parent.attribs.class ? ` class="${parent.attribs.class}"` : ''}>` : '(root)' });
      } else if ('children' in n && Array.isArray((n as Element).children)) {
        if (isTag(n) && NOT_TEXT.has(n.name)) continue;
        visit((n as Element).children);
      }
    }
  };
  visit($.root()[0].children);
  return out;
}

export interface CopyScan {
  /** key → pages and the defaults found (one default per key is expected). */
  keys: Map<string, { pages: Set<Page>; defaults: Set<string>; where: string[] }>;
  problems: string[];
  unmarked: UnmarkedText[];
}

/** All pages of a theme. */
export function scanCopy(pages: Partial<Record<Page, string>>): CopyScan {
  const keys: CopyScan['keys'] = new Map();
  const problems: string[] = [];
  const unmarked: UnmarkedText[] = [];
  for (const page of PAGE_ORDER) {
    const html = pages[page];
    if (!html) continue;
    const r = copyUses(page, html);
    problems.push(...r.problems);
    for (const u of r.uses) {
      if (!keys.has(u.key)) keys.set(u.key, { pages: new Set(), defaults: new Set(), where: [] });
      const k = keys.get(u.key)!;
      k.pages.add(u.page);
      if (u.default !== null) k.defaults.add(u.default);
      k.where.push(u.where);
    }
    unmarked.push(...unmarkedText(page, html));
  }
  for (const [key, k] of keys) {
    if (k.defaults.size > 1) problems.push(`copy key "${key}" has different texts in the templates: ${[...k.defaults].map((d) => JSON.stringify(d)).join(' / ')} (one key = one text)`);
  }
  return { keys, problems, unmarked };
}

/**
 * Compares a theme.json manifest with its templates: every key used is declared (same default, same pages), every key
 * declared is used. Empty = in step.
 */
export function manifestProblems(manifest: CopyManifest, scan: CopyScan): string[] {
  const out = [...scan.problems];
  for (const [key, k] of scan.keys) {
    const entry = manifest[key];
    if (!entry) {
      out.push(`copy key "${key}" is used (${k.where[0]}) but not in theme.json "copy" (run scripts/copy-manifest.ts)`);
      continue;
    }
    const def = [...k.defaults][0];
    if (def !== undefined && def !== entry.default) out.push(`copy.${key}: theme.json default ${JSON.stringify(entry.default)} ≠ template text ${JSON.stringify(def)}`);
    const pages = PAGE_ORDER.filter((p) => k.pages.has(p));
    if (pages.join(',') !== entry.pages.join(',')) out.push(`copy.${key}: theme.json pages [${entry.pages.join(', ')}] ≠ templates [${pages.join(', ')}]`);
  }
  for (const key of Object.keys(manifest)) if (!scan.keys.has(key)) out.push(`copy.${key} is in theme.json but no template uses it`);
  return out;
}

/**
 * The theme.json "copy" manifest for these templates: defaults and pages from the templates; `max` (and label / panel /
 * after) kept from `previous`, else the catalogue's suggestion (docs/11 §3.7), else 1.5× the default (≥ 12). A key used
 * only inside {copy.…} templates keeps its previous default (it has no element text). Throws on template problems.
 */
export function buildCopyManifest(scan: CopyScan, previous: CopyManifest = {}): CopyManifest {
  const problems = [...scan.problems];
  const out: CopyManifest = {};
  const keys = [...scan.keys.keys()].sort((a, b) => {
    const ra = STANDARD_COPY[a];
    const rb = STANDARD_COPY[b];
    const pa = ra ? ['us', 'day', 'photos', 'story', 'details', 'rsvp'].indexOf(ra.panel) : 9;
    const pb = rb ? ['us', 'day', 'photos', 'story', 'details', 'rsvp'].indexOf(rb.panel) : 9;
    return pa - pb || (ra?.rank ?? 100) - (rb?.rank ?? 100) || a.localeCompare(b);
  });
  for (const key of keys) {
    const k = scan.keys.get(key)!;
    const prev = previous[key];
    const def = [...k.defaults][0] ?? prev?.default;
    if (!def) {
      problems.push(`copy key "${key}" is used only inside {copy.…} templates: give it a default in theme.json first`);
      continue;
    }
    const suggested = STANDARD_COPY[key]?.max ?? Math.max(12, Math.ceil([...def].length * 1.5));
    const entry: CopyEntry = {
      default: def,
      max: Math.max(prev?.max ?? suggested, [...def].length),
      pages: PAGE_ORDER.filter((p) => k.pages.has(p)),
      ...(prev?.label ? { label: prev.label } : {}),
      ...(prev?.panel ? { panel: prev.panel } : {}),
      ...(prev?.after ? { after: true } : {}),
    };
    out[key] = entry;
  }
  if (problems.length) throw new Error(`copy manifest:\n  ${problems.join('\n  ')}`);
  return out;
}
