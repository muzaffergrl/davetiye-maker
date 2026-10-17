// Colour-palette variants of a design (G153, Stage 2: every design gets 5 extra palettes next to its original).
//
// theme.json  "variants": [{ "id": "sage-gold", "name": "Sage & Gold", "swatch": ["#F4F1E8", "#7E8F6A", "#B89A5E"],
//                            "status": "coming" | "live" }]
//   The original palette is "no variant" (site.variant = null). Only `live` variants are offered to buyers (panel, /start,
//   the sales site); `coming` ones are still in review: the demo (?variant=) and theme-check show them, nobody can pick them.
//
// Colours: tokens only, in the theme's generated variants.css under html[data-variant="<id>"] (tools/recolor_parts.py --css;
// the theme's own :root keeps the original). Images: img/variants/<id>/<file> overrides img/<file>; a file without an
// override falls back to the original. The engine points every theme asset of a variant page at the virtual folder
// /themes/<theme>/~<id>/… (themeAssetUrl), and lib/site/static.ts serves the override or the original from there, so
// url(img/…) inside site.css and the paths theme JS resolves against its own script URL follow the variant too.

export type VariantStatus = 'coming' | 'live';

export interface ThemeVariant {
  /** URL-safe id ("sage-gold"); the value of site.variant and of html[data-variant]. */
  id: string;
  /** Buyer-facing English name ("Sage & Gold"). */
  name: string;
  /** 2–4 colours shown as the palette's swatch (ground first, then the main colour and the accent). */
  swatch: string[];
  status: VariantStatus;
  /**
   * The printable invitation in this palette (G139 + G153, written by tools/recolor_parts.py): the text colours that
   * replace the print layout's ink / accent, and the part images recoloured into public/print/<theme>/variants/<id>/
   * (names such as "card", "back", "paper"; the others stay the original's).
   */
  print?: PrintVariantSpec;
}

export interface PrintVariantSpec {
  ink?: string;
  accent?: string;
  art?: string[];
}

export const VARIANT_ID_RE = /^[a-z][a-z0-9-]{0,31}$/;
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/** Prefix of the virtual asset folder of a variant: /themes/<theme>/~<variant>/<path>. */
export const VARIANT_SEGMENT_PREFIX = '~';

/** The theme's generated token file (html[data-variant="<id>"] blocks). */
export const VARIANTS_CSS = 'variants.css';

/** Where a variant's own images live inside the theme folder. */
export const VARIANT_IMG_DIR = 'img/variants';

/** Maximum number of extra palettes per design (5 by the Stage 2 decision; a little room for a later swap). */
export const MAX_VARIANTS = 8;

/** Parses theme.json "variants". Returns the list and the problems (empty = valid). Absent = []. */
export function parseVariants(raw: unknown): { variants: ThemeVariant[]; problems: string[] } {
  const problems: string[] = [];
  if (raw === undefined || raw === null) return { variants: [], problems };
  if (!Array.isArray(raw)) return { variants: [], problems: ['variants must be an array'] };
  if (raw.length > MAX_VARIANTS) problems.push(`variants: at most ${MAX_VARIANTS}`);
  const variants: ThemeVariant[] = [];
  const seen = new Set<string>();
  raw.forEach((v, i) => {
    const where = `variants[${i}]`;
    if (!v || typeof v !== 'object' || Array.isArray(v)) {
      problems.push(`${where} must be an object`);
      return;
    }
    const o = v as Record<string, unknown>;
    if (typeof o.id !== 'string' || !VARIANT_ID_RE.test(o.id)) {
      problems.push(`${where}.id must match ${VARIANT_ID_RE}`);
      return;
    }
    if (seen.has(o.id)) problems.push(`${where}.id "${o.id}" is used twice`);
    seen.add(o.id);
    if (typeof o.name !== 'string' || !o.name.trim() || o.name.length > 40) problems.push(`${where}.name is required (at most 40 characters)`);
    const swatch = Array.isArray(o.swatch) ? o.swatch : typeof o.swatch === 'string' ? [o.swatch] : [];
    if (swatch.length < 1 || swatch.length > 4 || !swatch.every((c) => typeof c === 'string' && HEX_RE.test(c))) {
      problems.push(`${where}.swatch must be 1–4 colours like "#A1B2C3"`);
    }
    if (o.status !== 'coming' && o.status !== 'live') problems.push(`${where}.status must be "coming" or "live"`);
    const print = parsePrint(o.print, `${where}.print`, problems);
    variants.push({
      id: o.id,
      name: typeof o.name === 'string' ? o.name.trim() : o.id,
      swatch: swatch.filter((c): c is string => typeof c === 'string' && HEX_RE.test(c)).map((c) => c.toUpperCase()),
      status: o.status === 'live' ? 'live' : 'coming',
      ...(print ? { print } : {}),
    });
  });
  return { variants, problems };
}

const ART_NAME_RE = /^[a-z][a-z0-9_-]{0,31}$/;

function parsePrint(raw: unknown, where: string, problems: string[]): PrintVariantSpec | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    problems.push(`${where} must be an object`);
    return null;
  }
  const p = raw as Record<string, unknown>;
  const out: PrintVariantSpec = {};
  for (const key of ['ink', 'accent'] as const) {
    if (p[key] === undefined) continue;
    if (typeof p[key] === 'string' && HEX_RE.test(p[key])) out[key] = (p[key] as string).toUpperCase();
    else problems.push(`${where}.${key} must be a colour like "#A1B2C3"`);
  }
  if (p.art !== undefined) {
    if (Array.isArray(p.art) && p.art.every((a) => typeof a === 'string' && ART_NAME_RE.test(a))) out.art = [...(p.art as string[])];
    else problems.push(`${where}.art must be a list of part names (card, back, paper …)`);
  }
  return out;
}

/** theme.json "swatch": the original palette's 1–4 colours (shown next to the variants' swatches); null when absent. */
export function parseSwatch(raw: unknown): { swatch: string[] | null; problem: string | null } {
  if (raw === undefined || raw === null) return { swatch: null, problem: null };
  const list = Array.isArray(raw) ? raw : [raw];
  if (list.length < 1 || list.length > 4 || !list.every((c) => typeof c === 'string' && HEX_RE.test(c))) {
    return { swatch: null, problem: 'swatch must be 1–4 colours like "#A1B2C3"' };
  }
  return { swatch: (list as string[]).map((c) => c.toUpperCase()), problem: null };
}

/** The variants buyers can choose (status "live"). */
export function liveVariants(variants: readonly ThemeVariant[] | undefined): ThemeVariant[] {
  return (variants ?? []).filter((v) => v.status === 'live');
}

/**
 * The variant id to use, or null (= the original palette): `id` must be one the theme declares, and a live one unless
 * `includeComing` (the demo and theme-check show palettes still in review).
 */
export function resolveVariant(
  variants: readonly ThemeVariant[] | undefined,
  id: unknown,
  opts: { includeComing?: boolean } = {},
): string | null {
  if (typeof id !== 'string' || !id) return null;
  const v = (variants ?? []).find((x) => x.id === id);
  if (!v) return null;
  return v.status === 'live' || opts.includeComing ? v.id : null;
}

/** img/x.webp -> img/variants/<id>/x.webp (the override's path); null for files outside img/ (CSS, JS: never overridden). */
export function variantOverridePath(variantId: string, rel: string): string | null {
  if (!rel.startsWith('img/') || rel.startsWith(`${VARIANT_IMG_DIR}/`)) return null;
  return `${VARIANT_IMG_DIR}/${variantId}/${rel.slice('img/'.length)}`;
}
