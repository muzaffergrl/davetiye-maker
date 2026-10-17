// G139: the printable invitation of each design — which GPT parts it uses and where the text sits on them.
//
// Front = the design's invitation_card part (GPT, K21) on its paper texture; back = its info_card part. Claude draws
// no decor: only the text layer, its place (box = the free area of the part, in % of the part image: top, right,
// bottom, left) and the colours / fonts of the design's own website (themes/<id>/site.css). The part files are
// copied at full size by scripts/build-print-assets.ts into public/print/<id>/ (card.webp, back.webp, paper.webp).
// Designs without card parts yet (21, 22) are "composed": the trimmed sheet is the card, set from the design's existing
// GPT images (no shape drawn, K21) until the parts asked for in the collection's GPT_PROMPTS.md (G139) arrive.

export type Box = readonly [top: number, right: number, bottom: number, left: number];

/** One side of a composed sheet. */
export interface ComposedSide {
  /** CSS background of the whole sheet, bleed included (url(<source name>.webp) = public/print/<id>/<name>.webp). */
  bg: string;
  /** GPT images on the trim: source name and CSS position / size in % of the trim. */
  images: ReadonlyArray<{ src: string; style: string }>;
}

export interface PrintLayout {
  /** collections/<folder> holding the GPT parts. */
  collection: string;
  /**
   * public/print/<id>/<name>.webp <- collections/<folder>/assets/gpt/<path> (scripts/build-print-assets.ts); a path
   * starting with platform/ is from the repo root (a piece the theme's own build already cut from a GPT image);
   * goldOnly keeps only the gold wax of a seal cut with its envelope surround.
   */
  sources: Record<string, string | { path: string; goldOnly: true }>;
  /** Google Fonts stylesheet of the design's website (same families as themes/<id>/home.html). */
  fonts: string;
  script: string;
  serif: string;
  /** Small capitals line (host line, date); defaults to serif. */
  caps?: string;
  ink: string;
  accent: string;
  /** Text area on the front part / on the back part. */
  front: Box;
  back: Box;
  /** Paper under the card part: "tile" repeats the texture (tile size in inches); "cover": one image fills the sheet. */
  paper?: { mode: 'tile' | 'cover'; tile?: number };
  /** No card parts yet (21, 22): each side is a background with GPT images on it (see GPT_PROMPTS.md, G139). */
  composed?: { front: ComposedSide; back: ComposedSide };
  /** Names in capitals of the caps font instead of the script font (art deco). */
  namesInCaps?: boolean;
  /** CSS text-shadow of the front text (text set over a photograph, as on the design's website). */
  frontShadow?: string;
}

/** Pixel size of the current GPT card parts (01–20): 1024 × 1536. A 5×7 card prints them at about 230 ppi. */
export const PRINT_SOURCE_PX = { width: 1024, height: 1536 } as const;

const PARTS = { card: 'parts/invitation_card.png', back: 'parts/info_card.png', paper: 'parts/bg_tile.png' };
const gf = (q: string) => `https://fonts.googleapis.com/css2?${q}&display=swap`;
const cover = (name: string, at = 'center') => `url(${name}.webp) ${at} / cover no-repeat`;
const sealAt = (edge: 'top' | 'bottom') => ({ src: 'seal', style: `${edge}:4%;left:50%;width:17%;transform:translateX(-50%)` });

export const PRINT_LAYOUTS: Record<string, PrintLayout> = {
  'olive-ivory': {
    collection: '01_Olive_Ivory', sources: PARTS,
    fonts: gf('family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes'),
    script: "'Great Vibes', cursive", serif: "'EB Garamond', Georgia, serif",
    ink: '#2F3A2B', accent: '#6E5A31', front: [25, 17, 17, 20], back: [19, 18, 17, 18], paper: { mode: 'tile', tile: 2.5 },
  },
  'dusty-blue-champagne': {
    collection: '02_Dusty_Blue', sources: PARTS,
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#2B3A4E', accent: '#765627', front: [30, 15, 19, 26], back: [20, 16, 16, 16], paper: { mode: 'tile', tile: 2.5 },
  },
  'blush-garden-rose': {
    collection: '03_Blush_Garden_Rose', sources: { card: PARTS.card, back: PARTS.back, paper: 'parts/bg_scene.png' },
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Lora:ital,wght@0,400;1,400'),
    script: "'Great Vibes', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#3F2A2E', accent: '#A27C47', front: [27, 18, 17, 18], back: [27, 15, 22, 15], paper: { mode: 'cover' },
  },
  'vintage-airmail-love-letter': {
    collection: '04_Vintage_Airmail', sources: PARTS,
    fonts: gf('family=Homemade+Apple&family=Special+Elite'),
    script: "'Homemade Apple', cursive", serif: "'Special Elite', 'Courier New', monospace",
    ink: '#2E3B5E', accent: '#8C2F27', front: [24, 14, 19, 24], back: [14, 13, 11, 13], paper: { mode: 'tile', tile: 2.5 },
  },
  'mediterranean-lemon': {
    collection: '05_Lemon_Mediterranean', sources: PARTS,
    fonts: gf('family=Allura&family=Playfair+Display:ital,wght@0,400;0,500;1,400'),
    script: "'Allura', cursive", serif: "'Playfair Display', Georgia, serif",
    ink: '#1F3557', accent: '#24508F', front: [27, 13, 14, 13], back: [20, 14, 11, 14], paper: { mode: 'tile', tile: 2.5 },
  },
  'art-deco-black-tie': {
    collection: '06_Art_Deco_Noir', sources: PARTS,
    fonts: gf('family=Italiana&family=Josefin+Sans:wght@400;600'),
    script: "'Italiana', serif", serif: "'Josefin Sans', sans-serif", caps: "'Italiana', serif", namesInCaps: true,
    ink: '#E4DCC8', accent: '#E6CF8F', front: [17, 15, 16, 15], back: [12, 13, 11, 13], paper: { mode: 'tile', tile: 2.5 },
  },
  'burgundy-velvet-autumn': {
    collection: '07_Burgundy_Velvet', sources: PARTS,
    fonts: gf('family=Cinzel:wght@400..500&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Cinzel', Georgia, serif",
    ink: '#3B1A20', accent: '#74212F', front: [33, 18, 28, 20], back: [21, 15, 16, 15], paper: { mode: 'tile', tile: 2.5 },
  },
  'winter-evergreen': {
    collection: '08_Winter_Evergreen', sources: PARTS,
    fonts: gf('family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Parisienne'),
    script: "'Parisienne', cursive", serif: "'Libre Baskerville', Georgia, serif",
    ink: '#1F2E26', accent: '#2B4A3A', front: [27, 14, 16, 14], back: [17, 14, 15, 14], paper: { mode: 'tile', tile: 2.5 },
  },
  'lavender-provence': {
    collection: '09_Lavender_Provence', sources: PARTS,
    fonts: gf('family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500'),
    script: "'Alex Brush', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#2E2A3F', accent: '#4B4172', front: [13, 12, 12, 30], back: [21, 17, 15, 18], paper: { mode: 'tile', tile: 2.5 },
  },
  'tuscan-vineyard': {
    collection: '10_Tuscan_Vineyard', sources: PARTS,
    fonts: gf('family=Italianno&family=Marcellus'),
    script: "'Italianno', cursive", serif: "'Marcellus', Georgia, serif",
    ink: '#2F2420', accent: '#6E5228', front: [30, 14, 15, 20], back: [17, 14, 13, 14], paper: { mode: 'tile', tile: 2.5 },
  },
  'boho-pampas-terracotta': {
    collection: '11_Boho_Pampas', sources: PARTS,
    fonts: gf('family=Josefin+Slab:ital,wght@0,400;0,600;1,400;1,600&family=Sacramento'),
    script: "'Sacramento', cursive", serif: "'Josefin Slab', Georgia, serif",
    ink: '#3A2A22', accent: '#6C4A2A', front: [25, 32, 18, 22], back: [20, 19, 14, 19], paper: { mode: 'tile', tile: 2.5 },
  },
  'tropical-destination': {
    collection: '12_Tropical_Destination', sources: PARTS,
    fonts: gf('family=Dancing+Script:wght@500&family=Raleway:ital,wght@0,400;0,500;0,600;1,400'),
    script: "'Dancing Script', cursive", serif: "'Raleway', Arial, sans-serif",
    ink: '#1E3A3A', accent: '#19615B', front: [33, 18, 30, 22], back: [26, 25, 11, 25], paper: { mode: 'tile', tile: 2.5 },
  },
  'enchanted-forest-storybook': {
    collection: '13_Enchanted_Forest', sources: PARTS,
    fonts: gf('family=IM+Fell+English:ital@0;1&family=Tangerine:wght@700'),
    script: "'Tangerine', cursive", serif: "'IM Fell English', Georgia, serif",
    ink: '#2B2A1F', accent: '#5E4517', front: [17, 15, 16, 15], back: [15, 11, 10, 11], paper: { mode: 'tile', tile: 2.5 },
  },
  'ivory-lace-pearls': {
    collection: '14_Ivory_Lace_Pearl', sources: PARTS,
    fonts: gf('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Mrs+Saint+Delafield'),
    script: "'Mrs Saint Delafield', cursive", serif: "'Bodoni Moda', Georgia, serif",
    ink: '#3A3530', accent: '#8C7350', front: [28, 14, 22, 18], back: [18, 18, 16, 18], paper: { mode: 'tile', tile: 2.5 },
  },
  'cherry-blossom-spring': {
    collection: '15_Cherry_Blossom', sources: PARTS,
    fonts: gf('family=Noto+Serif+Display:ital,wght@0,400;0,500;1,400&family=Petit+Formal+Script'),
    script: "'Petit Formal Script', cursive", serif: "'Noto Serif Display', Georgia, serif",
    ink: '#3A3438', accent: '#6F4A58', front: [28, 18, 17, 18], back: [21, 14, 13, 22], paper: { mode: 'tile', tile: 2.5 },
  },
  'sunflower-rustic-barn': {
    collection: '16_Sunflower_Rustic', sources: PARTS,
    fonts: gf('family=Kaushan+Script&family=Merriweather:ital,wght@0,400;0,700;1,400'),
    script: "'Kaushan Script', cursive", serif: "'Merriweather', Georgia, serif",
    ink: '#3A2E1F', accent: '#6A4520', front: [20, 13, 29, 24], back: [18, 11, 10, 11], paper: { mode: 'tile', tile: 2.5 },
  },
  'emerald-gold-estate': {
    collection: '17_Emerald_Gold_Estate', sources: PARTS,
    fonts: gf('family=Cinzel+Decorative&family=Cormorant+Infant:ital,wght@0,400..600;1,400..600'),
    script: "'Cinzel Decorative', Georgia, serif", serif: "'Cormorant Infant', Georgia, serif", caps: "'Cinzel Decorative', Georgia, serif",
    ink: '#2A2216', accent: '#74561F', front: [24, 15, 19, 15], back: [17, 15, 13, 15], paper: { mode: 'tile', tile: 2.5 },
  },
  'wildflower-meadow-vellum': {
    collection: '18_Wildflower_Vellum', sources: PARTS,
    fonts: gf('family=Satisfy&family=Spectral:ital,wght@0,400;0,600;1,400'),
    script: "'Satisfy', cursive", serif: "'Spectral', Georgia, serif",
    ink: '#33361B', accent: '#3B4220', front: [19, 24, 35, 15], back: [12, 12, 30, 12], paper: { mode: 'tile', tile: 2.5 },
  },
  'midnight-garden': {
    collection: '19_Midnight_Garden', sources: PARTS,
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+SC:wght@500;600&family=Playfair+Display+SC'),
    script: "'Playfair Display SC', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Cormorant SC', Georgia, serif",
    namesInCaps: true,
    ink: '#EFE6DA', accent: '#D9B97F', front: [26, 16, 24, 20], back: [22, 15, 17, 15], paper: { mode: 'tile', tile: 2.5 },
  },
  'coastal-seaside': {
    collection: '20_Coastal_Seaside', sources: PARTS,
    fonts: gf('family=Allison&family=Lora:ital,wght@0,400;0,600;1,400'),
    script: "'Allison', cursive", serif: "'Lora', Georgia, serif",
    ink: '#1D3445', accent: '#24506E', front: [27, 14, 23, 14], back: [19, 14, 22, 14], paper: { mode: 'tile', tile: 2.5 },
  },
  'crimson-rose-atelier': {
    collection: '21_Crimson_Rose_Atelier',
    sources: { paper: 'textures/paper-background.png', branch: 'decor/rose-branch.png', seal: 'decor/seal.png' },
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600'),
    script: "'Cormorant Garamond', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Manrope', Arial, sans-serif",
    ink: '#411C23', accent: '#4B0C17', front: [24, 12, 20, 12], back: [20, 12, 12, 12],
    composed: {
      front: {
        bg: cover('paper'),
        images: [
          { src: 'branch', style: 'top:-2%;left:-6%;width:62%' },
          { src: 'branch', style: 'bottom:-2%;right:-6%;width:62%;transform:rotate(180deg)' },
          sealAt('bottom'),
        ],
      },
      back: { bg: cover('paper'), images: [sealAt('top')] },
    },
  },
  // 22: front = the website's first screen (the Lake Como dusk, text on its sky); back = the website's night black
  // (--black) with the gold wax seal cut from the envelope by the theme build (img/env_seal).
  'nocturne-lake-estate': {
    collection: '22_Nocturne_Lake_Estate',
    sources: { scene: 'hero.png', seal: { path: 'platform/themes/nocturne-lake-estate/img/env_seal-269.webp', goldOnly: true } },
    fonts: gf('family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500'),
    script: "'Cinzel', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Jost', Arial, sans-serif",
    namesInCaps: true, frontShadow: '0 0.02in 0.12in #000c',
    ink: '#F1E4CC', accent: '#D8BF93', front: [5, 18, 58, 18], back: [20, 12, 8, 12],
    composed: {
      front: { bg: cover('scene', '50% 0%'), images: [] },
      back: { bg: '#11120F', images: [sealAt('top')] },
    },
  },
  // 23: interim until the PAKET 6 grounds arrive (GPT_PROMPTS.md): both sides on the website's aubergine velvet ground
  // (img/bg_velvet, toned from a GPT texture by the theme build) with the satin bow (img/closure) — at the top of the
  // front above the text, and at the bottom of the back under the schedule and QR. Text in champagne, away from the bow.
  'velvet-jewel-box': {
    collection: '23_Velvet_Jewel_Box',
    sources: { velvet: 'platform/themes/velvet-jewel-box/img/bg_velvet-1024.webp', bow: 'platform/themes/velvet-jewel-box/img/closure-236.webp' },
    fonts: gf('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Bodoni Moda', Georgia, serif",
    ink: '#F8EDE0', accent: '#E8D3B0', front: [27, 13, 14, 13], back: [12, 12, 22, 12],
    composed: {
      front: { bg: cover('velvet'), images: [{ src: 'bow', style: 'top:7%;left:50%;width:24%;transform:translateX(-50%)' }] },
      back: { bg: cover('velvet'), images: [{ src: 'bow', style: 'bottom:5%;left:50%;width:18%;transform:translateX(-50%)' }] },
    },
  },
};

export function printLayout(themeId: string): PrintLayout | null {
  return Object.hasOwn(PRINT_LAYOUTS, themeId) ? PRINT_LAYOUTS[themeId] : null;
}
