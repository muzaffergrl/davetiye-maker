// What the product does and does not do, in the words the marketing site uses (docs/14 §4.3–§4.6). Features, FAQ,
// design pages, pricing and llms.txt all read these lists, so a claim is changed in one place. Numbers come from the
// content schema limits (lib/content/limits.ts) — the same limits the panel enforces.
//
// Rules (docs/14 §4.4–§4.5): no "best", "faster", "unlimited", "forever", "app", "AI-powered", "hand-painted",
// "subscription"/"hosting plan" for what we sell; device claims stay "Designed for phone screens" until a real-device
// test (config.verified.realDevices); "edit link sent by email" and "we verify your Etsy order" are NOT true and never
// written.

import { CONTENT_LIMITS } from '../content/limits.ts';
import { MARKETING, type MarketingConfig } from './config.ts';

export const LIMITS = {
  pages: 4,
  photoSpots: 5,
  storyPhotos: 3,
  scheduleRows: CONTENT_LIMITS.scheduleItems,
  faqItems: CONTENT_LIMITS.faqItems,
  rsvpQuestions: CONTENT_LIMITS.rsvpQuestions,
  questionOptions: CONTENT_LIMITS.questionOptions,
  nameChars: CONTENT_LIMITS.name,
  venueChars: CONTENT_LIMITS.venueName,
  storyIntroChars: 200,
  storyCaptionChars: 60,
} as const;

/** The four pages after the envelope, in order. `short` = the 2-line card caption on the home page (G066). */
export const SITE_PAGES = [
  { key: 'home', name: 'Home', short: 'Your names, date and venue', summary: 'Your names, the date and venue, an optional countdown and your invitation card with add to calendar.' },
  { key: 'story', name: 'Our Story', short: 'Three photos with captions', summary: 'Three photos with captions and a short intro line, in the frames of the design.' },
  { key: 'details', name: 'Details', short: 'Schedule, venue and dress code', summary: 'The order of the day, venue photo and map link, dress code, travel and registry links, and your questions and answers.' },
  { key: 'rsvp', name: 'RSVP', short: 'Replies and your own questions', summary: 'A reply form with your deadline and up to three questions of your own. Replies go straight to your panel.' },
] as const;

/**
 * The totals of the DEMO replies panel (panel screen `replies`, retaken in G066-B with the G069 Guests view: tiles
 * "9 Guests coming · 1 Not coming · 5 Replies", fictional guests). The home page shows them as an example, labelled as
 * such — never as our numbers. Retake together with the panel screens (scripts/marketing-assets.ts) when the view changes.
 */
export const DEMO_REPLY_TOTALS = { coming: 9, notComing: 1, replies: 5 } as const;

/** What one purchase includes (pricing, design pages, llms.txt). */
export function included(cfg: MarketingConfig = MARKETING): string[] {
  return [
    'An envelope opening page and four pages: Home, Our Story, Details and RSVP',
    'A private editing panel designed for phone screens, with a preview before you publish',
    'Online RSVP: replies, head counts and a CSV download in your panel',
    `Up to ${LIMITS.rsvpQuestions} RSVP questions of your own, such as a meal choice`,
    'Add to calendar for guests (Apple/Outlook and Google Calendar)',
    `${LIMITS.photoSpots} photo spots with cropping`,
    'Optional countdown, dress code, registry and travel links, and questions and answers',
    'A link preview with your names and date when you share your link',
    'A QR code to download as PNG or SVG',
    `Your website stays online until ${cfg.hosting.monthsAfterWedding} months after your wedding date`,
  ];
}

/** What is not included — said plainly so nobody (and no assistant) assumes it. */
export const NOT_INCLUDED: readonly string[] = [
  'A custom domain (your address is on our domain)',
  'Music',
  'Changing the colors, fonts or layout of a design',
  'Password protection',
  'Sending invitations to guests by email',
  'Guest list import',
  'Languages other than English',
  'Printed invitations',
  'A matching save the date (not yet)',
];

/** What the couple can change in the panel (design pages, features). */
export const EDITABLE: readonly string[] = [
  'Your names, how they appear together, and a monogram where the design shows one',
  'Wedding date, ceremony time and time zone; US, UK, Canadian or Australian date style',
  'Venue name, address and a map link',
  `The order of the day (up to ${LIMITS.scheduleRows} rows)`,
  'Your story: an intro line and photo captions',
  `${LIMITS.photoSpots} photos: a portrait, ${LIMITS.storyPhotos} story photos and the venue, each cropped to its frame`,
  `Questions and answers for guests (up to ${LIMITS.faqItems})`,
  `RSVP deadline and up to ${LIMITS.rsvpQuestions} questions of your own`,
  'Which optional sections show: Our Story, countdown, dress code, registry, travel and stay, questions and answers',
];

/** What stays as designed. */
export const FIXED: readonly string[] = ['The artwork', 'Colors and fonts', 'Page layout and the opening animation'];

/** docs/16 §11.7 wording, from config. */
export function editRightsText(cfg: MarketingConfig = MARKETING): { short: string; long: string; rest: string } {
  // G060-fix: the same rule the server enforces (lib/panel/rights.ts): n changes IN TOTAL (several fields in one save
  // count once); typo fixes in a name, surnames and date moves of up to dateFreeDays are free.
  const n = cfg.editRights.identityChangesAfterPublish;
  const chars = cfg.editRights.typoFreeChars;
  const days = cfg.editRights.dateFreeDays;
  const changes = n === 1 ? '1 change' : `${n} changes`;
  return {
    short: `After publishing: ${n === 1 ? '1 name and date change' : `${n} name and date changes`} in total; typo fixes and moving the date by up to ${days} days are free.`,
    long: `After you publish, you get ${changes} in total to your names, monogram and date; several at once count as one. Free any time: small typo fixes (up to ${chars} letters in a name), adding a surname, and moving the date up to ${days} days.`,
    rest: 'Everything else (time, venue, schedule, story, photos, details and replies) you can change as often as you like.',
  };
}

export function hostingText(cfg: MarketingConfig = MARKETING): string {
  return `Online until ${cfg.hosting.monthsAfterWedding} months after your wedding date`;
}

/** Device wording: honest until a real-device test (docs/14 §4.5). */
export function phoneClaim(cfg: MarketingConfig = MARKETING): string {
  return cfg.verified.realDevices ? 'Tested on iPhone and Android phones' : 'Designed for phone screens';
}

/** The truthful one-line strip under the home hero (docs/14 §6.1). */
export function factStrip(cfg: MarketingConfig = MARKETING): string[] {
  return ['RSVP built in', 'Add to calendar', 'No Canva needed', hostingText(cfg)];
}

/** "Canva template vs us" rows (docs/14 §6.5): only true rows, no competitor names. */
export function canvaComparison(cfg: MarketingConfig = MARKETING): Array<{ label: string; canva: string; ours: string }> {
  return [
    { label: 'Where you edit', canva: 'The Canva editor', ours: 'A simple panel designed for phone screens' },
    { label: 'Account needed', canva: 'A Canva account', ours: 'None: you keep a private edit link' },
    { label: 'RSVP', canva: 'A separate form tool, set up by you', ours: 'Built in; replies and CSV in your panel' },
    { label: 'Your link', canva: "Canva's free site address (custom domain on a paid Canva plan)", ours: `${cfg.domain}/your-names` },
    { label: 'Changing the design', canva: 'Full freedom to move and restyle everything', ours: 'The design stays as made; you change the content' },
  ];
}

/** The two definition texts (docs/14 §4.6), from config. */
export function definition(cfg: MarketingConfig = MARKETING): { short: string; long: string } {
  const b = cfg.brand.name;
  return {
    short: cfg.brand.shortDescription,
    long:
      `${b} is a wedding website you buy once on Etsy. Your guests tap a sealed envelope that opens into your site: ` +
      'Home, Our Story, Details and RSVP. You edit names, date, venue, schedule, photos and RSVP questions from your ' +
      'phone, preview, and publish. Guest replies appear in your private panel and can be downloaded as a CSV. No Canva ' +
      `account or app is needed, and your website stays online until ${cfg.hosting.monthsAfterWedding} months after your wedding date.`,
  };
}
