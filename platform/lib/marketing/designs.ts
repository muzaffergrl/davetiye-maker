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
  // G093: written against themes/art-deco-black-tie/README.md (G406, approved), the catalogue's opening line
  // (docs/09 WEB 06) and its real screens and opening frames (390 × 844 capture).
  'art-deco-black-tie': {
    id: 'art-deco-black-tie',
    collection: '06_Art_Deco_Noir',
    demoCouple: 'Vivian & Charles',
    style: 'Navy two-door gatefold with a gold art deco medallion, gold fan rays, pearls and stepped deco arch frames',
    metaDescription:
      'A navy gatefold with a gold medallion clasp opens like ballroom doors into your wedding website: gold rays and art deco arches. Edit it on your phone.',
    intro:
      'A 1920s ballroom in navy velvet: thin gold rays fan out from the top, gold deco corners with pearls and a champagne coupe frame a two-door navy gatefold, closed with a gold medallion clasp around a pearl. Inside: stepped deco arch frames, navy cards with gold borders and tall deco capitals.',
    opening:
      'Your guests tap the gatefold. The gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors to show their fan-patterned insides, and a card with your portrait rises from the center pocket as a thin band of gold light sweeps across the screen. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a stepped deco arch on an ivory card, your names, date, venue, a live countdown and an RSVP button, then the navy invitation card with a gold fan crest and two gold deco frames that lead to Our Story and the details of the day.',
      story: 'Three photos in stepped art deco arch frames, set like a staircase on a phone; as guests scroll, each one turns from dark to light while a band of gold light sweeps across it, and its caption appears below.',
      details: 'An "Order of the Day" card with gold dividers between the rows, add to calendar, the venue photo in a wide stepped deco frame, dress code, links and questions and answers.',
      rsvp: 'A navy "Will You Join Us?" card with your reply-by date, signed with your names and closed with the gold medallion on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Navy', hex: '#14213D' },
      { name: 'Midnight', hex: '#0A1729' },
      { name: 'Gold', hex: '#C9A55C' },
      { name: 'Pale Gold', hex: '#E6CF8F' },
      { name: 'Ivory', hex: '#F5EEDC' },
    ],
    fonts: ['Italiana', 'Josefin Sans'],
    llmsLine: 'navy two-door gatefold closed with a gold art deco medallion; gold fan rays, pearls, a champagne coupe and stepped deco arch frames on navy velvet.',
    relatedGuides: ['wedding-website-wording', 'how-to-make-a-wedding-website'],
  },
  // G093: written against themes/burgundy-velvet-autumn/README.md (G407, approved), the catalogue's opening line
  // (docs/09 WEB 07) and its real screens and opening frames (390 × 844 capture).
  'burgundy-velvet-autumn': {
    id: 'burgundy-velvet-autumn',
    collection: '07_Burgundy_Velvet',
    demoCouple: 'Rosalind & Edward',
    style: 'Ivory envelope wrapped in burgundy velvet ribbon, dahlias, blackberries, copper autumn leaves and oval gold frames',
    metaDescription:
      'An ivory envelope wrapped in burgundy velvet ribbon opens into your wedding website: dahlias, autumn leaves and oval gold frames. Edit it on your phone.',
    intro:
      'An ivory felt-textured envelope wrapped in burgundy velvet ribbon, tied in a bow with a little gold oak-leaf charm, on a warm peach plaster wall with soft candlelight and clusters of burgundy dahlias, roses, blackberries and copper leaves. Inside: oval gold frames, ivory cards and a flowing script.',
    opening:
      'Your guests tap the envelope. The velvet bow unties and the ribbon slides off the sides of the envelope, the rectangular flap lifts to show a burgundy liner with gold leaves, and a card with your portrait rises in a warm candlelight glow while a single copper maple leaf drifts down beside it. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in an oval gold frame on an ivory card, your names, date, venue, a live countdown and an RSVP button, then the invitation card with dahlias and two oval gold frames, hung from velvet bows, that lead to Our Story and the details of the day.',
      story: 'Three photos in oval gold frames, each hanging from a burgundy velvet ribbon and bow; as guests scroll, each frame drops into place on its tie and then sways gently, with a script caption below.',
      details: 'An "Order of the Day" card with blackberry sprigs between the rows, add to calendar, the venue photo in an oval gold frame, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" card with your reply-by date, signed with your names and tied with a burgundy velvet bow on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Wine', hex: '#6E1F2E' },
      { name: 'Copper', hex: '#7A391B' },
      { name: 'Peach', hex: '#F2D4BE' },
      { name: 'Ivory', hex: '#FBF5EE' },
      { name: 'Gold', hex: '#B88A4A' },
    ],
    fonts: ['Pinyon Script', 'Cinzel', 'Cormorant Garamond'],
    llmsLine: 'ivory envelope wrapped in burgundy velvet ribbon with a bow and a gold oak-leaf charm; burgundy dahlias, roses, blackberries, copper leaves and oval gold frames on a candlelit wall.',
    relatedGuides: ['what-to-put-on-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
  // G093: written against themes/winter-evergreen/README.md (G408, approved), the catalogue's opening line
  // (docs/09 WEB 08) and its real screens and opening frames (390 × 844 capture).
  'winter-evergreen': {
    id: 'winter-evergreen',
    collection: '08_Winter_Evergreen',
    demoCouple: 'Noelle & James',
    style: 'Forest green envelope with a snowy deckle edge, a pine-and-berry bundle, pine cones and frosted window frames',
    metaDescription:
      'A forest green envelope sealed with pine and red berries opens into your wedding website: falling snow, pine cones and frosted windows. Edit it on your phone.',
    intro:
      'A forest green envelope with a snowy white deckle edge on its flap, sealed with a bundle of pine, cedar and three red berries tied with a red velvet bow, among pine, juniper, winter berries and pine cones in a soft snowy mist. Inside: white wooden window frames, snowy white cards and a flowing script.',
    opening:
      'Your guests tap the envelope. Soft snow begins to fall, the pine-and-berry bundle loosens and slides away down the screen, the green flap opens upward to show a white liner patterned with pine and red berries, and a card with your portrait rises while snowflakes drift across the screen. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a snowy white window frame on a white card, your names, date, venue, a live countdown and an RSVP button, then the invitation card with a pine garland and two snowy windows that lead to Our Story and the details of the day.',
      story: 'Three photos behind frosted panes in white wooden windows; as each window comes into view, the frost wipes clear from the middle and stays in the corners, with a script caption below.',
      details: 'An "Order of the Day" card with pine sprigs between the rows, add to calendar, the venue photo in a wide snowy window, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" card with your reply-by date and the same pine-and-berry bundle as the envelope in its middle, signed with your names, followed by the reply form.',
    },
    palette: [
      { name: 'Forest', hex: '#2F5240' },
      { name: 'Berry', hex: '#8C1D26' },
      { name: 'Mist', hex: '#E3E8E7' },
      { name: 'Snow', hex: '#FAFAF6' },
      { name: 'Pine Ink', hex: '#1F2E26' },
    ],
    fonts: ['Parisienne', 'Libre Baskerville'],
    llmsLine: 'forest green envelope with a snowy deckle edge, sealed with a pine-and-berry bundle tied with a red bow; pine, juniper, winter berries, pine cones, falling snow and frosted window frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'digital-wedding-invitation-etiquette'],
  },
  // G094: written against themes/lavender-provence/README.md (G409), the catalogue's opening line (docs/09 WEB 09) and
  // its real screens and opening frames (390 × 844 capture).
  'lavender-provence': {
    id: 'lavender-provence',
    collection: '09_Lavender_Provence',
    demoCouple: 'Amélie & Louis',
    style: 'Cream linen pouch tied with jute twine and a lavender bundle, pressed lavender, daisies and pressed-flower cards',
    metaDescription:
      'A linen pouch tied with twine and a lavender bundle opens into your wedding website: pressed lavender, daisies and wheat. Edit it on your phone.',
    intro:
      'A Provence lavender field on handmade lilac paper: pressed lavender, white daisies and wheat ears in two corners, loose lavender buds on the paper, and instead of an envelope a cream linen pouch tied with jute twine and a lavender bundle. Inside: deckle-edged cream cards, pressed-flower frames and a flowing script.',
    opening:
      'Your guests tap the pouch. The jute twine unties and slips away with its lavender bundle, the linen pouch loosens and opens, and a card with your portrait slides up out of it while dried lavender buds scatter on a summer breeze. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a deckle-edged cream card, your names, date, venue, a live countdown and a lavender RSVP button, then the invitation card and three pressed-flower cards dropped loosely on the paper that lead to Our Story, the day and the reply.',
      story: 'Three photos on pressed-flower cards set at loose angles; as guests scroll, each one tumbles in on a breeze from its own side and settles, with a handwritten caption below.',
      details: 'An "Order of the Day" card with lavender-and-daisy sprigs between the rows, add to calendar, the venue photo in a wide pressed-flower frame, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" card with your reply-by date, signed with your names, with a lavender bundle on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Lilac Paper', hex: '#D6CCE5' },
      { name: 'Lavender', hex: '#9C8FC4' },
      { name: 'Violet', hex: '#5D5287' },
      { name: 'Ivory', hex: '#FAF8F3' },
      { name: 'Ink', hex: '#2E2A3F' },
    ],
    fonts: ['Alex Brush', 'Cormorant Garamond'],
    llmsLine: 'cream linen pouch tied with jute twine and a lavender bundle on lilac paper; pressed lavender, white daisies, wheat ears and pressed-flower cards.',
    relatedGuides: ['how-to-make-a-wedding-website', 'what-to-put-on-your-wedding-website'],
  },
  // G094: written against themes/tuscan-vineyard/README.md (G410), the catalogue's opening line (docs/09 WEB 10) and its
  // real screens and opening frames (390 × 844 capture).
  'tuscan-vineyard': {
    id: 'tuscan-vineyard',
    collection: '10_Tuscan_Vineyard',
    demoCouple: 'Giulia & Matteo',
    style: 'Kraft envelope tied with twine, a cork and olive leaves, grape clusters, vine leaves and wine-label frames',
    metaDescription:
      'A kraft envelope tied with twine and a cork opens into your wedding website: Tuscan sunset, grapes, olive leaves and wine-label frames. Edit it on your phone.',
    intro:
      'A vineyard wedding at sunset: a Tuscan sky over soft hills, grape clusters, vine leaves and olive branches in two corners, and a kraft envelope with a wine-colored engraved vine border on its flap, wrapped in jute twine with a cork and two dried olive leaves. Inside: wine-label cards and frames with cut corners, an oak table and a flowing script.',
    opening:
      'Your guests tap the envelope. The twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal a wine-colored grape liner, and a card with your portrait rises from the pocket as a vine tendril curls in from the corner. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a wine-label card, your names, date, venue, a live countdown and a wine-red RSVP button, then the invitation card and three vineyard rows that lead to Our Story, the day and the reply.',
      story: 'Three photos in wine-label frames laid one by one on an oak table; as guests scroll, each frame drops into place, its caption appears, and a grape cluster, an olive leaf and a vine leaf settle beside them.',
      details: 'An "Order of the Day" card with small vine sprigs between the rows, add to calendar, the venue photo in a wide wine-label frame, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" card with your reply-by date, signed with your names and tied with the twine and cork at its base, followed by the reply form.',
    },
    palette: [
      { name: 'Wine', hex: '#5B2C3A' },
      { name: 'Gold', hex: '#A9874F' },
      { name: 'Sunset', hex: '#FDDDB4' },
      { name: 'Peach Paper', hex: '#FAE6CF' },
      { name: 'Ivory', hex: '#FBF6EC' },
    ],
    fonts: ['Italianno', 'Marcellus'],
    llmsLine: 'kraft envelope wrapped in jute twine with a cork and olive leaves under a Tuscan sunset; grape clusters, vine leaves, olive branches, wine-label frames and an oak table.',
    relatedGuides: ['wedding-website-wording', 'canva-wedding-website-template-vs-hosted-website'],
  },
  // G094: written against themes/boho-pampas-terracotta/README.md (G411), the catalogue's opening line (docs/09 WEB 11)
  // and its real screens and opening frames (390 × 844 capture).
  'boho-pampas-terracotta': {
    id: 'boho-pampas-terracotta',
    collection: '11_Boho_Pampas',
    demoCouple: 'Luna & River',
    style: 'Terracotta arch envelope tied with pampas and a palm spear, dried roses and arch frames on sunlit sand',
    metaDescription:
      'A terracotta arch envelope tied with pampas and palm opens into your wedding website: pampas plumes, dried roses and arch frames. Edit it on your phone.',
    intro:
      'A desert boho wedding on a sunlit sand wall with soft sun rays: pampas grass, dried palm spears and dried terracotta roses in two corners, and a terracotta envelope with a round arch flap and an arched front pocket, tied with pampas and palm. Inside: arch-windowed cards and frames in terracotta and sand, and a brush script.',
    opening:
      'Your guests tap the envelope. The pampas-and-palm tie slips off, the arch flap folds upward to show a liner of terracotta rainbows, and a card with your portrait slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in an arch-windowed card, your names, date, venue, a live countdown and a terracotta RSVP button, then the invitation card, an arch photo frame and an arched card with the first lines of your schedule that lead to Our Story and the day.',
      story: 'Three photos in arch frames, the middle one a little taller and in front; as guests scroll, the arches open out from their base like a rainbow, the middle one first, and then the script captions appear.',
      details: 'An arched "Order of the Day" card with pampas sprigs between the rows, add to calendar, the venue photo in a wide arch frame, dress code, links and questions and answers.',
      rsvp: 'An arched "Will You Join Us?" card with your reply-by date, signed with your names and the pampas-and-palm tie on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Terracotta', hex: '#C9785B' },
      { name: 'Rust', hex: '#9C5136' },
      { name: 'Sand', hex: '#F3DEC6' },
      { name: 'Gold', hex: '#C29A5B' },
      { name: 'Ivory', hex: '#FBF5EC' },
    ],
    fonts: ['Sacramento', 'Josefin Slab'],
    llmsLine: 'terracotta arch envelope tied with pampas and a dried palm spear on a sunlit sand wall; pampas plumes, dried terracotta roses and arch frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'what-to-put-on-your-wedding-website'],
  },
  // G094: written against themes/tropical-destination/README.md (G412), the catalogue's opening line (docs/09 WEB 12)
  // and its real screens and opening frames (390 × 844 capture).
  'tropical-destination': {
    id: 'tropical-destination',
    collection: '12_Tropical_Destination',
    demoCouple: 'Maya & Kai',
    style: 'Travel wallet with a leather strap and a brass snap, plumeria, monstera, hibiscus and luggage-tag frames',
    metaDescription:
      'A travel wallet with a brass snap and a plumeria opens into your wedding website: monstera, hibiscus and string-tied luggage tags. Edit it on your phone.',
    intro:
      'A destination wedding on a soft sea-foam wash: monstera, palm leaves, hibiscus and plumeria in two corners, and a white travel wallet with a round flap and a leather strap, closed with a brass snap, twine and a white plumeria. Inside: a palm-leaf liner, luggage-tag and kraft-tag frames on strings and a flowing script.',
    opening:
      'Your guests tap the wallet. The brass snap pops open and the plumeria tab swings away, the round flap flips up with its strap to reveal the palm-leaf liner, and a luggage-tag card with your portrait slides up while a monstera leaf and a white plumeria drift across the screen. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a luggage-tag card, your names, date, venue, a live countdown and a teal RSVP button, then the invitation card with a travel-tag date line and two kraft tags that lead to Our Story and the details of the day.',
      story: 'Three photos on string-tied kraft tags, each with a flower tucked in a corner; as guests scroll, each tag swings into place from the top of its string and keeps swaying gently, with a handwritten caption below.',
      details: 'An "Order of the Day" card with palm-and-plumeria sprays between the rows, add to calendar, the venue photo on a wide kraft tag, dress code, links and questions and answers.',
      rsvp: 'A "Will You Join Us?" card with your reply-by date, signed with your names and closed with the brass snap and plumeria on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Teal', hex: '#1F7C75' },
      { name: 'Palm', hex: '#1F5843' },
      { name: 'Gold', hex: '#C4963F' },
      { name: 'Lagoon', hex: '#E8FCF8' },
      { name: 'Ivory', hex: '#FFFCF5' },
    ],
    fonts: ['Dancing Script', 'Raleway'],
    llmsLine: 'travel wallet with a leather strap, a brass snap and a white plumeria on a sea-foam wash; palm-leaf liner, monstera, hibiscus, plumeria and string-tied luggage tags.',
    relatedGuides: ['digital-wedding-invitation-etiquette', 'how-to-make-a-wedding-website'],
  },
  // G094: written against themes/enchanted-forest-storybook/README.md (G413), the catalogue's opening line (docs/09
  // WEB 13) and its real screens and opening frames (390 × 844 capture).
  'enchanted-forest-storybook': {
    id: 'enchanted-forest-storybook',
    collection: '13_Enchanted_Forest',
    demoCouple: 'Aurora & Rowan',
    style: 'Moss-green storybook with a brass clasp, ferns, toadstools, fireflies and photo-cornered storybook pages',
    metaDescription:
      'A moss-green storybook with a brass clasp opens into your wedding website: a misty forest, ferns, toadstools and fireflies. Edit it on your phone.',
    intro:
      'A fairy-tale forest clearing in the mist, lit by fireflies: ivy, foxgloves, ferns, moss and little toadstools in two corners, and an old moss-green storybook with an embossed gold fern-and-mushroom border and a leaf-carved brass clasp. Inside: aged cream book pages with a fine ink border, photos held by black photo corners and a flowing script.',
    opening:
      'Your guests tap the book. The brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and a card with your portrait rises from the page while tiny fireflies glow up around it. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a book-page card with four photo corners, your names, date, venue, a live countdown and a moss-green RSVP button, then the invitation card and two photo-cornered pictures that lead to Our Story and the details of the day.',
      story: 'One long storybook page with three photo-cornered pictures in a zigzag; as guests scroll, each picture is pressed onto the page, a fern sprig and a firefly appear beside it, and its caption is written below.',
      details: 'An "Order of the Day" page with ivy sprigs between the rows, add to calendar, the venue photo in a wide photo-cornered card, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" page with your reply-by date, signed with your names and the book's brass clasp on its lower edge, followed by the reply form.",
    },
    palette: [
      { name: 'Moss', hex: '#4A5A3A' },
      { name: 'Old Gold', hex: '#B7975A' },
      { name: 'Sepia', hex: '#5E4517' },
      { name: 'Parchment', hex: '#DED8B8' },
      { name: 'Mist', hex: '#ECE9D6' },
    ],
    fonts: ['Tangerine', 'IM Fell English'],
    llmsLine: 'moss-green storybook with an embossed gold border and a brass clasp in a misty forest; ferns, ivy, foxgloves, toadstools, fireflies and photo-cornered book pages.',
    relatedGuides: ['wedding-website-wording', 'digital-wedding-invitation-etiquette'],
  },
  // G094: written against themes/ivory-lace-pearls/README.md (G414), the catalogue's opening line (docs/09 WEB 14) and
  // its real screens and opening frames (390 × 844 capture).
  'ivory-lace-pearls': {
    id: 'ivory-lace-pearls',
    collection: '14_Ivory_Lace_Pearl',
    demoCouple: 'Charlotte & William',
    style: 'Lace-covered ivory gatefold with a pearl brooch, white garden roses, pearl strands and carved oval frames',
    metaDescription:
      'A lace-covered ivory gatefold with a pearl brooch opens into your wedding website: white garden roses, pearl strands and oval frames. Edit it on your phone.',
    intro:
      'Regal ivory on pearly satin, lit from a window: ivory lace, strands of pearls and white garden roses in two corners, a pearl drop, rose petals and a satin bow, and a two-door ivory gatefold covered in lace, fastened over the center seam with a five-pearl silver-gold brooch. Inside: carved ivory oval frames, lace-edged cards and an engraved copperplate script.',
    opening:
      'Your guests tap the gatefold. The pearl brooch unhooks and slips away down the seam, the lace-covered doors part slowly to the sides like a lifted veil, and a card with your portrait rises from the satin center while a strand of tiny pearls glints. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a carved oval frame on an ivory card, your names, date, venue, a live countdown and a champagne RSVP button, then the invitation card and two frames hung on pearl strands that lead to Our Story and the details of the day.',
      story: 'Three oval frames hanging from pearl strands of different lengths; as guests scroll, each one comes down and sways gently on its strand before it settles, a band of light passes over the carved ivory and pearls, and its caption appears below.',
      details: 'An "Order of the Day" card with pearl strands between the rows, add to calendar, the venue photo in a wide carved oval frame, dress code, links and questions and answers.',
      rsvp: 'A lace-edged "Will You Join Us?" card with your reply-by date, signed with your names and the pearl brooch on its lower edge, followed by the reply form.',
    },
    palette: [
      { name: 'Satin', hex: '#F1E7DE' },
      { name: 'Ivory', hex: '#FFFDF8' },
      { name: 'Taupe', hex: '#7A6650' },
      { name: 'Champagne Gold', hex: '#8C7350' },
      { name: 'Ink', hex: '#3A3530' },
    ],
    fonts: ['Mrs Saint Delafield', 'Bodoni Moda'],
    llmsLine: 'lace-covered ivory gatefold fastened with a pearl brooch on pearly satin; ivory lace, pearl strands, white garden roses and carved oval frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
  // G097: written against themes/cherry-blossom-spring/README.md (G415), the catalogue's opening line (docs/09 WEB 15)
  // and its real screens and opening frames (390 × 844 capture).
  'cherry-blossom-spring': {
    id: 'cherry-blossom-spring',
    collection: '15_Cherry_Blossom',
    demoCouple: 'Hana & Ethan',
    style: 'Pale grey envelope with a round deckle-edged flap and a cherry blossom twig, watercolor blossoms and petals',
    metaDescription:
      'A pale grey envelope with a cherry blossom twig opens into your wedding website: watercolor blossom branches and drifting petals. Edit it on your phone.',
    intro:
      'Spring in a soft pink mist: watercolor cherry blossom branches reaching in from two corners, single petals drifting across the screen, and a pale grey handmade-paper envelope with a round, deckle-edged white flap, closed at its tip with a five-blossom cherry twig. Inside: deckle-edged ivory cards, blossom-wreathed round and oval frames and a formal script.',
    opening:
      'Your guests tap the envelope. The blossom twig trembles, loosens and drifts off the top of the screen, the curved grey flap lifts to show a cherry blossom liner, and a card with your portrait rises from the pocket as a gentle flurry of cherry petals swirls up and floats across the screen. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in the round window of a blossom-wreathed card, your names, date, venue, a live countdown and a dusty rose RSVP button with a blossom at each end, then the invitation card and two blossom-framed ovals that lead to Our Story and the details of the day.',
      story: 'Three blossom-framed ovals of different sizes set from side to side; as guests scroll, each one drifts down like a falling petal, swaying from side to side before it settles, then its caption is written and a small blossom opens below it.',
      details: 'An "Order of the Day" card with small blossom sprigs between the rows, add to calendar, the venue photo in a wide blossom-framed oval, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's cherry blossom twig on its lower edge, followed by the reply form.",
    },
    palette: [
      { name: 'Blush Mist', hex: '#EEE3E6' },
      { name: 'Ivory', hex: '#FFFCFB' },
      { name: 'Dusty Rose', hex: '#7C5563' },
      { name: 'Plum', hex: '#4A3D42' },
      { name: 'Ink', hex: '#3A3438' },
    ],
    fonts: ['Petit Formal Script', 'Noto Serif Display'],
    llmsLine: 'pale grey envelope with a deckle-edged round flap and a cherry blossom twig in a soft pink mist; watercolor cherry blossom branches, drifting petals and blossom-framed ovals.',
    relatedGuides: ['what-to-put-on-your-wedding-website', 'how-to-make-a-wedding-website'],
  },
  // G097: written against themes/sunflower-rustic-barn/README.md (G416), the catalogue's opening line (docs/09 WEB 16)
  // and its real screens and opening frames (390 × 844 capture).
  'sunflower-rustic-barn': {
    id: 'sunflower-rustic-barn',
    collection: '16_Sunflower_Rustic',
    demoCouple: 'Daisy & Wyatt',
    style: 'Kraft envelope tied with a mustard gingham bow and a sunflower, sunflowers, wheat and prints pegged on twine',
    metaDescription:
      'A kraft envelope tied with a gingham bow and a sunflower opens into your wedding website: sunflowers, wheat and a barn-wood table. Edit it on your phone.',
    intro:
      'A country wedding in golden-hour light on cream paper with weathered wood along the bottom: watercolor sunflowers, wheat, daisies and leaves in two corners, a sunflower petal, a small sunflower head and a wheat ear drifting, and a kraft paper envelope with a rounded square flap and a mustard-and-cream gingham liner, wrapped in a wide mustard gingham ribbon with a big bow and a little sunflower at the knot. Inside: deckle-edged cream cards, old prints pegged on jute twine and a warm brush script.',
    opening:
      'Your guests tap the envelope. The gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open to show the gingham liner, a weathered barn-wood tabletop appears under the envelope, and the card with your portrait rises and slides out onto the table while a few sunflower petals tumble. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a gingham-edged window on a cream card, your names, date, venue, a live countdown and a mustard RSVP button, then the invitation card and two prints pegged on jute twine that lead to Our Story and the details of the day.',
      story: 'A barn-wood wall with three lengths of jute twine; as guests scroll, each line of twine stretches out, an old print is pegged onto it and swings once on its peg before it settles, and its caption is written below, with a little sunflower or wheat ear beside it.',
      details: 'An "Order of the Day" card topped with gingham and sunflowers, small sunflower sprays between the rows, add to calendar, the venue photo as a wide print pegged on twine, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's gingham ribbon and bow laid along its base, followed by the reply form.",
    },
    palette: [
      { name: 'Golden Cream', hex: '#F9E7CB' },
      { name: 'Mustard', hex: '#E3A72F' },
      { name: 'Wheat Gold', hex: '#B88B3E' },
      { name: 'Leaf', hex: '#6E7D3A' },
      { name: 'Barn Brown', hex: '#5A4429' },
    ],
    fonts: ['Kaushan Script', 'Merriweather'],
    llmsLine: 'kraft envelope wrapped in mustard gingham ribbon with a bow and a little sunflower in golden-hour light; watercolor sunflowers, wheat, daisies, a barn-wood table and prints pegged on jute twine.',
    relatedGuides: ['how-to-make-a-wedding-website', 'wedding-website-wording'],
  },
  // G097: written against themes/emerald-gold-estate/README.md (G417), the catalogue's opening line (docs/09 WEB 17) and
  // its real screens and opening frames (390 × 844 capture).
  'emerald-gold-estate': {
    id: 'emerald-gold-estate',
    collection: '17_Emerald_Gold_Estate',
    demoCouple: 'Evelyn & Alexander',
    style: 'Emerald velvet envelope with a gold seal, gold line-art monstera and ferns, white marble cards and gold frames',
    metaDescription:
      'An emerald velvet envelope with a gold seal opens into your wedding website: gold line-art monstera and ferns and white marble cards. Edit it on your phone.',
    intro:
      'An estate gala at night on deep emerald velvet dusted with gold at the edges: thin metallic gold line-art monstera, fern and eucalyptus in two corners, a gold fern leaf and a eucalyptus sprig drifting at the side, and an emerald velvet envelope with a tall bell-shaped flap, fine gold lines along its edges and a laurel-wreath gold seal carrying your initials. Inside: white Carrara marble cards with thin gold borders, gold frames and decorative Roman capitals.',
    opening:
      'Your guests tap the envelope. A glint of light runs over the gold seal and it lifts away, the emerald flap opens upward to show a gold leaf liner, thin gold botanical lines of fern, monstera and eucalyptus draw themselves across the screen, and the marble card with your portrait rises from the pocket. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a gold-framed marble card, your names, date, venue, a live countdown and a polished gold RSVP button, then the marble invitation card and two gold frames hung on the velvet that lead to Our Story and the details of the day.',
      story: 'A gallery wall of three thin gold frames in three sizes on the emerald velvet; as guests scroll, each frame drops in as if hung on a nail, swings once and settles, its caption is written, and a gold eucalyptus sprig draws itself beside it.',
      details: 'A marble "Order of the Day" card with small gold ferns between the rows, add to calendar, the venue photo in a wide gold frame, dress code, links and questions and answers.',
      rsvp: "A marble \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's gold seal on its lower edge, followed by the reply form.",
    },
    palette: [
      { name: 'Velvet', hex: '#012314' },
      { name: 'Emerald', hex: '#0B3528' },
      { name: 'Gold', hex: '#C8A45A' },
      { name: 'Marble Ivory', hex: '#F3EDDF' },
      { name: 'Bronze', hex: '#74561F' },
    ],
    fonts: ['Cinzel Decorative', 'Cormorant Infant'],
    llmsLine: 'emerald velvet envelope with gold-lined edges and a laurel-wreath gold seal; thin gold line-art monstera, ferns and eucalyptus, white marble cards and a gallery wall of gold frames.',
    relatedGuides: ['wedding-website-wording', 'when-to-send-your-wedding-website'],
  },
  // G097: written against themes/wildflower-meadow-vellum/README.md (G418), the catalogue's opening line (docs/09 WEB 18)
  // and its real screens and opening frames (390 × 844 capture).
  'wildflower-meadow-vellum': {
    id: 'wildflower-meadow-vellum',
    collection: '18_Wildflower_Vellum',
    demoCouple: 'Willow & Finn',
    style: 'Frosted vellum sleeve with a wildflower label, colored-pencil poppies, cornflowers, daisies and veiled photo cards',
    metaDescription:
      'A frosted vellum sleeve with a wildflower label opens into your wedding website: colored-pencil poppies, cornflowers and daisies. Edit it on your phone.',
    intro:
      'A summer meadow in a soft cream-to-green haze with blurred wildflowers along the bottom: colored-pencil clusters of poppies, cornflowers, daisies, lupins and grasses in two corners, a poppy petal, a cornflower and a daisy drifting at the side, and instead of an envelope a frosted, see-through vellum sleeve with a round, deckle-edged wildflower label just below its opening. Inside: cotton paper cards with wildflower borders, photo cards under vellum veils and a relaxed handwritten script.',
    opening:
      'Your guests tap the sleeve. The wildflower label peels away, the frosted vellum sleeve opens, slides down off the card and fades as the card comes into focus, and the card with your portrait lifts up while colored-pencil poppy petals flutter across the screen. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait on a card with a wildflower border, your names, date, venue, a live countdown and a cornflower-blue RSVP button, then the invitation card and two photo cards that lead to Our Story and the details of the day.',
      story: 'Three photo cards set at slight angles, each under a vellum veil; as guests scroll, each card rises into place, its vellum veil lifts from the lower edge and floats away to show the photo, and its handwritten caption appears, with a cornflower or a daisy between the cards.',
      details: 'An "Order of the Day" card with small poppy-and-cornflower sprays between the rows, add to calendar, the venue photo on a photo card with a wildflower border, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the sleeve's wildflower label at its base, followed by the reply form.",
    },
    palette: [
      { name: 'Meadow Cream', hex: '#F1F0E1' },
      { name: 'Ivory', hex: '#FFFEF8' },
      { name: 'Leaf', hex: '#4F6A36' },
      { name: 'Cornflower', hex: '#4466A6' },
      { name: 'Poppy', hex: '#B8452C' },
    ],
    fonts: ['Satisfy', 'Spectral'],
    llmsLine: 'frosted vellum sleeve with a deckle-edged wildflower label in a summer meadow; colored-pencil poppies, cornflowers, daisies and lupins, and photo cards under lifting vellum veils.',
    relatedGuides: ['digital-wedding-invitation-etiquette', 'canva-wedding-website-template-vs-hosted-website'],
  },
  // G097: written against themes/midnight-garden/README.md (G419), the catalogue's opening line (docs/09 WEB 19) and its
  // real screens and opening frames (390 × 844 capture).
  'midnight-garden': {
    id: 'midnight-garden',
    collection: '19_Midnight_Garden',
    demoCouple: 'Celeste & Damien',
    style: 'Matte black envelope with antique silver edges and a silver seal, oil-painted roses, peonies and gilded frames',
    metaDescription:
      'A black envelope with a silver seal opens into your wedding website in warm candlelight: dark roses, plum peonies and gilded frames. Edit it on your phone.',
    intro:
      'A night garden painted like a dark Dutch still life on black: oil-painted deep red roses, plum peonies, midnight-blue hydrangea, dark fruit and dusky leaves in two corners, a velvet plum butterfly and a rose petal, candlelight glowing low on the page, and a matte black envelope edged with hairline antique silver, closed at the tip of its V flap with a silver seal carrying your initials. Inside: black cards with fine gold borders, baroque gilded frames and classic small capitals.',
    opening:
      'Your guests tap the envelope. The silver seal cracks in two and the halves fall away, the black flap opens slowly to show a dark rose liner, warm golden candlelight spills out from inside, and the card with your portrait rises out of the darkness into the glow. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a gilded frame on a black card, your names, date, venue, a live countdown and a gold RSVP button, then the invitation card and two gilded frames that lead to Our Story and the details of the day.',
      story: 'Three baroque gilded frames hung salon-style, one to the left and the next to the right; as guests scroll, candlelight warms the wall behind each frame and the frame and its photo glow up out of the dark, then its caption appears.',
      details: 'An "Order of the Day" card with small rose sprigs between the rows, add to calendar, the venue photo in a wide gilded frame, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's silver seal pressed onto its lower gold line, followed by the reply form.",
    },
    palette: [
      { name: 'Midnight', hex: '#141217' },
      { name: 'Plum', hex: '#4A2335' },
      { name: 'Candle Gold', hex: '#C9A46A' },
      { name: 'Pale Gold', hex: '#E3C99A' },
      { name: 'Ivory', hex: '#EFE6DA' },
    ],
    fonts: ['Playfair Display SC', 'Cormorant SC', 'Cormorant Garamond'],
    llmsLine: 'matte black envelope with antique silver edges and a silver seal that cracks open to candlelight; oil-painted dark roses, plum peonies, hydrangea, a plum butterfly and baroque gilded frames.',
    relatedGuides: ['digital-wedding-invitation-etiquette', 'what-to-put-on-your-wedding-website'],
  },
  // G097: written against themes/coastal-seaside/README.md (G420), the catalogue's opening line (docs/09 WEB 20) and its
  // real screens and opening frames (390 × 844 capture).
  'coastal-seaside': {
    id: 'coastal-seaside',
    collection: '20_Coastal_Seaside',
    demoCouple: 'Marina & Oliver',
    style: 'Speckled sand envelope with a wave-edged flap and a scallop shell, watercolor sea, shells and brass porthole frames',
    metaDescription:
      'A sand-colored envelope with a scallop shell opens into your wedding website: a watercolor wave, shells, sea glass and portholes. Edit it on your phone.',
    intro:
      'An ocean shore in a pale sea-mist watercolor: a beach corner of dune grass, a moon snail shell, coral, sea glass, sand and foam, a foamy wave along the bottom, a scallop shell and sea glass in the other corner, a piece of sea glass and a starfish drifting, and a speckled sand-colored envelope whose V flap is cut like a wavy shoreline, with a scallop shell on a short loop of twine at its tip. Inside: an ocean watercolor liner, sand cards with wave-washed edges, brass porthole frames and a flowing script.',
    opening:
      'Your guests tap the envelope. A watercolor wave sweeps across the screen and carries the scallop shell and its twine away, the wave-edged flap lifts to show the ocean liner, and the card with your portrait rises slowly like the incoming tide. The card comes forward to become the first screen of your home page.',
    pages: {
      home: 'Your portrait in a brass porthole on a sand card, your names, date, venue, a live countdown and an ocean-blue RSVP button, then the invitation card and two portholes that slide in from their own sides and lead to Our Story and the details of the day.',
      story: 'Three brass portholes in a zigzag, left, right and left; as guests scroll, each one slides in from its own side and turns gently into place with a shell, sea glass or starfish beside it, and its handwritten caption appears below.',
      details: 'An "Order of the Day" card with small rows of shells between the rows, add to calendar, the venue photo in a wide oval porthole, dress code, links and questions and answers.',
      rsvp: "A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's scallop shell resting on the wave at its foot, followed by the reply form.",
    },
    palette: [
      { name: 'Sea Mist', hex: '#D8EEF6' },
      { name: 'Ivory', hex: '#FFFDF8' },
      { name: 'Ocean', hex: '#2E5E7E' },
      { name: 'Deep Sea', hex: '#1D3445' },
      { name: 'Sand', hex: '#8A6A35' },
    ],
    fonts: ['Allison', 'Lora'],
    llmsLine: 'speckled sand-colored envelope with a wave-edged flap and a scallop shell on twine, carried away by a watercolor wave; sea-mist watercolor, shells, sea glass, starfish and brass porthole frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
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

/**
 * G099: the home page's design showcase — the live designs marked `featured` in config.ts, in config order. With none
 * marked, every live design (the home page never shows an empty showcase).
 */
export function featuredDesigns(cfg: MarketingConfig = MARKETING): Design[] {
  const live = liveDesigns(cfg);
  const featured = live.filter((d) => d.featured);
  return featured.length ? featured : live;
}

/**
 * G099: what the guests tap first in this design, from its opening sentence ("Your guests tap the book. …" -> "book"):
 * an envelope in most designs, a gatefold, pouch, wallet, book or sleeve in others. Design-specific copy on shared
 * templates ("after the book opens") uses it, so no page says "envelope" for a design that is not one.
 */
export function openingObject(copy: Pick<DesignCopy, 'id' | 'opening'>): string {
  const m = /^Your guests tap the ([a-z]+)\./.exec(copy.opening);
  if (!m) throw new Error(`lib/marketing/designs.ts: the opening of "${copy.id}" must start with "Your guests tap the <thing>."`);
  return m[1];
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

// ---------------------------------------------------------------------------------------------
// G121 (docs/14 §6.2, docs/18 §5 P2 — Craft: categories): the style filter of /designs. Every live design has at least
// one style (tests/g121-designs.test.ts); a design can be in more than one. Descriptive only, from each design's own
// style line (above).

export const STYLE_FILTERS = [
  { id: 'floral', label: 'Romantic floral' },
  { id: 'classic', label: 'Classic & elegant' },
  { id: 'rustic', label: 'Rustic & boho' },
  { id: 'destination', label: 'Destination' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'storybook', label: 'Storybook & vintage' },
] as const;
export type StyleId = (typeof STYLE_FILTERS)[number]['id'];

export const DESIGN_STYLES: Record<string, readonly StyleId[]> = {
  'blush-garden-rose': ['floral'],
  'olive-ivory': ['classic'],
  'mediterranean-lemon': ['destination'],
  'dusty-blue-champagne': ['floral', 'classic'],
  'vintage-airmail-love-letter': ['storybook'],
  'art-deco-black-tie': ['classic'],
  'burgundy-velvet-autumn': ['floral', 'seasonal'],
  'winter-evergreen': ['seasonal'],
  'lavender-provence': ['rustic', 'destination'],
  'tuscan-vineyard': ['rustic', 'destination'],
  'boho-pampas-terracotta': ['rustic'],
  'tropical-destination': ['destination'],
  'enchanted-forest-storybook': ['storybook'],
  'ivory-lace-pearls': ['classic', 'floral'],
  'cherry-blossom-spring': ['floral', 'seasonal'],
  'sunflower-rustic-barn': ['rustic', 'seasonal'],
  'emerald-gold-estate': ['classic'],
  'wildflower-meadow-vellum': ['floral', 'rustic'],
  'midnight-garden': ['floral', 'classic'],
  'coastal-seaside': ['destination'],
};

/** The styles of a design ([] when it has none yet: it then shows under "All" only). */
export function designStyles(id: string): readonly StyleId[] {
  return DESIGN_STYLES[id] ?? [];
}

/** The style filter shows from this many live designs on (docs/14 §6.2: hidden below six). */
export const STYLE_FILTER_MIN_DESIGNS = 6;

/** The filter chips with their counts among the given designs; a style no design has is left out. */
export function styleFilterChips(designs: readonly Pick<Design, 'id'>[]): Array<{ id: StyleId; label: string; count: number }> {
  return STYLE_FILTERS.map((f) => ({ id: f.id, label: f.label, count: designs.filter((d) => designStyles(d.id).includes(f.id)).length })).filter(
    (c) => c.count > 0,
  );
}
