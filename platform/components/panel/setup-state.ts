// Which setup step is open and whether the setup was closed on this phone (G181: out of Setup.tsx, so the panel's shell
// picks its first view without loading the setup wizard).

import type { ContentRecord } from '../../lib/content/types.ts';
import { photoAt, prePublishNotes, type PanelTheme } from '../../lib/panel/model.ts';
import { SETUP_STEP_COUNT } from './pages.ts';

/** Steps (1-2) whose content is filled in and no longer the design's sample text. */
export function doneSteps(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): Set<number> {
  const done = new Set<number>();
  const samples = new Set(prePublishNotes(content, theme, { deviceZone }).sample.map((n) => n.path));
  const names = (content.partners ?? []).length > 0 && content.partners.every((p) => (p.display_name ?? '').trim());
  const date = Boolean(content.date && content.ceremony_time) && !samples.has('date') && !samples.has('ceremony_time');
  if (names && date) done.add(1);
  if (!theme.photos.length || theme.photos.some((s) => photoAt(content, s.source))) done.add(2);
  return done;
}

/** The first step not done yet (3 = publish, when 1–2 are done). */
export function firstOpenStep(content: ContentRecord, theme: Pick<PanelTheme, 'photos' | 'optionalBlocks' | 'sample'>, deviceZone: string | null = null): number {
  const done = doneSteps(content, theme, deviceZone);
  for (let s = 1; s < SETUP_STEP_COUNT; s++) if (!done.has(s)) return s;
  return SETUP_STEP_COUNT;
}

const setupKey = (slug: string) => `setup:${slug}`;
export function readSetup(slug: string): { step?: number; dismissed?: boolean } {
  try {
    return JSON.parse(window.localStorage.getItem(setupKey(slug)) ?? '{}') as { step?: number; dismissed?: boolean };
  } catch {
    return {};
  }
}
export function writeSetup(slug: string, value: { step?: number; dismissed?: boolean }) {
  try {
    window.localStorage.setItem(setupKey(slug), JSON.stringify({ ...readSetup(slug), ...value }));
  } catch {
    /* private mode: the step comes from the content next time */
  }
}
