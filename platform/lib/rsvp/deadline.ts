// When does the RSVP form close?
//
// content.rsvp.deadline is the last day replies are accepted, so the form closes at the END of
// that day in the site's time zone (= 00:00 of the next day there). If the time zone is not a
// valid IANA name, the latest time zone on earth (UTC-12, "anywhere on earth") is used, so a
// guest is never turned away early. A missing/unreadable deadline means the form stays open
// (published content is validated, so this only happens with hand-made records).
// rsvp.method === "none" means the couple turned replies off.

import { formatDate, isValidTimeZone, parseIsoDate, zonedTimeToUtc } from '../content/format.ts';

export type RsvpClosedReason = 'deadline' | 'disabled';

export interface RsvpWindow {
  open: boolean;
  reason: RsvpClosedReason | null;
  /** Moment the form closes (UTC ISO), or null when there is no readable deadline. */
  closesAt: string | null;
  /** The deadline as guests read it: "April 3, 2027" (en-US) / "3 April 2027". */
  deadlineDisplay: string | null;
}

/** UTC instant at which replies stop, or null when the deadline is missing/invalid. */
export function rsvpClosesAt(deadline: unknown, timeZone: unknown): Date | null {
  const d = parseIsoDate(deadline);
  if (!d) return null;
  const next = new Date(Date.UTC(d.year, d.month - 1, d.day + 1));
  const nextIso = next.toISOString().slice(0, 10);
  if (isValidTimeZone(timeZone)) {
    const iso = zonedTimeToUtc(nextIso, '00:00', timeZone);
    if (iso) return new Date(iso);
  }
  // Anywhere on earth: 00:00 at UTC-12 is 12:00 UTC of the next day.
  return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate(), 12, 0));
}

/** Open/closed state of the reply form for a content record at `now`. */
export function rsvpWindow(content: unknown, now: Date = new Date()): RsvpWindow {
  const c = (content ?? {}) as { rsvp?: { deadline?: unknown; method?: unknown }; timezone?: unknown; locale?: unknown };
  const deadline = c.rsvp?.deadline;
  const closes = rsvpClosesAt(deadline, c.timezone);
  const deadlineDisplay = formatDate(deadline, typeof c.locale === 'string' ? c.locale : 'en-US');
  const base = { closesAt: closes ? closes.toISOString() : null, deadlineDisplay };
  if (c.rsvp?.method === 'none') return { open: false, reason: 'disabled', ...base };
  if (closes && now.getTime() >= closes.getTime()) return { open: false, reason: 'deadline', ...base };
  return { open: true, reason: null, ...base };
}

/** Friendly English text for a closed form. */
export function closedMessage(w: Pick<RsvpWindow, 'reason' | 'deadlineDisplay'>): string {
  if (w.reason === 'disabled') return 'Online replies are not open for this event. Please contact the couple directly.';
  return w.deadlineDisplay
    ? `Replies closed on ${w.deadlineDisplay}. If you still need to reply, please contact the couple directly.`
    : 'Replies are closed. If you still need to reply, please contact the couple directly.';
}
