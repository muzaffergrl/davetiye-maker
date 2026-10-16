// G128: editable reply form (required / optional, five answer types), Excel + CSV columns from the form, Google Sheets
// connection (OAuth state, encrypted token, full-rewrite sync) against a fake Google on localhost. No real Google account.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import ExcelJS from 'exceljs';
import type { ContentRecord } from '../lib/content/types.ts';
import { validateContent } from '../lib/content/validate.ts';
import { buildView } from '../lib/content/derive.ts';
import { LocalAdapter } from '../lib/data/local/index.ts';
import type { RsvpRecord } from '../lib/data/types.ts';
import { GOOGLE_ENDPOINTS, parseTokenKey } from '../lib/google/config.ts';
import { decryptToken, encryptToken } from '../lib/google/crypto.ts';
import { DOC, finishConnect, readDoc, sheetsStatus, startConnect, syncSheet, disconnect, type SheetsDoc } from '../lib/google/sync.ts';
import { rsvpCsv } from '../lib/rsvp/couple.ts';
import { formScriptConfig } from '../lib/rsvp/form-config.ts';
import { replyTable, summaryRows } from '../lib/rsvp/table.ts';
import { formQuestions, parseCoupleReply, parseSubmission, requiredFields } from '../lib/rsvp/validate.ts';
import { rsvpWorkbook } from '../lib/rsvp/xlsx.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { demoContent, tmpDir } from './helpers.ts';

function formContent(): ContentRecord {
  const c = demoContent();
  c.rsvp = {
    ...c.rsvp,
    required: { email: true },
    questions: [
      { id: 'meal', label: 'Meal choice', type: 'choice', options: ['Fish', 'Beef'], required: true },
      { id: 'kids', label: 'Children coming', type: 'number' },
      { id: 'bus', label: 'Shuttle from the hotel?', type: 'yesno', required: true },
      { id: 'song', label: 'A song for the dance floor', type: 'text' },
      { id: 'wish', label: 'Your wish for us', type: 'long' },
    ],
  };
  return c;
}

const yes = (extra: Record<string, unknown> = {}) => ({ name: 'Ada Lovelace', email: 'ada@example.com', attending: 'yes', guests: '2', answers: { meal: 'Fish', bus: 'yes' }, ...extra });

test('content: new answer types and required flags are valid; options only on choice questions', () => {
  const c = formContent();
  assert.equal(validateContent(c, { platform: true }).ok, true);
  const bad = formContent();
  bad.rsvp.questions![2].options = ['Yes', 'No'];
  assert.ok(validateContent(bad, { platform: true }).errors.some((e) => e.code === 'rsvp_question_text_options'));
  const wrong = formContent() as unknown as { rsvp: { required: Record<string, unknown> } };
  wrong.rsvp.required = { name: true };
  assert.equal(validateContent(wrong, { platform: true }).ok, false);
});

test('validation: required email / note / questions for guests; types checked; couple replies not forced', () => {
  const c = formContent();
  const q = formQuestions(c);
  const req = requiredFields(c);
  assert.equal(parseSubmission(yes(), 6, q, req).ok, true);
  const noEmail = parseSubmission(yes({ email: '' }), 6, q, req);
  assert.equal(noEmail.ok, false);
  assert.equal(!noEmail.ok && noEmail.errors.email, 'Please enter your email address.');
  const noMeal = parseSubmission(yes({ answers: { bus: 'no' } }), 6, q, req);
  assert.equal(!noMeal.ok && noMeal.errors['answer:meal'], 'Please choose an answer.');
  const badNumber = parseSubmission(yes({ answers: { meal: 'Beef', bus: 'No', kids: '2.5' } }), 6, q, req);
  assert.equal(!badNumber.ok && badNumber.errors['answer:kids'], 'Please enter a whole number from 0 to 9999.');
  const badYesNo = parseSubmission(yes({ answers: { meal: 'Beef', bus: 'maybe' } }), 6, q, req);
  assert.equal(!badYesNo.ok && badYesNo.errors['answer:bus'], 'Please choose Yes or No.');
  const ok = parseSubmission(yes({ answers: { meal: 'Beef', bus: 'NO', kids: '03', wish: 'x'.repeat(900) } }), 6, q, req);
  assert.ok(ok.ok);
  assert.deepEqual(
    ok.ok && ok.value.answers!.map((a) => [a.id, a.answer.length > 20 ? 'long' : a.answer]),
    [['meal', 'Beef'], ['kids', '3'], ['bus', 'No'], ['wish', 'long']],
  );
  const tooLong = parseSubmission(yes({ answers: { meal: 'Beef', bus: 'No', song: 'x'.repeat(301) } }), 6, q, req);
  assert.equal(tooLong.ok, false);
  // a "no" is never asked the questions, so required questions do not block it
  assert.equal(parseSubmission({ name: 'Cy', email: 'cy@example.com', attending: 'no' }, 6, q, req).ok, true);
  // note required
  const noteReq = parseSubmission(yes(), 6, q, { message: true });
  assert.equal(!noteReq.ok && noteReq.errors.message, 'Please write a note for the couple.');
  // the couple types in what they heard: required fields do not apply
  assert.equal(parseCoupleReply({ name: 'Phone guest', attending: 'yes', guests: 1 }, 6, q).ok, true);
  // older records: no flags = everything optional, as before
  const old = demoContent();
  old.rsvp.questions = [{ id: 'meal', label: 'Meal', type: 'choice', options: ['A', 'B'] }];
  assert.equal(parseSubmission({ name: 'X', attending: 'yes' }, 6, formQuestions(old), requiredFields(old)).ok, true);
});

test('theme view + form script: yes / no shows as two choices; the script gets ids, types and flags only', () => {
  const c = formContent();
  const view = buildView(c) as { rsvp: { questions: Array<{ id: string; options?: string[] }> } };
  assert.deepEqual(view.rsvp.questions.find((x) => x.id === 'bus')!.options, ['Yes', 'No']);
  assert.equal(view.rsvp.questions.find((x) => x.id === 'kids')!.options, undefined);
  assert.equal(c.rsvp.questions![2].options, undefined, 'the stored record is not changed');
  const cfg = formScriptConfig(c);
  assert.deepEqual(cfg.required, { email: true, message: false });
  assert.deepEqual(cfg.questions[0], { id: 'meal', type: 'choice', required: true });
  assert.ok(!JSON.stringify(cfg).includes('Meal choice'));
});

function reply(over: Partial<RsvpRecord>): RsvpRecord {
  return { id: crypto.randomUUID(), siteId: 's', name: 'Guest', email: null, attending: true, guests: 1, message: null, createdAt: '2027-03-01T15:04:00.000Z', ...over };
}

const REPLIES: RsvpRecord[] = [
  reply({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    guests: 3,
    party: ['Byron'],
    message: '=HYPERLINK("x")',
    answers: [
      { id: 'meal', question: 'Meal choice', answer: 'Fish' },
      { id: 'kids', question: 'Children coming', answer: '2' },
      { id: 'bus', question: 'Shuttle from the hotel?', answer: 'Yes' },
      { id: 'old', question: 'Favourite colour', answer: 'Green' },
    ],
  }),
  reply({ name: 'Cy', attending: false, guests: 0, createdAt: '2027-03-02T10:00:00.000Z' }),
  reply({ name: 'Held', createdAt: '2027-03-03T10:00:00.000Z', held: true }),
];

test('table: columns follow the form (current questions, then "(removed)"), one row per counted reply', () => {
  const t = replyTable(REPLIES, { content: formContent() });
  assert.deepEqual(
    t.columns.map((c) => c.header),
    ['Submitted', 'Name', 'Attending', 'Guests', 'Other guests', 'Email', 'Meal choice', 'Children coming', 'Shuttle from the hotel?', 'A song for the dance floor', 'Your wish for us', 'Favourite colour (removed)', 'Note for the couple', 'Source'],
  );
  assert.equal(t.rows.length, 2, 'held reply left out');
  const ada = t.rows[0];
  assert.equal(ada[3], 3);
  assert.equal(ada[4], 'Byron, 1 guest without a name');
  assert.equal(ada[7], 2, 'number answers are numbers');
  assert.deepEqual((ada[0] as { datetime: string }).datetime, '2027-03-01T10:04', 'site time zone (New York, EST)');
  assert.equal(t.title, `${demoContent().name_display} — RSVP replies`);
  // renaming a question renames its column
  const renamed = formContent();
  renamed.rsvp.questions![0].label = 'Dinner';
  assert.equal(replyTable(REPLIES, { content: renamed }).columns[6].header, 'Dinner');
  const sum = summaryRows(REPLIES, { content: formContent() });
  const row = (label: string) => sum.find((r) => r.kind === 'row' && r.label === label);
  assert.equal(row('Total replies')!.value, 2);
  assert.equal(row('People coming (head count)')!.value, 3);
  assert.equal(row('Held for review (not counted)')!.value, 1);
  assert.equal(row('Fish')!.value, 1);
  assert.equal(row('Fish')!.share, 1);
});

test('Excel: Replies + Summary, brand header, frozen row, filter, real dates and numbers, formulas stay text', async () => {
  const bytes = await rsvpWorkbook(REPLIES, formContent(), new Date('2027-03-04T12:00:00Z'));
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(Buffer.from(bytes) as unknown as ArrayBuffer);
  assert.deepEqual(wb.worksheets.map((w) => w.name), ['Replies', 'Summary']);
  const ws = wb.getWorksheet('Replies')!;
  const h = ws.getRow(1).getCell(1);
  assert.equal((h.fill as ExcelJS.FillPattern).fgColor?.argb, 'FF2B1526');
  assert.equal(ws.views[0].state, 'frozen');
  assert.ok(ws.autoFilter);
  const date = ws.getRow(2).getCell(1);
  assert.ok(date.value instanceof Date);
  assert.equal(date.numFmt, 'mmm d, yyyy h:mm AM/PM');
  assert.equal(ws.getRow(2).getCell(4).value, 3);
  assert.equal(ws.getRow(2).getCell(13).value, '=HYPERLINK("x")', 'a guest text is never a formula');
  assert.equal(ws.getRow(2).getCell(13).type, ExcelJS.ValueType.String);
  assert.equal((ws.getRow(3).getCell(2).fill as ExcelJS.FillPattern | undefined)?.fgColor?.argb, 'FFEDE5D7', 'paper stripe');
  const s = wb.getWorksheet('Summary')!;
  assert.match(String(s.getRow(1).getCell(1).value), /RSVP replies/);
});

test('CSV: answer columns from the same model ("(removed)" for removed questions)', () => {
  const csv = rsvpCsv(REPLIES, { questions: formQuestions(formContent()) });
  const header = csv.split('\r\n')[0];
  assert.match(header, /"Meal choice","Children coming"/);
  assert.match(header, /"Favourite colour \(removed\)"/);
});

test('token crypto: round trip; another site id or key does not decrypt', () => {
  const key = parseTokenKey('k'.repeat(40))!;
  const sealed = encryptToken('1//refresh-secret', key, 'site-a');
  assert.ok(!sealed.includes('refresh'));
  assert.equal(decryptToken(sealed, key, 'site-a'), '1//refresh-secret');
  assert.equal(decryptToken(sealed, key, 'site-b'), null);
  assert.equal(decryptToken(sealed, parseTokenKey('x'.repeat(40))!, 'site-a'), null);
  assert.equal(parseTokenKey('short'), null);
  assert.equal(parseTokenKey('ab'.repeat(32))!.length, 32);
});

// ---------------------------------------------------------------------------------------------
// Fake Google

interface Seen {
  method: string;
  path: string;
  body: string;
}

async function fakeGoogle() {
  const seen: Seen[] = [];
  const state = { grant: 'ok' as 'ok' | 'revoked', sheetGone: false, created: 0 };
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      const path = req.url ?? '';
      seen.push({ method: req.method ?? '', path, body });
      const send = (status: number, value: unknown) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(value));
      };
      if (path === '/token') {
        const p = new URLSearchParams(body);
        if (p.get('grant_type') === 'authorization_code') {
          return p.get('code') === 'good-code' ? send(200, { access_token: 'at-1', refresh_token: 'rt-secret-1', scope: 'https://www.googleapis.com/auth/drive.file' }) : send(400, { error: 'invalid_grant' });
        }
        return state.grant === 'ok' && p.get('refresh_token') === 'rt-secret-1' ? send(200, { access_token: 'at-2' }) : send(400, { error: 'invalid_grant' });
      }
      if (path === '/revoke') return send(200, {});
      if (req.headers.authorization !== 'Bearer at-2') return send(401, { error: { status: 'UNAUTHENTICATED' } });
      if (path === '/sheets' && req.method === 'POST') {
        state.created += 1;
        state.sheetGone = false;
        return send(200, { spreadsheetId: `sheet-${state.created}`, spreadsheetUrl: `https://docs.google.com/spreadsheets/d/sheet-${state.created}/edit` });
      }
      if (state.sheetGone) return send(404, { error: { status: 'NOT_FOUND' } });
      if (path.startsWith('/sheets/') && req.method === 'GET') return send(200, { sheets: [{ properties: { sheetId: 0, title: 'Replies', gridProperties: { rowCount: 1000, columnCount: 26 } }, bandedRanges: [{ bandedRangeId: 7 }] }] });
      if (path.includes(':batchUpdate')) return send(200, { replies: [] });
      send(404, { error: { status: 'NOT_FOUND' } });
    });
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  Object.assign(GOOGLE_ENDPOINTS, { auth: `${base}/auth`, token: `${base}/token`, revoke: `${base}/revoke`, sheets: `${base}/sheets` });
  return { seen, state, close: () => new Promise<void>((r) => server.close(() => r())) };
}

test('Google Sheets: connect (state + cookie), encrypted token, first sync, live re-sync, gone file, revoked grant, disconnect', async () => {
  const google = await fakeGoogle();
  const env = { ...process.env };
  process.env.GOOGLE_CLIENT_ID = 'client-id.apps.googleusercontent.com';
  process.env.GOOGLE_CLIENT_SECRET = 'client-secret';
  process.env.GOOGLE_TOKEN_KEY = 'z'.repeat(48);
  try {
    const adapter = new LocalAdapter(tmpDir());
    const { site } = await createSiteWithKeys(adapter, { slug: 'g128-sheets', theme: 'blush-garden-rose', content: formContent() });
    await publishSite(adapter, site.id);
    for (const r of REPLIES) await adapter.saveRsvp(site.id, { ...r, answers: r.answers, party: r.party });
    assert.equal((await sheetsStatus(adapter, site)).connected, false);

    const origin = 'https://davetiye-platform-five.vercel.app';
    const { url, state } = await startConnect(adapter, site, origin);
    const u = new URL(url);
    assert.equal(u.searchParams.get('scope'), 'https://www.googleapis.com/auth/drive.file');
    assert.equal(u.searchParams.get('redirect_uri'), `${origin}/api/google/callback`);
    assert.equal(u.searchParams.get('access_type'), 'offline');
    assert.equal(u.searchParams.get('state'), state);

    // another browser (no / other cookie) cannot finish it; nor a forged state
    assert.deepEqual(await finishConnect(adapter, { state, code: 'good-code', error: null, cookieState: null }, origin), { ok: false, slug: 'g128-sheets', reason: 'state' });
    const forged = `g128-sheets.${'A'.repeat(43)}`;
    assert.equal((await finishConnect(adapter, { state: forged, code: 'good-code', error: null, cookieState: forged }, origin)).ok, false);

    // the forged try used the pending state up: start again (used once)
    const again = await startConnect(adapter, site, origin);
    const done = await finishConnect(adapter, { state: again.state, code: 'good-code', error: null, cookieState: again.state }, origin);
    assert.deepEqual(done, { ok: true, slug: 'g128-sheets' });
    assert.equal((await finishConnect(adapter, { state: again.state, code: 'good-code', error: null, cookieState: again.state }, origin)).ok, false, 'state used once');

    const doc = (await readDoc(adapter, site.id)) as SheetsDoc;
    assert.ok(doc.token && !doc.token.includes('rt-secret'), 'refresh token stored encrypted');
    assert.equal(doc.spreadsheetId, 'sheet-1');
    let status = await sheetsStatus(adapter, site);
    assert.equal(status.connected, true);
    assert.equal(status.url, 'https://docs.google.com/spreadsheets/d/sheet-1/edit');
    assert.ok(status.lastSyncAt);
    assert.equal(JSON.stringify(status).includes('rt-'), false);

    const create = google.seen.find((s) => s.path === '/sheets' && s.method === 'POST')!;
    assert.match(create.body, /RSVP replies/);
    const batch = JSON.parse(google.seen.filter((s) => s.path.includes(':batchUpdate')).at(-1)!.body) as { requests: Array<Record<string, any>> };
    const kinds = batch.requests.map((r) => Object.keys(r)[0]);
    for (const k of ['updateSpreadsheetProperties', 'deleteBanding', 'addSheet', 'updateCells', 'repeatCell', 'addBanding', 'setBasicFilter', 'mergeCells']) assert.ok(kinds.includes(k), k);
    const values = batch.requests.find((r) => r.updateCells?.rows)!.updateCells.rows as Array<{ values: Array<{ userEnteredValue?: Record<string, unknown> }> }>;
    assert.equal(values[0].values[6].userEnteredValue!.stringValue, 'Meal choice');
    assert.equal(values[1].values[3].userEnteredValue!.numberValue, 3);
    assert.equal(values[1].values[12].userEnteredValue!.stringValue, '=HYPERLINK("x")', 'text, never formulaValue');
    assert.ok(!JSON.stringify(batch).includes('formulaValue'));

    // a new reply: the same spreadsheet is rewritten
    await adapter.saveRsvp(site.id, { name: 'New Guest', attending: true, guests: 1, answers: [{ id: 'meal', question: 'Meal choice', answer: 'Beef' }] });
    await syncSheet(adapter, site.id);
    assert.equal(google.state.created, 1);
    // the couple deleted the file: a new one is made
    google.state.sheetGone = true;
    await syncSheet(adapter, site.id);
    assert.equal((await readDoc(adapter, site.id))!.spreadsheetId, 'sheet-2');
    // Google no longer accepts the grant: "Connect again"
    google.state.grant = 'revoked';
    await syncSheet(adapter, site.id);
    status = await sheetsStatus(adapter, site);
    assert.equal(status.reconnect, true);
    assert.match(status.error!, /connect Google Sheets again/);

    await disconnect(adapter, site);
    assert.equal(await readDoc(adapter, site.id), null);
    assert.ok(google.seen.some((s) => s.path === '/revoke' && s.body.includes('rt-secret-1')));
    // documents go with the site
    await startConnect(adapter, site, origin);
    await adapter.deleteSite(site.id);
    assert.equal(await adapter.readSiteDoc(site.id, DOC), null);
  } finally {
    process.env = env;
    await google.close();
  }
});
