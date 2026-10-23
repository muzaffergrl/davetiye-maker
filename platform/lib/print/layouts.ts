// G139: the printable invitation of each design — which GPT parts it uses and where the text sits on them.
//
// Front = the design's invitation_card part (GPT, K21) on its paper texture; back = its info_card part. Claude draws
// no decor: only the text layer, its place (box = the free area of the part, in % of the part image: top, right,
// bottom, left; bands = where decoration reaches into it, G149) and the colours / fonts of the design's own website
// (themes/<id>/site.css). The part files are copied at full size by scripts/build-print-assets.ts into
// public/print/<id>/ (card.webp, back.webp, paper.webp).
// Designs without card parts (21–38) are "composed": the trimmed sheet is the card, set from the design's existing
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

/** 38 (G187): a garland of the theme's flags across the top, sagging toward the middle (each flag hangs square to it). */
const flagGarland = (n: number, top: number, width: number) =>
  Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const step = Math.min(14, 84 / n);
    return {
      src: `flag${(i % 6) + 1}`,
      style: `top:${(top + 4 * t * (1 - t) * 2.4).toFixed(2)}%;left:${(50 + (i - (n - 1) / 2) * step - width * 0.4).toFixed(2)}%;width:${(width * 0.8).toFixed(2)}%;transform:rotate(${((t - 0.5) * -8).toFixed(1)}deg)`,
    };
  });

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
  // 22 (G422, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): ivory laid card, a gold crescent over olive
  // branches at the top (down to ~15 %), a gold hairline (~77 %) over the oil-painted night lake along the bottom on the
  // front; a short olive-and-crescent at the top of the back (~10.5 %) and a slim lake strip below ~93 %. `cover` for 5×7
  // and A5 (ChatGPT's 1067×1474). Charcoal ink; boxes ~2 % clear of it all.
  'nocturne-lake-estate': {
    collection: '22_Nocturne_Lake_Estate',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Cinzel:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500'),
    script: "'Cinzel', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif", caps: "'Jost', Arial, sans-serif",
    namesInCaps: true,
    ink: '#1C1D15', accent: '#8A6A3C', front: [17, 10, 25.5, 10], back: [12.5, 9, 9.5, 9],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 23 (G423, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): ivory card, seed-pearl swags and a champagne
  // satin bow across the top (down to ~18.5 %), a rose gold double rule near the bottom (~91 %) on the front; one short
  // pearl swag at the top of the back (~11 %). `cover` for 5×7 and A5 (ChatGPT's 1068×1473). Boxes ~2 % clear of it all.
  'velvet-jewel-box': {
    collection: '23_Velvet_Jewel_Box',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Pinyon+Script'),
    script: "'Pinyon Script', cursive", serif: "'Bodoni Moda', Georgia, serif",
    ink: '#3A1834', accent: '#9A6650', front: [20.5, 12, 11, 12], back: [13.5, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 24 (G424, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): ivory card, a gold-fringed burgundy velvet
  // valance with a blank gilded cartouche across the top (down to ~12.3 %), a gilded double rule with a tassel near the
  // bottom (from ~90.7 %) on the front; a short gilded acanthus with a tassel at the top of the back (~11.7 %). `cover`
  // for 5×7 and A5 (ChatGPT's 1070×1470). Boxes ~2 % clear of it all (measured on the images).
  'grand-theatre-premiere': {
    collection: '24_Grand_Theatre_Premiere',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Abril+Fatface&family=Playfair+Display:ital,wght@0,400;0,600;1,400'),
    script: "'Abril Fatface', Georgia, serif", serif: "'Playfair Display', Georgia, serif",
    ink: '#1E2626', accent: '#5E1622', front: [14.5, 12, 11.5, 12], back: [14, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 25 (G425, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): ivory ticket card, a brass-foil fan header
  // with two dried-rose sprigs across the top (down to ~14.5 %), a brass rule over a row of perforation dots at the
  // bottom (from ~93 %) and a brass double frame ~3 % inside the trim on the front; one small fan with short rules at the
  // top of the back (~11.5 %). `cover` for 5×7 and A5 (ChatGPT's 1068×1473). Boxes ~2.5 % clear of it all.
  'orient-express-voyage': {
    collection: '25_Orient_Express_Voyage',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Limelight&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400'),
    script: "'Limelight', Georgia, serif", serif: "'Cormorant Garamond', Georgia, serif",
    ink: '#14261C', accent: '#7C5B25', front: [17, 10, 10, 10], back: [14, 10, 8, 10],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 26 (G426, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): rice-paper card, a torn strip of indigo washi
  // with a gold kintsugi seam and a white plum sprig across the top (down to ~19.3 %), one gold seam near the bottom
  // (~91 %) on the front; one short gold seam with a plum blossom at the top of the back (~12.8 %). `cover` for 5×7 and
  // A5 (ChatGPT's 1068×1472). Dark indigo ink; boxes ~2 % clear of it all.
  'kintsugi-washi': {
    collection: '26_Kintsugi_Washi',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Allura&family=Shippori+Mincho:wght@400;600'),
    script: "'Allura', cursive", serif: "'Shippori Mincho', Georgia, serif",
    ink: '#1D2340', accent: '#7A5C22', front: [21.5, 12, 11, 12], back: [15, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 27 (G427, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): ivory cotton paper, a brass-edged zellige arc
  // with bougainvillea and orange blossom at its ends across the top (down to ~18.5 %) and a zellige band near the bottom
  // (~89.5–93 %) on the front; one short brass line with a zellige star at the top of the back (~11.5 %). `cover` for 5×7
  // and A5 (ChatGPT's 1068×1472). Boxes ~2 % clear of it all.
  'riad-lantern-nights': {
    collection: '27_Riad_Lantern_Nights',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Cinzel:wght@400;500&family=Marcellus&family=Marcellus+SC'),
    script: "'Cinzel', Georgia, serif", serif: "'Marcellus', Georgia, serif", caps: "'Marcellus SC', Georgia, serif",
    namesInCaps: true,
    ink: '#0F2F31', accent: '#8A5A1C', front: [20.5, 11, 12.5, 11], back: [13.5, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 28 (G428, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): cream cotton card, a swag of piped icing with
  // gold dragées and a rose satin bow with a sugared bud across the top (down to ~18 %), a gold scalloped line near the
  // bottom (92–94 %) on the front; one short icing swag with a rose bud at the top of the back (~11.5 %). `cover` for 5×7
  // and A5 (ChatGPT's 1069×1472). Boxes ~2 % clear of it all.
  'maison-patisserie': {
    collection: '28_Maison_Patisserie',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Italiana&family=Parisienne'),
    script: "'Parisienne', cursive", serif: "'Italiana', Georgia, serif",
    ink: '#3E3A32', accent: '#9B4F5A', front: [20, 10, 10, 10], back: [13.5, 10, 8, 10],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 29 (G429, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): silver-ivory chart paper, a gold constellation
  // arch with a small brass astrolabe across the top (down to ~16 %) and seven gold moon phases near the bottom (~91 %)
  // on the front; one short constellation with a crescent at the top of the back (~10 %). `cover` for 5×7 and A5
  // (ChatGPT's 1069×1472). Midnight ink, gold-ink accent; boxes ~2 % clear of it all.
  'celestial-observatory': {
    collection: '29_Celestial_Observatory',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Forum&family=Imperial+Script'),
    script: "'Imperial Script', cursive", serif: "'Forum', Georgia, serif",
    ink: '#141A33', accent: '#7A5A1E', front: [18.5, 12, 11, 12], back: [13, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 30 (G430, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): glaze-white card, a row of cobalt azulejo
  // border tiles with a stepped three-tile cresting across the top (down to ~15.3 %) and a double cobalt rule with a
  // small rosette tile near the bottom (from ~91.8 %) on the front; a five-tile frieze at the top of the back (~11.8 %).
  // `cover` for 5×7 and A5 (ChatGPT's 1069×1472). Dark ink on the glaze; boxes ~2 % clear of it all.
  'azulejo-mosaic': {
    collection: '30_Azulejo_Mosaic',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Arizonia&family=Cormorant+Upright:wght@400;500;600'),
    script: "'Arizonia', cursive", serif: "'Cormorant Upright', Georgia, serif",
    ink: '#173A80', accent: '#8C4128', front: [17.5, 11, 10.5, 11], back: [14, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 31 (G431, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): rice paper with a dip-dyed dusk band and three
  // small lit lanterns across the top (down to ~17 %), a fine gold line with a tiny lantern near the bottom (~92 %) on the
  // front; a short string of miniature lanterns at the top of the back (~9.5 %). `cover` for 5×7 and A5 (ChatGPT's
  // 1068×1473). Boxes ~2 % clear of it all.
  'sky-lantern-festival': {
    collection: '31_Sky_Lantern_Festival',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Bellefair&family=Corinthia'),
    script: "'Corinthia', cursive", serif: "'Bellefair', Georgia, serif",
    ink: '#3B2A4A', accent: '#8C4C48', front: [19, 12, 10, 12], back: [12, 11, 9, 11],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 32 (G432, 2026-10-22): the PAKET 6R grounds of the redesign (docs/35): cream cotton card, a soft-gold filigree crest
  // with three blush roses and wisps of tulle across the top (down to ~19 %), a filigree rule with a pearl near the bottom
  // (~92–95 %) on the front; one short filigree flourish with a rosebud at the top of the back (~11 %). `cover` for 5×7 and
  // A5 (ChatGPT's 1069×1472). Boxes ~2 % clear of it all (G149).
  'music-box-ballerina': {
    collection: '32_Music_Box_Ballerina',
    sources: { front: 'print/invitation_front_r_5x7.png', back: 'print/invitation_back_r_5x7.png' },
    fonts: gf('family=Ballet:opsz@16..72&family=Gilda+Display'),
    script: "'Ballet', cursive", serif: "'Gilda Display', Georgia, serif",
    ink: '#4A2F35', accent: '#8A4A55', front: [21, 11, 10, 11], back: [13, 10, 9, 10],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 33 (G182, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one sheet
  // per side for 5×7 and A5 — GPT_PROMPTS.md): saffron-ivory paper with a band of the envelope's fuchsia silk at its top
  // and bottom edge — both toned textures cut by the theme build (img/paper, img/silk; no shape drawn). The prompts keep
  // the front / back boxes below empty on the art; on arrival: sources → { front, back } of those two files, composed →
  // { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, re-measure the boxes on the
  // art (G149), then build-print-assets.
  'marigold-mehndi': {
    collection: '33_Marigold_Mehndi',
    sources: { paper: 'platform/themes/marigold-mehndi/img/paper-1024.webp', silk: 'platform/themes/marigold-mehndi/img/silk-640.webp' },
    fonts: gf('family=Rozha+One&family=Yrsa:ital,wght@0,400;0,500;1,400'),
    script: "'Rozha One', Georgia, serif", serif: "'Yrsa', Georgia, serif",
    ink: '#3A0F24', accent: '#8E1048', front: [21, 13, 19, 13], back: [17, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'silk', style: 'top:0;left:0;width:100%;height:13%;object-fit:cover' },
          { src: 'silk', style: 'bottom:0;left:0;width:100%;height:11%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'silk', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 34 (G183, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one sheet
  // per side for 5×7 and A5 — GPT_PROMPTS.md): warm cream paper with a band of the cinnabar envelope paper at its top and
  // bottom edge — both toned textures cut by the theme build (img/cream, img/red; no shape drawn). The prompts keep the
  // front / back boxes below empty on the art; on arrival: sources → { front, back } of those two files, composed →
  // { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, re-measure the boxes on the
  // art (G149), then build-print-assets.
  'red-lacquer-double-happiness': {
    collection: '34_Red_Lacquer_Double_Happiness',
    sources: { paper: 'platform/themes/red-lacquer-double-happiness/img/cream-1024.webp', red: 'platform/themes/red-lacquer-double-happiness/img/red-1024.webp' },
    fonts: gf('family=Luxurious+Script&family=Prata'),
    script: "'Luxurious Script', cursive", serif: "'Prata', Georgia, serif",
    ink: '#3A0D0E', accent: '#8C1A1F', front: [17, 13, 15, 13], back: [12, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'red', style: 'top:0;left:0;width:100%;height:11%;object-fit:cover' },
          { src: 'red', style: 'bottom:0;left:0;width:100%;height:9%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'red', style: 'top:0;left:0;width:100%;height:6%;object-fit:cover' }] },
    },
  },
  // 35 (G184, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one sheet
  // per side for 5×7 and A5 — GPT_PROMPTS.md): cream paper with a band of the heather wool at its top and bottom edge —
  // both toned textures cut by the theme build (img/paper, img/wool; no shape drawn, no tartan line drawn). The prompts
  // keep the front / back boxes below empty on the art; on arrival: sources → { front, back } of those two files,
  // composed → { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, re-measure the
  // boxes on the art (G149), then build-print-assets.
  'highland-tartan-thistle': {
    collection: '35_Highland_Tartan_Thistle',
    sources: { paper: 'platform/themes/highland-tartan-thistle/img/paper-1024.webp', wool: 'platform/themes/highland-tartan-thistle/img/wool-640.webp' },
    fonts: gf('family=Rouge+Script&family=Sorts+Mill+Goudy:ital@0;1'),
    script: "'Rouge Script', cursive", serif: "'Sorts Mill Goudy', Georgia, serif",
    ink: '#2A2620', accent: '#46512C', front: [21, 13, 19, 13], back: [17, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'wool', style: 'top:0;left:0;width:100%;height:12%;object-fit:cover' },
          { src: 'wool', style: 'bottom:0;left:0;width:100%;height:10%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'wool', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 36 (G185, before its GPT parts): both sides on the theme's herbarium paper (img/paper-1024, toned by the theme
  // build from 16's plain GPT paper) — front: a band of the deep fern ground at the top with the copper label plate in
  // it (img/copper-320, a crop of 17's plain metal) and a thin kraft band at the bottom (img/kraft-640); back: a narrow
  // fern band at the top. Crops and toning of GPT pixels; no shape drawn. When PAKET 6 arrives (GPT_PROMPTS.md:
  // print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one ground per side for 5×7 and A5):
  // sources → { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' }, composed → { front:
  // { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, then build-print-assets +
  // tests/g149-print-layout.test.ts (re-measure the boxes).
  'victorian-glasshouse': {
    collection: '36_Victorian_Glasshouse',
    sources: {
      paper: 'platform/themes/victorian-glasshouse/img/paper-1024.webp',
      fern: 'platform/themes/victorian-glasshouse/img/fern-640.webp',
      copper: 'platform/themes/victorian-glasshouse/img/copper-320.webp',
      kraft: 'platform/themes/victorian-glasshouse/img/kraft-640.webp',
    },
    fonts: gf('family=Monsieur+La+Doulaise&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400'),
    script: "'Monsieur La Doulaise', cursive", serif: "'Old Standard TT', Georgia, serif",
    ink: '#1E2B24', accent: '#8A4A22', front: [20, 12, 14, 12], back: [13, 12, 8, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'fern', style: 'top:0;left:0;width:100%;height:12%;object-fit:cover' },
          { src: 'copper', style: 'top:3%;left:50%;width:9%;height:7%;object-fit:cover;transform:translateX(-50%)' },
          { src: 'kraft', style: 'bottom:0;left:0;width:100%;height:6%;object-fit:cover' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'fern', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 37 (G186, interim until PAKET 6 print/invitation_front_5x7.png + print/invitation_back_5x7.png, 1575×2175, one sheet
  // per side for 5×7 and A5 — GPT_PROMPTS.md): cream paper with a band of the sage ground at its top and bottom edge —
  // both toned textures from the theme build (img/paper, img/sage; no shape drawn). The prompts keep the front / back
  // boxes below empty on the art; on arrival: sources → { front, back } of those two files, composed → { front: { bg:
  // cover('front'), images: [] }, back: { bg: cover('back'), images: [] } }, re-measure the boxes on the art (G149), then
  // build-print-assets.
  'art-nouveau-lily': {
    collection: '37_Art_Nouveau_Lily',
    sources: { paper: 'platform/themes/art-nouveau-lily/img/paper-1024.webp', sage: 'platform/themes/art-nouveau-lily/img/sage-1024.webp' },
    fonts: gf('family=Ephesis&family=Federant&family=Linden+Hill'),
    script: "'Ephesis', cursive", serif: "'Linden Hill', Georgia, serif",
    ink: '#2E3228', accent: '#7A5D22', front: [21, 13, 19, 13], back: [17, 12, 10, 12],
    composed: {
      front: {
        bg: 'url(paper.webp) 0 0 / 2.4in repeat',
        images: [
          { src: 'sage', style: 'top:0;left:0;width:100%;height:13%;object-fit:cover' },
          { src: 'sage', style: 'bottom:0;left:0;width:100%;height:11%;object-fit:cover;object-position:50% 80%' },
        ],
      },
      back: { bg: 'url(paper.webp) 0 0 / 2.4in repeat', images: [{ src: 'sage', style: 'top:0;left:0;width:100%;height:7%;object-fit:cover' }] },
    },
  },
  // 38 (G187): composed until its print grounds arrive (GPT_PROMPTS.md PAKET 6) — the website's cream paper with a
  // garland of the theme's six flags along the top (front: full width, sagging; back: a short garland), images from the
  // theme build (interim tissue rectangles until the GPT flags, see themes/papel-picado-fiesta/build_images.py; no shape
  // drawn). On arrival: sources -> print/invitation_front_5x7.png + print/invitation_back_5x7.png, composed ->
  // cover('front') / cover('back') with no images, boxes re-measured on the art (G149) — steps in GPT_PROMPTS.md PAKET 6.
  'papel-picado-fiesta': {
    collection: '38_Papel_Picado_Fiesta',
    sources: {
      paper: 'platform/themes/papel-picado-fiesta/img/paper-1024.webp',
      flag1: 'platform/themes/papel-picado-fiesta/img/flag_1-200.webp',
      flag2: 'platform/themes/papel-picado-fiesta/img/flag_2-200.webp',
      flag3: 'platform/themes/papel-picado-fiesta/img/flag_3-200.webp',
      flag4: 'platform/themes/papel-picado-fiesta/img/flag_4-200.webp',
      flag5: 'platform/themes/papel-picado-fiesta/img/flag_5-200.webp',
      flag6: 'platform/themes/papel-picado-fiesta/img/flag_6-200.webp',
    },
    fonts: gf('family=Alegreya:ital,wght@0,400;0,500;1,400&family=Oleo+Script'),
    script: "'Oleo Script', cursive", serif: "'Alegreya', Georgia, serif",
    ink: '#3B2418', accent: '#8A3A1F', front: [22, 13, 12, 13], back: [15, 12, 10, 12],
    composed: {
      front: { bg: cover('paper'), images: flagGarland(6, 3, 12) },
      back: { bg: cover('paper'), images: flagGarland(4, 2.5, 8) },
    },
  },
  'ivory-pearl-atelier': {
    collection: '49_Ivory_Pearl_Atelier',
    sources: { card: 'parts/invitation_card.png', back: 'parts/invitation_card.png', paper: 'textures/bg_page.png' },
    fonts: gf('family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Lora:ital,wght@0,400;1,400'),
    script: "'Cormorant Garamond', Georgia, serif", serif: "'Lora', Georgia, serif",
    ink: '#55432E', accent: '#8A683C', front: [16, 17, 16, 17], back: [16, 17, 16, 17], paper: { mode: 'cover' },
  },
  // 39 (G439, 2026-10-21): the design's own PAKET 6 grounds (ivory card stock; front: a strand of silver star sequins
  // with ivory ranunculus across the top and a hairline with a star at the foot; back: a short strand at the top), one per
  // side, `cover` for 5×7 and A5 (ChatGPT's 1068×1473, ~200 ppi). Ornament measured on the art: front 5–15 % and
  // 91–93 % of the height, back 6–11 %; the boxes sit inside the empty area (G149).
  'silver-photo-booth': {
    collection: '39_Silver_Photo_Booth',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Yesteryear'),
    script: "'Yesteryear', cursive", serif: "'Libre Caslon Text', Georgia, serif",
    ink: '#1E1E1E', accent: '#45474B', front: [22, 13, 12, 13], back: [15, 12, 10, 12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 40 (G440, 2026-10-22): the design's own PAKET 6 grounds (ivory cotton; front: Chantilly lace across the top with a pair
  // of swans, a lace edge at the foot; back: a short lace border at the top), one per side, `cover` for 5×7 and A5
  // (ChatGPT's 1068×1473, ~200 ppi). Ornament measured on the art: front 0–17 % and 92–97 % of the height, back 0–12 %;
  // the boxes sit inside the empty area (G149).
  'swan-chantilly-lace': {
    collection: '40_Swan_Chantilly_Lace',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Bonheur+Royale&family=Crimson+Pro:ital,wght@0,400;0,500;1,400'),
    script: "'Bonheur Royale', cursive", serif: "'Crimson Pro', Georgia, serif",
    ink: '#1B1A18', accent: '#8F8A82', front: [22,  13,  12,  13], back: [15,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 43 (G443, 2026-10-22): the design's own PAKET 6 grounds (cream cotton; front: a gouache garland of peonies, ranunculus
  // and cosmos across the top, a small spray at the foot; back: a short garland at the top), one per side, `cover` for 5×7
  // and A5. Ornament measured on the art: front 4–15 % and 93–96 % of the height, back 3–12 %; the boxes sit inside the
  // empty area (G149).
  'chartreuse-garden-party': {
    collection: '43_Chartreuse_Garden_Party',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Hurricane'),
    script: "'Hurricane', cursive", serif: "'Fraunces', Georgia, serif",
    ink: '#6B1730', accent: '#4F7A3A', front: [20,  13,  12,  13], back: [15,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 46 (G446, 2026-10-22): the design's own PAKET 6 grounds (ivory linen; front: a claret satin ribbon across the top tied in
  // a bow, two white tulips at the foot; back: a small bow at the top), one per side, `cover` for 5×7 and A5. Ornament
  // measured on the art: front 2–14 % and 90–97 % of the height, back 2–10 %; the boxes sit inside the empty area (G149).
  'bordeaux-silk-bow': {
    collection: '46_Bordeaux_Silk_Bow',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Brygada+1918:ital,wght@0,400;0,500;1,400&family=Carattere'),
    script: "'Carattere', cursive", serif: "'Brygada 1918', Georgia, serif",
    ink: '#7A1E2C', accent: '#5A4446', front: [19,  13,  14,  13], back: [15,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 47 (G447, 2026-10-22): the design's own PAKET 6 grounds (white fibre paper; front: a strip of negative with two anemones
  // across the top, a row of sprocket holes at the foot; back: a short strip of negative at the top), one per side,
  // `cover` for 5×7 and A5. Ornament measured on the art: front 5–18 % and 93–94 % of the height, back 4–13 %; the boxes
  // sit inside the empty area (G149).
  'monochrome-darkroom': {
    collection: '47_Monochrome_Darkroom',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Herr+Von+Muellerhoff&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400'),
    script: "'Herr Von Muellerhoff', cursive", serif: "'Newsreader', Georgia, serif",
    ink: '#161616', accent: '#5A5A5A', front: [23,  13,  10,  13], back: [17,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 48 (G448, 2026-10-22): the design's own PAKET 6 grounds (ivory cotton; front: the gold-engraved crest with an empty
  // shield at the top, a gold laurel line at the foot; back: a short laurel line at the top), one per side, `cover` for
  // 5×7 and A5. Ornament measured on the art: front 4–21 % and 89–94 % of the height, back 6–9 %; the boxes sit inside the
  // empty area (G149).
  'navy-ivory-crest': {
    collection: '48_Navy_Ivory_Crest',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Goudy+Bookletter+1911&family=Mr+De+Haviland'),
    script: "'Mr De Haviland', cursive", serif: "'Goudy Bookletter 1911', Georgia, serif",
    ink: '#1C2A48', accent: '#B8964F', front: [26,  13,  13,  13], back: [14,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 41 (G441, 2026-10-22): the design's own PAKET 6 grounds (primed linen canvas; front: a garland of painted wisteria
  // across the top, water lilies at the foot; back: a short spray of wisteria at the top), one per side, `cover` for 5×7
  // and A5. Ornament measured on the art: front 3–19 % and 90–97 % of the height, back 4–13 %; the boxes sit inside the
  // empty area (G149).
  'painted-lily-pond': {
    collection: '41_Painted_Lily_Pond',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Arapey:ital@0;1&family=Comforter+Brush'),
    script: "'Comforter Brush', cursive", serif: "'Arapey', Georgia, serif",
    ink: '#3F5A73', accent: '#9C86BE', front: [24,  13,  13,  13], back: [18,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 42 (G442, 2026-10-22): the design's own PAKET 6 grounds (cream parchment; front: a small oval of the painted landscape
  // with dried flowers at the top, a sprig of dried flowers at the foot; back: a small sprig at the top), one per side,
  // `cover` for 5×7 and A5. Ornament measured on the art: front 3–19 % and 92–96 % of the height, back 2–11 %; the boxes
  // sit inside the empty area (G149).
  'espresso-pastoral': {
    collection: '42_Espresso_Pastoral',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Cardo:ital,wght@0,400;0,700;1,400&family=Mea+Culpa'),
    script: "'Mea Culpa', cursive", serif: "'Cardo', Georgia, serif",
    ink: '#3B2A21', accent: '#6E5140', front: [24,  13,  12,  13], back: [16,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 44 (G444, 2026-10-22): the design's own PAKET 6 grounds (porcelain-white paper; front: a band of the toile across the
  // top, an engraved garland at the foot; back: a short garland at the top), one per side, `cover` for 5×7 and A5.
  // Ornament measured on the art: front 1–19 % and 92–98 % of the height, back 3–9 %; the boxes sit inside the empty area
  // (G149).
  'blue-toile-pavilion': {
    collection: '44_Blue_Toile_Pavilion',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=MonteCarlo&family=Rosarivo:ital@0;1'),
    script: "'MonteCarlo', cursive", serif: "'Rosarivo', Georgia, serif",
    ink: '#2E4A72', accent: '#4A6A96', front: [24,  13,  12,  13], back: [14,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
  // 45 (G445, 2026-10-22): the design's own PAKET 6 grounds (cream paper; front: a spray of wildflowers round a small
  // concho at the top, sage and bluebonnets at the foot; back: a small sprig at the top), one per side, `cover` for 5×7
  // and A5. Ornament measured on the art: front 6–16 % and 91–96 % of the height, back 4–11 %; the boxes sit inside the
  // empty area (G149).
  'suede-ranch-lace': {
    collection: '45_Suede_Ranch_Lace',
    sources: { front: 'print/invitation_front_5x7.png', back: 'print/invitation_back_5x7.png' },
    fonts: gf('family=Lustria&family=Rochester&family=Rye'),
    script: "'Rochester', cursive", serif: "'Lustria', Georgia, serif",
    ink: '#714629', accent: '#5F6B4E', front: [21,  13,  12,  13], back: [16,  12,  10,  12],
    composed: { front: { bg: cover('front'), images: [] }, back: { bg: cover('back'), images: [] } },
  },
};

export function printLayout(themeId: string): PrintLayout | null {
  return Object.hasOwn(PRINT_LAYOUTS, themeId) ? PRINT_LAYOUTS[themeId] : null;
}
