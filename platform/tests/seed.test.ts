// G056: the seed script stores sample photos the panel upload's way (preparePhoto + savePhoto with width and variants),
// so a seeded demo site — and theme-check's "first view with photos" — carries the same srcset as a buyer's site.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as pageRoute } from '../app/[slug]/[page]/route.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import { parseAspect } from '../lib/panel/model.ts';
import { photoCandidates } from '../lib/photo-variants.ts';
import { loadTheme } from '../lib/theme/theme.ts';
import { seedSite } from '../scripts/seed.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const THEME = 'blush-garden-rose';
const PHOTO_URL = /^\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}-(\d+)w\.jpg$/;

/** A gradient JPEG (no binary fixtures in the repo). */
async function samplePhoto(width: number, height: number): Promise<Buffer> {
  const raw = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      raw[i] = (x * 255) / width;
      raw[i + 1] = (y * 255) / height;
      raw[i + 2] = ((x ^ y) & 0xff) / 2;
    }
  }
  return sharp(raw, { raw: { width, height, channels: 3 } }).jpeg({ quality: 90 }).toBuffer();
}

let dataDir: string;
let photosDir: string;
let adapter: LocalAdapter;

before(async () => {
  delete process.env.PLATFORM_THEMES_DIR; // the real theme folder
  delete process.env.DATA_ADAPTER;
  dataDir = tmpDir('seed-test-data-');
  process.env.PLATFORM_DATA_DIR = dataDir;
  adapter = new LocalAdapter(dataDir);
  // PAKET 2 shapes of design 03's sample photos: four portraits 1024×1536, the venue 1536×1024
  photosDir = tmpDir('seed-test-photos-');
  for (const key of ['hero_portrait', 'story_1', 'story_2', 'story_3']) writeFileSync(path.join(photosDir, `${key}.jpg`), await samplePhoto(1024, 1536));
  writeFileSync(path.join(photosDir, 'venue.jpg'), await samplePhoto(1536, 1024));
});

const opts = (slug: string, extra: Record<string, unknown> = {}) => ({
  theme: THEME, slug, content: demoContent(), draft: false, baseUrl: BASE, photosDir, ...extra,
});

/** Content path (media.memory_photos.0) → URL in the site's published content. */
function mediaAt(content: unknown, source: string): string {
  return source.split('.').reduce<any>((o, k) => o?.[k], content) as string;
}

test('seed: sample photos are stored like a panel upload — cropped to the slot, with 640/1280 variants', async () => {
  const info = await seedSite(adapter, opts('seeded-variants'));
  const theme = (await loadTheme(THEME))!;
  const site = (await adapter.getSiteBySlug('seeded-variants'))!;
  assert.equal(site.status, 'published');
  assert.equal(info.photos.length, 5);
  for (const [key, slot] of Object.entries(theme.manifest.photos)) {
    const url = mediaAt(site.publishedContent, slot.source);
    const m = PHOTO_URL.exec(url);
    assert.ok(m, `${key}: ${url} is a photo set name (<hex>-<W>w.jpg)`);
    const stored = await adapter.readPhoto!(url.slice('/media/'.length));
    assert.ok(stored, `${key}: photo stored`);
    assert.equal(stored.contentType, 'image/jpeg');
    const meta = await sharp(stored.bytes).metadata();
    assert.equal(meta.width, Number(m[1]), `${key}: the name carries the width`);
    // centre crop to the slot's aspect (theme.json), as preparePhoto does for an uncropped upload
    const ratio = parseAspect(slot.aspect)!;
    assert.ok(Math.abs(meta.width! / meta.height! / ratio - 1) < 0.01, `${key}: ${meta.width}×${meta.height} ≈ ${slot.aspect}`);
    assert.equal(meta.exif, undefined, `${key}: no metadata`);
    // every variant the engine will put into srcset exists, at its width
    const candidates = photoCandidates(url)!;
    assert.deepEqual(candidates.map((c) => c.width), meta.width! > 1280 ? [640, 1280, meta.width] : [640, meta.width]);
    for (const c of candidates.slice(0, -1)) {
      const v = await adapter.readPhoto!(c.url.slice('/media/'.length));
      assert.ok(v, `${key}: variant ${c.width} stored`);
      assert.equal((await sharp(v.bytes).metadata()).width, c.width);
    }
    assert.match(info.photos.find((l) => l.startsWith(`${key} `))!, /variants 640/);
  }
});

test('seed: the seeded site renders srcset with the variants and keeps the template sizes', async () => {
  await seedSite(adapter, opts('seeded-srcset'));
  const index = cheerio.load(await (await siteRoute(new Request(`${BASE}/seeded-srcset`), { params: Promise.resolve({ slug: 'seeded-srcset' }) })).text());
  const hero = index('img[data-photo="hero_portrait"]');
  assert.equal(hero.attr('data-photo-state'), 'user');
  assert.match(hero.attr('srcset') ?? '', /-640w\.jpg 640w, \/media\/[^ ]+-1024w\.jpg 1024w$/);
  assert.equal(hero.attr('sizes'), 'min(36vw, 19vh, 180px)'); // index.html's own sizes
  const details = cheerio.load(await (await pageRoute(new Request(`${BASE}/seeded-srcset/details`), { params: Promise.resolve({ slug: 'seeded-srcset', page: 'details' }) })).text());
  const venue = details('img[data-photo="venue"]');
  assert.match(venue.attr('srcset') ?? '', /-640w\.jpg 640w, .+-1280w\.jpg 1280w, .+-1536w\.jpg 1536w$/);
});

test('seed: photoMax shrinks the sample first; photoMax 0 keeps the original file (no variants, no srcset)', async () => {
  await seedSite(adapter, opts('seeded-small', { photoMax: 800 }));
  const small = (await adapter.getSiteBySlug('seeded-small'))!.publishedContent!;
  const hero = small.media.hero_portrait!;
  const m = PHOTO_URL.exec(hero);
  assert.ok(m && Number(m[1]) <= 800, hero);
  assert.deepEqual(photoCandidates(hero)!.map((c) => c.width), [Number(m[1])]); // narrower than 640: no variant
  const venue = small.media.venue_image!;
  assert.deepEqual(photoCandidates(venue)!.map((c) => c.width), [640, 800]);

  const info = await seedSite(adapter, opts('seeded-original', { photoMax: 0 }));
  const original = (await adapter.getSiteBySlug('seeded-original'))!.publishedContent!;
  assert.match(original.media.hero_portrait!, /^\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}\.jpg$/);
  assert.equal(photoCandidates(original.media.hero_portrait), null);
  const bytes = await adapter.readPhoto!(original.media.hero_portrait!.slice('/media/'.length));
  assert.deepEqual(Buffer.from(bytes!.bytes), readFileSync(path.join(photosDir, 'hero_portrait.jpg')));
  assert.match(info.photos[0], /original file/);
  const $ = cheerio.load(await (await siteRoute(new Request(`${BASE}/seeded-original`), { params: Promise.resolve({ slug: 'seeded-original' }) })).text());
  assert.equal($('img[data-photo="hero_portrait"]').attr('srcset'), undefined);
});

test('seed CLI (npm run seed, as theme-check runs it): variants on disk; a bad --photo-max is refused', () => {
  const dir = tmpDir('seed-cli-data-');
  const contentFile = path.join(dir, 'content.json');
  writeFileSync(contentFile, JSON.stringify(demoContent()));
  const run = (...args: string[]) => spawnSync(process.execPath, [path.join(PLATFORM_ROOT, 'scripts/seed.ts'), '--theme', THEME, '--content', contentFile, ...args], {
    cwd: PLATFORM_ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dir, DATA_ADAPTER: 'local' }, encoding: 'utf8',
  });
  const ok = run('--slug', 'cli-seed', '--photos', photosDir);
  assert.equal(ok.status, 0, ok.stderr);
  const keys = JSON.parse(readFileSync(path.join(dir, 'seed-keys.json'), 'utf8'));
  assert.equal(keys.photos.length, 5);
  const site = JSON.parse(readFileSync(path.join(dir, 'sites', `${keys.siteId}.json`), 'utf8'));
  const url: string = site.publishedContent.media.memory_photos[0];
  assert.match(url, PHOTO_URL);
  for (const c of photoCandidates(url)!) {
    const file = path.join(dir, 'uploads', ...c.url.slice('/media/'.length).split('/'));
    assert.ok(readFileSync(file).length > 0, `${c.url} on disk`);
  }
  const bad = run('--slug', 'cli-bad', '--photos', photosDir, '--photo-max', 'big');
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /--photo-max must be a whole number of pixels/);
});
