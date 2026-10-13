// "Add to calendar" (G051): the event of a content record as an iCalendar file (RFC 5545) and as a
// Google Calendar link. Used by the theme engine (data-calendar="ics|google") and the
// /<slug>/event.ics route. No Node imports: pure functions over the content record.
//
// Times (the schema has no end time, so the rule is written down here and in the README):
//  - start = ceremony_time, else the earliest schedule time, on `date`, in the record's IANA `timezone`;
//  - end   = END_AFTER_LAST_MS after the latest schedule time that is not before the start
//            (at least END_AFTER_LAST_MS after the start);
//  - both are converted to UTC with zonedTimeToUtc (daylight saving handled: Temporal "compatible"
//    rule), so DTSTART/DTEND are UTC ("…Z") and every calendar shows the right local time;
//  - no time at all -> an all-day event (VALUE=DATE); unknown time zone -> "floating" local times
//    (no Z: the guest's calendar reads them as its own local time; validation warns about the zone).

import { buildView } from './content/derive.ts';
import { formatTime, isValidTimeZone, parseIsoDate, parseTime, zonedTimeToUtc } from './content/format.ts';

/** How long after the last item of the order of the day the calendar event ends (also the minimum length). */
export const END_AFTER_LAST_MS = 2 * 60 * 60 * 1000;

export type CalendarTime =
  | { kind: 'utc'; start: Date; end: Date }
  | { kind: 'floating'; start: string; end: string } // YYYYMMDDTHHMMSS, local wall time
  | { kind: 'date'; start: string; end: string }; // YYYYMMDD, end exclusive (next day)

export interface CalendarEvent {
  /** "Clara & Julian’s Wedding" */
  title: string;
  time: CalendarTime;
  /** Venue name, address, city, region, country (whatever is filled). */
  location: string;
  /** Order of the day (+ dress code when that block is on) and the site address. */
  description: string;
  /** IANA zone of the event (Google's ctz) or null. */
  timeZone: string | null;
  /** Public address of the site, when known. */
  url: string | null;
}

export interface CalendarOptions {
  /** Absolute site address (https://host/<slug>); goes into the description and URL property. */
  siteUrl?: string | null;
}

const KIND: Record<string, string> = {
  wedding: 'Wedding',
  save_the_date: 'Wedding',
  engagement: 'Engagement Party',
  bridal_shower: 'Bridal Shower',
};

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** "Clara & Julian" -> "Clara & Julian’s"; "Charles" -> "Charles’". */
function possessive(names: string): string {
  return /s$/i.test(names) ? `${names}’` : `${names}’s`;
}

function eventTitle(view: Record<string, unknown>): string {
  const partners = Array.isArray(view.partners) ? (view.partners as Array<{ display_name?: unknown }>) : [];
  const names = str(view.name_display) || partners.map((p) => str(p?.display_name)).filter(Boolean).join(' & ');
  const kind = KIND[str(view.event_type)] ?? '';
  if (!names) return kind || 'Celebration';
  return kind ? `${possessive(names)} ${kind}` : names;
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0');
const compactDate = (d: { year: number; month: number; day: number }) => `${pad(d.year, 4)}${pad(d.month)}${pad(d.day)}`;

/** Wall clock + minutes, rolling over midnight (for floating times). */
function addMinutesWall(date: { year: number; month: number; day: number }, minutes: number): string {
  const t = new Date(Date.UTC(date.year, date.month - 1, date.day, 0, minutes));
  return `${pad(t.getUTCFullYear(), 4)}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`;
}

function minutesOf(hhmm: unknown): number | null {
  const t = parseTime(hhmm);
  return t ? t.hour * 60 + t.minute : null;
}

/**
 * The event of a content record, or null when it has no readable date.
 * Only what guests can see on the site goes in (dress code only while its block is on).
 */
export function calendarEvent(content: unknown, opts: CalendarOptions = {}): CalendarEvent | null {
  const view = buildView(content);
  const date = parseIsoDate(view.date);
  if (!date) return null;
  const locale = str(view.locale) || 'en-US';
  const schedule = (Array.isArray(view.schedule) ? view.schedule : []) as Array<Record<string, unknown>>;
  const scheduleMinutes = schedule.map((s) => minutesOf(s?.time)).filter((m): m is number => m !== null);
  const startMin = minutesOf(view.ceremony_time) ?? (scheduleMinutes.length ? Math.min(...scheduleMinutes) : null);
  const tz = isValidTimeZone(view.timezone) ? (view.timezone as string) : null;

  let time: CalendarTime;
  if (startMin === null) {
    const next = new Date(Date.UTC(date.year, date.month - 1, date.day + 1));
    time = { kind: 'date', start: compactDate(date), end: compactDate({ year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() }) };
  } else {
    const lastMin = Math.max(startMin, ...scheduleMinutes.filter((m) => m >= startMin));
    const endAfterMin = Math.max(lastMin - startMin, 0) + END_AFTER_LAST_MS / 60_000;
    const hhmm = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const startUtc = tz ? zonedTimeToUtc(view.date, hhmm(startMin), tz) : null;
    if (startUtc) {
      // End: the last item's own wall time converted (a DST change during the evening is respected), + the margin.
      const lastUtc = zonedTimeToUtc(view.date, hhmm(lastMin), tz)!;
      const start = new Date(startUtc);
      const end = new Date(Math.max(Date.parse(lastUtc) + END_AFTER_LAST_MS, start.getTime() + END_AFTER_LAST_MS));
      time = { kind: 'utc', start, end };
    } else {
      time = { kind: 'floating', start: addMinutesWall(date, startMin), end: addMinutesWall(date, startMin + endAfterMin) };
    }
  }

  const venue = (view.venue ?? {}) as Record<string, unknown>;
  const location = [str(venue.name), str(venue.address), str(venue.city_region_country)].filter(Boolean).join(', ');

  const lines: string[] = [];
  const rows = schedule
    .filter((s) => str(s?.label))
    .map((s) => {
      const t = formatTime(s.time, locale);
      const where = str(s.location);
      return `${t ? `${t}  ` : ''}${str(s.label)}${where ? ` · ${where}` : ''}`;
    });
  if (rows.length) {
    lines.push(tz ? `Order of the day (${tz.replace(/_/g, ' ')} time):` : 'Order of the day:', ...rows);
  }
  const blocks = (view.optional_blocks ?? {}) as Record<string, unknown>;
  if (blocks.dress_code === true && str(view.dress_code)) lines.push('', `Dress code: ${str(view.dress_code)}`);
  const url = opts.siteUrl ? opts.siteUrl : null;
  if (url) lines.push('', `Website: ${url}`);
  while (lines[0] === '') lines.shift();

  return { title: eventTitle(view), time, location, description: lines.join('\n'), timeZone: tz, url };
}

// ---------------------------------------------------------------------------------------------
// iCalendar (RFC 5545)

/**
 * TEXT value escaping (RFC 5545 §3.3.11). TEXT may not hold control characters (CONTROL = %x00-08 / %x0A-1F / %x7F;
 * content validation accepts them): line breaks pasted from Word/PowerPoint (U+000B), form feed and the Unicode line/
 * paragraph separators become newlines, every other control character except tab is dropped.
 */
export function icsText(value: string): string {
  return value
    .replace(/\r\n?/g, '\n')
    .replace(/[\u000B\u000C\u2028\u2029]/g, '\n')
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/** Folds a content line to at most 75 octets per line (RFC 5545 §3.1), never inside a UTF-8 character. */
export function foldLine(line: string): string {
  const enc = new TextEncoder();
  const out: string[] = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with one space
    if (bytes + n > limit) {
      out.push(cur);
      cur = '';
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** 20270515T200000Z */
export function icsUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export interface IcsOptions {
  /** Stable, globally unique id, e.g. "clara-and-julian@sites.example" (re-imports update the same event). */
  uid: string;
  /** DTSTAMP / LAST-MODIFIED: when this version was published (now if unknown). */
  stamp?: Date;
}

/** The whole .ics file (CRLF line ends, folded lines, UTF-8). */
export function icsFile(event: CalendarEvent, opts: IcsOptions): string {
  const stamp = icsUtc(opts.stamp ?? new Date());
  const t = event.time;
  const when =
    t.kind === 'utc'
      ? [`DTSTART:${icsUtc(t.start)}`, `DTEND:${icsUtc(t.end)}`]
      : t.kind === 'date'
        ? [`DTSTART;VALUE=DATE:${t.start}`, `DTEND;VALUE=DATE:${t.end}`]
        : [`DTSTART:${t.start}`, `DTEND:${t.end}`];
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding website//Add to calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsText(opts.uid)}`,
    `DTSTAMP:${stamp}`,
    `LAST-MODIFIED:${stamp}`,
    ...when,
    `SUMMARY:${icsText(event.title)}`,
    ...(event.location ? [`LOCATION:${icsText(event.location)}`] : []),
    ...(event.description ? [`DESCRIPTION:${icsText(event.description)}`] : []),
    ...(event.url ? [`URL:${event.url}`] : []),
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------------------------------------
// Google Calendar

/**
 * "Add to Google Calendar" link (calendar.google.com/calendar/render?action=TEMPLATE …).
 * UTC times carry "Z"; ctz shows them in the event's zone. All-day: dates=YYYYMMDD/YYYYMMDD.
 */
export function googleCalendarUrl(event: CalendarEvent): string {
  const t = event.time;
  const dates = t.kind === 'utc' ? `${icsUtc(t.start)}/${icsUtc(t.end)}` : `${t.start}/${t.end}`;
  const params = new URLSearchParams({ action: 'TEMPLATE', text: event.title, dates });
  if (event.description) params.set('details', event.description);
  if (event.location) params.set('location', event.location);
  if (event.timeZone && t.kind !== 'date') params.set('ctz', event.timeZone);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
