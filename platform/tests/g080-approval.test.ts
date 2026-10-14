// G080: which designs a buyer can start a website from. Approval = the sales-site design list (lib/marketing/config.ts,
// status 'live'; lib/themes/approval.ts). In production (VERCEL_ENV=production, or THEME_APPROVAL=enforce) a design in
// review is refused by POST /api/start (403 theme_in_review, nothing stored) and left out of the /start list; its demo
// stays open. Everywhere else every claimable theme can be started (theme work is not blocked).
// The /start page itself (404 + honest message) is checked in a real browser: tests/g080-browser.ts.
import { afterEach, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { GET as demoIndexRoute } from '../app/start/demo/[theme]/route.ts';
import { claimSite, CLAIM_MESSAGES } from '../lib/claim/claim.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { claimableTheme } from '../lib/claim/themes.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { MARKETING, type MarketingConfig } from '../lib/marketing/config.ts';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import {
  approvedThemeIds,
  THEME_IN_REVIEW,
  themeApproval,
  themeApprovalEnforced,
  themeOpenForClaims,
} from '../lib/themes/approval.ts';
import { offeredThemes } from '../lib/themes/offered.ts';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PROD = { VERCEL_ENV: 'production' } as const;

/** Every buyer-facing theme folder (not internal). */
const themeIds = readdirSync(path.join(PLATFORM_ROOT, 'themes'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'themes', d.name, 'theme.json'), 'utf8')) as { id: string; internal?: boolean })
  .filter((m) => !m.internal)
  .map((m) => m.id);
const approved = approvedThemeIds();
const inReview = themeIds.filter((id) => !approved.includes(id));

before(() => {
  delete process.env.PLATFORM_THEMES_DIR; // the real themes
  process.env.PLATFORM_DATA_DIR = tmpDir('g080-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  delete process.env.CLAIM_ORDER_VERIFICATION;
});

let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = { VERCEL_ENV: process.env.VERCEL_ENV, THEME_APPROVAL: process.env.THEME_APPROVAL };
  delete process.env.VERCEL_ENV;
  delete process.env.THEME_APPROVAL;
  setClaimRateLimiter(new MemoryRateLimiter());
});
afterEach(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

let n = 0;
const order = () => String(6_100_000_000 + ++n * 7919);
async function post(theme: string, names: [string, string]) {
  const orderNumber = order();
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${n + 1}` },
      body: JSON.stringify({ theme, orderNumber, email: 'g080@example.test', names, slug: '', website: '' }),
    }),
  );
  return { status: res.status, body: (await res.json()) as Record<string, any>, orderNumber };
}

test('one source: approved = the sales-site designs with status "live" (today 01, 03, 05 — G082 — and 02 — G083; 04 in review)', () => {
  assert.deepEqual(approved, liveDesigns().map((d) => d.id));
  assert.ok(approved.includes('olive-ivory') && approved.includes('blush-garden-rose'), approved.join());
  assert.ok(approved.includes('mediterranean-lemon'), `G082: 05 is approved (${approved.join()})`);
  assert.ok(approved.includes('dusty-blue-champagne'), `G083: 02 is approved (${approved.join()})`);
  for (const id of ['vintage-airmail-love-letter']) {
    if (themeIds.includes(id) && !approved.includes(id)) assert.equal(themeApproval(id), 'review', id);
  }
  // 'coming' and not-listed designs are in review; a fixture config shows the rule without depending on today's list
  const cfg = { ...MARKETING, designs: [
    { ...MARKETING.designs[0], id: 'a', status: 'live' },
    { ...MARKETING.designs[0], id: 'b', status: 'coming' },
  ] } as MarketingConfig;
  assert.equal(themeApproval('a', cfg), 'approved');
  assert.equal(themeApproval('b', cfg), 'review');
  assert.equal(themeApproval('c', cfg), 'review');
  assert.deepEqual(approvedThemeIds(cfg), ['a']);
});

test('every approved design is a real, claimable theme (the sales site never lists a design /start refuses)', async () => {
  for (const id of approved) assert.ok(await claimableTheme(id), id);
});

test('enforced only in production: VERCEL_ENV=production or THEME_APPROVAL=enforce', () => {
  assert.equal(themeApprovalEnforced({}), false);
  assert.equal(themeApprovalEnforced({ VERCEL_ENV: 'preview' }), false);
  assert.equal(themeApprovalEnforced({ VERCEL_ENV: 'development' }), false);
  assert.equal(themeApprovalEnforced({ NODE_ENV: 'production' }), false, 'next start alone is not production');
  assert.equal(themeApprovalEnforced(PROD), true);
  assert.equal(themeApprovalEnforced({ THEME_APPROVAL: 'enforce' }), true);
  assert.equal(themeOpenForClaims('no-such-design', { env: {} }), true);
  assert.equal(themeOpenForClaims('no-such-design', { env: PROD }), false);
  for (const id of approved) assert.equal(themeOpenForClaims(id, { env: PROD }), true, id);
});

test('production: an approved design is claimed (201), a design in review gets 403 theme_in_review and nothing is stored', async () => {
  assert.ok(inReview.length > 0, 'no theme in review to test with');
  process.env.VERCEL_ENV = 'production';
  const ok = await post(approved[0], ['Avery', 'Jordan']);
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  for (const id of inReview) {
    if (!(await claimableTheme(id))) continue; // a theme without demo content is 404 theme_unavailable anyway
    const res = await post(id, ['Rowan', 'Sage']);
    assert.equal(res.status, 403, `${id}: ${JSON.stringify(res.body)}`);
    assert.equal(res.body.code, 'theme_in_review');
    assert.equal(res.body.message, THEME_IN_REVIEW.message);
    assert.equal(res.body.slug, undefined);
    assert.equal((await getDataAdapter().findSitesByOrderRef(res.orderNumber)).length, 0, `${id}: no site stored`);
  }
  // THEME_APPROVAL=enforce does the same outside Vercel
  delete process.env.VERCEL_ENV;
  process.env.THEME_APPROVAL = 'enforce';
  assert.equal((await post(inReview[0], ['Mia', 'Leo'])).status, 403);
});

test('not production (local, preview, tests): every claimable theme can be started, so theme work is not blocked', async () => {
  process.env.VERCEL_ENV = 'preview';
  for (const id of inReview) {
    if (!(await claimableTheme(id))) continue;
    const res = await post(id, ['Ivy', 'Noah']);
    assert.equal(res.status, 201, `${id}: ${JSON.stringify(res.body)}`);
  }
});

test('the /start list offers only approved designs in production, every claimable one elsewhere', async () => {
  const prod = (await offeredThemes(PROD)).map((t) => t.id);
  assert.deepEqual([...prod].sort(), [...approved].sort());
  const dev = (await offeredThemes({})).map((t) => t.id);
  for (const id of themeIds) if (await claimableTheme(id)) assert.ok(dev.includes(id), id);
});

test('production: the demo of a design in review stays open (/start/demo/<theme>)', async () => {
  process.env.VERCEL_ENV = 'production';
  for (const id of inReview) {
    if (!(await claimableTheme(id))) continue;
    const res = await demoIndexRoute(new Request(`${BASE}/start/demo/${id}`), { params: Promise.resolve({ theme: id }) });
    assert.equal(res.status, 200, id);
  }
});

test('claimSite gate reads the env it is given (approvalEnv) before any field or order check', async () => {
  const res = await claimSite(
    { adapter: getDataAdapter(), origin: BASE, ip: '192.0.2.9', approvalEnv: PROD },
    { theme: inReview[0], orderNumber: 'not a number', email: '', names: [] },
  );
  assert.equal(res.status, 403);
  assert.equal(res.body.code, 'theme_in_review');
  assert.equal(CLAIM_MESSAGES.theme_in_review, THEME_IN_REVIEW.message);
});
