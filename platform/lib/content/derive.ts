// Derived (read-only) values that themes can use like normal content fields.
// They are computed from the record; the buyer never edits them directly.
//
//   date_weekday                 "Saturday"
//   date_long                    "Saturday, May 15, 2027"
//   venue.city_region            "Savannah, Georgia"
//   venue.city_region_country    "Savannah, Georgia, USA"
//   countdown_target_utc         "2027-05-15T20:00:00.000Z" (date + ceremony_time in timezone)
//   thank_you_on                 true after the wedding day (or turned on), G075 — lib/content/thank-you.ts
//   thank_you_title              the couple's thank-you title, else "Thank you for celebrating with us"
//   thank_you_hides_details      thank-you mode is on and the couple hid the Details page
//
// The first three names match the markers already used by the 02 website source.

import { formatDateLong, weekdayName, zonedTimeToUtc } from './format.ts';
import { thankYouViewFields } from './thank-you.ts';

export const DERIVED_FIELDS = [
  'date_weekday',
  'date_long',
  'venue.city_region',
  'venue.city_region_country',
  'countdown_target_utc',
  'thank_you_on',
  'thank_you_title',
  'thank_you_hides_details',
] as const;

export interface ViewOptions {
  /** The moment of the render (thank-you mode depends on it, G075). Default: now. */
  now?: Date;
  /** Show the thank-you version whatever the mode (the couple's own preview of it). */
  thankYou?: boolean;
}

function joinParts(parts: unknown[]): string {
  return parts.filter((p) => typeof p === 'string' && p.trim()).join(', ');
}

/** Deep copy of the content with derived fields added. Never mutates the input. */
export function buildView(content: unknown, opts: ViewOptions = {}): Record<string, unknown> {
  const view = structuredClone((content ?? {}) as Record<string, unknown>);
  const locale = typeof view.locale === 'string' ? view.locale : 'en-US';
  view.date_weekday = weekdayName(view.date);
  view.date_long = formatDateLong(view.date, locale);
  view.countdown_target_utc = zonedTimeToUtc(view.date, view.ceremony_time, view.timezone);
  const venue = view.venue;
  if (venue && typeof venue === 'object' && !Array.isArray(venue)) {
    const v = venue as Record<string, unknown>;
    v.city_region = joinParts([v.city, v.region]);
    v.city_region_country = joinParts([v.city, v.region, v.country]);
  }
  Object.assign(view, thankYouViewFields(content, opts.now ?? new Date(), opts.thankYou === true));
  yesNoOptions(view);
  return view;
}

/**
 * G128: a "yes / no" RSVP question shows as two choices (Yes, No) in every theme's existing choice markup
 * (data-repeat=".options"); the other non-choice types keep no options (the theme's answer box; /rsvp/form.js turns it
 * into the right input from the site-data "rsvp_form").
 */
function yesNoOptions(view: Record<string, unknown>): void {
  const questions = (view.rsvp as { questions?: unknown } | undefined)?.questions;
  if (!Array.isArray(questions)) return;
  for (const q of questions as Array<Record<string, unknown>>) {
    if (q && typeof q === 'object' && q.type === 'yesno') q.options = ['Yes', 'No'];
  }
}

/** Value at a dotted path (`schedule.0.time`). Own properties only — no prototype access. */
export function getPath(obj: unknown, dotted: string): unknown {
  if (dotted === '' || dotted === '.') return obj;
  let cur: unknown = obj;
  for (const seg of dotted.split('.')) {
    if (cur === null || typeof cur !== 'object') return undefined;
    if (Array.isArray(cur)) {
      if (!/^\d+$/.test(seg)) return undefined;
      cur = cur[Number(seg)];
    } else {
      if (!Object.hasOwn(cur, seg)) return undefined;
      cur = (cur as Record<string, unknown>)[seg];
    }
  }
  return cur;
}

/** Fields whose raw value is an ISO date / HH:MM time; shown formatted unless data-format="raw". */
const DATE_PATHS = new Set(['date', 'rsvp.deadline']);
const TIME_PATHS = new Set(['ceremony_time', 'schedule.*.time']);

export function fieldKind(absPath: string): 'date' | 'time' | 'text' {
  const generic = absPath.replace(/\.\d+(?=\.|$)/g, '.*');
  if (DATE_PATHS.has(generic)) return 'date';
  if (TIME_PATHS.has(generic)) return 'time';
  return 'text';
}
