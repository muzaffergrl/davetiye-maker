// Descriptive copy of each design for the marketing site (G061). Commerce fields (price, Etsy link, status) live in
// config.ts; this file says what the design looks like and how it opens — written against the real theme behavior
// (platform/themes/<id>/README.md + the real screens in collections/<NN>/package/shots, docs/14 §6.3).
// Screens are REAL theme screenshots (demo content, fictional couple), never re-drawn or generated (K21, docs/14 §12).

import { MARKETING, type DesignCommerce, type MarketingConfig } from './config.ts';

/** Real screens used on the site: key -> source shot in collections/<NN>/package/shots (390 px, DPR 3). */
export const SCREEN_SOURCES = {
  envelope: 'g01_envelope',
  home: 'g02_home_top',
  invitation: 'g03_home_invitation',
  story: 'g05_story',
  details: 'g06_details_top',
  schedule: 'g07_details_schedule',
  rsvp: 'g09_rsvp_top',
  form: 'g10_rsvp_form',
} as const;
export type ScreenKey = keyof typeof SCREEN_SOURCES;

/** Panel screens (same for every design; current panel — retake after G060 panel v2, docs/14 §6). */
export const PANEL_SOURCES = {
  start: 'b02_start_form',
  editLink: 'b03_edit_link',
  panel: 'b04_panel_top',
  crop: 'b06_panel_crop',
  preview: 'b08_panel_preview',
  share: 'b10_live_qr',
  replies: 'p01_panel_replies',
  questions: 'p03_panel_questions',
} as const;
export type PanelKey = keyof typeof PANEL_SOURCES;
/** The collection whose panel shots are used (they show the same panel). */
export const PANEL_COLLECTION = '03_Blush_Garden_Rose';

export interface DesignCopy {
  id: string;
  /** collections/<folder> holding package/shots (G059 capture). */
  collection: string;
  /** Fictional demo couple shown on the screens. */
  demoCouple: string;
  /** One line under the name (cards, hero). */
  style: string;
  /** Meta description, 120–160 characters. */
  metaDescription: string;
  /** Hero sentence on the design page. */
  intro: string;
  /** "The opening", 2–3 sentences, matching the theme's real animation. */
  opening: string;
  /** Page-by-page captions under the four screens. */
  pages: Record<'home' | 'story' | 'details' | 'rsvp', string>;
  palette: Array<{ name: string; hex: string }>;
  fonts: string[];
  /** For llms.txt: one plain line. */
  llmsLine: string;
  /** Two related guides (slugs) — docs/14 §5.3. */
  relatedGuides: [string, string];
}

export const DESIGN_COPY: Record<string, DesignCopy> = {
  'blush-garden-rose': {
    id: 'blush-garden-rose',
    collection: '03_Blush_Garden_Rose',
    demoCouple: 'Clara & Julian',
    style: 'Blush pink envelope with a ribbon bow, peonies, garden roses and gold arched frames',
    metaDescription:
      'A blush envelope tied with a ribbon bow opens into your wedding website: peonies, garden roses and gold arched photo frames. Edit it on your phone.',
    intro:
      'A soft blush envelope tied with a wide ribbon bow, surrounded by painterly peonies and garden roses. Inside: arched cards, gold frames and a romantic script.',
    opening:
      'Your guests tap the envelope. The bow slides away, the flap lifts, and an arched card with your portrait rises out of the envelope and comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in an arched card, your names, date, venue and a live countdown, then the invitation card.',
      story: 'Three photos in gold arch frames, each with a caption.',
      details: 'An "Order of the Day" card, dress code, the venue photo in a gold frame, links and questions and answers.',
      rsvp: 'A floral reply card with your deadline, followed by the reply form.',
    },
    palette: [
      { name: 'Blush', hex: '#E3A9AE' },
      { name: 'Rose', hex: '#9B5D66' },
      { name: 'Ivory', hex: '#FFF9F6' },
      { name: 'Gold', hex: '#C8A46E' },
      { name: 'Sage', hex: '#9DAE93' },
    ],
    fonts: ['Great Vibes', 'Cormorant Garamond', 'Lora'],
    llmsLine: 'blush envelope tied with a ribbon bow; peonies, garden roses and gold arched photo frames.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'olive-ivory': {
    id: 'olive-ivory',
    collection: '01_Olive_Ivory',
    demoCouple: 'Avery & Jordan',
    style: 'Olive green envelope with an ivory lace edge, a wax seal with your initials and olive branches',
    metaDescription:
      'An olive envelope with a lace edge and a wax seal opens into your wedding website: olive branches, white roses and gold frames. Edit it on your phone.',
    intro:
      'An olive green envelope with an ivory lace edge, closed with a wax seal that carries your initials. Inside: olive branches, white roses, ivory cards and gold frames.',
    opening:
      'Your guests tap the envelope. The flap lifts together with the wax seal, a framed card with your portrait glides out of the envelope, two olive leaves drift across the screen, and the card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait card, your names, date, venue, a live countdown and an RSVP button, then the invitation card.',
      story: 'Three gold-framed photo cards fanned like a hand of cards; guests swipe through them on a phone.',
      details: 'An "Order of the Day" card, add to calendar, the venue photo in a gold frame, dress code, links and questions and answers.',
      rsvp: 'An ivory reply card with a wax seal, followed by the reply form.',
    },
    palette: [
      { name: 'Olive', hex: '#5E6B45' },
      { name: 'Leaf', hex: '#7D8B5A' },
      { name: 'Ivory', hex: '#FBF8F0' },
      { name: 'Linen', hex: '#EDE4D0' },
      { name: 'Gold', hex: '#B39A63' },
    ],
    fonts: ['Great Vibes', 'EB Garamond'],
    llmsLine: 'olive green envelope with an ivory lace edge and a wax seal with the couple\'s initials; olive branches, white roses and gold frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'how-to-make-a-wedding-website'],
  },
  // G082: written against themes/mediterranean-lemon/README.md (G405, approved) and its real screens (390 × 844 capture).
  'mediterranean-lemon': {
    id: 'mediterranean-lemon',
    collection: '05_Lemon_Mediterranean',
    demoCouple: 'Isabella & Marco',
    style: 'White envelope with a cobalt scalloped edge and a lemon tie, blue-and-white tile frames and lemon branches',
    metaDescription:
      'A white envelope tied with a lemon and a cobalt ribbon opens into your wedding website: blue-and-white tiles and lemon branches. Edit it on your phone.',
    intro:
      'A white envelope with a cobalt blue scalloped edge, tied with a lemon on a blue ribbon, on a sunlit plaster wall with lemon branches. Inside: blue-and-white tile frames, scalloped cards and a flowing script.',
    opening:
      'Your guests tap the envelope. The lemon tie slips loose and rolls off the screen, the flap lifts to show a blue-and-white tile lining, and a card with your portrait rises out of the envelope while a lemon branch sways in from the corner and a blossom drifts down. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a tile-framed card, your names, date, venue, a live countdown and an RSVP button, then the invitation card and two tile panels that lead to Our Story and Details.',
      story: 'Three photos in blue-and-white tile frames, one under the other; each turns into place as guests scroll, with a caption under it.',
      details: 'An "Order of the Day" card, add to calendar, the venue photo in a tile frame, dress code, links and questions and answers.',
      rsvp: 'A scalloped reply card with your reply-by date and a lemon tie, followed by the reply form.',
    },
    palette: [
      { name: 'Cobalt', hex: '#2A5DA8' },
      { name: 'Lemon', hex: '#F2C94C' },
      { name: 'Sky', hex: '#DCE6F2' },
      { name: 'Ivory', hex: '#FFFDF7' },
      { name: 'Navy', hex: '#1F3557' },
    ],
    fonts: ['Allura', 'Playfair Display'],
    llmsLine: 'white envelope with a cobalt scalloped edge, tied with a lemon on a blue ribbon; blue-and-white tile frames, lemon branches and a sunlit plaster wall.',
    relatedGuides: ['digital-wedding-invitation-etiquette', 'what-to-put-on-your-wedding-website'],
  },
  // G083: written against themes/dusty-blue-champagne/README.md (G402, approved), the catalogue's opening line
  // (docs/09 WEB 02) and its real screens and opening frames (390 × 844 capture).
  'dusty-blue-champagne': {
    id: 'dusty-blue-champagne',
    collection: '02_Dusty_Blue',
    demoCouple: 'Eleanor & Theo',
    style: 'Ivory envelope with a champagne gold edge and a dusty blue wax seal, cream roses, eucalyptus and instant-photo cards',
    metaDescription:
      'An ivory envelope sealed with dusty blue wax opens into your wedding website: cream roses, eucalyptus and champagne gold ferns. Edit it on your phone.',
    intro:
      'An ivory envelope with a champagne gold edge and a dusty blue wax seal that carries your initials, among cream roses, eucalyptus and gold ferns. Inside: instant-photo cards, a floral invitation card and an elegant script.',
    opening:
      'Your guests tap the envelope. The dusty blue wax seal breaks off and spins down off the screen, the flap lifts to show a blue and gold damask lining, and a card with your portrait rises out of the envelope while a single eucalyptus leaf drifts down beside it. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a slightly tilted instant-photo card, your names, date, venue, a live countdown and an RSVP button, then the floral invitation card.',
      story: "Three instant-photo prints fly in one after another and settle at gentle angles, each with its caption written in the print's margin.",
      details: 'An "Order of the Day" card, the venue photo as a tilted print, dress code, add to calendar, links and questions and answers.',
      rsvp: 'A reply card with your reply-by date and a dusty blue wax seal pressed on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Dusty Blue', hex: '#4E6782' },
      { name: 'Powder Blue', hex: '#CCDCEC' },
      { name: 'Ivory', hex: '#FBF7EF' },
      { name: 'Champagne', hex: '#B8996A' },
      { name: 'Navy', hex: '#2B3A4E' },
    ],
    fonts: ['Pinyon Script', 'Cormorant Garamond'],
    llmsLine: "ivory envelope with a champagne gold edge and a dusty blue wax seal with the couple's initials; cream roses, eucalyptus, baby's breath and instant-photo cards on dusty blue paper.",
    relatedGuides: ['wedding-website-wording', 'when-to-send-your-wedding-website'],
  },
  // G085: written against themes/vintage-airmail-love-letter/README.md (G404, approved), the catalogue's opening line
  // (docs/09 WEB 04) and its real screens and opening frames (390 × 844 capture).
  'vintage-airmail-love-letter': {
    id: 'vintage-airmail-love-letter',
    collection: '04_Vintage_Airmail',
    demoCouple: 'Margot & Henry',
    style: 'Red and navy striped airmail envelope with a burgundy wax seal, postage stamps, postmarks and pressed flowers',
    metaDescription:
      'A striped airmail envelope sealed with burgundy wax opens into your wedding website: postage stamps, postmarks and pressed flowers. Edit it on your phone.',
    intro:
      'A vintage airmail envelope with red and navy striped edges and a perforated tear strip, closed with a burgundy wax seal that carries your initials, among postage stamps, pressed flowers and twine. Inside: airmail letter cards, stamp-edged photo frames, a fountain-pen script and typewriter lettering.',
    opening:
      'Your guests tap the envelope. The little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and a cream card with your portrait slides up out of the envelope while a pressed forget-me-not flutters down beside it. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on an airmail-striped card, your names, date, venue, a live countdown and an RSVP button, then the invitation letter and a stamp, a letter and a wax seal that lead to the other pages.',
      story: 'Three photos in postage-stamp frames drop onto a wooden writing desk one by one; the first gets a postmark, and each has a handwritten caption.',
      details: 'An "Order of the Day" letter with airmail stripes, add to calendar, the venue photo in a stamp-edged frame, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" letter with your reply-by date, signed with your names and sealed with burgundy wax and lavender, followed by the reply form.',
    },
    palette: [
      { name: 'Airmail Red', hex: '#B5483E' },
      { name: 'Navy', hex: '#2B3753' },
      { name: 'Parchment', hex: '#E2CBAD' },
      { name: 'Cream', hex: '#F6ECDA' },
      { name: 'Ink', hex: '#4A1F1C' },
    ],
    fonts: ['Homemade Apple', 'Special Elite'],
    llmsLine: "red and navy striped airmail envelope with a perforated tear strip and a burgundy wax seal with the couple's initials; postage stamps, postmarks, pressed flowers and airmail letter cards.",
    relatedGuides: ['digital-wedding-invitation-etiquette', 'canva-wedding-website-template-vs-hosted-website'],
  },
};

export interface Design extends DesignCommerce {
  copy: DesignCopy;
}

/** Live designs in config order, with their copy. Designs with status 'coming' are never returned. */
export function liveDesigns(cfg: MarketingConfig = MARKETING): Design[] {
  return cfg.designs
    .filter((d) => d.status === 'live')
    .map((d) => {
      const copy = DESIGN_COPY[d.id];
      if (!copy) throw new Error(`lib/marketing/designs.ts has no copy for live design "${d.id}"`);
      return { ...d, copy };
    });
}

export function liveDesign(id: string, cfg: MarketingConfig = MARKETING): Design | null {
  return liveDesigns(cfg).find((d) => d.id === id) ?? null;
}

/** /start/demo/<id>: the theme's own live demo (fictional content), same origin (frame-ancestors 'self'). */
export function demoPath(id: string): string {
  return `/start/demo/${encodeURIComponent(id)}`;
}

/** /start?theme=<id>: where a buyer starts the website after buying. */
export function startPath(id?: string): string {
  return id ? `/start?theme=${encodeURIComponent(id)}` : '/start';
}

/** The theme's own share image (real theme parts, served by the theme asset route). */
export function designOgImage(id: string): string {
  return `/themes/${encodeURIComponent(id)}/img/og-1200x630.jpg`;
}
