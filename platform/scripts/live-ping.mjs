#!/usr/bin/env node
// Read-only pulse check of the live site (G966). Opens a few public pages and checks their status codes, the TLS
// certificate and the response time. Creates no data, sends no secrets, needs no packages (Node 22 built-ins only:
// fetch, tls). Runs every hour from .github/workflows/live-check.yml; by hand from the repo root:
//
//   node platform/scripts/live-ping.mjs [--base https://bkestudio.com] [--paths /,/start,…] [--allow-404 /terms,/kvkk]
//                                       [--legal /privacy,/terms,/kvkk] [--max-ms 10000] [--warn-ms 4000]
//
// Per path: the final answer is 200 (redirects followed only on the same origin, at most 3; another host = FAIL), it is
// HTML (text/html, "<html" … "</html>"), and the whole body arrived within --max-ms (WARN above --warn-ms).
// --allow-404 paths may answer 404 (WARN "not deployed yet"): /terms and /kvkk until those pages are live — then drop the
// flag in the workflow. --legal pages must not show an UPPERCASE bracket placeholder ("[POSTAL ADDRESS]") in their visible
// text (K56: never shown publicly). https only (plain http only for localhost): the certificate must verify for the host
// and stay valid at least 7 more days (WARN under 21).
// Base: --base, else LIVE_BASE_URL, else https://bkestudio.com. Exit code: 0 = no FAIL, 1 = a FAIL, 2 = usage error.

import { connect } from 'node:tls';
import { parseArgs } from 'node:util';

const list = (s) => (s ?? '').split(',').map((p) => p.trim()).filter(Boolean);
const num = (s, d) => (/^\d{2,6}$/.test(s ?? '') ? Number(s) : d);

let values;
try {
  ({ values } = parseArgs({
    options: {
      base: { type: 'string' },
      paths: { type: 'string', default: '/,/start,/start/demo/olive-ivory,/privacy,/terms,/kvkk' },
      'allow-404': { type: 'string', default: '' },
      legal: { type: 'string', default: '/privacy,/terms,/kvkk' },
      'max-ms': { type: 'string', default: '10000' },
      'warn-ms': { type: 'string', default: '4000' },
    },
  }));
} catch (e) {
  console.error(String(e?.message ?? e));
  process.exit(2);
}

const base = (values.base || process.env.LIVE_BASE_URL || 'https://bkestudio.com').trim().replace(/\/+$/, '');
const isLocal = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/.test(base);
if (!/^https:\/\/[a-z0-9.-]+(:\d{1,5})?$/i.test(base) && !isLocal) {
  console.error(`Give the site root as https://<host> (plain http only for localhost), not "${base}".`);
  process.exit(2);
}
const paths = list(values.paths);
const allow404 = new Set(list(values['allow-404']));
const legal = new Set(list(values.legal));
const maxMs = num(values['max-ms'], 10_000);
const warnMs = Math.min(num(values['warn-ms'], 4_000), maxMs);
if (!paths.length || [...paths, ...allow404, ...legal].some((p) => !p.startsWith('/') || p.startsWith('//'))) {
  console.error('Paths start with one "/" (comma list).');
  process.exit(2);
}

let fails = 0;
let warns = 0;
const line = (kind, name, detail) => {
  if (kind === 'FAIL') fails++;
  if (kind === 'WARN') warns++;
  console.log(`${kind.padEnd(4)} ${name}${detail ? ` — ${detail}` : ''}`);
};

/** An UPPERCASE label in square brackets with at least one letter (lib/marketing/placeholders.ts, minus "[1]"-style notes). */
const PLACEHOLDER = /\[(?=[^\]]*[A-Z])[A-Z0-9][A-Z0-9 :./&_-]{2,}\]/;
/** What a reader sees: no scripts, styles, comments or tags. */
const visibleText = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');

/** GET with same-origin redirects; the whole body is read inside the time limit. */
async function fetchPage(path) {
  const started = performance.now();
  const signal = AbortSignal.timeout(maxMs);
  let url = new URL(path, `${base}/`);
  for (let hop = 0; ; hop++) {
    const res = await fetch(url, { redirect: 'manual', signal, headers: { 'user-agent': 'bke-live-ping/1 (read-only)', accept: 'text/html' } });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      await res.body?.cancel().catch(() => undefined);
      const next = new URL(res.headers.get('location'), url);
      if (next.origin !== url.origin) return { redirectedAway: next.origin, status: res.status, ms: performance.now() - started };
      if (hop >= 3) return { tooManyRedirects: true, status: res.status, ms: performance.now() - started };
      url = next;
      continue;
    }
    const body = await res.text();
    return { status: res.status, type: res.headers.get('content-type') ?? '', body, ms: performance.now() - started, finalPath: url.pathname };
  }
}

async function checkPath(path) {
  let r;
  try {
    r = await fetchPage(path);
  } catch (e) {
    const why = e?.name === 'TimeoutError' || e?.name === 'AbortError' ? `no full answer within ${maxMs} ms` : `network error ${e?.cause?.code ?? e?.name ?? 'error'}`;
    line('FAIL', path, why);
    return;
  }
  const ms = Math.round(r.ms);
  if (r.redirectedAway) return line('FAIL', path, `HTTP ${r.status} redirects to another host (${r.redirectedAway})`);
  if (r.tooManyRedirects) return line('FAIL', path, 'more than 3 redirects');
  const via = r.finalPath !== path ? ` (via ${r.finalPath})` : '';
  if (r.status === 404 && allow404.has(path)) return line('WARN', path, `404, page not deployed yet (allowed), ${ms} ms`);
  if (r.status !== 200) return line('FAIL', path, `HTTP ${r.status}${via}, ${ms} ms`);
  if (!/text\/html/i.test(r.type) || !/<html[\s>]/i.test(r.body) || !/<\/html>/i.test(r.body)) {
    return line('FAIL', path, `not a complete HTML page (content-type "${r.type.slice(0, 40)}", ${r.body.length} bytes)`);
  }
  if (legal.has(path)) {
    const m = PLACEHOLDER.exec(visibleText(r.body));
    if (m) return line('FAIL', path, `shows a placeholder ${m[0].slice(0, 40)} (K56)`);
  }
  if (ms > warnMs) return line('WARN', path, `200${via}, slow: ${ms} ms (> ${warnMs})`);
  line('OK', path, `200${via}, ${ms} ms`);
}

function checkTls() {
  const { hostname, port } = new URL(base);
  return new Promise((resolve) => {
    const socket = connect({ host: hostname, port: Number(port) || 443, servername: hostname, timeout: maxMs }, () => {
      const cert = socket.getPeerCertificate();
      const protocol = socket.getProtocol();
      socket.end();
      const end = Date.parse(cert?.valid_to ?? '');
      if (!Number.isFinite(end)) return resolve(line('FAIL', 'TLS', 'no certificate end date'));
      const days = Math.floor((end - Date.now()) / 86_400_000);
      const detail = `${protocol}, certificate valid ${days} more days (until ${new Date(end).toISOString().slice(0, 10)})`;
      resolve(line(days < 7 ? 'FAIL' : days < 21 ? 'WARN' : 'OK', 'TLS', detail));
    });
    socket.on('timeout', () => socket.destroy(Object.assign(new Error('timeout'), { code: 'TIMEOUT' })));
    socket.on('error', (e) => resolve(line('FAIL', 'TLS', `${e.code ?? e.name}${e.code ? '' : `: ${String(e.message).slice(0, 80)}`}`)));
  });
}

console.log(`live-ping ${base} — ${new Date().toISOString()}`);
if (isLocal) line('SKIP', 'TLS', 'plain http on localhost');
else await checkTls();
for (const p of paths) await checkPath(p);
console.log(`${fails ? 'FAILED' : 'PASSED'}: ${paths.length + (isLocal ? 0 : 1)} checks, ${fails} FAIL, ${warns} WARN`);
process.exit(fails ? 1 : 0);
