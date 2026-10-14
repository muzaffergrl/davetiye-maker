import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { DEFAULT_RSVP_LIMITS } from '../lib/rsvp/config.ts';
import { submitRsvp } from '../lib/rsvp/guest.ts';
import { getRsvpRateLimiter, MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent } from './helpers.ts';

afterEach(() => setRsvpRateLimiter(null));

function instances() {
  const fake = new FakeBlobStore();
  return [0, 1].map(() => new BlobAdapter({ token: fake.token, client: fake.client(), retryDelayMs: () => 1 }));
}

test('G085: RSVP default enforces the same request limit across separate server adapters and a cold start', async () => {
  setRsvpRateLimiter(null);
  const [one, two] = instances();
  const content = demoContent();
  content.date = new Date(Date.now() + 400 * 86400000).toISOString().slice(0, 10);
  content.rsvp.deadline = new Date(Date.now() + 300 * 86400000).toISOString().slice(0, 10);
  const created = await createSiteWithKeys(one, { slug: 'shared-rsvp-site', theme: '_sample', content });
  await publishSite(one, created.site.id);
  const limits = { ...DEFAULT_RSVP_LIMITS, perIp: { limit: 3, windowMs: 60000 } };
  const statuses = [];
  for (let i = 0; i < 4; i++) {
    if (i === 3) setRsvpRateLimiter(null); // loss of process memory must not reset the stored window
    const result = await submitRsvp({ adapter: i % 2 ? two : one, limits, ip: '203.0.113.91' }, 'shared-rsvp-site',
      { name: 'Guest ' + i, attending: 'no' });
    statuses.push(result.status);
  }
  assert.deepEqual(statuses, [200, 200, 200, 429]);
  assert.equal((await one.listRsvps(created.site.id)).length, 3);
});

test('G085: simultaneous hits on separate instances share one atomic count', async () => {
  setRsvpRateLimiter(null);
  const [one, two] = instances();
  const result = await Promise.all(Array.from({ length: 6 }, (_, i) =>
    getRsvpRateLimiter(i % 2 ? two : one).hit('rsvp:ip:parallel', { limit: 3, windowMs: 60000 })));
  assert.equal(result.filter(r => r.allowed).length, 3);
  assert.deepEqual(result.map(r => r.remaining).sort(), [0, 0, 0, 0, 1, 2]);
});

test('G085: local fallback is cached and explicit overrides still win over shared storage', () => {
  setRsvpRateLimiter(null);
  const local = getRsvpRateLimiter();
  assert.ok(local instanceof MemoryRateLimiter);
  assert.equal(getRsvpRateLimiter({}), local);
  const override = new MemoryRateLimiter();
  setRsvpRateLimiter(override);
  const [one] = instances();
  assert.equal(getRsvpRateLimiter(one), override);
  setRsvpRateLimiter(null);
  assert.notEqual(getRsvpRateLimiter(one), override);
});
