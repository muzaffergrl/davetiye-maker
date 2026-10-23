// G953: a guest's RSVP is never lost to a shared counter. On the blob store every limit is a conditional write that can
// lose a race with other guests answering at the same moment (WriteConflictError) or hit a passing storage error: the
// counters are best effort, the reply is stored. The duplicate check reads only the replies of its window (blob: one
// listing, the time is in the file name), not every reply of the site on every submit.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync } from 'node:fs';
import path from 'node:path';
import type { ContentRecord } from '../lib/content/types.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { WriteConflictError } from '../lib/data/types.ts';
import { DEFAULT_RSVP_LIMITS, DUPLICATE_WINDOW_MS } from '../lib/rsvp/config.ts';
import { submitRsvp } from '../lib/rsvp/guest.ts';
import { MemoryRateLimiter, type RateLimiter, type RateLimitRule } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

before(() => {
  const themes = tmpDir('g953-rsvp-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g953-rsvp-data-');
});

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
function content(): ContentRecord {
  const c = demoContent();
  c.rsvp.deadline = isoDay(300);
  c.date = isoDay(400);
  return c;
}

/** A limiter whose shared counter keeps losing the race (blob: every conditional write retried, then given up). */
class ConflictLimiter implements RateLimiter {
  readonly tried: string[] = [];
  readonly fails: (key: string) => boolean;
  constructor(fails: (key: string) => boolean) {
    this.fails = fails;
  }
  async hit(key: string, rule: RateLimitRule) {
    this.tried.push(key);
    if (this.fails(key)) throw new WriteConflictError(`counter ${key}`);
    return { allowed: true, remaining: rule.limit - 1, retryAfterMs: 0 };
  }
}

test('every counter conflicting: the reply is still stored and counted (not held), the guest gets the normal answer', async () => {
  const adapter = getDataAdapter();
  const { site } = await createSiteWithKeys(adapter, { slug: 'g953-conflict', theme: '_sample', content: content() });
  await publishSite(adapter, site.id);
  const limiter = new ConflictLimiter(() => true);
  const res = await submitRsvp({ adapter, limiter, ip: '198.51.100.7' }, 'g953-conflict', { name: 'Mara Quinn', attending: 'yes', guests: 2 });
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  const list = await adapter.listRsvps(site.id);
  assert.deepEqual(list.map((r) => [r.name, r.guests, r.held ?? false]), [['Mara Quinn', 2, false]]);
  assert.ok(limiter.tried.some((k) => k.startsWith('rsvp:site:')), 'the volume counters were tried');
});

test('one counter conflicting (the per-site one, the busiest key): the reply is stored', async () => {
  const adapter = getDataAdapter();
  const { site } = await createSiteWithKeys(adapter, { slug: 'g953-one', theme: '_sample', content: content() });
  await publishSite(adapter, site.id);
  const limiter = new ConflictLimiter((k) => k.startsWith('rsvp:site:'));
  for (const name of ['Ann Lee', 'Bo Park', 'Cy Diaz']) {
    assert.equal((await submitRsvp({ adapter, limiter, ip: '198.51.100.8' }, 'g953-one', { name, attending: 'no' })).status, 200);
  }
  assert.equal((await adapter.listRsvps(site.id)).length, 3);
});

test('the limits still work when the counters do: over the per-site budget replies are held, not lost', async () => {
  const adapter = getDataAdapter();
  const { site } = await createSiteWithKeys(adapter, { slug: 'g953-limits', theme: '_sample', content: content() });
  await publishSite(adapter, site.id);
  const limiter = new MemoryRateLimiter();
  const limits = { ...DEFAULT_RSVP_LIMITS, perSite: { limit: 1, windowMs: 60_000 } };
  await submitRsvp({ adapter, limiter, limits, ip: '198.51.100.9' }, 'g953-limits', { name: 'First Guest', attending: 'no' });
  await submitRsvp({ adapter, limiter, limits, ip: '198.51.100.10' }, 'g953-limits', { name: 'Second Guest', attending: 'no' });
  assert.deepEqual((await adapter.listRsvps(site.id)).map((r) => [r.name, r.held ?? false]), [['First Guest', false], ['Second Guest', true]]);
});

test('blob: the duplicate check reads only the replies of its window, and still catches a double tap', async () => {
  const fake = new FakeBlobStore();
  let clock = Date.parse('2026-10-23T10:00:00Z');
  const blob = new BlobAdapter({ token: fake.token, client: fake.client(), now: () => clock });
  const { site } = await createSiteWithKeys(blob, { slug: 'g953-recent', theme: '_sample', content: content() });
  await publishSite(blob, site.id);
  const limiter = new MemoryRateLimiter();
  const send = (name: string, ip: string) => submitRsvp({ adapter: blob, limiter, ip, now: new Date(clock) }, 'g953-recent', { name, attending: 'no' });
  for (let i = 0; i < 12; i++) {
    assert.equal((await send(`Old Guest ${i}`, `198.51.100.${20 + i}`)).status, 200);
    clock += 60_000;
  }
  clock += DUPLICATE_WINDOW_MS + 60_000; // the 12 older replies are outside the window now
  assert.equal((await blob.listRecentRsvps!(site.id, clock - DUPLICATE_WINDOW_MS)).length, 0);
  const prefix = `rsvps/${site.id}/`;
  const before = fake.calls.length;
  assert.equal((await send('New Guest', '198.51.100.50')).status, 200);
  const reads = fake.calls.slice(before).filter((c) => c.op === 'get' && (c.pathname ?? '').startsWith(prefix));
  assert.equal(reads.length, 0, 'no old reply was read for the duplicate check');
  const again = fake.calls.length;
  assert.equal((await send('New Guest', '198.51.100.50')).status, 200, 'a double tap gets the normal answer');
  const reads2 = fake.calls.slice(again).filter((c) => c.op === 'get' && (c.pathname ?? '').startsWith(prefix));
  assert.equal(reads2.length, 1, 'only the one recent reply was read');
  const all = await blob.listRsvps(site.id);
  assert.equal(all.length, 13, 'stored once');
  assert.deepEqual(
    (await blob.listRecentRsvps!(site.id, clock - DUPLICATE_WINDOW_MS)).map((r) => r.name),
    ['New Guest'],
  );
});
