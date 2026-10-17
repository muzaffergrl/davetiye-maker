// G155 (G090 P1-02): the live demo of every design on sale shows the design's own fictional sample photos — no
// "your photo here" frame — with the same srcset as a buyer's photo; the files are in public/demo/<theme>/ (CDN, never
// traced into a function) and match lib/claim/demo-photos.json; the demo records and a buyer's first draft stay without
// them; `npm run seed -- --theme <id>` defaults to the theme's own record and photos.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { GET as demoPageRoute } from '../app/start/demo/[theme]/[page]/route.ts';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { demoPhotoUrls, withDemoPhotos } from '../lib/claim/demo-photos.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { photoCandidates } from '../lib/photo-variants.ts';
import { checkDemoPhotos } from '../scripts/build-demo-photos.ts';
import { defaultSources } from '../scripts/seed.ts';
import { PLATFORM_ROOT, REPO_ROOT } from './helpers.ts';

const BASE = 'https://sites.example.test';
const LIVE = MARKETING.designs.filter((d) => d.status === 'live').map((d) => d.id);
const PAGES = ['home', 'story', 'details'] as const;

test('photoCandidates: a sample photo URL gets its variants (same naming as a buyer photo); anything else does not', () => {
  assert.deepEqual(photoCandidates('/demo/olive-ivory/hero_portrait-1024w.webp'), [
    { url: '/demo/olive-ivory/hero_portrait-640w.webp', width: 640 },
    { url: '/demo/olive-ivory/hero_portrait-1024w.webp', width: 1024 },
  ]);
  assert.deepEqual(photoCandidates('/demo/olive-ivory/venue-1280w.webp')?.map((c) => c.width), [640, 1280]);
  assert.deepEqual(photoCandidates('/demo/olive-ivory/story_1-600w.webp')?.map((c) => c.width), [600], 'narrower than 640: no variant');
  for (const bad of ['/demo/../x/hero-1024w.webp', '/demo/Olive/hero-1024w.webp', '/demo/olive-ivory/hero-1024w.webp?x=1', '/themes/olive-ivory/img/a-640w.webp', '/demo/olive-ivory/a/b-640w.webp']) {
    assert.equal(photoCandidates(bad), null, bad);
  }
});

test('public/demo matches lib/claim/demo-photos.json (scripts/build-demo-photos.ts --check)', () => {
  assert.deepEqual(checkDemoPhotos(), []);
});

test(`every design on sale (${LIVE.length}) has sample photos for every photo slot: its own in public/demo, or set by its demo record`, async () => {
  assert.ok(LIVE.length >= 21);
  for (const id of LIVE) {
    const theme = await claimableTheme(id);
    assert.ok(theme, id);
    const filled = withDemoPhotos(id, theme.manifest.photos, theme.demo);
    for (const [key, slot] of Object.entries(theme.manifest.photos)) {
      const value = slot.source.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), filled);
      assert.ok(typeof value === 'string' && value.length > 0, `${id} ${key}: no sample photo`);
      const own = demoPhotoUrls(id)?.[key];
      if (own) assert.ok(own.startsWith(`/demo/${id}/${key}-`), `${id} ${key}: ${own} is another design's photo`);
    }
  }
});

for (const id of LIVE) {
  test(`${id}: /start/demo pages show the sample photos (no placeholder), with srcset, files on disk`, async () => {
    let photos = 0;
    for (const page of PAGES) {
      const res = await demoPageRoute(new Request(`${BASE}/start/demo/${id}/${page}?preview=demo`), { params: Promise.resolve({ theme: id, page }) });
      assert.equal(res.status, 200, `${id}/${page}`);
      const $ = cheerio.load(await res.text());
      $('[data-photo]').each((_, el) => {
        const node = $(el);
        // a slot hidden by its own condition (data-if) is not shown; every other photo is a real one
        assert.equal(node.attr('data-photo-state'), 'user', `${id}/${page} ${node.attr('data-photo')}: placeholder`);
        photos++;
        const src = node.is('img') ? node.attr('src') : /--photo:\s*url\("?([^")]+)"?\)/.exec(node.attr('style') ?? '')?.[1];
        assert.ok(src, `${id}/${page} ${node.attr('data-photo')}: no src`);
        const urls = [src!, ...(node.attr('srcset') ?? '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean)];
        for (const u of urls) {
          const file = u.startsWith('/demo/') ? path.join(PLATFORM_ROOT, 'public', u) : u.startsWith('/themes/') ? path.join(PLATFORM_ROOT, u) : null;
          assert.ok(file && existsSync(file), `${id}/${page}: ${u} is not a file of the platform`);
        }
        if (node.is('img') && src!.startsWith('/demo/')) assert.match(node.attr('srcset') ?? '', / 640w, /, `${id}/${page}: srcset with the 640 px variant`);
      });
    }
    assert.ok(photos >= 5, `${id}: ${photos} photos on home/story/details`);
  });
}

test('the demo records and a buyer\'s first draft stay without the sample photos', async () => {
  const theme = (await claimableTheme('olive-ivory'))!;
  const before = JSON.stringify(theme.demo);
  const shown = withDemoPhotos('olive-ivory', theme.manifest.photos, theme.demo);
  assert.equal(JSON.stringify(theme.demo), before, 'the record is not modified');
  assert.notEqual(shown, theme.demo);
  assert.equal(shown.media.hero_portrait, demoPhotoUrls('olive-ivory')!.hero_portrait);
  assert.equal(shown.media.memory_photos?.length, 3);
  assert.equal(theme.demo.media.hero_portrait, null);
  const draft = draftFromDemo(theme.demo, ['Ida', 'Ben']);
  assert.deepEqual(draft.media, { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null });
  // a record that sets a photo keeps it; a slot that would leave a gap in the list is not filled
  const own = withDemoPhotos('olive-ivory', theme.manifest.photos, { media: { hero_portrait: '/media/x.jpg', memory_photos: [], couple_clip: null, venue_image: null } });
  assert.equal(own.media.hero_portrait, '/media/x.jpg');
  const gap = withDemoPhotos('olive-ivory', { s: { label: 'x', source: 'media.memory_photos.2' } }, { media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null } });
  assert.deepEqual(gap.media.memory_photos, []);
  // a theme without sample photos of its own is left as it is
  const plain = { media: { hero_portrait: null, memory_photos: [], couple_clip: null, venue_image: null } };
  assert.equal(withDemoPhotos('kintsugi-washi', theme.manifest.photos, plain), plain);
  // 21 Crimson's record links its theme photos itself: not in the manifest, unchanged
  const crimson = (await claimableTheme('crimson-rose-atelier'))!;
  assert.equal(demoPhotoUrls('crimson-rose-atelier'), null);
  assert.equal(withDemoPhotos('crimson-rose-atelier', crimson.manifest.photos, crimson.demo), crimson.demo);
});

test('public/demo is not traced into a server function and is a reserved first segment', () => {
  const cfg = readFileSync(path.join(PLATFORM_ROOT, 'next.config.ts'), 'utf8');
  assert.doesNotMatch(cfg, /public\/demo/);
  const slug = readFileSync(path.join(PLATFORM_ROOT, 'lib/slug.ts'), 'utf8');
  assert.match(slug, /'demo'/);
});

test('npm run seed -- --theme <id>: the theme\'s own demo record and PAKET 2 photos; none of another design', () => {
  const olive = defaultSources('olive-ivory');
  assert.equal(olive.photosDir, path.join(REPO_ROOT, 'collections/01_Olive_Ivory/assets/gpt/photos'));
  assert.equal(olive.content.name_display, JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'themes/olive-ivory/content.demo.json'), 'utf8')).name_display);
  const blush = defaultSources('blush-garden-rose');
  assert.equal(blush.photosDir, path.join(REPO_ROOT, 'collections/03_Blush_Garden_Rose/assets/gpt/photos'));
  const kintsugi = defaultSources('kintsugi-washi');
  assert.equal(kintsugi.photosDir, null, 'no PAKET 2 photos yet: placeholders, not the 03 photos');
});
