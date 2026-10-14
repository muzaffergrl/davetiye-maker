// Edit rights and archive (G060, docs/16_PANEL_V2.md §11). Pure functions shared by the server
// (enforcement: lib/panel/api.ts, lib/sites.ts, public routes) and the browser panel (live
// "this uses 1 change" hints). No Node imports: this file is bundled into the client.
//
// Rules (task G060, docs/16 §11.1):
//  1. one order = one site (/start, G045);
//  2. identity = the couple's names (first names, full names, the names line, the monogram) + the wedding date.
//     After the FIRST publish they can be changed IDENTITY_CHANGE_LIMIT (3) times;
//  3. a typo fix (at most TYPO_MAX_DISTANCE = 2 characters per field) is free;
//  4. everything else is unlimited;
//  5. the site becomes a read-only archive ARCHIVE_AFTER_MONTHS (12) months after the wedding date;
//  6. all of it is enforced on the server.
//
// The ANCHOR is the last COUNTED identity. Free fixes never move it, so free fixes cannot add up to
// a different couple: whatever the buyer does for free stays within 2 characters (per field) of the anchor.

import type { ContentRecord } from '../content/types.ts';
import { isValidTimeZone, parseIsoDate, zonedTimeToUtc } from '../content/format.ts';
import type { Identity, IdentityLogEntry, IdentityRights, SiteRecord } from '../data/types.ts';
import { MARKETING } from '../marketing/config.ts';

export type { Identity, IdentityName, IdentityRights, IdentityLogEntry } from '../data/types.ts';

// The numbers come from the one brand configuration (lib/marketing/config.ts), so what the sales site and the
// listing say and what the server enforces cannot drift apart.
/** Name / date changes included after the first publish (3). */
export const IDENTITY_CHANGE_LIMIT = MARKETING.editRights.identityChangesAfterPublish;
/** A change of at most this many characters (per field) is a typo fix and free (2). */
export const TYPO_MAX_DISTANCE = MARKETING.editRights.typoFreeChars;
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

/**
 * How a new identity compares with the anchor (docs/16 §11.3): the largest per-field distance after
 * normalisation; a different number of names is always a change. One change covers every identity field
 * changed together (names + date at once = 1).
 */
export function classifyIdentityChange(anchor: Identity, next: Identity): { kind: IdentityClass; distance: number } {
  if (next.names.length !== anchor.names.length) return { kind: 'change', distance: Infinity };
  const pairs: Array<[string, string]> = [];
  anchor.names.forEach((n, i) => {
    pairs.push([normalizeIdentityText(n.display), normalizeIdentityText(next.names[i].display)]);
    pairs.push([normalizeIdentityText(n.full), normalizeIdentityText(next.names[i].full)]);
  });
  pairs.push([normalizeShown(anchor.shown), normalizeShown(next.shown)]);
  pairs.push([normalizeIdentityText(anchor.initials), normalizeIdentityText(next.initials)]);
  pairs.push([normalizeIdentityText(anchor.date), normalizeIdentityText(next.date)]);
  const distance = Math.max(0, ...pairs.map(([a, b]) => (a === b ? 0 : editDistance(a, b))));
  return { kind: distance === 0 ? 'unchanged' : distance <= TYPO_MAX_DISTANCE ? 'typo' : 'change', distance };
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

/** Archive dates of a site: the counted identity's date (= draft = published after the first publish). Null before the first publish. */
export function siteArchiveDates(site: RightsSite): ArchiveDates | null {
  const { firstPublishedAt } = effectiveRights(site);
  if (!firstPublishedAt) return null;
  return archiveDates({
    date: site.content?.date,
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
  };
}
