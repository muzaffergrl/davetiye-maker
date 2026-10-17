// G144: the couple's own text in several languages. Pure (panel + server).
//
//   content.languages     {primary: 'en', extra: ['tr', 'de']}     the couple writes in `primary`
//   content.translations  {tr: {'story.intro': {text, src, ok}}}  per language, per content path
//
// A guest reading language L sees, for each translatable field: the approved translation whose `src` still matches the
// hash of the current source text; otherwise the source text itself (primary language). Unapproved (just auto-made)
// translations never reach guests; a stale one (source edited since) shows the source until the couple refreshes it.

import { DEFAULT_LANG, isLang, LANGS, type Lang } from './langs.ts';

export interface SiteLangs {
  primary: Lang;
  /** primary first, then the extra languages (no duplicates). */
  all: Lang[];
}

const isPlainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

export function siteLangs(content: unknown): SiteLangs {
  const l = isPlainObject(content) && isPlainObject(content.languages) ? content.languages : null;
  const primary = l && isLang(l.primary) ? l.primary : DEFAULT_LANG;
  const extra = l && Array.isArray(l.extra) ? l.extra.filter(isLang) : [];
  const all = [primary, ...LANGS.filter((x) => x !== primary && extra.includes(x))];
  return { primary, all };
}

/**
 * Content paths of the couple's own words that can be translated (names, places, addresses, links, dates are not).
 * `*` = an array index. Custom design texts are `copy.<key>`.
 */
export const TRANSLATABLE_PATHS: readonly string[] = [
  'host_line',
  'dress_code',
  'schedule.*.label',
  'schedule.*.location',
  'story.intro',
  'story.items.*.caption',
  'story.items.*.text',
  'faq.*.q',
  'faq.*.a',
  'travel.airport.text',
  'travel.parking.text',
  'travel.shuttle.text',
  'travel.taxi.text',
  'travel.stays.*.note',
  'travel.stays.*.distance',
  'meal.courses.*.title',
  'meal.courses.*.items.*',
  'meal.note',
  'details_blocks.*.title',
  'details_blocks.*.text',
  'details_blocks.*.link_label',
  'thank_you.title',
  'thank_you.message',
  'rsvp.questions.*.label',
  'maps.venue.label',
  'maps.reception.label',
];

/** One translatable text of a record. */
export interface SourceField {
  path: string;
  text: string;
}

function collect(value: unknown, pattern: string[], prefix: string[], out: SourceField[]): void {
  if (!pattern.length) {
    if (typeof value === 'string' && value.trim()) out.push({ path: prefix.join('.'), text: value });
    return;
  }
  const [head, ...rest] = pattern;
  if (head === '*') {
    if (Array.isArray(value)) value.forEach((v, i) => collect(v, rest, [...prefix, String(i)], out));
    return;
  }
  if (isPlainObject(value) && Object.hasOwn(value, head)) collect(value[head], rest, [...prefix, head], out);
}

/** Every non-empty translatable text of a record, in the order of TRANSLATABLE_PATHS (copy.* last, by key). */
export function sourceFields(content: unknown): SourceField[] {
  const out: SourceField[] = [];
  for (const p of TRANSLATABLE_PATHS) collect(content, p.split('.'), [], out);
  const copy = isPlainObject(content) && isPlainObject(content.copy) ? content.copy : {};
  for (const key of Object.keys(copy).sort()) {
    const v = copy[key];
    if (typeof v === 'string' && v.trim()) out.push({ path: `copy.${key}`, text: v });
  }
  return out;
}

/** Is `path` a translatable content path? */
export function isTranslatablePath(path: string): boolean {
  if (/^copy\.[a-z][a-z0-9_]{0,47}$/.test(path)) return true;
  const parts = path.split('.');
  return TRANSLATABLE_PATHS.some((p) => {
    const q = p.split('.');
    return q.length === parts.length && q.every((s, i) => (s === '*' ? /^\d+$/.test(parts[i]) : s === parts[i]));
  });
}

/** 8 hex digits (FNV-1a, 32 bit) of a source text: marks which source a translation was made from. */
export function srcHash(text: string): string {
  let h = 0x811c9dc5;
  const s = text.normalize('NFC');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

export type TranslationState = 'missing' | 'draft' | 'stale' | 'ok';

interface StoredTranslation {
  text: string;
  src: string;
  ok?: boolean;
  auto?: 'browser' | 'service';
}

function stored(content: unknown, lang: Lang, path: string): StoredTranslation | null {
  const all = isPlainObject(content) && isPlainObject(content.translations) ? content.translations : null;
  const byLang = all && isPlainObject(all[lang]) ? all[lang] : null;
  const entry = byLang && isPlainObject(byLang[path]) ? byLang[path] : null;
  return entry && typeof entry.text === 'string' && typeof entry.src === 'string' ? (entry as unknown as StoredTranslation) : null;
}

/** State of one field's translation: missing · draft (not approved yet) · stale (source changed) · ok. */
export function translationState(content: unknown, lang: Lang, field: SourceField): TranslationState {
  const t = stored(content, lang, field.path);
  if (!t || !t.text.trim()) return 'missing';
  if (t.src !== srcHash(field.text)) return 'stale';
  return t.ok ? 'ok' : 'draft';
}

export function translationOf(content: unknown, lang: Lang, path: string): StoredTranslation | null {
  return stored(content, lang, path);
}

function setPath(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts.slice(0, -1)) {
    cur = Array.isArray(cur) ? cur[Number(p)] : isPlainObject(cur) ? cur[p] : undefined;
    if (cur === undefined || cur === null || typeof cur !== 'object') return;
  }
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) cur[Number(last)] = value;
  else if (isPlainObject(cur)) cur[last] = value;
}

/**
 * The record as guests read it in `lang`: approved, up-to-date translations replace the source text. The primary
 * language (or a language the site does not offer) returns the record unchanged. `translations` is dropped from the
 * result (the engine never needs it).
 */
export function localizedContent<T>(content: T, lang: Lang): T {
  if (!isPlainObject(content)) return content;
  const { primary, all } = siteLangs(content);
  if (lang === primary || !all.includes(lang)) return content;
  const next = structuredClone(content) as Record<string, unknown>;
  for (const field of sourceFields(content)) {
    if (translationState(content, lang, field) !== 'ok') continue;
    setPath(next, field.path, stored(content, lang, field.path)!.text);
  }
  delete next.translations;
  return next as T;
}

/** Counts for the panel: how many of the record's texts are approved / waiting / stale / missing in `lang`. */
export function translationSummary(content: unknown, lang: Lang): Record<TranslationState, number> & { total: number } {
  const out = { missing: 0, draft: 0, stale: 0, ok: 0, total: 0 };
  for (const f of sourceFields(content)) {
    out[translationState(content, lang, f)] += 1;
    out.total += 1;
  }
  return out;
}
