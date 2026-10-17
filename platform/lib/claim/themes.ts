// Which themes a buyer can start a website from (/start?theme=<id>), and their demo content.
//
// A theme is claimable when it exists, is not internal (test scaffolding such as _sample) and has
// valid demo content: themes/<id>/content.demo.json, or a bundled copy (lib/claim/demo/).
// Demo content must be a valid record with record_kind "demo" (fictional data, URLs null).
//
// G151: a PRIVATE theme (theme.json "private": {"orders": [...]}, a custom design for one buyer) answers exactly like an
// unknown theme (null) unless the caller is trusted (shop admin, an existing site of that theme) or brings an order
// number from its list. It is never in claimableThemes() unless asked for (the admin's "Yeni sipariş").

import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ContentRecord } from '../content/types.ts';
import { validateContent } from '../content/validate.ts';
import { isPrivateTheme, listThemes, loadTheme, privateThemeAllowsOrder, type LoadedTheme, type ThemeManifest } from '../theme/theme.ts';
import { BUNDLED_DEMO_CONTENT } from './demo/index.ts';

/** File name of a theme's own demo content (theme folder). Never served by the theme asset route. */
export const THEME_DEMO_FILE = 'content.demo.json';

export type DemoSource = 'theme' | 'bundled';

export interface ClaimableTheme {
  id: string;
  name: string;
  manifest: ThemeManifest;
  loaded: LoadedTheme;
  /** Fresh copy on every call; safe to modify. */
  demo: ContentRecord;
  demoSource: DemoSource;
  /** Names the demo record has (1 or 2): how many name fields /start asks for. */
  partnerCount: number;
}

function usableDemo(raw: unknown, where: string): ContentRecord | null {
  const result = validateContent(raw);
  if (!result.ok) {
    console.error(`[claim] demo content ${where} is not valid: ${result.errors.map((e) => `${e.path}: ${e.message}`).join('; ')}`);
    return null;
  }
  const record = raw as ContentRecord;
  if (record.record_kind !== 'demo') {
    console.error(`[claim] demo content ${where} must have record_kind "demo"`);
    return null;
  }
  return structuredClone(record);
}

/** The theme's demo content: theme folder first, then the bundled copy. Null when there is none (or it is invalid). */
export async function loadDemoContent(theme: LoadedTheme): Promise<{ content: ContentRecord; source: DemoSource } | null> {
  const file = path.join(theme.dir, THEME_DEMO_FILE);
  let text: string | null = null;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
  }
  if (text !== null) {
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      console.error(`[claim] ${theme.manifest.id}/${THEME_DEMO_FILE} is not valid JSON`);
      return null;
    }
    const content = usableDemo(raw, `${theme.manifest.id}/${THEME_DEMO_FILE}`);
    return content ? { content, source: 'theme' } : null;
  }
  const bundled = Object.hasOwn(BUNDLED_DEMO_CONTENT, theme.manifest.id) ? BUNDLED_DEMO_CONTENT[theme.manifest.id] : undefined;
  if (bundled === undefined) return null;
  const content = usableDemo(bundled, `lib/claim/demo/${theme.manifest.id}.json`);
  return content ? { content, source: 'bundled' } : null;
}

/**
 * Who asks for a theme (G151, private themes only): `order` = the Etsy order number the buyer typed or the start link
 * carries; `trusted` = the shop admin, or the theme of a website that already exists (panel, sample date).
 */
export interface ThemeAccess {
  order?: unknown;
  trusted?: boolean;
}

/** The theme if a buyer can start a website from it, else null (unknown, internal, no demo content, private and not theirs). */
export async function claimableTheme(id: unknown, access: ThemeAccess = {}): Promise<ClaimableTheme | null> {
  if (typeof id !== 'string') return null;
  const loaded = await loadTheme(id).catch((e) => {
    console.error(`[claim] theme "${id}" could not be loaded:`, e);
    return null;
  });
  if (!loaded || loaded.manifest.internal) return null;
  if (isPrivateTheme(loaded.manifest) && !access.trusted && !privateThemeAllowsOrder(loaded.manifest, access.order)) return null;
  const demo = await loadDemoContent(loaded);
  if (!demo) return null;
  return {
    id: loaded.manifest.id,
    name: loaded.manifest.name,
    manifest: loaded.manifest,
    loaded,
    demo: demo.content,
    demoSource: demo.source,
    partnerCount: Math.min(2, Math.max(1, demo.content.partners.length)),
  };
}

export interface ClaimableThemeEntry {
  id: string;
  name: string;
  /** Only with includePrivate: the order numbers of a private theme (G151). */
  privateOrders?: string[];
}

/** Claimable themes (the /start list before the approval filter). Private themes only for the shop admin (includePrivate). */
export async function claimableThemes(opts: { includePrivate?: boolean } = {}): Promise<ClaimableThemeEntry[]> {
  const out: ClaimableThemeEntry[] = [];
  for (const manifest of await listThemes({ includePrivate: opts.includePrivate })) {
    const theme = await claimableTheme(manifest.id, { trusted: opts.includePrivate });
    if (!theme) continue;
    out.push(theme.manifest.private ? { id: theme.id, name: theme.name, privateOrders: [...theme.manifest.private.orders] } : { id: theme.id, name: theme.name });
  }
  return out;
}

/** The private theme made for this order number (G151), or null: /my sends a custom-design buyer to their own design. */
export async function privateThemeForOrder(order: unknown): Promise<{ id: string; name: string } | null> {
  for (const manifest of await listThemes({ includePrivate: true })) {
    if (!privateThemeAllowsOrder(manifest, order)) continue;
    const theme = await claimableTheme(manifest.id, { order });
    if (theme) return { id: theme.id, name: theme.name };
  }
  return null;
}
