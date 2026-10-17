// What the panel needs to render a site (G039). Server only.

import { claimableTheme } from '../claim/themes.ts';
import type { SiteRecord } from '../data/types.ts';
import { panelPreviewToken } from '../keys.ts';
import { guestAccessView } from '../site/access.ts';
import { orderPending } from '../sites.ts';
import { loadTheme, PAGE_NAMES, readThemePage, type LoadedTheme, type PageName } from '../theme/theme.ts';
import { DESIGN_COPY, openingObject } from '../marketing/designs.ts';
import {
  isEditablePhotoSource,
  OPTIONAL_BLOCK_KEYS,
  openingPlace,
  parseAspect,
  sameContent,
  THANK_YOU_PHOTO_KEY,
  THANK_YOU_PHOTO_SOURCE,
  type OptionalBlockKey,
  type PageRule,
  type PanelMeta,
  type PanelState,
  type PanelTheme,
  type ThemeFieldUse,
} from './model.ts';
import { rightsView } from './rights.ts';
import { panelCopyEntries, type PanelCopyEntry } from '../theme/copy.ts';
import { themeAssetUrl } from '../theme/urls.ts';
import { normalHex } from './share.ts';

const OPTIONAL_RE = /\bdata-optional\s*=\s*["']?([a-z_]+)/g;
/** Values of the engine markers that name content paths (data-field, data-if, data-text, data-attr-*, data-repeat). */
const MARKER_RE = /\bdata-(field|if|text|repeat|attr-[a-z0-9-]+)\s*=\s*"([^"]*)"/g;
const PAGE_TAG_RE = /<(?:html|body)\b[^>]*>/gi;
const attrIn = (tag: string, name: string): string | null => new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(tag)?.[1]?.trim() || null;
/** Story moments offered when the theme repeats story.items (no fixed number of slots). */
const MAX_STORY_ITEMS = 12;

async function themePages(theme: LoadedTheme): Promise<Array<[PageName, string]>> {
  const out: Array<[PageName, string]> = [];
  for (const page of PAGE_NAMES) {
    const html = await readThemePage(theme, page).catch(() => null);
    if (html) out.push([page, html]);
  }
  return out;
}

/** Optional sections the theme's pages use (scanned from data-optional markers). All of them if none is found. */
function themeOptionalBlocks(pages: Array<[PageName, string]>): OptionalBlockKey[] {
  const found = new Set<string>();
  for (const [, html] of pages) for (const m of html.matchAll(OPTIONAL_RE)) found.add(m[1]);
  const known = OPTIONAL_BLOCK_KEYS.filter((k) => found.has(k));
  return known.length ? known : [...OPTIONAL_BLOCK_KEYS];
}

/** Whole-page switches on <html>/<body> (data-optional / data-if), as the engine applies them. */
function themePageRules(pages: Array<[PageName, string]>): Record<string, PageRule> {
  const rules: Record<string, PageRule> = {};
  for (const [page, html] of pages) {
    for (const tag of html.match(PAGE_TAG_RE) ?? []) {
      const optional = attrIn(tag, 'data-optional');
      const cond = attrIn(tag, 'data-if');
      if (optional || cond) rules[page] = { optional: optional ?? rules[page]?.optional ?? null, if: cond ?? rules[page]?.if ?? null };
    }
  }
  return rules;
}

/**
 * Which optional buyer fields the theme shows: the panel hides fields a theme never renders
 * (a monogram the design has no place for, story text, more moments than story slots).
 */
export function themeFieldUse(htmlPages: readonly string[]): ThemeFieldUse {
  const paths: string[] = [];
  let repeatsStory = false;
  let relativeText = false;
  for (const html of htmlPages) {
    for (const m of html.matchAll(MARKER_RE)) {
      const value = m[2];
      if (m[1] === 'repeat' && value.trim() === 'story.items') repeatsStory = true;
      // data-if may hold several conditions ("dress_code !thank_you_on", G075)
      const refs = value.includes('{')
        ? [...value.matchAll(/\{\s*([^{}|\s]+)/g)].map((x) => x[1])
        : value.trim().split(/\s+/).filter(Boolean).map((v) => v.replace(/^!/, ''));
      for (const r of refs) {
        if (r === '.text') relativeText = true;
        paths.push(r);
      }
    }
  }
  const indexes = paths
    .map((p) => /^story\.items\.(\d+)\./.exec(p)?.[1])
    .filter((x): x is string => x !== undefined)
    .map(Number);
  const uses = (base: string) => paths.some((p) => p === base || p.startsWith(`${base}.`));
  return {
    initials: paths.includes('initials'),
    storyText: paths.some((p) => /^story\.items\.\d+\.text$/.test(p)) || (repeatsStory && relativeText),
    storyItems: repeatsStory ? MAX_STORY_ITEMS : indexes.length ? Math.min(MAX_STORY_ITEMS, Math.max(...indexes) + 1) : 0,
    faq: uses('faq'),
    rsvpQuestions: uses('rsvp.questions'),
    // G075: a design with a thank-you version names thank_you_on (docs/11 §3.6); others get no "After the wedding"
    thankYou: paths.includes('thank_you_on'),
  };
}

/**
 * G121: what guests tap first in a design ("envelope", "book", "gatefold" …), from the design's own opening sentence on the
 * sales site (lib/marketing/designs.ts); null for a design without it (the test scaffold, a design not on sale yet).
 */
export function themeOpening(themeId: string): string | null {
  const copy = DESIGN_COPY[themeId];
  if (!copy) return null;
  try {
    return openingObject(copy);
  } catch {
    return null;
  }
}

/** The editable-text row labels name the design's own opening ("Above your names on the book"), not always "envelope". */
export function withOpeningWords(entries: PanelCopyEntry[], opening: string | null): PanelCopyEntry[] {
  const word = openingPlace(opening);
  if (word === 'envelope') return entries;
  return entries.map((e) => ({ ...e, label: e.label.replace(/\benvelope\b/g, word) }));
}

/** G140: the design's colour — its opening page's <meta name="theme-color"> (#rrggbb), or null. */
export function themeColor(indexHtml: string | null | undefined): string | null {
  const tag = /<meta\b[^>]*\bname=["']theme-color["'][^>]*>/i.exec(indexHtml ?? '')?.[0];
  return normalHex(tag ? /\bcontent=["']([^"']+)["']/i.exec(tag)?.[1] : null);
}

export async function panelTheme(themeId: string): Promise<PanelTheme> {
  const theme = await loadTheme(themeId);
  if (!theme) throw new Error(`theme "${themeId}" not found`);
  const m = theme.manifest;
  const opening = themeOpening(m.id);
  const photos = Object.entries(m.photos)
    .filter(([key, slot]) => {
      const ok = isEditablePhotoSource(slot.source);
      if (!ok) console.warn(`[panel] theme ${m.id}: photo "${key}" source ${slot.source} is not editable in the panel`);
      return ok;
    })
    .map(([key, slot]) => ({ key, label: slot.label, source: slot.source, aspect: slot.aspect ?? null, ratio: parseAspect(slot.aspect) }));
  const pages = await themePages(theme);
  const fields = themeFieldUse(pages.map(([, html]) => html));
  // G075: the thank-you photo takes the place of the hero portrait on the card (docs/11 §3.6): same shape.
  const hero = photos.find((p) => p.key === 'hero_portrait') ?? photos[0] ?? null;
  const thankYou = fields.thankYou
    ? {
        photo: {
          key: THANK_YOU_PHOTO_KEY,
          label: 'Thank-you photo',
          source: THANK_YOU_PHOTO_SOURCE,
          aspect: hero?.aspect ?? null,
          ratio: hero?.ratio ?? null,
        },
      }
    : null;
  return {
    id: m.id,
    name: m.name,
    pages: PAGE_NAMES.filter((p) => m.pages[p]),
    pageRules: themePageRules(pages),
    photos,
    optionalBlocks: themeOptionalBlocks(pages),
    fields,
    thankYou,
    copy: withOpeningWords(panelCopyEntries(m.copy), opening),
    opening,
    sample: (await claimableTheme(m.id, { trusted: true }))?.demo ?? null, // the site's own theme (G151: also a private one)
    color: themeColor(pages.find(([p]) => p === 'index')?.[1]),
    shareImage: theme.share.ogImage ? themeAssetUrl(m.id, theme.share.ogImage) : null,
    variants: m.variants.map((v) => ({ id: v.id, name: v.name, swatch: [...v.swatch], live: v.status === 'live' })),
    swatch: m.swatch ? [...m.swatch] : null,
  };
}

export function panelMeta(site: SiteRecord, now: Date = new Date()): PanelMeta {
  return {
    status: site.status,
    updatedAt: site.updatedAt,
    publishedAt: site.publishedAt,
    hasUnpublishedChanges: site.status === 'published' && !sameContent(site.content, site.publishedContent),
    rights: rightsView(site, now),
    // Short-lived (lib/keys.ts): every answer renews it, so an open panel keeps a working preview.
    previewToken: panelPreviewToken(site.id, site.previewKeyHash, now.getTime()),
    orderPending: orderPending(site),
    // The couple's own password (shown in Share); the cookie secret and version stay on the server.
    guestAccess: guestAccessView(site),
    variant: site.variant ?? null,
  };
}

/** Full panel state. Only for a verified edit key (authorizeEditor). The long-lived preview key is never sent. */
export async function panelState(site: SiteRecord, origin: string): Promise<PanelState> {
  return {
    slug: site.slug,
    theme: await panelTheme(site.theme),
    content: site.content,
    origin,
    orderRef: site.orderRef ?? null,
    ...panelMeta(site),
  };
}
