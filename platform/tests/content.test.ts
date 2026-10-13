import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { CONTENT_SCHEMA } from '../lib/content/schema.ts';
import { validateContent } from '../lib/content/validate.ts';
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
