// G060 edit rights — the pure rule (docs/16 §11.3, §11.9; acceptance tests §14 A 1–5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Identity } from '../lib/data/types.ts';
import {
  addMonthsClamped,
  countedDate,
  DATE_FREE_DAYS,
  daysBetween,
  draftPreviewExpired,
  DRAFT_PREVIEW_MAX_MONTHS,
  isSampleDateReplacement,
  isUndo,
  siteArchiveDates,
  surnameOnly,
  undoState,
  UNDO_WINDOW_MS,
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
  // G060-fix: the date is measured in days (free within DATE_FREE_DAYS = 7), not in characters
  assert.equal(kind(base, edit((i) => void (i.date = '2027-06-13'))), 'typo', 'date +1 day');
  assert.equal(kind(base, edit((i) => void (i.date = '2027-06-21'))), 'change', 'date +9 days (was a 2-character "typo")');
  assert.equal(kind(base, edit((i) => void (i.date = '2027-09-30'))), 'change', 'date 3 months');
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

test('G060-fix: dates move by days — up to a week either way is free, anything more is a change', () => {
  assert.equal(DATE_FREE_DAYS, 7);
  const at = (date: string, from = base) => classifyIdentityChange(from, { ...from, date });
  assert.deepEqual([at('2027-06-19').kind, at('2027-06-19').free, at('2027-06-19').dateDays], ['typo', ['date'], 7], '+7 days');
  assert.equal(at('2027-06-05').kind, 'typo', '-7 days');
  assert.equal(at('2027-06-20').kind, 'change', '+8 days');
  // the review's measurements: what used to be a free "typo" by characters is now judged by distance in days
  const sep18 = { ...base, date: '2027-09-18' };
  assert.equal(at('2027-09-30', sep18).kind, 'change', 'Sep 18 -> Sep 30 (12 days)');
  assert.equal(at('2027-10-18', sep18).kind, 'change', 'Sep 18 -> Oct 18');
  assert.equal(at('2028-09-18', sep18).kind, 'change', '2027 -> 2028');
  assert.equal(at('2029-09-18', sep18).kind, 'change', '2027 -> 2029 (one character)');
  assert.equal(at('2027-10-05', { ...base, date: '2027-09-28' }).kind, 'typo', 'Sep 28 -> Oct 5 (one week) is free');
  assert.equal(at('2027-09-26', { ...base, date: '2027-05-15' }).kind, 'change', 'sample date -> real date is a change by the rule');
  assert.equal(at('not-a-date').kind, 'change', 'an unreadable date is never free');
  assert.equal(daysBetween('2027-12-31', '2028-01-01'), 1);
  assert.equal(daysBetween('2028-03-01', '2028-02-28'), -2, 'leap year');
  // a free date move and a name typo together are still free; with a name change it is one change
  const both = classifyIdentityChange(base, { ...base, date: '2027-06-14', names: [{ display: 'Clare', full: 'Clare Rose' }, base.names[1]] });
  assert.deepEqual([both.kind, [...both.free].sort()], ['typo', ['date', 'typo']]);
});

test('G060-fix: adding or removing a surname (first name unchanged) is free', () => {
  const ada = (full: string, display = 'Ada') => ({ display, full });
  assert.equal(surnameOnly(ada(''), ada('Ada Lovelace')), true, 'no full name yet -> with surname');
  assert.equal(surnameOnly(ada('Ada'), ada('Ada Lovelace')), true, 'full name = first name (old /start drafts)');
  assert.equal(surnameOnly(ada('Ada Lovelace'), ada('Ada Lovelace-Byron')), true, 'double-barrelled');
  assert.equal(surnameOnly(ada('Ada Lovelace'), ada('Ada')), true, 'removed again');
  assert.equal(surnameOnly(ada(''), ada('Augusta Ada King')), true, 'a full name that keeps the first name as a word');
  assert.equal(surnameOnly(ada('Ada Lovelace'), ada('Ada Byron')), false, 'swapping a counted surname is measured');
  assert.equal(surnameOnly(ada(''), ada('Zoe Smith')), false, 'a full name without the first name is not a surname');
  assert.equal(surnameOnly(ada(''), ada('Adam Smith')), false, 'whole words only');
  assert.equal(surnameOnly(ada('Ada'), ada('Eva Smith', 'Eva')), false, 'the first name changed');
  // in the rule: the review's case (full name = first name from /start, then surnames typed after publishing)
  const fromStart: Identity = { names: [ada('Ada'), { display: 'Grace', full: 'Grace' }], shown: 'Ada & Grace', initials: 'A&G', date: '2027-06-12' };
  const one = edit((i) => void (i.names[0].full = 'Ada Lovelace'), fromStart);
  assert.deepEqual([kind(fromStart, one), classifyIdentityChange(fromStart, one).free], ['typo', ['surname']]);
  const two = edit((i) => void (i.names[1].full = 'Grace Hopper'), one);
  assert.equal(kind(fromStart, two), 'typo', 'the second surname is free too (measured from the same anchor)');
  assert.equal(kind(fromStart, edit((i) => void (i.names[0].full = ''), fromStart)), 'unchanged', 'an empty full name means the first name');
});

test('G060-fix: archive is counted from the counted date (a free edit cannot extend hosting)', () => {
  const anchor = { ...base, date: '2027-05-15' };
  const site = (date: string) => ({
    content: { ...demoContent(), date, timezone: 'UTC' },
    publishedContent: null,
    publishedAt: '2027-01-01T00:00:00.000Z',
    firstPublishedAt: '2027-01-01T00:00:00.000Z',
    identity: { anchor, limit: 3, granted: 0, used: 0, log: [] },
  });
  assert.equal(countedDate(site('2027-05-20'), site('2027-05-20').identity), '2027-05-20', 'a free move counts');
  assert.equal(countedDate(site('2029-05-15'), site('2029-05-15').identity), '2027-05-15', 'a stored legacy "typo" does not');
  assert.equal(siteArchiveDates(site('2029-05-15'))!.onlineUntil, '2028-05-15');
  assert.equal(siteArchiveDates(site('2027-05-20'))!.onlineUntil, '2028-05-20');
});

test('G060-fix: undo of the last counted change — before publishing it, or within 10 minutes', () => {
  assert.equal(UNDO_WINDOW_MS, 600_000);
  const from = base;
  const rights = { undo: { at: '2027-01-01T10:00:00.000Z', from } };
  const now = (iso: string) => new Date(iso);
  // not published since the change: any time
  assert.ok(undoState(rights, { publishedAt: '2026-12-01T00:00:00.000Z' }, now('2027-03-01T00:00:00Z')));
  assert.equal(undoState(rights, { publishedAt: '2026-12-01T00:00:00.000Z' }, now('2027-03-01T00:00:00Z'))!.until, null);
  // published after it: 10 minutes
  const pub = { publishedAt: '2027-01-01T10:01:00.000Z' };
  assert.equal(undoState(rights, pub, now('2027-01-01T10:09:59Z'))!.until, '2027-01-01T10:10:00.000Z');
  assert.equal(undoState(rights, pub, now('2027-01-01T10:10:01Z')), null);
  assert.equal(undoState({ undo: null }, pub), null);
  const changed = edit((i) => void (i.names[0].display = 'Maria'));
  assert.equal(isUndo({ from }, from), true);
  assert.equal(isUndo({ from }, edit((i) => void (i.names[0].display = 'Clare'))), true, 'within a typo of the old anchor');
  assert.equal(isUndo({ from }, changed), false);
});

test('G060-fix: the design sample date can be replaced once for free', () => {
  const sample = '2027-05-15';
  const anchor = { ...base, date: sample };
  assert.equal(isSampleDateReplacement(anchor, { ...anchor, date: '2027-09-26' }, sample), true);
  assert.equal(isSampleDateReplacement(anchor, { ...anchor, date: '2027-09-26' }, '2027-06-12'), false, 'not the sample');
  assert.equal(isSampleDateReplacement(anchor, { ...anchor, date: '2027-09-26' }, null), false, 'no sample known');
  const renamedToo = edit((i) => {
    i.names[0].display = 'Maria';
    i.date = '2027-09-26';
  }, anchor);
  assert.equal(isSampleDateReplacement(anchor, renamedToo, sample), false, 'a name change is still counted');
});

test('G060-fix: a never-published draft has its own clock for its shared preview link', () => {
  assert.equal(DRAFT_PREVIEW_MAX_MONTHS, 18);
  const draft = { content: demoContent(), publishedContent: null, publishedAt: null, createdAt: '2027-01-10T08:00:00.000Z' };
  assert.equal(draftPreviewExpired(draft, new Date('2028-07-10T07:59:59Z')), false);
  assert.equal(draftPreviewExpired(draft, new Date('2028-07-10T08:00:00Z')), true);
  assert.equal(draftPreviewExpired({ ...draft, publishedAt: '2027-02-01T00:00:00.000Z' }, new Date('2040-01-01')), false, 'published sites follow the archive');
});
