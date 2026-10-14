// Thank-you mode after the wedding (G075, K28). Pure; runs on the server and in the panel (no Node imports).
//
// content.thank_you = { mode, title, message, photo, details } (docs/03_URUN_ICERIK_SEMASI.json, all optional):
//   mode "auto" (default, also when thank_you is missing): on from 00:00 of the day AFTER the wedding date in the site's
//        time zone — the wedding day itself is never cut short. Daylight-saving edges follow zonedTimeToUtc (a midnight
//        that does not exist, e.g. Asia/Beirut, becomes 01:00: never early). An unknown time zone uses the latest one on
//        earth (UTC-12, "anywhere on earth"), so no guest anywhere sees "thank you" while it is still the wedding day.
//        A missing or unreadable date never switches.
//   mode "on":  thank-you mode now (the couple turned it on by hand).
//   mode "off": never (the website stays the invitation until it is archived, G060 / K25).
// What it changes is the theme's job (data-if="thank_you_on" …, docs/11 §3.6); the platform closes RSVP replies
// (lib/rsvp/deadline.ts, reason "thank_you") and serves the thank-you photo (lib/site/static.ts) only while it is on.
// Archive rules are unchanged: 12 months after the wedding the site is archived (410) whatever the mode.

import { isValidTimeZone, parseIsoDate, zonedTimeToUtc } from './format.ts';
import type { ThankYouMode } from './types.ts';

export const THANK_YOU_MODES: readonly ThankYouMode[] = ['auto', 'on', 'off'];

/** The title guests see when the couple wrote none. */
export const THANK_YOU_DEFAULT_TITLE = 'Thank you for celebrating with us';

/**
 * Derived view fields a theme may use (lib/content/derive.ts adds them for the render):
 *   thank_you_on             true while thank-you mode is on (data-if="thank_you_on" / "!thank_you_on")
 *   thank_you_title          the couple's title, else THANK_YOU_DEFAULT_TITLE
 *   thank_you_hides_details  true while thank-you mode is on and the couple hid the Details page
 */
export const THANK_YOU_VIEW_FIELDS = ['thank_you_on', 'thank_you_title', 'thank_you_hides_details'] as const;

type Settings = { mode?: unknown; title?: unknown; message?: unknown; photo?: unknown; details?: unknown };

function settingsOf(content: unknown): Settings {
  const t = (content as { thank_you?: unknown } | null | undefined)?.thank_you;
  return t && typeof t === 'object' && !Array.isArray(t) ? (t as Settings) : {};
}

/** The mode as stored; anything unknown (or no thank_you at all) is "auto". */
export function thankYouMode(content: unknown): ThankYouMode {
  const m = settingsOf(content).mode;
  return m === 'on' || m === 'off' ? m : 'auto';
}

/** UTC instant of 00:00 on the day after `isoDate` in `timeZone` (the end of that day there), or null. */
export function dayEndsAt(isoDate: unknown, timeZone: unknown): Date | null {
  const d = parseIsoDate(isoDate);
  if (!d) return null;
  const next = new Date(Date.UTC(d.year, d.month - 1, d.day + 1));
  if (isValidTimeZone(timeZone)) {
    const iso = zonedTimeToUtc(next.toISOString().slice(0, 10), '00:00', timeZone);
    if (iso) return new Date(iso);
  }
  // Anywhere on earth: 00:00 at UTC-12 is 12:00 UTC.
  return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate(), 12, 0));
}

/** When automatic thank-you mode starts: the end of the wedding day in the site's time zone (null: no readable date). */
export function thankYouStartsAt(content: unknown): Date | null {
  const c = (content ?? {}) as { date?: unknown; timezone?: unknown };
  return dayEndsAt(c.date, c.timezone);
}

export interface ThankYouState {
  mode: ThankYouMode;
  /** Guests see the thank-you version now. */
  on: boolean;
  /** When "auto" switches (UTC ISO), whatever the mode; null without a readable date. */
  startsAt: string | null;
}

/** Thank-you mode of a content record at `now`. */
export function thankYouState(content: unknown, now: Date = new Date()): ThankYouState {
  const mode = thankYouMode(content);
  const starts = thankYouStartsAt(content);
  const on = mode === 'on' || (mode === 'auto' && starts !== null && now.getTime() >= starts.getTime());
  return { mode, on, startsAt: starts ? starts.toISOString() : null };
}

/** True while guests see the thank-you version. */
export function isThankYouOn(content: unknown, now: Date = new Date()): boolean {
  return thankYouState(content, now).on;
}

/** The title guests read (the couple's, else the default). */
export function thankYouTitle(content: unknown): string {
  const t = settingsOf(content).title;
  return typeof t === 'string' && t.trim() ? t.trim() : THANK_YOU_DEFAULT_TITLE;
}

/** The couple chose to hide the Details page after the wedding (default: keep it as "The Day"). */
export function thankYouHidesDetailsSetting(content: unknown): boolean {
  return settingsOf(content).details === 'hide';
}

/** The thank-you photo URL, or null (then the theme shows its own decoration). */
export function thankYouPhoto(content: unknown): string | null {
  const p = settingsOf(content).photo;
  return typeof p === 'string' && p.trim() ? p : null;
}

/**
 * The derived fields for a render. `force` (the couple's own preview of the thank-you version, ?thanks=1 with a preview
 * key) shows it whatever the mode and the date.
 */
export function thankYouViewFields(
  content: unknown,
  now: Date = new Date(),
  force = false,
): { thank_you_on: boolean; thank_you_title: string; thank_you_hides_details: boolean } {
  const on = force || isThankYouOn(content, now);
  return { thank_you_on: on, thank_you_title: thankYouTitle(content), thank_you_hides_details: on && thankYouHidesDetailsSetting(content) };
}

/** Does a theme template use thank-you mode? (any marker naming thank_you_on / thank_you_title / thank_you.*) */
export function usesThankYou(html: string): boolean {
  return /\bdata-(?:if|field|text|attr-[a-z0-9-]+)\s*=\s*"[^"]*\bthank_you(?:_on|_title|_hides_details|\.)/.test(html);
}
