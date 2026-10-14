// Couple side of RSVP: replies, counts, the overview and CSV for the site owner (edit key required).
// The panel (G039) can call these directly on the server, or use the HTTP API:
//   GET /api/rsvp/<slug>/responses   JSON {site, window, counts, insights, questions, maxGuests, responses}
//   GET /api/rsvp/<slug>/export      CSV download (one row per person, G069)
//   POST /api/rsvp/<slug>/responses  {action: "remove" | "keep", ids: [...]}
//                                    {action: "add", reply: {...}} · {action: "update", id, reply: {...}}  (Bearer only)
// GETs take the edit key as "Authorization: Bearer <key>" (preferred) or ?k=<key>.
// Held replies (unusual volume, guest.ts) are listed with held: true but are not counted and not in
// the CSV until the couple keeps them; "remove" deletes replies for good. G069: the couple can add a reply they got
// another way (marked source "couple": "Added by you") and correct any reply (editedAt: "Edited by you").

import { formatDate, formatTime, isValidTimeZone } from '../content/format.ts';
import type { RsvpQuestion } from '../content/types.ts';
import type { DataAdapter, RsvpAnswer, RsvpRecord, SiteRecord } from '../data/types.ts';
import { canEdit } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { themeMaxGuests } from './config.ts';
import { rsvpWindow, type RsvpWindow } from './deadline.ts';
import { replyPeople, rsvpInsights, type RsvpInsights } from './insights.ts';
import { formQuestions, parseCoupleReply, type RsvpField } from './validate.ts';

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
  /** Names of the other people in the reply (G069); [] when none were given. */
  party: string[];
  createdAt: string;
  held: boolean;
  /** "guest": sent with the website form · "couple": added in the panel (G069). */
  source: 'guest' | 'couple';
  /** Last correction by the couple (G069), or null. */
  editedAt: string | null;
}

export interface RsvpSummary {
  site: { slug: string; status: SiteRecord['status'] };
  window: RsvpWindow;
  counts: RsvpCounts;
  /** Overview: people, deadline in days, answer breakdowns, food / allergy notes (G069, lib/rsvp/insights.ts). */
  insights: RsvpInsights;
  /** The questions guests see now (the panel's "Add a reply" form asks the same). */
  questions: RsvpQuestion[];
  /** Most people in one reply (the theme's cap). */
  maxGuests: number;
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
    party: [...(r.party ?? [])],
    createdAt: r.createdAt,
    held: r.held === true,
    source: r.source === 'couple' ? 'couple' : 'guest',
    editedAt: r.editedAt ?? null,
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

/** Replies (newest first), counts, overview and the form window. Uses the published content when there is one. */
export async function rsvpSummary(adapter: DataAdapter, site: SiteRecord, now: Date = new Date()): Promise<RsvpSummary> {
  const list = await adapter.listRsvps(site.id);
  // Adapter order is oldest first; reversing before the (stable) sort keeps same-millisecond replies newest first.
  const sorted = [...list].reverse().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const content = site.publishedContent ?? site.content;
  const questions = formQuestions(content);
  return {
    site: { slug: site.slug, status: site.status },
    window: rsvpWindow(content, now),
    counts: rsvpCounts(list),
    insights: rsvpInsights(list, questions, content, now),
    questions,
    maxGuests: await themeMaxGuests(site.theme),
    responses: sorted.map(toEntry),
  };
}

// ---------------------------------------------------------------------------------------------
// The couple's own replies and corrections (G069)

export type CoupleReplyResult =
  | { ok: true; reply: RsvpEntry }
  | { ok: false; status: 400 | 404; message: string; fields?: Partial<Record<RsvpField, string>> };

const REPLY_ID_RE = /^[0-9a-f-]{36}$/;

/**
 * Adds a reply the couple got another way (phone, email, in person): same fields and rules as the website form,
 * stored with source "couple". Works whether or not the form is open (the deadline is for guests, not for the couple).
 */
export async function addCoupleReply(adapter: DataAdapter, site: SiteRecord, body: unknown): Promise<CoupleReplyResult> {
  const parsed = parseCoupleReply(body, await themeMaxGuests(site.theme), formQuestions(site.publishedContent ?? site.content));
  if (!parsed.ok) return { ok: false, status: 400, message: Object.values(parsed.errors)[0] ?? 'Please check the reply.', fields: parsed.errors };
  const saved = await adapter.saveRsvp(site.id, { ...parsed.value, source: 'couple' });
  return { ok: true, reply: toEntry(saved) };
}

/** The couple's correction of one reply (a guest's or their own): every guest field is replaced; editedAt is set. */
export async function updateCoupleReply(adapter: DataAdapter, site: SiteRecord, id: unknown, body: unknown): Promise<CoupleReplyResult> {
  const notFound = { ok: false as const, status: 404 as const, message: 'This reply was removed. Please refresh the list.' };
  if (typeof id !== 'string' || !REPLY_ID_RE.test(id)) return notFound;
  const existing = (await adapter.listRsvps(site.id)).find((r) => r.id === id);
  if (!existing) return notFound;
  const parsed = parseCoupleReply(body, await themeMaxGuests(site.theme), formQuestions(site.publishedContent ?? site.content), existing);
  if (!parsed.ok) return { ok: false, status: 400, message: Object.values(parsed.errors)[0] ?? 'Please check the reply.', fields: parsed.errors };
  const v = parsed.value;
  const saved = await adapter.updateRsvp(site.id, id, {
    name: v.name,
    email: v.email ?? null,
    attending: v.attending,
    guests: v.guests,
    message: v.message ?? null,
    answers: v.answers ?? [],
    party: v.party ?? [],
  });
  return saved ? { ok: true, reply: toEntry(saved) } : notFound;
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

/** Where a reply came from, in the CSV's words (G069). */
function sourceText(r: RsvpRecord): string {
  if (r.source === 'couple') return 'Added by you';
  return r.editedAt ? 'Website, edited by you' : 'Website';
}

/** CSV header (G069): the person first, then the reply they belong to. */
export const CSV_COLUMNS = ['Name', 'Party of', 'Attending', 'Party size', 'Email', 'Submitted', 'Source', 'Message'] as const;

/**
 * CSV guest list (G069): ONE ROW PER PERSON — the guest who replied, then the people with them (their names when
 * given, else "Guest 3 (no name given)"). Replies oldest first, held ones left out, CRLF line ends, every cell quoted
 * and formula-safe. Columns: CSV_COLUMNS ("Submitted (<zone>)"), then one column per question.
 * Reply-level values (party size, email, message, answers) are on the reply's first row only, so adding up
 * "Party size" gives the head count, as does counting the rows that say "Yes".
 */
export function rsvpCsv(list: readonly RsvpRecord[], opts: CsvOptions = {}): string {
  const tz = opts.timeZone && isValidTimeZone(opts.timeZone) ? opts.timeZone : 'UTC';
  const locale = opts.locale ?? 'en-US';
  const sorted = list.filter((r) => !r.held).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const columns = answerColumns(sorted, opts.questions);
  const header = CSV_COLUMNS.map((c) => (c === 'Submitted' ? `Submitted (${tz})` : c));
  const rows: unknown[][] = [[...header, ...columns.map((c) => c.header)]];
  for (const r of sorted) {
    const answerOf = (id: string) => r.answers?.find((a) => a.id === id)?.answer ?? '';
    const submitted = formatLocalDateTime(r.createdAt, tz, locale);
    for (const p of replyPeople(r)) {
      const first = p.number === 1;
      rows.push([
        p.named ? p.name : `${p.name} (no name given)`,
        r.name,
        r.attending ? 'Yes' : 'No',
        first ? r.guests : '',
        first ? (r.email ?? '') : '',
        submitted,
        sourceText(r),
        first ? (r.message ?? '') : '',
        ...columns.map((c) => (first ? answerOf(c.id) : '')),
      ]);
    }
  }
  const body = rows.map((row) => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  return (opts.bom ?? true ? '\uFEFF' : '') + body;
}

/** CSV for a site, using its time zone, locale and questions; plus a download file name. */
export async function rsvpCsvForSite(adapter: DataAdapter, site: SiteRecord, now: Date = new Date()): Promise<{ csv: string; filename: string }> {
  const content = (site.publishedContent ?? site.content) as { timezone?: string; locale?: string };
  const list = await adapter.listRsvps(site.id);
  const csv = rsvpCsv(list, { timeZone: content.timezone, locale: content.locale, questions: formQuestions(content) });
  return { csv, filename: `rsvps-${site.slug}-${now.toISOString().slice(0, 10)}.csv` };
}
