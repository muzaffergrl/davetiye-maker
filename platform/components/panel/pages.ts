// K29 (2026-10-14, "much simpler panel"): the editor's six pages over the nine sections of lib/panel/model.ts.
//   Us (names, monogram) · Day & place (date, time, venue, schedule) · Photos · Our Story · Details (host line, dress
//   code, travel, registry, questions & answers) · RSVP (deadline, questions).
// Content, validation, sample notes and the server are unchanged: a page only groups the existing section editors.
// Old addresses (#edit/<section>, e.g. #edit/venue) still open: the page that holds the section, scrolled to it.
// Also here: what changed since the last publish (by page, for the "Unpublished changes" bar) and how ready the
// website is (Home's progress card). Pure functions, no React.

import type { ContentRecord } from '../../lib/content/types.ts';
import type { ValidationIssue } from '../../lib/content/validate.ts';
import { sameContent, SECTION_IDS, sectionForPath, type PanelTheme, type PublishNote, type SectionId } from '../../lib/panel/model.ts';
import { copyText, type PanelCopyEntry } from '../../lib/theme/copy.ts';

export const PAGE_IDS = ['us', 'day', 'photos', 'story', 'details', 'rsvp'] as const;
export type PageId = (typeof PAGE_IDS)[number];

export const PAGE_TITLES: Record<PageId, string> = {
  us: 'Us',
  day: 'Day & place',
  photos: 'Photos',
  story: 'Our Story',
  details: 'Details',
  rsvp: 'RSVP',
};

/** The sections each page shows, top to bottom. */
export const PAGE_SECTIONS: Record<PageId, SectionId[]> = {
  us: ['names'],
  // G075: "After the wedding" (thank-you mode) folds in at the end of Day & place (no 7th page, K29)
  day: ['date', 'venue', 'schedule', 'thankyou'],
  photos: ['photos'],
  story: ['story'],
  details: ['details', 'faq'],
  rsvp: ['rsvp'],
};

/** The design's texts at the end of every page (G068); Review names them as a part of the page ("Us · Headings & labels"). */
export const COPY_TITLE = 'Headings & labels';

/** Sub-headings inside a page (only where a page holds more than one topic). */
export const BLOCK_TITLES: Partial<Record<SectionId, string>> = {
  date: 'Date & time',
  venue: 'Venue',
  schedule: 'Schedule',
  faq: 'Questions & answers',
};

export function pageOf(section: SectionId): PageId {
  for (const id of PAGE_IDS) if (PAGE_SECTIONS[id].includes(section)) return id;
  return 'details';
}

/** "#edit/<x>": a page id, or a section id (old addresses and jumps to a field) = its page, scrolled to the section. */
export function parseEditTarget(seg: string): { page: PageId; focus: SectionId | null } | null {
  if ((PAGE_IDS as readonly string[]).includes(seg)) return { page: seg as PageId, focus: null };
  if ((SECTION_IDS as readonly string[]).includes(seg)) {
    const page = pageOf(seg as SectionId);
    return { page, focus: PAGE_SECTIONS[page][0] === seg ? null : (seg as SectionId) };
  }
  return null;
}

/** The website page the preview shows for an editor page (or one of its sections). */
const PREVIEW_OF_SECTION: Partial<Record<SectionId, string>> = {
  names: 'index',
  date: 'index',
  venue: 'details',
  schedule: 'details',
  story: 'story',
  details: 'details',
  faq: 'details',
  rsvp: 'rsvp',
  photos: 'home',
  thankyou: 'home',
};
const PREVIEW_OF_PAGE: Record<PageId, string> = { us: 'index', day: 'details', photos: 'home', story: 'story', details: 'details', rsvp: 'rsvp' };

export function previewPageFor(page: PageId, focus: SectionId | null): string {
  return (focus && PREVIEW_OF_SECTION[focus]) || PREVIEW_OF_PAGE[page];
}

// ---------------------------------------------------------------------------------------------
// First-run setup (Setup.tsx): 1 names + date · 2 the opening photo · 3 publish

export const SETUP_STEP_COUNT = 3;

/** A wizard step from an address or a saved step; steps 4–6 of the old 6-step wizard (G060) map to photos / publish. */
export function setupStepOf(n: number): number {
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > SETUP_STEP_COUNT) return n >= 5 ? 3 : 2;
  return Math.floor(n);
}

/** The opening photo the wizard asks for (the design's hero portrait; else its first photo place). */
export function heroSlot<T extends { key: string }>(slots: readonly T[]): T | null {
  return slots.find((s) => s.key === 'hero_portrait') ?? slots[0] ?? null;
}

// ---------------------------------------------------------------------------------------------
// What changed since the last publish

const isPlainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

/** Content paths (one or two levels deep: enough for sectionForPath) whose value differs between two records. */
export function changedPaths(a: ContentRecord | null, b: ContentRecord | null): string[] {
  const A = (a ?? {}) as Record<string, unknown>;
  const B = (b ?? {}) as Record<string, unknown>;
  const out: string[] = [];
  for (const key of new Set([...Object.keys(A), ...Object.keys(B)])) {
    if (sameContent(A[key], B[key])) continue;
    const x = A[key];
    const y = B[key];
    if (isPlainObject(x) && isPlainObject(y)) {
      for (const sub of new Set([...Object.keys(x), ...Object.keys(y)])) if (!sameContent(x[sub], y[sub])) out.push(`${key}.${sub}`);
    } else out.push(key);
  }
  return out;
}

/** The sections whose content differs from the published copy (Review names them inside a page, e.g. "After the wedding"). */
export function changedSections(draft: ContentRecord, published: ContentRecord | null): SectionId[] {
  if (!published) return [];
  const out = new Set<SectionId>();
  for (const p of changedPaths(draft, published)) {
    const s = sectionForPath(p);
    if (s) out.add(s);
  }
  return SECTION_IDS.filter((id) => out.has(id));
}

/**
 * The editor pages whose design texts (content.copy, G068) differ from the published copy: each key counts on the page
 * that lists it ("Headings & labels on this page"). An empty text and a missing one are the same (the design's text).
 */
export function changedCopyPages(draft: ContentRecord, published: ContentRecord | null, copy: readonly PanelCopyEntry[]): PageId[] {
  if (!published) return [];
  const a = draft.copy ?? {};
  const b = published.copy ?? {};
  const pages = new Set<PageId>();
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (copyText(a[key]) === copyText(b[key])) continue;
    const page = copy.find((e) => e.key === key)?.panel;
    if (page) pages.add(page);
  }
  return PAGE_IDS.filter((id) => pages.has(id));
}

/** The editor pages whose content (sections, and the design texts listed on them) differs from the published copy. */
export function changedPages(draft: ContentRecord, published: ContentRecord | null, copy: readonly PanelCopyEntry[] = []): PageId[] {
  if (!published) return [];
  const pages = new Set<PageId>(changedCopyPages(draft, published, copy));
  for (const p of changedPaths(draft, published)) {
    const s = sectionForPath(p);
    if (s) pages.add(pageOf(s));
  }
  return PAGE_IDS.filter((id) => pages.has(id));
}

// ---------------------------------------------------------------------------------------------
// How ready the website is (Home)

export interface Readiness {
  /** 0–100, rounded. */
  percent: number;
  /** Items fully done / all items (photos count as one item, in parts). */
  done: number;
  total: number;
}

/**
 * One item per section the design shows (done = no error, nothing left from the design's sample text, no switched-on
 * block without its content), the photos (as a share of the photo places that matter) and publishing itself.
 */
export function readiness(input: {
  sections: SectionId[];
  errors: ValidationIssue[];
  notes: { sample: PublishNote[]; photos: PublishNote[]; links: PublishNote[]; empty: PublishNote[] };
  theme: Pick<PanelTheme, 'photos'>;
  content: ContentRecord;
  published: boolean;
}): Readiness {
  const { sections, errors, notes, theme, content, published } = input;
  const open = new Set<SectionId>();
  for (const i of [...errors, ...notes.sample, ...notes.links, ...notes.empty]) {
    const s = sectionForPath(i.path);
    if (s) open.add(s);
  }
  let sum = 0;
  let total = 0;
  for (const s of sections) {
    // the photos count below; "After the wedding" is optional (an error in it still shows as a next step)
    if (s === 'photos' || s === 'thankyou') continue;
    total += 1;
    if (!open.has(s)) sum += 1;
  }
  const storyOn = content.optional_blocks?.our_story === true;
  const places = theme.photos.filter((p) => storyOn || !p.source.startsWith('media.memory_photos.')).length;
  if (places) {
    total += 1;
    sum += Math.max(0, places - notes.photos.length) / places;
  }
  total += 1;
  if (published) sum += 1;
  const percent = total ? Math.round((100 * sum) / total) : 100;
  return { percent, done: Math.floor(sum), total };
}
