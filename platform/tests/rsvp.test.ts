// RSVP library (G042): deadline window, validation, rate limiter, counts, CSV safety, theme guest cap.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import type { RsvpRecord } from '../lib/data/types.ts';
import { ANSWER_MAX, DEFAULT_MAX_GUESTS, MESSAGE_MAX, NAME_MAX, themeMaxGuests } from '../lib/rsvp/config.ts';
import { closedMessage, rsvpClosesAt, rsvpWindow } from '../lib/rsvp/deadline.ts';
import { ipBucket, MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { parseSubmission } from '../lib/rsvp/validate.ts';
import { csvCell, formatLocalDateTime, rsvpCounts, rsvpCsv } from '../lib/rsvp/couple.ts';
import { demoContent, PLATFORM_ROOT } from './helpers.ts';

process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'tests/fixtures/themes');

test('deadline: form closes at the end of the deadline day in the site time zone', () => {
  // EDT is UTC-4 in April: end of April 3 in New York = 04:00 UTC on April 4.
  assert.equal(rsvpClosesAt('2027-04-03', 'America/New_York')?.toISOString(), '2027-04-04T04:00:00.000Z');
  // BST (UTC+1) has started by April 3, 2027.
  assert.equal(rsvpClosesAt('2027-04-03', 'Europe/London')?.toISOString(), '2027-04-03T23:00:00.000Z');
  assert.equal(rsvpClosesAt('2027-12-31', 'Asia/Tokyo')?.toISOString(), '2027-12-31T15:00:00.000Z');
  // Unknown zone: "anywhere on earth" (UTC-12), never earlier than any real zone.
  assert.equal(rsvpClosesAt('2027-04-03', 'Mars/Olympus')?.toISOString(), '2027-04-04T12:00:00.000Z');
  assert.equal(rsvpClosesAt('2027-02-30', 'America/New_York'), null);
  assert.equal(rsvpClosesAt(undefined, 'America/New_York'), null);
});

test('deadline: midnight in a daylight-saving gap is never early (clocks jump at 00:00)', () => {
  // Asia/Beirut and Africa/Cairo skip 00:00-01:00 on these nights: the form closes at 01:00 local, not 23:00.
  assert.equal(rsvpClosesAt('2027-03-27', 'Asia/Beirut')?.toISOString(), '2027-03-27T22:00:00.000Z');
  assert.equal(rsvpClosesAt('2027-04-29', 'Africa/Cairo')?.toISOString(), '2027-04-29T22:00:00.000Z');
  // West of UTC the same rule (01:00 local after the jump), as before.
  assert.equal(rsvpClosesAt('2027-09-04', 'America/Santiago')?.toISOString(), '2027-09-05T04:00:00.000Z');
  assert.equal(rsvpClosesAt('2027-03-13', 'America/Havana')?.toISOString(), '2027-03-14T05:00:00.000Z');
  // never before the local end of the deadline day
  for (const [day, tz] of [['2027-03-27', 'Asia/Beirut'], ['2027-04-29', 'Africa/Cairo']]) {
    const closes = rsvpClosesAt(day, tz)!;
    const local = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(closes.getTime() - 1));
    assert.equal(local, day, `${tz}: still the deadline day one millisecond before closing`);
  }
});

test('deadline: rsvpWindow open / closed / disabled with a friendly message', () => {
  const c = demoContent(); // deadline 2027-04-03, America/New_York, en-US
  const closes = Date.parse('2027-04-04T04:00:00.000Z');
  const before = rsvpWindow(c, new Date(closes - 1));
  assert.deepEqual(before, { open: true, reason: null, closesAt: '2027-04-04T04:00:00.000Z', deadlineDisplay: 'April 3, 2027' });
  const after = rsvpWindow(c, new Date(closes));
  assert.equal(after.open, false);
  assert.equal(after.reason, 'deadline');
  assert.equal(closedMessage(after), 'Replies closed on April 3, 2027. If you still need to reply, please contact the couple directly.');

  const uk = demoContent();
  uk.locale = 'en-GB';
  assert.equal(rsvpWindow(uk, new Date(0)).deadlineDisplay, '3 April 2027');

  const off = demoContent();
  off.rsvp.method = 'none';
  const w = rsvpWindow(off, new Date(0));
  assert.equal(w.open, false);
  assert.equal(w.reason, 'disabled');
  assert.match(closedMessage(w), /not open for this event/);

  const noDeadline = demoContent() as unknown as { rsvp: Record<string, unknown> };
  delete noDeadline.rsvp.deadline;
  // G075: long after the wedding the automatic thank-you mode closes the form; with it off, no deadline = open
  (noDeadline as Record<string, unknown>).thank_you = { mode: 'off' };
  assert.equal(rsvpWindow(noDeadline, new Date('2099-01-01')).open, true);
});

test('validation: a complete reply is cleaned and accepted', () => {
  const r = parseSubmission(
    { name: '  Ada ‮  Lovelace\u0007 ', email: ' ada@example.org ', attending: 'yes', guests: '2', message: ' Line one\r\nLine two\u0000 ', website: '' },
    10,
  );
  assert.ok(r.ok);
  assert.equal(r.spam, false);
  assert.deepEqual(r.value, { name: 'Ada Lovelace', email: 'ada@example.org', attending: true, guests: 2, message: 'Line one\nLine two' });
});

test('validation: missing or bad fields give English messages per field', () => {
  const missing = parseSubmission({ name: '   ', attending: 'maybe' }, 10);
  assert.equal(missing.ok, false);
  assert.ok(!missing.ok && missing.errors.name === 'Please enter your name.');
  assert.ok(!missing.ok && missing.errors.attending === 'Please let us know if you can attend.');

  const bad = parseSubmission(
    { name: 'x'.repeat(NAME_MAX + 1), email: 'not-an-email', attending: 'yes', guests: 11, message: 'm'.repeat(MESSAGE_MAX + 1) },
    10,
  );
  assert.ok(!bad.ok);
  assert.deepEqual(Object.keys(bad.ok ? {} : bad.errors).sort(), ['email', 'guests', 'message', 'name']);
  assert.ok(!bad.ok && bad.errors.guests === 'Please enter a number of guests from 1 to 10.');

  for (const guests of [0, -1, 2.5, '3 people', '1e1', 7]) {
    assert.equal(parseSubmission({ name: 'A', attending: 'yes', guests }, 6).ok, false, `guests=${String(guests)}`);
  }
  assert.ok(parseSubmission({ name: 'A', attending: true, guests: 6 }, 6).ok);
  assert.equal(parseSubmission(null, 10).ok, false);
  assert.equal(parseSubmission(['name'], 10).ok, false);
});

test('validation: guests default to 1 when attending and are stored as 0 when declining', () => {
  const yes = parseSubmission({ name: 'A', attending: 'yes', guests: '' }, 10);
  assert.ok(yes.ok && yes.value.guests === 1);
  const no = parseSubmission({ name: 'A', attending: 'no', guests: '99' }, 10);
  assert.ok(no.ok && no.value.guests === 0 && no.value.attending === false);
  const noEmail = parseSubmission({ name: 'A', attending: 'no', email: '', message: '   ' }, 10);
  assert.ok(noEmail.ok && noEmail.value.email === null && noEmail.value.message === null);
  assert.equal(parseSubmission({ name: 'A', attending: 'no' }, 10).ok, true);
  assert.equal(parseSubmission({ name: 'A', attending: 'yes', guests: 1, message: 'm'.repeat(MESSAGE_MAX) }, 10).ok, true);
});

test('validation: a filled honeypot marks the reply as spam', () => {
  assert.equal(parseSubmission({ name: 'A', attending: 'yes', website: 'http://spam.example' }, 10).spam, true);
  assert.equal(parseSubmission({ name: 'A', attending: 'yes', website: '   ' }, 10).spam, false);
  assert.equal(parseSubmission({ name: 'A', attending: 'yes', website: ['x'] }, 10).spam, true);
});

test('rate limiter: fixed window per key, resets after the window, sweeps old buckets', async () => {
  let now = 1_000;
  const rl = new MemoryRateLimiter({ now: () => now, sweepAt: 3 });
  const rule = { limit: 2, windowMs: 1000 };
  assert.equal((await rl.hit('a', rule)).allowed, true);
  const second = await rl.hit('a', rule);
  assert.deepEqual(second, { allowed: true, remaining: 0, retryAfterMs: 1000 });
  now += 400;
  const third = await rl.hit('a', rule);
  assert.equal(third.allowed, false);
  assert.equal(third.retryAfterMs, 600);
  assert.equal((await rl.hit('b', rule)).allowed, true); // other key unaffected
  now += 600;
  assert.equal((await rl.hit('a', rule)).allowed, true); // new window
  await rl.hit('c', rule);
  now += 5000;
  await rl.hit('d', rule); // size reached sweepAt -> expired buckets dropped
  assert.equal(rl.size, 1);
});

test('rate limiter: IPv6 clients share their /64, IPv4 stays per address', () => {
  assert.equal(ipBucket('203.0.113.7'), '203.0.113.7');
  assert.equal(ipBucket('::ffff:203.0.113.7'), '203.0.113.7');
  assert.equal(ipBucket('2001:db8:1:2:aaaa::1'), '2001:db8:1:2::/64');
  assert.equal(ipBucket('2001:0db8:0001:0002:ffff:ffff:ffff:ffff'), '2001:db8:1:2::/64');
  assert.equal(ipBucket(''), 'unknown');
});

const rec = (over: Partial<RsvpRecord>): RsvpRecord => ({
  id: over.id ?? 'id',
  siteId: 'site',
  name: 'Guest',
  email: null,
  attending: true,
  guests: 1,
  message: null,
  createdAt: '2027-03-01T12:00:00.000Z',
  ...over,
});

test('counts: attending / not attending / total guests', () => {
  const list = [
    rec({ attending: true, guests: 2 }),
    rec({ attending: true, guests: 3 }),
    rec({ attending: false, guests: 0 }),
  ];
  assert.deepEqual(rsvpCounts(list), { responses: 3, attending: 2, notAttending: 1, totalGuests: 5, held: 0 });
  assert.deepEqual(rsvpCounts([]), { responses: 0, attending: 0, notAttending: 0, totalGuests: 0, held: 0 });
  // Held replies (unusual volume) are not counted until the couple keeps them.
  assert.deepEqual(rsvpCounts([...list, rec({ attending: true, guests: 9, held: true })]), {
    responses: 3,
    attending: 2,
    notAttending: 1,
    totalGuests: 5,
    held: 1,
  });
});

test('CSV: cells starting with = + - @ (and tab/CR) are neutralised, quotes doubled', () => {
  assert.equal(csvCell('=HYPERLINK("http://x.example","click")'), `"'=HYPERLINK(""http://x.example"",""click"")"`);
  assert.equal(csvCell('+1 555 0100'), `"'+1 555 0100"`);
  assert.equal(csvCell('-2+3'), `"'-2+3"`);
  assert.equal(csvCell('@SUM(A1:A2)'), `"'@SUM(A1:A2)"`);
  assert.equal(csvCell('\t=1+1'), `"'\t=1+1"`);
  assert.equal(csvCell('\r=1+1'), `"'\r=1+1"`);
  assert.equal(csvCell('  =1+1'), `"'  =1+1"`);
  assert.equal(csvCell('Ann "Annie" Lee'), `"Ann ""Annie"" Lee"`);
  assert.equal(csvCell('line 1\nline 2'), `"line 1\nline 2"`);
  assert.equal(csvCell('a@b.example'), `"a@b.example"`); // @ not at the start: unchanged
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell(3), '"3"');
});

test('CSV: header, BOM, CRLF, oldest first, local time in the site zone', () => {
  const csv = rsvpCsv(
    [
      rec({ name: 'Later', createdAt: '2027-03-02T18:30:00.000Z', attending: false, guests: 0, message: 'Sorry,\nwe are away' }),
      rec({ name: '=cmd|calc', email: 'a@example.org', createdAt: '2027-03-01T15:05:00.000Z', guests: 2 }),
    ],
    { timeZone: 'America/New_York', locale: 'en-US' },
  );
  assert.ok(csv.startsWith('﻿'));
  const lines = csv.slice(1).split('\r\n');
  // G069: one row per person (a reply of 2 without names = the guest + "Guest 2 (no name given)")
  assert.equal(lines[0], '"Name","Party of","Attending","Party size","Email","Submitted (America/New_York)","Source","Message"');
  assert.equal(lines[1], `"'=cmd|calc","'=cmd|calc","Yes","2","a@example.org","March 1, 2027 10:05 AM","Website",""`);
  assert.equal(lines[2], `"Guest 2 (no name given)","'=cmd|calc","Yes","","","March 1, 2027 10:05 AM","Website",""`);
  assert.equal(lines[3], '"Later","Later","No","0","","March 2, 2027 1:30 PM","Website","Sorry,\nwe are away"');
  assert.equal(lines[4], '');
  assert.equal(formatLocalDateTime('2027-03-01T15:05:00.000Z', 'Europe/London', 'en-GB'), '1 March 2027 3:05 pm');
  assert.equal(rsvpCsv([], { bom: false }), '"Name","Party of","Attending","Party size","Email","Submitted (UTC)","Source","Message"\r\n');
});

test('CSV (G069): one row per person with the names given, party size once per reply, source of each reply', () => {
  const csv = rsvpCsv(
    [
      rec({ name: 'Avery Stone', guests: 3, party: ['Jordan Stone'], email: 'avery@example.org', message: 'Yay', createdAt: '2027-03-01T10:00:00.000Z', answers: [{ id: 'meal', question: 'Meal', answer: 'Fish' }] }),
      rec({ name: 'Phone Call', guests: 2, party: ['@Partner'], source: 'couple', createdAt: '2027-03-02T10:00:00.000Z' }),
      rec({ name: 'Fixed Up', guests: 1, editedAt: '2027-03-05T10:00:00.000Z', createdAt: '2027-03-03T10:00:00.000Z' }),
      rec({ name: 'Held Back', guests: 4, held: true, createdAt: '2027-03-04T10:00:00.000Z' }),
    ],
    { timeZone: 'UTC', bom: false, questions: [{ id: 'meal', label: 'Meal' }] },
  );
  const rows = csv.split('\r\n').slice(1, -1).map((l) => l.slice(1, -1).split('","'));
  assert.deepEqual(
    rows.map((r) => [r[0], r[1], r[2], r[3], r[4], r[6], r[7], r[8]]),
    [
      ['Avery Stone', 'Avery Stone', 'Yes', '3', 'avery@example.org', 'Website', 'Yay', 'Fish'],
      ['Jordan Stone', 'Avery Stone', 'Yes', '', '', 'Website', '', ''],
      ['Guest 3 (no name given)', 'Avery Stone', 'Yes', '', '', 'Website', '', ''],
      ['Phone Call', 'Phone Call', 'Yes', '2', '', 'Added by you', '', ''],
      ["'@Partner", 'Phone Call', 'Yes', '', '', 'Added by you', '', ''],
      ['Fixed Up', 'Fixed Up', 'Yes', '1', '', 'Website, edited by you', '', ''],
    ],
  );
  // the head count two ways: rows saying "Yes", and the sum of "Party size"
  assert.equal(rows.filter((r) => r[2] === 'Yes').length, 6);
  assert.equal(rows.reduce((n, r) => n + (Number(r[3]) || 0), 0), 6);
});

// ---------------------------------------------------------------- G051: custom questions

const QUESTIONS = [
  { id: 'meal', label: 'Meal choice', type: 'choice' as const, options: ['Chicken', 'Fish', 'Vegetarian'] },
  { id: 'song', label: 'A song that gets you dancing', type: 'text' as const },
];

test('questions: answers of a guest who accepts are checked, cleaned and kept in question order', () => {
  const r = parseSubmission(
    { name: 'Ada', attending: 'yes', guests: 2, answers: { song: '  Dancing\u0007 Queen\r\n(ABBA) ', meal: ' Fish ', other: 'ignored' } },
    10,
    QUESTIONS,
  );
  assert.ok(r.ok);
  assert.deepEqual(r.value.answers, [
    { id: 'meal', question: 'Meal choice', answer: 'Fish' },
    { id: 'song', question: 'A song that gets you dancing', answer: 'Dancing Queen\n(ABBA)' },
  ]);
  // not answering is fine (questions are optional); no answers → no field at all (older records look the same)
  const none = parseSubmission({ name: 'Ada', attending: 'yes', answers: { meal: '', song: '   ' } }, 10, QUESTIONS);
  assert.ok(none.ok && !('answers' in none.value));
  const noBody = parseSubmission({ name: 'Ada', attending: 'yes' }, 10, QUESTIONS);
  assert.ok(noBody.ok && !('answers' in noBody.value));
  // without questions on the site, answers are ignored
  const noQuestions = parseSubmission({ name: 'Ada', attending: 'yes', answers: { meal: 'Fish' } }, 10);
  assert.ok(noQuestions.ok && !('answers' in noQuestions.value));
});

test('questions: a choice must be one of the options, a text answer at most 300 characters; errors keyed answer:<id>', () => {
  const bad = parseSubmission({ name: 'Ada', attending: 'yes', answers: { meal: 'Steak', song: 's'.repeat(ANSWER_MAX + 1) } }, 10, QUESTIONS);
  assert.ok(!bad.ok);
  assert.deepEqual(bad.ok ? {} : bad.errors, {
    'answer:meal': 'Please choose one of the options.',
    'answer:song': `Please keep your answer to ${ANSWER_MAX} characters or fewer.`,
  });
  assert.ok(parseSubmission({ name: 'Ada', attending: 'yes', answers: { song: 's'.repeat(ANSWER_MAX) } }, 10, QUESTIONS).ok);
  // odd shapes do not crash and do not count as answers
  for (const answers of [['Fish'], 'Fish', 42, null, { meal: ['Fish'] }, { meal: { x: 1 } }]) {
    const r = parseSubmission({ name: 'Ada', attending: 'yes', answers }, 10, QUESTIONS);
    assert.ok(r.ok && !('answers' in r.value), JSON.stringify(answers));
  }
});

test('questions: a guest who declines stores no answers (questions are for guests who accept)', () => {
  const r = parseSubmission({ name: 'Ada', attending: 'no', answers: { meal: 'Steak', song: 'x' } }, 10, QUESTIONS);
  assert.ok(r.ok && !('answers' in r.value) && r.value.guests === 0);
});

test('CSV: one column per question after Message, removed questions keep theirs, older replies stay valid, cells formula-safe', () => {
  const csv = rsvpCsv(
    [
      rec({ name: 'Old Reply', createdAt: '2027-03-01T10:00:00.000Z' }), // before the questions existed
      rec({
        name: 'With Answers',
        createdAt: '2027-03-02T10:00:00.000Z',
        answers: [
          { id: 'meal', question: 'Meal (old wording)', answer: 'Fish' },
          { id: 'song', question: 'Song', answer: '=HYPERLINK("http://x.example","go")' },
          { id: 'gone', question: '+Removed question', answer: '@cmd' },
        ],
      }),
      rec({ name: 'Declined', attending: false, guests: 0, createdAt: '2027-03-03T10:00:00.000Z' }),
    ],
    { timeZone: 'UTC', bom: false, questions: [{ id: 'meal', label: 'Meal choice' }, { id: 'song', label: '-Song "request"' }] },
  );
  const lines = csv.split('\r\n');
  assert.equal(lines[0], `"Name","Party of","Attending","Party size","Email","Submitted (UTC)","Source","Message","Meal choice","'-Song ""request""","'+Removed question"`);
  assert.equal(lines[1], '"Old Reply","Old Reply","Yes","1","","March 1, 2027 10:00 AM","Website","","","",""');
  assert.equal(lines[2], `"With Answers","With Answers","Yes","1","","March 2, 2027 10:00 AM","Website","","Fish","'=HYPERLINK(""http://x.example"",""go"")","'@cmd"`);
  assert.equal(lines[3], '"Declined","Declined","No","0","","March 3, 2027 10:00 AM","Website","","","",""');
  // a site without questions has the eight person columns only
  assert.equal(rsvpCsv([rec({})], { bom: false }).split('\r\n')[0], '"Name","Party of","Attending","Party size","Email","Submitted (UTC)","Source","Message"');
});

test('theme guest cap: theme.json rsvp.max_guests, else the platform default', async () => {
  assert.equal(await themeMaxGuests('rsvp-fixture'), 6);
  assert.equal(await themeMaxGuests('no-such-theme'), DEFAULT_MAX_GUESTS);
  assert.equal(await themeMaxGuests('../etc'), DEFAULT_MAX_GUESTS);
});

test('client script /rsvp/form.js is valid JavaScript without inline handlers or eval', () => {
  const code = readFileSync(path.join(PLATFORM_ROOT, 'public/rsvp/form.js'), 'utf8');
  assert.doesNotThrow(() => new vm.Script(code, { filename: 'form.js' }));
  assert.doesNotMatch(code, /\beval\(|new Function|innerHTML|setAttribute\(\s*['"]on/);
  assert.match(code, /\/api\/rsvp\//);
});
