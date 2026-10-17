// G172 — security review: regression tests for the issues it fixed (gorevler/G172-guvenlik.md).
//   1. music upload: every part counts (parts 1, 2 … under new upload ids skipped the daily limit and stayed stored)
//   2. admin sign-in: the per-address limit counts an IPv6 address as its /64 (like every other per-address limit)
//   3. orders CSV: a formula after leading spaces / line breaks is neutralised too (the couple's CSV rule)
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as musicRoute } from '../app/api/edit/[slug]/music/route.ts';
import { ADMIN_LOGIN_LIMITS } from '../lib/admin/api.ts';
import { ordersCsv, type AdminSiteSummary } from '../lib/admin/view.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { MUSIC_PART_BYTES, MUSIC_PARTS_PER_DAY } from '../lib/panel/music.ts';
import { MemoryRateLimiter, type RateLimiter, type RateLimitRule } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys } from '../lib/sites.ts';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';
const demo = (): ContentRecord => JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'themes', 'olive-ivory', 'content.demo.json'), 'utf8')) as ContentRecord;

/** A MemoryRateLimiter that also records every key it counted. */
class RecordingLimiter implements RateLimiter {
  readonly inner = new MemoryRateLimiter();
  readonly keys: string[] = [];
  async hit(key: string, rule: RateLimitRule) {
    this.keys.push(key);
    return this.inner.hit(key, rule);
  }
}

before(() => {
  process.env.PLATFORM_DATA_DIR = tmpDir('g172-data-');
  delete process.env.PLATFORM_THEMES_DIR;
  delete process.env.PLATFORM_PUBLIC_URL;
});

beforeEach(() => {
  setClaimRateLimiter(null);
});

test('music upload: every part counts against the daily part limit; over it nothing is stored', async () => {
  const limiter = new RecordingLimiter();
  setClaimRateLimiter(limiter);
  const s = await createSiteWithKeys(getDataAdapter(), { slug: 'g172-music', theme: 'olive-ivory', content: demo() });
  const send = (uploadId: string, part: number, parts: number) =>
    musicRoute(
      new Request(`${BASE}/api/edit/g172-music/music`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${s.editKey}`,
          'content-type': 'application/octet-stream',
          'x-upload-id': uploadId,
          'x-upload-part': String(part),
          'x-upload-parts': String(parts),
        },
        body: Buffer.alloc(MUSIC_PART_BYTES, 7),
      }),
      { params: Promise.resolve({ slug: 'g172-music' }) },
    );
  const uid = (n: number) => n.toString(16).padStart(32, '0');

  // a middle part without part 0 (what an abuser sends): stored, but counted
  const first = await send(uid(1), 1, 3);
  assert.equal(first.status, 200);
  const partKey = `upload:part:${s.site.id}`;
  assert.equal(limiter.keys.filter((k) => k === partKey).length, 1, 'a part other than 0 is counted');

  // the day's parts used up: the next part is refused before anything is read or stored
  for (let i = 1; i < MUSIC_PARTS_PER_DAY.limit; i++) await limiter.inner.hit(partKey, MUSIC_PARTS_PER_DAY);
  const over = await send(uid(2), 1, 3);
  assert.equal(over.status, 429);
  assert.equal(((await over.json()) as { code: string }).code, 'upload_limit');
  assert.ok(Number(over.headers.get('retry-after')) > 0);
  const stored = readdirSync(path.join(process.env.PLATFORM_DATA_DIR!, 'upload-parts', s.site.id));
  assert.deepEqual(stored, [`${uid(1)}-1`], 'the refused part was not stored');
  assert.ok(MUSIC_PARTS_PER_DAY.limit >= 60 * 3, 'room for a full day of uploads in the most parts');
});

test('admin sign-in: one IPv6 /64 shares the per-address limit', async () => {
  process.env.ADMIN_PASSWORD = 'correct horse battery staple';
  setClaimRateLimiter(new MemoryRateLimiter());
  const attempt = (ip: string) =>
    sessionPost(
      new Request('http://localhost:3000/api/admin/session', {
        method: 'POST',
        headers: { host: 'localhost:3000', origin: 'http://localhost:3000', 'content-type': 'application/json', 'x-forwarded-for': ip },
        body: JSON.stringify({ password: 'wrong' }),
      }),
    );
  for (let i = 1; i <= ADMIN_LOGIN_LIMITS.perIp.limit; i++) assert.equal((await attempt(`2001:db8:1:2::${i.toString(16)}`)).status, 401);
  // a new address of the same /64: still the same connection
  assert.equal((await attempt('2001:db8:1:2::ffff')).status, 429);
  // another /64 is a different address
  assert.equal((await attempt('2001:db8:1:3::1')).status, 401);
  delete process.env.ADMIN_PASSWORD;
});

test('orders CSV: a formula behind leading spaces or a line break is neutralised', () => {
  const site = {
    slug: 'a',
    orderRef: '1234567890',
    createdAt: '2026-10-01T00:00:00.000Z',
    ownerEmail: 'a@example.com',
    names: 'A & B',
    themeName: 'Olive & Ivory',
    state: 'draft',
    order: 'pending',
    weddingDate: null,
    place: '  =HYPERLINK("https://evil.example","x")',
    replies: 0,
    firstPublishedAt: null,
    onlineUntil: null,
    note: '\n@SUM(1+1)',
  } as unknown as AdminSiteSummary;
  const csv = ordersCsv([site], 'https://example.com');
  assert.match(csv, /,"'  =HYPERLINK/);
  assert.match(csv, /"'\n@SUM\(1\+1\)"/);
  assert.doesNotMatch(csv, /,\s*=HYPERLINK/);
});
