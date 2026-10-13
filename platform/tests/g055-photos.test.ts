// G055: buyer photos get 640/1280 px variants on upload; the engine writes srcset/sizes; the /media route serves a
// variant exactly when it serves its photo. (Browser measurement at DPR 3: tests/g055-browser.ts.)
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import sharp from 'sharp';
import { PUT as saveRoute } from '../app/api/edit/[slug]/route.ts';
import { POST as photoRoute } from '../app/api/edit/[slug]/photo/route.ts';
import { POST as publishRoute } from '../app/api/edit/[slug]/publish/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import type { DataAdapter } from '../lib/data/types.ts';
import { preparePhoto } from '../lib/panel/photos.ts';
import { photoCandidates, PHOTO_VARIANT_WIDTHS, smallestPhotoUrl, variantWidths } from '../lib/photo-variants.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { photoSetFiles, UploadRejectedError } from '../lib/uploads.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const SITE = '0b9f2c1e-0000-4000-8000-000000000000';
const HEX = '0123456789abcdef0123456789abcdef';

async function photo(width: number, height: number): Promise<Uint8Array> {
  // A gradient (not a flat colour): JPEG sizes behave like a photo's.
  const raw = Buffer.alloc(width * height * 3);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 3;
      raw[i] = (x * 255) / width;
      raw[i + 1] = (y * 255) / height;
      raw[i + 2] = ((x ^ y) & 0xff) / 2;
    }
  }
  return new Uint8Array(await sharp(raw, { raw: { width, height, channels: 3 } }).jpeg({ quality: 92 }).toBuffer());
}

let site: { editKey: string; previewKey: string; id: string };

before(async () => {
  const themes = tmpDir('g055-photo-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g055-photo-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  const s = await createSiteWithKeys(getDataAdapter(), { slug: 'photo-pair', theme: '_sample', content: demoContent() });
  site = { editKey: s.editKey, previewKey: s.previewKey, id: s.site.id };
});

// ---------------------------------------------------------------------------------------------

test('variant names: widths below the photo, candidates ascending, only for <hex>-<W>w names under /media', () => {
  assert.deepEqual([...PHOTO_VARIANT_WIDTHS], [640, 1280]);
  assert.deepEqual(variantWidths(2000), [640, 1280]);
  assert.deepEqual(variantWidths(1280), [640]);
  assert.deepEqual(variantWidths(641), [640]);
  assert.deepEqual(variantWidths(640), []);
  const url = `/media/${SITE}/${HEX}-2000w.jpg`;
  assert.deepEqual(photoCandidates(url), [
    { url: `/media/${SITE}/${HEX}-640w.jpg`, width: 640 },
    { url: `/media/${SITE}/${HEX}-1280w.jpg`, width: 1280 },
    { url, width: 2000 },
  ]);
  assert.deepEqual(photoCandidates(`/media/${SITE}/${HEX}-600w.jpg`), [{ url: `/media/${SITE}/${HEX}-600w.jpg`, width: 600 }]);
  for (const other of [`/media/${SITE}/${HEX}.jpg`, `https://cdn.example.test/${HEX}-2000w.jpg`, `/media/${SITE}/${HEX}-2000w.jpg?preview=k`, `/media/x/${HEX}-2000w.jpg`, null, 42]) {
    assert.equal(photoCandidates(other), null, String(other));
  }
  assert.equal(smallestPhotoUrl(url), `/media/${SITE}/${HEX}-640w.jpg`);
  assert.equal(smallestPhotoUrl(`/media/${SITE}/${HEX}.jpg`), `/media/${SITE}/${HEX}.jpg`);
});

test('preparePhoto: the photo (<= 2400 px, slot ratio) plus 640/1280 px JPEG variants from the original', async () => {
  const big = await preparePhoto(await photo(3000, 2000), 4 / 5);
  assert.deepEqual([big.width, big.height], [1600, 2000]);
  assert.deepEqual(big.variants.map((v) => [v.width, v.height]), [[640, 800], [1280, 1600]]);
  for (const v of big.variants) {
    const meta = await sharp(Buffer.from(v.bytes)).metadata();
    assert.deepEqual([meta.format, meta.width, meta.height, meta.exif], ['jpeg', v.width, v.height, undefined]);
    assert.ok(v.bytes.length < big.bytes.length);
  }
  const mid = await preparePhoto(await photo(900, 600), null);
  assert.deepEqual(mid.variants.map((v) => v.width), [640]);
  const small = await preparePhoto(await photo(500, 400), null);
  assert.deepEqual(small.variants, []);
});

test('photoSetFiles: names under one base, variants first; wrong variant sets are refused', async () => {
  const p = await preparePhoto(await photo(1500, 1000), null);
  const set = photoSetFiles(p, HEX);
  assert.deepEqual(set.files.map((f) => f.name), [`${HEX}-640w.jpg`, `${HEX}-1280w.jpg`, `${HEX}-1500w.jpg`]);
  assert.deepEqual(photoSetFiles({ bytes: tinyPng() }, HEX).files.map((f) => f.name), [`${HEX}.png`]);
  assert.throws(() => photoSetFiles({ bytes: p.bytes, width: 1500, variants: p.variants.slice(1) }, HEX), /needs variants \[640, 1280\]/);
  assert.throws(() => photoSetFiles({ bytes: p.bytes, variants: p.variants }, HEX), /need the width/);
  assert.throws(() => photoSetFiles({ bytes: p.bytes, width: 1500, variants: [p.variants[0], { width: 1280, bytes: tinyPng() }] }, HEX), UploadRejectedError);
  assert.throws(() => photoSetFiles({ bytes: p.bytes, width: 1500, variants: [p.variants[0], { width: 1280, bytes: new Uint8Array([1, 2, 3]) }] }, HEX), UploadRejectedError);
});

test('adapters (local + blob): a photo set is stored and read back; older single files still read', async () => {
  const p = await preparePhoto(await photo(1500, 1000), null);
  const fake = new FakeBlobStore();
  const adapters: DataAdapter[] = [new LocalAdapter(tmpDir('g055-local-')), new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 })];
  for (const a of adapters) {
    const { site: s } = await createSiteWithKeys(a, { slug: `set-${a.kind}`, theme: '_sample', content: demoContent() });
    const saved = await a.savePhoto(s.id, { bytes: p.bytes, width: p.width, variants: p.variants });
    assert.match(saved.url, new RegExp(`^/media/${s.id}/[0-9a-f]{32}-1500w\\.jpg$`), a.kind);
    assert.deepEqual(saved.variants.map((v) => [v.width, v.url]), [
      [640, saved.url.replace('-1500w.', '-640w.')],
      [1280, saved.url.replace('-1500w.', '-1280w.')],
    ]);
    for (const [path_, bytes] of [[saved.path, p.bytes], ...saved.variants.map((v, i) => [v.path, p.variants[i].bytes] as const)] as const) {
      assert.deepEqual(Buffer.from((await a.readPhoto!(path_))!.bytes), Buffer.from(bytes), `${a.kind} ${path_}`);
    }
    assert.equal(await a.readPhoto!(saved.path.replace('-1500w.', '-999w.')), null, 'no such size');
    assert.equal(await a.readPhoto!(saved.path.replace('-1500w.', '-0640w.')), null, 'malformed width');
    const old = await a.savePhoto(s.id, { bytes: tinyPng() });
    assert.match(old.url, /\/[0-9a-f]{32}\.png$/);
    assert.deepEqual(old.variants, []);
    assert.ok(await a.readPhoto!(old.path));
    await a.deleteSite(s.id);
    assert.equal(await a.readPhoto!(saved.variants[0].path), null, `${a.kind}: deleting the site removes the variants`);
  }
});

test('engine: srcset = variants + photo with the template sizes; preview key on every candidate; no srcset for older photos', () => {
  const theme = { id: 't', pages: { index: 'index.html' }, photos: { hero: { label: 'Hero', source: 'media.hero_portrait' } } };
  const html = `<!DOCTYPE html><html><head><title>t</title></head><body>
    <img id="a" data-photo="hero" src="img/ph-320.webp" srcset="img/ph-320.webp 320w, img/ph-640.webp 640w" sizes="min(40vw, 220px)" alt="">
    <img id="b" data-field="media.hero_portrait" src="img/ph-320.webp" alt="">
    <img id="l" data-photo="hero" src="img/ph-320.webp" alt="" loading="lazy">
    <picture><source srcset="img/ph.avif" type="image/avif"><img id="c" data-photo="hero" src="img/ph-320.webp" alt=""></picture></body></html>`;
  const c = demoContent();
  c.media.hero_portrait = `/media/${SITE}/${HEX}-1600w.jpg`;
  const $ = cheerio.load(renderTemplate({ html, content: c, theme, page: 'index', slug: 's' }).html);
  const srcset = `/media/${SITE}/${HEX}-640w.jpg 640w, /media/${SITE}/${HEX}-1280w.jpg 1280w, /media/${SITE}/${HEX}-1600w.jpg 1600w`;
  assert.equal($('#a').attr('src'), `/media/${SITE}/${HEX}-1600w.jpg`);
  assert.equal($('#a').attr('srcset'), srcset);
  assert.equal($('#a').attr('sizes'), 'min(40vw, 220px)', "the slot's CSS width, written for the placeholder");
  assert.equal($('#b').attr('sizes'), '100vw', 'no sizes in the template: the browser default, written out');
  assert.equal($('#l').attr('sizes'), 'auto, 100vw', 'lazy and no sizes: the laid-out width where the browser knows "auto"');
  assert.equal($('#c').attr('srcset'), srcset);
  assert.equal($('picture source').length, 0, 'placeholder <source>s go');
  const preview = cheerio.load(renderTemplate({ html, content: c, theme, page: 'index', slug: 's', previewKey: 'k-1' }).html);
  assert.equal(preview('#a').attr('srcset'), srcset.replace(/\.jpg (\d+)w/g, '.jpg?preview=k-1 $1w'));
  assert.equal(preview('#a').attr('src'), `/media/${SITE}/${HEX}-1600w.jpg?preview=k-1`);
  c.media.hero_portrait = `/media/${SITE}/${HEX}.jpg`;
  const old = cheerio.load(renderTemplate({ html, content: c, theme, page: 'index', slug: 's' }).html);
  assert.equal(old('#a').attr('srcset'), undefined);
  assert.equal(old('#a').attr('sizes'), undefined);
  c.media.hero_portrait = `/media/${SITE}/${HEX}-500w.jpg`;
  const small = cheerio.load(renderTemplate({ html, content: c, theme, page: 'index', slug: 's' }).html);
  assert.equal(small('#a').attr('srcset'), undefined, 'a photo without variants needs no srcset');
});

// ---------------------------------------------------------------------------------------------
// Through the real routes: upload -> draft -> publish -> page srcset -> /media serves each candidate

async function api(handler: (req: Request, ctx: { params: Promise<{ slug: string }> }) => Promise<Response>, suffix: string, init: { body?: BodyInit; json?: unknown; contentType?: string; method?: string } = {}) {
  const headers = new Headers({ authorization: `Bearer ${site.editKey}` });
  let body = init.body;
  if (init.json !== undefined) {
    body = JSON.stringify(init.json);
    headers.set('content-type', 'application/json');
  }
  if (init.contentType) headers.set('content-type', init.contentType);
  const res = await handler(new Request(`${BASE}/api/edit/photo-pair${suffix}`, { method: init.method ?? 'POST', headers, body }), { params: Promise.resolve({ slug: 'photo-pair' }) });
  return { status: res.status, data: (await res.json()) as any };
}
const media = (url: string) => mediaRoute(new Request(`${BASE}${url}`), { params: Promise.resolve({ path: url.split('?')[0].replace('/media/', '').split('/') }) });

test('routes: an uploaded photo is public with its variants once published, the page has srcset; unused sets stay private', async () => {
  const up = await api(photoRoute, '/photo?slot=hero', { body: (await photo(2200, 2750)) as BodyInit, contentType: 'image/jpeg' });
  assert.equal(up.status, 200, JSON.stringify(up.data));
  assert.match(up.data.url, /-1920w\.jpg$/, '2200 x 2750 (4/5) -> 1920 x 2400 (long side <= 2400 px)');
  assert.deepEqual(up.data.variants.map((v: { width: number }) => v.width), [640, 1280]);
  const unused = await api(photoRoute, '/photo?slot=hero', { body: (await photo(1400, 1750)) as BodyInit, contentType: 'image/jpeg' });
  const files = readdirSync(path.join(process.env.PLATFORM_DATA_DIR!, 'uploads', site.id)).sort();
  assert.equal(files.length, 6, files.join(' '));

  const c = demoContent();
  c.media.hero_portrait = up.data.url;
  assert.equal((await api(saveRoute, '', { method: 'PUT', json: { content: c } })).status, 200);
  for (const v of up.data.variants) assert.equal((await media(v.url)).status, 404, 'not public before publishing');
  assert.equal((await api(publishRoute, '/publish')).status, 200);

  const $ = cheerio.load(await (await siteRoute(new Request(`${BASE}/photo-pair`), { params: Promise.resolve({ slug: 'photo-pair' }) })).text());
  const img = $('img[data-photo-state="user"]').first();
  assert.equal(img.attr('src'), up.data.url);
  const candidates = (img.attr('srcset') ?? '').split(', ').map((c2) => c2.split(' '));
  assert.deepEqual(candidates.map(([, w]) => w), ['640w', '1280w', '1920w']);
  for (const [url, w] of candidates) {
    const res = await media(url);
    assert.equal(res.status, 200, url);
    assert.equal(res.headers.get('cache-control'), 'public, max-age=300, s-maxage=300');
    assert.equal((await sharp(Buffer.from(await res.arrayBuffer())).metadata()).width, Number.parseInt(w, 10));
  }
  // The second upload is not in the published content: neither it nor its variants are public; with the key they are.
  for (const u of [unused.data.url, ...unused.data.variants.map((v: { url: string }) => v.url)]) {
    assert.equal((await media(u)).status, 404, u);
    const withKey = await mediaRoute(new Request(`${BASE}${u}?preview=${site.previewKey}`), { params: Promise.resolve({ path: u.replace('/media/', '').split('/') }) });
    assert.equal(withKey.status, 200, `${u} with the preview key`);
  }
  // A "variant" of the published photo at a width that was never made: 404 (no such file).
  assert.equal((await media(up.data.url.replace('-1920w.', '-1000w.'))).status, 404);
  assert.ok(existsSync(path.join(process.env.PLATFORM_DATA_DIR!, 'uploads', site.id, path.basename(up.data.variants[0].url))));
});
