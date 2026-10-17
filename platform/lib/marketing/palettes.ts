// G153: a design's colour palettes on the sales site (design page swatches → the live demo in that palette).
// Read from the theme's own theme.json at build time; only `live` palettes are shown (one still in review never is),
// and a design without a live palette shows no swatches at all (the design listing is not affected either way).

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { liveVariants, parseSwatch, parseVariants } from '../theme/variants.ts';

export interface DesignPalette {
  /** null = the design's original colours. */
  id: string | null;
  name: string;
  swatch: string[];
}

function themesDir(): string {
  return process.env.PLATFORM_THEMES_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'themes');
}

/**
 * [original, ...live palettes] of a design, or [] when it has no live palette. `fallbackSwatch` (the design's marketing
 * palette) is the original's swatch when theme.json has none.
 */
export function designPalettes(themeId: string, fallbackSwatch: readonly string[] = []): DesignPalette[] {
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(readFileSync(path.join(themesDir(), themeId, 'theme.json'), 'utf8')) as Record<string, unknown>;
  } catch {
    return [];
  }
  const live = liveVariants(parseVariants(raw.variants).variants);
  if (!live.length) return [];
  const original = parseSwatch(raw.swatch).swatch ?? fallbackSwatch.slice(0, 3);
  return [{ id: null, name: 'Original', swatch: [...original] }, ...live.map((v) => ({ id: v.id, name: v.name, swatch: [...v.swatch] }))];
}

