// G144: the fixed English texts of a theme template that change with the page's language, found the same way by the
// engine (which replaces them) and by tests/i18n.test.ts (which checks every dictionary has them):
//   data-copy elements      the design's text (theme.json copy default) — the couple's own text still wins later
//   data-copy-fixed         fixed notes ("Please turn on JavaScript to send your reply.")
//   fixed attributes        aria-label / alt / title / placeholder / data-pending / meta content, unless data-attr-* fills them
//   data-text / data-attr-* templates with literal words ("Photo of {name_display}"): the whole template as a key, else
//                           each literal piece between {…} placeholders and " · " separators

import type { CheerioAPI } from 'cheerio';
import { isTag, type Element } from 'domhandler';

export const FIXED_ATTRS = ['aria-label', 'alt', 'title', 'placeholder', 'data-pending'] as const;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Literal pieces of a {placeholder} template that hold letters ("Photo of ", "Schedule, venue and travel"). */
export function templatePieces(spec: string): string[] {
  return spec
    .split(/\{[^{}]*\}/)
    .flatMap((part) => part.split(/\s*·\s*/))
    .map(norm)
    .filter((p) => /\p{L}{2}/u.test(p));
}

/** Translates the literal words of a template; `lookup` returns null when it has no translation. */
export function translateTemplateSpec(spec: string, lookup: (en: string) => string | null): string {
  if (!templatePieces(spec).length) return spec;
  const whole = lookup(norm(spec));
  if (whole) return whole;
  return spec
    .split(/(\{[^{}]*\}|\s*·\s*)/)
    .map((seg) => {
      const n = norm(seg);
      if (seg.startsWith('{') || !/\p{L}{2}/u.test(n)) return seg;
      const t = lookup(n);
      return t ? seg.replace(n, t) : seg;
    })
    .join('');
}

export interface TemplateTextVisitor {
  /** An element's whole text (data-copy without the couple's text, data-copy-fixed); `fallback` = its English text. */
  text(el: Element, english: string): void;
  /** A fixed attribute value. */
  attr(el: Element, name: string, english: string): void;
  /** A data-text / data-attr-* template with literal words. */
  template(el: Element, attr: string, spec: string): void;
}

/** Visits every translatable fixed text of a parsed template. `copyDefault(key)` = theme.json's default for a key. */
export function visitTemplateTexts($: CheerioAPI, copyDefault: (key: string) => string | undefined, v: TemplateTextVisitor): void {
  $('*').each((_, node) => {
    if (!isTag(node)) return;
    const el = node;
    const a = el.attribs;
    if ('data-copy' in a) v.text(el, norm(copyDefault(a['data-copy'].trim()) ?? $(el).text()));
    else if ('data-copy-fixed' in a) v.text(el, norm($(el).text()));
    for (const name of FIXED_ATTRS) {
      if (a[name] && !(`data-attr-${name}` in a) && !a[name].includes('{')) v.attr(el, name, norm(a[name]));
    }
    if (el.name === 'meta' && a.content && !('data-attr-content' in a) && /^(description|og:description|og:title|twitter:title|twitter:description)$/.test(a.name ?? a.property ?? '')) {
      v.attr(el, 'content', norm(a.content));
    }
    for (const [name, value] of Object.entries(a)) {
      const words = name === 'data-text' || /^data-attr-(alt|title|content|aria-label|placeholder)$/.test(name);
      if (words && value.includes('{') && templatePieces(value).length) v.template(el, name, value);
    }
  });
}

/** Every key the template asks a dictionary for (tests). */
export function templateKeys($: CheerioAPI, copyDefault: (key: string) => string | undefined): string[] {
  const keys = new Set<string>();
  visitTemplateTexts($, copyDefault, {
    text: (_el, en) => en && keys.add(en),
    attr: (_el, _n, en) => en && keys.add(en),
    template: (_el, _a, spec) => {
      // one literal piece: the whole template is the key (word order may change: "{name_display} fotoğrafı");
      // several pieces: each piece is a key
      const pieces = templatePieces(spec);
      if (pieces.length === 1) keys.add(norm(spec));
      else for (const p of pieces) keys.add(p);
    },
  });
  return [...keys];
}
