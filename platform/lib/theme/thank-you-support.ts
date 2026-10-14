// Does a theme have a thank-you version (G075, docs/11 §3.6)? A static look at its templates' markers, for
// scripts/theme-check.cjs (a warning, not a failure: such a theme keeps showing the invitation after the wedding — the
// platform still closes replies) and tests/g075-thank-you.test.ts. The panel offers "After the wedding" only when the
// theme names thank_you_on (lib/panel/state.ts themeFieldUse).

import type { PageName } from './theme.ts';

/** What each page must name for a complete thank-you version (docs/11 §3.6). */
export const THANK_YOU_REQUIREMENTS: ReadonlyArray<{ page: PageName; marker: RegExp; what: string }> = [
  { page: 'index', marker: /data-if="[^"]*\bthank_you_on\b/, what: 'index: the envelope card switches (data-if="thank_you_on")' },
  { page: 'index', marker: /data-field="thank_you_title"/, what: 'index: the card carries the thank-you title (data-field="thank_you_title")' },
  { page: 'index', marker: /data-field="thank_you\.photo"/, what: 'index: the thank-you photo in the card window (data-field="thank_you.photo")' },
  { page: 'index', marker: /data-if="[^"]*!thank_you\.photo\b/, what: 'index: the design\'s decoration without a photo (data-if="thank_you_on !thank_you.photo")' },
  { page: 'home', marker: /data-field="thank_you_title"/, what: 'home: the thank-you title' },
  { page: 'home', marker: /data-field="thank_you\.message"/, what: 'home: the couple\'s message (data-field="thank_you.message")' },
  { page: 'home', marker: /data-field="thank_you\.photo"/, what: 'home: the thank-you photo' },
  { page: 'home', marker: /data-if="[^"]*!thank_you_on\b/, what: 'home: invitation-only parts (countdown, RSVP, calendar) off in thank-you mode' },
  { page: 'details', marker: /<body\b[^>]*data-if="[^"]*!thank_you_hides_details\b/, what: 'details: the page can be hidden (<body data-if="!thank_you_hides_details">)' },
  { page: 'rsvp', marker: /data-if="[^"]*!thank_you_on\b/, what: 'rsvp: no reply form in thank-you mode, honest "Replies are closed"' },
];

export interface ThankYouSupport {
  /** Every requirement met. */
  complete: boolean;
  /** Some thank-you markers, not all (a half-done theme). */
  partial: boolean;
  /** Requirements not met (empty when complete). */
  missing: string[];
}

/** Checks templates by page name (missing pages count as not meeting their requirements). */
export function thankYouSupport(pages: Partial<Record<PageName, string>>): ThankYouSupport {
  const missing = THANK_YOU_REQUIREMENTS.filter((r) => !r.marker.test(pages[r.page] ?? '')).map((r) => r.what);
  const any = Object.values(pages).some((html) => /\bthank_you(?:_on|_title|_hides_details|\.)/.test(html ?? ''));
  return { complete: missing.length === 0, partial: any && missing.length > 0, missing };
}
