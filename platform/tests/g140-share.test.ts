// G140: Share — ready messages, app links, QR ink, the design colour, the card PDF; Excel headers + filter + Summary.
import assert from 'node:assert/strict';
import test from 'node:test';
import ExcelJS from 'exceljs';
import { jpegPdf } from '../lib/panel/card-pdf.ts';
import { contrast, messageKinds, qrInk, QR_LIGHT, SHARE_LABELS, shareAppLinks, shareMessage } from '../lib/panel/share.ts';
import { panelTheme, themeColor } from '../lib/panel/state.ts';
import { rsvpWorkbook } from '../lib/rsvp/xlsx.ts';

const URL_ = 'https://bke.example.net/avery-and-jordan';
const FACTS = { names: 'Avery & Jordan', date: 'Saturday, June 12, 2027', replyBy: 'May 1, 2027', url: URL_ };

test('messages: names, date, reply date and link filled in; password only when asked', () => {
  const invite = shareMessage('invite', FACTS);
  assert.match(invite, /June 12, 2027/);
  assert.match(invite, /reply by May 1, 2027/);
  assert.ok(invite.split('\n').includes(URL_), 'the link has its own line');
  assert.match(invite, /save the link/);
  assert.match(invite, /— Avery & Jordan$/);
  assert.doesNotMatch(invite, /Password/);
  assert.match(shareMessage('invite', { ...FACTS, password: 'OliveRiver27' }), /\nPassword: OliveRiver27\n/);
  assert.match(shareMessage('reminder', FACTS), /^A friendly reminder: please reply by May 1, 2027\./);
  assert.match(shareMessage('thanks', FACTS), /^Thank you for celebrating with us!/);
  assert.doesNotMatch(shareMessage('invite', { ...FACTS, replyBy: null }), /reply/);
  assert.deepEqual(messageKinds(false, 'May 1, 2027'), ['invite', 'reminder']);
  assert.deepEqual(messageKinds(false, null), ['invite']);
  assert.deepEqual(messageKinds(true, 'May 1, 2027'), ['thanks']);
});

test('app links: encoded message; phone-only apps marked; Telegram gets the link once', () => {
  const msg = shareMessage('invite', FACTS);
  const links = Object.fromEntries(shareAppLinks(msg, URL_, SHARE_LABELS.emailSubject).map((l) => [l.app, l]));
  assert.deepEqual(Object.keys(links), ['whatsapp', 'sms', 'email', 'messenger', 'telegram']);
  assert.equal(decodeURIComponent(new URL(links.whatsapp.href).searchParams.get('text')!), msg);
  assert.ok(links.sms.href.startsWith('sms:?&body=') && links.sms.phoneOnly);
  assert.ok(links.email.href.startsWith('mailto:?subject=Our%20wedding%20website&body='));
  assert.ok(links.messenger.phoneOnly && links.messenger.href.includes(encodeURIComponent(URL_)));
  const tg = new URL(links.telegram.href);
  assert.equal(tg.searchParams.get('url'), URL_);
  assert.ok(!tg.searchParams.get('text')!.includes(URL_));
  assert.ok(!links.whatsapp.phoneOnly && !links.telegram.phoneOnly);
});

test('QR ink: the design colour darkened to ≥ 7:1 on white; dark colours kept', () => {
  for (const c of ['#F2D8D7', '#D8EEF6', '#DED8B8', '#E8FCF8', '#0A1729', '#39090e']) {
    const ink = qrInk(c)!;
    assert.match(ink, /^#[0-9a-f]{6}$/);
    assert.ok(contrast(ink, QR_LIGHT) >= 7, `${c} -> ${ink}`);
  }
  assert.equal(qrInk('#0a1729'), '#0a1729');
  assert.equal(qrInk(null), null);
  assert.equal(qrInk('red'), null);
});

test('design colour: read from theme-color; panelTheme carries colour + share image', async () => {
  assert.equal(themeColor('<meta charset="utf-8"><meta name="theme-color" content="#F2D8D7">'), '#f2d8d7');
  assert.equal(themeColor("<meta content='#abc' name='theme-color'>"), '#aabbcc');
  assert.equal(themeColor('<meta name="theme-color" content="rebeccapurple">'), null);
  assert.equal(themeColor(null), null);
  const t = await panelTheme('blush-garden-rose');
  assert.match(t.color ?? '', /^#[0-9a-f]{6}$/);
  assert.equal(t.shareImage, '/themes/blush-garden-rose/img/og-1200x630.jpg');
});

test('card PDF: one 4 × 6 in page, JPEG unchanged, xref offsets point at the objects', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 0xff, 0xd9]);
  const pdf = jpegPdf(jpeg, 1200, 1800, 288, 432, 'Avery & Jordan (card)');
  const text = Buffer.from(pdf).toString('latin1');
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.match(text, /\/MediaBox \[0 0 288 432\]/);
  assert.match(text, /\/Filter \/DCTDecode \/Length 9 >>/);
  assert.ok(Buffer.from(pdf).includes(Buffer.from(jpeg)));
  assert.match(text, /\/Title \(Avery & Jordan \\\(card\\\)\)/);
  const xref = Number(/startxref\n(\d+)/.exec(text)![1]);
  assert.ok(text.slice(xref).startsWith('xref'));
  const offsets = text.slice(xref).split('\n').slice(3, 9).map((l) => Number(l.slice(0, 10)));
  offsets.forEach((o, i) => assert.ok(text.slice(o).startsWith(`${i + 1} 0 obj`), `object ${i + 1}`));
  assert.throws(() => jpegPdf(new Uint8Array([1, 2]), 1, 1, 1, 1));
});

test('Excel (K45 item 2): Replies headers in order, filter over every row, Summary counts', async () => {
  const content = { name_display: 'Avery & Jordan', timezone: 'America/New_York', locale: 'en-US', rsvp: { deadline: '2027-05-01', questions: [] } };
  const at = '2027-03-01T15:00:00Z';
  const replies = [
    { id: 'a', name: 'Sam Lee', attending: true, guests: 2, email: 'sam@example.net', message: 'Yay', answers: [], createdAt: at, source: 'guest' },
    { id: 'b', name: 'Kim Roe', attending: false, guests: 0, answers: [], createdAt: at, source: 'guest' },
  ];
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(Buffer.from(await rsvpWorkbook(replies as never, content, new Date('2027-03-04T12:00:00Z'))) as unknown as ArrayBuffer);
  const ws = wb.getWorksheet('Replies')!;
  const headers = (ws.getRow(1).values as unknown[]).slice(1);
  assert.deepEqual(headers.slice(0, 4), ['Submitted', 'Name', 'Attending', 'Guests']);
  assert.ok(headers.includes('Email') && headers.includes('Note for the couple'));
  assert.equal(ws.rowCount, 3);
  // read back, exceljs gives the filter as its range ("A1:L3"): header row to the last reply, every column
  const last = ws.getRow(1).getCell(headers.length).address.replace(/\d+$/, '');
  assert.equal(String(ws.autoFilter), `A1:${last}3`);
  const summary = wb.getWorksheet('Summary')!;
  const cells: string[] = [];
  summary.eachRow((row) => cells.push((row.values as unknown[]).slice(1).join('|')));
  assert.ok(cells.some((c) => /^Replies\|2/.test(c) || /\|2$/.test(c)), cells.join('\n'));
});
