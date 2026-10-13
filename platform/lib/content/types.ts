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
  /** "choice": pick one of `options` (at least 2); "text": a short written answer (no options). */
  type: 'choice' | 'text';
  options?: string[];
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
  rsvp: { deadline: string; method?: RsvpMethod; questions?: RsvpQuestion[] };
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
}
