import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CONTENT_SCHEMA } from '../lib/content/schema.ts';
import { validateContent } from '../lib/content/validate.ts';
import { parseSubmission } from '../lib/rsvp/validate.ts';
import {
  formatDate,
  formatDateLong,
  formatTime,
  parseIsoDate,
  weekdayName,
  zonedTimeToUtc,
} from '../lib/content/format.ts';
import { buildView, getPath } from '../lib/content/derive.ts';
import { demoContent, REPO_ROOT, tmpDir } from './helpers.ts';

const codes = (r: ReturnType<typeof validateContent>, level: 'errors' | 'warnings') => r[level].map((i) => i.code);

// ---------------------------------------------------------------- formatting

test('date and time formatting matches the Python tool', () => {
  assert.equal(formatDate('2027-06-12', 'en-US'), 'June 12, 2027');
  assert.equal(formatDate('2027-06-12', 'en-GB'), '12 June 2027');
  assert.equal(formatDateLong('2027-09-18', 'en-US'), 'Saturday, September 18, 2027');
  assert.equal(formatDateLong('2027-09-18', 'en-AU'), 'Saturday, 18 September 2027');
  assert.equal(weekdayName('2027-05-15'), 'Saturday');
  assert.equal(formatTime('00:05', 'en-US'), '12:05 AM');
  assert.equal(formatTime('12:00', 'en-US'), '12:00 PM');
  assert.equal(formatTime('16:30', 'en-US'), '4:30 PM');
  assert.equal(formatTime('16:30', 'en-GB'), '4:30 pm');
  assert.equal(formatDate('2027-02-30', 'en-US'), null);
  assert.equal(formatDate('06/12/27', 'en-US'), null);
  assert.equal(formatTime('24:00', 'en-US'), null);
  assert.equal(parseIsoDate('2028-02-29')?.day, 29);
  assert.equal(parseIsoDate('2027-02-29'), null);
});

test('zonedTimeToUtc handles DST and bad zones', () => {
  assert.equal(zonedTimeToUtc('2027-09-18', '16:30', 'America/New_York'), '2027-09-18T20:30:00.000Z'); // EDT
  assert.equal(zonedTimeToUtc('2027-01-09', '16:30', 'America/New_York'), '2027-01-09T21:30:00.000Z'); // EST
  assert.equal(zonedTimeToUtc('2027-07-01', '18:00', 'Europe/London'), '2027-07-01T17:00:00.000Z');
  assert.equal(zonedTimeToUtc('2027-07-01', '18:00', 'Australia/Sydney'), '2027-07-01T08:00:00.000Z');
  assert.equal(zonedTimeToUtc('2027-07-01', '18:00', 'Not/AZone'), null);
});

test('buildView adds derived fields without touching the input; getPath ignores prototypes', () => {
  const content = demoContent();
  const before = JSON.stringify(content);
  const view = buildView(content);
  assert.equal(JSON.stringify(content), before);
  assert.equal(view.date_weekday, 'Saturday');
  assert.equal(getPath(view, 'venue.city_region'), 'Savannah, Georgia');
  assert.equal(getPath(view, 'schedule.1.label'), 'Cocktail Hour');
  assert.equal(getPath(view, 'schedule.x'), undefined);
  assert.equal(getPath(view, '__proto__'), undefined);
  assert.equal(getPath(view, 'constructor.name'), undefined);
});

// ---------------------------------------------------------------- schema copy

test('lib/content/schema.ts is an exact copy of docs/03_URUN_ICERIK_SEMASI.json', (t) => {
  const file = path.join(REPO_ROOT, 'docs/03_URUN_ICERIK_SEMASI.json');
  if (!existsSync(file)) return t.skip('docs schema not present');
  assert.deepEqual(CONTENT_SCHEMA, JSON.parse(readFileSync(file, 'utf8')), 'run: node scripts/sync-schema.cjs');
});

// ---------------------------------------------------------------- validation

const demoFiles = readdirSync(path.join(REPO_ROOT, 'collections'))
  .map((d) => path.join(REPO_ROOT, 'collections', d, 'content.demo.json'))
  .filter((f) => existsSync(f));

test('all collection demo records validate', () => {
  assert.ok(demoFiles.length >= 3);
  for (const f of demoFiles) {
    const r = validateContent(JSON.parse(readFileSync(f, 'utf8')));
    assert.deepEqual(r.errors, [], f);
  }
});

test('schema errors: types, enums, required, unknown fields, patterns, dates, urls', () => {
  const c = demoContent() as any;
  c.locale = 'tr-TR';
  c.partners = [];
  delete c.venue.city;
  c.venue.extra = 'x';
  c.ceremony_time = '4pm';
  c.date = '2027-02-30';
  c.initials = 'ABCDEFGHIJ';
  c.urls.map = 'javascript:alert(1)';
  c.media.memory_photos = ['a', 'b', 'c', 'd', 'e'];
  c.optional_blocks.faq = 'yes';
  c.story = { intro: 'x'.repeat(201), items: [{ text: 'no caption' }, { caption: 'y'.repeat(61) }], extra: 1 };
  const r = validateContent(c);
  assert.equal(r.ok, false);
  const byPath = Object.fromEntries(r.errors.map((e) => [e.path, e.code]));
  assert.equal(byPath.locale, 'schema_enum');
  assert.equal(byPath.partners, 'schema_min_items');
  assert.equal(byPath['venue.city'], 'schema_required');
  assert.equal(byPath['venue.extra'], 'schema_unknown_field');
  assert.equal(byPath.ceremony_time, 'schema_pattern');
  assert.equal(byPath.date, 'schema_date');
  assert.equal(byPath.initials, 'schema_max_length');
  assert.equal(byPath['urls.map'], 'schema_uri');
  assert.equal(byPath['media.memory_photos'], 'schema_max_items');
  assert.equal(byPath['optional_blocks.faq'], 'schema_type');
  assert.equal(byPath['story.intro'], 'schema_max_length');
  assert.equal(byPath['story.items.0.caption'], 'schema_required');
  assert.equal(byPath['story.items.1.caption'], 'schema_max_length');
  assert.equal(byPath['story.extra'], 'schema_unknown_field');
});

test('the optional story block is accepted and may be absent', () => {
  const withStory = demoContent();
  assert.ok(withStory.story?.items?.length, 'design 03 demo has story captions');
  assert.equal(validateContent(withStory).ok, true);
  const without = demoContent();
  delete without.story;
  assert.equal(validateContent(without).ok, true);
});

test('business rules mirror validate_content.py', () => {
  const ok = validateContent(demoContent());
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.warnings, []);

  const late = demoContent();
  late.rsvp.deadline = '2027-05-15';
  assert.deepEqual(codes(validateContent(late), 'errors'), ['rsvp_deadline_not_before_event']);

  const names = demoContent();
  names.name_display = 'Clara & Jules';
  assert.deepEqual(codes(validateContent(names), 'errors'), ['name_display_missing_partner']);

  const demoUrl = demoContent();
  demoUrl.urls.registry = 'https://registry.example.org/x';
  assert.deepEqual(codes(validateContent(demoUrl), 'errors'), ['demo_url_not_null']);

  const forbidden = demoContent();
  forbidden.venue.address = '1234 Celebration Lane';
  assert.deepEqual(codes(validateContent(forbidden), 'errors'), ['forbidden_string']);

  const warn = demoContent();
  warn.schedule = [warn.schedule[1], warn.schedule[0]];
  warn.initials = 'CX';
  warn.dress_code = null;
  warn.timezone = 'Mars/Olympus';
  const w = validateContent(warn);
  assert.equal(w.ok, true);
  assert.deepEqual(codes(w, 'warnings').sort(), [
    'dress_code_empty',
    'initials_missing_letter',
    'schedule_first_not_ceremony',
    'schedule_not_chronological',
    'timezone_invalid',
  ]);

  const customer = demoContent();
  customer.record_kind = 'customer';
  assert.deepEqual(codes(validateContent(customer), 'warnings').sort(), [
    'customer_url_missing',
    'customer_url_missing',
    'registry_without_url',
  ]);
});

test('business rules are skipped while the schema fails (like the Python tool)', () => {
  const c = demoContent() as any;
  c.rsvp.deadline = '2028-01-01'; // rule error...
  c.event_type = 'party'; // ...hidden behind a schema error
  assert.deepEqual(codes(validateContent(c), 'errors'), ['schema_enum']);
});

// ---------------------------------------------------------------- parity with the Python tool

function pythonAvailable(): boolean {
  const r = spawnSync('python3', ['-c', 'import jsonschema'], { stdio: 'ignore' });
  return r.status === 0;
}

test('pass/fail parity with tools/validate_content.py', (t) => {
  if (!pythonAvailable()) return t.skip('python3 + jsonschema not available');
  const dir = tmpDir();
  const cases: Array<[string, unknown]> = demoFiles.map((f) => [path.basename(path.dirname(f)), JSON.parse(readFileSync(f, 'utf8'))]);
  const late = demoContent();
  late.rsvp.deadline = '2027-06-01';
  const names = demoContent();
  names.name_display = 'Someone & Else';
  const url = demoContent();
  url.urls.map = 'https://maps.example.org/x';
  const enumBad = { ...demoContent(), locale: 'fr-FR' };
  const missing = demoContent() as any;
  delete missing.partners;
  const warnOnly = demoContent();
  warnOnly.schedule.reverse();
  cases.push(['late', late], ['names', names], ['url', url], ['enum', enumBad], ['missing', missing], ['warn-only', warnOnly]);
  for (const [name, record] of cases) {
    const file = path.join(dir, `${name}.json`);
    writeFileSync(file, JSON.stringify(record));
    let pyOk = true;
    try {
      execFileSync('python3', [path.join(REPO_ROOT, 'tools/validate_content.py'), file], { stdio: 'pipe' });
    } catch {
      pyOk = false;
    }
    assert.equal(validateContent(record).ok, pyOk, `case ${name}: TS ok must equal Python ok (${pyOk})`);
  }
});

// ---------------------------------------------------------------- G051: FAQ and RSVP questions

const withFaqAndQuestions = () => {
  const c = demoContent();
  c.optional_blocks.faq = true;
  c.faq = [
    { q: 'Is there parking?', a: 'Yes, free parking on site.\nThe gate opens at 3 PM.' },
    { q: 'Can we bring children?', a: 'We love your little ones, but this is an adults-only celebration.' },
  ];
  c.rsvp.questions = [
    { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] },
    { id: 'q-song_1', label: 'A song that gets you dancing', type: 'text' },
  ];
  return c;
};

test('G051 schema: faq and rsvp.questions are optional, valid with sensible content', () => {
  const c = withFaqAndQuestions();
  const r = validateContent(c);
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
  const without = demoContent();
  assert.equal('faq' in without || 'questions' in without.rsvp, false, 'existing records have neither');
  assert.equal(validateContent(without).ok, true);
});

test('G051 schema limits: 12 questions & answers, lengths, 3 RSVP questions, 8 choices of 60 characters, closed shapes', () => {
  const c = withFaqAndQuestions() as any;
  c.faq = Array.from({ length: 13 }, () => ({ q: 'Q?', a: 'A.' }));
  c.faq[0] = { q: 'q'.repeat(121), a: 'a'.repeat(601), extra: 1 };
  c.faq[1] = { q: 'Only a question' };
  c.rsvp.questions = [
    { id: 'a', label: 'l'.repeat(121), type: 'menu' },
    { id: 'b', label: 'B', type: 'choice', options: Array.from({ length: 9 }, (_, i) => `o${i}`) },
    { id: 'c', label: 'C', type: 'choice', options: ['x'.repeat(61), 'y'] },
    { id: 'd', label: 'D', type: 'text' },
  ];
  const r = validateContent(c);
  const byPath = Object.fromEntries(r.errors.map((e) => [e.path, e.code]));
  assert.equal(byPath.faq, 'schema_max_items');
  assert.equal(byPath['faq.0.q'], 'schema_max_length');
  assert.equal(byPath['faq.0.a'], 'schema_max_length');
  assert.equal(byPath['faq.0.extra'], 'schema_unknown_field');
  assert.equal(byPath['faq.1.a'], 'schema_required');
  assert.equal(byPath['rsvp.questions'], 'schema_max_items');
  assert.equal(byPath['rsvp.questions.0.label'], 'schema_max_length');
  assert.equal(byPath['rsvp.questions.0.type'], 'schema_enum');
  assert.equal(byPath['rsvp.questions.1.options'], 'schema_max_items');
  assert.equal(byPath['rsvp.questions.2.options.0'], 'schema_max_length');
});

test('G051 rules: blank FAQ text, question ids, choices (at least two, different), text without choices', () => {
  const blank = withFaqAndQuestions();
  blank.faq![0].q = '   ';
  blank.faq![1].a = '　﻿';
  assert.deepEqual(codes(validateContent(blank), 'errors'), ['faq_question_empty', 'faq_answer_empty']);

  const q = withFaqAndQuestions();
  q.rsvp.questions = [
    { id: 'Meal', label: 'Meal', type: 'choice', options: ['A', 'B'] },
    { id: 'song', label: ' ', type: 'text' },
    { id: 'song', label: 'Song', type: 'text', options: ['x'] },
  ];
  assert.deepEqual(
    validateContent(q).errors.map((e) => [e.code, e.path]),
    [
      ['rsvp_question_id', 'rsvp.questions.0.id'],
      ['rsvp_question_label_empty', 'rsvp.questions.1.label'],
      ['rsvp_question_duplicate_id', 'rsvp.questions.2.id'],
      ['rsvp_question_text_options', 'rsvp.questions.2.options'],
    ],
  );

  const choices = withFaqAndQuestions();
  choices.rsvp.questions = [
    { id: 'one', label: 'One choice', type: 'choice', options: ['Only', ''] },
    { id: 'dup', label: 'Twice', type: 'choice', options: ['Fish', ' fish '] },
    { id: 'none', label: 'No choices', type: 'choice' },
  ];
  assert.deepEqual(
    validateContent(choices).errors.map((e) => [e.code, e.path]),
    [
      ['rsvp_question_option_empty', 'rsvp.questions.0.options.1'],
      ['rsvp_question_options_missing', 'rsvp.questions.0.options'],
      ['rsvp_question_option_duplicate', 'rsvp.questions.1.options'],
      ['rsvp_question_options_missing', 'rsvp.questions.2.options'],
    ],
  );

  // review fix: choices the server would store as one answer are duplicates, choices it keeps apart are not
  const same = withFaqAndQuestions();
  same.rsvp.questions = [
    { id: 'pie', label: 'Pie', type: 'choice', options: ['Fish  Pie', 'Fish Pie'] },
    { id: 'cafe', label: 'Cafe', type: 'choice', options: ['Café', 'Cafe\u0301'] },
    { id: 'apart', label: 'Apart', type: 'choice', options: ['Fish Pie', 'FishPie', 'Fish-Pie'] },
  ];
  assert.deepEqual(
    validateContent(same).errors.map((e) => [e.code, e.path]),
    [
      ['rsvp_question_option_duplicate', 'rsvp.questions.0.options'],
      ['rsvp_question_option_duplicate', 'rsvp.questions.1.options'],
    ],
  );

  const on = demoContent();
  on.optional_blocks.faq = true;
  assert.deepEqual(codes(validateContent(on), 'warnings'), ['faq_empty'], 'block on without questions: a warning only');
  assert.equal(validateContent(on).ok, true);
});

test('G051 pass/fail parity with tools/validate_content.py (FAQ and RSVP questions)', (t) => {
  if (!pythonAvailable()) return t.skip('python3 + jsonschema not available');
  const dir = tmpDir();
  const cases: Array<[string, unknown]> = [];
  const add = (name: string, edit: (c: any) => void) => {
    const c = withFaqAndQuestions() as any;
    edit(c);
    cases.push([name, c]);
  };
  add('ok', () => {});
  add('faq-on-empty', (c) => (c.faq = []));
  add('faq-blank-q', (c) => (c.faq[0].q = ' \t'));
  add('faq-blank-a-feff', (c) => (c.faq[0].a = '﻿'));
  add('faq-blank-a-1c', (c) => (c.faq[0].a = '\x1c\x85'));
  add('faq-zero-width-space', (c) => (c.faq[0].a = '​'));
  add('faq-long', (c) => (c.faq[0].a = 'a'.repeat(601)));
  add('faq-13', (c) => (c.faq = Array.from({ length: 13 }, () => ({ q: 'Q', a: 'A' }))));
  add('faq-missing-a', (c) => delete c.faq[0].a);
  add('q-4', (c) => c.rsvp.questions.push({ id: 'x', label: 'X', type: 'text' }, { id: 'y', label: 'Y', type: 'text' }));
  add('q-bad-id', (c) => (c.rsvp.questions[0].id = 'Meal'));
  add('q-id-newline', (c) => (c.rsvp.questions[0].id = 'meal\n'));
  add('q-dup-id', (c) => (c.rsvp.questions[1].id = 'meal'));
  add('q-blank-label', (c) => (c.rsvp.questions[0].label = ' '));
  add('q-one-option', (c) => (c.rsvp.questions[0].options = ['Fish']));
  add('q-dup-option', (c) => (c.rsvp.questions[0].options = ['Fish', 'FISH ']));
  // review fix: the duplicate key is the RSVP server's matching rule (inner spaces, NFC/NFD, control characters)
  add('q-dup-option-inner-ws', (c) => (c.rsvp.questions[0].options = ['Fish  Pie', 'Fish Pie']));
  add('q-dup-option-nbsp', (c) => (c.rsvp.questions[0].options = ['Fish\u00a0Pie', 'Fish Pie']));
  add('q-dup-option-nfd', (c) => (c.rsvp.questions[0].options = ['Café', 'Cafe\u0301']));
  add('q-dup-option-control', (c) => (c.rsvp.questions[0].options = ['Fish\u0007', 'Fish']));
  add('q-dup-option-bidi', (c) => (c.rsvp.questions[0].options = ['Fi\u202esh', 'Fish']));
  add('q-blank-option', (c) => c.rsvp.questions[0].options.push('  '));
  add('q-text-options', (c) => (c.rsvp.questions[1].options = ['x']));
  add('q-type', (c) => (c.rsvp.questions[0].type = 'menu'));
  add('q-9-options', (c) => (c.rsvp.questions[0].options = Array.from({ length: 9 }, (_, i) => `o${i}`)));
  add('q-unknown-field', (c) => (c.rsvp.questions[0].required = true));
  for (const [name, record] of cases) {
    const file = path.join(dir, `g051-${name}.json`);
    writeFileSync(file, JSON.stringify(record));
    let pyOk = true;
    try {
      execFileSync('python3', [path.join(REPO_ROOT, 'tools/validate_content.py'), file], { stdio: 'pipe' });
    } catch {
      pyOk = false;
    }
    assert.equal(validateContent(record).ok, pyOk, `case ${name}: TS ok must equal Python ok (${pyOk})`);
  }
  const passing = cases.filter(([, r]) => validateContent(r).ok).map(([n]) => n);
  assert.deepEqual(passing, ['ok', 'faq-on-empty', 'faq-zero-width-space'], 'both outcomes are exercised');
});

test('G051 choices that pass validation stay distinct answers on the RSVP server', () => {
  const pairs: string[][] = [
    ['Fish  Pie', 'Fish Pie'],
    ['Café', 'Cafe\u0301'],
    ['Fish\u0007', 'Fish'],
    ['Fish\u00a0Pie', 'Fish Pie'],
    ['Fish Pie', 'FishPie', 'Fish-Pie', 'fish pie!'],
  ];
  for (const options of pairs) {
    const c = withFaqAndQuestions();
    c.rsvp.questions = [{ id: 'meal', label: 'Meal', type: 'choice', options }];
    if (!validateContent(c).ok) continue; // rejected as duplicates: nothing reaches the server
    const stored = options.map((pick) => {
      const r = parseSubmission({ name: 'Guest', attending: 'yes', answers: { meal: pick } }, 10, c.rsvp.questions!);
      assert.equal(r.ok, true, `pick ${JSON.stringify(pick)} accepted`);
      return r.ok ? r.value.answers?.[0]?.answer : null;
    });
    assert.equal(new Set(stored).size, options.length, `${JSON.stringify(options)} stored as ${JSON.stringify(stored)}`);
  }
});
