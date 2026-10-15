// G069 — RSVP for the couple: names of everyone in a reply (form contract "party"), the couple's own replies and
// corrections (add / update / remove through POST /api/rsvp/<slug>/responses), the overview (people, deadline in days,
// answer breakdowns, food and allergy notes), the CSV with one row per person, older replies, the archive rule,
// and both adapters (local through the routes, blob through the in-memory fake).
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { POST as guestPost } from '../app/api/rsvp/[slug]/route.ts';
import { GET as repliesGet, POST as repliesPost } from '../app/api/rsvp/[slug]/responses/route.ts';
import { GET as exportGet } from '../app/api/rsvp/[slug]/export/route.ts';
import type { ContentRecord, RsvpQuestion } from '../lib/content/types.ts';
import { BlobAdapter } from '../lib/data/blob/index.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import type { RsvpRecord } from '../lib/data/types.ts';
import { rsvpCsv } from '../lib/rsvp/couple.ts';
import { deadlineInsight, deadlineText, isYesNo, replyPeople, rsvpInsights, todayIn } from '../lib/rsvp/insights.ts';
import { MemoryRateLimiter, setRsvpRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { parseCoupleReply, parseSubmission } from '../lib/rsvp/validate.ts';
import { createSiteWithKeys, publishSite, setArchiveOverride } from '../lib/sites.ts';
import { FakeBlobStore } from './fake-blob.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
type Keys = { id: string; slug: string; editKey: string };

const QUESTIONS: RsvpQuestion[] = [
  { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] },
  { id: 'shuttle', label: 'Do you need the hotel shuttle?', type: 'choice', options: ['Yes, please', 'No, thank you'] },
  { id: 'diet', label: 'Any allergies or dietary needs?', type: 'text' },
];

const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);

function content(edit?: (c: ContentRecord) => void): ContentRecord {
  const c = demoContent();
  c.rsvp.deadline = isoDay(300);
  c.date = isoDay(400);
  c.rsvp.questions = structuredClone(QUESTIONS);
  edit?.(c);
  return c;
}

before(() => {
  const themes = tmpDir('g069-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'tests/fixtures/themes/rsvp-fixture'), path.join(themes, 'rsvp-fixture'), { recursive: true });
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('g069-data-');
});
beforeEach(() => setRsvpRateLimiter(new MemoryRateLimiter()));

let counter = 0;
async function newSite(edit?: (c: ContentRecord) => void, publish = true): Promise<Keys> {
  const slug = `g069-site-${++counter}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: 'rsvp-fixture', content: content(edit) });
  if (publish) await publishSite(getDataAdapter(), s.site.id);
  return { id: s.site.id, slug, editKey: s.editKey };
}

let ip = 0;
async function guest(k: Keys, body: Record<string, unknown>) {
  const req = new Request(`${BASE}/api/rsvp/${k.slug}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `203.0.113.${++ip % 250}` },
    body: JSON.stringify(body),
  });
  const res = await guestPost(req, { params: Promise.resolve({ slug: k.slug }) });
  return { status: res.status, data: await res.json() };
}
async function couple(k: Keys, body: unknown, key = k.editKey) {
  const req = new Request(`${BASE}/api/rsvp/${k.slug}/responses`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  const res = await repliesPost(req, { params: Promise.resolve({ slug: k.slug }) });
  return { status: res.status, data: await res.json() };
}
async function summary(k: Keys) {
  const res = await repliesGet(new Request(`${BASE}/api/rsvp/${k.slug}/responses`, { headers: { authorization: `Bearer ${k.editKey}` } }), { params: Promise.resolve({ slug: k.slug }) });
  assert.equal(res.status, 200);
  return res.json();
}
async function csvRows(k: Keys): Promise<string[][]> {
  const res = await exportGet(new Request(`${BASE}/api/rsvp/${k.slug}/export`, { headers: { authorization: `Bearer ${k.editKey}` } }), { params: Promise.resolve({ slug: k.slug }) });
  assert.equal(res.status, 200);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf], 'UTF-8 BOM (Excel)');
  return new TextDecoder()
    .decode(bytes)
    .split('\r\n')
    .filter(Boolean)
    .map((l) => l.slice(1, -1).split('","'));
}

// ---------------------------------------------------------------------------------------------- validation

test('party names: optional, only for a "yes", at most guests − 1 (extra ones ignored), empty ones not stored, errors keyed party:<n>', () => {
  const ok = parseSubmission({ name: 'Avery', attending: 'yes', guests: 3, party: ['  Jordan   Stone ', '', 'Too Many'] }, 10);
  assert.ok(ok.ok);
  assert.deepEqual(ok.value.party, ['Jordan Stone'], 'guest 3 left empty; a 4th name for 3 guests is ignored');
  const none = parseSubmission({ name: 'Avery', attending: 'yes', guests: 2, party: ['', '  '] }, 10);
  assert.ok(none.ok && !('party' in none.value), 'no names: no field (older records look the same)');
  const declined = parseSubmission({ name: 'Avery', attending: 'no', party: ['Jordan'] }, 10);
  assert.ok(declined.ok && !('party' in declined.value));
  const alone = parseSubmission({ name: 'Avery', attending: 'yes', guests: 1, party: ['Jordan'] }, 10);
  assert.ok(alone.ok && !('party' in alone.value));
  for (const party of ['Jordan', { 0: 'Jordan' }, 42, null]) {
    const r = parseSubmission({ name: 'Avery', attending: 'yes', guests: 2, party }, 10);
    assert.ok(r.ok && !('party' in r.value), JSON.stringify(party));
  }
  const long = parseSubmission({ name: 'Avery', attending: 'yes', guests: 3, party: ['Jordan', 'x'.repeat(121)] }, 10);
  assert.ok(!long.ok);
  assert.deepEqual(long.errors, { 'party:3': 'Please keep each name to 120 characters or fewer.' });
});

test('couple replies: same rules; a correction keeps an answer whose option was renamed since and answers to removed questions', () => {
  const existing = { answers: [{ id: 'meal', question: 'Meal', answer: 'Beef' }, { id: 'gone', question: 'Old question', answer: 'Kept' }] };
  const r = parseCoupleReply({ name: 'Ann', attending: 'yes', guests: 2, answers: { meal: 'Beef', diet: 'Nuts' }, party: ['Bo'] }, 10, QUESTIONS, existing);
  assert.ok(r.ok);
  assert.deepEqual(r.value.answers, [
    { id: 'meal', question: 'Meal', answer: 'Beef' },
    { id: 'diet', question: 'Any allergies or dietary needs?', answer: 'Nuts' },
    { id: 'gone', question: 'Old question', answer: 'Kept' },
  ]);
  assert.deepEqual(r.value.party, ['Bo']);
  const added = parseCoupleReply({ name: 'Ann', attending: 'yes', answers: { meal: 'Beef' } }, 10, QUESTIONS);
  assert.ok(!added.ok && added.errors['answer:meal'] === 'Please choose one of the options.', 'a new reply picks a current option');
  const nameless = parseCoupleReply({ name: ' ', attending: 'yes' }, 10, QUESTIONS);
  assert.ok(!nameless.ok && nameless.errors.name === 'Please enter your name.');
  assert.equal(parseCoupleReply({ name: 'Ann', attending: 'yes', guests: 11 }, 10).ok, false, 'the theme cap holds for the couple too');
});

// ---------------------------------------------------------------------------------------------- guest form → couple

test('a guest reply of 3 with names: stored, listed as a party, one CSV row per person; double tap stored once', async () => {
  const k = await newSite();
  const body = { name: 'Avery Stone', email: 'avery@example.org', attending: 'yes', guests: 3, party: ['Jordan Stone', 'Sam Stone'], answers: { meal: 'Fish', shuttle: 'Yes, please' } };
  assert.equal((await guest(k, body)).status, 200);
  assert.equal((await guest(k, body)).status, 200);
  const other = { ...body, party: ['Jordan Stone', 'Riley Stone'] };
  assert.equal((await guest(k, other)).status, 200, 'different names = a different reply');
  const stored = await getDataAdapter().listRsvps(k.id);
  assert.equal(stored.length, 2);
  assert.deepEqual(stored[0].party, ['Jordan Stone', 'Sam Stone']);
  assert.equal(stored[0].source, undefined, 'a guest reply has no source field (as before G069)');
  await getDataAdapter().deleteRsvps(k.id, [stored[1].id]);

  const s = await summary(k);
  assert.deepEqual(s.responses[0].party, ['Jordan Stone', 'Sam Stone']);
  assert.equal(s.responses[0].source, 'guest');
  assert.deepEqual(s.insights.people, { coming: 3, named: 3, unnamed: 0, notComing: 0 });
  const rows = await csvRows(k);
  assert.deepEqual(rows[0].slice(0, 5), ['Name', 'Party of', 'Attending', 'Party size', 'Email']);
  assert.deepEqual(
    rows.slice(1).map((r) => [r[0], r[1], r[2], r[3], r[4], r[6], r[8]]),
    [
      ['Avery Stone', 'Avery Stone', 'Yes', '3', 'avery@example.org', 'Website', 'Fish'],
      ['Jordan Stone', 'Avery Stone', 'Yes', '', '', 'Website', ''],
      ['Sam Stone', 'Avery Stone', 'Yes', '', '', 'Website', ''],
    ],
  );
});

test('older replies (before G069: no party, no source) still list, count and export; unnamed guests get "Guest n" rows', async () => {
  const k = await newSite();
  // written the way G042/G051 stored replies
  await getDataAdapter().saveRsvp(k.id, { name: 'Old Timer', email: null, attending: true, guests: 2, message: null });
  await getDataAdapter().saveRsvp(k.id, { name: 'Old Decline', email: null, attending: false, guests: 0, message: 'Sorry' });
  const raw = await getDataAdapter().listRsvps(k.id);
  assert.ok(raw.every((r) => !('party' in r) && !('source' in r) && !('editedAt' in r)));
  const s = await summary(k);
  assert.deepEqual(
    s.responses.map((r: { name: string; party: string[]; source: string; editedAt: string | null }) => [r.name, r.party, r.source, r.editedAt]),
    [
      ['Old Decline', [], 'guest', null],
      ['Old Timer', [], 'guest', null],
    ],
  );
  assert.deepEqual(s.counts, { responses: 2, attending: 1, notAttending: 1, totalGuests: 2, held: 0 });
  assert.deepEqual(s.insights.people, { coming: 2, named: 1, unnamed: 1, notComing: 1 });
  const rows = await csvRows(k);
  assert.deepEqual(
    rows.slice(1).map((r) => r.slice(0, 4)),
    [
      ['Old Timer', 'Old Timer', 'Yes', '2'],
      ['Guest 2 (no name given)', 'Old Timer', 'Yes', ''],
      ['Old Decline', 'Old Decline', 'No', '0'],
    ],
  );
});

// ---------------------------------------------------------------------------------------------- couple: add / edit / remove

test('the couple adds a phone reply: "Added by you", counted, in the CSV; works after the deadline and before publishing', async () => {
  const k = await newSite();
  const add = await couple(k, { action: 'add', reply: { name: 'Grandma Rose', attending: 'yes', guests: 2, party: ['Grandpa Joe'], answers: { meal: 'Chicken', diet: 'No salt, please' }, message: 'Called on Sunday' } });
  assert.equal(add.status, 200);
  assert.equal(add.data.ok, true);
  assert.equal(add.data.reply.source, 'couple');
  assert.deepEqual(add.data.reply.party, ['Grandpa Joe']);
  assert.deepEqual(add.data.counts, { responses: 1, attending: 1, notAttending: 0, totalGuests: 2, held: 0 }, 'the answer carries the new summary');
  const rows = await csvRows(k);
  assert.deepEqual(
    rows.slice(1).map((r) => [r[0], r[6]]),
    [
      ['Grandma Rose', 'Added by you'],
      ['Grandpa Joe', 'Added by you'],
    ],
  );
  const stored = (await getDataAdapter().listRsvps(k.id))[0];
  assert.equal(stored.source, 'couple');

  const bad = await couple(k, { action: 'add', reply: { name: '', attending: 'yes', guests: 99, email: 'nope' } });
  assert.equal(bad.status, 400);
  assert.equal(bad.data.code, 'invalid');
  assert.deepEqual(Object.keys(bad.data.fields).sort(), ['email', 'guests', 'name']);
  assert.equal((await getDataAdapter().listRsvps(k.id)).length, 1, 'nothing stored on a 400');

  const closed = await newSite((c) => (c.rsvp.deadline = isoDay(-3)));
  assert.equal((await guest(closed, { name: 'Late Guest', attending: 'yes' })).status, 403, 'guests: the form is closed');
  assert.equal((await couple(closed, { action: 'add', reply: { name: 'Late Guest', attending: 'yes' } })).status, 200, 'the couple can still note a late reply');
  const draft = await newSite(undefined, false);
  assert.equal((await couple(draft, { action: 'add', reply: { name: 'Early Bird', attending: 'no' } })).status, 200);
});

test('the couple corrects a guest reply: fields replaced, "Edited by you", answers to removed questions kept; 404 for a gone or foreign reply', async () => {
  const k = await newSite();
  assert.equal((await guest(k, { name: 'Mara Quinn', attending: 'yes', guests: 1, answers: { meal: 'Fish' } })).status, 200);
  const [r] = await getDataAdapter().listRsvps(k.id);
  const upd = await couple(k, { action: 'update', id: r.id, reply: { name: 'Mara Quinn', attending: 'yes', guests: 3, party: ['Leo Quinn', ''], answers: { meal: 'Vegetarian', diet: 'Leo: nut allergy' } } });
  assert.equal(upd.status, 200, JSON.stringify(upd.data));
  assert.equal(upd.data.reply.source, 'guest');
  assert.ok(upd.data.reply.editedAt);
  const [after] = await getDataAdapter().listRsvps(k.id);
  assert.equal(after.id, r.id);
  assert.equal(after.createdAt, r.createdAt, 'the reply keeps its place in time');
  assert.equal(after.guests, 3);
  assert.deepEqual(after.party, ['Leo Quinn']);
  assert.deepEqual(after.answers?.map((a) => a.answer), ['Vegetarian', 'Leo: nut allergy']);
  assert.equal((await csvRows(k))[1][6], 'Website, edited by you');
  const s = await summary(k);
  assert.deepEqual(s.insights.dietary.map((n: { name: string; text: string }) => `${n.name}: ${n.text}`), ['Mara Quinn: Leo: nut allergy']);

  // a declined correction drops the answers and names (they are for guests who come)
  const no = await couple(k, { action: 'update', id: r.id, reply: { name: 'Mara Quinn', attending: 'no', party: ['Leo Quinn'], answers: { meal: 'Fish' } } });
  assert.equal(no.status, 200);
  const [declined] = await getDataAdapter().listRsvps(k.id);
  assert.deepEqual([declined.attending, declined.guests, declined.party, declined.answers], [false, 0, undefined, undefined]);

  assert.equal((await couple(k, { action: 'update', id: '00000000-0000-4000-8000-000000000000', reply: { name: 'X', attending: 'yes' } })).status, 404);
  assert.equal((await couple(k, { action: 'update', id: 'not-an-id', reply: { name: 'X', attending: 'yes' } })).status, 404);
  const other = await newSite();
  assert.equal((await couple(other, { action: 'update', id: r.id, reply: { name: 'Hijack', attending: 'yes' } })).status, 404, 'another site\'s reply');
  assert.equal((await couple(k, { action: 'update', id: r.id, reply: { name: 'Hijack', attending: 'yes' } }, other.editKey)).status, 401, 'another site\'s key');
  assert.equal((await getDataAdapter().listRsvps(k.id))[0].name, 'Mara Quinn');
});

test('remove works for the couple\'s own replies too; an archived site is read only (add / update 403), its list and CSV stay', async () => {
  const k = await newSite();
  const add = await couple(k, { action: 'add', reply: { name: 'Typo Entry', attending: 'yes' } });
  const rm = await couple(k, { action: 'remove', ids: [add.data.reply.id] });
  assert.equal(rm.status, 200);
  assert.equal(rm.data.changed, 1);
  assert.equal((await getDataAdapter().listRsvps(k.id)).length, 0);

  assert.equal((await guest(k, { name: 'Kept Guest', attending: 'yes' })).status, 200);
  const [r] = await getDataAdapter().listRsvps(k.id);
  await setArchiveOverride(getDataAdapter(), k.id, '2020-01-01', 'test: archive');
  for (const body of [
    { action: 'add', reply: { name: 'Too Late', attending: 'yes' } },
    { action: 'update', id: r.id, reply: { name: 'Changed', attending: 'yes' } },
  ]) {
    const res = await couple(k, body);
    assert.equal(res.status, 403, body.action);
    assert.equal(res.data.code, 'archived');
  }
  assert.equal((await getDataAdapter().listRsvps(k.id))[0].name, 'Kept Guest');
  assert.equal((await summary(k)).responses.length, 1);
  assert.equal((await csvRows(k)).length, 2);
});

// ---------------------------------------------------------------------------------------------- overview math

const rec = (over: Partial<RsvpRecord>): RsvpRecord => ({
  id: over.id ?? `id-${Math.random().toString(16).slice(2)}`,
  siteId: 'site',
  name: 'Guest',
  email: null,
  attending: true,
  guests: 1,
  message: null,
  createdAt: '2027-03-01T12:00:00.000Z',
  ...over,
});

test('overview: people, answer breakdown (option order, nobody-chose rows, earlier options, yes/no %), removed questions, held and declines left out', () => {
  const ans = (meal?: string, shuttle?: string) => [
    ...(meal ? [{ id: 'meal', question: 'Meal choice', answer: meal }] : []),
    ...(shuttle ? [{ id: 'shuttle', question: 'Shuttle?', answer: shuttle }] : []),
  ];
  const list = [
    rec({ name: 'A', guests: 3, party: ['A2'], answers: ans('Fish', 'Yes, please'), createdAt: '2027-03-01T10:00:00.000Z' }),
    rec({ name: 'B', guests: 2, answers: ans('Fish', 'No, thank you'), createdAt: '2027-03-02T10:00:00.000Z' }),
    rec({ name: 'C', answers: ans('Chicken', 'Yes, please'), createdAt: '2027-03-03T10:00:00.000Z' }),
    rec({ name: 'D', answers: [...ans('Beef'), { id: 'song', question: 'Song request', answer: 'Dancing Queen' }], createdAt: '2027-03-04T10:00:00.000Z' }),
    rec({ name: 'E', answers: [], createdAt: '2027-03-05T10:00:00.000Z' }),
    rec({ name: 'F', attending: false, guests: 0, createdAt: '2027-03-06T10:00:00.000Z' }),
    rec({ name: 'Held', guests: 5, held: true, answers: ans('Chicken', 'Yes, please'), createdAt: '2027-03-07T10:00:00.000Z' }),
  ];
  const o = rsvpInsights(list, QUESTIONS, content(), new Date('2027-03-10T12:00:00Z'));
  assert.deepEqual(o.people, { coming: 8, named: 6, unnamed: 2, notComing: 1 }, 'A: 3 (2 named), B: 2 (1 named), C, D, E');
  const meal = o.questions.find((q) => q.id === 'meal')!;
  assert.equal(meal.kind, 'choice');
  assert.deepEqual([meal.answered, meal.asked], [4, 5]);
  assert.deepEqual(
    meal.options.map((x) => [x.value, x.count, x.percent, x.old]),
    [
      ['Chicken', 1, 25, false],
      ['Fish', 2, 50, false],
      ['Vegetarian', 0, 0, false],
      ['Beef', 1, 25, true],
    ],
  );
  const shuttle = o.questions.find((q) => q.id === 'shuttle')!;
  assert.equal(shuttle.kind, 'yesno');
  assert.deepEqual(shuttle.options.map((x) => [x.value, x.count, x.percent]), [['Yes, please', 2, 67], ['No, thank you', 1, 33]]);
  const song = o.questions.find((q) => q.id === 'song')!;
  assert.deepEqual([song.current, song.label, song.answered], [false, 'Song request', 1], 'a removed question keeps its answers');
  assert.ok(isYesNo(['Yes', 'No']) && isYesNo(['No way', 'yes!']) && !isYesNo(['Yes', 'Maybe']) && !isYesNo(['Yes', 'No', 'Maybe']));
});

test('overview: food & allergy notes from the food question and from messages; "None" answers left out; sorted by name', () => {
  const diet = (answer: string) => [{ id: 'diet', question: 'Any allergies or dietary needs?', answer }];
  const list = [
    rec({ name: 'Zed', answers: diet('Gluten-free') }),
    rec({ name: 'Amy', answers: diet('None') }),
    rec({ name: 'Bob', answers: diet('n/a'), message: 'Cannot wait! I am vegan by the way.' }),
    rec({ name: 'Cat', message: 'See you there!' }),
    rec({ name: 'Dan', held: true, answers: diet('Shellfish') }),
  ];
  const o = rsvpInsights(list, QUESTIONS, content());
  assert.deepEqual(
    o.dietary.map((n) => [n.name, n.text, n.from, n.question]),
    [
      ['Bob', 'Cannot wait! I am vegan by the way.', 'message', null],
      ['Zed', 'Gluten-free', 'answer', 'Any allergies or dietary needs?'],
    ],
  );
  assert.equal(o.questions.find((q) => q.id === 'diet')!.dietary, true);
  assert.equal(o.questions.find((q) => q.id === 'meal')!.dietary, false, '"Meal choice" with options is a menu choice');
  assert.deepEqual(o.questions.find((q) => q.id === 'diet')!.answers.map((a) => a.name), ['Zed', 'Amy', 'Bob'], 'text answers listed (held left out)');
});

test('overview: days left to reply in the site\'s time zone (open, last day, closed, off, none)', () => {
  const withDeadline = (deadline: string, tz = 'America/New_York', method?: 'none') => {
    const c = demoContent();
    c.rsvp.deadline = deadline;
    c.timezone = tz;
    if (method) c.rsvp.method = method;
    return c;
  };
  // 2027-04-01 02:00 UTC = March 31, 22:00 in New York
  const now = new Date('2027-04-01T02:00:00Z');
  assert.equal(todayIn('America/New_York', now), '2027-03-31');
  assert.equal(todayIn('Not/AZone', now), '2027-04-01');
  assert.deepEqual(deadlineInsight(withDeadline('2027-04-12'), now), { state: 'open', daysLeft: 12, display: 'April 12, 2027' });
  assert.equal(deadlineText(deadlineInsight(withDeadline('2027-04-01'), now)), 'Replies close in 1 day.');
  assert.equal(deadlineInsight(withDeadline('2027-03-31'), now).state, 'last_day');
  assert.equal(deadlineText(deadlineInsight(withDeadline('2027-03-31'), now)), 'Today is the last day to reply.');
  const closed = deadlineInsight(withDeadline('2027-03-20'), now);
  assert.equal(closed.state, 'closed');
  assert.equal(deadlineText(closed), 'Replies closed on March 20, 2027.');
  assert.equal(deadlineInsight(withDeadline('2027-04-12', 'America/New_York', 'none'), now).state, 'off');
  assert.equal(deadlineInsight(withDeadline('not a date'), now).state, 'none');
});

test('people of a reply: the guest who replied, the named ones, then "Guest n"; a "no" is one person', () => {
  assert.deepEqual(
    replyPeople(rec({ name: 'Ann', guests: 4, party: ['Bo', 'Cy'] })).map((p) => [p.name, p.named, p.number, p.partyOf]),
    [
      ['Ann', true, 1, 'Ann'],
      ['Bo', true, 2, 'Ann'],
      ['Cy', true, 3, 'Ann'],
      ['Guest 4', false, 4, 'Ann'],
    ],
  );
  assert.equal(replyPeople(rec({ name: 'No', attending: false, guests: 0, party: ['Ignored'] })).length, 1);
  assert.equal(replyPeople(rec({ guests: 2, party: ['A', 'B', 'C'] })).length, 2, 'names beyond the guest count are not people');
  // CSV: the head count two ways stays right with names missing
  const rows = rsvpCsv([rec({ name: 'Ann', guests: 4, party: ['Bo'] })], { bom: false }).split('\r\n').slice(1, -1);
  assert.equal(rows.length, 4);
});

// ---------------------------------------------------------------------------------------------- blob adapter

test('blob adapter: party and source stored, updateRsvp corrects one reply (editedAt), unknown id -> null', async () => {
  const fake = new FakeBlobStore();
  const blob = new BlobAdapter({ token: fake.token, client: fake.client() });
  const { site } = await createSiteWithKeys(blob, { slug: 'g069-blob', theme: 'rsvp-fixture', content: content() });
  const a = await blob.saveRsvp(site.id, { name: 'Phone Reply', attending: true, guests: 2, party: ['Partner'], source: 'couple' });
  const b = await blob.saveRsvp(site.id, { name: 'Web Reply', attending: true, guests: 1 });
  assert.deepEqual([a.party, a.source, b.party, b.source], [['Partner'], 'couple', undefined, undefined]);
  const upd = await blob.updateRsvp(site.id, b.id, { name: 'Web Reply', email: null, attending: true, guests: 2, message: null, party: ['Friend'], answers: [] });
  assert.ok(upd?.editedAt);
  const list = await blob.listRsvps(site.id);
  const fixed = list.find((r) => r.id === b.id)!;
  assert.deepEqual([fixed.guests, fixed.party, fixed.createdAt, 'answers' in fixed], [2, ['Friend'], b.createdAt, false]);
  assert.equal(list.find((r) => r.id === a.id)!.editedAt, undefined, 'the other reply is untouched');
  assert.equal(await blob.updateRsvp(site.id, '00000000-0000-4000-8000-000000000000', { name: 'X', email: null, attending: true, guests: 1, message: null }), null);
});

// ---------------------------------------------------------------------------------------------- theme form contract

test('themes 01–05: the reply form carries the party template (one input, number, error slot) and no input name of its own', () => {
  // G084: 02, 05 and (second round) 04 too
  for (const id of ['olive-ivory', 'blush-garden-rose', 'dusty-blue-champagne', 'mediterranean-lemon', 'vintage-airmail-love-letter']) {
    const html = readFileSync(path.join(PLATFORM_ROOT, 'themes', id, 'rsvp.html'), 'utf8');
    const $ = cheerio.load(html);
    const tpl = $('form[data-rsvp-form] template[data-rsvp-party]');
    assert.equal(tpl.length, 1, id);
    const inner = cheerio.load(tpl.html() ?? '');
    assert.equal(inner('input').length, 1, id);
    assert.equal(inner('input').attr('name'), undefined, `${id}: form.js names it party:<n>`);
    assert.equal(inner('input').attr('maxlength'), '120', id);
    assert.equal(inner('[data-rsvp-party-number]').length, 1, id);
    assert.equal(inner('[data-rsvp-error-for="party"]').length, 1, id);
    // after the guest count, before the questions (the order a guest fills it in)
    assert.ok(html.indexOf('data-rsvp-party') > html.indexOf('name="guests"') && html.indexOf('data-rsvp-party') < html.indexOf('data-rsvp-question'), id);
  }
  const js = readFileSync(path.join(PLATFORM_ROOT, 'public/rsvp/form.js'), 'utf8');
  assert.match(js, /template\[data-rsvp-party\]/);
  assert.match(js, /out\.party = party\.values\(\)/);
});
