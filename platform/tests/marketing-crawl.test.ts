// G061 (docs/14 §9.4, §9.5, §9.12): robots.txt, sitemap.xml, llms.txt / llms-full.txt and their route handlers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GET as getLlmsFull } from '../app/(marketing)/llms-full.txt/route.ts';
import { GET as getLlms } from '../app/(marketing)/llms.txt/route.ts';
import { GET as getRobots } from '../app/(marketing)/robots.txt/route.ts';
import { GET as getSitemap } from '../app/(marketing)/sitemap.xml/route.ts';
import { MARKETING } from '../lib/marketing/config.ts';
import { llmsFullTxt, llmsTxt, robotsTxt, SEARCH_BOTS, sitemapEntries, sitemapXml, TRAINING_BOTS } from '../lib/marketing/crawl.ts';
import { catalogDesigns } from '../lib/marketing/designs.ts';
import { faqItems } from '../lib/marketing/faq.ts';
import { LANGS, PREFIXED_LANGS } from '../lib/marketing/i18n.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { corePages, MARKETING_SEGMENTS } from '../lib/marketing/site.ts';
import { COUPLE_SITE_ROBOTS } from '../lib/site/render.ts';
import { isReservedSlug, isValidSlugFormat } from '../lib/slug.ts';
import { readyConfig } from './marketing-helpers.ts';

/** G085: every real design is live now; an unreleased ('coming') design for the "never mentioned" checks. */
const withComing = (cfg: ReturnType<typeof readyConfig>) => ({
  ...cfg,
  designs: [...cfg.designs, { ...cfg.designs[0], id: 'unreleased-fixture', name: 'Unreleased Fixture', status: 'coming' as const }],
});

/** Google-style robots matching for one user agent group: longest match wins, Allow wins ties; * and $ supported. */
function allowed(robots: string, agent: string, urlPath: string): boolean {
  const groups: Array<{ agents: string[]; rules: Array<{ allow: boolean; pattern: string }> }> = [];
  let cur: (typeof groups)[number] | null = null;
  let lastWasAgent = false;
  for (const raw of robots.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const [k, ...rest] = line.split(':');
    const key = k.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (key === 'allow' || key === 'disallow')) cur.rules.push({ allow: key === 'allow', pattern: val });
    }
  }
  const group = groups.find((g) => g.agents.includes(agent.toLowerCase())) ?? groups.find((g) => g.agents.includes('*'));
  if (!group) return true;
  let best: { allow: boolean; len: number } | null = null;
  for (const r of group.rules) {
    if (!r.pattern) continue;
    const re = new RegExp('^' + r.pattern.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$|\$$/, '$'));
    if (re.test(urlPath) && (!best || r.pattern.length > best.len || (r.pattern.length === best.len && r.allow))) best = { allow: r.allow, len: r.pattern.length };
  }
  return best ? best.allow : true;
}

test('robots: marketing pages and couple sites open; editor, API, buyer start, demos and photos closed — for every bot group', () => {
  const robots = robotsTxt(MARKETING);
  for (const agent of ['*', ...SEARCH_BOTS, ...TRAINING_BOTS]) {
    for (const ok of ['/', '/designs', '/designs/olive-ivory', '/guides/how-to-make-a-wedding-website', '/faq', '/llms.txt', '/themes/olive-ivory/img/og-1200x630.jpg', '/marketing/designs/olive-ivory/envelope-640.webp']) {
      assert.ok(allowed(robots, agent, ok), `${agent} should be allowed ${ok}`);
    }
    // Couple websites share the root: search engines may read them (they send X-Robots-Tag: noindex), training bots not.
    for (const couple of ['/starlight-and-sam', '/clara-and-julian', '/clara-and-julian/home', '/clara-and-julian/rsvp']) {
      const training = (TRAINING_BOTS as readonly string[]).includes(agent);
      assert.equal(allowed(robots, agent, couple), !training, `${agent} ${training ? 'must not' : 'should'} read ${couple}`);
    }
    for (const no of ['/api/rsvp/x', '/edit/clara-and-julian?k=secret', '/start', '/start?theme=olive-ivory', '/start/demo/olive-ivory', '/media/abc.jpg']) {
      assert.ok(!allowed(robots, agent, no), `${agent} should be blocked from ${no}`);
    }
  }
  assert.ok(!/^Disallow: \/start\s*$/m.test(robots), 'a bare /start prefix would also block couple slugs like /starlight-and-sam');
  assert.ok(!/Sitemap:/.test(robots), 'no sitemap line before launch');
});

test('robots: training bots read every marketing URL, but no couple slug — not even one that starts like a marketing page', () => {
  const cfg = readyConfig();
  const robots = robotsTxt(cfg);
  const guides = loadGuides();
  const marketing = [
    ...sitemapEntries(guides, cfg).map((e) => new URL(e.loc).pathname),
    ...MARKETING_SEGMENTS.filter((s) => /\.(txt|xml)$/.test(s)).map((s) => `/${s}`),
  ];
  const couples = ['/pricing-and-paul', '/faqir-and-lena', '/about-time-we-wed', '/designs-by-ann', '/guidesandgrooms', '/contact-jo-and-li', '/marketingmay', '/themesong-and-sam'];
  for (const c of couples) assert.ok(isValidSlugFormat(c.slice(1)) && !isReservedSlug(c.slice(1)), `${c} is a slug a couple can choose`);
  for (const bot of TRAINING_BOTS) {
    for (const p of marketing) assert.ok(allowed(robots, bot, p), `${bot} should read ${p}`);
    for (const c of couples) assert.ok(!allowed(robots, bot, c), `${bot} must not read the couple website ${c}`);
    for (const p of ['/start', '/start/demo/olive-ivory', '/edit/x', '/api/rsvp/x', '/media/a.jpg']) assert.ok(!allowed(robots, bot, p), `${bot}: ${p}`);
  }
  for (const c of couples) assert.ok(allowed(robots, 'Googlebot', c), `search engines still read ${c} (and see its noindex header)`);
  assert.match(robots, /^# Couple websites \(\/<names>\) send "X-Robots-Tag: noindex"/m, 'the comment says what couple pages really send');
  assert.equal(COUPLE_SITE_ROBOTS, 'noindex');
});

test('robots: decisions in config — training bots can be closed; sitemap line after launch', () => {
  const closed = robotsTxt({ ...MARKETING, aiTrainingBots: 'disallow' });
  for (const bot of TRAINING_BOTS) assert.ok(!allowed(closed, bot, '/designs'), bot);
  for (const bot of SEARCH_BOTS) assert.ok(allowed(closed, bot, '/designs'), `${bot} stays open`);
  const launched = robotsTxt(readyConfig());
  assert.match(launched, /^Sitemap: https:\/\/example\.com\/sitemap\.xml$/m);
});

test('sitemap: empty until launch; then every page, catalogue design (live + preview) and guide with a real lastmod', () => {
  const guides = loadGuides();
  assert.doesNotMatch(sitemapXml(guides, MARKETING), /<url>/);
  const cfg = withComing(readyConfig());
  const xml = sitemapXml(guides, cfg);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = [...corePages(cfg).map((p) => p.path), ...catalogDesigns(cfg).map((d) => `/designs/${d.id}`), ...guides.map((g) => g.path)];
  // G144: every page in five languages (English at the root, the others under /tr, /es, /de, /fr)
  assert.equal(locs.length, expected.length * LANGS.length);
  for (const p of expected) {
    assert.ok(locs.includes(`https://example.com${p === '/' ? '/' : p}`), p);
    for (const l of PREFIXED_LANGS) assert.ok(locs.includes(`https://example.com/${l}${p === '/' ? '' : p}`), `${l} ${p}`);
  }
  // each <url> lists all five languages and x-default (English) as xhtml:link alternates
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9" xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml">/);
  for (const block of xml.split('<url>').slice(1)) {
    const langs = [...block.matchAll(/hreflang="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual(langs, [...LANGS, 'x-default']);
  }
  assert.match(xml, /<loc>https:\/\/example\.com\/tr\/designs<\/loc>[\s\S]*?hreflang="de" href="https:\/\/example\.com\/de\/designs"/);
  for (const m of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) assert.match(m[1], /^\d{4}-\d{2}-\d{2}$/);
  assert.doesNotMatch(xml, /changefreq|priority/);
  assert.ok(!locs.some((l) => /\/start|\/edit|\/api|unreleased-fixture/.test(l)), 'no private, demo or unreleased URLs');
  // G191: a preview design ("Coming soon on Etsy") has an indexable page linked from /designs, so it is listed too
  const preview = cfg.designs.find((d) => d.status === 'preview');
  if (preview) assert.ok(locs.includes(`https://example.com/designs/${preview.id}`), `preview design ${preview.id}`);
});

test('llms.txt: llmstxt.org shape; every link is a sitemap URL; llms-full.txt carries designs, FAQ and every guide', () => {
  const guides = loadGuides();
  const cfg = readyConfig();
  const txt = llmsTxt(guides, cfg);
  assert.match(txt, /^# Test Brand\n\n> /);
  assert.match(txt, /## Designs\n/);
  assert.match(txt, /Not included: /);
  const sitemap = new Set(sitemapEntries(guides, cfg).map((e) => e.loc));
  const links = [...txt.matchAll(/\]\((https?:[^)]+)\)/g)].map((m) => m[1]);
  assert.ok(links.length >= 15);
  for (const l of links) {
    if (l.endsWith('/llms-full.txt')) continue;
    assert.ok(sitemap.has(l), `llms.txt link not in sitemap: ${l}`);
  }
  const full = llmsFullTxt(guides, cfg);
  for (const g of guides) assert.ok(full.includes(`# ${g.title}`), g.slug);
  for (const it of faqItems(cfg)) assert.ok(full.includes(`**${it.q}**`), it.id);
  assert.ok(!/\]\(\/[a-z]/.test(full), 'internal links are absolute in llms-full.txt');
  const coming = withComing(cfg);
  assert.ok(!llmsTxt(guides, coming).includes('Unreleased Fixture') && !llmsFullTxt(guides, coming).includes('Unreleased Fixture'), 'designs that are not live are not mentioned');
});

test('route handlers answer with the right content types and noindex for llms files before launch', async () => {
  const robots = getRobots();
  assert.equal(robots.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.match(await robots.text(), /Disallow: \/api\//);
  const sitemap = getSitemap();
  assert.equal(sitemap.headers.get('content-type'), 'application/xml; charset=utf-8');
  assert.match(await sitemap.text(), /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"[^>]*>/);
  const llms = getLlms();
  assert.equal(llms.headers.get('content-type'), 'text/markdown; charset=utf-8');
  if (!MARKETING.launched) assert.equal(llms.headers.get('x-robots-tag'), 'noindex');
  assert.match(await llms.text(), /^# /);
  assert.ok((await getLlmsFull().text()).length > 20_000);
});
