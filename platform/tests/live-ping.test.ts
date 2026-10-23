// G966: scripts/live-ping.mjs, the read-only hourly check of the live site (.github/workflows/live-check.yml), against a
// local stub server: pass with the allowed 404s, a failing page, a placeholder on a legal page (visible text only),
// redirects (same origin followed, another host refused), the time limit, and usage errors. TLS is skipped on localhost.
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { fileURLToPath } from 'node:url';

const SCRIPT = fileURLToPath(new URL('../scripts/live-ping.mjs', import.meta.url));
const page = (body: string) => `<!doctype html><html lang="en"><head><title>t</title></head><body>${body}</body></html>`;

type Route = { status: number; body?: string; type?: string; location?: string; delayMs?: number };
let routes: Record<string, Route> = {};
let server: Server;
let base = '';

const healthy = (): Record<string, Route> => ({
  '/': { status: 200, body: page('BKE Studio') },
  '/start': { status: 200, body: page('Create your website') },
  '/start/demo/olive-ivory': { status: 200, body: page('Avery &amp; Jordan') },
  '/privacy': { status: 200, body: page('Privacy policy <script>self.x=["[POSTAL ADDRESS]"]</script> see note [1]') },
  '/terms': { status: 404, body: page('Not found') },
  '/kvkk': { status: 404, body: page('Not found') },
});

before(async () => {
  server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const r = routes[new URL(req.url ?? '/', 'http://x').pathname] ?? { status: 404, body: page('Not found') };
    const send = () => {
      const headers: Record<string, string> = { 'content-type': r.type ?? 'text/html; charset=utf-8' };
      if (r.location) headers.location = r.location;
      res.writeHead(r.status, headers);
      res.end(r.body ?? '');
    };
    if (r.delayMs) setTimeout(send, r.delayMs);
    else send();
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.closeAllConnections();
  server.close();
});

function run(args: string[]): Promise<{ code: number | null; out: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SCRIPT, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d: Buffer) => (out += d.toString()));
    child.stderr.on('data', (d: Buffer) => (out += d.toString()));
    child.on('close', (code) => resolve({ code, out }));
  });
}

const ALLOW = ['--allow-404', '/terms,/kvkk'];

test('healthy site: exit 0; the not-yet-deployed legal pages are warnings; script text and "[1]" are not placeholders', async () => {
  routes = healthy();
  const { code, out } = await run(['--base', base, ...ALLOW]);
  assert.equal(code, 0, out);
  assert.match(out, /SKIP TLS/);
  assert.match(out, /^OK {3}\/start — 200/m);
  assert.match(out, /^WARN \/terms — 404, page not deployed yet/m);
  assert.match(out, /PASSED: 6 checks, 0 FAIL, 2 WARN/);
});

test('a 404 is a failure without --allow-404, and a 500 always is', async () => {
  routes = healthy();
  let r = await run(['--base', base]);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /^FAIL \/terms — HTTP 404/m);
  routes = { ...healthy(), '/start': { status: 500, body: page('error') } };
  r = await run(['--base', base, ...ALLOW]);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /^FAIL \/start — HTTP 500/m);
});

test('a bracket placeholder in the visible text of a legal page fails (K56)', async () => {
  routes = { ...healthy(), '/terms': { status: 200, body: page('Seller: <b>[DATA CONTROLLER NAME]</b>') } };
  const { code, out } = await run(['--base', base, ...ALLOW]);
  assert.equal(code, 1, out);
  assert.match(out, /^FAIL \/terms — shows a placeholder \[DATA CONTROLLER NAME\]/m);
});

test('redirects: same origin is followed, another host fails; non-HTML fails', async () => {
  routes = { ...healthy(), '/start': { status: 308, location: '/start/' }, '/start/': { status: 200, body: page('start') } };
  let r = await run(['--base', base, ...ALLOW]);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^OK {3}\/start — 200 \(via \/start\/\)/m);
  routes = { ...healthy(), '/': { status: 302, location: 'https://elsewhere.example/' } };
  r = await run(['--base', base, ...ALLOW]);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /^FAIL \/ — HTTP 302 redirects to another host \(https:\/\/elsewhere\.example\)/m);
  routes = { ...healthy(), '/privacy': { status: 200, type: 'application/json', body: '{}' } };
  r = await run(['--base', base, ...ALLOW]);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /^FAIL \/privacy — not a complete HTML page/m);
});

test('time limit: slower than --max-ms fails, slower than --warn-ms warns', async () => {
  routes = { ...healthy(), '/start': { status: 200, body: page('slow'), delayMs: 700 } };
  let r = await run(['--base', base, ...ALLOW, '--max-ms', '300']);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /^FAIL \/start — no full answer within 300 ms/m);
  r = await run(['--base', base, ...ALLOW, '--max-ms', '5000', '--warn-ms', '200']);
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /^WARN \/start — 200, slow: \d+ ms \(> 200\)/m);
});

test('usage errors exit 2: not https, a path in the base, a path without "/"', async () => {
  for (const args of [['--base', 'http://bkestudio.com'], ['--base', 'https://bkestudio.com/start'], ['--base', base, '--paths', 'start']]) {
    const { code, out } = await run(args);
    assert.equal(code, 2, `${args.join(' ')}: ${out}`);
  }
});
