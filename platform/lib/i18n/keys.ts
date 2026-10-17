// G144: every key each dictionary should hold — what tests/i18n.test.ts checks and scripts/i18n-missing.ts lists for the
// translators. Node only (reads the source tree and the themes).

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import * as cheerio from 'cheerio';
import { THANK_YOU_DEFAULT_TITLE } from '../content/thank-you.ts';
import { DEFAULT_LABELS } from '../maps.ts';
import { COPY_PRESETS, STANDARD_COPY } from '../theme/copy.ts';
import { EXTRAS_LABELS } from '../theme/extras-block.ts';
import type { Namespace } from './dicts.ts';
import { scanSource } from './scan.ts';
import { PRINT_LABELS } from '../print/labels.ts';
import { OPTIONAL_BLOCK_LABELS, PAGE_LABELS, SECTION_TITLES, openingPlace, openingTabLabel, shapeLabel } from '../panel/model.ts';
import { QR_PNG_SIZES, SHARE_LABELS } from '../panel/share.ts';
import { themeOpening } from '../panel/state.ts';
import { QUESTION_TYPE_LABELS } from '../rsvp/form-config.ts';
import { THEME_IN_REVIEW } from '../themes/approval.ts';
import { templateKeys } from './template-texts.ts';

const ROOT = join(import.meta.dirname, '..', '..');

/** Source folders / files of each namespace (relative to platform/). */
export const SOURCES: Record<Namespace, string[]> = {
  panel: ['components/panel', 'components/my', 'app/edit', 'app/start', 'app/my', 'app/signin', 'lib/panel', 'lib/rsvp', 'lib/claim', 'lib/content/validate.ts', 'lib/audio', 'lib/themes', 'lib/i18n/panel-extra.ts'],
  market: ['app/(marketing)', 'components/marketing', 'lib/marketing'],
  site: ['lib/theme', 'lib/site', 'lib/i18n/site.ts'],
};

function files(rel: string): string[] {
  const abs = join(ROOT, rel);
  let st;
  try {
    st = statSync(abs);
  } catch {
    return [];
  }
  if (st.isFile()) return /\.(tsx?|js)$/.test(abs) ? [abs] : [];
  return readdirSync(abs).flatMap((n) => (n === 'node_modules' || n.startsWith('.') ? [] : files(join(rel, n))));
}

export function sourceKeys(ns: Namespace): Set<string> {
  const keys = new Set<string>();
  for (const rel of SOURCES[ns]) for (const f of files(rel)) for (const k of scanSource(readFileSync(f, 'utf8'))) keys.add(k);
  return keys;
}

/** Theme texts: copy defaults + fixed template texts of every theme (not _sample). */
export function themeKeys(themesDir = join(ROOT, 'themes')): Set<string> {
  const keys = new Set<string>();
  for (const id of readdirSync(themesDir)) {
    if (id.startsWith('_') || id.startsWith('.')) continue;
    let manifest: { copy?: Record<string, { default: string }>; pages?: Record<string, string | null> };
    try {
      manifest = JSON.parse(readFileSync(join(themesDir, id, 'theme.json'), 'utf8'));
    } catch {
      continue;
    }
    const copy = manifest.copy ?? {};
    for (const e of Object.values(copy)) keys.add(e.default.replace(/\s+/g, ' ').trim());
    for (const file of Object.values(manifest.pages ?? {})) {
      if (!file) continue;
      let html = '';
      try {
        html = readFileSync(join(themesDir, id, file), 'utf8');
      } catch {
        continue;
      }
      for (const k of templateKeys(cheerio.load(html), (key) => copy[key]?.default)) keys.add(k);
    }
  }
  return keys;
}

export function expectedKeys(ns: Namespace): Set<string> {
  const keys = sourceKeys(ns);
  if (ns === 'site') {
    for (const k of themeKeys()) keys.add(k);
    for (const v of Object.values(EXTRAS_LABELS)) keys.add(v);
    for (const v of Object.values(DEFAULT_LABELS)) keys.add(v);
    keys.add(THANK_YOU_DEFAULT_TITLE);
    // G139 printed invitation + website PDF (lib/print/labels.ts): everything but the panel card
    for (const [k, v] of Object.entries(PRINT_LABELS.en)) if (!k.startsWith('panel_') && k !== 'limit_reached') keys.add(v);
  }
  if (ns === 'panel') {
    for (const e of Object.values(STANDARD_COPY)) keys.add(e.label);
    for (const p of COPY_PRESETS) keys.add(p.label);
    // G139 Downloads card (lib/print/labels.ts) and the download API's messages (lib/print/api.ts)
    for (const [k, v] of Object.entries(PRINT_LABELS.en)) if (k.startsWith('panel_') || k === 'limit_reached') keys.add(v);
    for (const k of scanSource(readFileSync(join(ROOT, 'lib/print/api.ts'), 'utf8'))) keys.add(k);
    // texts of lib/ constants the panel shows with t(x)
    for (const v of Object.values(SHARE_LABELS)) if (typeof v === 'string') keys.add(v);
    for (const v of QR_PNG_SIZES) keys.add(v.label);
    for (const v of Object.values(QUESTION_TYPE_LABELS)) keys.add(v);
    keys.add(THEME_IN_REVIEW.title).add(THEME_IN_REVIEW.message);
    for (const v of Object.values(OPTIONAL_BLOCK_LABELS)) keys.add(v.label).add(v.hint);
    for (const r of [null, 0.5, 1, 1.2, 2]) keys.add(shapeLabel(r));
    for (const v of Object.values(SECTION_TITLES)) keys.add(v);
    for (const v of Object.values(PAGE_LABELS)) keys.add(v);
    // the design's opening word ("book", "gatefold" …) inside the editable-text labels (lib/panel/state.ts withOpeningWords)
    const words = new Set<string | null>([null]);
    for (const id of readdirSync(join(ROOT, 'themes'))) if (!id.startsWith('_')) words.add(themeOpening(id));
    for (const w of words) {
      keys.add(openingTabLabel(w)).add(openingPlace(w));
      const place = openingPlace(w);
      if (place === 'envelope') continue;
      for (const e of Object.values(STANDARD_COPY)) if (/\benvelope\b/.test(e.label)) keys.add(e.label.replace(/\benvelope\b/g, place));
    }
  }
  return keys;
}

/** The {placeholders} of a text. */
export function placeholders(text: string): string[] {
  return [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
}
