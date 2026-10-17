// The couple's reply table (G128): ONE column model for the Excel file (xlsx.ts), the Google Sheet (lib/google/sheets.ts)
// and the CSV's answer columns (couple.ts). Columns come from the form's field set at that moment (form-config.ts): the
// fixed reply fields, then one column per current question (headed by its text), then the answers to questions removed
// since, headed "<question> (removed)" and kept on the right. Rename a question and its column is renamed; add one and a
// column appears; nothing is ever lost. Pure, no Node imports.
//
// "Replies" sheet: one row per reply, oldest first, held replies left out (they are not counted until the couple keeps
// them). "Summary" sheet: totals and the breakdown of every choice and yes / no question.

import { formatDate, isValidTimeZone } from '../content/format.ts';
import { normalizeLine } from '../content/text.ts';
import type { RsvpAnswer } from '../data/types.ts';
import { rsvpFormConfig, type FormQuestion } from './form-config.ts';
import { replyPeople } from './insights.ts';
import { interpolate, msg, type Vars } from '../i18n/translate.ts';

export type CellKind = 'text' | 'long' | 'number' | 'datetime' | 'yesno';

export interface TableColumn {
  key: string;
  header: string;
  kind: CellKind;
  /** Column width in characters (Excel) — Google Sheets gets about 7 px per character. */
  width: number;
}

/** A cell: text / number, or a date-time as its wall-clock parts in the site's time zone (no zone in a spreadsheet). */
export type Cell = string | number | null | { datetime: string; serial: number };

export interface ReplyTable {
  title: string;
  timeZone: string;
  columns: TableColumn[];
  rows: Cell[][];
}

export interface SummaryRow {
  /** "title" | "section" (a heading) | "row" (label + value [+ share]) | "blank" */
  kind: 'title' | 'section' | 'row' | 'blank';
  label?: string;
  value?: Cell;
  /** 0..1 share for a breakdown row (shown as a percentage). */
  share?: number | null;
  /** A section's column headings (a breakdown: "Replies", "Share"). */
  head?: [string, string];
}

/** What the table reads of a stored reply (RsvpRecord and the panel's entry both fit). */
export interface TableReply {
  name: string;
  email: string | null;
  attending: boolean;
  guests: number;
  message: string | null;
  answers?: readonly RsvpAnswer[];
  party?: readonly string[];
  createdAt: string;
  held?: boolean;
  source?: 'guest' | 'couple';
  editedAt?: string | null;
}

export interface TableOptions {
  content: unknown;
  now?: Date;
  /** G144: the couple's language for headings and fixed words (lib/i18n; English when absent). */
  t?: (en: string, vars?: Vars) => string;
}

const english = (en: string, vars?: Vars) => interpolate(en, vars);

// ---------------------------------------------------------------------------------------------
// Dates

const MS_PER_DAY = 86_400_000;
/** Spreadsheet serial day of 1970-01-01 (Excel / Google Sheets 1900 date system). */
const EPOCH_SERIAL = 25569;

/** Wall-clock parts of an instant in a zone, as a spreadsheet serial number and an ISO-like "YYYY-MM-DDTHH:MM". */
export function localDateTime(iso: string, timeZone: string): { datetime: string; serial: number } | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  const wall = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    datetime: `${get('year')}-${pad(get('month'))}-${pad(get('day'))}T${pad(get('hour'))}:${pad(get('minute'))}`,
    serial: wall / MS_PER_DAY + EPOCH_SERIAL,
  };
}

// ---------------------------------------------------------------------------------------------
// Columns

const FIXED_BEFORE: TableColumn[] = [
  { key: 'submitted', header: msg('Submitted'), kind: 'datetime', width: 20 },
  { key: 'name', header: msg('Name'), kind: 'text', width: 24 },
  { key: 'attending', header: msg('Attending'), kind: 'yesno', width: 11 },
  { key: 'guests', header: msg('Guests'), kind: 'number', width: 9 },
  { key: 'party', header: msg('Other guests'), kind: 'text', width: 30 },
  { key: 'email', header: msg('Email'), kind: 'text', width: 28 },
];
const FIXED_AFTER: TableColumn[] = [
  { key: 'message', header: msg('Note for the couple'), kind: 'long', width: 40 },
];
const SOURCE: TableColumn = { key: 'source', header: msg('Source'), kind: 'text', width: 22 };

const questionKind = (q: FormQuestion): CellKind => (q.type === 'number' ? 'number' : q.type === 'yesno' ? 'yesno' : q.type === 'long' ? 'long' : 'text');
const questionWidth = (q: FormQuestion): number =>
  q.type === 'yesno' ? Math.max(10, Math.min(24, q.label.length + 2)) : q.type === 'number' ? Math.max(10, Math.min(20, q.label.length + 2)) : q.type === 'long' ? 40 : 26;

/** Header of the column of a removed question. */
export const removedHeader = (question: string, t: (en: string, vars?: Vars) => string = english) => t('{question} (removed)', { question });

/** Answer columns: current questions in order, then removed ones (in the order they first appear, oldest reply first). */
export function answerColumns(
  replies: readonly Pick<TableReply, 'answers'>[],
  questions: readonly Pick<FormQuestion, 'id' | 'label' | 'type'>[],
  t: (en: string, vars?: Vars) => string = english,
): Array<{ id: string; header: string; question: FormQuestion | null; removed: boolean }> {
  const out: Array<{ id: string; header: string; question: FormQuestion | null; removed: boolean }> = questions.map((q) => ({
    id: q.id,
    header: normalizeLine(q.label) || q.id,
    question: { options: [], required: false, ...q } as FormQuestion,
    removed: false,
  }));
  const known = new Set(out.map((c) => c.id));
  for (const r of replies) {
    for (const a of r.answers ?? []) {
      if (known.has(a.id)) continue;
      known.add(a.id);
      out.push({ id: a.id, header: removedHeader(normalizeLine(a.question) || a.id, t), question: null, removed: true });
    }
  }
  return out;
}

/** Where a reply came from, in the couple's words (G069). */
export function sourceText(r: Pick<TableReply, 'source' | 'editedAt'>, t: (en: string) => string = english): string {
  if (r.source === 'couple') return t('Added by you');
  return r.editedAt ? t('Website, edited by you') : t('Website');
}

function otherGuests(r: TableReply, t: (en: string, vars?: Vars) => string): string {
  if (!r.attending) return '';
  const people = replyPeople({ id: '', name: r.name, attending: r.attending, guests: r.guests, party: r.party, createdAt: r.createdAt });
  const others = people.slice(1);
  const named = others.filter((p) => p.named).map((p) => p.name);
  const unnamed = others.length - named.length;
  const parts = [...named];
  if (unnamed) parts.push(unnamed === 1 ? t('1 guest without a name') : t('{n} guests without a name', { n: unnamed }));
  return parts.join(', ');
}

function siteTimeZone(content: unknown): string {
  const tz = (content as { timezone?: unknown } | null)?.timezone;
  return typeof tz === 'string' && isValidTimeZone(tz) ? tz : 'UTC';
}

/** "Avery & Jordan — RSVP replies" (the spreadsheet's name). */
export function tableTitle(content: unknown, t: (en: string, vars?: Vars) => string = english): string {
  const c = content as { name_display?: unknown; partners?: Array<{ display_name?: unknown }> } | null;
  let names = typeof c?.name_display === 'string' ? normalizeLine(c.name_display) : '';
  if (!names && Array.isArray(c?.partners)) {
    names = c.partners
      .map((p) => (typeof p?.display_name === 'string' ? normalizeLine(p.display_name) : ''))
      .filter(Boolean)
      .join(' & ');
  }
  return t('{names} — RSVP replies', { names: names || t('Our wedding') });
}

/** The Replies sheet: columns from the form's field set, one row per counted reply, oldest first. */
export function replyTable(list: readonly TableReply[], opts: TableOptions): ReplyTable {
  const t = opts.t ?? english;
  const tz = siteTimeZone(opts.content);
  const config = rsvpFormConfig(opts.content);
  const replies = list.filter((r) => !r.held).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const answers = answerColumns(replies, config.questions, t);
  const columns: TableColumn[] = [
    ...FIXED_BEFORE.map((c) => ({ ...c, header: t(c.header) })),
    ...answers.map((a) => ({
      key: `answer:${a.id}`,
      header: a.header,
      kind: a.question ? questionKind(a.question) : ('text' as CellKind),
      width: a.question ? questionWidth(a.question) : 26,
    })),
    ...FIXED_AFTER.map((c) => ({ ...c, header: t(c.header) })),
    { ...SOURCE, header: t(SOURCE.header) },
  ];
  const rows = replies.map((r) =>
    columns.map((c): Cell => {
      switch (c.key) {
        case 'submitted':
          return localDateTime(r.createdAt, tz);
        case 'name':
          return r.name;
        case 'attending':
          return r.attending ? t('Yes') : t('No');
        case 'guests':
          return r.attending ? r.guests : 0;
        case 'party':
          return otherGuests(r, t);
        case 'email':
          return r.email ?? '';
        case 'message':
          return r.message ?? '';
        case 'source':
          return sourceText(r, t);
        default: {
          const id = c.key.slice('answer:'.length);
          const value = r.answers?.find((a) => a.id === id)?.answer ?? '';
          if (c.kind === 'number' && /^\d{1,6}$/.test(value)) return Number(value);
          return value;
        }
      }
    }),
  );
  return { title: tableTitle(opts.content, t), timeZone: tz, columns, rows };
}

// ---------------------------------------------------------------------------------------------
// Summary

/** The Summary sheet: totals, then the breakdown of every choice and yes / no question (replies that said yes). */
export function summaryRows(list: readonly TableReply[], opts: TableOptions): SummaryRow[] {
  const t = opts.t ?? english;
  const tz = siteTimeZone(opts.content);
  const now = opts.now ?? new Date();
  const config = rsvpFormConfig(opts.content);
  const counted = list.filter((r) => !r.held);
  const coming = counted.filter((r) => r.attending);
  const held = list.length - counted.length;
  const people = coming.reduce((n, r) => n + r.guests, 0);
  const deadline = (opts.content as { rsvp?: { deadline?: unknown } } | null)?.rsvp?.deadline;
  const locale = (opts.content as { locale?: unknown } | null)?.locale;

  const rows: SummaryRow[] = [
    { kind: 'title', label: tableTitle(opts.content, t) },
    { kind: 'row', label: t('Last updated'), value: localDateTime(now.toISOString(), tz) },
    { kind: 'row', label: t('Time zone'), value: tz },
    ...(typeof deadline === 'string' ? [{ kind: 'row' as const, label: t('Reply by'), value: formatDate(deadline, typeof locale === 'string' ? locale : 'en-US') }] : []),
    { kind: 'blank' },
    { kind: 'section', label: t('Replies') },
    { kind: 'row', label: t('Total replies'), value: counted.length },
    { kind: 'row', label: t('Coming'), value: coming.length },
    { kind: 'row', label: t('Not coming'), value: counted.length - coming.length },
    { kind: 'row', label: t('People coming (head count)'), value: people },
  ];
  if (held) rows.push({ kind: 'row', label: t('Held for review (not counted)'), value: held });

  for (const q of config.questions) {
    if (q.type === 'choice' || q.type === 'yesno') {
      const given = coming.map((r) => r.answers?.find((a) => a.id === q.id)?.answer).filter((a): a is string => Boolean(a && a.trim()));
      const counts = new Map<string, { label: string; n: number }>();
      for (const o of q.options) counts.set(normalizeLine(o).toLowerCase(), { label: normalizeLine(o), n: 0 });
      for (const a of given) {
        const k = normalizeLine(a).toLowerCase();
        const row = counts.get(k) ?? { label: normalizeLine(a), n: 0 };
        row.n += 1;
        counts.set(k, row);
      }
      rows.push({ kind: 'blank' }, { kind: 'section', label: normalizeLine(q.label) || q.id, head: [t('Replies'), t('Share')] });
      for (const { label, n } of counts.values()) rows.push({ kind: 'row', label, value: n, share: given.length ? n / given.length : 0 });
      rows.push({ kind: 'row', label: t('No answer'), value: coming.length - given.length, share: null });
    } else if (q.type === 'number') {
      const values = coming.map((r) => Number(r.answers?.find((a) => a.id === q.id)?.answer)).filter((n) => Number.isFinite(n));
      rows.push({ kind: 'blank' }, { kind: 'section', label: normalizeLine(q.label) || q.id });
      rows.push({ kind: 'row', label: t('Total'), value: values.reduce((a, b) => a + b, 0) }, { kind: 'row', label: t('Answers'), value: values.length });
    }
  }
  return rows;
}
