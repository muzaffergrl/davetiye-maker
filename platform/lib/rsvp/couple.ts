// Couple side of RSVP: replies, counts and CSV for the site owner (edit key required).
// The panel (G039) can call these directly on the server, or use the HTTP API:
//   GET /api/rsvp/<slug>/responses   JSON {site, window, counts, responses}
//   GET /api/rsvp/<slug>/export      CSV download
// Both take the edit key as "Authorization: Bearer <key>" (preferred) or ?k=<key>.

import { formatDate, formatTime, isValidTimeZone } from '../content/format.ts';
import type { DataAdapter, RsvpRecord, SiteRecord } from '../data/types.ts';
import { canEdit } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { rsvpWindow, type RsvpWindow } from './deadline.ts';

export interface RsvpCounts {
  /** Number of replies. */
  responses: number;
  /** Replies that said yes. */
  attending: number;
  /** Replies that said no. */
  notAttending: number;
  /** Sum of guests over the "yes" replies (the head count). */
  totalGuests: number;
}

/** A reply as shown to the couple (no internal site id). */
export interface RsvpEntry {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  createdAt: string;
}

export interface RsvpSummary {
  site: { slug: string; status: SiteRecord['status'] };
  window: RsvpWindow;
  counts: RsvpCounts;
  /** Newest first. */
  responses: RsvpEntry[];
}

/** The site, when `editKey` is its edit key; otherwise null (unknown slug and wrong key look the same). */
export async function authorizeEditor(adapter: DataAdapter, slug: string, editKey: unknown): Promise<SiteRecord | null> {
  if (!isValidSlugFormat(slug) || isReservedSlug(slug)) return null;
  const site = await adapter.getSiteBySlug(slug);
  return site && canEdit(site, editKey) ? site : null;
}

export function rsvpCounts(list: readonly RsvpRecord[]): RsvpCounts {
  let attending = 0;
  let totalGuests = 0;
  for (const r of list) {
    if (r.attending) {
      attending += 1;
      totalGuests += r.guests;
    }
  }
  return { responses: list.length, attending, notAttending: list.length - attending, totalGuests };
}

function toEntry(r: RsvpRecord): RsvpEntry {
  return { id: r.id, name: r.name, email: r.email, attending: r.attending, guests: r.guests, message: r.message, createdAt: r.createdAt };
}

/** Replies (newest first), counts and the form window. Uses the published content when there is one. */
export async function rsvpSummary(adapter: DataAdapter, site: SiteRecord, now: Date = new Date()): Promise<RsvpSummary> {
  const list = await adapter.listRsvps(site.id);
  // Adapter order is oldest first; reversing before the (stable) sort keeps same-millisecond replies newest first.
  const sorted = [...list].reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return {
    site: { slug: site.slug, status: site.status },
    window: rsvpWindow(site.publishedContent ?? site.content, now),
    counts: rsvpCounts(list),
    responses: sorted.map(toEntry),
  };
}

// ---------------------------------------------------------------------------------------------
// CSV

/** Characters that make spreadsheet apps read a cell as a formula (OWASP CSV injection). */
const FORMULA_START = /^[=+\-@\t\r]/;

/** One CSV cell: formula-looking text gets a leading apostrophe, then RFC 4180 quoting. */
export function csvCell(value: unknown): string {
  let s = value === null || value === undefined ? '' : String(value);
  if (FORMULA_START.test(s) || FORMULA_START.test(s.replace(/^[ \n]+/, ''))) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Wall-clock time of an instant in a time zone as "April 3, 2027 4:05 PM" (locale rules of format.ts). */
export function formatLocalDateTime(iso: string, timeZone: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const tz = isValidTimeZone(timeZone) ? timeZone : 'UTC';
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${formatDate(`${get('year')}-${get('month')}-${get('day')}`, locale)} ${formatTime(`${get('hour')}:${get('minute')}`, locale)}`;
}

export interface CsvOptions {
  /** IANA zone for the "Submitted" column (the site's content.timezone). */
  timeZone?: string;
  locale?: string;
  /** Prepend a UTF-8 BOM so Excel shows accented names correctly (default true). */
  bom?: boolean;
}

/** CSV of replies, oldest first, CRLF line ends. Every cell is quoted and formula-safe. */
export function rsvpCsv(list: readonly RsvpRecord[], opts: CsvOptions = {}): string {
  const tz = opts.timeZone && isValidTimeZone(opts.timeZone) ? opts.timeZone : 'UTC';
  const locale = opts.locale ?? 'en-US';
  const rows: unknown[][] = [[`Submitted (${tz})`, 'Name', 'Email', 'Attending', 'Guests', 'Message']];
  const sorted = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const r of sorted) {
    rows.push([formatLocalDateTime(r.createdAt, tz, locale), r.name, r.email ?? '', r.attending ? 'Yes' : 'No', r.guests, r.message ?? '']);
  }
  const body = rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  return (opts.bom ?? true ? '﻿' : '') + body;
}

/** CSV for a site, using its time zone and locale; plus a download file name. */
export async function rsvpCsvForSite(adapter: DataAdapter, site: SiteRecord, now: Date = new Date()): Promise<{ csv: string; filename: string }> {
  const content = (site.publishedContent ?? site.content) as { timezone?: string; locale?: string };
  const list = await adapter.listRsvps(site.id);
  const csv = rsvpCsv(list, { timeZone: content.timezone, locale: content.locale });
  return { csv, filename: `rsvps-${site.slug}-${now.toISOString().slice(0, 10)}.csv` };
}
