// G142: 21 Crimson Rose Atelier and 22 Nocturne Lake Estate on the theme standard (docs/11): editable texts = templates,
// the envelope contract (separate moving pieces, .replay, Enter, hint, slugged session keys, view transition invite-card),
// scenes, photo slots + ph_ placeholders, countdown target, K21 countdown, the "(optional)" mark outside the label.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { manifestProblems, scanCopy } from '../lib/theme/copy-scan.ts';

const ROOT = path.resolve(import.meta.dirname, '..');
const THEMES = ['crimson-rose-atelier', 'nocturne-lake-estate'] as const;
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'] as const;
const read = (t: string, f: string) => readFileSync(path.join(ROOT, 'themes', t, f), 'utf8');

for (const t of THEMES) {
  const html = Object.fromEntries(PAGES.map((p) => [p, read(t, `${p}.html`)])) as Record<(typeof PAGES)[number], string>;
  const manifest = JSON.parse(read(t, 'theme.json'));
  const js = read(t, 'site.js');
  const css = read(t, 'site.css');

  test(`${t}: theme.json copy = templates, no unmarked visible text`, () => {
    const scan = scanCopy(html);
    assert.deepEqual(manifestProblems(manifest.copy, scan), []);
    assert.deepEqual(scan.unmarked ?? [], []);
  });

  test(`${t}: envelope page — separate pieces, .replay, Enter, hint, no <noscript>`, () => {
    const $ = cheerio.load(html.index);
    const stage = $('.stage');
    assert.equal(stage.attr('role'), 'button');
    assert.equal(stage.attr('tabindex'), '0');
    // the seal, the flap, the pocket and the card are their own layers (AGENTS şart 4, docs/11 §7.3)
    const pieces = t === 'crimson-rose-atelier' ? ['.env-seal', '.env-flap', '.env-pocket', '.env-card', '.env-back'] : ['.env-closed', '.env-cflap', '.env-flap', '.env-body', '.env-pocket', '.env .card'];
    for (const sel of pieces) assert.equal(stage.find(sel).length, 1, sel);
    assert.equal($('.replay').length, 1);
    assert.equal($('.replay[hidden]').length, 0, '.replay is shown by the opened state, not by removing [hidden]');
    assert.equal($('a[data-enter][href="home.html"]').length, 1);
    assert.equal($('a[data-skip][href="home.html"]').length, 1);
    assert.equal($('p.nojs-only a[href="home.html"]').length, 1);
    assert.equal($('noscript').length, 0);
    assert.match($('script[type="speculationrules"]').text(), /a\[data-enter\]/);
    assert.equal(stage.find('[data-slot="hero_portrait"] img[data-photo="hero_portrait"]').length, 1);
    assert.equal(stage.find('[data-field="thank_you_title"]').length, 1);
    // opened: the hint is display:none (an animation cannot keep it visible), Enter + Replay show
    assert.match(css, t === 'crimson-rose-atelier' ? /\.is-opened \.tap-hint[^{]*\{display:none\}/ : /\.is-opened \.env-hint\s*\{\s*display:\s*none;?\s*\}/);
    assert.match(css, t === 'crimson-rose-atelier' ? /\.is-opened \.replay\{display:inline-flex/ : /\.is-opened \.env-after/);
  });

  test(`${t}: session keys per site, same in site.js and the <head> scripts`, () => {
    assert.match(js, /storage: \{ opened: 'invite:opened', arrive: 'invite:arrive' \}/);
    assert.match(html.index, /sessionStorage\.getItem\('invite:opened'\+k\)/);
    assert.match(html.home, /s\.getItem\('invite:arrive'\+k\)/);
    assert.match(html.index, /replay=1/);
  });

  test(`${t}: view transition — one invite-card per page, home card visible on arrival`, () => {
    assert.match(css, /@view-transition\s*\{\s*navigation:\s*auto;?\s*\}/);
    assert.match(js, /viewTransitionName = 'invite-card'/);
    assert.match(css, /\.from-envelope [^{]*\{\s*opacity:\s*1;\s*transform:\s*none;\s*transition:\s*none;?\s*\}/);
  });

  test(`${t}: scenes, replay links, countdown target, photo placeholders`, () => {
    for (const p of PAGES) if (p !== 'index') assert.ok(cheerio.load(html[p])('[data-scene]').length > 0, `${p}: [data-scene]`);
    assert.equal(cheerio.load(html.home)('a[href="index.html?replay=1"]').length, 1);
    assert.equal(cheerio.load(html.rsvp)('a[href="index.html?replay=1"]').length, 1);
    assert.match(js, /box\.dataset\.targetUtc = /);
    assert.match(js, /root\.dataset\.js = 'ready'/);
    const slots = new Set<string>();
    for (const p of PAGES) {
      const $ = cheerio.load(html[p]);
      $('[data-slot]').each((_, el) => { slots.add($(el).attr('data-slot')!); });
      $('img[data-photo]').each((_, el) => {
        const src = $(el).attr('src')!;
        assert.match(src, /^img\/ph_/, `${p}: ${src}`);
        assert.ok(existsSync(path.join(ROOT, 'themes', t, src)), src);
      });
    }
    assert.deepEqual([...slots].sort(), ['hero_portrait', 'story_1', 'story_2', 'story_3', 'venue']);
  });

  test(`${t}: K21 — the countdown is plain numerals, no CSS frame`, () => {
    for (const rule of css.match(/[^{}]*\.cd-[^{}]*\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /border|outline|box-shadow/, rule);
  });

  test(`${t}: the RSVP question label is its own span ("(optional)" goes beside it)`, () => {
    const $ = cheerio.load(html.rsvp);
    const legend = $('[data-repeat="rsvp.questions"] legend');
    assert.equal(legend.attr('data-field'), undefined);
    assert.equal(legend.find('span[data-field=".label"]').length, 1);
  });

  test(`${t}: img/manifest.json names og + favicon (Vercel page routes) and both files exist`, () => {
    const m = JSON.parse(read(t, 'img/manifest.json'));
    for (const k of ['og', 'favicon']) assert.ok(existsSync(path.join(ROOT, 'themes', t, 'img', m[k].file)), k);
    assert.ok(existsSync(path.join(ROOT, 'themes', t, 'thank-you.css')));
    assert.ok(existsSync(path.join(ROOT, 'themes', t, 'build_images.py')));
    assert.ok(existsSync(path.join(ROOT, 'themes', t, 'README.md')));
  });
}
