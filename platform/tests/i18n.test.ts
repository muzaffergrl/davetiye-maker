// G144: languages — dictionaries cover every key (report), placeholders survive translation, dates, the couple's
// translations (approved / stale / missing), the engine in another language, the language negotiation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { chunks } from '../lib/i18n/auto-translate.ts';
import { localizedContent, siteLangs, sourceFields, srcHash, translationState, isTranslatablePath } from '../lib/i18n/content.ts';
import { loadDict, type Namespace } from '../lib/i18n/dicts.ts';
import { dateIn, dateLongIn, timeIn } from '../lib/i18n/format.ts';
import { expectedKeys, placeholders } from '../lib/i18n/keys.ts';
import { LANGS, negotiateLang } from '../lib/i18n/langs.ts';
import { scanSource } from '../lib/i18n/scan.ts';
import { makeTranslator } from '../lib/i18n/translate.ts';
import { siteDict } from '../lib/i18n/site.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { loadTheme, readThemePage } from '../lib/theme/theme.ts';
import { demoContent } from './helpers.ts';

const NAMESPACES: Namespace[] = ['panel', 'site', 'market'];
const OTHER = LANGS.filter((l) => l !== 'en');

// ---------------------------------------------------------------- dictionaries

for (const ns of NAMESPACES) {
  test(`${ns}: every dictionary has every key (missing = English; listed here)`, async (t) => {
    const keys = [...expectedKeys(ns)];
    const report: string[] = [];
    for (const lang of OTHER) {
      const dict = await loadDict(ns, lang);
      const missing = keys.filter((k) => !dict[k]);
      if (missing.length) report.push(`${ns}/${lang}: ${missing.length} of ${keys.length} missing — e.g. ${missing.slice(0, 5).map((k) => JSON.stringify(k)).join(', ')}`);
    }
    // A text added later (G139, G142 …) shows in English until its translations are added: reported, and a failure
    // only with I18N_STRICT=1 (node scripts/i18n-missing.ts lists them).
    for (const line of report) t.diagnostic(line);
    if (process.env.I18N_STRICT === '1') assert.deepEqual(report, []);
  });

  test(`${ns}: translations keep their {placeholders} and plural pairs`, async () => {
    for (const lang of OTHER) {
      const dict = await loadDict(ns, lang);
      for (const [key, value] of Object.entries(dict)) {
        assert.ok(value.trim(), `${ns}/${lang} ${JSON.stringify(key)} is empty`);
        if (key.includes('|') && /\{n\}/.test(key)) {
          assert.equal(value.split('|').length, 2, `${ns}/${lang} ${JSON.stringify(key)}: plural pair needs "one|other"`);
        }
        const want = placeholders(key);
        const got = placeholders(value);
        for (const p of got) assert.ok(want.includes(p), `${ns}/${lang} ${JSON.stringify(key)}: unknown {${p}} in ${JSON.stringify(value)}`);
        // every placeholder of the key must survive (a plural's "one" form may drop {n})
        for (const p of want) if (!(key.includes('|') && p === 'n')) assert.ok(got.includes(p), `${ns}/${lang} ${JSON.stringify(key)}: {${p}} lost in ${JSON.stringify(value)}`);
      }
    }
  });
}

test('site: theme texts stay within the design’s length (theme.json copy max)', async () => {
  const themesDir = path.join(import.meta.dirname, '..', 'themes');
  const max = new Map<string, number>();
  for (const id of ['olive-ivory', 'blush-garden-rose', 'art-deco-black-tie', 'crimson-rose-atelier', 'winter-evergreen', 'coastal-seaside']) {
    const m = JSON.parse(readFileSync(path.join(themesDir, id, 'theme.json'), 'utf8')) as { copy?: Record<string, { default: string; max: number }> };
    for (const e of Object.values(m.copy ?? {})) {
      const k = e.default.replace(/\s+/g, ' ').trim();
      max.set(k, Math.min(max.get(k) ?? Infinity, e.max));
    }
  }
  for (const lang of OTHER) {
    const dict = await loadDict('site', lang);
    for (const [k, limit] of max) {
      const v = dict[k];
      if (v) assert.ok([...v].length <= limit, `site/${lang} ${JSON.stringify(k)} → ${JSON.stringify(v)} is longer than ${limit}`);
    }
  }
});

test('scanner finds t / tn / msg literals only', () => {
  const keys = scanSource("t('A {x}', { x }); tn(n, 'one', '{n} many'); msg(\"B\"); x.t('no'); t(`C`); t(`D${1}`); const t2 = at('no');");
  assert.deepEqual(keys.sort(), ['A {x}', 'B', 'C', 'one|{n} many']);
});

test('translator: fallback, placeholders, plurals by language', () => {
  const tr = makeTranslator('tr', { 'Hello {name}': 'Merhaba {name}', '1 reply|{n} replies': '1 yanıt|{n} yanıt' });
  assert.equal(tr.t('Hello {name}', { name: 'Ada' }), 'Merhaba Ada');
  assert.equal(tr.t('Not here'), 'Not here');
  assert.equal(tr.tn(3, '1 reply', '{n} replies'), '3 yanıt');
  const en = makeTranslator('en', null);
  assert.equal(en.tn(1, '1 reply', '{n} replies'), '1 reply');
  assert.equal(en.tn(2, '1 reply', '{n} replies'), '2 replies');
});

test('language negotiation: Accept-Language weights, allowed list', () => {
  assert.equal(negotiateLang('de-CH,de;q=0.9,en;q=0.8'), 'de');
  assert.equal(negotiateLang('pt-BR,fr;q=0.5,tr;q=0.7'), 'tr');
  assert.equal(negotiateLang(['nl', 'es-MX']), 'es');
  assert.equal(negotiateLang('de', ['en', 'tr']), null);
  assert.equal(negotiateLang(''), null);
});

// ---------------------------------------------------------------- dates

test('dates and times: long month names, never numeric; 24 h outside English', () => {
  assert.equal(dateIn('2027-06-12', 'en', 'en-US'), 'June 12, 2027');
  assert.equal(dateIn('2027-06-12', 'tr'), '12 Haziran 2027');
  assert.equal(dateIn('2027-06-12', 'de'), '12. Juni 2027');
  assert.equal(dateIn('2027-06-12', 'fr'), '12 juin 2027');
  assert.equal(dateIn('2027-06-12', 'es'), '12 de junio de 2027');
  assert.equal(dateLongIn('2027-06-12', 'de'), 'Samstag, 12. Juni 2027');
  assert.equal(timeIn('16:30', 'en', 'en-US'), '4:30 PM');
  assert.equal(timeIn('16:30', 'tr'), '16:30');
  assert.equal(timeIn('09:05', 'fr'), '09 h 05');
  for (const l of LANGS) assert.doesNotMatch(dateIn('2027-06-12', l) ?? '', /\d+[/.-]\d+[/.-]\d+/);
});

// ---------------------------------------------------------------- the couple's translations

function multilingual() {
  const c = demoContent() as Record<string, any>;
  c.languages = { primary: 'en', extra: ['tr', 'de'] };
  c.story = { intro: 'We met in Rome.', items: [{ caption: 'First trip' }] };
  c.copy = { rsvp_title: 'Come party with us' };
  c.translations = {
    tr: {
      'story.intro': { text: 'Roma’da tanıştık.', src: srcHash('We met in Rome.'), ok: true },
      'story.items.0.caption': { text: 'İlk gezi', src: srcHash('First trip'), ok: false, auto: 'service' },
      'copy.rsvp_title': { text: 'Bizimle kutlayın', src: srcHash('An older title'), ok: true },
    },
  };
  return c;
}

test('content: languages, translatable fields, states', () => {
  const c = multilingual();
  assert.deepEqual(siteLangs(c), { primary: 'en', all: ['en', 'tr', 'de'] });
  assert.deepEqual(siteLangs({}), { primary: 'en', all: ['en'] });
  const fields = sourceFields(c);
  assert.ok(fields.some((f) => f.path === 'story.intro'));
  assert.ok(fields.some((f) => f.path === 'copy.rsvp_title'));
  assert.ok(!fields.some((f) => f.path.startsWith('partners') || f.path.startsWith('venue.name')));
  const state = (p: string) => translationState(c, 'tr', fields.find((f) => f.path === p)!);
  assert.equal(state('story.intro'), 'ok');
  assert.equal(state('story.items.0.caption'), 'draft');
  assert.equal(state('copy.rsvp_title'), 'stale');
  assert.equal(translationState(c, 'de', fields[0]), 'missing');
  assert.ok(isTranslatablePath('faq.3.a') && isTranslatablePath('copy.form_send') && !isTranslatablePath('venue.name'));
});

test('content: guests see only approved, up-to-date translations; the rest stays in the main language', () => {
  const c = multilingual();
  const tr = localizedContent(c, 'tr') as Record<string, any>;
  assert.equal(tr.story.intro, 'Roma’da tanıştık.');
  assert.equal(tr.story.items[0].caption, 'First trip'); // not approved
  assert.equal(tr.copy.rsvp_title, 'Come party with us'); // stale
  assert.equal(tr.translations, undefined);
  assert.equal(localizedContent(c, 'en'), c);
  assert.equal((localizedContent(c, 'fr') as Record<string, any>).story.intro, 'We met in Rome.'); // not offered
});

test('auto-translate: long texts are cut at sentences under 450 bytes', () => {
  const text = 'Sentence one is here. '.repeat(40);
  const parts = chunks(text);
  assert.ok(parts.length > 1);
  assert.equal(parts.join(''), text);
  for (const p of parts) assert.ok(new TextEncoder().encode(p).length <= 450);
});

// ---------------------------------------------------------------- the engine in another language

test('engine: a Turkish page — html lang, fixed texts, dates, the couple’s words, links keep ?lang, switcher, hreflang', async () => {
  const theme = (await loadTheme('olive-ivory'))!;
  const html = (await readThemePage(theme, 'rsvp'))!;
  const c = multilingual();
  const dict = { ...(await siteDict('tr')), 'Will You Join Us?': 'Bize katılır mısınız?', 'Kindly reply by': 'Lütfen yanıtlayın' };
  const out = renderTemplate({ html, content: c, theme: theme.manifest, page: 'rsvp', slug: 'ada-and-can', lang: 'tr', dict, origin: 'https://example.com' });
  const $ = cheerio.load(out.html);
  assert.equal($('html').attr('lang'), 'tr');
  // stale custom title: the couple's English text (not the design's translated default)
  assert.ok(out.html.includes('Come party with us'));
  // links between pages keep the language
  const links = $('a[href^="/ada-and-can"]').not('[data-pl-lang] a').map((_, a) => $(a).attr('href')).get();
  assert.ok(links.length && links.every((h) => h.includes('lang=tr')), links.join(' '));
  // switcher + hreflang for en / tr / de + x-default
  assert.equal($('[data-pl-lang] a').length, 3);
  assert.equal($('[data-pl-lang] a[aria-current]').attr('hreflang'), 'tr');
  assert.deepEqual($('link[rel="alternate"]').map((_, l) => $(l).attr('hreflang')).get(), ['en', 'tr', 'de', 'x-default']);
  assert.equal($('link[hreflang="en"]').attr('href'), 'https://example.com/ada-and-can/rsvp');
  const data = JSON.parse($('#site-data').text());
  assert.equal(data.lang, 'tr');
  assert.deepEqual(data.langs, ['en', 'tr', 'de']);
  assert.match(String(data.derived.date_display), /\p{L}{3,} \d{4}$/u);
  assert.doesNotMatch(String(data.derived.date_display), /[A-Z][a-z]+ \d+, \d{4}/); // not the English "June 12, 2027"
});

test('engine: a one-language site has no switcher, and English stays as it was', async () => {
  const theme = (await loadTheme('olive-ivory'))!;
  const html = (await readThemePage(theme, 'home'))!;
  const out = renderTemplate({ html, content: demoContent(), theme: theme.manifest, page: 'home', slug: 'ada-and-can', lang: 'de', dict: await siteDict('de') });
  const $ = cheerio.load(out.html);
  assert.equal($('[data-pl-lang]').length, 0);
  assert.equal($('html').attr('lang'), 'en'); // de is not one of this site's languages
  assert.equal($('link[rel="alternate"][hreflang]').length, 0);
});

test('engine: a site whose main language is German shows the design in German without ?lang', async () => {
  const theme = (await loadTheme('olive-ivory'))!;
  const html = (await readThemePage(theme, 'rsvp'))!;
  const c = demoContent() as Record<string, any>;
  c.languages = { primary: 'de' };
  const dict = { 'Will You Join Us?': 'Seid ihr dabei?' };
  const out = renderTemplate({ html, content: c, theme: theme.manifest, page: 'rsvp', slug: 'ada-and-can', lang: null, dict });
  const $ = cheerio.load(out.html);
  assert.equal($('html').attr('lang'), 'de');
  if (theme.manifest.copy?.rsvp_title?.default === 'Will You Join Us?') assert.ok(out.html.includes('Seid ihr dabei?'));
  assert.ok(!$('a[href*="lang="]').length, 'the main language needs no ?lang');
});
