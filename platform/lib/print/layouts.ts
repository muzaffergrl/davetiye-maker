// G139: the printable invitation of each design — which GPT parts it uses and where the text sits on them.
//
// Front = the design's invitation_card part (GPT, K21) on its paper texture; back = its info_card part. Claude draws
// no decor: only the text layer, its place (box = the free area of the part, in % of the part image: top, right,
// bottom, left; bands = where decoration reaches into it, G149) and the colours / fonts of the design's own website
// (themes/<id>/site.css). The part files are copied at full size by scripts/build-print-assets.ts into
// public/print/<id>/ (card.webp, back.webp, paper.webp).
// Designs without card parts yet (21, 22, 24, 25, 26, 29) are "composed": the trimmed sheet is the card, set from the design's existing
// GPT images (no shape drawn, K21) until the parts asked for in the collection's GPT_PROMPTS.md (G139) arrive.

export type Box = readonly [top: number, right: number, bottom: number, left: number];

/**
 * G149: a stretch of the text area that decoration reaches into (a rose cluster in a corner, an arch, a sprig): from
 * `top` to `bottom` (% of the part's height) a line may be at most `width` % of the part's width wide, centred on the
 * text area's axis. fitText narrows (or makes smaller) every line that lies in a band; text never sits on the art.
 * Box and bands are measured from the rendered GPT art (both sizes) with a clearance of ~2 % of the card width around
 * every decoration (G149); tests/g149-print-layout.test.ts checks that box + bands are clear of decoration on the art and
 * that no line of long content leaves them. New or replaced parts (e.g. the 2× print parts) need the area re-measured.
 */
export type Band = readonly [top: number, bottom: number, width: number];

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
  /** Text area on the front part / on the back part (the free area of the art, clear of every decoration). */
  front: Box;
  back: Box;
  /** Narrower stretches of the text areas where decoration reaches in (G149); none = the whole box is free. */
  bands?: { front?: readonly Band[]; back?: readonly Band[] };
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

const tileRow = (edge: 'top' | 'bottom') =>
  ['tile1', 'tile2', 'tile3', 'tile2', 'tile1'].map((src, i) => ({ src, style: `${edge}:5%;left:${25 + i * 10.5}%;width:9%` }));

/** 30 (G169): a row of the theme's azulejo tiles along one edge — corner, border and field tiles as on the website's wall. */
const azulejoRow = (edge: 'top' | 'bottom') =>
  ['tile3', 'tile2', 'tile1', 'tile4', 'tile1', 'tile2', 'tile3'].map((src, i) => ({
    src,
    style: `${edge}:4%;left:${11.5 + i * 11}%;width:11%;transform:rotate(${(edge === 'top' ? 0 : 180) + (i === 6 ? 90 : 0)}deg)`,
  }));

export const PRINT_LAYOUTS: Record<string, PrintLayout> = {
  'olive-ivory': {
    collection: '01_Olive_Ivory', sources: PARTS,
    fonts: gf('family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Great+Vibes'),
    script: "'Great Vibes', cursive", serif: "'EB Garamond', Georgia, serif",
    ink: '#2F3A2B', accent: '#6E5A31', front: [27.5, 14.5, 22, 14.5], back: [26.5, 20, 17, 20], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[27.5, 29.5, 24], [29, 32.5, 36], [32, 40.5, 42], [40, 45.5, 53], [45, 51, 59], [59.5, 66, 61], [65.5, 74.5, 46], [74, 78, 32]] },
  },
  'dusty-blue-champagne': {
    collection: '02_Dusty_Blue', sources: PARTS,
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,500&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#2B3A4E', accent: '#765627', front: [37.5, 17.5, 27.5, 25.5], back: [29.5, 17, 15, 17], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[37.5, 39.5, 24], [39, 40.5, 30], [40, 43, 42], [42.5, 51, 50], [60.5, 69, 46], [68.5, 70.5, 40], [70, 72.5, 30]] },
  },
  'blush-garden-rose': {
    collection: '03_Blush_Garden_Rose', sources: { card: PARTS.card, back: PARTS.back, paper: 'parts/bg_scene.png' },
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&family=Lora:ital,wght@0,400;1,400'),
    script: "'Great Vibes', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#3F2A2E', accent: '#A27C47', front: [32, 15.5, 18, 16.5], back: [29, 14.5, 19, 14.5], paper: { mode: 'cover' },
    bands: { front: [[32, 33.5, 25], [33, 33.5, 32], [33, 35, 39], [34.5, 35.5, 45], [35, 39, 52], [38.5, 41, 60], [64.5, 72, 54], [71.5, 74.5, 43], [74, 80, 33], [79.5, 82, 26]], back: [[29, 32, 47], [31.5, 41, 56], [63, 67.5, 58], [67, 71.5, 52], [71, 76, 41], [75.5, 78, 34], [77.5, 81, 27]] },
  },
  'vintage-airmail-love-letter': {
    collection: '04_Vintage_Airmail', sources: PARTS,
    fonts: gf('family=Homemade+Apple&family=Special+Elite'),
    script: "'Homemade Apple', cursive", serif: "'Special Elite', 'Courier New', monospace",
    ink: '#2E3B5E', accent: '#8C2F27', front: [24, 16, 23, 19], back: [16.5, 12.5, 14, 13.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[24, 26.5, 24], [26, 27, 30], [26.5, 29.5, 36], [29, 30, 42], [29.5, 30.5, 49], [30, 33, 55], [32.5, 40, 61], [46, 57.5, 58], [60.5, 64.5, 60], [64, 68, 54], [67.5, 73, 43], [72.5, 74.5, 36], [74, 76.5, 30], [76, 77, 24]], back: [[16.5, 18.5, 56], [18, 19, 62], [19.5, 25.5, 68], [39, 43.5, 64], [68, 70.5, 63], [70, 79, 56], [78.5, 84, 50], [83.5, 84.5, 56], [84, 86, 61]] },
  },
  'mediterranean-lemon': {
    collection: '05_Lemon_Mediterranean', sources: PARTS,
    fonts: gf('family=Allura&family=Playfair+Display:ital,wght@0,400;0,500;1,400'),
    script: "'Allura', cursive", serif: "'Playfair Display', Georgia, serif",
    ink: '#1F3557', accent: '#24508F', front: [28.5, 12, 15, 12], back: [29.5, 16, 11.5, 16], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[28.5, 29.5, 24], [29, 32.5, 40], [32, 35, 46], [34.5, 36.5, 52], [36, 41, 62], [40.5, 43.5, 70]] },
  },
  'art-deco-black-tie': {
    collection: '06_Art_Deco_Noir', sources: PARTS,
    fonts: gf('family=Italiana&family=Josefin+Sans:wght@400;600'),
    script: "'Italiana', serif", serif: "'Josefin Sans', sans-serif", caps: "'Italiana', serif", namesInCaps: true,
    ink: '#E4DCC8', accent: '#E6CF8F', front: [22.5, 17.5, 15, 18], back: [11, 16.5, 11, 17], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[22.5, 24.5, 46], [24, 26.5, 52], [26, 28.5, 58], [80, 82.5, 59], [82, 85, 50]], back: [[11, 14, 30], [13.5, 16.5, 38], [16, 19, 45], [18.5, 20, 51], [19.5, 28.5, 60], [82, 84.5, 64], [84, 87, 58], [86.5, 89, 52]] },
  },
  'burgundy-velvet-autumn': {
    collection: '07_Burgundy_Velvet', sources: PARTS,
    fonts: gf('family=Cinzel:wght@400..500&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Cinzel', Georgia, serif",
    ink: '#3B1A20', accent: '#74212F', front: [37, 10.5, 25, 16.5], back: [24, 15.5, 16, 15.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[37, 39, 32], [38.5, 42.5, 38], [42, 48, 56], [47.5, 49, 68], [57.5, 64, 61], [63.5, 68, 52], [67.5, 75, 30]], back: [[78.5, 80.5, 63], [80, 84, 51]] },
  },
  'winter-evergreen': {
    collection: '08_Winter_Evergreen', sources: PARTS,
    fonts: gf('family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Parisienne'),
    script: "'Parisienne', cursive", serif: "'Libre Baskerville', Georgia, serif",
    ink: '#1F2E26', accent: '#2B4A3A', front: [33.5, 13, 18.5, 13], back: [23.5, 15, 15, 15], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[33.5, 37, 31], [36.5, 40, 37], [70, 74, 64], [73.5, 74.5, 56], [74, 79.5, 45], [79, 81.5, 31]], back: [[83.5, 85, 64]] },
  },
  'lavender-provence': {
    collection: '09_Lavender_Provence', sources: PARTS,
    fonts: gf('family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500'),
    script: "'Alex Brush', cursive", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#2E2A3F', accent: '#4B4172', front: [25, 10, 10.5, 23], back: [24.5, 16.5, 13, 17.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[25, 27.5, 28], [27, 28, 34], [27.5, 31.5, 42], [31, 31.5, 48], [31, 45.5, 54], [45, 46.5, 62], [89, 89.5, 27]] },
  },
  'tuscan-vineyard': {
    collection: '10_Tuscan_Vineyard', sources: PARTS,
    fonts: gf('family=Italianno&family=Marcellus'),
    script: "'Italianno', cursive", serif: "'Marcellus', Georgia, serif",
    ink: '#2F2420', accent: '#6E5228', front: [33.5, 11.5, 16, 11.5], back: [24, 16, 13.5, 16], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[33.5, 36, 33], [35.5, 42.5, 39], [42, 45, 50], [44.5, 47, 57], [46.5, 53, 66]], back: [[79, 85, 63], [84.5, 86.5, 57]] },
  },
  'boho-pampas-terracotta': {
    collection: '11_Boho_Pampas', sources: PARTS,
    fonts: gf('family=Josefin+Slab:ital,wght@0,400;0,600;1,400;1,600&family=Sacramento'),
    script: "'Sacramento', cursive", serif: "'Josefin Slab', Georgia, serif",
    ink: '#3A2A22', accent: '#6C4A2A', front: [30, 23.5, 34, 26.5], back: [16, 23, 23.5, 23], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[30, 30.5, 24], [30, 38, 32], [37.5, 42.5, 45], [55, 61.5, 38], [61, 66, 30]], back: [[16, 17, 24], [16.5, 18.5, 30], [18, 20, 36], [19.5, 22.5, 42], [22, 26.5, 48]] },
  },
  'tropical-destination': {
    collection: '12_Tropical_Destination', sources: PARTS,
    fonts: gf('family=Dancing+Script:wght@500&family=Raleway:ital,wght@0,400;0,500;0,600;1,400'),
    script: "'Dancing Script', cursive", serif: "'Raleway', Arial, sans-serif",
    ink: '#1E3A3A', accent: '#19615B', front: [39, 14.5, 33, 29.5], back: [28, 23.5, 10, 23.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[39, 42, 25], [41.5, 43, 31], [42.5, 46, 41], [45.5, 50, 47], [55, 57, 51], [56.5, 66.5, 37], [66, 67, 24]] },
  },
  'enchanted-forest-storybook': {
    collection: '13_Enchanted_Forest', sources: PARTS,
    fonts: gf('family=IM+Fell+English:ital@0;1&family=Tangerine:wght@700'),
    script: "'Tangerine', cursive", serif: "'IM Fell English', Georgia, serif",
    ink: '#2B2A1F', accent: '#5E4517', front: [21.5, 17.5, 16.5, 17.5], back: [21, 13.5, 10, 13.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[21.5, 22, 24], [21.5, 23.5, 30], [23, 26, 45], [25.5, 26.5, 51], [26, 32, 57], [31.5, 36, 64], [35.5, 40, 56], [51.5, 65.5, 63], [68.5, 71.5, 56], [71, 77.5, 40], [77, 81, 30], [80.5, 83.5, 24]], back: [[86.5, 88.5, 71], [88, 90, 65]] },
  },
  'ivory-lace-pearls': {
    collection: '14_Ivory_Lace_Pearl', sources: PARTS,
    fonts: gf('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Mrs+Saint+Delafield'),
    script: "'Mrs Saint Delafield', cursive", serif: "'Bodoni Moda', Georgia, serif",
    ink: '#3A3530', accent: '#8C7350', front: [30.5, 12, 20, 14.5], back: [22, 17, 13.5, 17.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[30.5, 31.5, 24], [31, 33.5, 30], [33, 35, 36], [34.5, 35, 42], [34.5, 42, 49], [41.5, 43.5, 55], [43, 43.5, 62], [43, 48, 68], [75, 77, 68], [76.5, 79, 63], [78.5, 80, 49]] },
  },
  'cherry-blossom-spring': {
    collection: '15_Cherry_Blossom', sources: PARTS,
    fonts: gf('family=Noto+Serif+Display:ital,wght@0,400;0,500;1,400&family=Petit+Formal+Script'),
    script: "'Petit Formal Script', cursive", serif: "'Noto Serif Display', Georgia, serif",
    ink: '#3A3438', accent: '#6F4A58', front: [26, 18.5, 23.5, 15.5], back: [27, 15, 14, 16], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[26, 33, 30], [32.5, 33.5, 36], [33, 38.5, 46], [38, 39, 52], [38.5, 43, 60], [45, 52, 61], [58.5, 66.5, 53], [66, 72.5, 42], [72, 73, 36], [72.5, 76.5, 24]], back: [[27, 32, 25], [31.5, 32, 31], [31.5, 40, 54], [39.5, 40.5, 60]] },
  },
  'sunflower-rustic-barn': {
    collection: '16_Sunflower_Rustic', sources: PARTS,
    fonts: gf('family=Kaushan+Script&family=Merriweather:ital,wght@0,400;0,700;1,400'),
    script: "'Kaushan Script', cursive", serif: "'Merriweather', Georgia, serif",
    ink: '#3A2E1F', accent: '#6A4520', front: [24.5, 13.5, 38, 21.5], back: [25.5, 11, 10, 10], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[24.5, 26, 38], [25.5, 27, 44], [26.5, 29.5, 52], [29, 33.5, 59], [45.5, 51.5, 53], [51, 55, 46], [54.5, 62, 34]] },
  },
  'emerald-gold-estate': {
    collection: '17_Emerald_Gold_Estate', sources: PARTS,
    fonts: gf('family=Cinzel+Decorative&family=Cormorant+Infant:ital,wght@0,400..600;1,400..600'),
    script: "'Cinzel Decorative', Georgia, serif", serif: "'Cormorant Infant', Georgia, serif", caps: "'Cinzel Decorative', Georgia, serif",
    ink: '#2A2216', accent: '#74561F', front: [28.5, 13, 28, 13], back: [24, 14.5, 12, 14.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[28.5, 29, 33], [28.5, 38.5, 50], [38, 43.5, 61], [43, 47, 67], [54, 61.5, 63], [61, 67, 53], [66.5, 67.5, 47], [67, 72, 36]], back: [[41.5, 47.5, 62], [80, 86, 48], [87.5, 88, 39]] },
  },
  'wildflower-meadow-vellum': {
    collection: '18_Wildflower_Vellum', sources: PARTS,
    fonts: gf('family=Satisfy&family=Spectral:ital,wght@0,400;0,600;1,400'),
    script: "'Satisfy', cursive", serif: "'Spectral', Georgia, serif",
    ink: '#33361B', accent: '#3B4220', front: [20, 18, 30.5, 18], back: [10.5, 10, 33.5, 10], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[20, 23.5, 36], [23, 25, 43], [24.5, 40, 50], [47.5, 55, 56], [54.5, 63, 51], [62.5, 65, 45], [64.5, 65.5, 37], [65, 69.5, 24]], back: [[47, 56.5, 49], [56, 57, 55], [56.5, 64, 43], [63.5, 66.5, 28]] },
  },
  'midnight-garden': {
    collection: '19_Midnight_Garden', sources: PARTS,
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+SC:wght@500;600&family=Playfair+Display+SC'),
    script: "'Playfair Display SC', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Cormorant SC', Georgia, serif",
    namesInCaps: true,
    ink: '#EFE6DA', accent: '#D9B97F', front: [31.5, 17.5, 31, 17.5], back: [29, 15.5, 16, 15.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[31.5, 34, 33], [33.5, 34, 39], [33.5, 35, 47], [34.5, 45.5, 54], [52.5, 62.5, 56], [62, 64.5, 50], [64, 67, 41], [66.5, 69, 34]], back: [[81.5, 84, 61]] },
  },
  'coastal-seaside': {
    collection: '20_Coastal_Seaside', sources: PARTS,
    fonts: gf('family=Allison&family=Lora:ital,wght@0,400;0,600;1,400'),
    script: "'Allison', cursive", serif: "'Lora', Georgia, serif",
    ink: '#1D3445', accent: '#24506E', front: [26, 11, 27.5, 11], back: [19, 11.5, 23.5, 11.5], paper: { mode: 'tile', tile: 2.5 },
    bands: { front: [[26, 28.5, 31], [28, 33.5, 42], [33, 34.5, 48], [34, 39.5, 62], [39, 48.5, 68], [58, 62.5, 66], [62, 63, 72], [62.5, 64, 65], [63.5, 64.5, 53], [64, 69.5, 47], [69, 71.5, 42], [71, 72.5, 28]], back: [[72.5, 73.5, 57], [73, 74, 47], [73.5, 75.5, 41], [75, 76.5, 25]] },
  },
  'crimson-rose-atelier': {
    collection: '21_Crimson_Rose_Atelier',
    sources: { paper: 'textures/paper-background.png', branch: 'decor/rose-branch.png', seal: 'decor/seal.png' },
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600'),
    script: "'Cormorant Garamond', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Manrope', Arial, sans-serif",
    ink: '#411C23', accent: '#4B0C17', front: [27.5, 11, 27.5, 11], back: [20, 12, 12, 12],
    bands: { front: [[27.5, 31, 28], [30.5, 33, 60], [32.5, 33, 69], [67, 69.5, 60], [69, 72.5, 28]] },
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
    bands: { front: [[32.5, 35, 62], [34.5, 37, 55], [36.5, 40, 49], [40, 41, 43], [41, 42, 36]] },
    composed: {
      front: { bg: cover('scene', '50% 0%'), images: [] },
      back: { bg: '#11120F', images: [sealAt('top')] },
    },
  },
  // 23: interim until the PAKET 6 grounds arrive (GPT_PROMPTS.md): both sides on the website's aubergine velvet ground
  // (img/bg_velvet, toned from a GPT texture by the theme build) with the satin bow (img/closure) — at the top of the
  // front above the text, and at the bottom of the back under the schedule and QR. Text in champagne, away from the bow.
  // PAKET 6 arrived (print/invitation_front.png + invitation_back.png, one pair for 5×7 and A5): sources → { front:
  // 'print/invitation_front.png', back: 'print/invitation_back.png' }, composed.front/back → { bg: cover('front'|'back'),
  // images: [] }, run build-print-assets, then re-measure front/back (+ bands) on the art with tests/g149-print-layout.test.ts.
  // The prompts keep the boxes below empty (front 25–90 % × 11–89 %, back 10–80 % × 11–89 %).
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
  // 24 (G162, interim until the PAKET 6 grounds in GPT_PROMPTS.md arrive): the ivory programme paper with a band of the
  // peacock velvet across the top (and the foot of the front), both cut by the theme build from GPT textures; the text
  // sits on the plain paper between the bands.
  // When print/invitation_{front,back}_5x7.png arrive (G167; GPT_PROMPTS.md PAKET 6 keeps its ornament outside these
  // boxes): sources → { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }, composed →
  // { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } } (full-bleed grounds), then
  // build-print-assets, re-measure front/back on the art (G149, tests/g149-print-layout.test.ts) and drop paper/velvet.webp.
  'grand-theatre-premiere': {
    collection: '24_Grand_Theatre_Premiere',
    sources: { paper: 'platform/themes/grand-theatre-premiere/img/paper-1024.webp', velvet: 'platform/themes/grand-theatre-premiere/img/velvet-640.webp' },
    fonts: gf('family=Abril+Fatface&family=Playfair+Display:ital,wght@0,400;0,600;1,400'),
    script: "'Abril Fatface', Georgia, serif", serif: "'Playfair Display', Georgia, serif",
    ink: '#1E2626', accent: '#6E5119', front: [19, 12, 15, 12], back: [17, 12, 8, 12],
    composed: {
      front: {
        bg: cover('paper'),
        images: [
          { src: 'velvet', style: 'top:-4%;left:-4%;width:108%;height:15%;object-fit:cover' },
          { src: 'velvet', style: 'bottom:-4%;left:-4%;width:108%;height:12%;object-fit:cover;transform:scaleY(-1)' },
        ],
      },
      back: { bg: cover('paper'), images: [{ src: 'velvet', style: 'top:-4%;left:-4%;width:108%;height:13%;object-fit:cover' }] },
    },
  },
  // 25 (G163): composed until the PAKET 6 print grounds arrive. Interim: both sides on the website's ivory (the interim
  // poster tones were not empty enough for the G149 free-area check); the back carries the boarding stamp the theme build
  // cut. Nothing switches by itself (G167): build-print-assets.ts only copies the `sources` below, and the text boxes
  // are measured on real art (G149). When collections/25_Orient_Express_Voyage/assets/gpt/print/invitation_front_5x7.png
  // and invitation_back_5x7.png exist (GPT_PROMPTS.md P6.1–P6.2; they keep the free areas these boxes need):
  //   sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
  //   front: [44, 12, 8, 12], back: [20, 12, 10, 12],
  //   composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  // then `node scripts/build-print-assets.ts --theme orient-express-voyage` (platform/), delete the stale stamp.webp from
  // public/print/orient-express-voyage/, and re-measure box + bands on the rendered art (tests/g149-print-layout.test.ts).
  // One ground per side serves both sizes: on A5 `cover` trims ~1 % off the sides.
  'orient-express-voyage': {
    collection: '25_Orient_Express_Voyage',
    sources: { stamp: 'platform/themes/orient-express-voyage/img/stamp-480.webp' },
    fonts: gf('family=Limelight&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400'),
    script: "'Limelight', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#1E3A2C', accent: '#7A5C24', front: [12, 12, 12, 12], back: [20, 12, 8, 12],
    composed: {
      front: { bg: '#F3EBD9', images: [] },
      back: { bg: '#F3EBD9', images: [{ ...sealAt('top'), src: 'stamp' }] },
    },
  },
  // 26 (G164, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one
  // sheet per side for 5×7 and A5 — GPT_PROMPTS.md): rice paper with the indigo washi of the opened folds at its top
  // and bottom edge — both toned papers cut by the theme build (img/rice, img/washi_indigo; no shape drawn). The
  // prompts keep the front / back boxes below empty on the art; on arrival (G167): sources → { front, back } of those
  // two files, composed → { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  // re-measure the boxes on the art (G149), then build-print-assets.
  'kintsugi-washi': {
    collection: '26_Kintsugi_Washi',
    sources: { rice: 'platform/themes/kintsugi-washi/img/rice-1024.webp', washi: 'platform/themes/kintsugi-washi/img/washi_indigo-1024.webp' },
    fonts: gf('family=Allura&family=Shippori+Mincho:wght@400;600'),
    script: "'Allura', cursive", serif: "'Shippori Mincho', Georgia, serif",
    ink: '#1D2340', accent: '#7A5C22', front: [21, 13, 19, 13], back: [17, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(rice.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'washi', style: 'top:0;left:0;width:100%;height:12%;object-fit:cover' },
          { src: 'washi', style: 'bottom:0;left:0;width:100%;height:11%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(rice.webp) 0 0 / 2.4in repeat', images: [{ src: 'washi', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 27 (G165, before its GPT parts): both sides on ivory lime plaster (the same GPT plaster the theme's card is toned
  // from: 05's seamless bg_tile at full size, reached from this collection's assets/gpt/ by ../../../) with a row of the
  // zellige tiles the theme build cut (img/tile_N) — front: a row along the top and one along the bottom, back: a row on
  // top. Text in cedar on the plaster. Tiles at 152 px (the theme build's 2× files). When PAKET 6 arrives (GPT_PROMPTS.md:
  // print/print_front.png + print/print_back.png, 1819×2551, one ground per side for 5×7 and A5): sources → { front:
  // 'print/print_front.png', back: 'print/print_back.png' }, composed → { front: { bg: cover('front'), images: [] }, back:
  // { bg: cover('back'), images: [] } }, then build-print-assets + tests/g149-print-layout.test.ts (re-measure the boxes).
  'riad-lantern-nights': {
    collection: '27_Riad_Lantern_Nights',
    sources: {
      paper: '../../../05_Lemon_Mediterranean/assets/gpt/parts/bg_tile.png',
      tile1: 'platform/themes/riad-lantern-nights/img/tile_1-152.webp',
      tile2: 'platform/themes/riad-lantern-nights/img/tile_2-152.webp',
      tile3: 'platform/themes/riad-lantern-nights/img/tile_3-152.webp',
    },
    fonts: gf('family=Cinzel:wght@400;500&family=Marcellus&family=Marcellus+SC'),
    script: "'Cinzel', Georgia, serif", serif: "'Marcellus', Georgia, serif", caps: "'Marcellus SC', Georgia, serif",
    namesInCaps: true,
    ink: '#3A2114', accent: '#8F5418', front: [17, 12, 17, 12], back: [16, 12, 10, 12],
    composed: {
      front: { bg: cover('paper'), images: [...tileRow('top'), ...tileRow('bottom')] },
      back: { bg: cover('paper'), images: tileRow('top') },
    },
  },
  // 28 (G166): composed until its print grounds arrive (GPT_PROMPTS.md PAKET 6) — front = the website's cream paper with the
  // rose satin bow at the top; back = the same paper with the bow small at the top. Both images come from the theme
  // build (interim crops of repository GPT pictures, see themes/maison-patisserie/build_images.py).
  // G167: the PAKET 6 prompts keep these text boxes empty (front bottom 16 % leaves the macaron garland its strip); on
  // arrival: sources -> print/invitation_front.png + print/invitation_back.png, composed -> cover('front') / cover('back')
  // with no images, boxes re-measured on the art (G149) — steps in GPT_PROMPTS.md PAKET 6 "Gelince".
  'maison-patisserie': {
    collection: '28_Maison_Patisserie',
    sources: { paper: 'platform/themes/maison-patisserie/img/bg_page-1024.webp', bow: 'platform/themes/maison-patisserie/img/bow-480.webp' },
    fonts: gf('family=Italiana&family=Parisienne'),
    script: "'Parisienne', cursive", serif: "'Italiana', Georgia, serif",
    ink: '#3E3A32', accent: '#9B4F5A', front: [27, 13, 16, 13], back: [21, 12, 10, 12],
    composed: {
      front: { bg: cover('paper'), images: [{ src: 'bow', style: 'top:5%;left:50%;width:42%;transform:translateX(-50%)' }] },
      back: { bg: cover('paper'), images: [{ src: 'bow', style: 'top:4%;left:50%;width:24%;transform:translateX(-50%)' }] },
    },
  },
  // 29 (G168, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one sheet
  // per side for 5×7 and A5 — GPT_PROMPTS.md): silver-ivory chart paper with a band of the midnight sky at its top and
  // bottom edge — both toned textures cut by the theme build (img/paper, img/sky; no shape drawn). The prompts keep the
  // front / back boxes below empty on the art; on arrival: sources → { front, back } of those two files, composed →
  // { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, re-measure the boxes on the
  // art (G149), then build-print-assets.
  'celestial-observatory': {
    collection: '29_Celestial_Observatory',
    sources: { paper: 'platform/themes/celestial-observatory/img/paper-1024.webp', sky: 'platform/themes/celestial-observatory/img/sky-1024.webp' },
    fonts: gf('family=Forum&family=Imperial+Script'),
    script: "'Imperial Script', cursive", serif: "'Forum', Georgia, serif",
    ink: '#141A33', accent: '#7A5A1E', front: [21, 13, 19, 13], back: [17, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'sky', style: 'top:0;left:0;width:100%;height:13%;object-fit:cover' },
          { src: 'sky', style: 'bottom:0;left:0;width:100%;height:11%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'sky', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 30 (G169): composed until its print grounds arrive (GPT_PROMPTS.md PAKET 6: print/invitation_front.png +
  // print/invitation_back.png, 1819×2551, one ground per side for 5×7 and A5 at 300 ppi) — card paper (18's plain GPT
  // cotton paper at full size) with a row of the azulejo tiles the theme build cut (img/tile_N-256): front one along the
  // top and one along the bottom, back one on top. On arrival: sources -> { front: 'print/invitation_front.png', back:
  // 'print/invitation_back.png' }, composed -> { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'),
  // images: [] } }, re-measure the boxes on the art (G149), then build-print-assets — steps in GPT_PROMPTS.md PAKET 6.
  'azulejo-mosaic': {
    collection: '30_Azulejo_Mosaic',
    sources: {
      paper: '../../../18_Wildflower_Vellum/assets/gpt/parts/bg_tile.png',
      tile1: 'platform/themes/azulejo-mosaic/img/tile_1-256.webp',
      tile2: 'platform/themes/azulejo-mosaic/img/tile_2-256.webp',
      tile3: 'platform/themes/azulejo-mosaic/img/tile_3-256.webp',
      tile4: 'platform/themes/azulejo-mosaic/img/tile_4-256.webp',
    },
    fonts: gf('family=Arizonia&family=Cormorant+Upright:wght@400;500;600'),
    script: "'Arizonia', cursive", serif: "'Cormorant Upright', Georgia, serif",
    ink: '#173A80', accent: '#8C4128', front: [17, 12, 17, 12], back: [16, 12, 10, 12],
    composed: {
      front: { bg: cover('paper'), images: [...azulejoRow('top'), ...azulejoRow('bottom')] },
      back: { bg: cover('paper'), images: azulejoRow('top') },
    },
  },
};

export function printLayout(themeId: string): PrintLayout | null {
  return Object.hasOwn(PRINT_LAYOUTS, themeId) ? PRINT_LAYOUTS[themeId] : null;
}
