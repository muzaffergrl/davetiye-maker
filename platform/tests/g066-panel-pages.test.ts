// K29 (G066-B, simpler panel): the six editor pages over the nine sections, old #edit/<section> addresses, what changed
// since the last publish (the "Unpublished changes" bar and Review), how ready the website is (Home), and the 3-step
// setup's step mapping. Pure functions from components/panel/pages.ts; the browser journeys are in g060-browser.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { prePublishNotes, SECTION_IDS, withPhoto } from '../lib/panel/model.ts';
import { panelTheme } from '../lib/panel/state.ts';
import {
  changedPages,
  changedPaths,
  heroSlot,
  PAGE_IDS,
  PAGE_SECTIONS,
  pageOf,
  parseEditTarget,
  previewPageFor,
  readiness,
  setupStepOf,
} from '../components/panel/pages.ts';
import { REPO } from '../scripts/lib/theme-env.ts';

const demo = JSON.parse(readFileSync(path.join(REPO, 'collections/03_Blush_Garden_Rose/content.demo.json'), 'utf8')) as ContentRecord;

test('every section is on exactly one page, in the K29 order', () => {
  assert.deepEqual([...PAGE_IDS], ['us', 'day', 'photos', 'story', 'details', 'rsvp']);
  const seen = PAGE_IDS.flatMap((p) => PAGE_SECTIONS[p]);
  assert.deepEqual([...seen].sort(), [...SECTION_IDS].sort());
  assert.equal(new Set(seen).size, seen.length);
  assert.deepEqual(PAGE_SECTIONS.day, ['date', 'venue', 'schedule']);
  assert.deepEqual(PAGE_SECTIONS.details, ['details', 'faq']);
  for (const s of SECTION_IDS) assert.ok(PAGE_SECTIONS[pageOf(s)].includes(s), s);
});

test('#edit/<x>: page ids, and old section addresses open their page at the section', () => {
  assert.deepEqual(parseEditTarget('us'), { page: 'us', focus: null });
  assert.deepEqual(parseEditTarget('names'), { page: 'us', focus: null });
  assert.deepEqual(parseEditTarget('date'), { page: 'day', focus: null });
  assert.deepEqual(parseEditTarget('venue'), { page: 'day', focus: 'venue' });
  assert.deepEqual(parseEditTarget('schedule'), { page: 'day', focus: 'schedule' });
  assert.deepEqual(parseEditTarget('faq'), { page: 'details', focus: 'faq' });
  assert.deepEqual(parseEditTarget('details'), { page: 'details', focus: null });
  assert.deepEqual(parseEditTarget('rsvp'), { page: 'rsvp', focus: null });
  assert.equal(parseEditTarget('couple'), null);
  assert.equal(parseEditTarget(''), null);
  // the wide preview follows the page (or the section an address points at)
  assert.equal(previewPageFor('us', null), 'index');
  assert.equal(previewPageFor('day', 'schedule'), 'details');
  assert.equal(previewPageFor('story', null), 'story');
});

test('what changed since the last publish, by page', () => {
  assert.deepEqual(changedPages(demo, structuredClone(demo)), []);
  assert.deepEqual(changedPages(demo, null), [], 'no published copy: nothing to compare');
  const draft = structuredClone(demo);
  draft.venue = { ...draft.venue, name: 'Rosewood Manor' };
  draft.host_line = 'With love';
  draft.urls = { ...(draft.urls ?? {}), registry: 'https://example.com/registry' };
  const withHero = withPhoto(draft, 'media.hero_portrait', '/media/x/abc-1200w.jpg');
  assert.ok(changedPaths(withHero, demo).includes('venue.name'));
  assert.deepEqual(changedPages(withHero, demo), ['day', 'photos', 'details']);
  const names = structuredClone(demo);
  names.partners[0].display_name = 'Elena';
  assert.deepEqual(changedPages(names, demo), ['us']);
  const rsvp = structuredClone(demo);
  rsvp.rsvp = { ...rsvp.rsvp, questions: [{ id: 'meal', label: 'Meal choice', type: 'choice', options: ['Fish', 'Chicken'] }] };
  assert.deepEqual(changedPages(rsvp, demo), ['rsvp']);
});

test('readiness: sections without sample text or errors, the photos (in parts) and publishing', async () => {
  const theme = await panelTheme('blush-garden-rose');
  const sections = SECTION_IDS.filter((id) => id !== 'faq' || theme.fields.faq);
  const score = (content: ContentRecord, published: boolean) =>
    readiness({ sections: [...sections], errors: validateContent(content, { platform: true }).errors, notes: prePublishNotes(content, theme), theme, content, published });
  // The design's own demo record is all sample text, with no photos: low, and publishing adds to it.
  const raw = score(demo, false);
  assert.ok(raw.percent > 0 && raw.percent < 50, String(raw.percent));
  assert.ok(score(demo, true).percent > raw.percent);
  // A photo moves it up, in parts.
  const photo = withPhoto(structuredClone(demo), heroSlot(theme.photos)!.source, '/media/x/abc-1200w.jpg');
  assert.ok(score(photo, false).percent > raw.percent);
  assert.ok(score(photo, false).percent <= 100);
});

test('setup: 3 steps; old 6-step addresses and saved steps land on the matching step', () => {
  assert.equal(setupStepOf(1), 1);
  assert.equal(setupStepOf(2), 2);
  assert.equal(setupStepOf(3), 3);
  assert.equal(setupStepOf(4), 2, 'old step 4 = photos');
  assert.equal(setupStepOf(5), 3, 'old step 5 = check -> publish');
  assert.equal(setupStepOf(6), 3);
  assert.equal(setupStepOf(0), 1);
  assert.equal(setupStepOf(Number.NaN), 1);
  assert.equal(heroSlot([{ key: 'venue' }, { key: 'hero_portrait' }])?.key, 'hero_portrait');
  assert.equal(heroSlot([{ key: 'venue' }])?.key, 'venue');
  assert.equal(heroSlot([]), null);
});
