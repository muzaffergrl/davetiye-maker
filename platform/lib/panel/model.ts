// Panel model (G039): types and pure helpers shared by the server routes and the browser panel.
// No Node imports here; this file is bundled into the client.

import type { ContentRecord, Partner } from '../content/types.ts';
import type { ValidationIssue } from '../content/validate.ts';

export type SiteStatus = 'draft' | 'published';

export const OPTIONAL_BLOCK_KEYS = [
  'our_story',
  'countdown',
  'dress_code',
  'registry',
  'travel_stay',
  'faq',
  'guest_policy',
] as const;
export type OptionalBlockKey = (typeof OPTIONAL_BLOCK_KEYS)[number];

/** Buyer-facing labels for the optional sections (English, product copy). */
export const OPTIONAL_BLOCK_LABELS: Record<OptionalBlockKey, { label: string; hint: string }> = {
  our_story: { label: 'Our Story', hint: 'A page with your story photos and captions.' },
  countdown: { label: 'Countdown', hint: 'Days left until the wedding.' },
  dress_code: { label: 'Dress code', hint: 'Shows the dress code from Details.' },
  registry: { label: 'Registry', hint: 'A button to your registry link from Details.' },
  travel_stay: { label: 'Travel & stay', hint: 'A button to your accommodation link from Details.' },
  faq: { label: 'Questions & answers', hint: 'The short Q&A block of the design.' },
  guest_policy: { label: 'Guest policy', hint: 'The guest policy note of the design.' },
};

export interface PanelPhotoSlot {
  /** theme.json photo key, e.g. "hero". */
  key: string;
  label: string;
  /** Content path, always under media., e.g. "media.memory_photos.0". */
  source: string;
  /** As written in theme.json ("4/5") or null. */
  aspect: string | null;
  /** width / height; null = free crop. */
  ratio: number | null;
}

export interface PanelTheme {
  id: string;
  name: string;
  /** Pages the theme declares (index first). */
  pages: string[];
  photos: PanelPhotoSlot[];
  /** Optional sections the theme's pages actually use (data-optional markers). */
  optionalBlocks: OptionalBlockKey[];
}

export interface PanelMeta {
  status: SiteStatus;
  updatedAt: string;
  publishedAt: string | null;
  /** Published, but the draft differs from what visitors see. */
  hasUnpublishedChanges: boolean;
}

export interface PanelState extends PanelMeta {
  slug: string;
  theme: PanelTheme;
  content: ContentRecord;
  /** Derived from the edit key; opens the draft preview (read only). */
  previewKey: string;
  /** e.g. https://example.vercel.app — used for the public link and its QR code. */
  origin: string;
}

/** Body of every panel API error. */
export interface PanelError {
  ok: false;
  code: string;
  message: string;
  issues?: ValidationIssue[];
  updatedAt?: string;
}

// ---------------------------------------------------------------------------------------------
// Paths and photos

/** "4/5", "4:5", "1.5" -> width / height. Null for anything else. */
export function parseAspect(aspect: unknown): number | null {
  if (typeof aspect !== 'string') return null;
  const m = /^\s*(\d+(?:\.\d+)?)\s*(?:[/:]\s*(\d+(?:\.\d+)?))?\s*$/.exec(aspect);
  if (!m) return null;
  const w = Number(m[1]);
  const h = m[2] === undefined ? 1 : Number(m[2]);
  const r = w / h;
  return Number.isFinite(r) && r > 0.1 && r < 10 ? r : null;
}

const MEDIA_SOURCE_RE = /^media\.(hero_portrait|venue_image|memory_photos\.([0-3]))$/;

/** Photo slots the panel can edit: media.hero_portrait, media.venue_image, media.memory_photos.0-3. */
export function isEditablePhotoSource(source: string): boolean {
  return MEDIA_SOURCE_RE.test(source);
}

/** The photo URL stored at a slot's source path ("" and missing -> null). */
export function photoAt(content: ContentRecord, source: string): string | null {
  const m = MEDIA_SOURCE_RE.exec(source);
  if (!m) return null;
  const media = (content.media ?? {}) as Record<string, unknown>;
  const value = m[2] !== undefined ? (Array.isArray(media.memory_photos) ? media.memory_photos[Number(m[2])] : null) : media[m[1]];
  return typeof value === 'string' && value.trim() ? value : null;
}

/**
 * Copy of the content with the photo at `source` set (url) or removed (null).
 * memory_photos keeps the schema's shape (array of strings, at most 4): gaps become "",
 * trailing empty entries are dropped.
 */
export function withPhoto(content: ContentRecord, source: string, url: string | null): ContentRecord {
  const m = MEDIA_SOURCE_RE.exec(source);
  if (!m) throw new Error(`not an editable photo slot: ${source}`);
  const next = structuredClone(content);
  next.media = { ...(next.media ?? {}) };
  if (m[2] !== undefined) {
    const index = Number(m[2]);
    const list = Array.isArray(next.media.memory_photos) ? [...next.media.memory_photos] : [];
    while (list.length <= index) list.push('');
    list[index] = url ?? '';
    while (list.length && !list[list.length - 1]) list.pop();
    next.media.memory_photos = list;
  } else {
    (next.media as Record<string, unknown>)[m[1]] = url;
  }
  return next;
}

// ---------------------------------------------------------------------------------------------
// Names

/** "Clara & Julian" (or the single name). */
export function defaultNameDisplay(partners: readonly Partner[]): string {
  return partners
    .map((p) => (p.display_name ?? '').trim())
    .filter(Boolean)
    .join(' & ');
}

/** "C&J" or "C & J" (spaced when `spaced`). */
export function defaultInitials(partners: readonly Partner[], spaced = false): string {
  const letters = partners.map((p) => (p.display_name ?? '').trim().charAt(0).toUpperCase()).filter(Boolean);
  return letters.join(spaced ? ' & ' : '&');
}

/**
 * Applies a partner name change and keeps name_display / initials in step while they still
 * hold the automatic value (a value the buyer typed by hand is never overwritten).
 */
export function withPartnerName(
  content: ContentRecord,
  index: number,
  field: 'display_name' | 'full_name',
  value: string,
): ContentRecord {
  const next = structuredClone(content);
  const before = structuredClone(next.partners ?? []);
  const partner = next.partners[index];
  if (!partner) return next;
  if (field === 'display_name') partner.display_name = value;
  else partner.full_name = value.trim() ? value : null;
  if (field === 'display_name') {
    const autoName = defaultNameDisplay(before);
    if (next.name_display === undefined || next.name_display === '' || next.name_display === autoName) {
      next.name_display = defaultNameDisplay(next.partners);
    }
    const spaced = (next.initials ?? '').includes(' & ');
    if ((next.initials ?? '') === '' || next.initials === defaultInitials(before, spaced)) {
      next.initials = defaultInitials(next.partners, spaced).slice(0, 9);
    }
  }
  return next;
}

// ---------------------------------------------------------------------------------------------
// Sections and issues

export const SECTION_IDS = ['couple', 'date', 'venue', 'schedule', 'story', 'details', 'rsvp', 'optional', 'photos'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_TITLES: Record<SectionId, string> = {
  couple: 'Couple',
  date: 'Date & time',
  venue: 'Venue',
  schedule: 'Schedule',
  story: 'Story',
  details: 'Details',
  rsvp: 'RSVP',
  optional: 'Optional sections',
  photos: 'Photos',
};

/** Which panel section shows an issue with this content path (null = shown in the page header). */
export function sectionForPath(path: string): SectionId | null {
  const head = path.split('.')[0];
  switch (head) {
    case 'partners':
    case 'name_display':
    case 'initials':
    case 'host_line':
      return 'couple';
    case 'date':
    case 'ceremony_time':
    case 'timezone':
    case 'locale':
      return 'date';
    case 'venue':
      return 'venue';
    case 'schedule':
      return 'schedule';
    case 'story':
      return 'story';
    case 'dress_code':
    case 'urls':
      return 'details';
    case 'rsvp':
      return 'rsvp';
    case 'optional_blocks':
      return 'optional';
    case 'media':
      return 'photos';
    default:
      return null;
  }
}

function valueAt(content: unknown, path: string): unknown {
  let cur: unknown = content;
  for (const seg of path.split('.')) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return cur;
}

/**
 * Validator issues reworded for the panel where the input is simply empty
 * ("Please enter a time." instead of "Use 24-hour time, e.g. 16:30." for a time picker).
 * Codes, paths and levels are unchanged.
 */
export function panelIssues(issues: readonly ValidationIssue[], content: unknown): ValidationIssue[] {
  return issues.map((issue) => {
    const value = valueAt(content, issue.path);
    const empty = value === '' || value === undefined || value === null;
    if (!empty) return issue;
    if (issue.code === 'schema_pattern') return { ...issue, message: 'Please enter a time.' };
    if (issue.code === 'schema_date' || issue.code === 'date_unreadable') return { ...issue, message: 'Please choose a date.' };
    if (issue.code === 'schema_min_length') return { ...issue, message: issue.path.startsWith('partners.') ? 'Please enter a name.' : 'This cannot be empty.' };
    return issue;
  });
}

/** DOM id of the input that edits `path` (used to jump from an issue to its field). */
export function fieldId(path: string): string {
  return `f-${path.replace(/[^a-z0-9_]+/gi, '-')}`;
}

// ---------------------------------------------------------------------------------------------
// Comparing content

/** JSON with object keys sorted, so two equal records compare equal whatever their key order. */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`;
}

export function sameContent(a: unknown, b: unknown): boolean {
  return stableStringify(a) === stableStringify(b);
}

/** Public address of a site. */
export function publicSiteUrl(origin: string, slug: string): string {
  return `${origin.replace(/\/+$/, '')}/${slug}`;
}

/** Preview address of a theme page (index = /<slug>). */
export function previewPath(slug: string, page: string, previewKey: string): string {
  const base = page === 'index' ? `/${slug}` : `/${slug}/${page}`;
  return `${base}?preview=${encodeURIComponent(previewKey)}`;
}

export const PAGE_LABELS: Record<string, string> = {
  index: 'Envelope',
  home: 'Home',
  story: 'Story',
  details: 'Details',
  rsvp: 'RSVP',
};
