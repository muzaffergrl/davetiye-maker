// Size variants of buyer photos (G055, docs/11 §6 and §14 #9). No Node imports: the panel uses it in the browser.
//
// A panel upload is re-encoded by sharp (lib/panel/photos.ts) and stored as a set with one random base name:
//   /media/<site>/<hex32>-<W>w.jpg      the photo (W = its width in px; this URL goes into the content record)
//   /media/<site>/<hex32>-640w.jpg      variants, one per PHOTO_VARIANT_WIDTHS entry smaller than W
//   /media/<site>/<hex32>-1280w.jpg
// The content keeps only the photo's URL. The engine derives the variants from it and writes
// srcset (+ the template's sizes), so a phone at DPR 3 downloads a 640/1280 px file instead of the full photo;
// the /media route serves a variant exactly when it serves its photo. Older uploads (<hex32>.jpg, before G055)
// and photos stored without re-encoding (sharp unavailable) have no width in the name: no variants, no srcset.

/** Widths of the stored variants (px). A variant exists only when it is smaller than the photo. */
export const PHOTO_VARIANT_WIDTHS = [640, 1280] as const;

const MEDIA_RE = /^(\/media\/[0-9a-f-]{36}\/[0-9a-f]{32})-([1-9]\d{0,4})w\.(jpg|png|webp|avif)$/;

/** Variant widths that go with a photo `width` px wide (ascending). */
export function variantWidths(width: number): number[] {
  return PHOTO_VARIANT_WIDTHS.filter((w) => w < width);
}

/** File name of a stored photo or variant: "<base>-<width>w.<ext>". */
export function photoFileName(base: string, width: number, ext: string): string {
  return `${base}-${width}w.${ext}`;
}

export interface PhotoCandidate {
  /** Root-relative URL (/media/<site>/<file>). */
  url: string;
  width: number;
}

/**
 * srcset candidates of a stored photo URL: its variants (ascending) and the photo itself (last).
 * Null when the URL carries no width (older uploads, external URLs, anything else): use it as a single src.
 * A query string or fragment is not part of a stored URL; such a URL gets no candidates either.
 */
export function photoCandidates(url: unknown): PhotoCandidate[] | null {
  if (typeof url !== 'string') return null;
  const m = MEDIA_RE.exec(url);
  if (!m) return null;
  const [, base, w, ext] = m;
  const width = Number(w);
  return [...variantWidths(width).map((v) => ({ url: photoFileName(base, v, ext), width: v })), { url, width }];
}

/** The smallest stored file of a photo (panel thumbnails); the URL itself when it has no variants. */
export function smallestPhotoUrl(url: string): string {
  return photoCandidates(url)?.[0]?.url ?? url;
}
