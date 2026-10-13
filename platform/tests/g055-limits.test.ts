// G055 (docs/11 §14 #10, the integrator's default decision): names <= 40, names line <= 85, venue name <= 80,
// schedule <= 10 rows — in the schema, both validators (TS + tools/validate_content.py), the panel draft rules and /start.
import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { draftFromDemo } from '../lib/claim/claim.ts';
import { BUNDLED_DEMO_CONTENT } from '../lib/claim/demo/index.ts';
import { FIELD_MESSAGES, nameError, NAME_MAX } from '../lib/claim/fields.ts';
import type { ContentRecord } from '../lib/content/types.ts';
import { CONTENT_LIMITS, validateContent } from '../lib/content/validate.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { prepareDraft } from '../lib/panel/draft.ts';
import { panelIssues } from '../lib/panel/model.ts';
import { ContentInvalidError, createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, REPO_ROOT, tmpDir } from './helpers.ts';

before(() => {
  const themes = tmpDir('g055-limit-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g055-limit-data-');
});

const schema = JSON.parse(readFileSync(path.join(REPO_ROOT, 'docs/03_URUN_ICERIK_SEMASI.json'), 'utf8'));

function rows(n: number): ContentRecord['schedule'] {
  return Array.from({ length: n }, (_, i) => ({ time: `${String(12 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`, label: `Event ${i + 1}`, location: null }));
}

/** Record cases at and over each limit: [name, record, ok?]. */
function cases(): Array<[string, ContentRecord, boolean]> {
  const out: Array<[string, ContentRecord, boolean]> = [];
  const add = (name: string, ok: boolean, edit: (c: ContentRecord) => void) => {
    const c = demoContent();
    edit(c);
    out.push([name, c, ok]);
  };
  const forty = 'Maximilianna-Josephine Alexandra Rosalie'; // 40
  assert.equal(forty.length, 40);
  add('name-40', true, (c) => {
    c.partners[0].display_name = forty;
    c.partners[0].full_name = forty;
    c.name_display = `${forty} & ${c.partners[1].display_name}`;
  });
  add('name-41', false, (c) => {
    c.partners[0].display_name = `${forty}a`;
    c.name_display = `${forty}a & ${c.partners[1].display_name}`;
  });
  add('full-name-41', false, (c) => void (c.partners[1].full_name = `${forty}b`));
  add('astral-name-40', true, (c) => {
    // 40 characters, 80 UTF-16 code units: the limit counts characters (as Python's len does).
    const n = '𝒜'.repeat(40);
    c.partners[0].display_name = n;
    c.name_display = `${n} & ${c.partners[1].display_name}`;
    c.initials = '𝒜 & J';
  });
  add('names-line-85', true, (c) => {
    c.partners[0].display_name = forty;
    c.partners[1].display_name = `${forty.slice(0, 38)}ab`;
    c.name_display = `${c.partners[0].display_name} and ${c.partners[1].display_name}`;
  });
  add('names-line-86', false, (c) => {
    c.name_display = `${c.partners[0].display_name} & ${c.partners[1].display_name} `.padEnd(86, '.');
  });
  add('venue-80', true, (c) => void (c.venue.name = 'The Grand Conservatory & Botanical Gardens at the Old Royal Estate of Hartwell'.padEnd(80, '.')));
  add('venue-81', false, (c) => void (c.venue.name = 'V'.repeat(81)));
  add('schedule-10', true, (c) => {
    c.schedule = rows(10);
    c.ceremony_time = c.schedule[0].time;
  });
  add('schedule-11', false, (c) => {
    c.schedule = rows(11);
    c.ceremony_time = c.schedule[0].time;
  });
  return out;
}

test('limits come from the schema: names 40, names line 85, venue 80, schedule 10 (FAQ and questions as before)', () => {
  assert.deepEqual(
    { name: CONTENT_LIMITS.name, fullName: CONTENT_LIMITS.fullName, nameDisplay: CONTENT_LIMITS.nameDisplay, venueName: CONTENT_LIMITS.venueName, scheduleItems: CONTENT_LIMITS.scheduleItems },
    { name: 40, fullName: 40, nameDisplay: 85, venueName: 80, scheduleItems: 10 },
  );
  assert.equal(schema.properties.partners.items.properties.display_name.maxLength, 40);
  assert.equal(schema.properties.venue.properties.name.maxLength, 80);
  assert.equal(schema.properties.schedule.maxItems, 10);
  assert.deepEqual(
    [CONTENT_LIMITS.faqItems, CONTENT_LIMITS.faqQuestion, CONTENT_LIMITS.faqAnswer, CONTENT_LIMITS.rsvpQuestions, CONTENT_LIMITS.questionLabel],
    [12, 120, 600, 3, 120],
  );
});

test('TS validator: at the limit valid, one over -> an error on that field', () => {
  const expect: Record<string, [string, string]> = {
    'name-41': ['partners.0.display_name', 'schema_max_length'],
    'full-name-41': ['partners.1.full_name', 'schema_max_length'],
    'names-line-86': ['name_display', 'schema_max_length'],
    'venue-81': ['venue.name', 'schema_max_length'],
    'schedule-11': ['schedule', 'schema_max_items'],
  };
  for (const [name, record, ok] of cases()) {
    const r = validateContent(record, { platform: true });
    assert.equal(r.ok, ok, `${name}: ${JSON.stringify(r.errors)}`);
    if (!ok) assert.deepEqual(r.errors.map((e) => [e.path, e.code]), [expect[name]], name);
  }
});

function pythonAvailable(): boolean {
  return spawnSync('python3', ['-c', 'import jsonschema'], { stdio: 'ignore' }).status === 0;
}
function pythonOk(record: unknown, dir: string, name: string): boolean {
  const file = path.join(dir, `${name}.json`);
  writeFileSync(file, JSON.stringify(record));
  try {
    execFileSync('python3', [path.join(REPO_ROOT, 'tools/validate_content.py'), file], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

test('tools/validate_content.py agrees on every limit case', (t) => {
  if (!pythonAvailable()) return t.skip('python3 + jsonschema not available');
  const dir = tmpDir('g055-py-');
  for (const [name, record, ok] of cases()) assert.equal(pythonOk(record, dir, name), ok, `${name}: Python must give ${ok}`);
});

test('all 20 collection demo records, the theme demo copies and the bundled /start demos stay valid (TS and Python)', (t) => {
  const files = readdirSync(path.join(REPO_ROOT, 'collections'))
    .map((d) => path.join(REPO_ROOT, 'collections', d, 'content.demo.json'))
    .filter((f) => {
      try {
        readFileSync(f);
        return true;
      } catch {
        return false;
      }
    });
  assert.equal(files.length, 20);
  const themeDemos = readdirSync(path.join(PLATFORM_ROOT, 'themes'))
    .map((d) => path.join(PLATFORM_ROOT, 'themes', d, 'content.demo.json'))
    .filter((f) => spawnSync('test', ['-f', f]).status === 0);
  const records: Array<[string, unknown]> = [
    ...[...files, ...themeDemos].map((f): [string, unknown] => [path.relative(REPO_ROOT, f), JSON.parse(readFileSync(f, 'utf8'))]),
    ...Object.entries(BUNDLED_DEMO_CONTENT).map(([id, c]): [string, unknown] => [`bundled:${id}`, c]),
  ];
  for (const [name, record] of records) assert.ok(validateContent(record).ok, `${name}: ${JSON.stringify(validateContent(record).errors)}`);
  if (!pythonAvailable()) return t.skip('python3 + jsonschema not available (TS checked)');
  const dir = tmpDir('g055-py-demo-');
  records.forEach(([name, record], i) => assert.ok(pythonOk(record, dir, `r${i}`), `${name}: Python`));
});

test('panel drafts: an over-long name or 11+ rows are still saved (errors to fix), but never published', async () => {
  const stored = demoContent();
  const long = demoContent();
  long.schedule = rows(12);
  long.ceremony_time = long.schedule[0].time;
  long.partners[0].display_name = 'N'.repeat(50);
  // Not a shape problem (a site made before the limits, or an older panel, must not get stuck on "could not be saved").
  assert.equal(prepareDraft(stored, long).schedule.length, 12);
  const issues = panelIssues(validateContent(long, { platform: true }).errors, long);
  assert.deepEqual(issues.find((i) => i.path === 'schedule')?.message, 'Your website shows up to 10 events. Please remove 2 events.');
  const one = demoContent();
  one.schedule = rows(11);
  assert.equal(panelIssues(validateContent(one).errors, one).find((i) => i.path === 'schedule')?.message, 'Your website shows up to 10 events. Please remove 1 event.');
  // Other list limits stay structural (the panel cannot produce them).
  const faq = demoContent() as ContentRecord & { faq: unknown[] };
  faq.faq = Array.from({ length: 13 }, () => ({ q: 'q', a: 'a' }));
  assert.throws(() => prepareDraft(stored, faq), /faq/);

  const adapter = getDataAdapter();
  const { site } = await createSiteWithKeys(adapter, { slug: 'long-day', theme: '_sample', content: demoContent() });
  await adapter.updateContent(site.id, prepareDraft(stored, long));
  await assert.rejects(publishSite(adapter, site.id), (e: unknown) => {
    assert.ok(e instanceof ContentInvalidError);
    assert.deepEqual(e.issues.map((i) => i.path).sort(), ['partners.0.display_name', 'schedule']);
    return true;
  });
  assert.equal((await adapter.getSiteById(site.id))!.status, 'draft');
});

test('/start: names up to the schema limit (characters, not UTF-16 units); the draft it makes is valid', () => {
  assert.equal(NAME_MAX, CONTENT_LIMITS.name);
  assert.equal(nameError('A'.repeat(40)), null);
  assert.equal(nameError('A'.repeat(41)), FIELD_MESSAGES.nameTooLong);
  assert.equal(FIELD_MESSAGES.nameTooLong, 'Please keep each name to 40 characters or fewer.');
  assert.equal(nameError('𝒜'.repeat(40)), null, '40 characters even though .length is 80');
  const a = 'Maximilianna-Josephine Alexandra Rosalie';
  const b = 'Bartholomew-Alexander Montgomery Kingsle';
  const draft = draftFromDemo(demoContent(), [a, b]);
  assert.equal(draft.name_display, `${a} & ${b}`);
  assert.ok(draft.name_display!.length <= CONTENT_LIMITS.nameDisplay);
  const r = validateContent(draft, { platform: true });
  assert.ok(r.ok, JSON.stringify(r.errors));
});
