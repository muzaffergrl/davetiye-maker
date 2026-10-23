// Sound of the couple websites (G126, G967): the default music tracks, the sound effects and, per design, the sounds of
// its opening. Every file is under public/audio/ and synthesised by tools/audio_synth.py + tools/audio_fx.py (our own
// work; licence and source record: public/audio/LICENSES.md; effects and mapping: docs/40_SES_EFEKTLERI.md). Shared by
// the engine (site-data), the panel (track list, preview) and the tests.
// Client and server safe (no Node imports).

export interface MusicTrack {
  id: string;
  /** Buyer-facing name in the panel. */
  label: string;
  /** One line under the name in the panel. */
  mood: string;
  /** Root-relative URL (served from public/). */
  url: string;
}

export const MUSIC_TRACKS: readonly MusicTrack[] = [
  { id: 'first-light', label: 'First Light', mood: 'Gentle piano, warm and romantic', url: '/audio/music/first-light.mp3' },
  { id: 'garden-waltz', label: 'Garden Waltz', mood: 'Light piano waltz, sunny and graceful', url: '/audio/music/garden-waltz.mp3' },
  { id: 'evening-strings', label: 'Evening Strings', mood: 'Soft strings and piano, calm and elegant', url: '/audio/music/evening-strings.mp3' },
  { id: 'music-box', label: 'Music Box', mood: 'Music box lullaby, sweet and whimsical', url: '/audio/music/music-box.mp3' },
];

/**
 * The sound effects (G967): public/audio/fx/<name>.mp3, stereo, −20…−24 LUFS, physically modelled foley synthesised by
 * tools/audio_fx.py (docs/40_SES_EFEKTLERI.md lists what each one is). The ten G126 names are kept.
 */
export const EFFECT_NAMES = [
  // paper
  'paper', 'paper-soft', 'paper-crisp', 'fold', 'fold-2', 'slide', 'slide-quick', 'page', 'book', 'tear', 'vellum', 'peel', 'flutter', 'tap',
  // cloth, cord, leather
  'ribbon', 'bow', 'twine', 'cord', 'velvet', 'lace', 'curtain', 'strap',
  // wax, metal, wood, ceramic
  'seal', 'seal-lift', 'clasp', 'buckle', 'key', 'lock', 'brooch', 'porcelain', 'tile', 'lid', 'twig',
  // bells
  'chime', 'chime-warm', 'harp', 'sparkle', 'shimmer', 'stars', 'comb',
  // air, water, fire, light
  'whoosh', 'wave', 'water', 'wings', 'petals', 'flash', 'lantern', 'film', 'brush', 'pen',
] as const;
export type EffectName = (typeof EFFECT_NAMES)[number];
export const EFFECTS_BASE_URL = '/audio/fx/';

/** One cue of an opening: [ms after the tap, effect] or [ms, effect, stereo pan −1 (left) … 1 (right)]. */
export type OpeningCue = readonly [number, EffectName] | readonly [number, EffectName, number];

export interface DesignSound {
  /** Default music track id when the couple has not chosen one. */
  music: string;
  /**
   * Sounds of the opening, each on a step of the theme's own choreography (site.js MOTION.envelope; the
   * tests check that every cue starts with a step): the closure (seal, bow, clasp, key …) first, then what opens
   * (flap, doors, folds, lid, curtains), what moves past (light, petals, doves, mist), the card leaving its pocket and
   * the moment it comes forward (chime, harp, stars …).
   */
  opening: readonly OpeningCue[];
}

/**
 * Per theme id. The comment names the MOTION.envelope step of each cue, in order. 22–32 follow the redesigned
 * openings (G422–G432).
 */
export const DESIGN_SOUND: Readonly<Record<string, DesignSound>> = {
  // 01 Olive & Ivory: the wax seal lets go (closure) · flap, seal and sprig peel up (lift) · the card glides up (rise) · forward
  'olive-ivory': { music: 'first-light', opening: [[0, 'seal-lift'], [260, 'paper-soft'], [1620, 'slide'], [3000, 'chime']] },
  // 02 Dusty Blue & Champagne: the wax seal snaps off (closure) · lift · rise · forward
  'dusty-blue-champagne': { music: 'first-light', opening: [[0, 'seal'], [520, 'paper'], [1680, 'slide'], [3100, 'chime-warm']] },
  // 03 Blush Garden Rose: the silk bow slides off to the lower right (bow) · lift · petals fall (petals) · rise · forward
  'blush-garden-rose': { music: 'first-light', opening: [[200, 'bow', 0.3], [880, 'paper-soft'], [1430, 'petals'], [1800, 'slide'], [3140, 'harp']] },
  // 04 Vintage Airmail: the little wax seal pops off (closure) · the tear strip rips along the top (tear) · rise · forward
  'vintage-airmail-love-letter': { music: 'music-box', opening: [[0, 'seal'], [360, 'tear'], [1180, 'slide'], [2560, 'chime']] },
  // 05 Mediterranean Lemon: the lemon tie slips and rolls off (closure) · lift · rise · forward
  'mediterranean-lemon': { music: 'garden-waltz', opening: [[0, 'twine'], [680, 'paper-crisp'], [1800, 'slide'], [3220, 'chime']] },
  // 06 Art Deco Black Tie: the medallion clasp turns (closure) · the gatefold doors (doors) · rise · the band of gold light (sweep) · forward
  'art-deco-black-tie': { music: 'evening-strings', opening: [[0, 'clasp'], [700, 'paper-crisp'], [1900, 'slide'], [1950, 'shimmer'], [3250, 'chime-warm']] },
  // 07 Burgundy Velvet Autumn: the velvet bow unties (closure) · lift · rise · forward
  'burgundy-velvet-autumn': { music: 'evening-strings', opening: [[40, 'bow'], [980, 'paper-soft'], [2060, 'slide'], [3480, 'chime-warm']] },
  // 08 Winter Evergreen: soft snow (snow) · the pine bundle loosens and slides off (closure) · lift · rise · forward
  'winter-evergreen': { music: 'evening-strings', opening: [[0, 'shimmer'], [120, 'twig'], [1240, 'paper'], [2320, 'slide'], [3740, 'chime']] },
  // 09 Lavender Provence: the twine slackens (closure) · the lavender bundle slips away (slip) · the linen pouch loosens (loosen) · rise · forward
  'lavender-provence': { music: 'first-light', opening: [[80, 'twine'], [300, 'twig'], [760, 'velvet'], [1300, 'slide'], [2700, 'harp']] },
  // 10 Tuscan Vineyard: the jute twine unwinds (closure) · the kraft flap (lift) · rise · forward
  'tuscan-vineyard': { music: 'garden-waltz', opening: [[0, 'twine'], [760, 'paper-soft'], [2040, 'slide'], [3300, 'chime-warm']] },
  // 11 Boho Pampas: the pampas-and-palm tie slips off (closure) · lift · rise · forward
  'boho-pampas-terracotta': { music: 'garden-waltz', opening: [[0, 'twig'], [500, 'paper-soft'], [1680, 'slide'], [3540, 'harp']] },
  // 12 Tropical Destination: the brass snap pops (closure) · lift · the luggage tag slides up (rise) · forward
  'tropical-destination': { music: 'garden-waltz', opening: [[0, 'clasp'], [760, 'paper-crisp'], [1840, 'slide'], [3300, 'chime']] },
  // 13 Enchanted Forest Storybook: the brass clasp unhooks (closure) · the cover (cover) · the first page (page) · the card lifts (lift) with fireflies (accents)
  'enchanted-forest-storybook': { music: 'music-box', opening: [[90, 'clasp'], [880, 'book'], [2260, 'page'], [3240, 'slide-quick'], [3240, 'stars']] },
  // 14 Ivory Lace & Pearls: the pearl clasp unhooks (closure) · the lace doors part like a veil (doors) · rise · the pearls glint (glint) · forward
  'ivory-lace-pearls': { music: 'first-light', opening: [[80, 'brooch'], [650, 'lace'], [2300, 'slide'], [2350, 'sparkle'], [3500, 'harp']] },
  // 15 Cherry Blossom Spring: the blossom twig loosens (closure) · lift · rise, the petals swirl up (accents) · forward
  'cherry-blossom-spring': { music: 'music-box', opening: [[90, 'twig'], [1150, 'paper'], [2230, 'slide'], [2230, 'petals'], [3680, 'chime']] },
  // 16 Sunflower Rustic Barn: the gingham bow tugs loose (tug) · the ribbon slides off to the right (closure) · the kraft flap (lift) · rise · onto the table (forward)
  'sunflower-rustic-barn': { music: 'garden-waltz', opening: [[0, 'bow'], [380, 'ribbon', 0.35], [1160, 'paper-crisp'], [2140, 'slide'], [3440, 'chime-warm']] },
  // 17 Emerald & Gold Estate: light across the seal (glint) · the seal lifts (closure) · lift · gold lines draw (accents) · rise · forward
  'emerald-gold-estate': { music: 'first-light', opening: [[40, 'sparkle'], [140, 'seal-lift'], [960, 'paper'], [1880, 'shimmer'], [2380, 'slide'], [3740, 'chime']] },
  // 18 Wildflower Meadow Vellum: the label peels (closure) · the frosted sleeve slides down (slide) · the card lifts (lift) · forward
  'wildflower-meadow-vellum': { music: 'first-light', opening: [[80, 'peel'], [980, 'vellum'], [1760, 'slide-quick'], [3020, 'harp']] },
  // 19 Midnight Garden: the silver seal cracks (closure) · the black flap opens slowly (lift) · candlelight spills out (glow) · rise · forward
  'midnight-garden': { music: 'evening-strings', opening: [[90, 'seal'], [960, 'paper-soft'], [1320, 'lantern'], [2380, 'slide'], [3860, 'stars']] },
  // 20 Coastal Seaside: the watercolour wave sweeps across (wave) · lift · the card rises like the tide (rise) · forward
  'coastal-seaside': { music: 'garden-waltz', opening: [[60, 'wave'], [1150, 'paper'], [2240, 'slide'], [3660, 'chime']] },
  // 21 Crimson Rose Atelier: the gold seal lifts away (closure) · lift · rise · forward
  'crimson-rose-atelier': { music: 'evening-strings', opening: [[0, 'seal-lift'], [400, 'paper-crisp'], [1600, 'slide'], [3000, 'harp']] },
  // 22 Nocturne Lake Estate: the crescent glints (glint) · the vellum band slides off (vellum) · the diamond flap (flap) · moonlight on the lining (light) · rise · forward
  'nocturne-lake-estate': { music: 'evening-strings', opening: [[0, 'sparkle'], [800, 'vellum'], [1500, 'paper'], [2000, 'shimmer'], [2500, 'slide-quick'], [3250, 'stars']] },
  // 23 Velvet Jewel Box: the diamond glints (glint) · the ring slides off the band (ring) · the band parts (ribbon) · the velvet flap (flap) · rise · forward
  'velvet-jewel-box': { music: 'music-box', opening: [[0, 'sparkle'], [180, 'brooch'], [700, 'ribbon'], [1250, 'velvet'], [1850, 'slide-quick'], [2500, 'chime']] },
  // 24 Grand Theatre Premiere: the ticket slides up (ticket) · tears (tear) · the cord unties (rope) · the left curtain (curtainL) · the right one (curtainR) · the programme rises (rise) · forward
  'grand-theatre-premiere': { music: 'evening-strings', opening: [[0, 'slide-quick'], [650, 'tear'], [1100, 'cord'], [1600, 'curtain', -0.45], [1740, 'curtain', 0.45], [2900, 'slide-quick'], [3600, 'chime-warm']] },
  // 25 Orient Express Voyage: the luggage tag swings (swing) · the turn-lock clicks (key) · the end tab swings open (flap) · the ticket slides out (slide) · steam (accents) · forward
  'orient-express-voyage': { music: 'evening-strings', opening: [[0, 'strap'], [450, 'lock'], [1000, 'paper-crisp', 0.3], [1750, 'slide', 0.3], [2300, 'whoosh'], [3050, 'chime-warm']] },
  // 26 Kintsugi & Washi: the porcelain button turns (button) · the cord slides off right (cord) · four folds N · E · S · W (flapN…flapW) · rise · forward
  'kintsugi-washi': { music: 'first-light', opening: [[0, 'porcelain'], [200, 'cord', 0.3], [950, 'fold'], [1170, 'fold-2', 0.35], [1390, 'fold'], [1610, 'fold-2', -0.35], [2250, 'slide-quick'], [2950, 'chime']] },
  // 27 Riad Lantern Nights: the lantern lights (lit) · the cord slips off the stud (cord) · the arch flap (flap) · rise · brass stars drift (accents) · forward
  'riad-lantern-nights': { music: 'evening-strings', opening: [[0, 'lantern'], [600, 'cord'], [1450, 'paper-soft'], [2250, 'slide-quick'], [2600, 'stars'], [3150, 'chime-warm']] },
  // 28 Maison Pâtisserie: the sugared bud tips off (bud) · the bow gives way (untie) · the sleeve slides off right (sleeve) · the scalloped flap (flap) · rise · forward
  'maison-patisserie': { music: 'garden-waltz', opening: [[0, 'petals'], [700, 'bow'], [1200, 'ribbon', 0.4], [1950, 'paper-crisp'], [2500, 'slide-quick'], [3200, 'harp']] },
  // 29 Celestial Observatory: the rete turns (turn) · its star tips glint (glint) · the astrolabe floats up (astro) · the dome flap (flap) · stars light up (accents) · rise · forward
  'celestial-observatory': { music: 'evening-strings', opening: [[0, 'lock'], [500, 'sparkle'], [1150, 'whoosh'], [1650, 'paper'], [2150, 'stars'], [2300, 'slide-quick'], [3000, 'chime']] },
  // 30 Azulejo Mosaic: the knot loosens, the twine slips off (knot) · the swallow tile turns over (tile) · the tile flap (flap) · the corner tiles turn (wave) · rise · forward
  'azulejo-mosaic': { music: 'garden-waltz', opening: [[0, 'twine'], [900, 'tile'], [1750, 'paper-crisp'], [2050, 'tile', 0.3], [2400, 'slide-quick'], [3150, 'chime']] },
  // 31 Sky Lantern Festival: the lantern lights (light) · the silk bow loosens (thread) · it rises away (lift) · the flap (flap) · rise · forward
  'sky-lantern-festival': { music: 'first-light', opening: [[0, 'lantern'], [600, 'ribbon'], [800, 'whoosh'], [1700, 'paper-soft'], [2300, 'slide-quick'], [3000, 'stars']] },
  // 32 Music Box Ballerina: the key winds two turns (key) · the lid swings up (flap) · the ballerina rises (rise) · her pirouettes to the comb (spin) · the card rises (card)
  'music-box-ballerina': { music: 'music-box', opening: [[0, 'key'], [1150, 'lid'], [1900, 'slide-quick'], [2550, 'comb'], [3500, 'slide']] },
  // 33 Marigold & Mehndi: the silk tassel swings (tassel) · the paisley sleeve slides off right (sleeve) · the silk flap (flap) · petals (petals) · the diyas light (diyas) · rise · forward
  'marigold-mehndi': { music: 'evening-strings', opening: [[0, 'cord'], [300, 'slide', 0.4], [1250, 'paper-crisp'], [1600, 'petals'], [1800, 'lantern'], [2500, 'slide-quick'], [3150, 'chime-warm']] },
  // 34 Red Lacquer & Double Happiness: the cord unwinds (untie) · the flap (flap) · the card comes up (rise) · the red window (outer) · the gold window (inner) · forward
  'red-lacquer-double-happiness': { music: 'first-light', opening: [[0, 'cord'], [900, 'paper'], [1500, 'slide-quick'], [2150, 'fold'], [2550, 'fold-2'], [3150, 'chime-warm']] },
  // 35 Highland Tartan & Thistle: the mist draws off (mist) · the buckle opens (buckle) · the strap slides out (strap) · the wool flap (flap) · rise · forward
  'highland-tartan-thistle': { music: 'evening-strings', opening: [[0, 'whoosh'], [150, 'buckle'], [600, 'strap'], [1300, 'velvet'], [2500, 'slide-quick'], [3150, 'chime-warm']] },
  // 36 Victorian Glasshouse: the copper label swings (tag) · the twine comes apart (twine) · the seed-packet flap (flap) · rise · the mist is wiped away (wipe) · forward
  'victorian-glasshouse': { music: 'garden-waltz', opening: [[0, 'clasp'], [300, 'twine'], [900, 'paper-crisp'], [1700, 'slide'], [2600, 'velvet'], [3600, 'chime']] },
  // 37 Art Nouveau Lily: light through the stained glass (sweep) · the medallion lifts (medallion) · the side petals (sides) · the centre petal (centre) · rise · forward
  'art-nouveau-lily': { music: 'garden-waltz', opening: [[100, 'shimmer'], [800, 'seal-lift'], [1100, 'fold'], [1500, 'fold-2'], [2400, 'slide-quick'], [3050, 'harp']] },
  // 38 Papel Picado Fiesta: the band works loose (band) · the flags fly up one by one (flags) · the flap (flap) · the string lights come on (lights) · rise · forward
  'papel-picado-fiesta': { music: 'garden-waltz', opening: [[250, 'fold'], [700, 'flutter'], [1500, 'paper-crisp'], [1900, 'stars'], [2500, 'slide-quick'], [3100, 'chime']] },
  // 39 Silver Photo Booth: the flashbulb fires (flash) · the photo strip slides off (strip) · the U flap (flap) · rise · the second flash (flash2)
  'silver-photo-booth': { music: 'evening-strings', opening: [[0, 'flash'], [180, 'slide-quick', -0.3], [1150, 'paper'], [1700, 'slide-quick'], [2200, 'flash', 0.2]] },
  // 40 Swan Chantilly Lace: the swan seal lifts (seal) · the ribbon tails slip (tails) · the lace rises like a veil (lace) · the flap (flap) · rise · forward
  'swan-chantilly-lace': { music: 'evening-strings', opening: [[0, 'seal-lift'], [250, 'ribbon'], [700, 'lace'], [1500, 'paper-soft'], [2100, 'slide-quick'], [2750, 'harp']] },
  // 41 Painted Lily Pond: the lilac seal lifts (seal) · the flap (flap) · four brushstrokes (strokes) · the card rises from the water (rise) · ripples (ripple) · forward
  'painted-lily-pond': { music: 'garden-waltz', opening: [[0, 'seal-lift'], [500, 'paper'], [1100, 'brush'], [2000, 'slide-quick'], [2200, 'water'], [2800, 'chime']] },
  // 42 Espresso Pastoral: the dried posy falls (posy) · the lace band slips off (lace) · the flap (flap) · the dive into the painting (dive) · rise · forward
  'espresso-pastoral': { music: 'first-light', opening: [[0, 'twig'], [400, 'lace'], [1000, 'paper'], [1600, 'whoosh'], [2400, 'slide-quick'], [3200, 'chime-warm']] },
  // 43 Chartreuse Garden Party: the stem slides out of the slits (stem) · the scalloped flap (flap) · the flower clusters burst out (blooms) · rise · forward
  'chartreuse-garden-party': { music: 'garden-waltz', opening: [[0, 'twig'], [500, 'paper-crisp'], [1000, 'petals'], [1500, 'slide-quick'], [2300, 'chime']] },
  // 44 Blue Toile Pavilion: the porcelain brooch comes off its pin (brooch) · the ogee flap (flap) · three doves take wing (doves) · rise · forward
  'blue-toile-pavilion': { music: 'garden-waltz', opening: [[0, 'brooch'], [500, 'paper'], [900, 'wings'], [1500, 'slide-quick'], [2150, 'chime']] },
  // 45 Suede Ranch Lace: the silver concho turns (concho) · the leather cord comes undone (cord) · the fringed flap (flap) · golden-hour light (sun) · rise · forward
  'suede-ranch-lace': { music: 'garden-waltz', opening: [[0, 'lock'], [400, 'strap'], [900, 'velvet'], [1300, 'shimmer'], [1700, 'slide-quick'], [2350, 'chime-warm']] },
  // 46 Bordeaux Silk Bow: the bow unties loop by loop (loops) · the ribbon is pulled through (pull) · the flap onto claret silk (flap) · rise · forward
  'bordeaux-silk-bow': { music: 'evening-strings', opening: [[0, 'bow'], [1000, 'ribbon'], [1500, 'paper-soft'], [2100, 'slide-quick'], [2750, 'chime-warm']] },
  // 47 Monochrome Darkroom: the negative runs off across the screen (curl) · the tuck flap (flap) · rise · into the developing tray (tray)
  'monochrome-darkroom': { music: 'first-light', opening: [[0, 'film'], [800, 'paper-crisp'], [1700, 'slide-quick'], [2300, 'water']] },
  // 48 Navy Ivory Crest: gold light over the embossing (sheen) · the shield seal lifts (seal) · the wallet flap (flap) · rise · forward · the initials are inked (initials)
  'navy-ivory-crest': { music: 'evening-strings', opening: [[0, 'shimmer'], [700, 'seal-lift'], [1300, 'paper-crisp'], [1700, 'slide-quick'], [2500, 'chime-warm'], [2900, 'pen']] },
  // 49 Ivory Pearl Atelier: the pearl seal turns away (pearl) · the silk bow halves drift apart (ribbon) · the gold-edged flap (flap) · rise · forward
  'ivory-pearl-atelier': { music: 'first-light', opening: [[0, 'porcelain'], [120, 'bow'], [1100, 'paper'], [1950, 'slide'], [3300, 'harp']] },
};

export const DEFAULT_TRACK_ID = 'first-light';
/** Fallback for a theme without its own entry (the _sample test theme, a new design): seal, flap, card, chime. */
export const DEFAULT_OPENING: readonly OpeningCue[] = [[0, 'seal'], [400, 'paper'], [1600, 'slide'], [3000, 'chime']];

export function findTrack(id: string | null | undefined): MusicTrack | null {
  return MUSIC_TRACKS.find((t) => t.id === id) ?? null;
}

export function designSound(themeId: string): DesignSound {
  return DESIGN_SOUND[themeId] ?? { music: DEFAULT_TRACK_ID, opening: DEFAULT_OPENING };
}

/** The couple's sound settings (content.audio, docs/03) as read by the engine and the panel. */
export interface AudioSettings {
  /** 'off', 'custom' or a track id; absent = the design's default track. */
  music?: string;
  music_file?: string | null;
  music_name?: string | null;
  effects?: boolean;
}

export function audioSettings(content: unknown): AudioSettings {
  const a = (content as { audio?: unknown } | null)?.audio;
  return a && typeof a === 'object' && !Array.isArray(a) ? (a as AudioSettings) : {};
}

/**
 * The music URL of a website, or null (music off, a custom choice without a file). A custom file is the couple's own
 * upload (/media/… or an absolute https URL of the data adapter); an unknown track id falls back to the design's default.
 */
export function resolveMusic(content: unknown, themeId: string): { url: string; custom: boolean; trackId: string | null } | null {
  const a = audioSettings(content);
  const choice = typeof a.music === 'string' ? a.music : '';
  if (choice === 'off') return null;
  if (choice === 'custom') {
    const file = typeof a.music_file === 'string' ? a.music_file.trim() : '';
    return file ? { url: file, custom: true, trackId: null } : null;
  }
  const track = findTrack(choice) ?? findTrack(designSound(themeId).music) ?? findTrack(DEFAULT_TRACK_ID)!;
  return { url: track.url, custom: false, trackId: track.id };
}

/** Sound effects are on unless the couple switched them off. */
export function effectsOn(content: unknown): boolean {
  return audioSettings(content).effects !== false;
}

/** The uploaded music file guests may be served (G126): only while it is the chosen music and the story page is on. */
export function customMusicFile(content: unknown): string | null {
  const c = content as { optional_blocks?: Record<string, unknown> } | null;
  if (c?.optional_blocks?.our_story !== true) return null;
  const a = audioSettings(content);
  if (a.music !== 'custom') return null;
  return typeof a.music_file === 'string' && a.music_file.trim() ? a.music_file.trim() : null;
}

