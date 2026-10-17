// G150: two live findings of the 477589f deploy.
//   <html lang> stayed "en" on the translated sales pages: the root layout now takes it from the route
//   (lib/i18n/document-lang.ts; the built pages are checked in tests/marketing-build.test.ts).
//   Automatic translation turned "Reception" into Turkish "Alım": a curated wedding glossary now answers wedding labels
//   before the machine (lib/i18n/wedding-glossary.ts, lib/i18n/auto-translate.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { openTranslator } from '../lib/i18n/auto-translate.ts';
import { sourceFields } from '../lib/i18n/content.ts';
import { documentUiLang, routeLang, setDocumentUiLang, subscribeDocumentUiLang } from '../lib/i18n/document-lang.ts';
import { LANGS, type Lang } from '../lib/i18n/langs.ts';
import { glossaryKey, glossaryTerm, glossaryTranslate, translateWithGlossary, WEDDING_GLOSSARY } from '../lib/i18n/wedding-glossary.ts';
import { PLATFORM_ROOT } from './helpers.ts';

const TARGETS: readonly Lang[] = ['tr', 'es', 'de', 'fr'];

// ---------------------------------------------------------------- <html lang>

test('<html lang> from the route: sales site per language, English pages, Turkish admin, others left to the page', () => {
  // useSelectedLayoutSegments() of the root layout (route groups included)
  assert.equal(routeLang(['(marketing)', 'i18n', 'tr']), 'tr');
  assert.equal(routeLang(['(marketing)', 'i18n', 'de', 'designs']), 'de');
  assert.equal(routeLang(['(marketing)', 'i18n', 'es', 'designs', 'olive-ivory']), 'es');
  assert.equal(routeLang(['(marketing)', 'i18n', 'fr', 'guides', 'how-to-make-a-wedding-website']), 'fr');
  assert.equal(routeLang(['(marketing)', '(en)']), 'en');
  assert.equal(routeLang(['(marketing)', '(en)', 'designs']), 'en');
  assert.equal(routeLang(['(marketing)', 'i18n', 'xx']), 'en', 'not one of ours: English');
  assert.equal(routeLang(['admin', 'orders']), 'tr');
  assert.equal(routeLang(['edit', 'ada-and-can']), null, 'the panel reports its own language');
  assert.equal(routeLang(['start']), null);
  assert.equal(routeLang([]), null);
});

test('<html lang> of the buyer screens: the page reports its language, leaving it resets to English', () => {
  let calls = 0;
  const off = subscribeDocumentUiLang(() => (calls += 1));
  try {
    assert.equal(documentUiLang(), null);
    setDocumentUiLang('tr');
    assert.equal(documentUiLang(), 'tr');
    setDocumentUiLang('tr');
    assert.equal(calls, 1, 'no change, no re-render');
    setDocumentUiLang(null);
    assert.equal(documentUiLang(), null);
    assert.equal(calls, 2);
  } finally {
    off();
  }
});

test('the root layout renders <html> through DocumentHtml; buyer pages report their language', () => {
  const layout = readFileSync(path.join(PLATFORM_ROOT, 'app/layout.tsx'), 'utf8');
  assert.match(layout, /<DocumentHtml>/);
  assert.doesNotMatch(layout, /<html lang="en">/);
  for (const page of ['app/edit/[slug]/page.tsx', 'app/edit/[slug]/not-found.tsx', 'app/my/page.tsx', 'app/start/page.tsx', 'app/start/not-found.tsx', 'app/signin/page.tsx']) {
    assert.match(readFileSync(path.join(PLATFORM_ROOT, page), 'utf8'), /<DocumentLang lang=\{lang\} \/>/, page);
  }
});

// ---------------------------------------------------------------- wedding glossary

test('glossary: the live finding — "Reception" is a wedding reception in every language, not "Alım"', () => {
  assert.equal(glossaryTerm('Reception', 'en', 'tr'), 'Resepsiyon');
  assert.equal(glossaryTerm('Reception', 'en', 'es'), 'Recepción');
  assert.equal(glossaryTerm('Reception', 'en', 'de'), 'Feier');
  assert.equal(glossaryTerm('Reception', 'en', 'fr'), 'Réception');
});

test('glossary: exact terms ignore case, spacing, punctuation and "&"/"and"; keep the original’s end punctuation', () => {
  assert.equal(glossaryTerm('Cocktail Hour', 'en', 'tr'), 'Kokteyl');
  assert.equal(glossaryTerm('cocktail hour', 'en', 'de'), 'Sektempfang');
  assert.equal(glossaryTerm('Cocktail hour', 'en', 'fr'), "Vin d'honneur");
  assert.equal(glossaryTerm('Cocktail hour', 'en', 'es'), 'Cóctel');
  assert.equal(glossaryTerm('COCKTAIL HOUR', 'en', 'tr'), 'KOKTEYL');
  assert.equal(glossaryTerm('  Ceremony ', 'en', 'de'), '  Trauung ');
  assert.equal(glossaryTerm('Dinner and dancing', 'en', 'tr'), 'Akşam yemeği ve dans');
  assert.equal(glossaryTerm('Dinner & Dancing', 'en', 'es'), 'Cena y baile');
  assert.equal(glossaryTerm('Dress code:', 'en', 'tr'), 'Kıyafet kuralı:');
  assert.equal(glossaryTerm('Thank you!', 'en', 'de'), 'Danke!');
  assert.equal(glossaryTerm('After-party', 'en', 'de'), 'Afterparty');
  assert.equal(glossaryTerm('Gluten-free', 'en', 'fr'), 'Sans gluten');
  assert.equal(glossaryTerm('Kids welcome', 'en', 'tr'), 'Çocuklarınızı da bekleriz');
  assert.equal(glossaryTerm('Adults only', 'en', 'es'), 'Solo adultos');
  assert.equal(glossaryTerm('Together with their families', 'en', 'fr'), 'Entourés de leurs familles');
  assert.equal(glossaryTerm('Kindly reply by', 'en', 'de'), 'Bitte antworten Sie bis');
  assert.equal(glossaryTerm('RSVP', 'en', 'tr'), 'LCV');
  assert.equal(glossaryTerm('RSVP', 'en', 'es'), 'Confirmación de asistencia', 'an acronym is not shouted');
  assert.equal(glossaryTerm('Vegetarian and gluten-free options on request', 'en', 'de'), 'Vegetarische und glutenfreie Optionen auf Anfrage', 'no full stop added');
  assert.equal(glossaryTerm('When should we arrive?', 'en', 'fr'), 'À quelle heure arriver ?');
  assert.equal(glossaryTerm('The ceremony begins at four', 'en', 'tr'), null, 'a sentence is not a term');
  assert.equal(glossaryTerm('Reception', 'en', 'en'), null);
});

test('glossary: any of the five languages can be the source (a Turkish or German website translated on)', () => {
  assert.equal(glossaryTerm('Tören', 'tr', 'en'), 'Ceremony');
  assert.equal(glossaryTerm('TÖREN', 'tr', 'de'), 'TRAUUNG');
  assert.equal(glossaryTerm('Kokteyl', 'tr', 'fr'), "Vin d'honneur");
  assert.equal(glossaryTerm('Trauung', 'de', 'fr'), 'Cérémonie');
  assert.equal(glossaryTerm('Sektempfang', 'de', 'es'), 'Cóctel');
  assert.equal(glossaryTerm("Vin d’honneur", 'fr', 'tr'), 'Kokteyl');
  assert.equal(glossaryTerm('Código de vestimenta', 'es', 'de'), 'Dresscode');
});

test('glossary: labels made of terms ("Dress code: Black tie", "Ceremony and reception") are translated part by part', () => {
  assert.equal(glossaryTranslate('Dress code: Black tie', 'en', 'tr'), 'Kıyafet kuralı: Smokin ve gece elbisesi');
  assert.equal(glossaryTranslate('Dress code: Cocktail attire', 'en', 'fr'), 'Code vestimentaire: Tenue de cocktail');
  assert.equal(glossaryTranslate('Ceremony · Reception · Dancing', 'en', 'de'), 'Trauung · Feier · Tanz');
  assert.equal(glossaryTranslate('Ceremony and reception', 'en', 'es'), 'Ceremonia y recepción');
  assert.equal(glossaryTranslate('Vegetarian, vegan and gluten free', 'en', 'fr'), 'Végétarien, végan et sans gluten');
  assert.equal(glossaryTranslate('Dress code: something blue', 'en', 'tr'), null, 'one part unknown → the machine gets the whole text');
  assert.equal(glossaryTranslate('6:00 pm', 'en', 'tr'), null);
});

test('translateWithGlossary: glossary texts never reach the machine; sentences do; multi-line texts are mixed', async () => {
  const sent: string[] = [];
  const machine = async (t: string) => {
    sent.push(t);
    return `[mt] ${t}`;
  };
  assert.equal(await translateWithGlossary('Reception', 'en', 'tr', machine), 'Resepsiyon');
  assert.equal(await translateWithGlossary('Cocktail Hour', 'en', 'de', machine), 'Sektempfang');
  assert.deepEqual(sent, []);
  assert.equal(await translateWithGlossary('We met in Rome.', 'en', 'tr', machine), '[mt] We met in Rome.');
  assert.equal(await translateWithGlossary('Ceremony\nWe cannot wait to see you there.\n\nReception', 'en', 'fr', machine), 'Cérémonie\n[mt] We cannot wait to see you there.\n\nRéception');
  assert.deepEqual(sent, ['We met in Rome.', 'We cannot wait to see you there.']);
});

test('openTranslator (free service): "Reception" is answered by the glossary without a request; a sentence is sent', async () => {
  const urls: string[] = [];
  const fetcher = (async (url: string) => {
    urls.push(url);
    return new Response(JSON.stringify({ responseStatus: 200, responseData: { translatedText: 'Roma’da tanıştık.' } }), { headers: { 'content-type': 'application/json' } });
  }) as unknown as typeof fetch;
  const tr = await openTranslator('en', 'tr', { allowService: true, fetcher });
  assert.equal(tr.engine, 'service');
  assert.equal(await tr.translate('Reception'), 'Resepsiyon');
  assert.equal(await tr.translate('Together with their families'), 'Aileleriyle birlikte');
  assert.equal(urls.length, 0);
  assert.equal(await tr.translate('We met in Rome.'), 'Roma’da tanıştık.');
  assert.equal(urls.length, 1);
});

test('openTranslator (device translator): the glossary goes first there too', async () => {
  const g = globalThis as unknown as { Translator?: unknown };
  const asked: string[] = [];
  g.Translator = {
    availability: async () => 'available',
    create: async () => ({ translate: async (t: string) => (asked.push(t), `«${t}»`) }),
  };
  try {
    const tr = await openTranslator('en', 'de', { allowService: false });
    assert.equal(tr.engine, 'browser');
    assert.equal(await tr.translate('Reception'), 'Feier');
    assert.equal(await tr.translate('See you soon'), '«See you soon»');
    assert.deepEqual(asked, ['See you soon']);
  } finally {
    delete g.Translator;
  }
});

/** The short wedding texts every new website starts with: the designs' demo content (labels, dress codes, host line …). */
function demoTexts(): Map<string, string> {
  const files = readdirSync(path.join(PLATFORM_ROOT, 'themes'))
    .map((t) => path.join(PLATFORM_ROOT, 'themes', t, 'content.demo.json'))
    .filter((f) => existsSync(f));
  files.push(path.join(PLATFORM_ROOT, 'lib/claim/demo/blush-garden-rose.json'));
  const out = new Map<string, string>();
  for (const f of files) {
    for (const s of sourceFields(JSON.parse(readFileSync(f, 'utf8')))) {
      if (/^(host_line|dress_code|schedule\.\d+\.label|faq\.\d+\.[qa]|rsvp\.questions\.\d+\.label)$/.test(s.path)) out.set(s.text, `${path.basename(path.dirname(f))}: ${s.path}`);
    }
  }
  return out;
}

test('glossary covers every demo label, dress code, host line, demo question and reply-form question of the designs', () => {
  const texts = demoTexts();
  assert.ok(texts.size >= 20, `${texts.size} demo texts`);
  const missing: string[] = [];
  for (const [text, where] of texts) for (const l of TARGETS) if (glossaryTranslate(text, 'en', l) === null) missing.push(`${l} "${text}" (${where})`);
  assert.deepEqual(missing, []);
});

test('glossary table: five non-empty wordings per row, no English term twice, no stray spaces', () => {
  const seen = new Map<string, string>();
  for (const row of WEDDING_GLOSSARY) {
    assert.equal(row.length, LANGS.length, row[0]);
    for (const w of row) {
      assert.ok(w.trim() && w === w.trim() && !/\s{2}/.test(w), `"${w}"`);
    }
    const k = glossaryKey(row[0], 'en');
    assert.ok(!seen.has(k), `"${row[0]}" twice (also "${seen.get(k)}")`);
    seen.set(k, row[0]);
  }
  // the terms of the task (G150) are all there
  for (const term of [
    'Ceremony', 'Reception', 'Cocktail hour', 'Dinner', 'Dancing', 'After party', 'Welcome drinks', 'Dress code', 'Black tie', 'Cocktail attire',
    'Getting here', 'Travel & stay', 'Accommodation', 'Parking', 'Gifts', 'Registry', 'RSVP', 'Kindly reply by', 'Our story', 'Schedule',
    'Details', 'Menu', 'Vegetarian', 'Vegan', 'Gluten free', 'Kids welcome', 'Adults only',
  ]) {
    for (const l of TARGETS) assert.ok(glossaryTerm(term, 'en', l), `${term} → ${l}`);
  }
});
