// URL safety helpers shared by the template engine and content validation.
// Every URL that comes from content (buyer input) passes through one of these
// before it reaches an attribute. Anything else is dropped.
// No Node imports: content validation (which uses this file) may also run in the browser panel.

import { VARIANT_ID_RE, VARIANT_SEGMENT_PREFIX } from './variants.ts';

const LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
const WEB_PROTOCOLS = new Set(['http:', 'https:']);
const LOCAL_BASE = 'http://local.invalid';

function parseAbsolute(value: unknown): URL | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

/** Absolute http(s) URL, normalised; null otherwise. */
export function safeHttpUrl(value: unknown): string | null {
  const url = parseAbsolute(value);
  return url && WEB_PROTOCOLS.has(url.protocol) && url.hostname ? url.href : null;
}

/** Link target for `data-url`: http(s), mailto or tel only; null otherwise. */
export function safeLinkUrl(value: unknown): string | null {
  const url = parseAbsolute(value);
  if (!url || !LINK_PROTOCOLS.has(url.protocol)) return null;
  if (WEB_PROTOCOLS.has(url.protocol) && !url.hostname) return null;
  if (!WEB_PROTOCOLS.has(url.protocol) && url.pathname.length === 0) return null;
  return url.href;
}

/**
 * Photo source from content: an absolute http(s) URL (e.g. storage) or a
 * root-relative same-origin path (e.g. /media/<site>/<file> from the local adapter).
 * Protocol-relative (//host), data:, javascript: and relative paths are rejected.
 */
export function safePhotoUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  if (!v) return null;
  if (v.startsWith('/')) {
    if (v.startsWith('//') || v.includes('\\')) return null;
    try {
      const url = new URL(v, LOCAL_BASE);
      if (url.origin !== LOCAL_BASE) return null;
      return url.pathname + url.search;
    } catch {
      return null;
    }
  }
  return safeHttpUrl(v);
}

/** True for theme-relative references such as `style.css`, `./assets/a.webp`, `../x` (not `/x`, `#x`, `x:`, `//x`). */
export function isRelativeReference(value: string): boolean {
  const v = value.trim();
  if (!v || v.startsWith('/') || v.startsWith('#') || v.startsWith('?') || v.startsWith('\\')) return false;
  return !/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v);
}

/** Split `a/b.css?x#y` into path and suffix (`?x#y`). */
export function splitSuffix(value: string): { path: string; suffix: string } {
  const i = value.search(/[?#]/);
  return i === -1 ? { path: value, suffix: '' } : { path: value.slice(0, i), suffix: value.slice(i) };
}

/**
 * Normalise a theme-relative path. Returns null when it escapes the theme folder.
 * `./assets/../style.css` -> `style.css`; `../x` -> null.
 */
export function normalizeThemePath(rel: string): string | null {
  const p = rel.trim().replace(/\\/g, '/');
  if (p.startsWith('/')) return null;
  const out: string[] = [];
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') {
      if (!out.length) return null;
      out.pop();
    } else {
      out.push(seg);
    }
  }
  return out.length ? out.join('/') : null;
}

/**
 * Public URL of a theme asset: /themes/<theme>/<path>. With a colour variant (G153): /themes/<theme>/~<variant>/<path>,
 * the variant's virtual folder (its image override, else the original; lib/site/static.ts).
 */
export function themeAssetUrl(themeId: string, rel: string, variant: string | null = null): string | null {
  const { path: p, suffix } = splitSuffix(rel);
  const normalized = normalizeThemePath(p);
  if (!normalized) return null;
  const encoded = normalized.split('/').map((seg) => encodeURIComponent(decodeURIComponentSafe(seg))).join('/');
  const folder = variant && VARIANT_ID_RE.test(variant) ? `${VARIANT_SEGMENT_PREFIX}${variant}/` : '';
  return `/themes/${encodeURIComponent(themeId)}/${folder}${encoded}${suffix}`;
}

function decodeURIComponentSafe(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

/** A URL wrapped for CSS: url("...") with quotes, backslashes and newlines escaped. */
export function cssUrl(url: string): string {
  const escaped = url.replace(/[\\"\n\r\f]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `);
  return `url("${escaped}")`;
}
