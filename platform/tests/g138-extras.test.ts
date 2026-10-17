// G138: travel & stay, meal + menu, 0–10 Details blocks — schema rules, the shared engine blocks in every theme,
// thank-you mode, escaping, and the RSVP meal question shortcut.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { validateContent } from '../lib/content/validate.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { renderTemplate } from '../lib/theme/engine.ts';
import { loadTheme, readThemePage } from '../lib/theme/theme.ts';
import { addMealQuestion, DEFAULT_MEAL_CHOICES, mealChoices, mealQuestionState } from '../lib/panel/meal-question.ts';
import { sectionForPath } from '../lib/panel/model.ts';
import { demoContent } from './helpers.ts';

const THEMES = readdirSync(path.resolve(import.meta.dirname, '../themes')).filter((t) => !t.startsWith('_'));

/** Valid content (the unsafe link of block 3 removed). */
function valid(): ContentRecord {
  const c = full();
  c.details_blocks![2].link = null;
  return c;
}

/** Full content, block 3 with a javascript: link (the editor's schema refuses it; the engine must drop it anyway). */
function full(): ContentRecord {
  const c = structuredClone(demoContent()) as ContentRecord;
  c.record_kind = 'customer';
  c.optional_blocks = { ...c.optional_blocks, travel_stay: true };
  c.travel = {
    airport: { text: 'Fly into Florence (FLR), 40 minutes by car.', link: 'https://example.org/flights' },
    parking: { text: 'Free parking next to the venue.' },
    shuttle: null,
    stays: Array.from({ length: 6 }, (_, i) => ({
      name: `Hotel ${i + 1} with a rather long name that has to wrap on a phone`,
      distance: '10 min drive',
      address: '12 Via Roma, Florence',
      link: 'https://example.org/book',
      code: 'SMITHWEDDING2027',
      note: 'Book by May 1 for the group rate.',
    })),
  };
  c.meal = {
    served: true,
    courses: [
      { title: 'Starter', items: ['Burrata, heirloom tomatoes'] },
      { title: 'Main', items: ['Beef tenderloin', 'Sea bass', 'Wild mushroom risotto'] },
    ],
    note: 'Vegetarian and gluten-free options on request.',
  };
  c.details_blocks = Array.from({ length: 10 }, (_, i) => ({
    title: i === 0 ? 'Children <b>' : `Block ${i + 1}`,
    text: 'A'.repeat(600),
    link: i === 1 ? 'https://example.org/registry' : i === 2 ? 'javascript:alert(1)' : null,
    icon: i % 2 ? 'gift' : null,
  }));
  return c;
}

async function details(theme: string, content: unknown, extra: Partial<Parameters<typeof renderTemplate>[0]> = {}) {
  const t = (await loadTheme(theme))!;
  const html = (await readThemePage(t, 'details'))!;
  const r = renderTemplate({ html, content, theme: t.manifest, page: 'details', slug: 'a-and-b', now: new Date('2026-10-17T12:00:00Z'), ...extra });
  return { ...r, $: cheerio.load(r.html) };
}

test('schema: travel, meal and details_blocks validate; blanks and over-limit lists are refused', () => {
  assert.equal(validateContent(valid(), { platform: true }).ok, true, JSON.stringify(validateContent(valid(), { platform: true }).errors));
  assert.equal(validateContent(full(), { platform: true }).errors[0].code, 'schema_uri');
  const c = valid();
  c.travel!.stays![0].name = ' ';
  c.meal!.courses![1].items[0] = '';
  c.details_blocks![3].title = '';
  const codes = validateContent(c, { platform: true }).errors.map((e) => `${e.code}@${e.path}`);
  assert.deepEqual(codes.sort(), [
    'details_block_title_empty@details_blocks.3.title',
    'meal_item_empty@meal.courses.1.items.0',
    'travel_stay_name_empty@travel.stays.0.name',
  ]);
  const over = valid();
  over.details_blocks!.push({ title: 'Eleventh' });
  over.travel!.stays!.push({ name: 'Seventh' });
  assert.deepEqual(validateContent(over, { platform: true }).errors.map((e) => e.path).sort(), ['details_blocks', 'travel.stays']);
  const icon = valid() as unknown as Record<string, any>;
  icon.details_blocks[0].icon = 'skull';
  assert.equal(validateContent(icon, { platform: true }).errors[0].code, 'schema_enum');
  // an old record without the new fields is unchanged
  assert.equal(validateContent(demoContent()).ok, true);
  assert.equal(sectionForPath('travel.stays.0.name'), 'travel');
  assert.equal(sectionForPath('urls.accommodation'), 'travel');
  assert.equal(sectionForPath('meal.courses.0.title'), 'menu');
  assert.equal(sectionForPath('details_blocks.2.text'), 'blocks');
});

test('every theme: empty content leaves no trace; full content shows the three blocks in the theme', async () => {
  assert.equal(THEMES.length, 23); // + 22 Nocturne Lake Estate (G142), 28 Maison Pâtisserie (G166)
  for (const theme of THEMES) {
    const empty = await details(theme, demoContent());
    assert.equal(empty.$('[data-travel], [data-menu], [data-blocks], .pex-block').length, 0, theme);
    assert.equal(empty.$('link[href="/static/extras.css"]').length, 0, theme);
    assert.doesNotMatch(empty.$('body').text(), /The Menu|Getting here|Learn more/, theme);

    const r = await details(theme, full());
    const $ = r.$;
    assert.equal($('link[href="/static/extras.css"]').length, 1, theme);
    assert.equal($('[data-blocks] .pex-block').length, 10, theme);
    assert.equal($('[data-blocks]').attr('data-count'), '10', theme);
    assert.equal($('[data-travel] .pex-row').length, 2, theme);
    assert.equal($('[data-travel] .pex-card').length, 6, theme);
    assert.equal($('[data-menu] .pex-dish').length, 4, theme);
    assert.match($('[data-menu]').text(), /Dietary needs/, theme);
    assert.match($('[data-menu]').closest('section, div.block, div.detail-note').text(), /The Menu/, theme);
    // escaped text, safe links only, theme buttons
    assert.equal($('[data-blocks] h2').first().text(), 'Children <b>', theme);
    assert.equal($('[data-blocks] b').length, 0, theme);
    assert.equal($('[data-blocks] a').length, 1, theme);
    assert.equal($('[data-blocks] a').attr('href'), 'https://example.org/registry', theme);
    assert.match($('[data-travel] a').first().attr('class') ?? '', /\bbtn\b/, theme);
    assert.equal($('[data-travel] a[rel="noopener noreferrer"]').length, 7, theme);
    // no label spans left, no engine attributes left
    assert.equal($('[data-travel] [data-copy], [data-menu] [data-copy], [data-pex-btn]').length, 0, theme);
    // the old link's text is shown only with the link
    assert.doesNotMatch($('body').text(), /see the link below/, theme);
  }
});

test('engine: couple texts relabel the blocks; thank-you mode hides them; a meal not served shows nothing', async () => {
  const c = full();
  c.copy = { travel_getting_here: 'How to get here', menu_title: 'Dinner', blocks_more: 'Read more' };
  c.details_blocks![1].link_label = null;
  const { $ } = await details('olive-ivory', c);
  assert.equal($('[data-travel] .pex-kicker').first().text(), 'How to get here');
  assert.match($('[data-menu]').closest('section').find('h2').text(), /Dinner/);
  assert.equal($('[data-blocks] a').text(), 'Read more');

  const after = await details('olive-ivory', { ...full(), thank_you: { mode: 'on' } });
  assert.equal(after.$('[data-travel], [data-menu], [data-blocks]').length, 0);
  assert.equal(after.$('link[href="/static/extras.css"]').length, 0);

  for (const served of [false, null]) {
    const m = full();
    m.meal = { ...m.meal, served };
    const r = await details('midnight-garden', m);
    assert.equal(r.$('[data-menu]').length, 0);
  }
  const noMenu = full();
  noMenu.meal = { served: true };
  const r = await details('crimson-rose-atelier', noMenu);
  assert.equal(r.$('[data-menu]').text(), 'A meal will be served.');

  // travel switched off: nothing of it, even with content
  const off = full();
  off.optional_blocks = { ...off.optional_blocks, travel_stay: false };
  assert.equal((await details('art-deco-black-tie', off)).$('[data-travel]').length, 0);
});

test('RSVP shortcut: a meal choice question from the Main dishes, added once', () => {
  const c = valid();
  assert.deepEqual(mealChoices(c), ['Beef tenderloin', 'Sea bass', 'Wild mushroom risotto']);
  assert.deepEqual(mealChoices({ meal: { served: true } }), [...DEFAULT_MEAL_CHOICES]);
  c.rsvp = { ...c.rsvp, questions: [] };
  assert.equal(mealQuestionState(c), 'ok');
  assert.equal(addMealQuestion(c), true);
  const q = c.rsvp.questions![0];
  assert.equal(q.label, 'Meal choice');
  assert.equal(q.type, 'choice');
  assert.equal(mealQuestionState(c), 'exists');
  assert.equal(addMealQuestion(c), false);
  assert.equal(c.rsvp.questions!.length, 1);
  assert.equal(validateContent(c, { platform: true }).ok, true);
});
