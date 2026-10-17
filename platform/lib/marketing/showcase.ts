// G141 (K45 item 7): the copy of the interactive design showcase and the "how editing works" tour — ONE place, so the
// five languages (K45 item 3) translate it here, not inside components. G144: every text is marked with msg() and
// translated where it is shown (t(text)); client components get it already translated (compareCopy, tourCopy). Every tour step shows a REAL panel screen
// (lib/marketing/assets.json, captured from the current panel by scripts/marketing-assets.ts --panel) and says only
// what that screen does today: no promise of a feature that is not in the panel.

import { MARKETING } from './config.ts';
import type { PanelKey } from './designs.ts';
import { LIMITS } from './facts.ts';
import { enT, msg, type T, type Vars } from './i18n.ts';

export const SHOWCASE_COPY = {
  eyebrow: msg('Designs'),
  title: msg('Choose the design your guests will open'),
  hint: msg('Hover or tap ▶ to watch a design open. Tick two or three to compare them side by side.'),
  play: msg('Watch it open'),
  stop: msg('Stop'),
  liveDemo: msg('Try the live demo'),
  /** narrow cards (two columns on phones) */
  liveDemoShort: msg('Live demo'),
  compare: msg('Compare'),
  compareTrayOne: msg('Pick one more design to compare'),
  compareTrayMany: msg('Compare {n} designs'),
  replay: msg('Replay the openings'),
  compareOpen: msg('Compare side by side'),
  compareClear: msg('Clear'),
  compareTitle: msg('Compare designs'),
  compareClose: msg('Close the comparison'),
  compareMax: 3,
  compareNote: msg('Real screen recordings with demo content; the couples are fictional.'),
  seeDesign: msg('See this design'),
  filterLegend: msg('Show designs by style'),
  filterAll: msg('All'),
} as const;

export const OPENINGS_COPY = {
  eyebrow: msg('The first moment'),
  title: msg('Every design opens its own way'),
  lead: msg('Your guests tap a sealed envelope or keepsake and it opens into your website. Real recordings:'),
  note: msg('Guests can skip the animation; on a phone set to reduce motion, a tap goes straight to the home page.'),
} as const;

export interface TourStep {
  /** The real panel screen of this step. */
  screen: PanelKey;
  /** Short label on the step button. */
  label: string;
  title: string;
  text: string;
  /** Screen alt text (what the picture shows). */
  alt: string;
  /** Values of the {placeholders} in `text`. */
  vars?: Vars;
}

/** The editing tour, in the order a couple meets it: set up (3 steps) → Edit → music, map, RSVP → guests → share. */
export const EDIT_TOUR: readonly TourStep[] = [
  {
    screen: 'start',
    label: msg('Start'),
    title: msg('Start with your order number'),
    text: msg('Your Etsy download holds the start link. Your names, an email and your website address: one short form.'),
    alt: msg('The start form on a phone: email, both first names and the website address, marked available'),
  },
  {
    screen: 'editLink',
    label: msg('Your link'),
    title: msg('Keep your private edit link'),
    text: msg('One link opens your editor on any phone or computer. No account and no password to remember.'),
    alt: msg('The "Save this link" screen with the private edit link (key hidden) and Copy link / Email it to myself'),
  },
  {
    screen: 'panel',
    label: msg('Home'),
    title: msg('Three setup steps, then publish'),
    text: msg('Your panel shows how ready your website is and what to fill in next.'),
    alt: msg("The panel's home: the couple's names, a draft notice, Continue setup · Step 1 of 3 and a 20% ready bar"),
  },
  {
    screen: 'editList',
    label: msg('Edit'),
    title: msg('Edit page by page'),
    text: msg('Us, Day & place, Photos, Our Story, Details and RSVP. Changes save on their own.'),
    alt: msg('The Edit list: Us, Day & place, Photos, Our Story, Details and RSVP, each with a short summary'),
  },
  {
    screen: 'crop',
    label: msg('Photos'),
    title: msg('Crop each photo to its frame'),
    text: msg('{n} photo spots. Drag and pinch on your phone until it sits right.'),
    vars: { n: LIMITS.photoSpots },
    alt: msg('Cropping the portrait for the invitation card: the photo, a zoom slider and Use this photo'),
  },
  {
    screen: 'music',
    label: msg('Music'),
    title: msg('Pick the story music'),
    text: msg('A track suggested for your design, your own MP3, or no music. Soft sound effects can be switched off.'),
    alt: msg('Music & sound: a list of tracks with the suggested one selected, your own music, no music and Listen'),
  },
  {
    screen: 'map',
    label: msg('Map'),
    title: msg('Map and directions'),
    text: msg('Paste a map link or let guests search your venue. Add a second place for the reception.'),
    alt: msg('Map & directions: what the map searches for, Show map and Show directions switches and Add a reception place'),
  },
  {
    screen: 'questions',
    label: msg('RSVP'),
    title: msg('Ask your own questions'),
    text: msg('Up to {n} questions, such as a meal choice. Set a reply-by date; the form closes after it.'),
    vars: { n: LIMITS.rsvpQuestions },
    alt: msg('RSVP questions: a Meal choice question with three choices — Chicken, Fish and Vegetarian'),
  },
  {
    screen: 'excel',
    label: msg('Guest list'),
    title: msg('Replies in one list, one tap to Excel'),
    text: msg('Every reply and the totals in your panel. Download Excel: it opens in Excel, Numbers or Google Sheets.'),
    alt: msg('The guest list with fictional replies and the Download Excel button'),
  },
  {
    screen: 'preview',
    label: msg('Preview'),
    title: msg('Preview, then publish'),
    text: msg('See every page the way guests will before anything goes live.'),
    alt: msg('The preview of the website on a phone: the invitation card with the names, the date and a countdown'),
  },
  {
    screen: 'share',
    label: msg('Share'),
    title: msg('Share your link'),
    text: msg('Copy it into a message or print the QR code on your paper cards.'),
    alt: msg('Share: the website link with Copy and Open, and the QR code for printed cards (blurred here)'),
  },
];

export const TOUR_COPY = {
  eyebrow: msg('Made to edit from your phone'),
  title: msg('See how editing works'),
  /** {months}: MARKETING.hosting.monthsAfterWedding (tourLead) */
  lead: msg('No Canva, no app: real screens of the panel you get. Your website stays online until {months} months after your wedding.'),
  prev: msg('Previous step'),
  next: msg('Next step'),
  pause: msg('Pause the tour'),
  play: msg('Play the tour'),
  stepsLabel: msg('Editing steps'),
  stepOf: msg('Step {i} of {n}'),
  more: msg('Everything you can edit'),
} as const;

/** Design page: the strip of the design's real screens, then the panel screens that edit it. */
export const DESIGN_GALLERY_COPY = {
  title: msg('Every screen, from the sealed {thing} to RSVP'),
  designLabel: msg('{name}: every screen of the website'),
  screens: [
    { key: 'envelope', label: msg('Sealed') },
    { key: 'home', label: msg('Home') },
    { key: 'invitation', label: msg('Invitation card') },
    { key: 'story', label: msg('Our Story') },
    { key: 'details', label: msg('Details') },
    { key: 'schedule', label: msg('Schedule') },
    { key: 'rsvp', label: msg('RSVP') },
    { key: 'form', label: msg('Reply form') },
  ] as const,
  panelTitle: msg('Edited from your phone'),
  panelNote: msg('The same panel edits every design: real screens, demo content.'),
  panel: ['editList', 'crop', 'music', 'map', 'questions', 'excel'] as const satisfies readonly PanelKey[],
  tourLink: msg('See how editing works'),
} as const;

/** The tour's intro line in the page language. */
export function tourLead(t: T = enT): string {
  return t(TOUR_COPY.lead, { months: MARKETING.hosting.monthsAfterWedding });
}

/** The strings of the compare host (a client component), translated on the server. */
export type CompareCopy = Record<
  | 'compareTrayOne'
  | 'compareTrayMany'
  | 'compareOpen'
  | 'compareClear'
  | 'compareTitle'
  | 'compareClose'
  | 'compareNote'
  | 'liveDemo'
  | 'seeDesign'
  | 'replay'
  | 'recording',
  string
>;

export function compareCopy(t: T = enT): CompareCopy {
  const C = SHOWCASE_COPY;
  return {
    compareTrayOne: t(C.compareTrayOne),
    compareTrayMany: t(C.compareTrayMany),
    compareOpen: t(C.compareOpen),
    compareClear: t(C.compareClear),
    compareTitle: t(C.compareTitle),
    compareClose: t(C.compareClose),
    compareNote: t(C.compareNote),
    liveDemo: t(C.liveDemo),
    seeDesign: t(C.seeDesign),
    replay: t(C.replay),
    // {name} {thing}: filled in the browser
    recording: t('Screen recording: the {name} {thing} opens'),
  };
}

/** The strings of the editing tour (a client component), translated on the server. */
export type TourCopy = Record<'prev' | 'next' | 'pause' | 'play' | 'stepsLabel' | 'stepOf', string>;

export function tourCopy(t: T = enT): TourCopy {
  const T = TOUR_COPY;
  return { prev: t(T.prev), next: t(T.next), pause: t(T.pause), play: t(T.play), stepsLabel: t(T.stepsLabel), stepOf: t(T.stepOf) };
}

/** Play / stop of a design card's opening (a client component). */
export type CardCopy = { play: string; stop: string };
