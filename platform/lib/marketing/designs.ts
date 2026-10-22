// Descriptive copy of each design for the marketing site (G061). Commerce fields (price, Etsy link, status) live in
// config.ts; this file says what the design looks like and how it opens — written against the real theme behavior
// (platform/themes/<id>/README.md + the real screens in collections/<NN>/package/shots, docs/14 §6.3).
// Screens are REAL theme screenshots (demo content, fictional couple), never re-drawn or generated (K21, docs/14 §12).
// G144: the texts the pages show are marked with msg() and translated where they are shown (t(copy.style) …); the demo
// couple, fonts and llmsLine (llms.txt stays English) are not translated.

import { msg } from '../i18n/translate.ts';
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
  // G141: the editing tour on the home page (captured like the others, scripts/marketing-assets.ts --panel)
  editList: 'g141_edit_list',
  music: 'g141_music',
  map: 'g141_map',
  excel: 'g141_guests_excel',
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
  'crimson-rose-atelier': {
    id: 'crimson-rose-atelier',
    collection: '21_Crimson_Rose_Atelier',
    demoCouple: 'Olivia & James',
    style: msg('Crimson roses, a burgundy envelope with a gold botanical wax seal, an offset oval portrait and a landscape chapter album'),
    metaDescription: msg('A burgundy rose wedding website with a wax-sealed opening, an offset oval portrait and a landscape story album. Personalize it in your online editor.'),
    intro: msg('Deep crimson roses, warm gold and ivory paper. An oversized name composition opens into a side-set oval portrait, a landscape chapter album and an elegant celebration programme.'),
    opening: msg('Your guests tap the envelope. The gold botanical seal lifts away, the flap opens and a separate ivory invitation card rises from its pocket. The invitation then opens on your home page.'),
    pages: {
      home: msg('Large names on burgundy, an oval portrait set across the burgundy and ivory join, your invitation, countdown and a staggered strip of three album chapters.'),
      story: msg('A landscape chapter album with three photos, captions, thumbnails and previous/next controls. Guests can swipe or use the keyboard.'),
      details: msg('A typographic celebration programme, a wide venue photo, optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A cream reply card on burgundy, with your reply-by date and the shared configurable reply form.'),
    },
    palette: [
      { name: msg('Burgundy'), hex: '#4B0C17' },
      { name: msg('Oxblood'), hex: '#29070B' },
      { name: msg('Cream'), hex: '#F8EFDF' },
      { name: msg('Gold'), hex: '#C9A66D' },
    ],
    fonts: ['Cormorant Garamond', 'Manrope'],
    llmsLine: 'crimson roses and a gold-sealed burgundy envelope; an offset oval portrait and a landscape chapter album on ivory paper.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'nocturne-lake-estate': {
    id: 'nocturne-lake-estate',
    collection: '22_Nocturne_Lake_Estate',
    demoCouple: 'Eleanor & Luca',
    style: msg('Black tie by the lake: a black envelope with a gold wax seal, Lake Como at dusk and an asymmetric photo gallery'),
    metaDescription: msg('A black-tie wedding website with a gold-sealed black envelope, Lake Como at dusk and a photo gallery. Personalize it in your online editor.'),
    intro: msg('Black paper, champagne gold and candlelight by the water. Your names rise over a lake at dusk, then the invitation, a quiet gallery and the evening, hour by hour.'),
    opening: msg('Your guests tap the envelope. The gold wax seal lifts away, the black flap opens and a separate charcoal card with your photo rises from the pocket. The card then opens into your home page.'),
    pages: {
      home: msg('Your names in capitals over Lake Como at dusk, then the invitation beside your portrait, a countdown and calendar links.'),
      story: msg('An asymmetric gallery: one tall photo and two landscape frames with captions. Each opens larger in a quiet viewer.'),
      details: msg('The evening as a timeline beside a wide venue photo, with an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A dark reply card with your reply-by date and the shared configurable reply form.'),
    },
    palette: [
      { name: msg('Night'), hex: '#11120F' },
      { name: msg('Charcoal'), hex: '#1C1D15' },
      { name: msg('Champagne'), hex: '#E0C7A4' },
      { name: msg('Gold'), hex: '#C7A978' },
    ],
    fonts: ['Cinzel', 'Cormorant Garamond', 'Jost'],
    llmsLine: 'black tie by Lake Como: a black envelope with a gold wax seal, names over the lake at dusk and an asymmetric photo gallery.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'velvet-jewel-box': {
    id: 'velvet-jewel-box',
    collection: '23_Velvet_Jewel_Box',
    demoCouple: 'Isabelle & Julian',
    style: msg('An aubergine velvet ring box with a satin bow, champagne satin, foil script names and a turning photo display'),
    metaDescription: msg('A plum velvet ring box opens into your wedding website: champagne satin, shimmering script names and a turning photo display. Edit it in your online editor.'),
    intro: msg('Aubergine velvet, champagne satin and a touch of rose gold. Your names shimmer like foil, your photos turn on a display like fine jewelry, and every page glides in like satin.'),
    opening: msg('Your guests tap the box. The satin bow slides away, the velvet lid lifts on its hinge to show the satin lining and a separate invitation card with your photo rises out of the box. The card then opens into your home page.'),
    pages: {
      home: msg('Your names in a shimmering script over plum velvet, then the invitation beside your portrait on champagne satin, a countdown and calendar links.'),
      story: msg('Three photos with captions on a turning display, like jewelry in a case. Guests swipe or drag it, or use the arrows or the keyboard.'),
      details: msg('The order of the day on satin beside a wide venue photo, with an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A velvet reply card with your reply-by date and the shared configurable reply form.'),
    },
    palette: [
      { name: msg('Aubergine'), hex: '#2A1328' },
      { name: msg('Plum'), hex: '#4A2142' },
      { name: msg('Champagne'), hex: '#E8D3B0' },
      { name: msg('Rose gold'), hex: '#C99A86' },
    ],
    fonts: ['Bodoni Moda', 'Pinyon Script'],
    llmsLine: 'an aubergine velvet ring box with a satin bow; champagne satin, foil script names and a turning 3D photo display.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'grand-theatre-premiere': {
    id: 'grand-theatre-premiere',
    collection: '24_Grand_Theatre_Premiere',
    demoCouple: 'Charlotte & Theodore',
    style: msg('Opening night: a peacock velvet curtain under antique gold, a spotlight and an ivory theatre programme'),
    metaDescription: msg('A theatre wedding website: a velvet curtain parts, a spotlight finds your programme card and guests reply on a ticket. Personalize it in your online editor.'),
    intro: msg('Velvet, antique gold and an ivory playbill. The curtain rises on your names, your story plays in the spotlight and the evening reads like a theatre programme, act by act.'),
    opening: msg('Your guests tap the curtain. The house lights dim, the two velvet panels part one after the other and a spotlight sweeps the stage to a separate programme card with your photo. The card then opens into your home page.'),
    pages: {
      home: msg('Your names on a programme card standing on the open stage, then the invitation beside your portrait, a countdown to curtain-up and calendar links.'),
      story: msg('Intermission: three photo cards on a dark stage, Scene I to III. A spotlight follows the tap and lights the photo your guest chooses.'),
      details: msg('The evening as a theatre programme, Act I, Act II and on, with the venue photo, an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('Reserve your seat: the reply form is a theatre ticket, and its stub tears off when a guest sends the reply.'),
    },
    palette: [
      { name: msg('Velvet'), hex: '#0E3D40' },
      { name: msg('Peacock'), hex: '#16595B' },
      { name: msg('Antique gold'), hex: '#C9A45C' },
      { name: msg('Ivory'), hex: '#F3EBD8' },
    ],
    fonts: ['Abril Fatface', 'Playfair Display'],
    llmsLine: 'opening night: a peacock velvet curtain that parts, a spotlight on the programme card, the evening as acts and a ticket-stub RSVP.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'orient-express-voyage': {
    id: 'orient-express-voyage',
    collection: '25_Orient_Express_Voyage',
    demoCouple: 'Amelia & Rafael',
    style: msg('A vintage rail journey: a bottle-green leather ticket wallet, a first-class ticket, an antique route map and carriage-window photos'),
    metaDescription: msg('A vintage rail journey wedding website: a leather ticket wallet opens to a first-class ticket, and a route map draws itself. Edit it in your online editor.'),
    intro: msg('Bottle green, brass and ivory, in the style of an old travel poster. Your names rise over the poster, then the invitation with a swinging luggage tag, a departure countdown and a route that draws itself across an antique map.'),
    opening: msg('Your guests tap the wallet. The leather strap unbuckles, the cover swings open and a separate first-class ticket with your photo slides out of its pocket. The ticket then opens into your home page.'),
    pages: {
      home: msg('Your names over a travel poster, the invitation beside your portrait with a luggage tag, a departure countdown and a map whose route draws itself as guests scroll.'),
      story: msg('Three photos in carriage windows on green panelling. As guests scroll, each photo glides past its window like passing scenery.'),
      details: msg('The day as stations along a route on an antique map, one by one, then the venue, an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A boarding pass with your reply-by date and the shared configurable reply form; a sent reply gets a boarding stamp.'),
    },
    palette: [
      { name: msg('Bottle green'), hex: '#1E3A2C' },
      { name: msg('Brass'), hex: '#B8914B' },
      { name: msg('Ivory'), hex: '#F3EBD9' },
      { name: msg('Route red'), hex: '#8C2F39' },
    ],
    fonts: ['Limelight', 'Cormorant Garamond'],
    llmsLine: 'a vintage rail journey: a leather ticket wallet opens to a first-class ticket; a route line draws across an antique map; carriage-window photos.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G175 (coming): written against the theme as built (G164); the paper pieces are interim until the GPT parts arrive.
  'kintsugi-washi': {
    id: 'kintsugi-washi',
    collection: '26_Kintsugi_Washi',
    demoCouple: 'Naomi & Kai',
    style: msg('Indigo washi paper folded like origami around a rice-paper card, fine gold veins and photos that appear like spreading ink'),
    metaDescription: msg('A wedding website wrapped in folded indigo washi paper: the folds open one by one to your invitation card. Personalize it in your online editor.'),
    intro: msg('Deep indigo washi, ivory rice paper and gold leaf, with the calm of sumi ink. Your invitation waits inside folded paper, and every photo appears like ink spreading on paper.'),
    opening: msg('Your guests tap the origami. The paper band slides off and the indigo folds open one by one, top, bottom, left and right, until the rice-paper card with your photo lifts out and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait, names, date and venue on a rice-paper card on indigo, then the invitation on a rice-paper band, a countdown and calendar links.'),
      story: msg('Three moments, left, right and left again; each photo appears like ink spreading on paper as guests scroll to it.'),
      details: msg('The order of the day on rice paper, a venue photo that appears like ink, an optional map and directions, travel, menu, registry and questions and answers.'),
      rsvp: msg('A rice-paper reply card with your reply-by date and the shared configurable reply form.'),
    },
    palette: [
      { name: msg('Indigo'), hex: '#242E58' },
      { name: msg('Night'), hex: '#161C36' },
      { name: msg('Rice paper'), hex: '#F3ECDC' },
      { name: msg('Gold'), hex: '#C9A55A' },
    ],
    fonts: ['Shippori Mincho', 'Allura'],
    llmsLine: 'indigo washi paper folded like origami around a rice-paper card; the folds open one by one; fine gold veins and photos that appear like spreading ink.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G165 (coming): written against the theme as built; the doors and tiles are interim pieces until the GPT parts arrive.
  'riad-lantern-nights': {
    id: 'riad-lantern-nights',
    collection: '27_Riad_Lantern_Nights',
    demoCouple: 'Leila & Adrian',
    style: msg('A lantern-lit riad: cedar double doors, zellige tiles in teal and saffron, and photos in tall windows'),
    metaDescription: msg('A riad wedding website: cedar doors swing open into lantern light, zellige tiles and photos in tall windows. Personalize it in your online editor.'),
    intro: msg('Teal walls, saffron lantern light and warm cedar. Your names wait behind a pair of doors; inside, the invitation, a row of zellige tiles and your photos in tall windows.'),
    opening: msg('Your guests tap the door. Its two cedar leaves swing into the courtyard, lantern light pours out and a separate ivory card with your photo comes forward through the doorway. The card then opens into your home page.'),
    pages: {
      home: msg('Your portrait and names on an ivory card in the lantern light, then a row of zellige tiles, the invitation, a countdown and calendar links.'),
      story: msg('Three tall windows: each photo comes out of the dark as the lantern light reaches it. Each opens larger in a quiet viewer.'),
      details: msg('The evening hour by hour on the teal wall, a venue photo in warm light, with an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A reply panel under the lantern’s glow, with your reply-by date and the shared configurable reply form.'),
    },
    palette: [
      { name: msg('Night teal'), hex: '#0F2F31' },
      { name: msg('Saffron'), hex: '#E3A54A' },
      { name: msg('Brass'), hex: '#C9A35B' },
      { name: msg('Cedar'), hex: '#3A2114' },
    ],
    fonts: ['Cinzel', 'Marcellus SC', 'Marcellus'],
    llmsLine: 'a lantern-lit riad: cedar doors swing open into the courtyard, zellige tiles in teal and saffron and photos in tall windows.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'maison-patisserie': {
    id: 'maison-patisserie',
    collection: '28_Maison_Patisserie',
    demoCouple: 'Camille & Oliver',
    style: msg('A pistachio pâtisserie box tied with a rose satin bow, photos on display-case shelves and a menu set out like a pastry counter'),
    metaDescription: msg('A pistachio pâtisserie box with a satin bow opens into your wedding website: photos on display-case shelves. Personalize it in your online editor.'),
    intro: msg('Pistachio, rose and cream with a little gold, like the window of a Paris pâtisserie. Your invitation waits inside a ribbon-tied box, your photos stand on glass shelves.'),
    opening: msg('Your guests tap the box. The satin bow unties, the ribbon slides away and the lid lifts off. The tissue paper parts and a separate card with your photo comes forward to become your home page.'),
    pages: {
      home: msg('The card from the box with your portrait, names and date, then the invitation, a countdown and calendar links.'),
      story: msg('Three photos on a display-case shelf: guests swipe or drag them along, and the photo in the middle steps forward.'),
      details: msg('The order of the day on card paper beside the venue photo, an optional map, dress code, travel and a menu set out like a display case.'),
      rsvp: msg('A reply card with macaron-coloured choices; a light shower of sugar pearls when a reply is sent.'),
    },
    palette: [
      { name: msg('Pistachio'), hex: '#A9C49C' },
      { name: msg('Rose'), hex: '#E8B4B8' },
      { name: msg('Cream'), hex: '#FBF5EC' },
      { name: msg('Gold'), hex: '#B8995A' },
    ],
    fonts: ['Italiana', 'Parisienne'],
    llmsLine: 'a pistachio pâtisserie box tied with a rose satin bow; photos on display-case shelves and a menu like a pastry counter.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G168 (coming): written against the theme as built (README); the stars, star chart and brass rims arrive with the GPT parts.
  'celestial-observatory': {
    id: 'celestial-observatory',
    collection: '29_Celestial_Observatory',
    demoCouple: 'Celeste & Rowan',
    style: msg('A brass observatory under a midnight sky, a constellation of your initials, round star-map photo frames and gold'),
    metaDescription: msg('A brass observatory opens onto the night sky and into your wedding website, with your initials traced as a constellation. Personalize it in your online editor.'),
    intro: msg('Midnight blue, silver-ivory chart paper, antique brass and gold leaf, like the pages of an old star atlas. Your invitation waits inside a small observatory, and every photo sits in a round star-map frame.'),
    opening: msg('Your guests tap the dome. The two halves of its slit shutter slide apart onto the night sky, a soft light rises from it, and a fine constellation line traces your initials above it. The card with your portrait rises out of the dome and comes forward to become your home page.'),
    pages: {
      home: msg('Your round portrait and names on a chart-paper card under the night sky, then the invitation, a countdown, calendar links and your initials traced again as a constellation.'),
      story: msg('Three round photos, each uncovered by a sweep that turns once round it like a star dial as guests scroll to it.'),
      details: msg('The order of the day on chart paper, a venue photo swept in like the beam of a telescope, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A chart-paper reply card under the midnight sky with your names and reply-by date, then the reply form.'),
    },
    palette: [
      { name: msg('Midnight'), hex: '#11193A' },
      { name: msg('Silver'), hex: '#C9CFDC' },
      { name: msg('Brass'), hex: '#9B7A3C' },
      { name: msg('Gold'), hex: '#C8A24E' },
      { name: msg('Ivory'), hex: '#EEEBE3' },
    ],
    fonts: ['Imperial Script', 'Forum'],
    llmsLine: "a brass observatory dome whose slit opens onto the night sky while a constellation line traces the couple's initials; round star-map photo frames; midnight, silver and gold.",
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G169 (coming): written against the theme as built; the tiles are interim pieces until the GPT parts arrive.
  'azulejo-mosaic': {
    id: 'azulejo-mosaic',
    collection: '30_Azulejo_Mosaic',
    demoCouple: 'Inês & Mateo',
    style: msg('A wall of blue-and-white azulejo tiles that turn over one by one, terracotta and whitewash, and photos revealed tile by tile'),
    metaDescription: msg('A wall of painted azulejo tiles turns over, tile by tile, into your wedding website. Personalize it in your online editor.'),
    intro: msg('Cobalt and white painted tiles, warm terracotta and sunlit whitewash. Your invitation waits behind a wall of azulejos, and every photo is uncovered tile by tile.'),
    opening: msg('Your guests tap the wall. The blue-and-white tiles turn over one by one in a wave that starts where they touched, each showing its terracotta back as it lifts away. The card that was behind them comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait and names on a card on the cobalt wall, a frieze of tiles, then the invitation, a countdown and calendar links.'),
      story: msg('Three photos, each hidden under a small mosaic of tiles that turn over in a wave as guests scroll to it.'),
      details: msg('The order of the day on a white card, a venue photo uncovered tile by tile, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A white reply card under a frieze of tiles; when a reply is sent, the thank-you is revealed tile by tile.'),
    },
    palette: [
      { name: msg('Cobalt'), hex: '#1F4A9E' },
      { name: msg('Night blue'), hex: '#102554' },
      { name: msg('Whitewash'), hex: '#F2EDE3' },
      { name: msg('Terracotta'), hex: '#AE583A' },
    ],
    fonts: ['Arizonia', 'Cormorant Upright'],
    llmsLine: 'a wall of blue-and-white azulejo tiles that turn over one by one to reveal the invitation; photos uncovered tile by tile; cobalt, whitewash and terracotta.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G170 (coming): written against the theme as built; the lantern, hands and card are interim pieces until the GPT parts arrive.
  'sky-lantern-festival': {
    id: 'sky-lantern-festival',
    collection: '31_Sky_Lantern_Festival',
    demoCouple: 'Sophie & Daniel',
    style: msg('A paper lantern at dusk: a violet-to-amber watercolor sky, rice-paper lanterns and photos that light up one by one'),
    metaDescription: msg('A sky lantern wedding website: a paper lantern glows and rises into a dusk sky, and your photos light up in its glow. Personalize it in your online editor.'),
    intro: msg('Deep violet, dusky rose and lantern amber, like the sky in the last minutes of the day. Your names wait under a paper lantern; your photos light up in the glow of rising lanterns.'),
    opening: msg('Your guests tap the lantern. It glows warm in the cupped hands, the hands let go and the lantern rises into the dusk sky while distant lanterns drift up behind it. In its light a rice-paper card with your photo appears and opens into your home page.'),
    pages: {
      home: msg('Your portrait and names on a rice-paper card in the dusk sky, then the invitation, a countdown and calendar links, with a few lanterns drifting up as guests scroll.'),
      story: msg('Three photos along a path of lanterns: each waits in the dark until a small lantern rises past it and its light opens the photo.'),
      details: msg('The evening hour by hour, each line with a small lantern that lights up in turn, a venue photo, an optional map and directions, calendar links, dress code and questions and answers.'),
      rsvp: msg('A reply panel under a warm lantern glow; when a reply is sent, one lantern rises up the screen.'),
    },
    palette: [
      { name: msg('Dusk violet'), hex: '#2B1F45' },
      { name: msg('Lantern amber'), hex: '#F2A65A' },
      { name: msg('Dusky rose'), hex: '#E7B4A6' },
      { name: msg('Rice paper'), hex: '#F7EEDD' },
    ],
    fonts: ['Bellefair', 'Corinthia'],
    llmsLine: 'a paper lantern glows and rises into a violet-to-amber dusk sky; photos light up in the glow of rising lanterns.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'music-box-ballerina': {
    id: 'music-box-ballerina',
    collection: '32_Music_Box_Ballerina',
    demoCouple: 'Juliette & Arthur',
    style: msg('A rose-quartz music box with a brass wind-up key, a little ballerina and your photos in its oval mirror'),
    metaDescription: msg('A rose-quartz music box opens into your wedding website: a ballerina turns and your photos appear in its mirror. Personalize it in your online editor.'),
    intro: msg('Rose quartz, blush satin and soft gold, like a keepsake music box. Your invitation waits inside, a little ballerina turns, and your photos appear in the mirror of the lid.'),
    opening: msg('Your guests tap the box. The brass key turns, the lid swings up and its mirror shows your portrait, a ballerina rises and turns slowly while a few rose petals drift down, and a separate card comes forward to become your home page.'),
    pages: {
      home: msg('The card from the music box with your names and date, then the invitation beside your portrait in an oval mirror, a countdown and calendar links.'),
      story: msg('Your three photos appear one at a time in the music box mirror: guests swipe or tap the arrows, and the little ballerina turns with each photo.'),
      details: msg('The order of the day on blush satin beside the venue photo, an optional map, dress code, travel and the menu.'),
      rsvp: msg('A reply card on blush satin; a few rose petals drift down and the ballerina turns once when a reply is sent.'),
    },
    palette: [
      { name: msg('Rose quartz'), hex: '#EECDD0' },
      { name: msg('Blush'), hex: '#F7E4E2' },
      { name: msg('Rose gold'), hex: '#B76E79' },
      { name: msg('Gold'), hex: '#C9A45C' },
    ],
    fonts: ['Ballet', 'Gilda Display'],
    llmsLine: 'a rose-quartz music box: turn the brass key, the lid opens, a ballerina turns and the photos appear in its oval mirror.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G182 (coming): written against the theme as built (README); the paisley sleeve, tassel, marigolds, henna, arches and
  // diyas arrive with the GPT parts.
  'marigold-mehndi': {
    id: 'marigold-mehndi',
    collection: '33_Marigold_Mehndi',
    demoCouple: 'Anaya & Kabir',
    style: msg('A fuchsia silk envelope in a gold paisley sleeve with a silk tassel, marigold garlands, henna and carved arch photo frames'),
    metaDescription: msg('A fuchsia silk envelope slips out of its gold paisley sleeve and opens into your wedding website, with marigolds, henna and carved arch frames. Personalize it in your online editor.'),
    intro: msg('Saffron, fuchsia and gold, like a festive silk invitation. Your invitation waits in a silk envelope held by a laser-cut gold sleeve, and every photo sits in a carved arch window traced with henna.'),
    opening: msg('Your guests tap the envelope. Its silk tassel swings, the gold paisley sleeve slides away, the flap opens onto a velvet lining and marigold petals drift down while small lamps light one by one. The card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait in a carved arch and your names on a saffron card under a marigold garland, then the invitation, a countdown and calendar links, with a row of lamps that light one by one.'),
      story: msg('Three photos in carved arch windows; as guests scroll to each one, it appears from the bottom up and henna flows in around its arch, line by line.'),
      details: msg('The order of the day on saffron paper, a venue photo revealed like a henna line drawn across, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A saffron reply card on fuchsia velvet with your names and reply-by date; marigold petals fall when a reply is sent.'),
    },
    palette: [
      { name: msg('Fuchsia'), hex: '#B3165E' },
      { name: msg('Saffron'), hex: '#F2A13B' },
      { name: msg('Gold'), hex: '#C9A24A' },
      { name: msg('Velvet plum'), hex: '#3E0726' },
      { name: msg('Saffron ivory'), hex: '#FAEBD0' },
    ],
    fonts: ['Rozha One', 'Yrsa'],
    llmsLine: 'a fuchsia silk envelope in a gold laser-cut paisley sleeve: the tassel swings, the sleeve slides off and the card rises from a velvet lining; carved arch photo frames traced with henna; saffron, fuchsia and gold.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G183 (coming): written against the theme as built (README); the cord, the paper-cut windows, the moon gates and the
  // gold clouds arrive with the GPT parts.
  'red-lacquer-double-happiness': {
    id: 'red-lacquer-double-happiness',
    collection: '34_Red_Lacquer_Double_Happiness',
    demoCouple: 'Mei & Julian',
    style: msg('A red paper envelope with a gold-leaf double happiness, a cord-and-button closure, paper-cut peonies and round moon gate photo frames'),
    metaDescription: msg('A red paper envelope tied with a cord opens through paper-cut peony windows into your wedding website. Personalize it in your online editor.'),
    intro: msg('Lacquer red, warm cream and gold leaf, with paper-cut peonies and the double happiness character in gold. Your invitation waits in a red envelope tied with a cord, and every photo sits in a round moon gate.'),
    opening: msg('Your guests tap the envelope. The red cord unwinds as its button turns and slips away, the flap lifts, and the card comes up wrapped in two paper-cut peony windows that open one after the other while gold clouds drift past. The card comes forward to become your home page.'),
    pages: {
      home: msg('Your round portrait and names on a cream card on the lacquer red, then the invitation under a paper-cut border, a countdown, calendar links and a knot with its tassel.'),
      story: msg('Three round photos in moon gates; the two red paper doors of each gate slide apart as guests scroll to it, while paper-cut layers drift at two speeds behind the page.'),
      details: msg('The order of the day on cream paper, a venue photo uncovered by two sliding lattice doors, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A cream reply card on the lacquer red with your names and reply-by date, then the reply form; a few gold clouds rise when a reply is sent.'),
    },
    palette: [
      { name: msg('Lacquer red'), hex: '#4A0A0E' },
      { name: msg('Cinnabar'), hex: '#A81E24' },
      { name: msg('Gold'), hex: '#C9A14A' },
      { name: msg('Cream'), hex: '#F5ECD8' },
    ],
    fonts: ['Luxurious Script', 'Prata'],
    llmsLine: 'a red paper envelope with a gold-leaf double happiness and a cord-and-button closure, opening through paper-cut peony windows; round moon gate photo frames; lacquer red, cream and gold.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G184 (coming): written against the theme as built; the wool, leather, brass and mist are interim pieces until the GPT parts arrive.
  'highland-tartan-thistle': {
    id: 'highland-tartan-thistle',
    collection: '35_Highland_Tartan_Thistle',
    demoCouple: 'Isla & Callum',
    style: msg('A wool envelope strapped with leather and a brass buckle, heather and thistle, Highland mist and antique locket photo frames'),
    metaDescription: msg('A wool envelope with a leather strap and brass buckle opens over misty hills into your wedding website. Personalize it in your online editor.'),
    intro: msg('Heather, moss green and cream, warm leather and antique brass, like a walk through the Highlands. Your invitation waits in a wool envelope held shut by a buckled strap, and every photo sits in a brass locket.'),
    opening: msg('Your guests tap the envelope. The brass buckle opens, the leather strap slides away and the wool flap swings up, while the mist over the hills behind it draws off. The card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait in a brass locket and your names on a cream card over the misty hills, then the invitation, a countdown and calendar links.'),
      story: msg('Three photos in antique brass lockets whose lids swing open on their hinges as guests scroll to them, with mist drifting behind the page.'),
      details: msg('The order of the day on cream paper, a venue photo that comes out of the mist, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A cream reply card over the moss-green page with your names and reply-by date, then the reply form.'),
    },
    palette: [
      { name: msg('Heather'), hex: '#7B5A84' },
      { name: msg('Moss'), hex: '#5E6B3E' },
      { name: msg('Cream'), hex: '#F1EADB' },
      { name: msg('Leather'), hex: '#6B4428' },
      { name: msg('Brass'), hex: '#A88437' },
    ],
    fonts: ['Rouge Script', 'Sorts Mill Goudy'],
    llmsLine: 'a tartan wool envelope held shut by a leather strap and brass buckle; the buckle opens, the strap slides away and the flap swings up as Highland mist draws off; photos in brass lockets; heather, moss and cream.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G185 (coming): written against the theme as built (README); the ferns, iron arches, glass cases and leaflets arrive with the GPT parts.
  'victorian-glasshouse': {
    id: 'victorian-glasshouse',
    collection: '36_Victorian_Glasshouse',
    demoCouple: 'Flora & Edmund',
    style: msg('A Victorian glasshouse at dusk: a kraft seed packet tied with twine and a copper plant label, misted glass and photos as specimens under glass'),
    metaDescription: msg('A kraft seed packet opens into your wedding website in a Victorian glasshouse, and the mist on the glass is wiped away. Personalize it in your online editor.'),
    intro: msg('Deep fern green, misted glass, herbarium paper and copper, like an old botanical glasshouse. Your invitation waits in a kraft seed packet, and every photo is a specimen under glass with its own copper label.'),
    opening: msg('Your guests tap the envelope. The copper plant label swings and drops from the twine, the twine comes apart at the knot and the flap of the kraft seed packet folds back. Warm air mists the glass as the card with your portrait rises; the mist is wiped away across the screen and the card comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait under glass on a herbarium card, then the invitation, a countdown and calendar links, and a copper label with your monogram that swings as guests scroll.'),
      story: msg('Three photos as specimens under glass: as guests scroll to each one, the mist on its glass is wiped away, its copper label swings and the caption appears on a herbarium label.'),
      details: msg('The order of the day on herbarium paper, a venue photo behind misted glass that clears, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A herbarium-paper reply card with your names and reply-by date, then the reply form; the copper label swings again when a reply is sent.'),
    },
    palette: [
      { name: msg('Deep fern'), hex: '#1C3328' },
      { name: msg('Misted glass'), hex: '#E2EAE3' },
      { name: msg('Herbarium paper'), hex: '#F3EDDF' },
      { name: msg('Copper'), hex: '#B26A3C' },
      { name: msg('Kraft'), hex: '#AC8054' },
    ],
    fonts: ['Monsieur La Doulaise', 'Old Standard TT'],
    llmsLine: 'a kraft seed-packet envelope tied with twine and a copper plant label opens in a Victorian glasshouse; the mist on the glass is wiped away; photos as specimens under glass.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G186 (coming): written against the theme as built (README); the petal art, stained glass, halo and lilies arrive with the GPT parts.
  'art-nouveau-lily': {
    id: 'art-nouveau-lily',
    collection: '37_Art_Nouveau_Lily',
    demoCouple: 'Odette & Felix',
    style: msg('A cream envelope with petal flaps and a stained-glass lily, sage and lilac, gold whiplash lines and arched stained-glass photo windows'),
    metaDescription: msg('A cream Art Nouveau envelope opens like a lily into your wedding website, with stained-glass photo windows. Personalize it in your online editor.'),
    intro: msg('Sage, cream, lilac and gold, like an Art Nouveau poster. Your invitation waits in a cream envelope closed by three petal flaps under a stained-glass lily, and every photo sits in an arched stained-glass window.'),
    opening: msg('Your guests tap the envelope. A band of light passes through the stained-glass lily, the medallion lifts away, the two side petals open outward and the centre petal opens upward, like a lily in bloom. The card with your portrait rises from the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your arched portrait and names on a cream card, like a poster, then the invitation under a gold line that draws itself, a countdown and calendar links.'),
      story: msg('Three photos in arched windows that wait gray like glass at dusk; as guests scroll to each, a band of light passes through it and its colors come alive.'),
      details: msg('The order of the day on cream paper, the venue photo lit by a passing band of light, an optional map, dress code, travel and questions and answers.'),
      rsvp: msg('A cream reply card with your names and reply-by date, then the reply form; a few lily petals drift down when a reply is sent.'),
    },
    palette: [
      { name: msg('Sage'), hex: '#55634E' },
      { name: msg('Cream'), hex: '#F4ECDB' },
      { name: msg('Lilac'), hex: '#C8B6D6' },
      { name: msg('Gold'), hex: '#B8964E' },
    ],
    fonts: ['Federant', 'Ephesis', 'Linden Hill'],
    llmsLine: 'a cream Art Nouveau envelope closed by three petal flaps under a stained-glass lily opens like a flower; photos in arched stained-glass windows that light up; sage, lilac and gold.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G187 (coming): written against the theme as built; the flags, frames and envelope are interim pieces until the GPT parts arrive.
  'papel-picado-fiesta': {
    id: 'papel-picado-fiesta',
    collection: '38_Papel_Picado_Fiesta',
    demoCouple: 'Valeria & Diego',
    style: msg('A kraft envelope tied with a band of cut-paper flags, terracotta, bougainvillea colours and photos in swaying paper frames'),
    metaDescription: msg('A papel picado wedding website: a band of cut-paper flags flies up into a waving garland and the kraft envelope opens to your invitation. Personalize it in your online editor.'),
    intro: msg('Fuchsia, marigold, turquoise and terracotta on a sunny limewash wall, like a courtyard dressed for a fiesta. Your invitation waits in a kraft envelope, and every photo hangs in a cut-paper frame that sways in the breeze.'),
    opening: msg('Your guests tap the envelope. The band of cut-paper flags works loose and its flags fly up one by one into a garland that waves above your names, the kraft flap swings open, and the card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait in a cut-paper frame on a cream card under the garland, then the invitation, a countdown and calendar links, and the day on a terracotta band.'),
      story: msg('Three photos in cut-paper frames that drop in and swing to rest as guests scroll, and sway a little more when they scroll faster.'),
      details: msg('The order of the day on kraft paper, each moment with a small flag that swings in, a venue photo in a wide frame, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('A cream reply card under a small garland of flags; when a reply is sent, a few flags flutter down.'),
    },
    palette: [
      { name: msg('Fuchsia'), hex: '#D63A7A' },
      { name: msg('Marigold'), hex: '#F2A31B' },
      { name: msg('Turquoise'), hex: '#1C8F9C' },
      { name: msg('Terracotta'), hex: '#B0502F' },
    ],
    fonts: ['Oleo Script', 'Alegreya'],
    llmsLine: 'a kraft envelope tied with a band of papel picado flags that fly up into a waving garland; photos hang in cut-paper frames that sway in the breeze; fuchsia, marigold, turquoise and terracotta.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G439 (coming): written against the theme as built from the design's own GPT parts (fourth wave pilot).
  'silver-photo-booth': {
    id: 'silver-photo-booth',
    collection: '39_Silver_Photo_Booth',
    demoCouple: 'Josephine & Miles',
    style: msg('A pearl-silver envelope wrapped in a black-and-white photo-booth strip, chrome booth frames and photos that develop after a camera flash'),
    metaDescription: msg('A vintage photo booth wedding website: a camera flash, a photo strip slides off a pearl-silver envelope and your invitation rises out of it. Personalize it in your online editor.'),
    intro: msg('Pearl-grey satin, ivory card stock, polished chrome and black and white, like the photo booth in the corner of a 1940s hotel ballroom. Your invitation waits in a silver envelope wrapped in a strip of your own photos.'),
    opening: msg('Your guests tap the envelope. The flashbulb fires, the photo strip with your pictures slides off the envelope and settles beside it, the silver flap swings open, and the card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait in a chrome booth window on an ivory card, then the invitation, a countdown and calendar links, a strip of three photos that prints out of the booth\'s slot, and the day on a black star-dust band.'),
      story: msg('Three photos in chrome booth windows, each one developing after a flash as guests scroll.'),
      details: msg('The order of the day on ivory card stock, each moment with a twinkling silver star, the venue as a deckled print, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('An ivory reply card under a strand of silver stars; when a reply is sent, the booth flashes four times and stars, petals and ribbons fall.'),
    },
    palette: [
      { name: msg('Silver'), hex: '#B9BCC0' },
      { name: msg('Ivory'), hex: '#F5F0E6' },
      { name: msg('Charcoal'), hex: '#45474B' },
      { name: msg('Ink'), hex: '#141414' },
    ],
    fonts: ['Yesteryear', 'Libre Caslon Text'],
    llmsLine: 'a pearl-silver envelope wrapped in a black-and-white photo-booth strip of the couple\'s own photos; a camera flash, the strip slides off and the card rises; photos develop in chrome booth windows; pearl, ivory, silver and black.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G440 (coming): written against the theme as built from the design's own GPT parts (fourth wave).
  'swan-chantilly-lace': {
    id: 'swan-chantilly-lace',
    collection: '40_Swan_Chantilly_Lace',
    demoCouple: 'Beatrice & Alistair',
    style: msg('A square ivory envelope under Chantilly lace with a swan wax seal and black silk ribbons, and black-and-white prints under lace veils'),
    metaDescription: msg('An Old Money lace and swan wedding website: the swan seal lifts, the Chantilly lace rises like a veil and your invitation comes out of the envelope. Personalize it in your online editor.'),
    intro: msg('Ivory cotton, fine Chantilly lace, black silk and a pair of swans, like a quiet house by a lake. Your invitation waits in a square envelope sealed with a swan, and every photo is a black-and-white print under its own lace veil.'),
    opening: msg('Your guests tap the envelope. The swan seal lifts away, the black silk ribbons slip free, the lace rises off the envelope like a bridal veil, the flap opens onto black silk, and the card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait as a black-and-white print on an ivory card under a black silk bow and lily of the valley, then the invitation between strips of lace, a countdown and calendar links, and the day on a black silk band.'),
      story: msg('Three black-and-white prints, each under a lace veil that lifts off as guests scroll.'),
      details: msg('The order of the day on ivory cotton, each moment with a lily-of-the-valley bell that swings in, the venue as a wide print under lace, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('An ivory reply card edged with Chantilly lace; when a reply is sent, swan feathers and lily-of-the-valley bells drift down.'),
    },
    palette: [
      { name: msg('Ivory'), hex: '#F4EEE2' },
      { name: msg('Champagne'), hex: '#DCD3C3' },
      { name: msg('Ink'), hex: '#1B1A18' },
      { name: msg('Antique gold'), hex: '#B9A274' },
    ],
    fonts: ['Bonheur Royale', 'Crimson Pro'],
    llmsLine: 'a square ivory envelope under Chantilly lace, sealed with a swan wax seal over black silk ribbons; the lace lifts like a veil and the card rises; black-and-white prints under lace veils; ivory, black silk and swans.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G443 (coming): written against the theme as built from the design's own GPT parts (fourth wave).
  'chartreuse-garden-party': {
    id: 'chartreuse-garden-party',
    collection: '43_Chartreuse_Garden_Party',
    demoCouple: 'Poppy & Hugo',
    style: msg('A landscape chartreuse envelope held shut by a single pink ranunculus, hand-painted gouache flowers and black-and-white instant prints on gold florist picks'),
    metaDescription: msg('A chartreuse garden party wedding website: the ranunculus slides out, gouache flowers burst open and your invitation rises out of the envelope. Personalize it in your online editor.'),
    intro: msg('Bright chartreuse paper, cream cotton and hand-painted gouache peonies, ranunculus, sweet peas and burgundy cosmos, like a spring party in the garden. Your invitation waits in a scalloped envelope, and every photo is a black-and-white instant print that rises out of a flower arrangement.'),
    opening: msg('Your guests tap the envelope. The pink ranunculus slides its stem out of the flap and tumbles away, the scalloped flap opens onto a lining of painted flowers, four flower clusters burst out one after another, and the card with your portrait turns upright as it rises out of the envelope to become your home page.'),
    pages: {
      home: msg('Your portrait as a black-and-white instant print on a cream card with painted flowers at two corners, then the invitation between garlands of small flowers, a countdown and calendar links, three prints rising out of a flower arrangement and the day on a chartreuse band.'),
      story: msg('Three black-and-white instant prints, each rising on a gold florist pick out of its own flower arrangement as guests scroll.'),
      details: msg('The order of the day on a cream card, each moment with a burgundy cosmos that spins open, the venue as a wide instant print, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('A cream reply card under a garland of painted flowers; when a reply is sent, peony petals, lady\'s mantle sprigs and cosmos rain down.'),
    },
    palette: [
      { name: msg('Chartreuse'), hex: '#C7CF3C' },
      { name: msg('Peony pink'), hex: '#F1A9C0' },
      { name: msg('Burgundy'), hex: '#6B1730' },
      { name: msg('Cream'), hex: '#FBF6EA' },
    ],
    fonts: ['Hurricane', 'Fraunces'],
    llmsLine: 'a landscape chartreuse envelope with a scalloped flap held shut by a pink ranunculus; gouache flower clusters burst out and the card rises; black-and-white instant prints rising on gold florist picks out of flower arrangements; chartreuse, peony pink and burgundy.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G446 (coming): written against the theme as built from the design's own GPT parts (fourth wave).
  'bordeaux-silk-bow': {
    id: 'bordeaux-silk-bow',
    collection: '46_Bordeaux_Silk_Bow',
    demoCouple: 'Cecilia & Nathaniel',
    style: msg('A portrait ivory linen envelope tied with a big claret silk satin bow through two punched holes, white tulips, and black-and-white keepsake prints tied with ribbon'),
    metaDescription: msg('A claret silk bow and ivory wedding website: the bow unties loop by loop, the ribbon runs down the page and your invitation rises out of the envelope. Personalize it in your online editor.'),
    intro: msg('Ivory linen, glossy claret satin ribbon and white tulips, like a winter wedding at an old city club. Your invitation waits in a linen envelope tied with a generous bow, and your photos are black-and-white keepsake prints tied together with the same ribbon.'),
    opening: msg('Your guests tap the envelope. The claret bow unties loop by loop, the ribbon is drawn up through the holes and runs on down the edge of the screen, the flap opens onto claret silk, and the card with your portrait rises out of the envelope and comes forward to become your home page.'),
    pages: {
      home: msg('Your portrait as a black-and-white keepsake print on an ivory card under a small claret bow with white tulips, the ribbon running on down the page edge, the invitation, a countdown and calendar links, a ribbon-tied deck of prints that fans open and the day on a claret silk band.'),
      story: msg('Three black-and-white keepsake prints, each tied with claret ribbon that loosens and slips off as guests scroll.'),
      details: msg('The order of the day on an ivory linen card, each moment with a small claret bow that ties itself, the venue as a wide keepsake print in colour, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('An ivory linen reply card under a small claret bow; when a reply is sent, the bow ties itself again and tulip petals and ribbon ends drift down.'),
    },
    palette: [
      { name: msg('Claret'), hex: '#7A1E2C' },
      { name: msg('Ivory'), hex: '#F7F1E6' },
      { name: msg('Linen'), hex: '#EADFCC' },
      { name: msg('Soft gold'), hex: '#BFA06A' },
    ],
    fonts: ['Carattere', 'Brygada 1918'],
    llmsLine: 'a portrait ivory linen envelope closed by a big claret silk satin bow through two punched holes; the bow unties loop by loop and the ribbon runs down the page; black-and-white keepsake prints tied with ribbon that fan open; ivory, claret and white tulips.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  // G447 (coming): written against the theme as built from the design's own GPT parts (fourth wave).
  'monochrome-darkroom': {
    id: 'monochrome-darkroom',
    collection: '47_Monochrome_Darkroom',
    demoCouple: 'Simone & Elliot',
    style: msg('A matte black light-tight photo paper envelope with a loop of 35 mm negative, a red safelight and black-and-white fibre prints that turn from negative to positive'),
    metaDescription: msg('A black-and-white film wedding website: the negative runs off as a strip, the room turns to the red of the safelight and your invitation develops in the tray. Personalize it in your online editor.'),
    intro: msg('Matte black photo paper, 35 mm negatives, a developing tray, a loupe and white anemones, like the darkroom of two people in love with film. Your invitation waits in a light-tight envelope, and every photo comes in as a negative and turns into a glossy black-and-white print.'),
    opening: msg('Your guests tap the envelope. The loop of negative runs off across the screen as a strip of your photos, the tuck flap comes out and opens, the room turns to the red of the safelight, and the card with your portrait develops in a tray before it becomes your home page.'),
    pages: {
      home: msg('A strip of negatives rolling along the top, your portrait as a fibre print on a white card with anemones, the invitation, a countdown and calendar links, a print that turns from negative to positive and the day under the red of the safelight.'),
      story: msg('A contact strip with a loupe that follows the finger, then three fibre prints that turn from negative to positive as guests scroll.'),
      details: msg('The order of the day on white fibre paper, each moment with a film frame, the venue as a wide fibre print, an optional map, dress code, travel, the menu and questions and answers.'),
      rsvp: msg('A white fibre reply card under a strip of negative; when a reply is sent, the shutter closes and opens frame by frame and anemone petals drift down.'),
    },
    palette: [
      { name: msg('Noir'), hex: '#121212' },
      { name: msg('Charcoal'), hex: '#2A2A2A' },
      { name: msg('Paper white'), hex: '#F4F2EE' },
      { name: msg('Safelight red'), hex: '#A3262A' },
    ],
    fonts: ['Herr Von Muellerhoff', 'Newsreader'],
    llmsLine: 'a matte black light-tight photo paper envelope with a tuck flap and a loop of 35 mm negative; the negative runs off as a strip, a red safelight, the card develops in a tray; black-and-white fibre prints that turn from negative to positive; a loupe over a contact strip.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'blush-garden-rose': {
    id: 'blush-garden-rose',
    collection: '03_Blush_Garden_Rose',
    demoCouple: 'Clara & Julian',
    style: msg('Blush pink envelope with a ribbon bow, peonies, garden roses and gold arched frames'),
    metaDescription:
      msg('A blush envelope tied with a ribbon bow opens into your wedding website: peonies, garden roses and gold arched photo frames. Edit it on your phone.'),
    intro:
      msg('A soft blush envelope tied with a wide ribbon bow, surrounded by painterly peonies and garden roses. Inside: arched cards, gold frames and a romantic script.'),
    opening:
      msg('Your guests tap the envelope. The bow slides away, the flap lifts, and an arched card with your portrait rises out of the envelope and comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in an arched card, your names, date, venue and a live countdown, then the invitation card.'),
      story: msg('Three photos in gold arch frames, each with a caption.'),
      details: msg('An "Order of the Day" card, dress code, the venue photo in a gold frame, links and questions and answers.'),
      rsvp: msg('A floral reply card with your deadline, followed by the reply form.'),
    },
    palette: [
      { name: msg('Blush'), hex: '#E3A9AE' },
      { name: msg('Rose'), hex: '#9B5D66' },
      { name: msg('Ivory'), hex: '#FFF9F6' },
      { name: msg('Gold'), hex: '#C8A46E' },
      { name: msg('Sage'), hex: '#9DAE93' },
    ],
    fonts: ['Great Vibes', 'Cormorant Garamond', 'Lora'],
    llmsLine: 'blush envelope tied with a ribbon bow; peonies, garden roses and gold arched photo frames.',
    relatedGuides: ['wedding-website-wording', 'what-to-put-on-your-wedding-website'],
  },
  'olive-ivory': {
    id: 'olive-ivory',
    collection: '01_Olive_Ivory',
    demoCouple: 'Avery & Jordan',
    style: msg('Olive green envelope with an ivory lace edge, a wax seal with your initials and olive branches'),
    metaDescription:
      msg('An olive envelope with a lace edge and a wax seal opens into your wedding website: olive branches, white roses and gold frames. Edit it on your phone.'),
    intro:
      msg('An olive green envelope with an ivory lace edge, closed with a wax seal that carries your initials. Inside: olive branches, white roses, ivory cards and gold frames.'),
    opening:
      msg('Your guests tap the envelope. The flap lifts together with the wax seal, a framed card with your portrait glides out of the envelope, two olive leaves drift across the screen, and the card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait card, your names, date, venue, a live countdown and an RSVP button, then the invitation card.'),
      story: msg('Three gold-framed photo cards fanned like a hand of cards; guests swipe through them on a phone.'),
      details: msg('An "Order of the Day" card, add to calendar, the venue photo in a gold frame, dress code, links and questions and answers.'),
      rsvp: msg('An ivory reply card with a wax seal, followed by the reply form.'),
    },
    palette: [
      { name: msg('Olive'), hex: '#5E6B45' },
      { name: msg('Leaf'), hex: '#7D8B5A' },
      { name: msg('Ivory'), hex: '#FBF8F0' },
      { name: msg('Linen'), hex: '#EDE4D0' },
      { name: msg('Gold'), hex: '#B39A63' },
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
    style: msg('White envelope with a cobalt scalloped edge and a lemon tie, blue-and-white tile frames and lemon branches'),
    metaDescription:
      msg('A white envelope tied with a lemon and a cobalt ribbon opens into your wedding website: blue-and-white tiles and lemon branches. Edit it on your phone.'),
    intro:
      msg('A white envelope with a cobalt blue scalloped edge, tied with a lemon on a blue ribbon, on a sunlit plaster wall with lemon branches. Inside: blue-and-white tile frames, scalloped cards and a flowing script.'),
    opening:
      msg('Your guests tap the envelope. The lemon tie slips loose and rolls off the screen, the flap lifts to show a blue-and-white tile lining, and a card with your portrait rises out of the envelope while a lemon branch sways in from the corner and a blossom drifts down. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a tile-framed card, your names, date, venue, a live countdown and an RSVP button, then the invitation card and two tile panels that lead to Our Story and Details.'),
      story: msg('Three photos in blue-and-white tile frames, one under the other; each turns into place as guests scroll, with a caption under it.'),
      details: msg('An "Order of the Day" card, add to calendar, the venue photo in a tile frame, dress code, links and questions and answers.'),
      rsvp: msg('A scalloped reply card with your reply-by date and a lemon tie, followed by the reply form.'),
    },
    palette: [
      { name: msg('Cobalt'), hex: '#2A5DA8' },
      { name: msg('Lemon'), hex: '#F2C94C' },
      { name: msg('Sky'), hex: '#DCE6F2' },
      { name: msg('Ivory'), hex: '#FFFDF7' },
      { name: msg('Navy'), hex: '#1F3557' },
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
    style: msg('Ivory envelope with a champagne gold edge and a dusty blue wax seal, cream roses, eucalyptus and instant-photo cards'),
    metaDescription:
      msg('An ivory envelope sealed with dusty blue wax opens into your wedding website: cream roses, eucalyptus and champagne gold ferns. Edit it on your phone.'),
    intro:
      msg('An ivory envelope with a champagne gold edge and a dusty blue wax seal that carries your initials, among cream roses, eucalyptus and gold ferns. Inside: instant-photo cards, a floral invitation card and an elegant script.'),
    opening:
      msg('Your guests tap the envelope. The dusty blue wax seal breaks off and spins down off the screen, the flap lifts to show a blue and gold damask lining, and a card with your portrait rises out of the envelope while a single eucalyptus leaf drifts down beside it. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a slightly tilted instant-photo card, your names, date, venue, a live countdown and an RSVP button, then the floral invitation card.'),
      story: msg("Three instant-photo prints fly in one after another and settle at gentle angles, each with its caption written in the print's margin."),
      details: msg('An "Order of the Day" card, the venue photo as a tilted print, dress code, add to calendar, links and questions and answers.'),
      rsvp: msg('A reply card with your reply-by date and a dusty blue wax seal pressed on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Dusty Blue'), hex: '#4E6782' },
      { name: msg('Powder Blue'), hex: '#CCDCEC' },
      { name: msg('Ivory'), hex: '#FBF7EF' },
      { name: msg('Champagne'), hex: '#B8996A' },
      { name: msg('Navy'), hex: '#2B3A4E' },
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
    style: msg('Red and navy striped airmail envelope with a burgundy wax seal, postage stamps, postmarks and pressed flowers'),
    metaDescription:
      msg('A striped airmail envelope sealed with burgundy wax opens into your wedding website: postage stamps, postmarks and pressed flowers. Edit it on your phone.'),
    intro:
      msg('A vintage airmail envelope with red and navy striped edges and a perforated tear strip, closed with a burgundy wax seal that carries your initials, among postage stamps, pressed flowers and twine. Inside: airmail letter cards, stamp-edged photo frames, a fountain-pen script and typewriter lettering.'),
    opening:
      msg('Your guests tap the envelope. The little wax seal pops off, the perforated tear strip rips away along the top edge from left to right, and a cream card with your portrait slides up out of the envelope while a pressed forget-me-not flutters down beside it. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on an airmail-striped card, your names, date, venue, a live countdown and an RSVP button, then the invitation letter and a stamp, a letter and a wax seal that lead to the other pages.'),
      story: msg('Three photos in postage-stamp frames drop onto a wooden writing desk one by one; the first gets a postmark, and each has a handwritten caption.'),
      details: msg('An "Order of the Day" letter with airmail stripes, add to calendar, the venue photo in a stamp-edged frame, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" letter with your reply-by date, signed with your names and sealed with burgundy wax and lavender, followed by the reply form.'),
    },
    palette: [
      { name: msg('Airmail Red'), hex: '#B5483E' },
      { name: msg('Navy'), hex: '#2B3753' },
      { name: msg('Parchment'), hex: '#E2CBAD' },
      { name: msg('Cream'), hex: '#F6ECDA' },
      { name: msg('Ink'), hex: '#4A1F1C' },
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
    style: msg('Navy two-door gatefold with a gold art deco medallion, gold fan rays, pearls and stepped deco arch frames'),
    metaDescription:
      msg('A navy gatefold with a gold medallion clasp opens like ballroom doors into your wedding website: gold rays and art deco arches. Edit it on your phone.'),
    intro:
      msg('A 1920s ballroom in navy velvet: thin gold rays fan out from the top, gold deco corners with pearls and a champagne coupe frame a two-door navy gatefold, closed with a gold medallion clasp around a pearl. Inside: stepped deco arch frames, navy cards with gold borders and tall deco capitals.'),
    opening:
      msg('Your guests tap the gatefold. The gold medallion clasp turns and lifts away, the two navy doors swing open to the sides like ballroom doors to show their fan-patterned insides, and a card with your portrait rises from the center pocket as a thin band of gold light sweeps across the screen. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a stepped deco arch on an ivory card, your names, date, venue, a live countdown and an RSVP button, then the navy invitation card with a gold fan crest and two gold deco frames that lead to Our Story and the details of the day.'),
      story: msg('Three photos in stepped art deco arch frames, set like a staircase on a phone; as guests scroll, each one turns from dark to light while a band of gold light sweeps across it, and its caption appears below.'),
      details: msg('An "Order of the Day" card with gold dividers between the rows, add to calendar, the venue photo in a wide stepped deco frame, dress code, links and questions and answers.'),
      rsvp: msg('A navy "Will You Join Us?" card with your reply-by date, signed with your names and closed with the gold medallion on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Navy'), hex: '#14213D' },
      { name: msg('Midnight'), hex: '#0A1729' },
      { name: msg('Gold'), hex: '#C9A55C' },
      { name: msg('Pale Gold'), hex: '#E6CF8F' },
      { name: msg('Ivory'), hex: '#F5EEDC' },
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
    style: msg('Ivory envelope wrapped in burgundy velvet ribbon, dahlias, blackberries, copper autumn leaves and oval gold frames'),
    metaDescription:
      msg('An ivory envelope wrapped in burgundy velvet ribbon opens into your wedding website: dahlias, autumn leaves and oval gold frames. Edit it on your phone.'),
    intro:
      msg('An ivory felt-textured envelope wrapped in burgundy velvet ribbon, tied in a bow with a little gold oak-leaf charm, on a warm peach plaster wall with soft candlelight and clusters of burgundy dahlias, roses, blackberries and copper leaves. Inside: oval gold frames, ivory cards and a flowing script.'),
    opening:
      msg('Your guests tap the envelope. The velvet bow unties and the ribbon slides off the sides of the envelope, the rectangular flap lifts to show a burgundy liner with gold leaves, and a card with your portrait rises in a warm candlelight glow while a single copper maple leaf drifts down beside it. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in an oval gold frame on an ivory card, your names, date, venue, a live countdown and an RSVP button, then the invitation card with dahlias and two oval gold frames, hung from velvet bows, that lead to Our Story and the details of the day.'),
      story: msg('Three photos in oval gold frames, each hanging from a burgundy velvet ribbon and bow; as guests scroll, each frame drops into place on its tie and then sways gently, with a script caption below.'),
      details: msg('An "Order of the Day" card with blackberry sprigs between the rows, add to calendar, the venue photo in an oval gold frame, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" card with your reply-by date, signed with your names and tied with a burgundy velvet bow on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Wine'), hex: '#6E1F2E' },
      { name: msg('Copper'), hex: '#7A391B' },
      { name: msg('Peach'), hex: '#F2D4BE' },
      { name: msg('Ivory'), hex: '#FBF5EE' },
      { name: msg('Gold'), hex: '#B88A4A' },
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
    style: msg('Forest green envelope with a snowy deckle edge, a pine-and-berry bundle, pine cones and frosted window frames'),
    metaDescription:
      msg('A forest green envelope sealed with pine and red berries opens into your wedding website: falling snow, pine cones and frosted windows. Edit it on your phone.'),
    intro:
      msg('A forest green envelope with a snowy white deckle edge on its flap, sealed with a bundle of pine, cedar and three red berries tied with a red velvet bow, among pine, juniper, winter berries and pine cones in a soft snowy mist. Inside: white wooden window frames, snowy white cards and a flowing script.'),
    opening:
      msg('Your guests tap the envelope. Soft snow begins to fall, the pine-and-berry bundle loosens and slides away down the screen, the green flap opens upward to show a white liner patterned with pine and red berries, and a card with your portrait rises while snowflakes drift across the screen. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a snowy white window frame on a white card, your names, date, venue, a live countdown and an RSVP button, then the invitation card with a pine garland and two snowy windows that lead to Our Story and the details of the day.'),
      story: msg('Three photos behind frosted panes in white wooden windows; as each window comes into view, the frost wipes clear from the middle and stays in the corners, with a script caption below.'),
      details: msg('An "Order of the Day" card with pine sprigs between the rows, add to calendar, the venue photo in a wide snowy window, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" card with your reply-by date and the same pine-and-berry bundle as the envelope in its middle, signed with your names, followed by the reply form.'),
    },
    palette: [
      { name: msg('Forest'), hex: '#2F5240' },
      { name: msg('Berry'), hex: '#8C1D26' },
      { name: msg('Mist'), hex: '#E3E8E7' },
      { name: msg('Snow'), hex: '#FAFAF6' },
      { name: msg('Pine Ink'), hex: '#1F2E26' },
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
    style: msg('Cream linen pouch tied with jute twine and a lavender bundle, pressed lavender, daisies and pressed-flower cards'),
    metaDescription:
      msg('A linen pouch tied with twine and a lavender bundle opens into your wedding website: pressed lavender, daisies and wheat. Edit it on your phone.'),
    intro:
      msg('A Provence lavender field on handmade lilac paper: pressed lavender, white daisies and wheat ears in two corners, loose lavender buds on the paper, and instead of an envelope a cream linen pouch tied with jute twine and a lavender bundle. Inside: deckle-edged cream cards, pressed-flower frames and a flowing script.'),
    opening:
      msg('Your guests tap the pouch. The jute twine unties and slips away with its lavender bundle, the linen pouch loosens and opens, and a card with your portrait slides up out of it while dried lavender buds scatter on a summer breeze. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a deckle-edged cream card, your names, date, venue, a live countdown and a lavender RSVP button, then the invitation card and three pressed-flower cards dropped loosely on the paper that lead to Our Story, the day and the reply.'),
      story: msg('Three photos on pressed-flower cards set at loose angles; as guests scroll, each one tumbles in on a breeze from its own side and settles, with a handwritten caption below.'),
      details: msg('An "Order of the Day" card with lavender-and-daisy sprigs between the rows, add to calendar, the venue photo in a wide pressed-flower frame, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" card with your reply-by date, signed with your names, with a lavender bundle on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Lilac Paper'), hex: '#D6CCE5' },
      { name: msg('Lavender'), hex: '#9C8FC4' },
      { name: msg('Violet'), hex: '#5D5287' },
      { name: msg('Ivory'), hex: '#FAF8F3' },
      { name: msg('Ink'), hex: '#2E2A3F' },
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
    style: msg('Kraft envelope tied with twine, a cork and olive leaves, grape clusters, vine leaves and wine-label frames'),
    metaDescription:
      msg('A kraft envelope tied with twine and a cork opens into your wedding website: Tuscan sunset, grapes, olive leaves and wine-label frames. Edit it on your phone.'),
    intro:
      msg('A vineyard wedding at sunset: a Tuscan sky over soft hills, grape clusters, vine leaves and olive branches in two corners, and a kraft envelope with a wine-colored engraved vine border on its flap, wrapped in jute twine with a cork and two dried olive leaves. Inside: wine-label cards and frames with cut corners, an oak table and a flowing script.'),
    opening:
      msg('Your guests tap the envelope. The twine unwinds upward off the flap tip with its cork and olive leaves, the kraft flap opens to reveal a wine-colored grape liner, and a card with your portrait rises from the pocket as a vine tendril curls in from the corner. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a wine-label card, your names, date, venue, a live countdown and a wine-red RSVP button, then the invitation card and three vineyard rows that lead to Our Story, the day and the reply.'),
      story: msg('Three photos in wine-label frames laid one by one on an oak table; as guests scroll, each frame drops into place, its caption appears, and a grape cluster, an olive leaf and a vine leaf settle beside them.'),
      details: msg('An "Order of the Day" card with small vine sprigs between the rows, add to calendar, the venue photo in a wide wine-label frame, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" card with your reply-by date, signed with your names and tied with the twine and cork at its base, followed by the reply form.'),
    },
    palette: [
      { name: msg('Wine'), hex: '#5B2C3A' },
      { name: msg('Gold'), hex: '#A9874F' },
      { name: msg('Sunset'), hex: '#FDDDB4' },
      { name: msg('Peach Paper'), hex: '#FAE6CF' },
      { name: msg('Ivory'), hex: '#FBF6EC' },
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
    style: msg('Terracotta arch envelope tied with pampas and a palm spear, dried roses and arch frames on sunlit sand'),
    metaDescription:
      msg('A terracotta arch envelope tied with pampas and palm opens into your wedding website: pampas plumes, dried roses and arch frames. Edit it on your phone.'),
    intro:
      msg('A desert boho wedding on a sunlit sand wall with soft sun rays: pampas grass, dried palm spears and dried terracotta roses in two corners, and a terracotta envelope with a round arch flap and an arched front pocket, tied with pampas and palm. Inside: arch-windowed cards and frames in terracotta and sand, and a brush script.'),
    opening:
      msg('Your guests tap the envelope. The pampas-and-palm tie slips off, the arch flap folds upward to show a liner of terracotta rainbows, and a card with your portrait slides slowly up out of the arch like a rising sun while a pampas plume sways in from the side. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in an arch-windowed card, your names, date, venue, a live countdown and a terracotta RSVP button, then the invitation card, an arch photo frame and an arched card with the first lines of your schedule that lead to Our Story and the day.'),
      story: msg('Three photos in arch frames, the middle one a little taller and in front; as guests scroll, the arches open out from their base like a rainbow, the middle one first, and then the script captions appear.'),
      details: msg('An arched "Order of the Day" card with pampas sprigs between the rows, add to calendar, the venue photo in a wide arch frame, dress code, links and questions and answers.'),
      rsvp: msg('An arched "Will You Join Us?" card with your reply-by date, signed with your names and the pampas-and-palm tie on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Terracotta'), hex: '#C9785B' },
      { name: msg('Rust'), hex: '#9C5136' },
      { name: msg('Sand'), hex: '#F3DEC6' },
      { name: msg('Gold'), hex: '#C29A5B' },
      { name: msg('Ivory'), hex: '#FBF5EC' },
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
    style: msg('Travel wallet with a leather strap and a brass snap, plumeria, monstera, hibiscus and luggage-tag frames'),
    metaDescription:
      msg('A travel wallet with a brass snap and a plumeria opens into your wedding website: monstera, hibiscus and string-tied luggage tags. Edit it on your phone.'),
    intro:
      msg('A destination wedding on a soft sea-foam wash: monstera, palm leaves, hibiscus and plumeria in two corners, and a white travel wallet with a round flap and a leather strap, closed with a brass snap, twine and a white plumeria. Inside: a palm-leaf liner, luggage-tag and kraft-tag frames on strings and a flowing script.'),
    opening:
      msg('Your guests tap the wallet. The brass snap pops open and the plumeria tab swings away, the round flap flips up with its strap to reveal the palm-leaf liner, and a luggage-tag card with your portrait slides up while a monstera leaf and a white plumeria drift across the screen. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a luggage-tag card, your names, date, venue, a live countdown and a teal RSVP button, then the invitation card with a travel-tag date line and two kraft tags that lead to Our Story and the details of the day.'),
      story: msg('Three photos on string-tied kraft tags, each with a flower tucked in a corner; as guests scroll, each tag swings into place from the top of its string and keeps swaying gently, with a handwritten caption below.'),
      details: msg('An "Order of the Day" card with palm-and-plumeria sprays between the rows, add to calendar, the venue photo on a wide kraft tag, dress code, links and questions and answers.'),
      rsvp: msg('A "Will You Join Us?" card with your reply-by date, signed with your names and closed with the brass snap and plumeria on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Teal'), hex: '#1F7C75' },
      { name: msg('Palm'), hex: '#1F5843' },
      { name: msg('Gold'), hex: '#C4963F' },
      { name: msg('Lagoon'), hex: '#E8FCF8' },
      { name: msg('Ivory'), hex: '#FFFCF5' },
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
    style: msg('Moss-green storybook with a brass clasp, ferns, toadstools, fireflies and photo-cornered storybook pages'),
    metaDescription:
      msg('A moss-green storybook with a brass clasp opens into your wedding website: a misty forest, ferns, toadstools and fireflies. Edit it on your phone.'),
    intro:
      msg('A fairy-tale forest clearing in the mist, lit by fireflies: ivy, foxgloves, ferns, moss and little toadstools in two corners, and an old moss-green storybook with an embossed gold fern-and-mushroom border and a leaf-carved brass clasp. Inside: aged cream book pages with a fine ink border, photos held by black photo corners and a flowing script.'),
    opening:
      msg('Your guests tap the book. The brass clasp unhooks and swings away, the moss-green cover swings open to the left like a storybook, the first page turns, and a card with your portrait rises from the page while tiny fireflies glow up around it. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a book-page card with four photo corners, your names, date, venue, a live countdown and a moss-green RSVP button, then the invitation card and two photo-cornered pictures that lead to Our Story and the details of the day.'),
      story: msg('One long storybook page with three photo-cornered pictures in a zigzag; as guests scroll, each picture is pressed onto the page, a fern sprig and a firefly appear beside it, and its caption is written below.'),
      details: msg('An "Order of the Day" page with ivy sprigs between the rows, add to calendar, the venue photo in a wide photo-cornered card, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" page with your reply-by date, signed with your names and the book's brass clasp on its lower edge, followed by the reply form."),
    },
    palette: [
      { name: msg('Moss'), hex: '#4A5A3A' },
      { name: msg('Old Gold'), hex: '#B7975A' },
      { name: msg('Sepia'), hex: '#5E4517' },
      { name: msg('Parchment'), hex: '#DED8B8' },
      { name: msg('Mist'), hex: '#ECE9D6' },
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
    style: msg('Lace-covered ivory gatefold with a pearl brooch, white garden roses, pearl strands and carved oval frames'),
    metaDescription:
      msg('A lace-covered ivory gatefold with a pearl brooch opens into your wedding website: white garden roses, pearl strands and oval frames. Edit it on your phone.'),
    intro:
      msg('Regal ivory on pearly satin, lit from a window: ivory lace, strands of pearls and white garden roses in two corners, a pearl drop, rose petals and a satin bow, and a two-door ivory gatefold covered in lace, fastened over the center seam with a five-pearl silver-gold brooch. Inside: carved ivory oval frames, lace-edged cards and an engraved copperplate script.'),
    opening:
      msg('Your guests tap the gatefold. The pearl brooch unhooks and slips away down the seam, the lace-covered doors part slowly to the sides like a lifted veil, and a card with your portrait rises from the satin center while a strand of tiny pearls glints. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a carved oval frame on an ivory card, your names, date, venue, a live countdown and a champagne RSVP button, then the invitation card and two frames hung on pearl strands that lead to Our Story and the details of the day.'),
      story: msg('Three oval frames hanging from pearl strands of different lengths; as guests scroll, each one comes down and sways gently on its strand before it settles, a band of light passes over the carved ivory and pearls, and its caption appears below.'),
      details: msg('An "Order of the Day" card with pearl strands between the rows, add to calendar, the venue photo in a wide carved oval frame, dress code, links and questions and answers.'),
      rsvp: msg('A lace-edged "Will You Join Us?" card with your reply-by date, signed with your names and the pearl brooch on its lower edge, followed by the reply form.'),
    },
    palette: [
      { name: msg('Satin'), hex: '#F1E7DE' },
      { name: msg('Ivory'), hex: '#FFFDF8' },
      { name: msg('Taupe'), hex: '#7A6650' },
      { name: msg('Champagne Gold'), hex: '#8C7350' },
      { name: msg('Ink'), hex: '#3A3530' },
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
    style: msg('Pale grey envelope with a round deckle-edged flap and a cherry blossom twig, watercolor blossoms and petals'),
    metaDescription:
      msg('A pale grey envelope with a cherry blossom twig opens into your wedding website: watercolor blossom branches and drifting petals. Edit it on your phone.'),
    intro:
      msg('Spring in a soft pink mist: watercolor cherry blossom branches reaching in from two corners, single petals drifting across the screen, and a pale grey handmade-paper envelope with a round, deckle-edged white flap, closed at its tip with a five-blossom cherry twig. Inside: deckle-edged ivory cards, blossom-wreathed round and oval frames and a formal script.'),
    opening:
      msg('Your guests tap the envelope. The blossom twig trembles, loosens and drifts off the top of the screen, the curved grey flap lifts to show a cherry blossom liner, and a card with your portrait rises from the pocket as a gentle flurry of cherry petals swirls up and floats across the screen. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in the round window of a blossom-wreathed card, your names, date, venue, a live countdown and a dusty rose RSVP button with a blossom at each end, then the invitation card and two blossom-framed ovals that lead to Our Story and the details of the day.'),
      story: msg('Three blossom-framed ovals of different sizes set from side to side; as guests scroll, each one drifts down like a falling petal, swaying from side to side before it settles, then its caption is written and a small blossom opens below it.'),
      details: msg('An "Order of the Day" card with small blossom sprigs between the rows, add to calendar, the venue photo in a wide blossom-framed oval, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's cherry blossom twig on its lower edge, followed by the reply form."),
    },
    palette: [
      { name: msg('Blush Mist'), hex: '#EEE3E6' },
      { name: msg('Ivory'), hex: '#FFFCFB' },
      { name: msg('Dusty Rose'), hex: '#7C5563' },
      { name: msg('Plum'), hex: '#4A3D42' },
      { name: msg('Ink'), hex: '#3A3438' },
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
    style: msg('Kraft envelope tied with a mustard gingham bow and a sunflower, sunflowers, wheat and prints pegged on twine'),
    metaDescription:
      msg('A kraft envelope tied with a gingham bow and a sunflower opens into your wedding website: sunflowers, wheat and a barn-wood table. Edit it on your phone.'),
    intro:
      msg('A country wedding in golden-hour light on cream paper with weathered wood along the bottom: watercolor sunflowers, wheat, daisies and leaves in two corners, a sunflower petal, a small sunflower head and a wheat ear drifting, and a kraft paper envelope with a rounded square flap and a mustard-and-cream gingham liner, wrapped in a wide mustard gingham ribbon with a big bow and a little sunflower at the knot. Inside: deckle-edged cream cards, old prints pegged on jute twine and a warm brush script.'),
    opening:
      msg('Your guests tap the envelope. The gingham bow tugs loose and the ribbon slides off with its little sunflower, the kraft flap flips open to show the gingham liner, a weathered barn-wood tabletop appears under the envelope, and the card with your portrait rises and slides out onto the table while a few sunflower petals tumble. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a gingham-edged window on a cream card, your names, date, venue, a live countdown and a mustard RSVP button, then the invitation card and two prints pegged on jute twine that lead to Our Story and the details of the day.'),
      story: msg('A barn-wood wall with three lengths of jute twine; as guests scroll, each line of twine stretches out, an old print is pegged onto it and swings once on its peg before it settles, and its caption is written below, with a little sunflower or wheat ear beside it.'),
      details: msg('An "Order of the Day" card topped with gingham and sunflowers, small sunflower sprays between the rows, add to calendar, the venue photo as a wide print pegged on twine, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's gingham ribbon and bow laid along its base, followed by the reply form."),
    },
    palette: [
      { name: msg('Golden Cream'), hex: '#F9E7CB' },
      { name: msg('Mustard'), hex: '#E3A72F' },
      { name: msg('Wheat Gold'), hex: '#B88B3E' },
      { name: msg('Leaf'), hex: '#6E7D3A' },
      { name: msg('Barn Brown'), hex: '#5A4429' },
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
    style: msg('Emerald velvet envelope with a gold seal, gold line-art monstera and ferns, white marble cards and gold frames'),
    metaDescription:
      msg('An emerald velvet envelope with a gold seal opens into your wedding website: gold line-art monstera and ferns and white marble cards. Edit it on your phone.'),
    intro:
      msg('An estate gala at night on deep emerald velvet dusted with gold at the edges: thin metallic gold line-art monstera, fern and eucalyptus in two corners, a gold fern leaf and a eucalyptus sprig drifting at the side, and an emerald velvet envelope with a tall bell-shaped flap, fine gold lines along its edges and a laurel-wreath gold seal carrying your initials. Inside: white Carrara marble cards with thin gold borders, gold frames and decorative Roman capitals.'),
    opening:
      msg('Your guests tap the envelope. A glint of light runs over the gold seal and it lifts away, the emerald flap opens upward to show a gold leaf liner, thin gold botanical lines of fern, monstera and eucalyptus draw themselves across the screen, and the marble card with your portrait rises from the pocket. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a gold-framed marble card, your names, date, venue, a live countdown and a polished gold RSVP button, then the marble invitation card and two gold frames hung on the velvet that lead to Our Story and the details of the day.'),
      story: msg('A gallery wall of three thin gold frames in three sizes on the emerald velvet; as guests scroll, each frame drops in as if hung on a nail, swings once and settles, its caption is written, and a gold eucalyptus sprig draws itself beside it.'),
      details: msg('A marble "Order of the Day" card with small gold ferns between the rows, add to calendar, the venue photo in a wide gold frame, dress code, links and questions and answers.'),
      rsvp: msg("A marble \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's gold seal on its lower edge, followed by the reply form."),
    },
    palette: [
      { name: msg('Velvet'), hex: '#012314' },
      { name: msg('Emerald'), hex: '#0B3528' },
      { name: msg('Gold'), hex: '#C8A45A' },
      { name: msg('Marble Ivory'), hex: '#F3EDDF' },
      { name: msg('Bronze'), hex: '#74561F' },
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
    style: msg('Frosted vellum sleeve with a wildflower label, colored-pencil poppies, cornflowers, daisies and veiled photo cards'),
    metaDescription:
      msg('A frosted vellum sleeve with a wildflower label opens into your wedding website: colored-pencil poppies, cornflowers and daisies. Edit it on your phone.'),
    intro:
      msg('A summer meadow in a soft cream-to-green haze with blurred wildflowers along the bottom: colored-pencil clusters of poppies, cornflowers, daisies, lupins and grasses in two corners, a poppy petal, a cornflower and a daisy drifting at the side, and instead of an envelope a frosted, see-through vellum sleeve with a round, deckle-edged wildflower label just below its opening. Inside: cotton paper cards with wildflower borders, photo cards under vellum veils and a relaxed handwritten script.'),
    opening:
      msg('Your guests tap the sleeve. The wildflower label peels away, the frosted vellum sleeve opens, slides down off the card and fades as the card comes into focus, and the card with your portrait lifts up while colored-pencil poppy petals flutter across the screen. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait on a card with a wildflower border, your names, date, venue, a live countdown and a cornflower-blue RSVP button, then the invitation card and two photo cards that lead to Our Story and the details of the day.'),
      story: msg('Three photo cards set at slight angles, each under a vellum veil; as guests scroll, each card rises into place, its vellum veil lifts from the lower edge and floats away to show the photo, and its handwritten caption appears, with a cornflower or a daisy between the cards.'),
      details: msg('An "Order of the Day" card with small poppy-and-cornflower sprays between the rows, add to calendar, the venue photo on a photo card with a wildflower border, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the sleeve's wildflower label at its base, followed by the reply form."),
    },
    palette: [
      { name: msg('Meadow Cream'), hex: '#F1F0E1' },
      { name: msg('Ivory'), hex: '#FFFEF8' },
      { name: msg('Leaf'), hex: '#4F6A36' },
      { name: msg('Cornflower'), hex: '#4466A6' },
      { name: msg('Poppy'), hex: '#B8452C' },
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
    style: msg('Matte black envelope with antique silver edges and a silver seal, oil-painted roses, peonies and gilded frames'),
    metaDescription:
      msg('A black envelope with a silver seal opens into your wedding website in warm candlelight: dark roses, plum peonies and gilded frames. Edit it on your phone.'),
    intro:
      msg('A night garden painted like a dark Dutch still life on black: oil-painted deep red roses, plum peonies, midnight-blue hydrangea, dark fruit and dusky leaves in two corners, a velvet plum butterfly and a rose petal, candlelight glowing low on the page, and a matte black envelope edged with hairline antique silver, closed at the tip of its V flap with a silver seal carrying your initials. Inside: black cards with fine gold borders, baroque gilded frames and classic small capitals.'),
    opening:
      msg('Your guests tap the envelope. The silver seal cracks in two and the halves fall away, the black flap opens slowly to show a dark rose liner, warm golden candlelight spills out from inside, and the card with your portrait rises out of the darkness into the glow. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a gilded frame on a black card, your names, date, venue, a live countdown and a gold RSVP button, then the invitation card and two gilded frames that lead to Our Story and the details of the day.'),
      story: msg('Three baroque gilded frames hung salon-style, one to the left and the next to the right; as guests scroll, candlelight warms the wall behind each frame and the frame and its photo glow up out of the dark, then its caption appears.'),
      details: msg('An "Order of the Day" card with small rose sprigs between the rows, add to calendar, the venue photo in a wide gilded frame, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's silver seal pressed onto its lower gold line, followed by the reply form."),
    },
    palette: [
      { name: msg('Midnight'), hex: '#141217' },
      { name: msg('Plum'), hex: '#4A2335' },
      { name: msg('Candle Gold'), hex: '#C9A46A' },
      { name: msg('Pale Gold'), hex: '#E3C99A' },
      { name: msg('Ivory'), hex: '#EFE6DA' },
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
    style: msg('Speckled sand envelope with a wave-edged flap and a scallop shell, watercolor sea, shells and brass porthole frames'),
    metaDescription:
      msg('A sand-colored envelope with a scallop shell opens into your wedding website: a watercolor wave, shells, sea glass and portholes. Edit it on your phone.'),
    intro:
      msg('An ocean shore in a pale sea-mist watercolor: a beach corner of dune grass, a moon snail shell, coral, sea glass, sand and foam, a foamy wave along the bottom, a scallop shell and sea glass in the other corner, a piece of sea glass and a starfish drifting, and a speckled sand-colored envelope whose V flap is cut like a wavy shoreline, with a scallop shell on a short loop of twine at its tip. Inside: an ocean watercolor liner, sand cards with wave-washed edges, brass porthole frames and a flowing script.'),
    opening:
      msg('Your guests tap the envelope. A watercolor wave sweeps across the screen and carries the scallop shell and its twine away, the wave-edged flap lifts to show the ocean liner, and the card with your portrait rises slowly like the incoming tide. The card comes forward to become the first screen of your home page.'),
    pages: {
      home: msg('Your portrait in a brass porthole on a sand card, your names, date, venue, a live countdown and an ocean-blue RSVP button, then the invitation card and two portholes that slide in from their own sides and lead to Our Story and the details of the day.'),
      story: msg('Three brass portholes in a zigzag, left, right and left; as guests scroll, each one slides in from its own side and turns gently into place with a shell, sea glass or starfish beside it, and its handwritten caption appears below.'),
      details: msg('An "Order of the Day" card with small rows of shells between the rows, add to calendar, the venue photo in a wide oval porthole, dress code, links and questions and answers.'),
      rsvp: msg("A \"Will You Join Us?\" card with your reply-by date, signed with your names, with the envelope's scallop shell resting on the wave at its foot, followed by the reply form."),
    },
    palette: [
      { name: msg('Sea Mist'), hex: '#D8EEF6' },
      { name: msg('Ivory'), hex: '#FFFDF8' },
      { name: msg('Ocean'), hex: '#2E5E7E' },
      { name: msg('Deep Sea'), hex: '#1D3445' },
      { name: msg('Sand'), hex: '#8A6A35' },
    ],
    fonts: ['Allison', 'Lora'],
    llmsLine: 'speckled sand-colored envelope with a wave-edged flap and a scallop shell on twine, carried away by a watercolor wave; sea-mist watercolor, shells, sea glass, starfish and brass porthole frames.',
    relatedGuides: ['when-to-send-your-wedding-website', 'canva-wedding-website-template-vs-hosted-website'],
  },
};


/**
 * These themes are present in the platform, but their final artwork and sale approval are still pending.
 * Keep their catalogue copy explicit about that status; do not invent prices, palettes, or buyer-ready claims.
 */
const PREVIEW_DESIGN_COPY: Record<string, Pick<DesignCopy, 'style' | 'opening'> & { home: string }> = {
  'nocturne-lake-estate': {
    style: msg("Charcoal envelope, champagne-gold botanical seal and a candlelit Lake Como wedding."),
    opening: msg("Your guests tap the envelope. A curved charcoal letter flap lifts on its hinge. The portrait rises from behind the illustrated lakeside pocket and settles before the wedding home page opens."),
    home: msg("Charcoal paper, champagne gold and candlelight by the water. A quiet, refined invitation opens onto the lake, the story and the evening ahead."),
  },
  'velvet-jewel-box': {
    style: msg("Aubergine velvet envelope in a champagne satin band, a rose-gold solitaire threaded on the ribbon."),
    opening: msg("Your guests tap the envelope. The diamond catches the light, the ring slides off the satin band and floats away, the band parts, the lobed velvet flap opens onto champagne satin and the pearl-edged card with your portrait rises out of the pocket before the wedding home page opens."),
    home: msg("Champagne moiré, aubergine velvet, seed pearls and rose gold. Your portrait sits in an oval pearl cameo and the invitation opens on a band of velvet like a jewellery case."),
  },
  'grand-theatre-premiere': {
    style: msg("Peacock-blue envelope, antique-gold seal and an ivory playbill-inspired schedule."),
    opening: msg("Your guests tap the envelope. Two burgundy velvet gatefold doors swing apart, revealing the gilded playbill invitation before the wedding home page opens."),
    home: msg("Peacock blue, antique gold and warm ivory set the scene. The invitation opens like opening night, then leads into your story and the evening programme."),
  },
  'orient-express-voyage': {
    style: msg("Bottle-green envelope, brass route seal and details inspired by a first-class rail journey."),
    opening: msg("Your guests tap the envelope. A long green ticket sleeve slides left as the portrait invitation emerges to the right, then settles before the wedding home page opens."),
    home: msg("Bottle green, brass and warm ivory meet the romance of a vintage rail journey. The envelope opens onto your invitation, route details and celebration."),
  },
  'kintsugi-washi': {
    style: msg("Indigo washi envelope, fine kintsugi-gold lines and quiet botanical details."),
    opening: msg("Your guests tap the envelope. Four washi folds unfold in sequence around the kintsugi portrait invitation before the wedding home page opens."),
    home: msg("Washi paper, sumi ink and delicate gold seams bring a quiet, handcrafted feeling to your invitation, story and garden celebration."),
  },
  'riad-lantern-nights': {
    style: msg("Deep teal envelope, brass seal and saffron lantern accents inspired by a Marrakech riad."),
    opening: msg("Your guests tap the envelope. Two horseshoe-arch riad doors open on their side hinges, revealing the lantern-framed portrait invitation before the wedding home page opens."),
    home: msg("Teal, warm cedar and saffron light bring the feeling of a lantern-lit riad. Open the invitation to find the courtyard, your story and the celebration details."),
  },
  'maison-patisserie': {
    style: msg("Pistachio envelope, rose-satin detail and cream-and-gold pâtisserie-inspired flourishes."),
    opening: msg("Your guests tap the envelope. A scalloped pistachio parcel flap lifts to reveal the rose-satin portrait invitation, which rises from its pocket before the wedding home page opens."),
    home: msg("Pistachio, rose and cream evoke the window of a French pâtisserie. The invitation opens onto your celebration, story and carefully arranged details."),
  },
  'celestial-observatory': {
    style: msg("Midnight-blue envelope, star-map seal and antique-brass celestial details."),
    opening: msg("Your guests tap the envelope. Two curved celestial shutters open from their side hinges, revealing the astrolabe portrait invitation before the wedding home page opens."),
    home: msg("Midnight blue, chart-paper ivory and antique brass set a stargazing mood. Open the invitation to find your story beneath the night sky."),
  },
  'azulejo-mosaic': {
    style: msg("Cobalt-and-ivory envelope, terracotta accent and Portuguese azulejo-inspired details."),
    opening: msg("Your guests tap the envelope. Three azulejo folder panels unfold in sequence, revealing the cobalt-tile portrait invitation before the wedding home page opens."),
    home: msg("Cobalt, whitewash and terracotta recall painted tiles in the sun. Open the invitation to reveal your story and celebration, tile by tile."),
  },
  'sky-lantern-festival': {
    style: msg("Dip-dyed dusk washi envelope with a lantern-belly flap and a paper sky lantern tied to a gold stud with amber silk."),
    opening: msg("Your guests tap the envelope. The paper lantern lights up from inside, the silk thread slips free and the lantern rises out of sight while distant lanterns drift up behind it, the lantern-belly flap opens onto warm amber washi and the rice-paper card with your portrait rises out of the pocket before the wedding home page opens."),
    home: msg("Dusk violet, dusky rose and lantern amber on hand-dyed washi. Your portrait waits in a paper-lantern window on a rice-paper card, and every photo opens in a circle of warm lantern light."),
  },
  'music-box-ballerina': {
    style: msg("Blush envelope, a champagne satin band and a gold-edged floral cameo."),
    opening: msg("Your guests tap the envelope. The oval music-case lid lifts on its top hinge, revealing a floral cameo invitation before the wedding home page opens."),
    home: msg("Rose quartz, blush satin and soft gold give this invitation the feeling of a treasured keepsake. Open it to reveal your story and wedding details."),
  },
};

// The eleven rebuilt designs now share the complete Blush page structure.
for (const [id, preview] of Object.entries(PREVIEW_DESIGN_COPY)) {
  const full = DESIGN_COPY[id];
  if (!full) continue;
  full.style = preview.style.replace(/[.!?]+$/, '');
  full.intro = preview.home;
  full.opening = preview.opening;
  full.pages = {home: msg('Your portrait in an ornate arch card, names, date, venue, invitation, countdown and links to the other pages.'),story: msg('Three framed photographs with editable captions and your story.'),details: msg('An ornate programme card, venue photograph, optional map, schedule, calendar links, travel, registry and questions.'),rsvp: msg('A cream reply card, reply-by date and the configurable RSVP form.')};
  full.fonts = ['Cormorant Garamond', 'Great Vibes', 'Lora'];
  full.llmsLine = full.style + '. A layered envelope opening, ornate photo cards, story, details and RSVP.';
  full.palette = [{name: msg('Ivory paper'), hex: '#F5EEE2'}, {name: msg('Gold'), hex: '#B99459'}, ...full.palette.slice(0, 2)];
}

// Interior art/layout/motion differ for these eleven previews; envelope copy and other products are unchanged.
const UNIQUE_INTERIORS: Record<string,{fonts:string[];home:string;story:string;details:string;rsvp:string}> = {
  "nocturne-lake-estate": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Italiana"
    ],
    "home": "An Italian lakeside terrace: panoramic portrait, refined names and candlelit ivory invitation.",
    "story": "Panoramic villa frames: a full-width opening photograph and two intimate moments beneath it.",
    "details": "A villa dinner programme with generous time columns and a panoramic venue photograph.",
    "rsvp": "A charcoal-and-champagne reply suite with Italian botanical stationery."
  },
  "grand-theatre-premiere": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Italianno",
      "Bodoni Moda"
    ],
    "home": "A peacock-teal theatre premiere with a ticket-shaped portrait and an ivory playbill invitation.",
    "story": "Landscape theatre-ticket photographs presented as three acts, with bold playbill captions.",
    "details": "A playbill programme arranged in paired acts with a stage-like venue feature.",
    "rsvp": "A premiere reply suite, framed by burgundy curtain details and antique brass."
  },
  "orient-express-voyage": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Allura",
      "Cinzel",
      "Libre Baskerville"
    ],
    "home": "A first-class travel invitation with a brass carriage-window portrait and cream ticket stationery.",
    "story": "A horizontal carriage-window photo journey with captions under each panoramic view.",
    "details": "A rail-journey itinerary with paired time and destination columns.",
    "rsvp": "A green-and-brass travel-ticket reply suite."
  },
  "kintsugi-washi": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Shippori Mincho"
    ],
    "home": "An indigo-and-ivory washi composition with square kintsugi photo mounts and torn-paper stationery.",
    "story": "Asymmetric washi photo mounts paired with captions, alternating gently from side to side.",
    "details": "A quiet folded-paper programme with gold-repaired margins and a square venue mount.",
    "rsvp": "A handmade washi reply letter with indigo type and fine kintsugi details."
  },
  "riad-lantern-nights": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Italianno",
      "Amiri"
    ],
    "home": "A Moroccan courtyard suite with an arched portrait, brass lantern details and mosaic-edged stationery.",
    "story": "A riad arcade of horseshoe-arch portraits: one central arch followed by two smaller windows.",
    "details": "A courtyard evening programme beneath an ivory plaster arch, with teal and saffron details.",
    "rsvp": "An arched riad reply card and a lantern-lit response form."
  },
  "maison-patisserie": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Parisienne",
      "Playfair Display"
    ],
    "home": "A pistachio-and-strawberry salon with a porcelain portrait and scalloped menu invitation.",
    "story": "Scalloped porcelain photo plates arranged as a Parisian scrapbook, with alternating caption positions.",
    "details": "A Parisian menu-style programme and porcelain-framed venue photograph.",
    "rsvp": "A cream patisserie reply menu with pink ribbon and pistachio details."
  },
  "celestial-observatory": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Pinyon Script",
      "Cinzel"
    ],
    "home": "A midnight observatory with a circular brass astrolabe portrait and an ivory star-chart invitation.",
    "story": "Circular astrolabe portraits trace an asymmetric constellation across the page, each appearing in its own orbit.",
    "details": "An observatory programme with measured celestial chart typography and circular venue framing.",
    "rsvp": "A midnight-and-brass star-chart reply suite."
  },
  "azulejo-mosaic": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Italianno"
    ],
    "home": "A Portuguese porcelain suite with a cobalt tile portrait and matching azulejo stationery.",
    "story": "Square azulejo photo tiles form a porcelain mosaic gallery with cobalt captions.",
    "details": "A tile-framed celebration programme with terracotta time accents and a square venue panel.",
    "rsvp": "A cobalt-and-porcelain reply panel with terracotta accents."
  },
  "music-box-ballerina": {
    "fonts": [
      "Cormorant Garamond",
      "Great Vibes",
      "Lora",
      "Cormorant Infant"
    ],
    "home": "A ballet keepsake suite with an oval cameo portrait, champagne satin and blush silk stationery.",
    "story": "Oval cameo photographs sit like pages of a ballet keepsake album, with a larger central portrait.",
    "details": "A music-box recital programme with paired entries and porcelain cameo venue framing.",
    "rsvp": "A blush satin-lined reply suite with gold cameo ornament."
  }
};
for(const [id,p]of Object.entries(UNIQUE_INTERIORS)){
 const full=DESIGN_COPY[id];
 full.fonts=[...p.fonts];
 full.intro=msg(p.home);
 full.pages={home:msg(p.home),story:msg(p.story),details:msg(p.details),rsvp:msg(p.rsvp)};
}

// Rebuilt from the design's own layered GPT parts (docs/35, 2026-10-22; pilot G423): its own fonts, pages and palette
// replace the shared rebuilt-eleven copy above.
const REBUILT: Record<string, Pick<DesignCopy, 'fonts' | 'pages' | 'palette' | 'llmsLine'>> = {
  'velvet-jewel-box': {
    fonts: ['Pinyon Script', 'Bodoni Moda'],
    pages: {
      home: msg('Your portrait in an oval rose gold and pearl cameo on an ivory card, the invitation on a band of aubergine velvet with a countdown and calendar links, and an open ring box to sign off.'),
      story: msg('Three photos in the oval settings of a velvet ring tray on a turning display. Guests swipe or drag it, or use the arrows or the keyboard.'),
      details: msg('The order of the day on an ivory card under a strand of pearls, the venue in a wide pearl-edged frame, an optional map, travel, menu, registry and questions.'),
      rsvp: msg('An ivory reply card on aubergine velvet with your reply-by date and the configurable RSVP form; pearls and petals drift down when a reply is sent.'),
    },
    palette: [
      { name: msg('Champagne'), hex: '#E8D3B0' },
      { name: msg('Aubergine'), hex: '#2A1328' },
      { name: msg('Plum'), hex: '#4A2142' },
      { name: msg('Rose gold'), hex: '#C99A86' },
    ],
    llmsLine: 'an aubergine velvet envelope in a champagne satin band with a rose gold ring threaded on it, an oval pearl cameo portrait and a turning photo display.',
  },
  'sky-lantern-festival': {
    fonts: ['Corinthia', 'Bellefair'],
    pages: {
      home: msg('Your portrait in a paper-lantern window on a rice-paper card under the lantern that rose from the envelope, the invitation between strings of tiny lanterns with a countdown and calendar links, and a lit lantern to sign off.'),
      story: msg('Three photos on hanging rice-paper panels, left, right and left, each opening in a circle of warm light as guests scroll while distant lanterns drift up.'),
      details: msg('The order of the day on rice paper, each line with a little lantern that lights in turn, the venue on a wide bamboo panel, an optional map, travel, menu, registry and questions.'),
      rsvp: msg('A rice-paper reply card with your reply-by date and the configurable RSVP form; when a reply is sent, a lantern rises with gold leaf, petals and wish seeds.'),
    },
    palette: [
      { name: msg('Dusk violet'), hex: '#2B1F45' },
      { name: msg('Dusky rose'), hex: '#E7B4A6' },
      { name: msg('Lantern amber'), hex: '#F2A65A' },
      { name: msg('Rice paper'), hex: '#F7EEDD' },
    ],
    llmsLine: 'a dip-dyed dusk washi envelope with a lantern-belly flap and a paper sky lantern that lights and rises away; photos open in warm lantern light on rice-paper panels.',
  },
};
for (const [id, r] of Object.entries(REBUILT)) Object.assign(DESIGN_COPY[id], r);

function previewDesignCopy(d: DesignCommerce): DesignCopy | undefined {
  const full = DESIGN_COPY[d.id];
  if (!PREVIEW_DESIGN_COPY[d.id] || !full) return undefined;
  return {...full, metaDescription: msg(d.name + ' wedding website. Explore the envelope opening, invitation, photo story, details and RSVP. Customize photos and collect guest replies.'), intro: msg(full.intro.replace(/[.!?]+$/, '') + '. Explore the complete demo; Etsy availability is pending.')};
}

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

/** Live and preview designs shown in the catalogue; hidden 'coming' designs are excluded. */
export function catalogDesigns(cfg: MarketingConfig = MARKETING): Design[] {
  return cfg.designs
    .filter((d) => d.status !== 'coming')
    .map((d) => {
      // a 'preview' design keeps its envelope-cover catalogue copy (main f1228e88) until it goes live; its full copy
      // (DESIGN_COPY, G175) still names the panel's opening tab (lib/panel/state.ts)
      const copy = (d.status === 'preview' ? previewDesignCopy(d) : undefined) ?? DESIGN_COPY[d.id];
      if (!copy) throw new Error('lib/marketing/designs.ts has no copy for catalog design "' + d.id + '"');
      return { ...d, copy };
    });
}

export function catalogDesign(id: string, cfg: MarketingConfig = MARKETING): Design | null {
  return catalogDesigns(cfg).find((d) => d.id === id) ?? null;
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
 * G141 (K45 item 7, "templates always in front"): the home page shows EVERY live design — the featured ones first
 * (config order), then the rest (config order).
 */
export function showcaseDesigns(cfg: MarketingConfig = MARKETING): Design[] {
  const live = catalogDesigns(cfg);
  return [...live.filter((d) => d.featured), ...live.filter((d) => !d.featured)];
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
  { id: 'floral', label: msg('Romantic floral') },
  { id: 'classic', label: msg('Classic & elegant') },
  { id: 'rustic', label: msg('Rustic & boho') },
  { id: 'destination', label: msg('Destination') },
  { id: 'seasonal', label: msg('Seasonal') },
  { id: 'storybook', label: msg('Storybook & vintage') },
] as const;
export type StyleId = (typeof STYLE_FILTERS)[number]['id'];

export const DESIGN_STYLES: Record<string, readonly StyleId[]> = {
  'crimson-rose-atelier': ['floral', 'classic'],
  'nocturne-lake-estate': ['classic', 'destination'],
  'velvet-jewel-box': ['classic'],
  'grand-theatre-premiere': ['classic'],
  'orient-express-voyage': ['classic', 'destination'],
  'riad-lantern-nights': ['classic', 'destination'],
  'maison-patisserie': ['classic'],
  'celestial-observatory': ['classic'],
  'azulejo-mosaic': ['classic', 'destination'],
  'sky-lantern-festival': ['classic'],
  'music-box-ballerina': ['classic', 'storybook'],
  'marigold-mehndi': ['classic', 'floral'],
  'red-lacquer-double-happiness': ['classic'],
  'highland-tartan-thistle': ['classic', 'destination'],
  'victorian-glasshouse': ['classic', 'floral'],
  'art-nouveau-lily': ['classic', 'floral'],
  'papel-picado-fiesta': ['destination', 'rustic'],
  'silver-photo-booth': ['classic'],
  'swan-chantilly-lace': ['classic'],
  'chartreuse-garden-party': ['floral', 'classic'],
  'bordeaux-silk-bow': ['classic', 'seasonal'],
  'monochrome-darkroom': ['classic'],
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


