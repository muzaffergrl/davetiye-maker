// Smoke test of the blob adapter against a REAL (private) Vercel Blob store — the assumptions the fake in
// tests/fake-blob.ts cannot prove (G048 Sonuç, G044): server-side allowOverwrite:false and ifMatch, slug/order races
// between two server instances, ETag lock under concurrent writes (no lost update), RSVP listing right after writing,
// photo round trip, private access, cleanup.
//
//   cd platform && node --env-file=.env.local scripts/blob-smoke.mjs
//
// Needs BLOB_READ_WRITE_TOKEN (vercel env pull / `vercel link` writes it to .env.local). Writes only
// "smoke-<time>-*" sites and "SMOKE<time>" order indexes and deletes them at the end (also on failure).
// Never prints the token. Exit code 0 = every check passed.

import { readFileSync } from 'node:fs';
import { get, list, put } from '@vercel/blob';
import sharp from 'sharp';
import { BlobAdapter } from '../lib/data/blob/index.ts';

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN is not set (run with --env-file=.env.local after `vercel link`).');
  process.exit(2);
}
const content = JSON.parse(readFileSync(new URL('../lib/claim/demo/blush-garden-rose.json', import.meta.url), 'utf8'));
const ts = Date.now();
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
};
const errName = (e) => e?.constructor?.name ?? e?.name ?? 'Error';
// Two instances = two serverless instances (separate in-process locks).
const a = new BlobAdapter({ token });
const b = new BlobAdapter({ token });
const site = (slug, orderRef) => ({ slug, theme: 'blush-garden-rose', content, editKeyHash: 'smoke', previewKeyHash: 'smoke', orderRef });
const created = [];

try {
  // 1. slug uniqueness: 3 parallel creates on alternating instances, same slug
  const slug = `smoke-${ts}-a`;
  const r1 = await Promise.allSettled([0, 1, 2].map((i) => (i % 2 ? b : a).createSite(site(slug, `SMOKE${ts}S${i}`))));
  for (const r of r1) if (r.status === 'fulfilled') created.push(r.value.id);
  const lost1 = r1.filter((r) => r.status === 'rejected' && r.reason?.name === 'SlugTakenError').length;
  check('slug race: 1 winner, 2 SlugTakenError', created.length === 1 && lost1 === 2, `won=${created.length} slugTaken=${lost1}`);

  // 2. order uniqueness: 3 parallel creates, different slugs, same order; the losers release their slugs
  const order = `SMOKE${ts}`;
  const r2 = await Promise.allSettled([0, 1, 2].map((i) => (i % 2 ? b : a).createSite(site(`smoke-${ts}-o${i}`, order))));
  const won2 = r2.filter((r) => r.status === 'fulfilled');
  for (const r of won2) created.push(r.value.id);
  const lost2 = r2.filter((r) => r.status === 'rejected' && r.reason?.name === 'OrderRefTakenError').length;
  check('order race: 1 winner, 2 OrderRefTakenError', won2.length === 1 && lost2 === 2, `won=${won2.length} orderTaken=${lost2}`);
  const freed = await Promise.all([0, 1, 2].map((i) => a.getSiteBySlug(`smoke-${ts}-o${i}`)));
  check('order race: losing slugs released', freed.filter(Boolean).length === 1);

  const siteId = created[0];

  // 3. the server itself refuses an overwrite of an index and a stale ETag
  try {
    await put(`slugs/${slug}.json`, '{"id":"x"}', { access: 'private', token, addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json' });
    check('server refuses overwriting an existing index (allowOverwrite:false)', false, 'put succeeded');
  } catch (e) {
    check('server refuses overwriting an existing index (allowOverwrite:false)', true, errName(e));
  }
  try {
    await put(`sites/${siteId}.json`, '{}', { access: 'private', token, addRandomSuffix: false, ifMatch: '"stale-etag"', contentType: 'application/json' });
    check('server refuses a stale ETag (ifMatch)', false, 'put succeeded');
  } catch (e) {
    check('server refuses a stale ETag (ifMatch)', errName(e) === 'BlobPreconditionFailedError', errName(e));
  }

  // 4. ETag lock: 2 instances × 4 concurrent content updates; version = 1 + successful writes (no lost update)
  const writes = [];
  for (let i = 0; i < 4; i++) {
    for (const [n, inst] of [['a', a], ['b', b]]) {
      const c = structuredClone(content);
      c.host_line = `smoke ${n}${i}`;
      writes.push(inst.updateContent(siteId, c));
    }
  }
  const r4 = await Promise.allSettled(writes);
  const okW = r4.filter((r) => r.status === 'fulfilled').length;
  const conflicts = r4.filter((r) => r.status === 'rejected' && r.reason?.name === 'WriteConflictError').length;
  const other = r4.filter((r) => r.status === 'rejected' && r.reason?.name !== 'WriteConflictError');
  for (const o of other) console.log(`     other error: ${errName(o.reason)}: ${String(o.reason?.message).slice(0, 160)}`);
  const raw = await get(`sites/${siteId}.json`, { access: 'private', token, useCache: false });
  const doc = raw ? JSON.parse(await new Response(raw.stream).text()) : null;
  check('ETag lock: version = 1 + successful writes (no lost update)', doc?.version === 1 + okW && other.length === 0,
    `ok=${okW}/8 WriteConflict=${conflicts} other=${other.length} version=${doc?.version}`);
  check('ETag lock: read-back etag is usable (weak W/ form normalised)', okW > 0);

  // 5. publish + 10 parallel RSVPs on both instances, listed immediately, oldest first
  await a.publish(siteId);
  await Promise.all(Array.from({ length: 10 }, (_, i) => (i % 2 ? b : a).saveRsvp(siteId, { name: `Smoke ${i}`, attending: i % 3 !== 0, guests: i % 3 ? 2 : 0 })));
  const listed = await a.listRsvps(siteId);
  check('RSVP: 10 parallel saves listed right away', listed.length === 10, `listed=${listed.length}`);
  check('RSVP: oldest first', listed.every((r, i) => i === 0 || listed[i - 1].createdAt <= r.createdAt));

  // 6. photo: saved by one instance, read by the other; the store is private (blob URL without token refused)
  const jpg = await sharp({ create: { width: 64, height: 80, channels: 3, background: '#e8c4c4' } }).jpeg().toBuffer();
  const saved = await a.savePhoto(siteId, { bytes: new Uint8Array(jpg) });
  const back = await b.readPhoto(saved.path);
  check('photo: stored and read back identical', !!back && Buffer.compare(Buffer.from(back.bytes), jpg) === 0);
  const blobs = await list({ prefix: `media/${siteId}/`, token });
  const direct = blobs.blobs[0] ? await fetch(blobs.blobs[0].url) : null;
  check('store is private: blob URL without token refused', !!direct && !direct.ok, `HTTP ${direct?.status}`);
} catch (e) {
  check('unexpected error', false, `${errName(e)}: ${e?.message}`);
} finally {
  // 7. cleanup: every smoke site, index and file is gone
  for (const id of created) await a.deleteSite(id).catch((e) => console.log(`     cleanup error: ${errName(e)}`));
  const leftovers = [];
  for (const prefix of [`slugs/smoke-${ts}`, `orders/SMOKE${ts}`, ...created.flatMap((id) => [`sites/${id}`, `rsvps/${id}/`, `media/${id}/`])]) {
    leftovers.push(...(await list({ prefix, token })).blobs.map((x) => x.pathname));
  }
  check('cleanup: no smoke files left', leftovers.length === 0, leftovers.slice(0, 5).join(', '));
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exitCode = failed ? 1 : 0;
}
