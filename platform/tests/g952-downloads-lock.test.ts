// G952: the panel's PDF downloads (lib/print/api.ts) stay closed while the site's Etsy order waits for the shop or was
// held (orderCheck "pending"), and for an archived website: 403 with a friendly message, checked BEFORE the daily cap
// (a refusal never uses up a PDF). The panel's Downloads card shows the locked state (components/panel/Downloads.tsx).
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as downloadRoute } from '../app/api/edit/[slug]/download/route.ts';
import { getClaimRateLimiter, setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { PDF_LIMITS } from '../lib/print/api.ts';
import { printLabel } from '../lib/print/labels.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { confirmOrder, createSiteWithKeys, holdOrder, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'https://wedding.example';

before(() => {
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('g952-dl-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
  setClaimRateLimiter(new MemoryRateLimiter());
});
after(() => setClaimRateLimiter(null));

let n = 0;
async function site(orderCheck: 'pending' | 'provisional' | 'verified' | null) {
  const slug = `g952-dl-${++n}`;
  const at = new Date().toISOString();
  const s = await createSiteWithKeys(getDataAdapter(), {
    slug,
    theme: 'olive-ivory',
    content: demoContent(),
    orderRef: `95200000${String(n).padStart(2, '0')}`,
    ownerEmail: 'ann@example.com',
    orderCheck: orderCheck ? { status: orderCheck, at, by: 'claim' } : null,
  });
  return { id: s.site.id, slug, key: s.editKey };
}

async function post(slug: string, key: string) {
  const headers = new Headers({ 'content-type': 'application/json', authorization: `Bearer ${key}` });
  return downloadRoute(new Request(`${BASE}/api/edit/${slug}/download`, { method: 'POST', headers, body: JSON.stringify({ kind: 'site' }) }), {
    params: Promise.resolve({ slug }),
  });
}

/** Uses up the daily cap: a request that gets past the lock then answers 429 (no PDF is made in this test). */
async function exhaust(id: string) {
  const limiter = getClaimRateLimiter();
  for (let i = 0; i < PDF_LIMITS.perSitePerDay.limit; i++) await limiter.hit(`pdf:site:${id}`, PDF_LIMITS.perSitePerDay);
}

test('pending order (manual check): 403 order_pending with the friendly text; after the shop confirms, the lock is gone', async () => {
  const s = await site('pending');
  await exhaust(s.id);
  for (const kind of [{ kind: 'site' }, { kind: 'invitation', size: '5x7' }]) {
    const headers = new Headers({ 'content-type': 'application/json', authorization: `Bearer ${s.key}` });
    const res = await downloadRoute(new Request(`${BASE}/api/edit/${s.slug}/download`, { method: 'POST', headers, body: JSON.stringify(kind) }), {
      params: Promise.resolve({ slug: s.slug }),
    });
    assert.equal(res.status, 403, JSON.stringify(kind));
    const body = await res.json();
    assert.equal(body.code, 'order_pending');
    assert.equal(body.message, printLabel('panel_locked_order'));
    assert.equal(body.message, 'Downloads open once your order is confirmed.');
  }
  await confirmOrder(getDataAdapter(), s.id, 'test');
  assert.equal((await post(s.slug, s.key)).status, 429, 'confirmed: past the lock (the cap answers here)');
});

test('held order (trust mode, Etsy said no / the shop held it): 403 too; provisional and verified sites are not locked', async () => {
  const held = await site('provisional');
  await publishSite(getDataAdapter(), held.id);
  await holdOrder(getDataAdapter(), held.id, { by: 'etsy', note: 'not ours' });
  await exhaust(held.id);
  const res = await post(held.slug, held.key);
  assert.equal(res.status, 403);
  assert.equal((await res.json()).code, 'order_pending');
  for (const state of ['provisional', 'verified', null] as const) {
    const s = await site(state);
    await exhaust(s.id);
    assert.equal((await post(s.slug, s.key)).status, 429, `${state}: not locked`);
  }
});

test('archived website: 403 archived; a refusal never uses up one of the day\'s PDFs', async () => {
  const s = await site('verified');
  await publishSite(getDataAdapter(), s.id);
  await setArchiveOverride(getDataAdapter(), s.id, '2020-01-01', 'test');
  const res = await post(s.slug, s.key);
  assert.equal(res.status, 403);
  const body = await res.json();
  assert.equal(body.code, 'archived');
  assert.equal(body.message, printLabel('panel_locked_archived'));
  // the refusals above did not count: the cap is still whole for a pending site that gets confirmed
  const p = await site('pending');
  for (let i = 0; i < 3; i++) assert.equal((await post(p.slug, p.key)).status, 403);
  const limiter = getClaimRateLimiter();
  const left = await limiter.hit(`pdf:site:${p.id}`, PDF_LIMITS.perSitePerDay);
  assert.equal(left.allowed, true);
  assert.equal(left.remaining, PDF_LIMITS.perSitePerDay.limit - 1);
});

test('panel: the Downloads card is shown locked (buttons off, the reason said) while the order is pending', () => {
  const share = readFileSync(path.join(PLATFORM_ROOT, 'components/panel/ShareView.tsx'), 'utf8');
  assert.match(share, /<DownloadsCard [^>]*locked=\{meta\.orderPending\}/);
  const card = readFileSync(path.join(PLATFORM_ROOT, 'components/panel/Downloads.tsx'), 'utf8');
  assert.match(card, /const disabled = locked \|\| !online \|\| busy !== null;/);
  assert.match(card, /data-downloads-locked-note[\s\S]{0,200}printLabel\('panel_locked_order'\)/);
});
