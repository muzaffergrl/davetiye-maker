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
import { enT, msg, type T } from './i18n.ts';
import { siteHost } from './site.ts';

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

/** The four pages after the opening, in order. `short` = the 2-line card caption on the home page (G066). */
export const SITE_PAGES = [
  { key: 'home', name: msg('Home'), short: msg('Your names, date and venue'), summary: msg('Your names, the date and venue, an optional countdown and your invitation card with add to calendar.') },
  { key: 'story', name: msg('Our Story'), short: msg('Three photos with captions'), summary: msg('Three photos with captions and a short intro line, in the frames of the design.') },
  { key: 'details', name: msg('Details'), short: msg('Schedule, venue and dress code'), summary: msg('The order of the day, venue photo and map link, dress code, travel and registry links, and your questions and answers.') },
  { key: 'rsvp', name: msg('RSVP'), short: msg('Replies and your own questions'), summary: msg('A reply form with your deadline and questions of your own. Replies go straight to your panel.') },
] as const;

/** "Home, Our Story, Details, RSVP" in the page language. */
export function sitePageNames(t: T = enT): string {
  return SITE_PAGES.map((p) => t(p.name)).join(', ');
}

/**
 * The totals of the DEMO replies panel (panel screen `replies`, retaken in G066-B with the G069 Guests view: tiles
 * "9 Guests coming · 1 Not coming · 5 Replies", fictional guests). The home page shows them as an example, labelled as
 * such — never as our numbers. Retake together with the panel screens (scripts/marketing-assets.ts) when the view changes.
 */
export const DEMO_REPLY_TOTALS = { coming: 9, notComing: 1, replies: 5 } as const;

/**
 * The panel's own words for the replies download (Guests view, components/panel/guests.tsx since G069/G066: a button
 * "Download list" that saves a CSV, one row per person). Copy that names the button uses this label, never the name of
 * the old G042 RSVP section's button; tests/g080-copy.test.ts checks it against the panel.
 */
export const PANEL_REPLIES_DOWNLOAD = 'Download Excel';

/** Alt text of the panel `replies` screen (home page): what the picture shows, with the button's real label. */
export const REPLIES_SCREEN_ALT = `Replies in the couple's panel: totals, each reply and a "${PANEL_REPLIES_DOWNLOAD}" button (Excel)`;

/**
 * What one purchase includes (pricing, design pages, llms.txt). G154: the features of G126 (music), G127 (map), G139
 * (downloads), G144 (five languages) and G146 (order number + email on any device) are here; none of them depends on an
 * email being sent (G147/G152 email only works once the shop turns it on, so it is never promised).
 */
export function included(cfg: MarketingConfig = MARKETING, t: T = enT): string[] {
  return [
    t('An opening page (an envelope or keepsake that opens) and four pages: Home, Our Story, Details and RSVP'),
    t('A private editing panel designed for phone screens, with a preview before you publish'),
    t('Your Etsy order number and email open your editor on any phone or computer: no account, no password'),
    t('Online RSVP: replies, head counts and an Excel or CSV download in your panel'),
    t('Up to {n} RSVP questions of your own, such as a meal choice', { n: LIMITS.rsvpQuestions }),
    t('Add to calendar for guests (Apple/Outlook and Google Calendar)'),
    t('{n} photo spots with cropping', { n: LIMITS.photoSpots }),
    t('Optional countdown, dress code, registry and travel links, and questions and answers'),
    t('A map of your venue and directions with Google Maps, Apple Maps or Waze'),
    t('Music on your Our Story page (a track made for your website, or your own file) and sound effects; you can turn each off'),
    t('Your website in English, Spanish, French, German or Turkish, or in several: built-in texts come translated, and your own texts can be translated automatically as a draft you check'),
    t('A link preview with your names and date when you share your link'),
    t('A QR code to download as PNG or SVG'),
    t('Downloads: your website as a PDF, and a printable invitation in your design (5 × 7 in or A5, with bleed and crop marks for a print shop)'),
    t('An optional guest password, so only people you give it to can open your website'),
    t('After the wedding, your website can turn into a thank-you page for your guests (automatic, or switch it off)'),
    t('Your website stays online until {months} months after your wedding date', { months: cfg.hosting.monthsAfterWedding }),
  ];
}

/** What is not included — said plainly so nobody (and no assistant) assumes it. */
export const NOT_INCLUDED: readonly string[] = [
  msg('A custom domain (your address is on our domain)'),
  msg('Changing the colors, fonts or layout of a design'),
  msg('Sending invitations to guests by email'),
  msg('Guest list import'),
  msg('Built-in texts in languages other than English, Spanish, French, German and Turkish (your own texts can be in any language)'),
  msg('Printing and shipping: you print the printable invitation yourself or at a print shop'),
  msg('A matching save the date (not yet)'),
];

/** What the couple can change in the panel (design pages, features). */
export const EDITABLE: readonly string[] = editable();

/** EDITABLE in the page language. */
export function editable(t: T = enT): string[] {
  return [
    t('Your names, how they appear together, and a monogram where the design shows one'),
    t('Wedding date, ceremony time and time zone; US, UK, Canadian or Australian date style'),
    t('Venue name, address and a map link'),
    t('The order of the day (up to {n} rows)', { n: LIMITS.scheduleRows }),
    t('Your story: an intro line and photo captions'),
    t('Music for your Our Story page: a track made for your website, your own file or none'),
    t('{n} photos: a portrait, {story} story photos and the venue, each cropped to its frame', { n: LIMITS.photoSpots, story: LIMITS.storyPhotos }),
    t('Questions and answers for guests (up to {n})', { n: LIMITS.faqItems }),
    t('RSVP deadline and up to {n} questions of your own', { n: LIMITS.rsvpQuestions }),
    t('Which optional sections show: Our Story, countdown, dress code, registry, travel and stay, questions and answers'),
    t("The design's headings, labels and buttons, in your own words"),
    t("Your website's languages: English, Spanish, French, German or Turkish"),
  ];
}

/** What stays as designed. */
export const FIXED: readonly string[] = [msg('The artwork'), msg('Colors and fonts'), msg('Page layout and the opening animation')];
/** FIXED as one sentence (/designs): its own key, since the list labels start with a capital (review 2026-10-23). */
export const FIXED_SENTENCE = msg('The artwork, colors and fonts, page layout and opening animation stay as designed; you change the content.');

/** docs/16 §11.7 wording, from config. */
export function editRightsText(cfg: MarketingConfig = MARKETING, t: T = enT): { short: string; long: string; rest: string } {
  // G060-fix: the same rule the server enforces (lib/panel/rights.ts): n changes IN TOTAL (several fields in one save
  // count once); typo fixes in a name, surnames and date moves of up to dateFreeDays are free.
  const n = cfg.editRights.identityChangesAfterPublish;
  const chars = cfg.editRights.typoFreeChars;
  const days = cfg.editRights.dateFreeDays;
  return {
    short:
      n === 1
        ? t('After publishing: 1 name and date change in total; typo fixes and moving the date by up to {days} days are free.', { days })
        : t('After publishing: {n} name and date changes in total; typo fixes and moving the date by up to {days} days are free.', { n, days }),
    long:
      n === 1
        ? t('After you publish, you get 1 change in total to your names, monogram and date; several at once count as one. Free any time: small typo fixes (up to {chars} letters in a name), adding a surname, and moving the date up to {days} days.', { chars, days })
        : t('After you publish, you get {n} changes in total to your names, monogram and date; several at once count as one. Free any time: small typo fixes (up to {chars} letters in a name), adding a surname, and moving the date up to {days} days.', { n, chars, days }),
    rest: t('Everything else (time, venue, schedule, story, photos, details and replies) you can change as often as you like.'),
  };
}

export function hostingText(cfg: MarketingConfig = MARKETING, t: T = enT): string {
  return t('Online until {months} months after your wedding date', { months: cfg.hosting.monthsAfterWedding });
}

/** Device wording: honest until a real-device test (docs/14 §4.5). */
export function phoneClaim(cfg: MarketingConfig = MARKETING, t: T = enT): string {
  return cfg.verified.realDevices ? t('Tested on iPhone and Android phones') : t('Designed for phone screens');
}

/** The truthful one-line strip under the home hero (docs/14 §6.1). */
export function factStrip(cfg: MarketingConfig = MARKETING, t: T = enT): string[] {
  return [t('RSVP built in'), t('Add to calendar'), t('No Canva needed'), hostingText(cfg, t)];
}

/** "Canva template vs us" rows (docs/14 §6.5): only true rows, no competitor names. */
export function canvaComparison(cfg: MarketingConfig = MARKETING, t: T = enT): Array<{ label: string; canva: string; ours: string }> {
  return [
    { label: t('Where you edit'), canva: t('The Canva editor'), ours: t('A simple panel designed for phone screens') },
    { label: t('Account needed'), canva: t('A Canva account'), ours: t('None: your Etsy order number and email open your editor') },
    { label: t('RSVP'), canva: t('A separate form tool, set up by you'), ours: t('Built in; replies and an Excel download in your panel') },
    // G154: the host the site really runs on (siteHost), never the "[DOMAIN]" placeholder
    { label: t('Your link'), canva: t("Canva's free site address (custom domain on a paid Canva plan)"), ours: t('{domain}/your-names', { domain: siteHost(cfg) }) },
    { label: t('Changing the design'), canva: t('Full freedom to move and restyle everything'), ours: t('The design stays as made; you change the content and the wording') },
  ];
}

/** The two definition texts (docs/14 §4.6), from config. */
export function definition(cfg: MarketingConfig = MARKETING, t: T = enT): { short: string; long: string } {
  const b = cfg.brand.name;
  return {
    short: t(cfg.brand.shortDescription),
    long: t(
      '{brand} is a wedding website you buy once on Etsy. Your guests tap a sealed envelope or keepsake that opens into your site: Home, Our Story, Details and RSVP. You edit names, date, venue, schedule, photos and RSVP questions from your phone, preview, and publish. Guest replies appear in your private panel and can be downloaded as an Excel file. No Canva account or app is needed, and your website stays online until {months} months after your wedding date.',
      { brand: b, months: cfg.hosting.monthsAfterWedding },
    ),
  };
}
