// G061: marketing pages share the root with couple sites (/<slug>). A static segment wins over /[slug], so a couple
// site with a marketing name would never open. Every first segment the marketing site (and the platform) uses must be
// a reserved slug — read from the real app/ and public/ folders, so a new page without a reservation fails here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { GET as getSite } from '../app/[slug]/route.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { MARKETING_SEGMENTS } from '../lib/marketing/site.ts';
import { isAvailableSlugShape, isReservedSlug, isValidSlugFormat, slugify } from '../lib/slug.ts';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

/** First URL segments served by app/: static folders, plus those inside route groups "(name)". */
function appSegments(dir = path.join(PLATFORM_ROOT, 'app')): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('(') && e.name.endsWith(')')) out.push(...appSegments(path.join(dir, e.name)));
    else if (!e.name.startsWith('[') && !e.name.startsWith('_')) out.push(e.name);
  }
  return out;
}

test('every static first segment of app/ (route groups included) is a reserved slug', () => {
  const segments = appSegments();
  for (const must of ['designs', 'guides', 'how-it-works', 'features', 'pricing', 'faq', 'about', 'contact', 'privacy', 'robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt', 'edit', 'start', 'api', 'themes', 'media']) {
    assert.ok(segments.includes(must), `app/ should serve /${must}`);
  }
  for (const s of segments) assert.ok(isReservedSlug(s), `"${s}" is served by app/ but is not in RESERVED_SLUGS (lib/slug.ts)`);
});

test('every top-level entry of public/ and every MARKETING_SEGMENTS name is reserved', () => {
  for (const e of readdirSync(path.join(PLATFORM_ROOT, 'public'))) {
    assert.ok(isReservedSlug(e), `public/${e} is served at /${e} but is not a reserved slug`);
  }
  for (const s of MARKETING_SEGMENTS) assert.ok(isReservedSlug(s), s);
});

test('docs/14 §5.4 list is reserved; site slugs from real names stay available', () => {
  const docs145 = ['designs', 'design', 'guides', 'guide', 'how-it-works', 'features', 'examples', 'gallery', 'reviews', 'compare', 'checkout', 'buy', 'cart', 'order', 'orders', 'gift', 'search', 'feed', 'rss', 'sitemap', 'llms', 'opengraph-image', 'twitter-image', 'icon', 'apple-icon', 'save-the-date', 'wedding-websites', 'refund', 'refunds', 'cookies', 'accessibility', 'about', 'contact', 'faq', 'privacy', 'pricing', 'blog', 'help', 'terms'];
  for (const s of docs145) {
    assert.ok(isReservedSlug(s), s);
    if (isValidSlugFormat(s)) assert.equal(isAvailableSlugShape(s), false, s);
  }
  for (const ok of ['clara-and-julian', 'starlight-and-sam', 'designer-and-dan', 'guideon-and-may', slugify('Avery & Jordan')]) {
    assert.ok(isAvailableSlugShape(ok), ok);
  }
});

test('design ids are plain path segments under /designs (no slashes, valid theme ids)', () => {
  for (const d of MARKETING.designs) assert.match(d.id, /^[a-z0-9][a-z0-9-]*$/, d.id);
});

test('the site route answers 404 for marketing names (no couple site can be served there)', async () => {
  process.env.PLATFORM_DATA_DIR = tmpDir('mk-slug-');
  for (const s of ['designs', 'guides', 'how-it-works', 'features']) {
    const res = await getSite(new Request(`http://localhost:3000/${s}`), { params: Promise.resolve({ slug: s }) });
    assert.equal(res.status, 404, s);
  }
});
