// G141 (K45 item 7): the copy of the interactive design showcase and the "how editing works" tour — ONE place, so the
// five languages (K45 item 3) translate it here, not inside components. Every tour step shows a REAL panel screen
// (lib/marketing/assets.json, captured from the current panel by scripts/marketing-assets.ts --panel) and says only
// what that screen does today: no promise of a feature that is not in the panel.

import { MARKETING } from './config.ts';
import type { PanelKey } from './designs.ts';
import { LIMITS } from './facts.ts';

export const SHOWCASE_COPY = {
  eyebrow: 'Designs',
  title: 'Choose the design your guests will open',
  hint: 'Hover or tap ▶ to watch a design open. Tick two or three to compare them side by side.',
  play: 'Watch it open',
  stop: 'Stop',
  liveDemo: 'Try the live demo',
  /** narrow cards (two columns on phones) */
  liveDemoShort: 'Live demo',
  compare: 'Compare',
  compareTray: (n: number) => (n === 1 ? 'Pick one more design to compare' : `Compare ${n} designs`),
  compareOpen: 'Compare side by side',
  compareClear: 'Clear',
  compareTitle: 'Compare designs',
  compareClose: 'Close the comparison',
  compareMax: 3,
  compareNote: 'Real screen recordings with demo content; the couples are fictional.',
  seeDesign: 'See this design',
  filterLegend: 'Show designs by style',
  filterAll: 'All',
} as const;

export const OPENINGS_COPY = {
  eyebrow: 'The first moment',
  title: 'Every design opens its own way',
  lead: 'Your guests tap a sealed envelope or keepsake and it opens into your website. Real recordings:',
  note: 'Guests can skip the animation; on a phone set to reduce motion, a tap goes straight to the home page.',
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
}

/** The editing tour, in the order a couple meets it: set up (3 steps) → Edit → music, map, RSVP → guests → share. */
export const EDIT_TOUR: readonly TourStep[] = [
  {
    screen: 'start',
    label: 'Start',
    title: 'Start with your order number',
    text: 'Your Etsy download holds the start link. Your names, an email and your website address: one short form.',
    alt: 'The start form on a phone: email, both first names and the website address, marked available',
  },
  {
    screen: 'editLink',
    label: 'Your link',
    title: 'Keep your private edit link',
    text: 'One link opens your editor on any phone or computer. No account and no password to remember.',
    alt: 'The "Save this link" screen with the private edit link (key hidden) and Copy link / Email it to myself',
  },
  {
    screen: 'panel',
    label: 'Home',
    title: 'Three setup steps, then publish',
    text: 'Your panel shows how ready your website is and what to fill in next.',
    alt: "The panel's home: the couple's names, a draft notice, Continue setup · Step 1 of 3 and a 20% ready bar",
  },
  {
    screen: 'editList',
    label: 'Edit',
    title: 'Edit page by page',
    text: 'Us, Day & place, Photos, Our Story, Details and RSVP. Changes save on their own.',
    alt: 'The Edit list: Us, Day & place, Photos, Our Story, Details and RSVP, each with a short summary',
  },
  {
    screen: 'crop',
    label: 'Photos',
    title: 'Crop each photo to its frame',
    text: `${LIMITS.photoSpots} photo spots. Drag and pinch on your phone until it sits right.`,
    alt: 'Cropping the portrait for the invitation card: the photo, a zoom slider and Use this photo',
  },
  {
    screen: 'music',
    label: 'Music',
    title: 'Pick the story music',
    text: 'A track suggested for your design, your own MP3, or no music. Soft sound effects can be switched off.',
    alt: 'Music & sound: a list of tracks with the suggested one selected, your own music, no music and Listen',
  },
  {
    screen: 'map',
    label: 'Map',
    title: 'Map and directions',
    text: 'Paste a map link or let guests search your venue. Add a second place for the reception.',
    alt: 'Map & directions: what the map searches for, Show map and Show directions switches and Add a reception place',
  },
  {
    screen: 'questions',
    label: 'RSVP',
    title: 'Ask your own questions',
    text: `Up to ${LIMITS.rsvpQuestions} questions, such as a meal choice. Set a reply-by date; the form closes after it.`,
    alt: 'RSVP questions: a Meal choice question with three choices — Chicken, Fish and Vegetarian',
  },
  {
    screen: 'excel',
    label: 'Guest list',
    title: 'Replies in one list, one tap to Excel',
    text: 'Every reply and the totals in your panel. Download Excel: it opens in Excel, Numbers or Google Sheets.',
    alt: 'The guest list with fictional replies and the Download Excel button',
  },
  {
    screen: 'preview',
    label: 'Preview',
    title: 'Preview, then publish',
    text: 'See every page the way guests will before anything goes live.',
    alt: 'The preview of the website on a phone: the invitation card with the names, the date and a countdown',
  },
  {
    screen: 'share',
    label: 'Share',
    title: 'Share your link',
    text: 'Copy it into a message or print the QR code on your paper cards.',
    alt: 'Share: the website link with Copy and Open, and the QR code for printed cards (blurred here)',
  },
];

export const TOUR_COPY = {
  eyebrow: 'Made to edit from your phone',
  title: 'See how editing works',
  lead: `No Canva, no app: real screens of the panel you get. Your website stays online until ${MARKETING.hosting.monthsAfterWedding} months after your wedding.`,
  prev: 'Previous step',
  next: 'Next step',
  pause: 'Pause the tour',
  play: 'Play the tour',
  stepsLabel: 'Editing steps',
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
  more: 'Everything you can edit',
} as const;

/** Design page: the strip of the design's real screens, then the panel screens that edit it. */
export const DESIGN_GALLERY_COPY = {
  title: (thing: string) => `Every screen, from the sealed ${thing} to RSVP`,
  designLabel: (name: string) => `${name}: every screen of the website`,
  screens: [
    { key: 'envelope', label: 'Sealed' },
    { key: 'home', label: 'Home' },
    { key: 'invitation', label: 'Invitation card' },
    { key: 'story', label: 'Our Story' },
    { key: 'details', label: 'Details' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'rsvp', label: 'RSVP' },
    { key: 'form', label: 'Reply form' },
  ] as const,
  panelTitle: 'Edited from your phone',
  panelNote: 'The same panel edits every design: real screens, demo content.',
  panel: ['editList', 'crop', 'music', 'map', 'questions', 'excel'] as const satisfies readonly PanelKey[],
  tourLink: 'See how editing works',
} as const;
