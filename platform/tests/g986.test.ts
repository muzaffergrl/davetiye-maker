// G986 (docs/36 dalga 6): the review of the first six guides, kept true to the code and to the sources it found.

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { LIMITS } from '../lib/marketing/facts.ts';
import { loadGuide } from '../lib/marketing/guides.ts';

const GUIDES = new URL('../content/guides/', import.meta.url);
const files = ['', 'tr/', 'de/', 'es/', 'fr/'].flatMap((l) =>
  readdirSync(new URL(l || '.', GUIDES)).filter((f) => f.endsWith('.md')).map((f) => l + f),
);
const raw = (f: string) => readFileSync(new URL(f, GUIDES), 'utf8');

test('the panel offers both Excel and CSV, and no guide mentions only a CSV download', () => {
  const panel = readFileSync(new URL('../components/panel/guests.tsx', import.meta.url), 'utf8');
  assert.match(panel, /Download Excel/);
  assert.match(panel, /Download CSV/);
  for (const f of files) {
    for (const line of raw(f).split('\n').filter((l) => /CSV/.test(l))) assert.match(line, /Excel/, `${f}: ${line.slice(0, 80)}`);
  }
});

test('story limits in the wording guide come from the panel limits, in every language', () => {
  for (const l of ['', 'tr/', 'de/', 'es/', 'fr/']) {
    const text = raw(`${l}wedding-website-wording.md`);
    assert.match(text, /\{\{storyIntroChars\}\}/, `${l}wording`);
    assert.match(text, /\{\{storyCaptionChars\}\}/, `${l}wording`);
  }
  assert.match(loadGuide('wedding-website-wording')!.markdown, new RegExp(`up to ${LIMITS.storyIntroChars} characters and each photo caption up to ${LIMITS.storyCaptionChars}`));
});

test('wedding timing cites the Emily Post planning timeline, not the general party timing table', () => {
  for (const f of files) assert.doesNotMatch(raw(f), /emilypost\.com\/advice\/invitation-timing/, f);
  for (const slug of ['when-to-send-your-wedding-website', 'wedding-rsvp-deadline'])
    assert.match(loadGuide(slug)!.markdown, /\]\(https:\/\/emilypost\.com\/advice\/wedding-planning-series\)/, slug);
});
