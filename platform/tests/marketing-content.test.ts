// G061 content rules (docs/14 §1.3, §4.4–§4.5, §6): titles, descriptions, FAQ answer shape, guides, and claims we
// never make. All copy comes from lib/marketing/* and content/guides, so the rules are checked at the source.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { liveDesigns } from '../lib/marketing/designs.ts';
import { canvaComparison, definition, EDITABLE, included, LIMITS, NOT_INCLUDED } from '../lib/marketing/facts.ts';
import { faqGroups, faqItems, HOME_FAQ_IDS, plainAnswer, wordCount } from '../lib/marketing/faq.ts';
import { loadGuides } from '../lib/marketing/guides.ts';
import { blockLinks } from '../lib/marketing/markdown.ts';
import { corePages, designPage } from '../lib/marketing/site.ts';
import { COUPLE_SITE_ROBOTS } from '../lib/site/render.ts';
import { PLATFORM_ROOT } from './helpers.ts';
import { readyConfig } from './marketing-helpers.ts';

const firstSentence = (t: string) => t.split(/(?<=[.?!])\s/)[0];

test('page titles ≤ 60 characters (also with a 12-character brand) and descriptions 120–160 characters', () => {
  const brand12 = readyConfig({ brand: { ...readyConfig().brand, name: 'Seal & Story' } });
  const pages = [...corePages(), ...liveDesigns().map((d) => designPage(d.id)!)];
  const pages12 = [...corePages(brand12), ...liveDesigns(brand12).map((d) => designPage(d.id, brand12)!)];
  for (const p of pages) {
    assert.ok(p.title.length <= 60, `${p.path} title ${p.title.length}: ${p.title}`);
    assert.ok(p.description.length >= 120 && p.description.length <= 160, `${p.path} description ${p.description.length}`);
    assert.ok(p.h1.length > 0);
  }
  for (const p of pages12) assert.ok(p.title.length <= 60, `${p.path} with a 12-char brand: ${p.title.length}: ${p.title}`);
  const titles = pages.map((p) => p.title);
  assert.equal(new Set(titles).size, titles.length, 'titles are unique');
  const descs = pages.map((p) => p.description);
  assert.equal(new Set(descs).size, descs.length, 'descriptions are unique');
});

test('FAQ: every answer opens with a short direct sentence and is 40–80 words; ids are unique', () => {
  const ids = new Set<string>();
  for (const g of faqGroups()) {
    assert.ok(g.items.length >= 2, g.id);
    for (const it of g.items) {
      assert.ok(!ids.has(it.id), `duplicate ${it.id}`);
      ids.add(it.id);
      assert.ok(it.q.endsWith('?'), it.q);
      const plain = plainAnswer(it.a);
      const words = wordCount(plain);
      assert.ok(words >= 40 && words <= 80, `${it.id}: ${words} words`);
      assert.ok(wordCount(firstSentence(plain)) <= 25, `${it.id}: first sentence too long: ${firstSentence(plain)}`);
    }
  }
  for (const id of HOME_FAQ_IDS) assert.ok(ids.has(id), id);
  // Same with a fully decided config (real policy texts make answers longer or shorter).
  for (const it of faqItems(readyConfig())) {
    const words = wordCount(plainAnswer(it.a));
    assert.ok(words >= 35 && words <= 85, `${it.id} (decided config): ${words} words`);
  }
});

test('FAQ "Will our website show up on Google?" says what couple pages really send (lib/site/render.ts)', () => {
  const google = faqItems().find((it) => it.id === 'google')!;
  assert.ok(google, 'google question present');
  assert.match(COUPLE_SITE_ROBOTS, /noindex/, 'if couple sites become indexable, rewrite this FAQ answer too');
  assert.match(plainAnswer(google.a), /^Not by default\. Every couple website asks search engines not to list it/);
});

test('home page targets the docs/14 §2.1 cluster: envelope, digital, wedding invitation website', () => {
  const home = corePages().find((p) => p.path === '/')!;
  assert.match(home.title, /envelope/i);
  assert.match(home.title, /digital/i);
  assert.match(home.title, /wedding invitation website/i);
  assert.match(home.h1, /^envelope wedding websites/i);
  assert.match(home.description, /digital wedding invitation website with RSVP/i);
});

test('facts: numbers come from the content limits; "not included" is explicit', () => {
  assert.equal(LIMITS.rsvpQuestions, 3);
  assert.equal(LIMITS.scheduleRows, 10);
  assert.equal(LIMITS.faqItems, 12);
  assert.ok(included().some((x) => x.includes('12 months')));
  for (const must of ['custom domain', 'Music', 'colors, fonts', 'Password', 'email', 'Printed']) {
    assert.ok(NOT_INCLUDED.some((x) => x.toLowerCase().includes(must.toLowerCase())), must);
  }
  assert.ok(EDITABLE.length >= 6);
  assert.ok(canvaComparison().every((r) => !/canva\.com|\bzola\b|\bknot\b|\bjoy\b|greenvelope|paperless/i.test(r.ours + r.canva)));
  assert.ok(definition().short.length <= 160);
});

test('guides: ≥ 6, 1,200–2,000 words, quick answer 40–60 words, an FAQ of 3–4 questions, original element, internal links', () => {
  const guides = loadGuides();
  assert.ok(guides.length >= 6, `${guides.length} guides`);
  const slugs = new Set(guides.map((g) => g.slug));
  for (const g of guides) {
    assert.ok(g.words >= 1200 && g.words <= 2000, `${g.slug}: ${g.words} words`);
    const qa = wordCount(g.quickAnswer);
    assert.ok(qa >= 40 && qa <= 60, `${g.slug}: quick answer ${qa} words`);
    assert.ok(g.faq.length >= 3 && g.faq.length <= 4, `${g.slug}: ${g.faq.length} FAQ questions`);
    assert.ok(g.title.length <= 60, `${g.slug}: title ${g.title.length}`);
    assert.ok(g.description.length >= 120 && g.description.length <= 160, `${g.slug}: description ${g.description.length}`);
    assert.ok(g.blocks.some((b) => b.type === 'table' || (b.type === 'ul' && b.checklist)), `${g.slug}: needs a table or checklist`);
    assert.equal(g.blocks.filter((b) => b.type === 'h2' && /^faq$/i.test(b.text)).length, 1, `${g.slug}: one FAQ section`);
    const links = blockLinks(g.blocks);
    assert.ok(links.some((l) => /^\/designs\//.test(l)) || links.includes('/designs'), `${g.slug}: links a design`);
    assert.ok(links.some((l) => l === '/how-it-works' || l.startsWith('/features')), `${g.slug}: links how it works or features`);
    for (const l of links.filter((x) => x.startsWith('/guides/'))) assert.ok(slugs.has(l.slice('/guides/'.length).split('#')[0]), `${g.slug}: broken guide link ${l}`);
    for (const l of links.filter((x) => /^https?:/.test(x))) assert.match(l, /^https:\/\//, `${g.slug}: external links are https`);
    assert.ok(g.updated >= g.published && g.reviewed >= g.published);
  }
});

/** Every text file of the marketing site's copy. */
function copyFiles(): string[] {
  const roots = ['app/(marketing)', 'components/marketing', 'lib/marketing', 'content'];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir)) {
      const p = path.join(dir, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|md)$/.test(e)) out.push(p);
    }
  };
  for (const r of roots) walk(path.join(PLATFORM_ROOT, r));
  return out;
}

test('claims we never make (docs/14 §3, §4.4–§4.5)', () => {
  const banned: Array<[RegExp, string]> = [
    [/\bthe best\b|\b#1\b|number one|\bfaster than\b|loved by (thousands|couples)/i, 'superlatives'],
    [/\bunlimited\b|\bforever\b/i, 'unlimited / forever'],
    [/AI-powered|hand-?painted/i, 'AI-powered / hand-painted'],
    [/tested on (an )?iphone|tested on android/i, 'device claims without a real-device test'],
    [/we (will )?email (you )?your edit link|edit link (is )?sent by email/i, 'edit link by email (not true)'],
    [/we verify your (etsy )?order/i, 'Etsy order verification (not true)'],
    [/\b\d{1,3}(,\d{3})+\+? (couples|customers|happy)/i, 'invented customer counts'],
    [/\bstar(s)? rating|★/i, 'ratings'],
  ];
  for (const file of copyFiles()) {
    const text = readFileSync(file, 'utf8');
    for (const [re, what] of banned) {
      // facts.ts documents the rule itself, and phoneClaim() switches only on config.verified.realDevices.
      if (file.endsWith(path.join('lib', 'marketing', 'facts.ts')) || file.endsWith(path.join('app', '(marketing)', 'about', 'page.tsx'))) continue;
      assert.ok(!re.test(text), `${path.relative(PLATFORM_ROOT, file)}: ${what}`);
    }
  }
});
