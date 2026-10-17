// G139: the cached Chromium died while an idle Vercel instance was frozen but still says isConnected(); the first PDF
// after the thaw failed with "Target page, context or browser has been closed". renderPdfs must throw that browser away
// and render once more in a new one. Fake browsers stand in for Chromium here (no real browser needed).
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import type { Browser } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';
import { closePrintBrowser, isClosedBrowserError, printBrowser, setPrintBrowserLauncher } from '../lib/print/browser.ts';
import { renderPdfs, type PrintRun } from '../lib/print/render.ts';

const CLOSED = 'Target page, context or browser has been closed';
const RUN: PrintRun = { siteId: null, publicOrigin: 'https://wedding.example', viewport: { width: 800, height: 600 }, pdf: { width: '800px', height: '600px' } };
const DOC = { html: '<!doctype html><p>Avery &amp; Jordan</p>', path: '/print/test/invitation.html' };

interface Fake {
  browser: Browser;
  closed: number;
  contexts: number;
  contextsClosed: number;
  pages: number;
  disconnect(): void;
}

/** A browser that says it is connected; `fail` throws from newContext or from the context's newPage. */
function fakeBrowser(fail?: { at: 'newContext' | 'newPage'; message: string }): Fake {
  const listeners: Array<() => void> = [];
  const f: Fake = {
    closed: 0,
    contexts: 0,
    contextsClosed: 0,
    pages: 0,
    disconnect: () => listeners.forEach((l) => l()),
    browser: null as unknown as Browser,
  };
  const page = {
    route: async () => undefined,
    goto: async () => null,
    evaluate: async () => undefined,
    pdf: async () => {
      const doc = await PDFDocument.create();
      doc.addPage([100, 100]);
      return Buffer.from(await doc.save());
    },
    close: async () => undefined,
  };
  const context = {
    newPage: async () => {
      if (fail?.at === 'newPage') throw new Error(`browserContext.newPage: ${fail.message}`);
      f.pages += 1;
      return page;
    },
    close: async () => {
      f.contextsClosed += 1;
    },
  };
  f.browser = {
    isConnected: () => true,
    on: (event: string, l: () => void) => {
      if (event === 'disconnected') listeners.push(l);
    },
    newContext: async () => {
      if (fail?.at === 'newContext') throw new Error(`browser.newContext: ${fail.message}`);
      f.contexts += 1;
      return context;
    },
    close: async () => {
      f.closed += 1;
    },
  } as unknown as Browser;
  return f;
}

/** Launches the given fakes in order; `launches` counts the starts. */
function launchInOrder(...fakes: Fake[]) {
  const state = { launches: 0 };
  setPrintBrowserLauncher(async () => {
    const f = fakes[state.launches];
    state.launches += 1;
    if (!f) throw new Error('no more fake browsers');
    return f.browser;
  });
  return state;
}

afterEach(async () => {
  await closePrintBrowser();
  setPrintBrowserLauncher(null);
});

test('the closed-browser messages Playwright gives are recognised, other errors are not', () => {
  assert.equal(isClosedBrowserError(new Error(`browserContext.newPage: ${CLOSED}`)), true);
  assert.equal(isClosedBrowserError(new Error('browser.newContext: Target closed')), true);
  assert.equal(isClosedBrowserError(new Error('page.goto: Timeout 30000ms exceeded.')), false);
  assert.equal(isClosedBrowserError(new Error('net::ERR_ABORTED')), false);
});

test('dead browser at newPage: thrown away, the PDF is made in a new browser', async () => {
  const dead = fakeBrowser({ at: 'newPage', message: CLOSED });
  const fresh = fakeBrowser();
  const state = launchInOrder(dead, fresh);
  await printBrowser(); // the cached browser of an earlier request

  const [pdf] = await renderPdfs([DOC], RUN);
  assert.equal((await PDFDocument.load(pdf)).getPageCount(), 1);
  assert.equal(state.launches, 2);
  assert.equal(dead.closed, 1, 'the dead browser is closed');
  assert.equal(dead.contextsClosed, 1, 'its context is closed too');
  assert.equal(fresh.pages, 1);
  assert.equal(fresh.closed, 0);

  // The new browser is the cached one now; the old one reporting "disconnected" late does not drop it.
  dead.disconnect();
  assert.equal(await printBrowser(), fresh.browser);
  assert.equal(state.launches, 2);
});

test('dead browser at newContext: thrown away, the PDF is made in a new browser', async () => {
  const dead = fakeBrowser({ at: 'newContext', message: 'Target closed' });
  const fresh = fakeBrowser();
  const state = launchInOrder(dead, fresh);

  const pdfs = await renderPdfs([DOC, DOC], RUN);
  assert.equal(pdfs.length, 2);
  assert.equal(state.launches, 2);
  assert.equal(dead.closed, 1);
  assert.equal(fresh.pages, 2);
});

test('only one retry: a second dead browser gives the error', async () => {
  const state = launchInOrder(fakeBrowser({ at: 'newPage', message: CLOSED }), fakeBrowser({ at: 'newPage', message: CLOSED }));
  await assert.rejects(renderPdfs([DOC], RUN), /has been closed/);
  assert.equal(state.launches, 2);
});

test('other errors are not retried and the browser is kept', async () => {
  const broken = fakeBrowser({ at: 'newPage', message: 'Timeout 30000ms exceeded.' });
  const state = launchInOrder(broken, fakeBrowser());
  await assert.rejects(renderPdfs([DOC], RUN), /Timeout/);
  assert.equal(state.launches, 1);
  assert.equal(broken.closed, 0);
  assert.equal(await printBrowser(), broken.browser);
});
