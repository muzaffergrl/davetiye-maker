// Editable design texts (G068, K28): "almost every text changes from the panel". The fixed headings, labels and buttons of
// a theme ("You are invited", "Will You Join Us?", the navigation, the form labels …) carry a key; the couple's own words
// for a key live in content.copy.<key> (docs/03), the design's text is the default and comes back when the value is empty.
//
//   template  <p class="kicker" data-copy="envelope_kicker">You are invited</p>      element text = the default
//             <div class="stage" aria-label="Open the invitation" data-copy-attr="aria-label:envelope_open">
//             <title data-text="{copy.story_title} · {name_display}">                 a key inside a data-text / data-attr template
//   theme.json "copy": {"envelope_kicker": {"default": "You are invited", "max": 40, "pages": ["index"]}, …}
//             written by `node scripts/copy-manifest.ts --theme <id>` from the templates (lib/theme/copy-scan.ts), `max` kept
//             (the longest text the design carries without overflow; theme-check --stress fills every key to it)
//   content   {"copy": {"envelope_kicker": "You're invited to our vow renewal"}}
//
// This module is pure and small (the panel bundles it): the key catalogue (panel page, label, order), reading a manifest,
// resolving texts, checks, the event-type suggestions. Template scanning (cheerio) is lib/theme/copy-scan.ts.

import type { ValidationIssue } from '../content/validate.ts';
import { normalizeLine } from '../content/text.ts';

/** A copy key: lower case, digits and "_" (no dots: `{copy.<key>}` must stay one path step). */
export const COPY_KEY_RE = /^[a-z][a-z0-9_]{0,47}$/;
/** Longest text any key may hold (schema ceiling, docs/03); a theme's own `max` is usually far smaller. */
export const COPY_MAX_CEILING = 300;
/** Most keys a content record may carry (schema maxProperties). */
export const COPY_MAX_KEYS = 200;

/** Attributes a data-copy-attr may set (the engine's data-attr-* allow list, without value / datetime). */
export const COPY_ATTRS: ReadonlySet<string> = new Set(['alt', 'title', 'content', 'aria-label', 'placeholder']);

/** "data-copy-attr" value → [[attribute, key], …] ("aria-label:envelope_open title:x"). */
export function parseCopyAttr(spec: string): Array<[string, string]> {
  return spec
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf(':');
      return (i > 0 ? [pair.slice(0, i), pair.slice(i + 1)] : [pair, '']) as [string, string];
    });
}

/** The editor pages of the panel (components/panel/pages.ts PAGE_IDS, K29); each key is listed on one of them. */
export const COPY_PANEL_PAGES = ['us', 'day', 'photos', 'story', 'details', 'rsvp'] as const;
export type CopyPanelPage = (typeof COPY_PANEL_PAGES)[number];

/** Theme pages (lib/theme/theme.ts PAGE_NAMES; repeated here so the panel bundle stays free of node imports). */
const THEME_PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
type ThemePage = (typeof THEME_PAGES)[number];

/** One key of a theme's copy manifest (theme.json "copy"). */
export interface CopyEntry {
  /** The design's own text (the template's). */
  default: string;
  /** Longest text (code points) the design carries without overflow. */
  max: number;
  /** Theme pages that show it. */
  pages: ThemePage[];
  /** Panel row label; only for a key outside the catalogue. */
  label?: string;
  /** Panel page; only for a key outside the catalogue (default: details). */
  panel?: CopyPanelPage;
  /** Shown only after the wedding (thank-you mode, G075); only for a key outside the catalogue. */
  after?: boolean;
}

export type CopyManifest = Record<string, CopyEntry>;

/** What the panel needs about a key (catalogue + theme). */
interface CatalogueEntry {
  panel: CopyPanelPage;
  /** Row label in the panel (what and where; the design's text shows as the grey hint). */
  label: string;
  /** Order on its page (lower first: the most-changed keys on top). */
  rank: number;
  /** Shown only after the wedding (thank-you mode): listed under "After the wedding". */
  after?: true;
  /** Suggested `max` for a new theme (scripts/copy-manifest.ts uses it for a new key). */
  max: number;
}

/**
 * The standard keys (docs/11 §3.7). A theme uses the ones that fit its design — same words, same key — so the panel
 * labels, the order and the event-type suggestions work for every design. A design-specific text may use a key of its
 * own (theme.json then gives `label` and `panel`).
 */
export const STANDARD_COPY: Readonly<Record<string, CatalogueEntry>> = {
  // Us: the envelope, the small card, the invitation card, signatures
  envelope_kicker: { panel: 'us', rank: 1, max: 40, label: 'Above your names on the envelope' },
  card_line: { panel: 'us', rank: 2, max: 32, label: 'On the small card' },
  invite_request: { panel: 'us', rank: 3, max: 110, label: 'Invitation card: the line after your names' },
  invite_at: { panel: 'us', rank: 4, max: 12, label: 'Invitation card: before the time' },
  love_line: { panel: 'us', rank: 5, max: 24, label: 'Before your names at the end of a card' },
  foot_kicker: { panel: 'us', rank: 6, max: 30, label: 'Above your names at the bottom of the home page' },
  share_invited: { panel: 'us', rank: 7, max: 40, label: 'When you share your link (link preview)' },
  invite_cue: { panel: 'us', rank: 8, max: 30, label: 'Link down to the invitation card (home page)' },
  envelope_hint_tap: { panel: 'us', rank: 10, max: 24, label: 'Under the envelope, on phones' },
  envelope_hint_click: { panel: 'us', rank: 11, max: 24, label: 'Under the envelope, on computers' },
  envelope_enter: { panel: 'us', rank: 12, max: 20, label: 'Button after the envelope opens' },
  envelope_replay: { panel: 'us', rank: 13, max: 30, label: 'Open the envelope again (envelope page)' },
  home_replay: { panel: 'us', rank: 14, max: 30, label: 'Open the envelope again (home page)' },
  envelope_skip: { panel: 'us', rank: 15, max: 12, label: 'Skip the opening' },
  envelope_open: { panel: 'us', rank: 16, max: 30, label: 'Open the invitation (without animation)' },

  // Day & place: the Day page, venue, calendar, countdown
  day_title: { panel: 'day', rank: 1, max: 24, label: 'Name of the Day page' },
  schedule_title: { panel: 'day', rank: 2, max: 30, label: 'Heading of the schedule card' },
  venue_title: { panel: 'day', rank: 3, max: 30, label: 'Heading above the venue' },
  ceremony_line: { panel: 'day', rank: 4, max: 40, label: 'Before the ceremony time' },
  ceremony_in: { panel: 'day', rank: 5, max: 12, label: 'Between the ceremony time and the place' },
  view_map: { panel: 'day', rank: 6, max: 24, label: 'Map button' },
  home_day_cue: { panel: 'day', rank: 7, max: 24, label: 'Link to the Day page on the home page' },
  calendar_title: { panel: 'day', rank: 8, max: 30, label: 'Above the calendar buttons' },
  calendar_ics: { panel: 'day', rank: 9, max: 20, label: 'Calendar button (Apple / Outlook)' },
  calendar_google: { panel: 'day', rank: 10, max: 20, label: 'Calendar button (Google)' },
  cd_days: { panel: 'day', rank: 11, max: 10, label: 'Countdown: days' },
  cd_hours: { panel: 'day', rank: 12, max: 10, label: 'Countdown: hours' },
  cd_minutes: { panel: 'day', rank: 13, max: 10, label: 'Countdown: minutes' },
  cd_seconds: { panel: 'day', rank: 14, max: 10, label: 'Countdown: seconds' },
  cd_today: { panel: 'day', rank: 15, max: 60, label: 'Countdown on the wedding day' },
  cd_after: { panel: 'day', rank: 16, max: 60, label: 'Countdown after the ceremony' },
  // after the wedding (thank-you mode, G075)
  ty_kicker: { panel: 'day', rank: 30, max: 40, after: true, label: 'Above your names on the envelope' },
  ty_more: { panel: 'day', rank: 31, max: 30, after: true, label: 'Above the links on the home page' },
  ty_cue: { panel: 'day', rank: 32, max: 30, after: true, label: 'Link to your thank-you card' },
  foot_kicker_after: { panel: 'day', rank: 33, max: 30, after: true, label: 'Above your names at the bottom of the home page' },
  ceremony_after: { panel: 'day', rank: 34, max: 40, after: true, label: 'Before the ceremony time' },
  closing_line_after: { panel: 'day', rank: 35, max: 60, after: true, label: 'Line on the RSVP page' },
  home_link: { panel: 'day', rank: 36, max: 20, after: true, label: 'Button back to the home page' },

  // Our Story
  story_title: { panel: 'story', rank: 1, max: 24, label: 'Name of the story page' },
  story_kicker: { panel: 'story', rank: 2, max: 40, label: 'Line under the name' },
  home_story_cue: { panel: 'story', rank: 3, max: 24, label: 'Link to the story on the home page' },

  // Details: blocks, the home page links, the menu
  home_more: { panel: 'details', rank: 1, max: 30, label: 'Above the links on the home page' },
  dress_label: { panel: 'details', rank: 2, max: 24, label: 'Before the dress code' },
  travel_title: { panel: 'details', rank: 3, max: 30, label: 'Travel & stay: heading' },
  travel_note: { panel: 'details', rank: 4, max: 160, label: 'Travel & stay: text' },
  travel_button: { panel: 'details', rank: 5, max: 24, label: 'Travel & stay: button' },
  registry_title: { panel: 'details', rank: 6, max: 30, label: 'Registry: heading' },
  registry_note: { panel: 'details', rank: 7, max: 200, label: 'Registry: text' },
  registry_button: { panel: 'details', rank: 8, max: 24, label: 'Registry: button' },
  faq_title: { panel: 'details', rank: 9, max: 30, label: 'Questions & answers: heading' },
  nav_home: { panel: 'details', rank: 20, max: 10, label: 'Menu: home page' },
  nav_story: { panel: 'details', rank: 21, max: 10, label: 'Menu: story page' },
  nav_details: { panel: 'details', rank: 22, max: 10, label: 'Menu: Day page' },
  nav_rsvp: { panel: 'details', rank: 23, max: 10, label: 'Menu: RSVP page' },
  nav_day: { panel: 'details', rank: 24, max: 10, after: true, label: 'Menu: Day page' },

  // RSVP
  rsvp_title: { panel: 'rsvp', rank: 1, max: 30, label: 'RSVP heading' },
  rsvp_by: { panel: 'rsvp', rank: 2, max: 30, label: 'Before the reply-by date' },
  teaser_rsvp_by: { panel: 'rsvp', rank: 3, max: 20, label: 'Before the reply-by date (home page)' },
  rsvp_button: { panel: 'rsvp', rank: 4, max: 16, label: 'RSVP buttons' },
  home_rsvp_cue: { panel: 'rsvp', rank: 5, max: 20, label: 'Link to the RSVP page on the home page' },
  rsvp_wait: { panel: 'rsvp', rank: 6, max: 50, label: 'Line on the RSVP card' },
  form_kicker: { panel: 'rsvp', rank: 7, max: 30, label: 'Form: above the heading' },
  form_title: { panel: 'rsvp', rank: 8, max: 30, label: 'Form: heading' },
  form_name: { panel: 'rsvp', rank: 9, max: 30, label: 'Form: name' },
  form_email: { panel: 'rsvp', rank: 10, max: 30, label: 'Form: email' },
  form_optional: { panel: 'rsvp', rank: 11, max: 20, label: 'Form: “optional” note' },
  form_attend: { panel: 'rsvp', rank: 12, max: 40, label: 'Form: the question' },
  form_yes: { panel: 'rsvp', rank: 13, max: 30, label: 'Form: yes' },
  form_no: { panel: 'rsvp', rank: 14, max: 30, label: 'Form: no' },
  form_guests: { panel: 'rsvp', rank: 15, max: 30, label: 'Form: number of guests' },
  form_including: { panel: 'rsvp', rank: 16, max: 24, label: 'Form: after the number of guests' },
  form_party: { panel: 'rsvp', rank: 17, max: 24, label: 'Form: other guests’ names' },
  form_note: { panel: 'rsvp', rank: 18, max: 40, label: 'Form: note for you' },
  form_send: { panel: 'rsvp', rank: 19, max: 20, label: 'Form: send button' },
  rsvp_thanks: { panel: 'rsvp', rank: 20, max: 30, label: 'After a reply: heading' },
  rsvp_thanks_yes: { panel: 'rsvp', rank: 21, max: 120, label: 'After a reply: yes' },
  rsvp_thanks_no: { panel: 'rsvp', rank: 22, max: 120, label: 'After a reply: no' },
  rsvp_again: { panel: 'rsvp', rank: 23, max: 30, label: 'After a reply: send another' },
  rsvp_closed_title: { panel: 'rsvp', rank: 24, max: 30, label: 'When replies are closed' },
  closing_title: { panel: 'rsvp', rank: 25, max: 30, label: 'Closing: heading' },
  closing_line: { panel: 'rsvp', rank: 26, max: 60, label: 'Closing: line' },
  rsvp_replay: { panel: 'rsvp', rank: 27, max: 30, label: 'Open the envelope again (RSVP page)' },
};

/**
 * The most-changed keys (the invitation and RSVP headings): listed first on their page and opened first in the panel.
 * Their order is the catalogue's rank; this set only marks them.
 */
export const TOP_COPY_KEYS: ReadonlySet<string> = new Set(['envelope_kicker', 'card_line', 'invite_request', 'day_title', 'schedule_title', 'story_title', 'rsvp_title', 'rsvp_by']);

// ---------------------------------------------------------------------------------------------
// theme.json "copy"

const isPlainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Validates a theme.json "copy" object. Returns the manifest or a list of problems (lib/theme/theme.ts turns them into a
 * ThemeError). Absent = {} (a theme without editable texts; theme-check only warns about its unmarked text).
 */
export function parseCopyManifest(raw: unknown): { manifest: CopyManifest; problems: string[] } {
  const manifest: CopyManifest = {};
  const problems: string[] = [];
  if (raw === undefined) return { manifest, problems };
  if (!isPlainObject(raw)) return { manifest, problems: ['copy must be an object'] };
  for (const [key, value] of Object.entries(raw)) {
    if (!COPY_KEY_RE.test(key)) {
      problems.push(`copy key "${key}" must match ${COPY_KEY_RE}`);
      continue;
    }
    if (!isPlainObject(value)) {
      problems.push(`copy.${key} must be an object {default, max, pages}`);
      continue;
    }
    const def = value.default;
    const max = value.max;
    if (typeof def !== 'string' || !def.trim()) problems.push(`copy.${key}.default must be the design's text`);
    if (typeof max !== 'number' || !Number.isInteger(max) || max < 1 || max > COPY_MAX_CEILING) {
      problems.push(`copy.${key}.max must be a whole number from 1 to ${COPY_MAX_CEILING}`);
    } else if (typeof def === 'string' && [...def].length > max) problems.push(`copy.${key}: the default is longer than max (${max})`);
    const pages = Array.isArray(value.pages) ? value.pages : [];
    if (!pages.length || !pages.every((p) => (THEME_PAGES as readonly unknown[]).includes(p))) {
      problems.push(`copy.${key}.pages must list theme pages (${THEME_PAGES.join(', ')})`);
    }
    if (value.panel !== undefined && !(COPY_PANEL_PAGES as readonly unknown[]).includes(value.panel)) {
      problems.push(`copy.${key}.panel must be one of ${COPY_PANEL_PAGES.join(', ')}`);
    }
    if (value.label !== undefined && (typeof value.label !== 'string' || !value.label.trim())) problems.push(`copy.${key}.label must be text`);
    if (!STANDARD_COPY[key] && typeof value.label !== 'string') problems.push(`copy.${key} is not a standard key (docs/11 §3.7): give it a "label" (and "panel")`);
    if (typeof def !== 'string' || typeof max !== 'number') continue;
    manifest[key] = {
      default: def,
      max,
      pages: pages as ThemePage[],
      ...(typeof value.label === 'string' ? { label: value.label } : {}),
      ...(typeof value.panel === 'string' ? { panel: value.panel as CopyPanelPage } : {}),
      ...(value.after === true ? { after: true } : {}),
    };
  }
  return { manifest, problems };
}

// ---------------------------------------------------------------------------------------------
// Values

/** The couple's text for a key as the site shows it: one line, no control characters, at most `max`; "" = the default. */
export function copyText(raw: unknown, max: number = COPY_MAX_CEILING): string {
  if (typeof raw !== 'string') return '';
  const line = normalizeLine(raw);
  const limit = Math.min(max, COPY_MAX_CEILING);
  const chars = [...line];
  return chars.length > limit ? chars.slice(0, limit).join('').trimEnd() : line;
}

/** The couple's own text for `key` ("" when they kept the design's). */
export function ownCopy(content: unknown, key: string, max?: number): string {
  const copy = isPlainObject(content) && isPlainObject(content.copy) ? content.copy : null;
  return copy && Object.hasOwn(copy, key) ? copyText(copy[key], max) : '';
}

/** Every key of the manifest → the text the site shows (the couple's, else the design's). */
export function resolveCopy(content: unknown, manifest: CopyManifest): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(manifest)) out[key] = ownCopy(content, key, entry.max) || entry.default;
  return out;
}

/**
 * Theme-dependent checks of content.copy (the schema checks the shape): a text longer than the design carries is an
 * error (it blocks publishing, like any too-long text); a key the design does not have is a warning (the site ignores
 * it — e.g. a key a newer version of the design dropped). New unknown keys are refused when the panel saves
 * (lib/panel/api.ts unknownNewCopyKeys).
 */
export function copyIssues(
  content: unknown,
  manifest: Readonly<Record<string, Pick<CopyEntry, 'max'>>>,
  label: (key: string) => string = (key) => copyLabel(key),
): ValidationIssue[] {
  const copy = isPlainObject(content) && isPlainObject(content.copy) ? content.copy : null;
  if (!copy) return [];
  const out: ValidationIssue[] = [];
  for (const [key, value] of Object.entries(copy)) {
    const path = `copy.${key}`;
    const entry = manifest[key];
    if (!entry) {
      out.push({ level: 'warning', code: 'copy_unknown_key', path, message: 'This text is not part of the design: the website does not show it.' });
      continue;
    }
    if (typeof value !== 'string') continue;
    const length = [...normalizeLine(value)].length;
    if (length > entry.max) {
      out.push({ level: 'error', code: 'copy_too_long', path, message: `${label(key)} is ${length} characters. Please shorten it to ${entry.max}.` });
    }
  }
  return out;
}

/** Keys in `next.copy` that the design does not have and that `stored.copy` did not hold already (refused on save). */
export function unknownNewCopyKeys(stored: unknown, next: unknown, manifest: Readonly<Record<string, unknown>>): string[] {
  const keys = (c: unknown) => (isPlainObject(c) && isPlainObject(c.copy) ? Object.keys(c.copy) : []);
  const had = new Set(keys(stored));
  return keys(next).filter((k) => !Object.hasOwn(manifest, k) && !had.has(k));
}

/** The panel label of a key (catalogue; "Text" when unknown). */
export function copyLabel(key: string, entry?: CopyEntry): string {
  return entry?.label ?? STANDARD_COPY[key]?.label ?? 'This text';
}

// ---------------------------------------------------------------------------------------------
// The panel's view of a manifest

export interface PanelCopyEntry {
  key: string;
  default: string;
  max: number;
  label: string;
  panel: CopyPanelPage;
  rank: number;
  /** Shown only after the wedding (listed under "After the wedding"). */
  after: boolean;
  /** One of the most-changed keys (on top). */
  top: boolean;
  /** Long texts get a text box. */
  multiline: boolean;
  /** Website pages that show it (the preview opens the first one the site shows). */
  pages: string[];
}

/** The manifest as the panel lists it: by page, the most-changed keys first, "after the wedding" keys last. */
export function panelCopyEntries(manifest: CopyManifest): PanelCopyEntry[] {
  return Object.entries(manifest)
    .map(([key, e]) => {
      const std = STANDARD_COPY[key];
      return {
        key,
        default: e.default,
        max: e.max,
        label: e.label ?? std?.label ?? e.default,
        panel: e.panel ?? std?.panel ?? 'details',
        rank: std?.rank ?? 100,
        after: e.after === true || std?.after === true,
        top: TOP_COPY_KEYS.has(key),
        multiline: e.max > 80,
        pages: [...e.pages],
      };
    })
    .sort((a, b) => Number(a.after) - Number(b.after) || a.rank - b.rank || a.key.localeCompare(b.key));
}

/** The panel page a copy path ("copy.<key>") belongs to; null when the design has no such key. */
export function copyPanelPage(path: string, entries: readonly PanelCopyEntry[]): CopyPanelPage | null {
  if (!path.startsWith('copy.')) return null;
  const key = path.slice('copy.'.length);
  return entries.find((e) => e.key === key)?.panel ?? null;
}

// ---------------------------------------------------------------------------------------------
// Event-type suggestions (the panel's optional shortcut: one tap fills several keys; every text stays editable)

export interface CopyPreset {
  id: string;
  label: string;
  /** key → suggested text; null = back to the design's text. */
  values: Readonly<Record<string, string | null>>;
}

const PRESET_KEYS = ['card_line', 'invite_request', 'cd_today'] as const;

export const COPY_PRESETS: readonly CopyPreset[] = [
  { id: 'wedding', label: 'Wedding', values: Object.fromEntries(PRESET_KEYS.map((k) => [k, null])) },
  {
    id: 'vow_renewal',
    label: 'Vow renewal',
    values: {
      card_line: 'We’re renewing our vows',
      invite_request: 'invite you to celebrate the renewal of their vows',
      cd_today: 'Today is the day — we’re renewing our vows!',
    },
  },
  {
    id: 'elopement',
    label: 'Elopement party',
    values: {
      card_line: 'We eloped!',
      invite_request: 'invite you to celebrate their elopement',
      cd_today: 'Today is the day — let’s celebrate!',
    },
  },
  {
    id: 'commitment',
    label: 'Commitment ceremony',
    values: {
      card_line: 'We’re making it official',
      invite_request: 'invite you to celebrate their commitment ceremony',
      cd_today: 'Today is the day — we’re celebrating!',
    },
  },
];

/**
 * The content with a suggestion applied to the keys this design has (a suggested text longer than the design carries is
 * left out). Returns the keys it changed.
 */
export function applyCopyPreset<T extends { copy?: Record<string, string | null> }>(content: T, preset: CopyPreset, manifest: CopyManifest): { content: T; changed: string[] } {
  const next = structuredClone(content);
  const copy: Record<string, string | null> = { ...(next.copy ?? {}) };
  const changed: string[] = [];
  for (const [key, value] of Object.entries(preset.values)) {
    const entry = manifest[key];
    if (!entry) continue;
    if (value !== null && [...value].length > entry.max) continue;
    const before = copy[key] ?? null;
    const after = value === null || value === entry.default ? null : value;
    if ((before || null) === after) continue;
    if (after === null) delete copy[key];
    else copy[key] = after;
    changed.push(key);
  }
  if (Object.keys(copy).length) next.copy = copy;
  else delete next.copy;
  return { content: next, changed };
}

/** Which suggestion the content matches now (null: own words). */
export function currentPreset(content: { copy?: Record<string, string | null> }, manifest: CopyManifest): string | null {
  for (const preset of COPY_PRESETS) {
    let applies = false;
    let matches = true;
    for (const [key, value] of Object.entries(preset.values)) {
      const entry = manifest[key];
      if (!entry) continue;
      applies = true;
      const own = ownCopy(content, key, entry.max);
      const want = value === null || value === entry.default ? '' : value;
      if (own !== want) matches = false;
    }
    if (applies && matches) return preset.id;
  }
  return null;
}

/** Sets (text) or resets (null / "" / the design's text) one key. */
export function withCopy<T extends { copy?: Record<string, string | null> }>(content: T, key: string, value: string | null, entry?: Pick<CopyEntry, 'default'>): T {
  const next = structuredClone(content);
  const copy: Record<string, string | null> = { ...(next.copy ?? {}) };
  if (value === null || value === '' || (entry && value === entry.default)) delete copy[key];
  else copy[key] = value;
  if (Object.keys(copy).length) next.copy = copy;
  else delete next.copy;
  return next;
}

// ---------------------------------------------------------------------------------------------
// Stress values (docs/11 §12, theme-check --stress)

const STRESS_WORDS = ['Celebrate', 'together', 'beneath', 'the', 'olive', 'trees', 'with', 'everyone', 'we', 'love', 'dearly', 'tonight'];

/** A text of exactly `length` code points made of ordinary words (wraps like real copy; a 1–3 letter key gets a word cut). */
export function stressText(length: number): string {
  let s = '';
  for (let i = 0; [...s].length < length; i++) s += (s ? ' ' : '') + STRESS_WORDS[i % STRESS_WORDS.length];
  return [...s].slice(0, length).join('').replace(/\s+$/, (m) => 'x'.repeat(m.length));
}

/** Every key of the manifest filled to its max (the longest the design promises to carry). */
export function stressCopy(manifest: CopyManifest): Record<string, string> {
  return Object.fromEntries(Object.entries(manifest).map(([key, e]) => [key, stressText(e.max)]));
}
