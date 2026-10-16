// TypeScript shape of a content record (docs/03_URUN_ICERIK_SEMASI.json).
// Runtime validation lives in validate.ts; these types are for editor support only.

export type Locale = 'en-US' | 'en-GB' | 'en-CA' | 'en-AU';
export type RecordKind = 'demo' | 'customer';
export type EventType = 'wedding' | 'engagement' | 'save_the_date' | 'bridal_shower' | 'other';
export type RsvpMethod = 'canva_form' | 'external_form' | 'email' | 'none' | null;

export interface Partner {
  display_name: string;
  full_name?: string | null;
}

export interface Venue {
  name: string;
  city: string;
  region?: string | null;
  country?: string | null;
  address?: string | null;
}

export interface ScheduleItem {
  label: string;
  /** HH:MM, 24h */
  time: string;
  location?: string | null;
}

export type UrlKey = 'website' | 'rsvp_form' | 'map' | 'registry' | 'accommodation';

/** A custom question of the guest reply form (G051). `id` is stable: stored answers refer to it. */
export interface RsvpQuestion {
  /** [a-z0-9][a-z0-9_-]{0,23} — never shown; answers are stored under it. */
  id: string;
  /** The question as guests read it, e.g. "Meal choice". */
  label: string;
  /**
   * "choice": pick one of `options` (at least 2) · "text": a short written answer · "long": a longer written answer ·
   * "yesno": Yes or No · "number": a whole number 0–9999 (G128). Only "choice" has options.
   */
  type: RsvpQuestionType;
  options?: string[];
  /** G128: true = a guest who accepts must answer before sending. Missing = optional. */
  required?: boolean;
}

/** Answer types of a custom RSVP question (G051: choice, text; G128: long, yesno, number). */
export type RsvpQuestionType = 'choice' | 'text' | 'long' | 'yesno' | 'number';

/** G128: which built-in fields of the reply form are required (name and attending always are). Missing = optional. */
export interface RsvpRequired {
  email?: boolean;
  message?: boolean;
}

/** Thank-you mode after the wedding (G075): auto = from 00:00 the day after the wedding (site time zone). */
export type ThankYouMode = 'auto' | 'on' | 'off';

/** After-the-wedding settings (G075, K28). Missing = automatic with the default title, no message, no photo. */
export interface ThankYou {
  mode?: ThankYouMode;
  /** Empty: "Thank you for celebrating with us". */
  title?: string | null;
  /** The couple's short message to guests (≤ 400 characters). */
  message?: string | null;
  /** Photo URL (/media/…); none = the design's own decoration (never a photo placeholder). */
  photo?: string | null;
  /** The Details page in thank-you mode: kept (as "The Day") or hidden. Missing = keep. */
  details?: 'keep' | 'hide';
}

/** One question and answer of the FAQ block (G051). */
export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentRecord {
  record_kind: RecordKind;
  event_type: EventType;
  locale: Locale;
  partners: Partner[];
  name_display?: string;
  initials: string;
  host_line?: string | null;
  /** ISO YYYY-MM-DD */
  date: string;
  ceremony_time?: string;
  /** IANA time zone, e.g. America/New_York */
  timezone: string;
  venue: Venue;
  schedule: ScheduleItem[];
  dress_code?: string | null;
  rsvp: { deadline: string; method?: RsvpMethod; required?: RsvpRequired; questions?: RsvpQuestion[] };
  urls: Partial<Record<UrlKey, string | null>>;
  media: {
    hero_portrait?: string | null;
    memory_photos?: string[];
    couple_clip?: string | null;
    venue_image?: string | null;
  };
  optional_blocks: Partial<
    Record<'our_story' | 'countdown' | 'dress_code' | 'registry' | 'travel_stay' | 'faq' | 'guest_policy', boolean>
  >;
  /** Optional Our Story texts; the photos come from the theme's photo slots. */
  story?: {
    intro?: string;
    items?: Array<{ caption: string; text?: string }>;
  };
  /** Optional questions & answers (shown while optional_blocks.faq is on). */
  faq?: FaqItem[];
  /** After the wedding (G075): thank-you mode settings. */
  thank_you?: ThankYou;
  /**
   * The couple's words for the design's fixed texts (G068): key → text; empty / null = the design's text. Keys, defaults
   * and the longest text each carries are in the theme's theme.json "copy" (lib/theme/copy.ts).
   */
  copy?: Record<string, string | null>;
}
