// G126: story music + sound effects — the catalogue and its files (sizes, licence record, opening cues on each theme's
// own choreography), audio signatures, byte ranges, the engine's site-data + script, the music upload API (one part and
// several parts) and serving the couple's file (published only while chosen, Range → 206).
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { POST as musicRoute } from '../app/api/edit/[slug]/music/route.ts';
import { PUT as saveRoute, GET as stateRoute } from '../app/api/edit/[slug]/route.ts';
import { GET as pageRoute } from '../app/[slug]/[page]/route.ts';
import { GET as siteRoute } from '../app/[slug]/route.ts';
import { GET as mediaRoute } from '../app/media/[...path]/route.ts';
import { customMusicFile, DESIGN_SOUND, EFFECT_NAMES, effectsOn, MUSIC_TRACKS, resolveMusic } from '../lib/audio/catalog.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { byteRange } from '../lib/site/static.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { assertAudioUpload, detectAudioType, UploadRejectedError } from '../lib/uploads.ts';
import { PLATFORM_ROOT, tinyPng, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
const AUDIO_DIR = path.join(PLATFORM_ROOT, 'public', 'audio');
const demo = (theme = 'olive-ivory'): ContentRecord => JSON.parse(readFileSync(path.join(THEMES_DIR, theme, 'content.demo.json'), 'utf8')) as ContentRecord;

before(() => {
  process.env.PLATFORM_DATA_DIR = tmpDir('g126-data-');
  delete process.env.PLATFORM_THEMES_DIR;
  delete process.env.PLATFORM_PUBLIC_URL;
});

// ------------------------------------------------------------------------------------------------- catalogue

test('every design has its sounds; tracks ≤ 1.5 MB, effects ≤ 56 KB (G967), all in LICENSES.md', () => {
  const themes = readdirSync(THEMES_DIR).filter((t) => t !== '_sample' && statSync(path.join(THEMES_DIR, t)).isDirectory());
  assert.deepEqual(new Set(themes), new Set(Object.keys(DESIGN_SOUND)), 'every theme has one sound entry');
  for (const t of themes) assert.ok(DESIGN_SOUND[t], `${t} has no sound entry`);
  const licences = readFileSync(path.join(AUDIO_DIR, 'LICENSES.md'), 'utf8');
  for (const track of MUSIC_TRACKS) {
    const file = path.join(PLATFORM_ROOT, 'public', track.url);
    assert.ok(statSync(file).size <= 1.5 * 1024 * 1024, `${track.id} too large`);
    assert.ok(detectAudioType(readFileSync(file)), `${track.id} is not an mp3`);
    assert.ok(licences.includes(`music/${track.id}.mp3`), `${track.id} not in LICENSES.md`);
  }
  for (const name of EFFECT_NAMES) {
    const size = statSync(path.join(AUDIO_DIR, 'fx', `${name}.mp3`)).size;
    assert.ok(size > 500 && size <= 56 * 1024, `${name}: ${size} bytes`);
    assert.ok(licences.includes(`fx/${name}.mp3`), `${name} not in LICENSES.md`);
  }
  for (const [id, s] of Object.entries(DESIGN_SOUND)) assert.ok(MUSIC_TRACKS.some((t) => t.id === s.music), `${id}: unknown track`);
});

// 22–32 were redesigned on their own branch (G422–G432, owner decision 2026-10-23: that version is the valid one); their
// cues follow the new MOTION. Until that branch is merged, a theme still carrying the old shared opening (this exact
// set of step starts) is reported, not failed; once merged the check is strict for every theme.
const PRE_REDESIGN_STARTS = '0,200,360,880,1280,1430,1800,3140';
const REDESIGNED = new Set(['nocturne-lake-estate', 'velvet-jewel-box', 'grand-theatre-premiere', 'orient-express-voyage', 'kintsugi-washi',
  'riad-lantern-nights', 'maison-patisserie', 'celestial-observatory', 'azulejo-mosaic', 'sky-lantern-festival', 'music-box-ballerina']);

/** Step starts of a theme's MOTION.envelope: `key: [start, …]`, and the moments given as a bare number (accents, petals, snow). */
function envelopeStarts(theme: string): Set<number> {
  const js = readFileSync(path.join(THEMES_DIR, theme, 'site.js'), 'utf8');
  const block = /envelope:\s*\{([\s\S]*?)\n\s*\}/.exec(js.slice(js.indexOf('const MOTION = {')));
  assert.ok(block, `${theme}: no MOTION.envelope`);
  const starts = [...block[1].matchAll(/\w+\s*:\s*\[\s*(\d+)\s*,/g)].map((m) => Number(m[1]));
  starts.push(...[...block[1].matchAll(/\b(?:accents|petals|snow)\s*:\s*(\d+)\s*[,\n]/g)].map((m) => Number(m[1])));
  return new Set(starts);
}

test('opening cues start with a step of the theme’s own MOTION.envelope (site.js)', (t) => {
  for (const [theme, s] of Object.entries(DESIGN_SOUND)) {
    const starts = envelopeStarts(theme);
    if (REDESIGNED.has(theme) && [...starts].sort((a, b) => a - b).join(',') === PRE_REDESIGN_STARTS) {
      t.diagnostic(`${theme}: pre-redesign site.js in this tree; its cues follow the 22–32 redesign (checked once merged)`);
      continue;
    }
    for (const [ms, fx] of s.opening) assert.ok(starts.has(ms), `${theme}: cue ${fx} at ${ms} ms matches no step (${[...starts].join(', ')})`);
    const times = s.opening.map((c) => c[0]);
    assert.deepEqual(times, [...times].sort((a, b) => a - b), `${theme}: cues in order`);
  }
});

test('content.audio: default track, own file, off; effects default on; schema', () => {
  const c = demo();
  assert.equal(resolveMusic(c, 'olive-ivory')?.trackId, 'first-light');
  assert.equal(resolveMusic(c, 'art-deco-black-tie')?.trackId, 'evening-strings');
  assert.equal(resolveMusic({ ...c, audio: { music: 'music-box' } }, 'olive-ivory')?.url, '/audio/music/music-box.mp3');
  assert.equal(resolveMusic({ ...c, audio: { music: 'no-such-track' } }, 'olive-ivory')?.trackId, 'first-light');
  assert.equal(resolveMusic({ ...c, audio: { music: 'off' } }, 'olive-ivory'), null);
  assert.equal(resolveMusic({ ...c, audio: { music: 'custom' } }, 'olive-ivory'), null, 'custom without a file');
  const own = { ...c, audio: { music: 'custom', music_file: '/media/x/y.mp3', music_name: 'song.mp3' } };
  assert.deepEqual(resolveMusic(own, 'olive-ivory'), { url: '/media/x/y.mp3', custom: true, trackId: null });
  assert.equal(customMusicFile(own), '/media/x/y.mp3');
  assert.equal(customMusicFile({ ...own, optional_blocks: { ...c.optional_blocks, our_story: false } }), null, 'story off: not public');
  assert.equal(customMusicFile({ ...own, audio: { ...own.audio, music: 'first-light' } }), null, 'not chosen: not public');
  assert.equal(effectsOn(c), true);
  assert.equal(effectsOn({ ...c, audio: { effects: false } }), false);
  assert.ok(validateContent(own, { platform: true }).ok);
  assert.ok(!validateContent({ ...c, audio: { music: 'Bad Value!' } }, { platform: true }).ok);
  assert.ok(!validateContent({ ...c, audio: { volume: 3 } } as unknown as ContentRecord, { platform: true }).ok);
});

// ------------------------------------------------------------------------------------------------- uploads

const id3 = (size = 64) => {
  const b = new Uint8Array(size);
  b.set([0x49, 0x44, 0x33, 3, 0, 0, 0, 0, 0, 0]);
  return b;
};

test('audio signatures: ID3 / MPEG frame / M4A / ADTS; images, text and a wrong declared type are refused', () => {
  assert.equal(detectAudioType(id3())?.ext, 'mp3');
  assert.equal(detectAudioType(new Uint8Array([0xff, 0xfb, 0x90, 0x64, 0, 0]))?.ext, 'mp3');
  assert.equal(detectAudioType(new Uint8Array([0xff, 0xf1, 0x50, 0x80, 0, 0]))?.ext, 'aac');
  const m4a = new Uint8Array(32);
  m4a.set([0, 0, 0, 0x20, 0x66, 0x74, 0x79, 0x70, 0x4d, 0x34, 0x41, 0x20]);
  assert.equal(detectAudioType(m4a)?.ext, 'm4a');
  assert.equal(detectAudioType(tinyPng()), null);
  assert.equal(detectAudioType(new TextEncoder().encode('<html>hello</html>')), null);
  assert.equal(detectAudioType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), null, 'a JPEG is not an MPEG frame');
  assert.equal(assertAudioUpload(id3(), 'audio/mpeg').contentType, 'audio/mpeg');
  assert.equal(assertAudioUpload(m4a, 'audio/x-m4a').contentType, 'audio/mp4');
  assert.throws(() => assertAudioUpload(id3(), 'image/png'), UploadRejectedError);
  assert.throws(() => assertAudioUpload(tinyPng(), 'audio/mpeg'), UploadRejectedError);
  assert.throws(() => assertAudioUpload(id3(11 * 1024 * 1024), 'audio/mpeg'), (e: UploadRejectedError) => e.reason === 'too_large');
});

test('byte ranges', () => {
  assert.equal(byteRange(null, 100), null);
  assert.deepEqual(byteRange('bytes=0-', 100), { start: 0, end: 99 });
  assert.deepEqual(byteRange('bytes=10-19', 100), { start: 10, end: 19 });
  assert.deepEqual(byteRange('bytes=90-500', 100), { start: 90, end: 99 });
  assert.deepEqual(byteRange('bytes=-10', 100), { start: 90, end: 99 });
  assert.equal(byteRange('bytes=100-', 100), 'invalid');
  assert.equal(byteRange('bytes=5-2', 100), 'invalid');
  assert.equal(byteRange('bytes=0-1,5-6', 100), null, 'several ranges: the whole file');
});

// ------------------------------------------------------------------------------------------------- routes

type Handler = (req: Request, ctx: { params: Promise<any> }) => Promise<Response>;
async function call(handler: Handler, url: string, params: Record<string, unknown>, opts: { method?: string; key?: string; json?: unknown; body?: BodyInit; headers?: Record<string, string> } = {}) {
  const headers = new Headers({ 'x-forwarded-for': '203.0.113.76', ...(opts.headers ?? {}) });
  if (opts.key) headers.set('authorization', `Bearer ${opts.key}`);
  let body = opts.body;
  if (opts.json !== undefined) {
    body = JSON.stringify(opts.json);
    headers.set('content-type', 'application/json');
  }
  const res = await handler(new Request(`${BASE}${url}`, { method: opts.method ?? 'GET', headers, body }), { params: Promise.resolve(params) });
  const buf = new Uint8Array(await res.arrayBuffer());
  const text = new TextDecoder().decode(buf);
  let data: any = text;
  try {
    data = JSON.parse(text);
  } catch {
    /* html / bytes */
  }
  return { status: res.status, data, text, buf, headers: res.headers };
}
const siteData = (html: string) => JSON.parse(cheerio.load(html)('#site-data').text());

test('engine: sound settings in site-data + one /audio/audio.js; music only on the story page; nothing to play → no script', async () => {
  const c = demo();
  const s = await createSiteWithKeys(getDataAdapter(), { slug: 'g126-engine', theme: 'olive-ivory', content: c });
  await publishSite(getDataAdapter(), s.site.id);
  const index = await call(siteRoute, '/g126-engine', { slug: 'g126-engine' });
  assert.equal(index.status, 200);
  const d = siteData(index.text);
  assert.equal(d.sound.music, null);
  assert.equal(d.sound.effects, true);
  assert.deepEqual(d.sound.opening, DESIGN_SOUND['olive-ivory'].opening.map((x) => [...x]));
  assert.equal(cheerio.load(index.text)('script[src="/audio/audio.js"]').length, 1);
  const story = await call(pageRoute, '/g126-engine/story', { slug: 'g126-engine', page: 'story' });
  assert.equal(siteData(story.text).sound.music, '/audio/music/first-light.mp3');
  assert.deepEqual(siteData(story.text).sound.opening, []);

  const quiet = { ...c, audio: { music: 'off', effects: false } };
  const q = await createSiteWithKeys(getDataAdapter(), { slug: 'g126-quiet', theme: 'olive-ivory', content: quiet });
  await publishSite(getDataAdapter(), q.site.id);
  const qs = await call(pageRoute, '/g126-quiet/story', { slug: 'g126-quiet', page: 'story' });
  assert.equal(siteData(qs.text).sound, undefined);
  assert.equal(cheerio.load(qs.text)('script[src="/audio/audio.js"]').length, 0);
});

test('music upload: one part, several parts, refusals; the file is served only while chosen and published, with ranges', async () => {
  const c = demo();
  const s = await createSiteWithKeys(getDataAdapter(), { slug: 'g126-upload', theme: 'olive-ivory', content: c });
  const send = (body: Uint8Array, h: Record<string, string>, key = s.editKey) =>
    call(musicRoute, '/api/edit/g126-upload/music', { slug: 'g126-upload' }, { method: 'POST', key, body: Buffer.from(body), headers: { 'content-type': 'application/octet-stream', ...h } });
  const uid = (n: number) => n.toString(16).padStart(32, '0');

  // a real track as one part
  const track = readFileSync(path.join(AUDIO_DIR, 'music', 'garden-waltz.mp3'));
  const one = await send(track, { 'x-upload-id': uid(1), 'x-upload-part': '0', 'x-upload-parts': '1', 'x-upload-type': 'audio/mpeg' });
  assert.equal(one.status, 200, JSON.stringify(one.data));
  assert.match(one.data.url, /^\/media\/[0-9a-f-]{36}\/[0-9a-f]{32}\.mp3$/);

  // 5 MB in two parts (3.5 MB + rest)
  const big = id3(5 * 1024 * 1024);
  const PART = 3.5 * 1024 * 1024;
  const p0 = await send(big.subarray(0, PART), { 'x-upload-id': uid(2), 'x-upload-part': '0', 'x-upload-parts': '2', 'x-upload-type': 'audio/mpeg' });
  assert.equal(p0.status, 200);
  const p1 = await send(big.subarray(PART), { 'x-upload-id': uid(2), 'x-upload-part': '1', 'x-upload-parts': '2', 'x-upload-type': 'audio/mpeg' });
  assert.equal(p1.status, 200, JSON.stringify(p1.data));
  // a last part whose earlier parts never arrived
  const lost = await send(big.subarray(PART), { 'x-upload-id': uid(3), 'x-upload-part': '1', 'x-upload-parts': '2' });
  assert.equal(lost.status, 409);

  assert.equal((await send(tinyPng(), { 'x-upload-id': uid(4), 'x-upload-part': '0', 'x-upload-parts': '1', 'x-upload-type': 'image/png' })).status, 415);
  assert.equal((await send(id3(), { 'x-upload-id': uid(5), 'x-upload-part': '0', 'x-upload-parts': '1', 'x-upload-type': 'text/html' })).status, 415);
  assert.equal((await send(id3(), { 'x-upload-id': 'nope', 'x-upload-part': '0', 'x-upload-parts': '1' })).status, 400);
  assert.equal((await send(id3(), { 'x-upload-id': uid(6), 'x-upload-part': '0', 'x-upload-parts': '9' })).status, 400);
  assert.equal((await send(id3(), { 'x-upload-id': uid(7), 'x-upload-part': '0', 'x-upload-parts': '1' }, s.previewKey)).status, 401);

  // not chosen yet → not public
  const rel = one.data.url.replace(/^\/media\//, '');
  const media = (h: Record<string, string> = {}, q = '') => call(mediaRoute, `/media/${rel}${q}`, { path: rel.split('/') }, { headers: h });
  assert.equal((await media()).status, 404);
  // the panel's preview key always works
  assert.equal((await media({}, `?preview=${encodeURIComponent(s.previewKey)}`)).status, 200);

  // chosen in the draft and published → public, with Range
  const state = await call(stateRoute, '/api/edit/g126-upload', { slug: 'g126-upload' }, { key: s.editKey });
  const content = { ...state.data.state.content, audio: { music: 'custom', music_file: one.data.url, music_name: 'garden-waltz.mp3' } };
  const saved = await call(saveRoute, '/api/edit/g126-upload', { slug: 'g126-upload' }, { method: 'PUT', key: s.editKey, json: { content, baseUpdatedAt: state.data.state.updatedAt } });
  assert.equal(saved.status, 200, JSON.stringify(saved.data));
  await publishSite(getDataAdapter(), s.site.id);
  const full = await media();
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('content-type'), 'audio/mpeg');
  assert.equal(full.headers.get('accept-ranges'), 'bytes');
  assert.equal(full.buf.length, track.length);
  const part = await media({ range: 'bytes=100-199' });
  assert.equal(part.status, 206);
  assert.equal(part.headers.get('content-range'), `bytes 100-199/${track.length}`);
  assert.deepEqual([...part.buf], [...track.subarray(100, 200)]);
  assert.equal((await media({ range: `bytes=${track.length}-` })).status, 416);
  const story = await call(pageRoute, '/g126-upload/story', { slug: 'g126-upload', page: 'story' });
  assert.equal(siteData(story.text).sound.music, one.data.url);
});

