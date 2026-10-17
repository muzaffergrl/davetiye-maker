// G150: the PDF browser's life cycle (lib/print/browser.ts, lib/print/render.ts). Live on Vercel the first invitation
// of a session failed with "browserContext.newPage: Target page, context or browser has been closed" (the cached
// Chromium had died between invocations). Here fake browsers stand in for Chromium: a dead one is thrown away and the
// render runs once more in a new one; two failures give a clean error (503 from the route, one quota hit); other errors
// are not retried; contexts and pages are always closed.
import { after, afterEach, before, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import type { Browser } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { POST as downloadRoute } from '../app/api/edit/[slug]/download/route.ts';
import { setClaimRateLimiter } from '../lib/claim/limits.ts';
import { getDataAdapter } from '../lib/data/index.ts';
import { PDF_LIMITS } from '../lib/print/api.ts';
import {
  isBrowserGone,
  printBrowser,
  PrintBrowserError,
  setPrintBrowserLauncher,
  withPrintBrowser,
} from '../lib/print/browser.ts';
import { printLabel } from '../lib/print/labels.ts';
import { renderPdfs } from '../lib/print/render.ts';
import { MemoryRateLimiter } from '../lib/rsvp/rate-limit.ts';
import { createSiteWithKeys, publishSite } from '../lib/sites.ts';
import { demoContent, PLATFORM_ROOT, tmpDir } from './helpers.ts';

const CLOSED = 'browserContext.newPage: Target page, context or browser has been closed';

/** What a fake browser does on newPage: work, or fail like the dead Chromium on Vercel. */
type Mode = 'ok' | 'closed' | 'timeout';

interface Fake {
  browser: Browser;
  log: string[];
  closed: boolean;
}

let onePagePdf: Uint8Array;

/** A fake Playwright Browser: just enough of Browser → BrowserContext → Page for renderPdfs. */
function fakeBrowser(name: string, mode: Mode, opts: { connected?: boolean } = {}): Fake {
  const fake: Fake = { browser: null as unknown as Browser, log: [], closed: false };
  let connected = opts.connected ?? true;
  const listeners: Array<() => void> = [];
  const page = {
    route: async () => undefined,
    goto: async () => {
      if (mode === 'timeout') throw new Error('page.goto: Timeout 30000ms exceeded.');
      return null;
    },
    evaluate: async () => undefined,
    pdf: async () => Buffer.from(onePagePdf),
    close: async () => {
      fake.log.push(`${name}:page.close`);
    },
  };
  const context = {
    newPage: async () => {
      if (mode === 'closed') throw new Error(CLOSED);
      fake.log.push(`${name}:newPage`);
      return page;
    },
    close: async () => {
      fake.log.push(`${name}:context.close`);
      if (mode === 'closed') throw new Error('browserContext.close: Target page, context or browser has been closed');
    },
  };
  fake.browser = {
    isConnected: () => connected,
    on: (event: string, fn: () => void) => {
      if (event === 'disconnected') listeners.push(fn);
      return fake.browser;
    },
    newContext: async () => {
      fake.log.push(`${name}:newContext`);
      return context;
    },
    close: async () => {
      fake.closed = true;
      connected = false;
      fake.log.push(`${name}:close`);
      for (const fn of listeners) fn();
    },
  } as unknown as Browser;
  return fake;
}

/** Installs a launcher that hands out `fakes` in order; returns how many were launched. */
function launchInOrder(fakes: Fake[]): () => number {
  let n = 0;
  setPrintBrowserLauncher(async () => {
    const f = fakes[n];
    n += 1;
    if (!f) throw new Error('no more fake browsers');
    return f.browser;
  });
  return () => n;
}

const RUN = { siteId: null, publicOrigin: 'https://wedding.example', viewport: { width: 480, height: 672 }, pdf: { width: '5in', height: '7in' } };
const DOC = { html: '<!doctype html><title>x</title>', path: '/print/test/invitation.html' };

let warn: typeof console.warn;
let error: typeof console.error;
before(async () => {
  const doc = await PDFDocument.create();
  doc.addPage([360, 504]);
  onePagePdf = await doc.save();
  process.env.PLATFORM_THEMES_DIR = path.join(PLATFORM_ROOT, 'themes');
  process.env.PLATFORM_DATA_DIR = tmpDir('g150-data-');
  delete process.env.PLATFORM_PUBLIC_URL;
  // the retry logs one line per failed try; keep the test output clean
  warn = console.warn;
  error = console.error;
  console.warn = () => undefined;
  console.error = () => undefined;
});
afterEach(() => setPrintBrowserLauncher(null));
after(() => {
  console.warn = warn;
  console.error = error;
  setClaimRateLimiter(null);
});

test('error class: "Target page, context or browser has been closed" and crashes are retried, timeouts are not', () => {
  assert.equal(isBrowserGone(new Error(CLOSED)), true);
  assert.equal(isBrowserGone(new Error('browser.newContext: Target closed')), true);
  assert.equal(isBrowserGone(new Error('page.pdf: Page crashed')), true);
  assert.equal(isBrowserGone(new Error('browserType.launch: Browser closed.\n==== logs ====')), true);
  assert.equal(isBrowserGone(new Error('page.goto: Timeout 30000ms exceeded.')), false);
  assert.equal(isBrowserGone(new Error('theme olive-ivory not found')), false);
});

test('a cached browser that died between requests (still "connected") is thrown away; a new one renders the PDF', async () => {
  // the first browser looks alive (isConnected() true, as on Vercel) but its pages fail
  const dead = fakeBrowser('dead', 'closed');
  const fresh = fakeBrowser('fresh', 'ok');
  const launched = launchInOrder([dead, fresh]);

  const [pdf] = await renderPdfs([DOC], RUN);
  assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1, 'the PDF of the second try');
  assert.equal(launched(), 2, 'one relaunch');
  assert.equal(dead.closed, true, 'the dead browser was closed');
  assert.ok(dead.log.includes('dead:context.close'), 'the failed try closed its context');
  assert.deepEqual(fresh.log, ['fresh:newContext', 'fresh:newPage', 'fresh:page.close', 'fresh:context.close'], 'page and context closed after the PDF');
  assert.equal(fresh.closed, false, 'the working browser stays for the next PDF');

  // the next render reuses the new browser (no third launch) with a new context
  await renderPdfs([DOC, DOC], RUN);
  assert.equal(launched(), 2);
  assert.equal(fresh.log.filter((l) => l === 'fresh:newContext').length, 2, 'a context per render, never reused');
  assert.equal(fresh.log.filter((l) => l === 'fresh:page.close').length, 3);
});

test('a browser that reports itself disconnected is not reused (relaunched before the render)', async () => {
  const gone = fakeBrowser('gone', 'ok');
  const next = fakeBrowser('next', 'ok');
  const launched = launchInOrder([gone, next]);
  assert.equal(await printBrowser(), gone.browser);
  await gone.browser.close(); // 'disconnected'
  assert.equal(await printBrowser(), next.browser);
  assert.equal(launched(), 2);
  await renderPdfs([DOC], RUN);
  assert.equal(gone.log.includes('gone:newContext'), false, 'nothing rendered in the closed browser');
});

test('two failures in a row: a clean PrintBrowserError (no third try)', async () => {
  const launched = launchInOrder([fakeBrowser('a', 'closed'), fakeBrowser('b', 'closed'), fakeBrowser('c', 'ok')]);
  await assert.rejects(renderPdfs([DOC], RUN), (e: unknown) => {
    assert.ok(e instanceof PrintBrowserError);
    assert.match(e.message, /closed while rendering, twice/);
    assert.match(String((e.cause as Error).message), /has been closed/, 'the last cause is kept for the log');
    return true;
  });
  assert.equal(launched(), 2);
});

test('other errors (a navigation timeout) are passed on without a retry', async () => {
  const slow = fakeBrowser('slow', 'timeout');
  const launched = launchInOrder([slow, fakeBrowser('spare', 'ok')]);
  await assert.rejects(renderPdfs([DOC], RUN), /Timeout 30000ms exceeded/);
  assert.equal(launched(), 1, 'no relaunch');
  assert.equal(slow.closed, false, 'a live browser is kept');
  assert.ok(slow.log.includes('slow:page.close') && slow.log.includes('slow:context.close'), 'page and context closed after the error');
});

test('a failed launch is not cached: the next request launches again', async () => {
  let n = 0;
  const ok = fakeBrowser('ok', 'ok');
  setPrintBrowserLauncher(async () => {
    n += 1;
    if (n === 1) throw new Error('browserType.launch: Failed to launch: spawn ENOENT');
    return ok.browser;
  });
  await assert.rejects(withPrintBrowser(async () => 1), /Failed to launch/);
  assert.equal(await withPrintBrowser(async () => 2), 2);
  assert.equal(n, 2);
});

// ---------------------------------------------------------------- the panel route

async function newSite() {
  const slug = `g150-site-${Math.random().toString(36).slice(2, 8)}`;
  const s = await createSiteWithKeys(getDataAdapter(), { slug, theme: 'blush-garden-rose', content: demoContent() });
  await publishSite(getDataAdapter(), s.site.id);
  return { id: s.site.id, slug, editKey: s.editKey };
}

async function post(slug: string, key: string) {
  const headers = new Headers({ 'content-type': 'application/json', authorization: `Bearer ${key}` });
  const body = JSON.stringify({ kind: 'invitation', size: '5x7' });
  return downloadRoute(new Request(`https://wedding.example/api/edit/${slug}/download`, { method: 'POST', headers, body }), {
    params: Promise.resolve({ slug }),
  });
}

test('route: the first invitation after a dead browser downloads (200) and costs one of the day’s PDFs', async () => {
  const limiter = new MemoryRateLimiter();
  setClaimRateLimiter(limiter);
  launchInOrder([fakeBrowser('dead', 'closed'), fakeBrowser('fresh', 'ok')]);
  const k = await newSite();
  const res = await post(k.slug, k.editKey);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  const left = await limiter.peek(`pdf:site:${k.id}`, PDF_LIMITS.perSitePerDay);
  assert.equal(left.remaining, PDF_LIMITS.perSitePerDay.limit - 1, 'the internal retry is not counted');
});

test('route: two failures → 503 with the panel’s "try again" message and Retry-After, one quota hit', async () => {
  const limiter = new MemoryRateLimiter();
  setClaimRateLimiter(limiter);
  launchInOrder([fakeBrowser('a', 'closed'), fakeBrowser('b', 'closed')]);
  const k = await newSite();
  const res = await post(k.slug, k.editKey);
  assert.equal(res.status, 503);
  assert.equal(res.headers.get('retry-after'), '30');
  const body = await res.json();
  assert.deepEqual(body, { ok: false, code: 'pdf_unavailable', message: printLabel('panel_failed') });
  assert.doesNotMatch(JSON.stringify(body), /Target page|browserContext/, 'no internal error text for the buyer');
  const left = await limiter.peek(`pdf:site:${k.id}`, PDF_LIMITS.perSitePerDay);
  assert.equal(left.remaining, PDF_LIMITS.perSitePerDay.limit - 1);
});
