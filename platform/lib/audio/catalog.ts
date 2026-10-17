// Sound of the couple websites (G126): the default music tracks, the sound effects and, per design, the sounds of its
// opening. Every file is under public/audio/ and synthesised by tools/audio_synth.py (our own work; licence and source
// record: public/audio/LICENSES.md). Shared by the engine (site-data), the panel (track list, preview) and the tests.
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

export type EffectName = 'seal' | 'ribbon' | 'clasp' | 'paper' | 'slide' | 'page' | 'tear' | 'whoosh' | 'chime' | 'tap';
export const EFFECT_NAMES: readonly EffectName[] = ['seal', 'ribbon', 'clasp', 'paper', 'slide', 'page', 'tear', 'whoosh', 'chime', 'tap'];
export const EFFECTS_BASE_URL = '/audio/fx/';

/** One cue of an opening: [ms after the tap, effect]. */
export type OpeningCue = readonly [number, EffectName];

export interface DesignSound {
  /** Default music track id when the couple has not chosen one. */
  music: string;
  /**
   * Sounds of the opening, timed on the theme's own choreography (site.js MOTION.envelope; tests/g126-audio.test.ts
   * checks that each cue still starts with the step it follows). The closure (seal / bow / clasp …) first, then the
   * flap or doors, the card leaving its pocket, and a soft chime as it comes forward.
   */
  opening: readonly OpeningCue[];
}

/**
 * Per theme id. `step` names in the comments = the MOTION.envelope key whose start the cue uses.
 */
export const DESIGN_SOUND: Readonly<Record<string, DesignSound>> = {
  // Crimson Rose Atelier: botanical seal, flap, card, chime.
  'crimson-rose-atelier': { music: 'evening-strings', opening: [[0, 'seal'], [400, 'paper'], [1600, 'slide'], [3000, 'chime']] },
  // Nocturne Lake Estate: gold seal lifts off (closure) · flap turns up (lift) · card rises (rise) · forward
  'nocturne-lake-estate': { music: 'evening-strings', opening: [[0, 'seal'], [450, 'paper'], [1700, 'slide'], [3000, 'chime']] },
  // Velvet Jewel Box: satin bow slides off (closure) · lid on its hinge (lid) · card rises (rise) · forward
  'velvet-jewel-box': { music: 'music-box', opening: [[0, 'ribbon'], [650, 'clasp'], [1900, 'slide'], [3100, 'chime']] },
  // Maison Pâtisserie: bow unties (closure) · lid lifts (lid) · tissue parts (tissue) · card lifts (rise) · forward
  // Music Box Ballerina: key winds (closure, tug) · lid swings up (lid) · the comb's first notes as she turns (turn) · card rises (rise) · forward
  'music-box-ballerina': { music: 'music-box', opening: [[0, 'clasp'], [450, 'clasp'], [900, 'page'], [2300, 'chime'], [2900, 'slide'], [3900, 'chime']] },
  'maison-patisserie': { music: 'garden-waltz', opening: [[180, 'ribbon'], [1100, 'paper'], [1850, 'paper'], [2500, 'slide'], [3200, 'chime']] },
  // Orient Express Voyage: strap buckle (closure) · cover swings open (open) · ticket slides out (rise) · forward
  'orient-express-voyage': { music: 'evening-strings', opening: [[0, 'clasp'], [600, 'page'], [1500, 'slide'], [2600, 'chime']] },
  // Kintsugi & Washi: band slides off (closure) · top · bottom · left · right fold (one paper sound each) · card lifts (rise) · forward
  'kintsugi-washi': { music: 'first-light', opening: [[0, 'ribbon'], [550, 'paper'], [1100, 'paper'], [1650, 'paper'], [2100, 'paper'], [2900, 'slide'], [3500, 'chime']] },
  // Azulejo Mosaic: the panel gives under the tap (press) · the tile wave (wave) · the card lifts (rise) · forward
  'azulejo-mosaic': { music: 'garden-waltz', opening: [[0, 'tap'], [420, 'whoosh'], [2350, 'slide'], [2950, 'chime']] },
  // Riad Lantern Nights: a knock on the doors (tug) · the leaves swing in (doors) · the card comes out (rise) · forward
  'riad-lantern-nights': { music: 'evening-strings', opening: [[0, 'tap'], [300, 'whoosh'], [1900, 'slide'], [3100, 'chime']] },
  // Celestial Observatory: dome latch (head) · shutter halves part (shutters) · constellation chime · card rises (rise) · forward
  'celestial-observatory': { music: 'evening-strings', opening: [[0, 'clasp'], [450, 'whoosh'], [1700, 'chime'], [3000, 'slide'], [3600, 'chime']] },
  // Sky Lantern Festival: a touch kindles the lantern (kindle) · the hands let go (hands) · it lifts off (rise) · the card glows in (card) · forward
  'sky-lantern-festival': { music: 'first-light', opening: [[0, 'tap'], [700, 'paper'], [900, 'whoosh'], [2000, 'slide'], [3200, 'chime']] },
  // Grand Theatre Premiere: the curtain draws a breath (tug) · the left panel parts (partL) · the card is lit (rise) · forward
  'grand-theatre-premiere': { music: 'evening-strings', opening: [[0, 'tap'], [400, 'whoosh'], [2000, 'slide'], [2900, 'chime']] },
  // 01 bow · lift · rise · forward
  'blush-garden-rose': { music: 'first-light', opening: [[200, 'ribbon'], [880, 'paper'], [1800, 'slide'], [3140, 'chime']] },
  // 02 wax seal (closure) · lift · rise · forward
  'olive-ivory': { music: 'first-light', opening: [[0, 'seal'], [260, 'paper'], [1620, 'slide'], [3000, 'chime']] },
  // 03 lemon tie (closure) · lift · rise · forward
  'mediterranean-lemon': { music: 'garden-waltz', opening: [[0, 'ribbon'], [680, 'paper'], [1800, 'slide'], [3220, 'chime']] },
  // wax seal breaks (closure) · lift · rise · forward
  'dusty-blue-champagne': { music: 'first-light', opening: [[0, 'seal'], [520, 'paper'], [1680, 'slide'], [3100, 'chime']] },
  // wax seal pops (closure) · tear strip (tear) · rise · forward
  'vintage-airmail-love-letter': { music: 'music-box', opening: [[0, 'seal'], [360, 'tear'], [1180, 'slide'], [2560, 'chime']] },
  // gatefold: medallion clasp (closure) · doors · rise · forward
  'art-deco-black-tie': { music: 'evening-strings', opening: [[0, 'clasp'], [700, 'paper'], [1900, 'slide'], [3250, 'chime']] },
  // velvet bow (closure) · lift · rise · forward
  'burgundy-velvet-autumn': { music: 'evening-strings', opening: [[40, 'ribbon'], [980, 'paper'], [2060, 'slide'], [3480, 'chime']] },
  // pine bundle slides away (closure) · lift · rise · forward
  'winter-evergreen': { music: 'evening-strings', opening: [[120, 'ribbon'], [1240, 'paper'], [2320, 'slide'], [3740, 'chime']] },
  // pouch: twine (closure) · linen loosens (loosen) · rise · forward
  'lavender-provence': { music: 'first-light', opening: [[80, 'ribbon'], [760, 'paper'], [1300, 'slide'], [2700, 'chime']] },
  // twine unwinds (closure) · lift · rise · forward
  'tuscan-vineyard': { music: 'garden-waltz', opening: [[0, 'ribbon'], [760, 'paper'], [2040, 'slide'], [3300, 'chime']] },
  // pampas tie (closure) · lift · rise · forward
  'boho-pampas-terracotta': { music: 'garden-waltz', opening: [[0, 'ribbon'], [500, 'paper'], [1680, 'slide'], [3540, 'chime']] },
  // wallet: brass snap (closure) · lift · rise · forward
  'tropical-destination': { music: 'garden-waltz', opening: [[0, 'clasp'], [760, 'paper'], [1840, 'slide'], [3300, 'chime']] },
  // book: brass clasp (closure) · cover · page · card lifts (lift) · forward
  'enchanted-forest-storybook': { music: 'music-box', opening: [[90, 'clasp'], [880, 'page'], [2260, 'page'], [3240, 'slide'], [3860, 'chime']] },
  // gatefold: pearl brooch (closure) · doors · rise · forward
  'ivory-lace-pearls': { music: 'first-light', opening: [[80, 'clasp'], [650, 'paper'], [2300, 'slide'], [3500, 'chime']] },
  // blossom twig (closure) · lift · rise · forward
  'cherry-blossom-spring': { music: 'music-box', opening: [[90, 'ribbon'], [1150, 'paper'], [2230, 'slide'], [3680, 'chime']] },
  // gingham bow (closure) · lift · rise · forward
  'sunflower-rustic-barn': { music: 'garden-waltz', opening: [[380, 'ribbon'], [1160, 'paper'], [2140, 'slide'], [3440, 'chime']] },
  // gold seal lifts (closure) · lift · rise · forward
  'emerald-gold-estate': { music: 'first-light', opening: [[140, 'seal'], [960, 'paper'], [2380, 'slide'], [3740, 'chime']] },
  // sleeve: label peels (closure) · sleeve slides (slide) · card lifts (lift) · forward
  'wildflower-meadow-vellum': { music: 'first-light', opening: [[80, 'tear'], [980, 'slide'], [1760, 'paper'], [3020, 'chime']] },
  // silver seal cracks (closure) · lift · rise · forward
  'midnight-garden': { music: 'evening-strings', opening: [[90, 'seal'], [960, 'paper'], [2380, 'slide'], [3860, 'chime']] },
  // watercolour wave (wave) · lift · rise · forward
  'coastal-seaside': { music: 'garden-waltz', opening: [[60, 'whoosh'], [1150, 'paper'], [2240, 'slide'], [3660, 'chime']] },
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

