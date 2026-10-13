// What the panel needs to render a site (G039). Server only.

import type { SiteRecord } from '../data/types.ts';
import { derivePreviewKey } from '../keys.ts';
import { loadTheme, PAGE_NAMES, readThemePage, type LoadedTheme } from '../theme/theme.ts';
import {
  isEditablePhotoSource,
  OPTIONAL_BLOCK_KEYS,
  parseAspect,
  sameContent,
  type OptionalBlockKey,
  type PanelMeta,
  type PanelState,
  type PanelTheme,
} from './model.ts';

const OPTIONAL_RE = /\bdata-optional\s*=\s*["']?([a-z_]+)/g;

/** Optional sections the theme's pages use (scanned from data-optional markers). All of them if none is found. */
async function themeOptionalBlocks(theme: LoadedTheme): Promise<OptionalBlockKey[]> {
  const found = new Set<string>();
  for (const page of PAGE_NAMES) {
    const html = await readThemePage(theme, page).catch(() => null);
    if (!html) continue;
    for (const m of html.matchAll(OPTIONAL_RE)) found.add(m[1]);
  }
  const known = OPTIONAL_BLOCK_KEYS.filter((k) => found.has(k));
  return known.length ? known : [...OPTIONAL_BLOCK_KEYS];
}

export async function panelTheme(themeId: string): Promise<PanelTheme> {
  const theme = await loadTheme(themeId);
  if (!theme) throw new Error(`theme "${themeId}" not found`);
  const m = theme.manifest;
  const photos = Object.entries(m.photos)
    .filter(([key, slot]) => {
      const ok = isEditablePhotoSource(slot.source);
      if (!ok) console.warn(`[panel] theme ${m.id}: photo "${key}" source ${slot.source} is not editable in the panel`);
      return ok;
    })
    .map(([key, slot]) => ({ key, label: slot.label, source: slot.source, aspect: slot.aspect ?? null, ratio: parseAspect(slot.aspect) }));
  return {
    id: m.id,
    name: m.name,
    pages: PAGE_NAMES.filter((p) => m.pages[p]),
    photos,
    optionalBlocks: await themeOptionalBlocks(theme),
  };
}

export function panelMeta(site: SiteRecord): PanelMeta {
  return {
    status: site.status,
    updatedAt: site.updatedAt,
    publishedAt: site.publishedAt,
    hasUnpublishedChanges: site.status === 'published' && !sameContent(site.content, site.publishedContent),
  };
}

/** Full panel state. `editKey` must already be verified (the preview key is derived from it). */
export async function panelState(site: SiteRecord, editKey: string, origin: string): Promise<PanelState> {
  return {
    slug: site.slug,
    theme: await panelTheme(site.theme),
    content: site.content,
    previewKey: derivePreviewKey(editKey),
    origin,
    ...panelMeta(site),
  };
}
