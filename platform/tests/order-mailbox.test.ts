// G192: confirming Etsy orders from the shop's Gmail (Etsy's signed "You made a sale" emails, lib/mailbox) in trust mode.
// The mailbox is a fake (plus one real IMAP connection to a closed local port): nothing leaves the machine.
import { before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, Socket } from 'node:net';
import path from 'node:path';
import { POST as claimRoute } from '../app/api/start/route.ts';
import { POST as sessionPost } from '../app/api/admin/session/route.ts';
import { POST as connPost } from '../app/api/admin/connections/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { setEditLinkMailer } from '../lib/claim/mailer.ts';
import { sweepProvisionalOrders, TRUST_WINDOW_MS } from '../lib/claim/trust.ts';
import { ChainOrderVerifier, setOrderVerifier, TrustOrderVerifier, type OrderCheck, type OrderVerifier } from '../lib/claim/verify.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { setShopNotifier } from '../lib/mail/index.ts';
import { mailboxSetup } from '../lib/mailbox/config.ts';
import { ImapOrderMailbox, type OrderMailbox } from '../lib/mailbox/imap.ts';
import { authResultsOf, etsyAuthenticated, htmlToText, judgeOrderMails, orderMentioned, type OrderMail } from '../lib/mailbox/orders.ts';
import { textPart } from '../lib/mailbox/imap.ts';
import { mailboxStatus, MailOrderVerifier } from '../lib/mailbox/verify.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const BASE = 'http://localhost:3000';
const PASSWORD = 'correct horse battery staple';
type Json = Record<string, any>;

before(() => {
  const themes = tmpDir('mailbox-themes-');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), path.join(themes, '_sample'), { recursive: true });
  const dir = path.join(themes, 'sample-design');
  cpSync(path.join(PLATFORM_ROOT, 'themes/_sample'), dir, { recursive: true });
  const manifest = JSON.parse(readFileSync(path.join(dir, 'theme.json'), 'utf8'));
  manifest.id = 'sample-design';
  delete manifest.internal;
  writeFileSync(path.join(dir, 'theme.json'), JSON.stringify(manifest));
  writeFileSync(path.join(dir, 'content.demo.json'), JSON.stringify(demoContent()));
  process.env.PLATFORM_THEMES_DIR = themes;
  process.env.PLATFORM_DATA_DIR = tmpDir('mailbox-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
});

const ENV = ['CLAIM_ORDER_VERIFICATION', 'ORDER_MAIL_USER', 'ORDER_MAIL_PASS', 'ORDER_MAIL_HOST', 'ORDER_MAIL_PORT', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ETSY_API_KEY', 'ETSY_SHARED_SECRET', 'GOOGLE_TOKEN_KEY'];
beforeEach(() => {
  for (const k of ENV) delete process.env[k];
  process.env.ADMIN_PASSWORD = PASSWORD;
  setClaimRateLimiter(new MemoryRateLimiter());
  setOrderVerifier(null);
  setEditLinkMailer(null);
  setShopNotifier({ enabled: false, pendingOrder: async () => ({ sent: false }) });
});

// ---------------------------------------------------------------------------------------------
// Fixtures: what Gmail hands over for Etsy's mails

const GMAIL_AUTH = 'mx.google.com; dkim=pass header.i=@etsy.com header.s=s1 header.b=abc; spf=pass (google.com: domain of transaction@etsy.com designates 1.2.3.4 as permitted sender) smtp.mailfrom=transaction@etsy.com; dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=etsy.com';

function saleMail(order: string, over: Partial<OrderMail> = {}): OrderMail {
  return {
    from: 'transaction@etsy.com',
    subject: `You made a sale on Etsy - Ship by Oct 25 - [$24.50, Order #${order}]`,
    authResults: [GMAIL_AUTH],
    text: `Congratulations! Order number: ${order}\nItem: Olive & Ivory wedding website\nListing #4433221100\nTransaction ID: 5566778899`,
    ...over,
  };
}

function fakeBox(mails: Record<string, OrderMail[]>, log: { opened: number; closed: number; asked: string[] } = { opened: 0, closed: 0, asked: [] }) {
  return {
    log,
    factory: (): OrderMailbox => {
      log.opened++;
      return {
        async find(n: string) {
          log.asked.push(n);
          if (n === 'boom') throw Object.assign(new Error('x'), { code: 'ECONNRESET' });
          return mails[n] ?? [];
        },
        async close() {
          log.closed++;
        },
      };
    },
  };
}

const input = (orderNumber: string) => ({ orderNumber, email: 'a@example.test', theme: 'sample-design' });
const fixed = (r: OrderCheck, asked: string[] = []): OrderVerifier => ({ kind: 'fixed', check: async (i) => (asked.push(i.orderNumber), r) });

// ---------------------------------------------------------------------------------------------

test('settings: ORDER_MAIL_*; else the Gmail SMTP sign-in; never another SMTP host', () => {
  assert.deepEqual(mailboxSetup({}), { state: 'missing', missing: ['ORDER_MAIL_USER', 'ORDER_MAIL_PASS'] });
  assert.deepEqual(mailboxSetup({ ORDER_MAIL_USER: 'shop@gmail.com' }), { state: 'missing', missing: ['ORDER_MAIL_PASS'] });
  const own = mailboxSetup({ ORDER_MAIL_USER: 'shop@gmail.com', ORDER_MAIL_PASS: 'abcd efgh ijkl mnop' });
  assert.deepEqual(own, { state: 'ready', config: { host: 'imap.gmail.com', port: 993, user: 'shop@gmail.com', pass: 'abcdefghijklmnop', source: 'order_mail' } });
  const smtp = mailboxSetup({ SMTP_HOST: 'smtp.gmail.com', SMTP_USER: 'send@gmail.com', SMTP_PASS: 'pw' });
  assert.equal(smtp.state === 'ready' && smtp.config.source, 'smtp');
  assert.equal(mailboxSetup({ SMTP_HOST: 'smtp.example.com', SMTP_USER: 'u', SMTP_PASS: 'p' }).state, 'missing');
  assert.deepEqual(mailboxStatus({ ORDER_MAIL_USER: 'shop@gmail.com', ORDER_MAIL_PASS: 'x' }), { enabled: true, missing: [], user: 'sh***@gmail.com', source: 'order_mail' });
});

test('only mails Gmail itself vouches for as Etsy count (topmost Authentication-Results, DMARC aligned)', () => {
  assert.equal(etsyAuthenticated(saleMail('1')), true);
  assert.equal(etsyAuthenticated({ from: 'transaction@mail.etsy.com', authResults: [GMAIL_AUTH.replace('header.from=etsy.com', 'header.from=mail.etsy.com')] }), true);
  // look-alike sender
  assert.equal(etsyAuthenticated({ from: 'transaction@etsy.com.evil.test', authResults: [GMAIL_AUTH.replace('header.from=etsy.com', 'header.from=etsy.com.evil.test')] }), false);
  assert.equal(etsyAuthenticated({ from: 'shop@notetsy.com', authResults: [GMAIL_AUTH.replace('header.from=etsy.com', 'header.from=notetsy.com')] }), false);
  // Gmail says DMARC failed; a "pass" written further down by the sender does not help
  assert.equal(etsyAuthenticated({ from: 'transaction@etsy.com', authResults: [GMAIL_AUTH.replace('dmarc=pass', 'dmarc=fail'), GMAIL_AUTH] }), false);
  // the top header is not Gmail's
  assert.equal(etsyAuthenticated({ from: 'transaction@etsy.com', authResults: [GMAIL_AUTH.replace('mx.google.com', 'relay.evil.test')] }), false);
  // DMARC passed for another domain than the From address
  assert.equal(etsyAuthenticated({ from: 'transaction@etsy.com', authResults: [GMAIL_AUTH.replace('header.from=etsy.com', 'header.from=evil.test')] }), false);
  assert.equal(etsyAuthenticated({ from: 'transaction@etsy.com', authResults: [] }), false);
  // folded header lines
  assert.deepEqual(authResultsOf('Authentication-Results: mx.google.com;\r\n       dmarc=pass header.from=etsy.com\r\nX-Other: 1\r\nAuthentication-Results: b'), ['mx.google.com; dmarc=pass header.from=etsy.com', 'b']);
});

test('the number counts only as an ORDER number; listing numbers and Etsy messages never confirm', () => {
  const order = '3456789012';
  assert.equal(orderMentioned('[$24.50, Order #3456789012]', order), true);
  assert.equal(orderMentioned('Order number: 3456789012', order), true);
  assert.equal(orderMentioned('Sipariş numarası: 3456789012', order), true);
  assert.equal(orderMentioned('Order details — Listing #3456789012', order), false);
  assert.equal(orderMentioned('Order #34567890123', order), false, 'part of a longer number');
  assert.deepEqual(judgeOrderMails([saleMail(order)], order), { sale: true, cancelled: false });
  // a public listing number from a real sale mail
  assert.deepEqual(judgeOrderMails([saleMail(order)], '4433221100'), { sale: false, cancelled: false });
  assert.deepEqual(judgeOrderMails([saleMail(order)], '5566778899'), { sale: false, cancelled: false }, 'transaction id');
  // a buyer types the number into an Etsy message: signed by Etsy, but not a sale mail
  assert.deepEqual(judgeOrderMails([saleMail(order, { subject: 'Etsy Conversation with Ann', text: `my Order #${order}` })], order), { sale: false, cancelled: false });
  // a forged sale mail
  assert.deepEqual(judgeOrderMails([saleMail(order, { authResults: [GMAIL_AUTH.replace('dmarc=pass', 'dmarc=fail')] })], order), { sale: false, cancelled: false });
  // cancellation wins
  const cancel = saleMail(order, { subject: `Order #${order} has been cancelled`, text: '' });
  assert.deepEqual(judgeOrderMails([saleMail(order), cancel], order), { sale: true, cancelled: true });
  // Turkish account language
  assert.deepEqual(judgeOrderMails([saleMail(order, { subject: `Etsy'de bir satış yaptınız - Sipariş #${order}`, text: '' })], order), { sale: true, cancelled: false });
  // HTML-only mail
  assert.match(htmlToText('<p>Order&nbsp;&#35;3456789012</p><style>.x{}</style>'), /Order #3456789012/);
  assert.deepEqual(textPart({ childNodes: [{ part: '1', type: 'text/html' }, { part: '2', type: 'text/plain' }] }), { id: '2', html: false });
  assert.deepEqual(textPart({ childNodes: [{ part: '1', type: 'text/html' }, { part: '2', type: 'text/plain', disposition: 'attachment' }] }), { id: '1', html: true });
});

test('MailOrderVerifier: sale -> verified, cancelled -> rejected, nothing -> pending, failure -> unavailable', async () => {
  const order = '3456789013';
  const box = fakeBox({ [order]: [saleMail(order)], '3456789014': [saleMail('3456789014', { subject: 'Order #3456789014 refunded' })] });
  const v = new MailOrderVerifier({ mailbox: box.factory });
  // G951: the sale mail's item line names our design: one design website (a mail's count is information, source "mail")
  assert.deepEqual(await v.check(input(order)), { result: 'verified', source: 'mail', units: 1 });
  assert.deepEqual(await v.check(input('3456789014')), { result: 'rejected', reason: 'not_paid' });
  assert.deepEqual(await v.check(input('3456789015')), { result: 'pending' }, 'no mail (yet) decides nothing');
  assert.deepEqual(await v.check(input('boom')), { result: 'unavailable' });
  assert.equal(box.log.opened, 4, 'one connection per check on /start');
  assert.equal(box.log.closed, 4, 'always closed');
  assert.deepEqual(await new MailOrderVerifier({ mailbox: () => null }).check(input(order)), { result: 'pending' }, 'not set up');
  // the hourly sweep: one connection for many checks
  const keep = fakeBox({ [order]: [saleMail(order)] });
  const kv = new MailOrderVerifier({ mailbox: keep.factory, keepOpen: true });
  await kv.check(input(order));
  await kv.check(input('3456789015'));
  assert.deepEqual([keep.log.opened, keep.log.closed], [1, 0]);
  await kv.close();
  assert.equal(keep.log.closed, 1);
});

test('chain: Etsy first; its receipt (even unpaid) is final; otherwise the mailbox decides', async () => {
  const mailAsked: string[] = [];
  const mail = fixed({ result: 'verified' }, mailAsked);
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'pending' }), mail]).check(input('1')), { result: 'verified' }, 'Etsy not connected -> mail');
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'unavailable' }), mail]).check(input('2')), { result: 'verified' });
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'rejected', reason: 'not_found' }), mail]).check(input('3')), { result: 'rejected', reason: 'not_found' });
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'pending', units: 2, unpaid: true }), mail]).check(input('4')), { result: 'pending', units: 2, unpaid: true });
  assert.deepEqual(mailAsked, ['1', '2'], 'the mail never overrules Etsy');
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'unavailable' }), fixed({ result: 'pending' })]).check(input('5')), { result: 'pending' });
  assert.deepEqual(await new ChainOrderVerifier([fixed({ result: 'unavailable' }), fixed({ result: 'unavailable' })]).check(input('6')), { result: 'unavailable' });
  // trust mode maps the open answers to provisional
  const trust = (r: OrderCheck) => new TrustOrderVerifier({ inner: new ChainOrderVerifier([fixed({ result: 'pending' }), fixed(r)]) }).check(input('7'));
  assert.deepEqual(await trust({ result: 'verified' }), { result: 'verified' });
  assert.deepEqual(await trust({ result: 'pending' }), { result: 'provisional' });
  assert.deepEqual(await trust({ result: 'unavailable' }), { result: 'provisional' });
});

let ip = 0;
async function claim(order: string): Promise<{ status: number; body: Json }> {
  const res = await claimRoute(
    new Request(`${BASE}/api/start`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': `198.51.100.${(++ip % 250) + 1}` },
      body: JSON.stringify({ theme: 'sample-design', orderNumber: order, email: 'avery@example.test', names: ['Avery', 'Jordan'], slug: '', website: '' }),
    }),
  );
  return { status: res.status, body: (await res.json()) as Json };
}

test('/start in trust mode: a sale mail verifies at once; a cancelled order is refused; no mail -> provisional', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  const box = fakeBox({ '7400000001': [saleMail('7400000001')], '7400000002': [saleMail('7400000002', { subject: 'Order #7400000002 was canceled' })] });
  setOrderVerifier(new TrustOrderVerifier({ inner: new ChainOrderVerifier([fixed({ result: 'pending' }), new MailOrderVerifier({ mailbox: box.factory })]) }));
  const adapter = getDataAdapter();
  assert.equal((await claim('7400000001')).status, 201);
  assert.equal((await adapter.findSitesByOrderRef('7400000001'))[0].orderCheck?.status, 'verified');
  assert.equal((await claim('7400000002')).status, 403);
  assert.equal((await claim('7400000003')).status, 201);
  assert.equal((await adapter.findSitesByOrderRef('7400000003'))[0].orderCheck?.status, 'provisional');
});

test('hourly sweep with the mailbox: sale -> verified, cancellation -> held; no mail after 48 h only reminds', async () => {
  process.env.CLAIM_ORDER_VERIFICATION = 'trust';
  setOrderVerifier(new TrustOrderVerifier({ inner: fixed({ result: 'pending' }) }));
  const adapter = getDataAdapter();
  for (const o of ['7400000011', '7400000012', '7400000013']) assert.equal((await claim(o)).status, 201);
  const box = fakeBox({ '7400000011': [saleMail('7400000011')], '7400000012': [saleMail('7400000012', { subject: 'Refund issued for Order #7400000012' })] });
  const verifier = new MailOrderVerifier({ mailbox: box.factory, keepOpen: true });
  const s = await sweepProvisionalOrders(adapter, { verifier, now: new Date(Date.now() + TRUST_WINDOW_MS + 60_000) });
  await verifier.close();
  const r = (o: string) => s.results.find((x) => x.orderRef === o);
  assert.equal(r('7400000011')?.result, 'verified');
  assert.deepEqual([r('7400000012')?.result, r('7400000012')?.reason], ['held', 'not_paid']);
  assert.equal(r('7400000013')?.result, 'review', 'no sale mail: the shop is told, the site is not taken down');
  assert.equal((await adapter.findSitesByOrderRef('7400000013'))[0].orderCheck?.status, 'provisional');
  assert.equal(box.log.opened, 1, 'one IMAP connection for the run');
});

test('real IMAP client: a closed port is "unavailable" quickly; the password is never logged', async () => {
  const srv = createServer();
  await new Promise<void>((r) => srv.listen(0, '127.0.0.1', () => r()));
  const port = (srv.address() as { port: number }).port;
  await new Promise<void>((r) => srv.close(() => r()));
  const logs: string[] = [];
  const orig = console.error;
  console.error = (...a: unknown[]) => void logs.push(a.map(String).join(' '));
  try {
    const v = new MailOrderVerifier({ mailbox: () => new ImapOrderMailbox({ host: '127.0.0.1', port, user: 'shop@gmail.com', pass: 'pw-not-logged', source: 'order_mail' }) });
    const t0 = Date.now();
    assert.deepEqual(await v.check(input('7400000021')), { result: 'unavailable' });
    assert.ok(Date.now() - t0 < 10_000);
  } finally {
    console.error = orig;
  }
  assert.ok(logs.some((l) => l.startsWith('[mailbox] order check unavailable: ')));
  assert.ok(!logs.join('\n').includes('pw-not-logged') && !logs.join('\n').includes('shop@gmail.com'));
});

test('admin "Gelen kutusunu dene" without settings: a Turkish answer naming the env names', async () => {
  const login = await sessionPost(new Request(`${BASE}/api/admin/session`, { method: 'POST', headers: { 'content-type': 'application/json', host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ password: PASSWORD }) }));
  const cookie = (login.headers.get('set-cookie') ?? '').split(';')[0];
  const res = await connPost(new Request(`${BASE}/api/admin/connections`, { method: 'POST', headers: { 'content-type': 'application/json', cookie, host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ action: 'mailbox-test' }) }));
  const body = (await res.json()) as Json;
  assert.equal(res.status, 502);
  assert.match(body.message, /ORDER_MAIL_USER/);
  const sweep = await connPost(new Request(`${BASE}/api/admin/connections`, { method: 'POST', headers: { 'content-type': 'application/json', cookie, host: 'localhost:3000', origin: BASE }, body: JSON.stringify({ action: 'trust-sweep' }) }));
  assert.equal(sweep.status, 200);
  assert.equal(((await sweep.json()) as Json).trust.etsy, false, 'nobody to ask: nothing decided');
});

test('IMAP against a local Gmail-like server: All Mail, X-GM-RAW search, headers and text part, read-only', async () => {
  // @ts-expect-error: the test server ships no types
  const { default: hoodiecrow } = (await import('hoodiecrow-imap')) as { default: (o: unknown) => any };
  const crlf = (lines: string[]) => lines.join('\r\n');
  const sale = (order: string, auth = GMAIL_AUTH, from = 'Etsy <transaction@etsy.com>') =>
    crlf([
      `Authentication-Results: ${auth.slice(0, 40)}`,
      ` ${auth.slice(40)}`,
      `From: ${from}`,
      'To: shop@gmail.com',
      `Subject: You made a sale on Etsy - [$24.50, Order #${order}]`,
      'MIME-Version: 1.0',
      'Content-Type: multipart/alternative; boundary="b1"',
      '',
      '--b1',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      `Congratulations! Order number: ${order}=0AListing #4433221100`,
      '--b1',
      'Content-Type: text/html; charset=utf-8',
      '',
      `<p>Order #${order}</p>`,
      '--b1--',
      '',
    ]);
  const server = hoodiecrow({
    plugins: ['SPECIAL-USE', 'X-GM-EXT-1'],
    storage: {
      INBOX: { messages: [{ raw: crlf(['From: friend@example.test', 'Subject: hi', '', 'Order #7400000031 is mine']) }] },
      '': {
        separator: '/',
        folders: {
          '[Gmail]': {
            flags: ['\\Noselect'],
            folders: {
              'All Mail': {
                'special-use': '\\All',
                messages: [
                  { raw: sale('7400000031'), flags: [] },
                  { raw: sale('7400000032', GMAIL_AUTH.replace('dmarc=pass', 'dmarc=fail')), flags: [] },
                  { raw: crlf(['From: friend@example.test', 'Subject: You made a sale', '', 'Order #7400000033']), flags: [] },
                ],
              },
            },
          },
        },
      },
    },
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  const port = server.address().port as number;
  const cfg = { host: '127.0.0.1', port, user: 'testuser', pass: 'testpass', source: 'order_mail' as const, secure: false };
  try {
    const box = new ImapOrderMailbox(cfg);
    const found = await box.find('7400000031');
    assert.equal(found.length, 1, 'only Etsy mails; the INBOX copy from a friend is not "from:etsy.com"');
    assert.equal(found[0].from, 'transaction@etsy.com');
    assert.match(found[0].subject, /Order #7400000031/);
    assert.equal(etsyAuthenticated(found[0]), true, 'the folded header is unfolded');
    assert.match(found[0].text, /Order number: 7400000031\nListing #4433221100/, 'quoted-printable decoded, text/plain chosen');
    assert.deepEqual(await box.find('7400000099'), []);
    await box.close();
    const v = (o: string) => new MailOrderVerifier({ mailbox: () => new ImapOrderMailbox(cfg) }).check(input(o));
    assert.deepEqual(await v('7400000031'), { result: 'verified', source: 'mail' }, 'no item line of ours: the lines are not known');
    assert.deepEqual(await v('7400000032'), { result: 'pending' }, 'DMARC failed: does not count');
    assert.deepEqual(await v('7400000033'), { result: 'pending' }, 'not from Etsy');
    assert.deepEqual(await v('4433221100'), { result: 'pending' }, 'a listing number in a real sale mail');
    // nothing was changed in the mailbox (opened read-only; the fetch never sets \Seen)
    const after = await new Promise<string>((r) => {
      const c = new Socket();
      let buf = '';
      const sent = new Set<string>();
      c.connect(port, '127.0.0.1');
      c.on('data', (d: Buffer) => {
        buf += d.toString();
        // one command at a time (the server refuses pipelined commands with message numbers)
        const next = buf.includes('A2 OK') ? 'A3 LOGOUT' : buf.includes('A1 OK') ? 'A2 FETCH 1:* (FLAGS)' : buf.includes('A0 OK') ? 'A1 EXAMINE "[Gmail]/All Mail"' : null;
        if (next && !sent.has(next)) {
          sent.add(next);
          c.write(`${next}\r\n`);
        }
        if (buf.includes('A3 OK')) r(buf);
      });
      c.write('A0 LOGIN testuser testpass\r\n');
    });
    const fetched = after.split(/\r\n/).filter((l) => /^\* \d+ FETCH/.test(l));
    assert.equal(fetched.length, 3);
    assert.ok(fetched.every((l) => !l.includes('\\Seen')), `no message marked read: ${fetched.join(' | ')}`);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
  }
});
