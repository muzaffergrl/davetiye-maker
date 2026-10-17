// G141 (K45 item 7): the home page shows every live design (featured first) as an interactive gallery; the editing tour
// and the design-page panel strip use REAL panel screens that exist in the asset manifest; the copy lives in one file.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assets from '../lib/marketing/assets.json' with { type: 'json' };
import { MARKETING } from '../lib/marketing/config.ts';
import { liveDesigns, PANEL_SOURCES, showcaseDesigns } from '../lib/marketing/designs.ts';
import { DESIGN_GALLERY_COPY, EDIT_TOUR } from '../lib/marketing/showcase.ts';
import { openingKinds } from '../components/marketing/showcase-data.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const read = (rel: string) => readFileSync(path.join(PLATFORM_ROOT, rel), 'utf8');

test('home showcase: every live design once, featured first, never a coming one', () => {
  const live = liveDesigns();
  const show = showcaseDesigns();
  assert.deepEqual([...show.map((d) => d.id)].sort(), live.map((d) => d.id).sort());
  const firstPlain = show.findIndex((d) => !d.featured);
  assert.ok(show.slice(0, firstPlain).every((d) => d.featured) && show.slice(firstPlain).every((d) => !d.featured));
  assert.ok(!show.some((d) => d.status !== 'live'));
  const coming = MARKETING.designs.filter((d) => d.status === 'coming').map((d) => d.id);
  assert.ok(!show.some((d) => coming.includes(d.id)));
});

test('editing tour and design-page panel strip: real captured panel screens, each step once', () => {
  const panel = (assets as any).panel as Record<string, { files: Record<string, string> }>;
  for (const st of EDIT_TOUR) {
    assert.ok(st.screen in PANEL_SOURCES, st.screen);
    assert.ok(panel[st.screen] && Object.keys(panel[st.screen].files).length, `no captured screen ${st.screen}`);
  }
  assert.equal(new Set(EDIT_TOUR.map((s) => s.screen)).size, EDIT_TOUR.length);
  for (const k of DESIGN_GALLERY_COPY.panel) assert.ok(EDIT_TOUR.some((s) => s.screen === k), k);
  // honest Sheets wording: the Excel file opens in Google Sheets; no claim of a live Sheets connection
  const excel = EDIT_TOUR.find((s) => s.screen === 'excel')!;
  assert.match(excel.text, /opens in Excel, Numbers or Google Sheets/);
});

test('openings reel: one design per kind of opening', () => {
  const kinds = openingKinds(liveDesigns());
  assert.equal(new Set(kinds.map((k) => k.thing)).size, kinds.length);
  assert.ok(kinds.length >= 2 && kinds.length <= 6);
});

test('showcase components take their copy from lib/marketing/showcase.ts', () => {
  for (const f of ['components/marketing/CardOpening.tsx', 'components/marketing/Compare.tsx', 'components/marketing/EditTour.tsx']) {
    assert.match(read(f), /lib\/marketing\/showcase\.ts/, f);
  }
  const home = read('app/(marketing)/page.tsx');
  assert.match(home, /<DesignGallery /);
  assert.match(home, /<EditTour /);
});
