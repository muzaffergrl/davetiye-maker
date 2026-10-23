// G061 (docs/14 §10): one config with visible placeholders; launch is blocked while anything is undecided; every live
// design is a real theme with a demo and real captured screens.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { claimableTheme } from '../lib/claim/themes.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { DESIGN_COPY, liveDesigns } from '../lib/marketing/designs.ts';
import { assertLaunchReady, findPlaceholders, hasPlaceholder, isPlaceholder, launchProblems, real, realEtsyUrl, realPrice } from '../lib/marketing/placeholders.ts';
import assets from '../lib/marketing/assets.json' with { type: 'json' };
import { checkManifest, type AssetManifest } from '../scripts/marketing-assets.ts';
import { PLATFORM_ROOT } from './helpers.ts';
import { readyConfig } from './marketing-helpers.ts';

test('placeholder detection', () => {
  for (const p of ['[BRAND]', '[PRICE]', '[SUPPORT EMAIL]', '[ETSY LISTING URL]', '[BUNDLE OFFER: G062]', ' [DOMAIN] ']) assert.ok(isPlaceholder(p), p);
  for (const p of ['Brand', '[brand]', '$29', '', 'https://[DOMAIN]']) assert.ok(!isPlaceholder(p), p);
  assert.ok(hasPlaceholder('https://[DOMAIN]/x'));
  assert.ok(hasPlaceholder('Contact [BRAND] at [SUPPORT EMAIL]'));
  assert.ok(!hasPlaceholder('[see the FAQ](/faq)'));
  assert.equal(real('[BRAND]'), null);
  assert.equal(real(' Seal ' ), 'Seal');
  assert.deepEqual(findPlaceholders({ a: '[X]', b: ['ok', 'y [Y] z'] }), ['a: [X]', 'b[1]: [Y]']);
  assert.equal(realPrice('[PRICE]'), null);
  assert.equal(realPrice('0'), null);
  assert.equal(realPrice('29.4'), '29.4');
  assert.equal(realPrice('$29'), null);
  assert.equal(realEtsyUrl('https://www.etsy.com/listing/1/x'), 'https://www.etsy.com/listing/1/x');
  assert.equal(realEtsyUrl('http://www.etsy.com/listing/1/x'), null);
  assert.equal(realEtsyUrl('https://etsy.com.evil.example/listing'), null);
  assert.equal(realEtsyUrl('[ETSY LISTING URL]'), null);
});

test('launch gate: a launched config has no problems; an unlaunched one lists every undecided field', () => {
  if (MARKETING.launched) {
    assert.deepEqual(launchProblems(MARKETING), []);
    return;
  }
  const problems = launchProblems({ ...MARKETING, launched: true });
  const expect: Array<[boolean, string]> = [
    [isPlaceholder(MARKETING.brand.name), 'brand.name'],
    [isPlaceholder(MARKETING.domain), 'domain'],
    [isPlaceholder(MARKETING.support.email), 'support.email'],
    [isPlaceholder(MARKETING.policies.refund), 'policies.refund'],
    [!MARKETING.verified.editRights, 'verified.editRights'],
    [!MARKETING.verified.archive, 'verified.archive'],
    [!MARKETING.verified.privacyText, 'verified.privacyText'],
    [!MARKETING.verified.orderCheck, 'verified.orderCheck'],
    [MARKETING.designs.some((d) => d.status === 'live' && isPlaceholder(d.price)), 'price'],
    [MARKETING.designs.some((d) => d.status === 'live' && isPlaceholder(d.etsyListingUrl)), 'etsyListingUrl'],
  ];
  for (const [undecided, needle] of expect) {
    if (undecided) assert.ok(problems.some((p) => p.includes(needle)), `missing problem for ${needle}: ${problems.join(' | ')}`);
  }
  assert.doesNotThrow(() => assertLaunchReady(MARKETING)); // not launched: no throw
  assert.throws(() => assertLaunchReady({ ...MARKETING, launched: true }), /not ready/);
});

test('first sales wave = designs 01–20 (owner, 2026-10-23): launchProblems lists exactly their 20 Etsy links + the open verified flags', () => {
  const FIRST_WAVE = [
    'olive-ivory', 'dusty-blue-champagne', 'blush-garden-rose', 'vintage-airmail-love-letter', 'mediterranean-lemon',
    'art-deco-black-tie', 'burgundy-velvet-autumn', 'winter-evergreen', 'lavender-provence', 'tuscan-vineyard',
    'boho-pampas-terracotta', 'tropical-destination', 'enchanted-forest-storybook', 'ivory-lace-pearls', 'cherry-blossom-spring',
    'sunflower-rustic-barn', 'emerald-gold-estate', 'wildflower-meadow-vellum', 'midnight-garden', 'coastal-seaside',
  ];
  const live = MARKETING.designs.filter((d) => d.status === 'live').map((d) => d.id);
  assert.deepEqual([...live].sort(), [...FIRST_WAVE].sort());
  for (const id of ['crimson-rose-atelier', 'ivory-pearl-atelier']) {
    const d = MARKETING.designs.find((x) => x.id === id);
    assert.equal(d?.status, 'preview', `${id}: in the catalogue as coming soon, not on sale`);
    assert.equal(d?.price, '1190', `${id}: K49 launch price`);
  }
  assert.equal(MARKETING.verified.realDevices, true, 'owner tested on real phones (2026-10-23)');
  const problems = launchProblems(MARKETING, { CLAIM_ORDER_VERIFICATION: 'trust' });
  const links = problems.filter((p) => /^designs\.[a-z0-9-]+\.etsyListingUrl is not a real Etsy URL$/.test(p));
  assert.deepEqual(links.map((p) => p.split('.')[1]).sort(), [...FIRST_WAVE].sort());
  const flags = problems.filter((p) => p.startsWith('verified.'));
  const open = (Object.entries(MARKETING.verified) as Array<[string, boolean]>).filter(([k, v]) => !v && k !== 'realDevices').map(([k]) => k);
  assert.deepEqual(flags.map((p) => p.split(' ')[0].replace('verified.', '')).sort(), open.sort());
  assert.ok(!problems.some((p) => /realDevices|crimson-rose-atelier|ivory-pearl-atelier/.test(p)), problems.join(' | '));
  assert.equal(problems.length, links.length + flags.length, problems.join(' | '));
});

test('a fully decided config launches; one leftover placeholder or a vercel.app origin blocks it', () => {
  assert.deepEqual(launchProblems(readyConfig()), []);
  assert.doesNotThrow(() => assertLaunchReady(readyConfig()));
  const p = readyConfig();
  p.designs.find((d) => d.status === 'live')!.price = '[PRICE]';
  assert.throws(() => assertLaunchReady(p), /price/);
  assert.ok(launchProblems(readyConfig({ siteUrl: 'https://davetiye-platform-five.vercel.app' })).some((x) => x.includes('not the brand domain')));
  const utm = readyConfig();
  utm.designs.find((d) => d.status === 'live')!.etsyListingUrl += '&utm_source=site';
  assert.ok(launchProblems(utm).some((x) => x.includes('utm_')));
  assert.ok(launchProblems(readyConfig({ support: { email: 'not-an-email', responseTime: '24 hours' } })).some((x) => x.includes('support.email')));
});

test('live designs: copy exists, the theme exists with the same name, a buyer can start it and its demo loads', async () => {
  const live = liveDesigns();
  assert.ok(live.length >= 2);
  for (const d of live) {
    assert.ok(DESIGN_COPY[d.id], d.id);
    const theme = await claimableTheme(d.id);
    assert.ok(theme, `${d.id}: /start cannot start this theme`);
    assert.equal(theme!.name, d.name, `${d.id}: config name must equal theme.json name`);
    assert.ok(existsSync(path.join(PLATFORM_ROOT, 'themes', d.id, 'img/og-1200x630.jpg')), `${d.id}: share image`);
    const c = DESIGN_COPY[d.id];
    assert.ok(c.metaDescription.length >= 120 && c.metaDescription.length <= 160, `${d.id} meta description ${c.metaDescription.length}`);
    for (const h of c.palette) assert.match(h.hex, /^#[0-9A-Fa-f]{6}$/);
  }
  for (const d of MARKETING.designs.filter((x) => x.status !== 'live')) {
    assert.ok(!live.some((l) => l.id === d.id), `${d.id} is not live and must not be listed`);
  }
});

test('asset manifest: every screen, poster and video file exists; videos stay small', () => {
  const manifest = assets as unknown as AssetManifest;
  assert.deepEqual(checkManifest(manifest), []);
  for (const d of liveDesigns()) {
    const m = manifest.designs[d.id];
    assert.ok(m, `${d.id} has no captured screens (run node scripts/marketing-assets.ts)`);
    for (const k of ['envelope', 'home', 'story', 'details', 'rsvp', 'form']) assert.ok(m.screens[k], `${d.id}.${k}`);
    assert.ok(m.opening && m.opening.bytes <= 1_500_000, `${d.id} opening.mp4`);
  }
  for (const k of ['panel', 'replies', 'start', 'preview', 'share', 'crop', 'questions']) assert.ok(manifest.panel[k], `panel.${k}`);
});
