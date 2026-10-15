// Panel model (G039): types and pure helpers shared by the server routes and the browser panel.
// No Node imports here; this file is bundled into the client.

import type { GuestAccessView } from './guest-access.ts';
import type { ContentRecord, Partner } from '../content/types.ts';
import { buildView, type ViewOptions } from '../content/derive.ts';
import { CONTENT_LIMITS } from '../content/limits.ts';
import type { ValidationIssue } from '../content/validate.ts';
import type { RightsView } from './rights.ts';
import type { PanelCopyEntry } from '../theme/copy.ts';

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
  faq: { label: 'Questions & answers', hint: 'Your questions and answers for guests (write them under Questions & answers).' },
  guest_policy: { label: 'Guest policy', hint: 'The guest policy note of the design.' },
};

export interface PanelPhotoSlot {
  /** theme.json photo key, e.g. "hero". */
  key: string;
  label: string;
  /** Content path, under media. (e.g. "media.memory_photos.0") — or "thank_you.photo" for the thank-you photo (G075). */
  source: string;
  /** As written in theme.json ("4/5") or null. */
  aspect: string | null;
  /** width / height; null = free crop. */
  ratio: number | null;
}

/** A whole page switched by content (<html>/<body> data-optional / data-if): off -> the page is 404. */
export interface PageRule {
  optional: string | null;
  /** data-if expression, "path" or "!path". */
  if: string | null;
}

/** Which buyer fields the theme actually shows (scanned from its templates, lib/panel/state.ts). */
export interface ThemeFieldUse {
  /** content.initials (Monogram). */
  initials: boolean;
  /** story.items.*.text ("A few words"). */
  storyText: boolean;
  /** How many story moments the theme shows (0 = none). */
  storyItems: number;
  /** The questions & answers list (content faq, G051). */
  faq: boolean;
  /** Custom questions in the guest reply form (content rsvp.questions, G051). */
  rsvpQuestions: boolean;
  /** A thank-you version after the wedding (data-if="thank_you_on" …, G075): the panel offers "After the wedding". */
  thankYou: boolean;
}

export interface PanelTheme {
  id: string;
  name: string;
  /** Pages the theme declares (index first). */
  pages: string[];
  /** Page-level switches (pages without one are always shown). */
  pageRules: Record<string, PageRule>;
  photos: PanelPhotoSlot[];
  /** Optional sections the theme's pages actually use (data-optional markers). */
  optionalBlocks: OptionalBlockKey[];
  fields: ThemeFieldUse;
  /**
   * Thank-you mode (G075), only for a design that has a thank-you version: its photo place (key "thank_you", source
   * "thank_you.photo", the hero portrait's shape — the photo takes the place of the portrait on the card).
   */
  thankYou: { photo: PanelPhotoSlot } | null;
  /**
   * The design's editable texts (G068, theme.json "copy"): key, the design's text, the longest the design carries, the
   * editor page that lists it ("Headings & labels on this page"). [] for a design without them.
   */
  copy: PanelCopyEntry[];
  /**
   * The theme's fictional demo record (what a site claimed on /start starts from), or null.
   * Values still equal to it are flagged as sample text before publishing.
   */
  sample: ContentRecord | null;
}

export interface PanelMeta {
  status: SiteStatus;
  updatedAt: string;
  publishedAt: string | null;
  /** Published, but the draft differs from what visitors see. */
  hasUnpublishedChanges: boolean;
  /** Name / date changes left, archive dates (G060, lib/panel/rights.ts). */
  rights: RightsView;
  /**
   * Short-lived token for the panel's own draft preview (?preview=…, lib/keys.ts panelPreviewToken): valid for about
   * 12 hours, renewed with every answer. The long-lived preview key is never sent to the browser (G060-fix).
   */
  previewToken: string;
  /** The shop has not confirmed the Etsy order yet (manual order checks): editing works, publishing waits (G060-fix). */
  orderPending: boolean;
  /** Optional guest password (G076): on/off and the password itself (the couple shares it with guests). */
  guestAccess: GuestAccessView;
}

export interface PanelState extends PanelMeta {
  slug: string;
  theme: PanelTheme;
  content: ContentRecord;
  /** e.g. https://example.vercel.app — used for the public link and its QR code. */
  origin: string;
  /** The buyer's Etsy order number when the site was claimed with one (shown for support requests). */
  orderRef: string | null;
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

/** Buyer-facing words for a photo shape (theme.json aspects are pixel ratios such as 626/868). */
export function shapeLabel(ratio: number | null): string {
  if (ratio === null) return 'Any shape';
  if (ratio < 0.9) return 'Tall (portrait)';
  if (ratio <= 1.15) return 'Almost square';
  if (ratio <= 1.3) return 'Slightly wide';
  return 'Wide (landscape)';
}

/**
 * Address of a stored photo for the buyer's own views (panel thumbnails): platform photos (/media/…)
 * are only served to the public once published, or with the preview key (lib/site/static.ts).
 */
export function previewPhotoUrl(url: string, previewKey: string): string {
  if (!url.startsWith('/media/')) return url;
  return `${url}${url.includes('?') ? '&' : '?'}preview=${encodeURIComponent(previewKey)}`;
}

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

/** Content path of the thank-you photo (G075; not a theme.json photo place: the panel offers it under Day & place). */
export const THANK_YOU_PHOTO_SOURCE = 'thank_you.photo';
/** Its key for the upload API (?slot=thank_you). */
export const THANK_YOU_PHOTO_KEY = 'thank_you';

/** The photo URL stored at a slot's source path ("" and missing -> null). */
export function photoAt(content: ContentRecord, source: string): string | null {
  if (source === THANK_YOU_PHOTO_SOURCE) {
    const v = content.thank_you?.photo;
    return typeof v === 'string' && v.trim() ? v : null;
  }
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
  if (source === THANK_YOU_PHOTO_SOURCE) {
    const next = structuredClone(content);
    next.thank_you = { ...(next.thank_you ?? {}), photo: url };
    return next;
  }
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
 * Applies a partner name change and keeps name_display / initials / that partner's full name in
 * step while they still hold the automatic value (a value the buyer typed by hand is never
 * overwritten). An empty full name stays empty (the designs show the first name instead; G060-fix:
 * /start no longer copies the first name into it). A full name equal to the first name (drafts made
 * before that) keeps following it.
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
  if (field === 'display_name') {
    const oldFirst = (before[index]?.display_name ?? '').trim();
    const oldFull = (before[index]?.full_name ?? '').trim();
    partner.display_name = value;
    if (oldFull !== '' && oldFull === oldFirst) partner.full_name = value.trim() ? value : null;
  } else partner.full_name = value.trim() ? value : null;
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

/** Panel v2 sections (G060, docs/16 §4.3); each opens as its own page (#edit/<id>). */
export const SECTION_IDS = ['names', 'date', 'venue', 'schedule', 'thankyou', 'story', 'details', 'faq', 'rsvp', 'photos'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_TITLES: Record<SectionId, string> = {
  names: 'Names',
  date: 'Date & time',
  venue: 'Venue',
  schedule: 'Schedule',
  // G075: thank-you mode (a folded section at the end of Day & place; only for a design with a thank-you version)
  thankyou: 'After the wedding',
  story: 'Our Story',
  details: 'Details',
  faq: 'Questions & answers',
  rsvp: 'RSVP settings',
  photos: 'Photos',
};

export const SECTION_GROUPS: Array<{ title: string; ids: SectionId[] }> = [
  { title: 'Wedding basics', ids: ['names', 'date', 'venue'] },
  { title: 'Your pages', ids: ['schedule', 'story', 'details', 'faq', 'rsvp', 'thankyou'] },
  { title: 'Photos', ids: ['photos'] },
];

/** Where each on/off switch lives (next to the content it controls). */
const BLOCK_SECTION: Record<string, SectionId> = {
  our_story: 'story',
  countdown: 'date',
  dress_code: 'details',
  registry: 'details',
  travel_stay: 'details',
  guest_policy: 'details',
  faq: 'faq',
};

/** Which panel section shows an issue with this content path (null = shown in the page header). */
export function sectionForPath(path: string): SectionId | null {
  const [head, second] = path.split('.');
  switch (head) {
    case 'partners':
    case 'name_display':
    case 'initials':
      return 'names';
    case 'host_line':
      return 'details';
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
      return 'details';
    case 'urls':
      return second === 'map' ? 'venue' : 'details';
    case 'faq':
      return 'faq';
    case 'rsvp':
      return 'rsvp';
    case 'optional_blocks':
      return BLOCK_SECTION[second] ?? 'details';
    case 'media':
      return 'photos';
    case 'thank_you':
      return 'thankyou';
    // 'copy': each key belongs to the editor page of its text (theme.json, lib/theme/copy.ts copyPanelPage)
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
 * The field's name as the panel shows it, for messages that are also listed away from the field ("Before you
 * publish"): two over-long names must not read as the same "Must be at most 40 characters.".
 */
export function fieldLabel(path: string): string {
  const n = (s: string) => Number(s) + 1;
  let m: RegExpExecArray | null;
  if ((m = /^partners\.([01])\.(display_name|full_name)$/.exec(path))) {
    return `${m[2] === 'full_name' ? 'Full name' : 'First name'} (${m[1] === '0' ? 'first' : 'second'} partner)`;
  }
  if (path === 'name_display') return 'Names as shown on the site';
  if (path === 'initials') return 'Monogram';
  if (path === 'venue.name') return 'Venue name';
  if (path === 'story.intro') return 'Story intro line';
  if ((m = /^story\.items\.(\d+)\.(caption|text)$/.exec(path))) return `Story, moment ${n(m[1])}: ${m[2] === 'caption' ? 'caption' : 'text'}`;
  if ((m = /^faq\.(\d+)\.(q|a)$/.exec(path))) return `Questions & answers, question ${n(m[1])}: ${m[2] === 'q' ? 'question' : 'answer'}`;
  if ((m = /^rsvp\.questions\.(\d+)\.label$/.exec(path))) return `RSVP, question ${n(m[1])}`;
  if ((m = /^rsvp\.questions\.(\d+)\.options\.(\d+)$/.exec(path))) return `RSVP, question ${n(m[1])}: choice ${n(m[2])}`;
  if (path === 'thank_you.title') return 'Thank-you title';
  if (path === 'thank_you.message') return 'Thank-you message';
  return 'This text';
}

/**
 * Validator issues reworded for the panel where the input is simply empty
 * ("Please enter a time." instead of "Use 24-hour time, e.g. 16:30." for a time picker), the schedule is longer than
 * the website shows, or a text is too long (which field, how long now, the limit).
 * Codes, paths and levels are unchanged.
 */
export function panelIssues(issues: readonly ValidationIssue[], content: unknown): ValidationIssue[] {
  return issues.map((issue) => {
    const value = valueAt(content, issue.path);
    if (issue.code === 'schema_max_items' && issue.path === 'schedule' && Array.isArray(value)) {
      const max = CONTENT_LIMITS.scheduleItems;
      const over = value.length - max;
      return { ...issue, message: `Your website shows up to ${max} events. Please remove ${over} ${over === 1 ? 'event' : 'events'}.` };
    }
    if (issue.code === 'schema_max_length' && typeof value === 'string') {
      const max = Number(/at most (\d+)/.exec(issue.message)?.[1]);
      const length = [...value].length; // characters, as the validator counts them
      if (max > 0) return { ...issue, message: `${fieldLabel(issue.path)} is ${length} characters. Please shorten it to ${max}.` };
    }
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
// Pages and pre-publish notes

function present(v: unknown): boolean {
  if (v === null || v === undefined || v === false) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

/**
 * Same rule as the theme engine: is this page served for this content? Conditions read the derived fields too
 * (thank_you_hides_details, G075: a Details page hidden after the wedding), at `opts.now`; `opts.thankYou` = the
 * thank-you preview. Several space-separated conditions must all hold.
 */
export function pageShown(rule: PageRule | undefined, content: unknown, opts: ViewOptions = {}): boolean {
  if (!rule) return true;
  const blocks = ((content as { optional_blocks?: Record<string, unknown> })?.optional_blocks ?? {}) as Record<string, unknown>;
  if (rule.optional && blocks[rule.optional] !== true) return false;
  if (rule.if) {
    const view = buildView(content, opts);
    for (const cond of rule.if.trim().split(/\s+/).filter(Boolean)) {
      const negate = cond.startsWith('!');
      const path = negate ? cond.slice(1) : cond;
      if (present(valueAt(view, path)) === negate) return false;
    }
  }
  return true;
}

export interface PublishNote {
  /** Content path to jump to (field id via fieldId). */
  path: string;
  message: string;
}

/** Paths (in order) whose value, while still equal to the theme's demo record, is sample text. */
const SAMPLE_FIELDS: Array<{ path: string; label: string; block?: OptionalBlockKey; message?: string }> = [
  { path: 'date', label: 'Wedding date' },
  { path: 'ceremony_time', label: 'Ceremony time' },
  // The RSVP close time, the countdown and the guests' calendar entry all use it (G060-fix).
  { path: 'timezone', label: 'Time zone', message: 'Time zone: still the design’s sample.' },
  { path: 'venue.name', label: 'Venue name' },
  { path: 'venue.address', label: 'Street address' },
  { path: 'venue.city', label: 'City' },
  { path: 'host_line', label: 'Host line' },
  { path: 'dress_code', label: 'Dress code', block: 'dress_code' },
  { path: 'story.intro', label: 'Story intro', block: 'our_story' },
  { path: 'rsvp.deadline', label: 'Reply-by date' },
];

export interface SampleOptions {
  /** This phone's time zone (browser only): a sample zone equal to it is not flagged. */
  deviceZone?: string | null;
}

/**
 * Values that are still the theme's fictional demo text (a site claimed on /start starts as a copy
 * of it with only the names changed). Only non-empty values that are switched on count.
 */
export function sampleNotes(content: ContentRecord, sample: ContentRecord | null, opts: SampleOptions = {}): PublishNote[] {
  if (!sample) return [];
  const blocks = (content.optional_blocks ?? {}) as Record<string, unknown>;
  const notes: PublishNote[] = [];
  const same = (path: string) => {
    const v = valueAt(content, path);
    return present(v) && stableStringify(v) === stableStringify(valueAt(sample, path));
  };
  for (const f of SAMPLE_FIELDS) {
    if (f.block && blocks[f.block] !== true) continue;
    // A phone in the sample's own time zone: the couple most likely is there too (no false alarm).
    if (f.path === 'timezone' && opts.deviceZone && opts.deviceZone === content.timezone) continue;
    if (same(f.path)) notes.push({ path: f.path, message: f.message ?? `${f.label}: still the sample text.` });
  }
  const demoPlaces = new Set((sample.schedule ?? []).map((r) => (r.location ?? '').trim()).filter(Boolean));
  (content.schedule ?? []).forEach((row, i) => {
    if (row.location && demoPlaces.has(row.location.trim())) {
      notes.push({ path: `schedule.${i}.location`, message: `Schedule, event ${i + 1}: “${row.location}” is a sample place.` });
    }
  });
  if (blocks.our_story === true) {
    const demoCaptions = new Set((sample.story?.items ?? []).map((it) => (it.caption ?? '').trim()).filter(Boolean));
    (content.story?.items ?? []).forEach((it, i) => {
      if (it.caption && demoCaptions.has(it.caption.trim())) {
        notes.push({ path: `story.items.${i}.caption`, message: `Story, moment ${i + 1}: the caption is sample text.` });
      }
    });
  }
  // G051: a design's demo record may carry sample questions & answers and reply-form questions.
  if (blocks.faq === true) {
    const demoFaq = new Set((sample.faq ?? []).flatMap((it) => [it.q, it.a]).map((t) => (t ?? '').trim()).filter(Boolean));
    (content.faq ?? []).forEach((it, i) => {
      if ((it.q && demoFaq.has(it.q.trim())) || (it.a && demoFaq.has(it.a.trim()))) {
        notes.push({ path: `faq.${i}.q`, message: `Questions & answers, question ${i + 1}: still the sample text.` });
      }
    });
  }
  if (content.rsvp?.method !== 'none') {
    const demoQuestions = new Set((sample.rsvp?.questions ?? []).map((q) => (q.label ?? '').trim()).filter(Boolean));
    (content.rsvp?.questions ?? []).forEach((q, i) => {
      if (q.label && demoQuestions.has(q.label.trim())) {
        notes.push({ path: `rsvp.questions.${i}.label`, message: `RSVP, question ${i + 1}: still the sample question.` });
      }
    });
  }
  return notes;
}

/** True while the wedding date is still the design's sample date (blocks the first publish until confirmed, G060-fix). */
export function sampleDateLeft(content: ContentRecord, sample: ContentRecord | null): boolean {
  return Boolean(sample?.date && content.date === sample.date);
}

const ISO_DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

function isoDayNumber(value: unknown): number | null {
  if (typeof value !== 'string' || !ISO_DAY_RE.test(value)) return null;
  const t = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(t) ? Math.round(t / 86_400_000) : null;
}

function isoDayFromNumber(n: number): string {
  return new Date(n * 86_400_000).toISOString().slice(0, 10);
}

/**
 * G087: the reply-by date moves with the wedding date while the couple has not chosen it themselves. A site claimed on
 * /start starts with the design's sample deadline (e.g. six weeks before the sample wedding); when the couple sets
 * their own wedding date the deadline keeps the same distance before it, instead of staying on the sample's day
 * (a wedding on September 18 with "Replies close April 3"). The deadline counts as "not chosen" while it is the
 * sample's own deadline or still exactly that distance before the previous wedding date. A deadline the couple
 * picked is never touched. Returns `next` itself when nothing moves.
 */
export function followWeddingDate(prev: ContentRecord, next: ContentRecord, sample: ContentRecord | null): ContentRecord {
  if (!sample || prev.date === next.date) return next;
  const sampleDate = isoDayNumber(sample.date);
  const sampleDeadline = isoDayNumber(sample.rsvp?.deadline);
  const prevDate = isoDayNumber(prev.date);
  const nextDate = isoDayNumber(next.date);
  const deadline = isoDayNumber(next.rsvp?.deadline);
  if (sampleDate === null || sampleDeadline === null || prevDate === null || nextDate === null || deadline === null) return next;
  const offset = sampleDeadline - sampleDate;
  if (offset >= 0) return next;
  const untouched = deadline === sampleDeadline || deadline === prevDate + offset;
  if (!untouched) return next;
  const moved = isoDayFromNumber(nextDate + offset);
  if (moved === next.rsvp?.deadline) return next;
  return { ...next, rsvp: { ...next.rsvp, deadline: moved } };
}

/** List notes counted per kind: [singular, plural]. */
const LIST_LABELS: Array<[RegExp, string, string]> = [
  [/^schedule\./, 'event place', 'event places'],
  [/^story\.items\./, 'caption', 'captions'],
  [/^faq\./, 'question', 'questions'],
  [/^rsvp\.questions\./, 'form question', 'form questions'],
];

/** "Wedding date: still the sample text." -> "wedding date"; list notes -> "3 captions", "1 event place". */
function sampleParts(list: PublishNote[]): string[] {
  const parts: string[] = [];
  const counts = new Map<number, number>();
  for (const n of list) {
    const k = LIST_LABELS.findIndex(([re]) => re.test(n.path));
    if (k >= 0) {
      if (!counts.has(k)) parts.push(`#${k}`);
      counts.set(k, (counts.get(k) ?? 0) + 1);
      continue;
    }
    const label = n.message.split(':')[0].trim();
    const text = label.charAt(0).toLowerCase() + label.slice(1);
    if (!parts.includes(text)) parts.push(text);
  }
  return parts.map((p) => {
    if (!p.startsWith('#')) return p;
    const k = Number(p.slice(1));
    const count = counts.get(k) ?? 0;
    return `${count} ${count === 1 ? LIST_LABELS[k][1] : LIST_LABELS[k][2]}`;
  });
}

/**
 * The sample-text notes as one short line per section (G060-fix: the raw messages joined together read as
 * "Story, moment 1: the caption is sample text., Story, moment 2: …"): "Our Story" + "story intro and 3 captions".
 */
export function sampleSummaries(notes: PublishNote[]): Array<{ section: SectionId; path: string; what: string }> {
  const bySection = new Map<SectionId, PublishNote[]>();
  for (const n of notes) {
    const s = sectionForPath(n.path) ?? 'names';
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s)!.push(n);
  }
  return [...bySection].map(([section, list]) => {
    const parts = sampleParts(list);
    const what = parts.length <= 2 ? parts.join(' and ') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
    return { section, path: list[0].path, what };
  });
}

/** Every content path flagged by sampleNotes (for "Sample" tags next to fields). */
export function samplePaths(content: ContentRecord, sample: ContentRecord | null): Set<string> {
  return new Set(sampleNotes(content, sample).map((n) => n.path));
}

const LINK_BLOCKS: Array<{ block: OptionalBlockKey; url: 'registry' | 'accommodation'; label: string }> = [
  { block: 'registry', url: 'registry', label: 'Registry' },
  { block: 'travel_stay', url: 'accommodation', label: 'Travel & stay' },
];

/**
 * Things guests will notice that are not errors: sample text, empty photo places, link blocks that
 * are on without a link. Shown before publishing ("Publish anyway" is always possible).
 */
export function prePublishNotes(
  content: ContentRecord,
  theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>,
  opts: SampleOptions = {},
): {
  sample: PublishNote[];
  photos: PublishNote[];
  links: PublishNote[];
  /** Sections that are on but have nothing to show yet (G051: questions & answers). */
  empty: PublishNote[];
} {
  const blocks = (content.optional_blocks ?? {}) as Record<string, unknown>;
  const storyOn = blocks.our_story === true;
  const photos = theme.photos
    .filter((s) => !photoAt(content, s.source))
    // Story photos only matter while the Our Story page is on.
    .filter((s) => storyOn || !s.source.startsWith('media.memory_photos.'))
    .map((s) => ({ path: s.source, message: `${s.label}: no photo yet. Guests see a soft placeholder image.` }));
  const links = LINK_BLOCKS.filter((l) => theme.optionalBlocks.includes(l.block) && blocks[l.block] === true && !content.urls?.[l.url]).map((l) => ({
    path: `urls.${l.url}`,
    message: `${l.label} is on but has no link yet, so guests do not see it.`,
  }));
  const empty =
    theme.optionalBlocks.includes('faq') && blocks.faq === true && !(content.faq ?? []).length
      ? [{ path: 'faq', message: 'Questions & answers is on but has no questions yet, so guests do not see it.' }]
      : [];
  return { sample: sampleNotes(content, theme.sample, opts), photos, links, empty };
}

// ---------------------------------------------------------------------------------------------
// Custom questions (G051)

/** A new question id ("q" + 6 random a-z0-9) not used by `existing`; matches QUESTION_ID_RE. */
export function newQuestionId(existing: readonly string[], random: () => number = Math.random): string {
  for (;;) {
    let id = 'q';
    for (let i = 0; i < 6; i++) id += 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(random() * 36) % 36];
    if (!existing.includes(id)) return id;
  }
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
export function previewPath(slug: string, page: string, previewToken: string): string {
  const base = page === 'index' ? `/${slug}` : `/${slug}/${page}`;
  return `${base}?preview=${encodeURIComponent(previewToken)}`;
}

/** When a panel preview token ("<exp seconds>.<signature>") runs out, in ms; null when it is not one. */
export function previewTokenExpiry(token: unknown): number | null {
  const m = typeof token === 'string' ? /^(\d{9,11})\./.exec(token) : null;
  return m ? Number(m[1]) * 1000 : null;
}

export const PAGE_LABELS: Record<string, string> = {
  index: 'Envelope',
  home: 'Home',
  story: 'Story',
  details: 'Details',
  rsvp: 'RSVP',
};
