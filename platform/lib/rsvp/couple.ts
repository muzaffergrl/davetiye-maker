// Couple side of RSVP: replies, counts and CSV for the site owner (edit key required).
// The panel (G039) can call these directly on the server, or use the HTTP API:
//   GET /api/rsvp/<slug>/responses   JSON {site, window, counts, responses}
//   GET /api/rsvp/<slug>/export      CSV download
//   POST /api/rsvp/<slug>/responses  {action: "remove" | "keep", ids: [...]}  (Bearer only)
// GETs take the edit key as "Authorization: Bearer <key>" (preferred) or ?k=<key>.
// Held replies (unusual volume, guest.ts) are listed with held: true but are not counted and not in
// the CSV until the couple keeps them; "remove" deletes replies for good.

import { formatDate, formatTime, isValidTimeZone } from '../content/format.ts';
import type { DataAdapter, RsvpAnswer, RsvpRecord, SiteRecord } from '../data/types.ts';
import { canEdit } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { rsvpWindow, type RsvpWindow } from './deadline.ts';
import { formQuestions } from './validate.ts';

export interface RsvpCounts {
  /** Number of replies (held ones not included). */
  responses: number;
  /** Replies that said yes. */
  attending: number;
  /** Replies that said no. */
  notAttending: number;
  /** Sum of guests over the "yes" replies (the head count). */
  totalGuests: number;
  /** Replies held for review (not in the numbers above). */
  held: number;
}

/** A reply as shown to the couple (no internal site id). */
export interface RsvpEntry {
  id: string;
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  /** Answers to the couple's custom questions (G051), in the order they were asked; [] when none. */
  answers: RsvpAnswer[];
  createdAt: string;
  held: boolean;
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
  let held = 0;
  let responses = 0;
  for (const r of list) {
    if (r.held) {
      held += 1;
      continue;
    }
    responses += 1;
    if (r.attending) {
      attending += 1;
      totalGuests += r.guests;
    }
  }
  return { responses, attending, notAttending: responses - attending, totalGuests, held };
}

function toEntry(r: RsvpRecord): RsvpEntry {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    attending: r.attending,
    guests: r.guests,
    message: r.message,
    answers: (r.answers ?? []).map((a) => ({ id: a.id, question: a.question, answer: a.answer })),
    createdAt: r.createdAt,
    held: r.held === true,
  };
}

export type RsvpAction = 'remove' | 'keep';
export const MAX_RSVP_ACTION_IDS = 1000;

/** Couple's action on replies: "remove" deletes them, "keep" releases held ones. Returns how many changed. */
export async function manageRsvps(adapter: DataAdapter, site: SiteRecord, action: RsvpAction, ids: readonly string[]): Promise<number> {
  const clean = [...new Set(ids.filter((id) => typeof id === 'string' && /^[0-9a-f-]{36}$/.test(id)))].slice(0, MAX_RSVP_ACTION_IDS);
  if (!clean.length) return 0;
  return action === 'remove' ? adapter.deleteRsvps(site.id, clean) : adapter.setRsvpsHeld(site.id, clean, false);
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
  /**
   * The site's custom questions (content rsvp.questions, G051): one column each, after "Message",
   * headed by the question text. Answers to questions removed since keep a column too (headed by
   * the text the guest answered).
   */
  questions?: ReadonlyArray<{ id: string; label: string }>;
}

/** Answer columns: current questions in order, then removed ones in the order they first appear. */
function answerColumns(list: readonly RsvpRecord[], questions: CsvOptions['questions'] = []): Array<{ id: string; header: string }> {
  const columns = questions.map((q) => ({ id: q.id, header: q.label.trim() || q.id }));
  const known = new Set(columns.map((c) => c.id));
  const removed = new Map<string, string>();
  for (const r of list) {
    for (const a of r.answers ?? []) if (!known.has(a.id)) removed.set(a.id, a.question || a.id);
  }
  for (const [id, header] of removed) columns.push({ id, header });
  return columns;
}

/** CSV of replies (held ones left out), oldest first, CRLF line ends. Every cell is quoted and formula-safe. */
export function rsvpCsv(list: readonly RsvpRecord[], opts: CsvOptions = {}): string {
  const tz = opts.timeZone && isValidTimeZone(opts.timeZone) ? opts.timeZone : 'UTC';
  const locale = opts.locale ?? 'en-US';
  const sorted = list.filter((r) => !r.held).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const columns = answerColumns(sorted, opts.questions);
  const rows: unknown[][] = [[`Submitted (${tz})`, 'Name', 'Email', 'Attending', 'Guests', 'Message', ...columns.map((c) => c.header)]];
  for (const r of sorted) {
    const answerOf = (id: string) => r.answers?.find((a) => a.id === id)?.answer ?? '';
    rows.push([
      formatLocalDateTime(r.createdAt, tz, locale),
      r.name,
      r.email ?? '',
      r.attending ? 'Yes' : 'No',
      r.guests,
      r.message ?? '',
      ...columns.map((c) => answerOf(c.id)),
    ]);
  }
  const body = rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  return (opts.bom ?? true ? '﻿' : '') + body;
}

/** CSV for a site, using its time zone, locale and questions; plus a download file name. */
export async function rsvpCsvForSite(adapter: DataAdapter, site: SiteRecord, now: Date = new Date()): Promise<{ csv: string; filename: string }> {
  const content = (site.publishedContent ?? site.content) as { timezone?: string; locale?: string };
  const list = await adapter.listRsvps(site.id);
  const csv = rsvpCsv(list, { timeZone: content.timezone, locale: content.locale, questions: formQuestions(content) });
  return { csv, filename: `rsvps-${site.slug}-${now.toISOString().slice(0, 10)}.csv` };
}
