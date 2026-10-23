// Edit rights and archive (G060, docs/16_PANEL_V2.md §11). Pure functions shared by the server
// (enforcement: lib/panel/api.ts, lib/sites.ts, public routes) and the browser panel (live
// "this uses 1 change" hints). No Node imports: this file is bundled into the client.
//
// Rules (task G060, docs/16 §11.1):
//  1. one order = one site (/start, G045);
//  2. identity = the couple's names (first names, full names, the names line, the monogram) + the wedding date.
//     After the FIRST publish they can be changed IDENTITY_CHANGE_LIMIT (3) times in total (one save that changes
//     several of them counts once);
//  3. free, never counted:
//     - a typo fix in a name field (at most TYPO_MAX_DISTANCE = 2 characters per field);
//     - moving the wedding date by at most DATE_FREE_DAYS (7) days (dates are measured in days, not characters);
//     - adding (or removing) a surname while the first name stays the same ("Ada" -> "Ada Lovelace");
//     - taking back the last counted change soon after (UNDO_WINDOW_MS) or before it was published: the change is
//       given back;
//     - replacing the design's sample date once, when the site was first published with it;
//  4. everything else is unlimited;
//  5. the site becomes a read-only archive ARCHIVE_AFTER_MONTHS (12) months after the wedding date;
//  6. all of it is enforced on the server.
//
// The ANCHOR is the last COUNTED identity. Free fixes never move it, so free fixes cannot add up to
// a different couple: whatever the buyer does for free stays within 2 characters (per name field) and
// 7 days (date) of the anchor.

import type { ContentRecord } from '../content/types.ts';
import { isValidTimeZone, parseIsoDate, zonedTimeToUtc } from '../content/format.ts';
import type { Identity, IdentityLogEntry, IdentityRights, SiteRecord } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';
import { msg } from '../i18n/translate.ts';

export type { Identity, IdentityName, IdentityRights, IdentityLogEntry } from '../data/types.ts';

// The numbers come from the one brand configuration (lib/marketing/config.ts), so what the sales site and the
// listing say and what the server enforces cannot drift apart.
/** Name / date changes included after the first publish (3). */
export const IDENTITY_CHANGE_LIMIT = MARKETING.editRights.identityChangesAfterPublish;
/** A change of at most this many characters (per name field) is a typo fix and free (2). */
export const TYPO_MAX_DISTANCE = MARKETING.editRights.typoFreeChars;
/** Moving the wedding date by at most this many days (either way, from the counted date) is free (7). */
export const DATE_FREE_DAYS = MARKETING.editRights.dateFreeDays;
/** A counted change can be taken back for free this long after it (or any time before it is published). */
export const UNDO_WINDOW_MS = 10 * 60_000;
/** The website is online until this many months after the wedding date (12, K25). */
export const ARCHIVE_AFTER_MONTHS = MARKETING.hosting.monthsAfterWedding;
/**
 * Hosting ceiling (docs/16 §11.9, PROPOSAL awaiting the owner's decision §15 #3): the archive comes at the
 * latest this many months after the first publish, so free date "fixes" (2027 -> 2029 is one character)
 * cannot keep a site online for years. null switches the ceiling off.
 */
export const ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS: number | null = 48;
/** Days before the archive date when the panel starts reminding the couple to download their replies. */
export const ARCHIVE_NOTICE_DAYS = 30;
/** Log entries kept per site. */
export const IDENTITY_LOG_MAX = 50;

// The rules in the buyer's words (one source for the rules box, the help sheet and the names / date pages, so the
// copy cannot drift from what is enforced; docs/16 §11.7).
/** "After you publish, you have 3 changes in total for your names, monogram and wedding date …" */
export function changesRuleText(total: number = IDENTITY_CHANGE_LIMIT): string {
  return `After you publish, you have ${total} ${total === 1 ? 'change' : 'changes'} in total for your names, monogram and wedding date (changing several in one go counts once).`;
}
/** What never uses a change. */
export const FREE_CHANGES_TEXT = `Always free: fixing a small typo (up to ${TYPO_MAX_DISTANCE} letters in a name), adding a surname, and moving your date by up to ${DATE_FREE_DAYS} days.`;
/** The undo rule. */
export const UNDO_TEXT = msg('Changed something by mistake? Undo it right away (before you publish it, or within 10 minutes) and you get the change back.');
/** Before the first publish (names and date pages, Home). */
export function beforePublishText(total: number = IDENTITY_CHANGE_LIMIT): string {
  return `Change these freely until you publish. After that, names and date can change ${total} times (small fixes are free).`;
}
/** The rule in one line, before the first publish (setup step 1 and the names / date pages; G100, docs/18 §1). */
export function rightsOneLine(total: number = IDENTITY_CHANGE_LIMIT): string {
  return `After publishing you can change names or the date ${total} ${total === 1 ? 'time' : 'times'}.`;
}
/** What happens at the archive date (rules box, help, the reminder before it). */
export const ARCHIVE_TEXT = msg('Then your website closes for guests; you can still see your content and download your replies.');
/** Answer of every write endpoint once a site is archived (403 archived). */
export const ARCHIVED_MESSAGE = 'This website is archived. You can still see your content and download your replies, but it can no longer be changed.';

// ---------------------------------------------------------------------------------------------
// Normalisation and distance

/** Control characters, zero-width and bidi marks (the same set as lib/claim/fields.ts). */
const INVISIBLE_RE = /[\u0000-\u001f\u007f-\u009f​-‏‪-‮⁠-⁩﻿]/g;

/** NFC, invisible characters removed, runs of spaces collapsed, trimmed. Case is kept (Clara -> clara counts as 1). */
export function normalizeIdentityText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.normalize('NFC').replace(INVISIBLE_RE, '').replace(/\s+/g, ' ').trim();
}

/** The names line, with the separator ignored: "Clara and Julian", "Clara + Julian" and "Clara & Julian" are the same. */
export function normalizeShown(value: unknown): string {
  return normalizeIdentityText(value).replace(/\s*(?:&|\+|\band\b)\s*/gi, ' & ');
}

/**
 * Damerau–Levenshtein distance, "optimal string alignment" variant (an adjacent swap = 1), on code points
 * (an accented letter or an emoji is one character).
 */
export function editDistance(a: string, b: string): number {
  const s = [...a];
  const t = [...b];
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const rows = s.length + 1;
  const cols = t.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) => {
    const row = new Array<number>(cols).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j < cols; j++) d[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[rows - 1][cols - 1];
}

// ---------------------------------------------------------------------------------------------
// Identity of a content record

/** The identity fields of a content record (stored as typed; compared normalised). */
export function identityOf(content: Pick<ContentRecord, 'partners' | 'name_display' | 'initials' | 'date'> | null | undefined): Identity {
  const c = content ?? ({} as Partial<ContentRecord>);
  return {
    names: (Array.isArray(c.partners) ? c.partners : []).map((p) => ({
      display: typeof p?.display_name === 'string' ? p.display_name : '',
      full: typeof p?.full_name === 'string' ? p.full_name : '',
    })),
    shown: typeof c.name_display === 'string' ? c.name_display : '',
    initials: typeof c.initials === 'string' ? c.initials : '',
    date: typeof c.date === 'string' ? c.date : '',
  };
}

/** Copy of `content` with these identity values (partners rebuilt from the names; nothing else changes). */
export function withIdentity(content: ContentRecord, identity: Identity): ContentRecord {
  const next = structuredClone(content);
  next.partners = identity.names.map((n, i) => {
    const partner = { ...(next.partners?.[i] ?? { display_name: '' }), display_name: n.display };
    // An empty full name stays as it was stored (absent or null), so an unchanged record compares equal.
    if (n.full.trim()) partner.full_name = n.full;
    else if (partner.full_name !== undefined) partner.full_name = null;
    return partner;
  });
  if (identity.shown !== '' || next.name_display !== undefined) next.name_display = identity.shown;
  next.initials = identity.initials;
  next.date = identity.date;
  return next;
}

/** Content paths that belong to the identity (used to keep them on autosave and to sort issues). */
export function isIdentityPath(path: string): boolean {
  return /^partners(\.|$)/.test(path) || path === 'name_display' || path === 'initials' || path === 'date';
}

/** Exactly the same identity (as stored, not normalised). */
export function sameIdentity(a: Identity, b: Identity): boolean {
  return (
    a.names.length === b.names.length &&
    a.names.every((n, i) => n.display === b.names[i].display && n.full === b.names[i].full) &&
    a.shown === b.shown &&
    a.initials === b.initials &&
    a.date === b.date
  );
}

export type IdentityClass = 'unchanged' | 'typo' | 'change';

/** Why a change is free: a small typo in a name field, the date moved by up to a week, a surname added or removed. */
export type FreeReason = 'typo' | 'date' | 'surname';

export interface IdentityClassification {
  kind: IdentityClass;
  /** Largest per-field character distance over the name fields (the date is measured in days). */
  distance: number;
  /** Days between the anchor's date and the new date (null when either is not a real date). */
  dateDays: number | null;
  /** For a free result ('typo'): what made it free (several can apply at once). */
  free: FreeReason[];
}

/** Whole days from a to b (YYYY-MM-DD), or null when either is not a real date. */
export function daysBetween(a: string, b: string): number | null {
  const x = parseIsoDate(a);
  const y = parseIsoDate(b);
  if (!x || !y) return null;
  return Math.round((Date.UTC(y.year, y.month - 1, y.day) - Date.UTC(x.year, x.month - 1, x.day)) / 86_400_000);
}

/** " Mary Ann " inside "Augusta Mary-Ann King" (whole words, case-insensitive; hyphens count as spaces). */
function hasWords(text: string, words: string): boolean {
  const norm = (v: string) => ` ${v.toLowerCase().replace(/-/g, ' ').replace(/\s+/g, ' ').trim()} `;
  return words.trim() !== '' && norm(text).includes(norm(words));
}

/**
 * A full name that only gains or loses a surname while the first name stays the same is free: "Ada" -> "Ada
 * Lovelace", "Ada Lovelace" -> "Ada Lovelace-Byron", "Ada Lovelace" -> "Ada". While no full name was counted yet
 * (the anchor's full name is empty or just the first name), any full name that still contains the first name as a
 * word is free ("Ada" -> "Augusta Ada King"). An empty full name means "the first name" (the themes fall back to it).
 */
export function surnameOnly(anchor: Identity['names'][number], next: Identity['names'][number]): boolean {
  const dA = normalizeIdentityText(anchor.display);
  const dN = normalizeIdentityText(next.display);
  if (dA !== dN || !dA) return false;
  const fA = normalizeIdentityText(anchor.full) || dA;
  const fN = normalizeIdentityText(next.full) || dN;
  if (fA === fN) return false;
  const extendsName = (short: string, long: string) => long.startsWith(`${short} `) || long.startsWith(`${short}-`);
  if (extendsName(fA, fN) || extendsName(fN, fA)) return true;
  if (fA === dA) return hasWords(fN, dA);
  if (fN === dN) return hasWords(fA, dN);
  return false;
}

/**
 * How a new identity compares with the anchor (docs/16 §11.3): name fields by their largest per-field character
 * distance after normalisation (a typo is at most TYPO_MAX_DISTANCE), full names that only gain or lose a surname
 * are free, the date by days (at most DATE_FREE_DAYS is free); a different number of names is always a change.
 * One change covers every identity field changed together (names + date at once = 1).
 */
export function classifyIdentityChange(anchor: Identity, next: Identity): IdentityClassification {
  if (next.names.length !== anchor.names.length) return { kind: 'change', distance: Infinity, dateDays: daysBetween(anchor.date, next.date), free: [] };
  const free = new Set<FreeReason>();
  const pairs: Array<[string, string]> = [];
  anchor.names.forEach((n, i) => {
    const m = next.names[i];
    pairs.push([normalizeIdentityText(n.display), normalizeIdentityText(m.display)]);
    if (surnameOnly(n, m)) free.add('surname');
    else pairs.push([normalizeIdentityText(n.full) || normalizeIdentityText(n.display), normalizeIdentityText(m.full) || normalizeIdentityText(m.display)]);
  });
  pairs.push([normalizeShown(anchor.shown), normalizeShown(next.shown)]);
  pairs.push([normalizeIdentityText(anchor.initials), normalizeIdentityText(next.initials)]);
  const distance = Math.max(0, ...pairs.map(([a, b]) => (a === b ? 0 : editDistance(a, b))));
  let change = distance > TYPO_MAX_DISTANCE;
  if (distance > 0 && !change) free.add('typo');
  const aDate = normalizeIdentityText(anchor.date);
  const nDate = normalizeIdentityText(next.date);
  const dateDays = daysBetween(aDate, nDate);
  if (aDate !== nDate) {
    if (dateDays !== null && Math.abs(dateDays) <= DATE_FREE_DAYS) free.add('date');
    else change = true;
  }
  if (change) return { kind: 'change', distance, dateDays, free: [] };
  return { kind: free.size ? 'typo' : 'unchanged', distance, dateDays, free: [...free] };
}

/**
 * The once-only free date change (docs/16 §11.7): a site first published while its date was still the design's
 * sample date may set its real date for free, once. True when `next` differs from the anchor only by that date move
 * (plus free fixes). The caller moves the anchor's date (the next date change is counted normally).
 */
export function isSampleDateReplacement(anchor: Identity, next: Identity, sampleDate: string | null | undefined): boolean {
  if (!sampleDate || anchor.date !== sampleDate || next.date === anchor.date || !parseIsoDate(next.date)) return false;
  return classifyIdentityChange({ ...anchor, date: next.date }, next).kind !== 'change';
}

/** The last counted change while it can be taken back for free, else null (docs/16 §11.6 "Undo"). */
export function undoState(
  rights: Pick<IdentityRights, 'undo'> | null | undefined,
  site: { publishedAt?: string | null },
  now: Date = new Date(),
): { at: string; from: Identity; until: string | null } | null {
  const undo = rights?.undo;
  if (!undo) return null;
  const at = Date.parse(undo.at);
  if (!Number.isFinite(at)) return null;
  const published = site.publishedAt ? Date.parse(site.publishedAt) : NaN;
  const publishedSince = Number.isFinite(published) && published >= at;
  if (!publishedSince) return { at: undo.at, from: undo.from, until: null };
  const until = at + UNDO_WINDOW_MS;
  return now.getTime() <= until ? { at: undo.at, from: undo.from, until: new Date(until).toISOString() } : null;
}

/** True when sending `next` takes back the last counted change (free, the change is given back). */
export function isUndo(undo: { from: Identity } | null | undefined, next: Identity): boolean {
  return Boolean(undo && classifyIdentityChange(undo.from, next).kind !== 'change');
}

/** Keeps the last IDENTITY_LOG_MAX entries. */
export function appendLog(log: readonly IdentityLogEntry[] | undefined, entry: IdentityLogEntry): IdentityLogEntry[] {
  return [...(log ?? []), entry].slice(-IDENTITY_LOG_MAX);
}

export function newIdentityRights(anchor: Identity, at: string): IdentityRights {
  return { anchor, limit: IDENTITY_CHANGE_LIMIT, granted: 0, used: 0, log: [{ at, kind: 'first_publish', to: anchor, by: 'buyer' }] };
}

/** Changes still available (never below 0). */
export function remainingChanges(rights: Pick<IdentityRights, 'limit' | 'granted' | 'used'>): number {
  return Math.max(0, rights.limit + rights.granted - rights.used);
}

type RightsSite = Pick<SiteRecord, 'content' | 'publishedContent' | 'publishedAt'> &
  Partial<Pick<SiteRecord, 'firstPublishedAt' | 'identity' | 'archiveOverrideAt'>>;

/**
 * The rights state of a site, including records from before G060 (docs/16 §11.10 "migration"): a site
 * that was published but has no bookkeeping counts as first published at its publishedAt, anchored to
 * its published identity, with no change used. Callers that write persist this.
 */
export function effectiveRights(site: RightsSite): { firstPublishedAt: string | null; identity: IdentityRights | null; migrated: boolean } {
  const first = site.firstPublishedAt ?? site.publishedAt ?? null;
  if (!first) return { firstPublishedAt: null, identity: null, migrated: false };
  if (site.identity && site.firstPublishedAt) return { firstPublishedAt: site.firstPublishedAt, identity: site.identity, migrated: false };
  const anchor = site.identity?.anchor ?? identityOf(site.publishedContent ?? site.content);
  const identity: IdentityRights = site.identity ?? { anchor, limit: IDENTITY_CHANGE_LIMIT, granted: 0, used: 0, log: [] };
  return { firstPublishedAt: first, identity, migrated: true };
}

// ---------------------------------------------------------------------------------------------
// Archive dates

/** YYYY-MM-DD plus whole months; the day is clamped to the month's end (2028-02-29 + 12 -> 2029-02-28). */
export function addMonthsClamped(isoDate: string, months: number): string | null {
  const d = parseIsoDate(isoDate);
  if (!d) return null;
  const total = d.year * 12 + (d.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const day = Math.min(d.day, last);
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function addDays(isoDate: string, days: number): string {
  const d = parseIsoDate(isoDate)!;
  return new Date(Date.UTC(d.year, d.month - 1, d.day + days)).toISOString().slice(0, 10);
}

/** 00:00 of a calendar day in a time zone, as a UTC instant (UTC when the zone is not valid). */
export function startOfDayUtc(isoDate: string, timeZone: unknown): number | null {
  const d = parseIsoDate(isoDate);
  if (!d) return null;
  if (isValidTimeZone(timeZone)) {
    const iso = zonedTimeToUtc(isoDate, '00:00', timeZone);
    if (iso) return Date.parse(iso);
  }
  return Date.UTC(d.year, d.month - 1, d.day);
}

/** Calendar date (YYYY-MM-DD) of an instant in a time zone (UTC when the zone is not valid). */
export function localDateOf(ms: number, timeZone: unknown): string {
  const tz = isValidTimeZone(timeZone) ? (timeZone as string) : 'UTC';
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(ms));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export interface ArchiveDates {
  /** Last day the website is online (YYYY-MM-DD, the site's time zone). */
  onlineUntil: string;
  /** Moment it becomes a read-only archive (UTC ISO). */
  archiveAt: string;
  /** What decided it. */
  source: 'wedding_date' | 'ceiling' | 'support';
}

/**
 * When a site is archived (docs/16 §11.9): 00:00 of the day after "wedding date + 12 months" in the site's
 * time zone; at the latest firstPublishedAt + 48 months (ceiling, when on); a support override wins.
 * Null when the date is unreadable.
 */
export function archiveDates(input: {
  date: unknown;
  timezone: unknown;
  firstPublishedAt?: string | null;
  archiveOverrideAt?: string | null;
}): ArchiveDates | null {
  const tz = input.timezone;
  if (input.archiveOverrideAt && parseIsoDate(input.archiveOverrideAt)) {
    const at = startOfDayUtc(input.archiveOverrideAt, tz)!;
    return { onlineUntil: addDays(input.archiveOverrideAt, -1), archiveAt: new Date(at).toISOString(), source: 'support' };
  }
  if (typeof input.date !== 'string') return null;
  const lastDay = addMonthsClamped(input.date, ARCHIVE_AFTER_MONTHS);
  if (!lastDay) return null;
  const at = startOfDayUtc(addDays(lastDay, 1), tz)!;
  const first = input.firstPublishedAt ? Date.parse(input.firstPublishedAt) : NaN;
  if (ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS !== null && Number.isFinite(first)) {
    const f = new Date(first);
    const capDay = addMonthsClamped(f.toISOString().slice(0, 10), ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS)!;
    const cap = Date.parse(`${capDay}T${f.toISOString().slice(11)}`);
    if (cap < at) return { onlineUntil: localDateOf(cap - 1, tz), archiveAt: new Date(cap).toISOString(), source: 'ceiling' };
  }
  return { onlineUntil: lastDay, archiveAt: new Date(at).toISOString(), source: 'wedding_date' };
}

export const DATE_ARCHIVES_SITE_MESSAGE = `This date is more than ${ARCHIVE_AFTER_MONTHS} months ago. Your website would close right away.`;

/**
 * Validation issue (path "date") when publishing / changing to this date would archive the site at once,
 * else null. Used by the first publish, /identity and the panel's own checks.
 */
export function archivingDateIssue(
  content: { date?: unknown; timezone?: unknown },
  firstPublishedAt: string,
  now: Date,
  archiveOverrideAt: string | null = null,
): { level: 'error'; code: 'date_archives_site'; path: 'date'; message: string } | null {
  const dates = archiveDates({ date: content.date, timezone: content.timezone, firstPublishedAt, archiveOverrideAt });
  if (!dates || now.getTime() < Date.parse(dates.archiveAt)) return null;
  return { level: 'error', code: 'date_archives_site', path: 'date', message: DATE_ARCHIVES_SITE_MESSAGE };
}

/**
 * The wedding date the archive is counted from: the draft's date while it is within DATE_FREE_DAYS of the counted
 * (anchor) date — a free move — else the counted date. So a free edit can never push the archive by more than a week
 * (a 2-character "typo" 2027 -> 2029 used to move it by two years).
 */
export function countedDate(site: Pick<RightsSite, 'content'>, identity: Pick<IdentityRights, 'anchor'> | null | undefined): unknown {
  const draft = site.content?.date;
  const anchor = identity?.anchor?.date;
  if (!anchor || typeof draft !== 'string') return draft;
  const days = daysBetween(anchor, draft);
  return days !== null && Math.abs(days) <= DATE_FREE_DAYS ? draft : anchor;
}

/** Archive dates of a site: from its counted wedding date (countedDate). Null before the first publish. */
export function siteArchiveDates(site: RightsSite): ArchiveDates | null {
  const { firstPublishedAt, identity } = effectiveRights(site);
  if (!firstPublishedAt) return null;
  return archiveDates({
    date: countedDate(site, identity),
    timezone: site.content?.timezone,
    firstPublishedAt,
    archiveOverrideAt: site.archiveOverrideAt ?? null,
  });
}

/** True once the site is a read-only archive. Sites never published are never archived (their date is still free). */
export function isArchived(site: RightsSite, now: Date = new Date()): boolean {
  const dates = siteArchiveDates(site);
  return Boolean(dates && now.getTime() >= Date.parse(dates.archiveAt));
}

/**
 * A site that was never published shows its draft only to the couple. Its long-lived preview link (shared with a
 * partner or family to look at the draft) stops this many months after the site was created, so a draft cannot be
 * used as the real website for ever without publishing (docs/16 §11.11). The panel's own preview is not affected.
 */
export const DRAFT_PREVIEW_MAX_MONTHS = 18;

/** True when a never-published site's shared preview link has run out (DRAFT_PREVIEW_MAX_MONTHS after createdAt). */
export function draftPreviewExpired(site: RightsSite & { createdAt?: string }, now: Date = new Date()): boolean {
  if (effectiveRights(site).firstPublishedAt || !site.createdAt) return false;
  const created = new Date(site.createdAt);
  if (!Number.isFinite(created.getTime())) return false;
  const lastDay = addMonthsClamped(created.toISOString().slice(0, 10), DRAFT_PREVIEW_MAX_MONTHS);
  return Boolean(lastDay && now.getTime() >= Date.parse(`${lastDay}T${created.toISOString().slice(11)}`));
}

// ---------------------------------------------------------------------------------------------
// What the panel shows

export interface RightsView {
  phase: 'before_publish' | 'counting' | 'archived';
  limit: number;
  granted: number;
  used: number;
  remaining: number;
  /** The last counted identity (for the panel's live hint; the couple's own data). Null before the first publish. */
  anchor: Identity | null;
  firstPublishedAt: string | null;
  /** Before the first publish: from the draft's date (what the rules box promises). */
  onlineUntil: string | null;
  archiveAt: string | null;
  archived: boolean;
  /** Archive within ARCHIVE_NOTICE_DAYS. */
  archiveSoon: boolean;
  /**
   * The last counted change while it can still be taken back for free (undoState): `from` is the identity before it,
   * `until` the end of the undo window (null: until it is published). Null otherwise.
   */
  undo: { from: Identity; until: string | null } | null;
}

export function rightsView(site: RightsSite, now: Date = new Date()): RightsView {
  const { firstPublishedAt, identity } = effectiveRights(site);
  const dates = firstPublishedAt
    ? siteArchiveDates(site)
    : archiveDates({ date: site.content?.date, timezone: site.content?.timezone, firstPublishedAt: now.toISOString() });
  const archived = Boolean(firstPublishedAt && dates && now.getTime() >= Date.parse(dates.archiveAt));
  const archiveSoon = Boolean(
    firstPublishedAt && dates && !archived && Date.parse(dates.archiveAt) - now.getTime() <= ARCHIVE_NOTICE_DAYS * 86_400_000,
  );
  const limit = identity?.limit ?? IDENTITY_CHANGE_LIMIT;
  const granted = identity?.granted ?? 0;
  const used = identity?.used ?? 0;
  return {
    phase: archived ? 'archived' : firstPublishedAt ? 'counting' : 'before_publish',
    limit,
    granted,
    used,
    remaining: remainingChanges({ limit, granted, used }),
    anchor: identity?.anchor ?? null,
    firstPublishedAt,
    onlineUntil: dates?.onlineUntil ?? null,
    archiveAt: dates?.archiveAt ?? null,
    archived,
    archiveSoon,
    undo: (() => {
      const u = archived ? null : undoState(identity, site, now);
      return u ? { from: u.from, until: u.until } : null;
    })(),
  };
}
