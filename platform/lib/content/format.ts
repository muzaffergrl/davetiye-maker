// Display formatting for content values. Mirrors tools/validate_content.py
// (fmt_date / fmt_time) so every format shows the same text:
//   en-US  -> "June 12, 2027", "Saturday, June 12, 2027", "4:00 PM"
//   others -> "12 June 2027",  "Saturday, 12 June 2027",  "4:00 pm"
// Numeric dates such as 06/12/27 are never produced (AGENTS.md).

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export interface IsoDate {
  year: number;
  month: number; // 1-12
  day: number;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Strict YYYY-MM-DD parser; rejects impossible dates such as 2027-02-30. */
export function parseIsoDate(value: unknown): IsoDate | null {
  if (typeof value !== 'string') return null;
  const m = ISO_DATE.exec(value);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day };
}

/** Strict 24h HH:MM parser (same pattern as the schema). */
export function parseTime(value: unknown): { hour: number; minute: number } | null {
  if (typeof value !== 'string') return null;
  const m = HHMM.exec(value);
  if (!m) return null;
  return { hour: Number(m[1]), minute: Number(m[2]) };
}

function isUS(locale: string | undefined): boolean {
  return locale === 'en-US';
}

export function weekdayName(iso: unknown): string | null {
  const d = parseIsoDate(iso);
  if (!d) return null;
  return WEEKDAYS[new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()];
}

export function monthName(iso: unknown): string | null {
  const d = parseIsoDate(iso);
  return d ? MONTHS[d.month - 1] : null;
}

/** "June 12, 2027" (en-US) or "12 June 2027" (other locales). */
export function formatDate(iso: unknown, locale?: string): string | null {
  const d = parseIsoDate(iso);
  if (!d) return null;
  const month = MONTHS[d.month - 1];
  return isUS(locale) ? `${month} ${d.day}, ${d.year}` : `${d.day} ${month} ${d.year}`;
}

/** "Saturday, June 12, 2027" (en-US) or "Saturday, 12 June 2027". */
export function formatDateLong(iso: unknown, locale?: string): string | null {
  const short = formatDate(iso, locale);
  const weekday = weekdayName(iso);
  return short && weekday ? `${weekday}, ${short}` : null;
}

/** "4:00 PM" (en-US) or "4:00 pm" (other locales). */
export function formatTime(hhmm: unknown, locale?: string): string | null {
  const t = parseTime(hhmm);
  if (!t) return null;
  const h = t.hour % 12 || 12;
  let suffix = t.hour < 12 ? 'AM' : 'PM';
  if (!isUS(locale)) suffix = suffix.toLowerCase();
  return `${h}:${String(t.minute).padStart(2, '0')} ${suffix}`;
}

export function isValidTimeZone(tz: unknown): boolean {
  if (typeof tz !== 'string' || !tz) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function zoneOffsetMs(utcMs: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - utcMs;
}

/**
 * Local wall-clock date + time in an IANA zone -> UTC ISO string
 * (e.g. 2027-09-18 16:30 America/New_York -> 2027-09-18T20:30:00.000Z).
 * Used for countdowns and the RSVP closing time. Returns null for unreadable input.
 *
 * Daylight-saving edges follow Temporal's "compatible" rule: a wall time that happens twice
 * (clocks go back) is the earlier instant; a wall time that does not exist (clocks jump forward,
 * e.g. 00:00 on 2027-03-28 in Asia/Beirut) moves forward by the gap (-> 01:00 local), so a
 * "midnight" deadline never closes early.
 */
export function zonedTimeToUtc(isoDate: unknown, hhmm: unknown, timeZone: unknown): string | null {
  const d = parseIsoDate(isoDate);
  const t = parseTime(hhmm);
  if (!d || !t || !isValidTimeZone(timeZone)) return null;
  const tz = timeZone as string;
  const wall = Date.UTC(d.year, d.month - 1, d.day, t.hour, t.minute);
  const DAY = 86_400_000;
  // Offsets a day before and a day after: at most one transition lies between them.
  const before = zoneOffsetMs(wall - DAY, tz);
  const after = zoneOffsetMs(wall + DAY, tz);
  const fits = (utc: number) => utc + zoneOffsetMs(utc, tz) === wall;
  const candidates = [wall - before, wall - after].filter(fits).sort((a, b) => a - b);
  // Gap: no instant shows this wall time; the pre-transition offset lands just after the jump.
  return new Date(candidates.length ? candidates[0] : wall - before).toISOString();
}
