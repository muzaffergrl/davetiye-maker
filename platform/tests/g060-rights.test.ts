// G060 edit rights — the pure rule (docs/16 §11.3, §11.9; acceptance tests §14 A 1–5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Identity } from '../lib/data/types.ts';
import {
  addMonthsClamped,
  ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS,
  archiveDates,
  classifyIdentityChange,
  editDistance,
  effectiveRights,
  identityOf,
  isArchived,
  normalizeIdentityText,
  normalizeShown,
  remainingChanges,
  rightsView,
  sameIdentity,
  withIdentity,
} from '../lib/panel/rights.ts';
import { demoContent } from './helpers.ts';

const base: Identity = {
  names: [
    { display: 'Clara', full: 'Clara Rose' },
    { display: 'Julian', full: 'Julian Thomas' },
  ],
  shown: 'Clara & Julian',
  initials: 'C&J',
  date: '2027-06-12',
};

function edit(fn: (id: Identity) => void, from: Identity = base): Identity {
  const copy = structuredClone(from);
  fn(copy);
  return copy;
}
const kind = (a: Identity, b: Identity) => classifyIdentityChange(a, b).kind;

test('§11.3 table: every row gives the expected class', () => {
  const firstName = (v: string) => edit((i) => void (i.names[0].display = v));
  assert.equal(kind(base, firstName('Clare')), 'typo', 'Clara -> Clare');
  assert.equal(kind(base, firstName('Calra')), 'typo', 'Clara -> Calra (adjacent swap = 1)');
  assert.equal(kind(base, firstName('clara')), 'typo', 'Clara -> clara (case counts)');
  assert.equal(kind(base, firstName('Clara ')), 'unchanged', 'trailing space');
  assert.equal(kind(base, edit((i) => void (i.names[1].display = 'Julián'))), 'typo', 'Julian -> Julián');
  assert.equal(kind(base, firstName('Klaire')), 'change', 'Clara -> Klaire (3)');
  assert.equal(kind(base, edit((i) => void (i.shown = 'Clara and Julian'))), 'unchanged', 'separator & / and');
  assert.equal(kind(base, edit((i) => void (i.shown = 'Clara + Julian'))), 'unchanged', 'separator +');
  assert.equal(kind(base, edit((i) => void (i.date = '2027-06-21'))), 'typo', 'date swap');
  assert.equal(kind(base, edit((i) => void (i.date = '2027-06-13'))), 'typo', 'date +1 day');
  assert.equal(kind(base, edit((i) => void (i.date = '2027-09-30'))), 'change', 'date 3 digits');
  const one: Identity = { names: [{ display: 'Clara', full: '' }], shown: 'Clara', initials: 'C', date: '2027-06-12' };
  assert.equal(kind(one, edit((i) => void i.names.push({ display: 'Julian', full: '' }), one)), 'change', '1 name -> 2 names');
  // names and date together are ONE change
  const both = edit((i) => {
    i.names[0] = { display: 'Maria', full: 'Maria Lopez' };
    i.shown = 'Maria & Julian';
    i.initials = 'M&J';
    i.date = '2027-09-30';
  });
  assert.equal(kind(base, both), 'change');
});

test('anchor rule: free fixes are measured from the anchor, so they cannot add up', () => {
  const anchor = edit((i) => void (i.names[0] = { display: 'Clara', full: '' }));
  const step1 = edit((i) => void (i.names[0].display = 'Clarie'), anchor);
  assert.equal(kind(anchor, step1), 'typo');
  const step2 = edit((i) => void (i.names[0].display = 'Claire'), anchor);
  assert.equal(classifyIdentityChange(anchor, step2).distance, 2);
  assert.equal(kind(anchor, step2), 'typo', 'Clara -> Claire is still 2 from the anchor');
  const step3 = edit((i) => void (i.names[0].display = 'Blaire'), anchor);
  assert.equal(kind(anchor, step3), 'change', 'Clara -> Blaire is 3 from the anchor');
  // against the previous step it would have been a "typo" (1): the anchor is what counts
  assert.equal(kind(step2, step3), 'typo');
});

test('normalisation: NFC/NFD, invisible and bidi characters, spaces', () => {
  const nfd = 'Julián'; // á as a + combining acute
  assert.equal(normalizeIdentityText(nfd), 'Julián');
  assert.equal(kind(edit((i) => void (i.names[1].display = 'Julián')), edit((i) => void (i.names[1].display = nfd))), 'unchanged');
  assert.equal(kind(base, edit((i) => void (i.names[0].display = 'Cla​ra'))), 'unchanged', 'zero-width space');
  assert.equal(kind(base, edit((i) => void (i.names[0].display = '‮Clara‬'))), 'unchanged', 'bidi marks');
  assert.equal(kind(base, edit((i) => void (i.names[0].full = 'Clara   Rose'))), 'unchanged', 'runs of spaces');
  assert.equal(normalizeShown('Clara AND Julian'), 'Clara & Julian');
  assert.equal(normalizeShown('Alexandra & Sandro'), 'Alexandra & Sandro', '"and" inside a name is not a separator');
  assert.equal(editDistance('', 'abc'), 3);
  assert.equal(editDistance('ab', 'ba'), 1);
  assert.equal(editDistance('😀a', 'a'), 1, 'code points, not UTF-16 units');
});

test('identityOf / withIdentity round trip; an empty full name keeps its stored form', () => {
  const c = demoContent();
  const id = identityOf(c);
  assert.deepEqual(id.names, [
    { display: 'Clara', full: 'Clara Rose' },
    { display: 'Julian', full: 'Julian Thomas' },
  ]);
  assert.ok(sameIdentity(identityOf(withIdentity(c, id)), id));
  const next = withIdentity(c, { ...id, names: [{ display: 'Elena', full: '' }, id.names[1]] });
  assert.equal(next.partners[0].display_name, 'Elena');
  assert.equal(next.partners[0].full_name, null);
  assert.equal(next.venue.name, c.venue.name, 'nothing else changes');
  delete c.partners[0].full_name;
  assert.equal('full_name' in withIdentity(c, identityOf(c)).partners[0], false);
});

test('archive dates: 12 months after the wedding, site time zone, end of day', () => {
  const d = archiveDates({ date: '2027-06-12', timezone: 'America/New_York' })!;
  assert.equal(d.onlineUntil, '2028-06-12');
  assert.equal(d.archiveAt, '2028-06-13T04:00:00.000Z', '00:00 New York (EDT)');
  const site = (now: string) => ({
    content: { ...demoContent(), date: '2027-06-12', timezone: 'America/New_York' },
    publishedContent: null,
    publishedAt: '2027-01-01T00:00:00.000Z',
    firstPublishedAt: '2027-01-01T00:00:00.000Z',
    identity: null,
    now: new Date(now),
  });
  const s1 = site('2028-06-13T03:59:59.000Z'); // 23:59:59 in New York
  assert.equal(isArchived(s1, s1.now), false);
  const s2 = site('2028-06-13T04:00:00.000Z');
  assert.equal(isArchived(s2, s2.now), true);
  // Feb 29 wedding: last day Feb 28, archived from Mar 1
  const leap = archiveDates({ date: '2028-02-29', timezone: 'UTC' })!;
  assert.equal(leap.onlineUntil, '2029-02-28');
  assert.equal(leap.archiveAt, '2029-03-01T00:00:00.000Z');
  assert.equal(addMonthsClamped('2027-01-31', 1), '2027-02-28');
  // unknown zone -> UTC
  assert.equal(archiveDates({ date: '2027-06-12', timezone: 'Mars/Base' })!.archiveAt, '2028-06-13T00:00:00.000Z');
  // support override wins
  const o = archiveDates({ date: '2027-06-12', timezone: 'Europe/London', archiveOverrideAt: '2029-01-10' })!;
  assert.deepEqual([o.onlineUntil, o.archiveAt, o.source], ['2029-01-09', '2029-01-10T00:00:00.000Z', 'support']);
});

test('archive ceiling: at the latest 48 months after the first publish (free date fixes cannot extend hosting)', () => {
  assert.equal(ARCHIVE_MAX_AFTER_FIRST_PUBLISH_MONTHS, 48);
  // 2027 -> 2099 is a 2-digit "typo"; the ceiling still archives 48 months after the first publish
  const d = archiveDates({ date: '2099-06-12', timezone: 'UTC', firstPublishedAt: '2027-01-15T10:00:00.000Z' })!;
  assert.equal(d.source, 'ceiling');
  assert.equal(d.archiveAt, '2031-01-15T10:00:00.000Z');
  assert.equal(d.onlineUntil, '2031-01-15');
  const normal = archiveDates({ date: '2027-06-12', timezone: 'UTC', firstPublishedAt: '2027-01-15T10:00:00.000Z' })!;
  assert.equal(normal.source, 'wedding_date');
});

test('rights view and migration of records from before G060', () => {
  const c = demoContent();
  const never = { content: c, publishedContent: null, publishedAt: null };
  const v0 = rightsView(never, new Date('2026-10-14T00:00:00Z'));
  assert.equal(v0.phase, 'before_publish');
  assert.equal(v0.remaining, 3);
  assert.equal(v0.onlineUntil, '2028-05-15', 'the rules box already shows the date (from the draft)');
  assert.equal(isArchived(never, new Date('2040-01-01')), false, 'a site never published is never archived');

  const legacy = { content: { ...c, name_display: 'Clara and Julian' }, publishedContent: c, publishedAt: '2026-10-01T00:00:00.000Z' };
  const m = effectiveRights(legacy);
  assert.equal(m.migrated, true);
  assert.equal(m.firstPublishedAt, '2026-10-01T00:00:00.000Z');
  assert.equal(m.identity!.used, 0);
  assert.ok(sameIdentity(m.identity!.anchor, identityOf(c)), 'anchored to what guests saw');
  const v1 = rightsView(legacy, new Date('2026-10-14T00:00:00Z'));
  assert.equal(v1.phase, 'counting');
  assert.equal(v1.remaining, 3);
  assert.equal(remainingChanges({ limit: 3, granted: 1, used: 5 }), 0, 'never negative');
});
