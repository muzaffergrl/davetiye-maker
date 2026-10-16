// What a site page tells public/audio/audio.js (G126): written into the site-data JSON by the engine, together with one
// <script src="/audio/audio.js" defer> in <head>. Music only on the story page (the couple's "Our Story" music),
// the opening cues only on the index page (the envelope); effects on every page unless switched off.

import { designSound, effectsOn, EFFECTS_BASE_URL, resolveMusic, type OpeningCue } from './catalog.ts';

export const AUDIO_SCRIPT_SRC = '/audio/audio.js';

export interface SiteSound {
  /** Music URL for this page (story only), else null. */
  music: string | null;
  effects: boolean;
  /** Base URL of the effect files (<name>.mp3). */
  fx: string;
  /** Opening cues (index page only; empty elsewhere). */
  opening: readonly OpeningCue[];
}

/** Null when the page has nothing to play (music off or not this page, effects off): no script, no sound button. */
export function siteSound(content: unknown, themeId: string, page: string, mediaUrl: (url: string) => string): SiteSound | null {
  const effects = effectsOn(content);
  const music = page === 'story' ? resolveMusic(content, themeId) : null;
  if (!effects && !music) return null;
  return {
    music: music ? mediaUrl(music.url) : null,
    effects,
    fx: EFFECTS_BASE_URL,
    opening: effects && page === 'index' ? designSound(themeId).opening : [],
  };
}
