// G139: the headless Chromium that turns print HTML into PDF (website PDF, printable invitation).
//
// Why a real browser: the PDFs must look like the design — its web fonts, GPT images, CSS layout — and only a browser
// lays the theme pages out exactly as guests see them. On Vercel the browser is @sparticuz/chromium (a Chromium build
// for serverless Linux, unpacked to /tmp on the first call of an instance); elsewhere (local, tests) playwright-core
// finds the installed Playwright Chromium (PLAYWRIGHT_BROWSERS_PATH, here /opt/pw-browsers) or PRINT_CHROMIUM_PATH.
// The two packages are pinned as a pair: playwright-core 1.56 drives Chromium 141 = @sparticuz/chromium 141.
//
// G150: on Vercel the cached browser died between invocations (the frozen instance's Chromium runs --single-process,
// so one crashed renderer is the whole browser) and the next request failed with "browserContext.newPage: Target page,
// context or browser has been closed" — while browser.isConnected() could still say true. withPrintBrowser() runs a
// render, and when it fails with that class of error it throws the browser away, starts a new one and renders once
// more. Contexts and pages are never reused across renders (lib/print/render.ts closes them in `finally`).

import type { Browser } from 'playwright-core';

/** Starts a browser (tests swap it for a fake with setPrintBrowserLauncher). */
export type PrintBrowserLauncher = () => Promise<Browser>;

function serverless(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function launch(): Promise<Browser> {
  const { chromium } = await import('playwright-core');
  if (serverless()) {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    return chromium.launch({ executablePath: await sparticuz.executablePath(), args: sparticuz.args, headless: true });
  }
  const executablePath = process.env.PRINT_CHROMIUM_PATH || undefined;
  return chromium.launch({ executablePath, headless: true });
}

let launcher: PrintBrowserLauncher = launch;
/** The shared browser (a launch in progress or done); null = none yet, or the last one was thrown away. */
let current: Promise<Browser> | null = null;

function start(): Promise<Browser> {
  const p: Promise<Browser> = launcher().then((browser) => {
    browser.on('disconnected', () => {
      if (current === p) current = null;
    });
    return browser;
  });
  // a launch that failed is not kept: the next request tries again
  p.catch(() => {
    if (current === p) current = null;
  });
  current = p;
  return p;
}

/**
 * One browser per process, started on first use and reused (a warm function instance makes the next PDF in ~1 s).
 * A browser that is no longer connected is started again; callers that arrive together share one launch.
 */
export async function printBrowser(): Promise<Browser> {
  const cached = current;
  if (cached) {
    const b = await cached.catch(() => null);
    if (b?.isConnected()) return b;
    if (current === cached) current = null;
  }
  return current ?? start();
}

/** Errors that mean the browser (or its renderer) is gone: the render is worth one more try in a new browser. */
const GONE = /target page, context or browser has been closed|target closed|browser has been closed|browser has disconnected|browser closed|page crashed|target crashed|connection closed|websocket.*closed|pipe closed|session closed/i;

export function isBrowserGone(e: unknown): boolean {
  const message = e instanceof Error ? `${e.name} ${e.message}` : String(e);
  return GONE.test(message);
}

/** Resolves when `p` settles or after `ms`, whichever comes first (closing a half-dead browser can hang). */
async function within(p: Promise<unknown>, ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  await Promise.race([p.catch(() => undefined), new Promise<void>((r) => (timer = setTimeout(r, ms)))]);
  clearTimeout(timer);
}

/** Forgets `browser` (when it is the shared one) and closes it, best effort: the next printBrowser() starts a new one. */
export async function discardPrintBrowser(browser: Browser): Promise<void> {
  const cached = current;
  if (cached) {
    const b = await cached.catch(() => null);
    if (b === browser && current === cached) current = null;
  }
  await within(browser.close(), 3_000);
}

/** The render failed twice in a row because the browser closed (a fresh one included). */
export class PrintBrowserError extends Error {
  constructor(cause: unknown) {
    super('The PDF browser closed while rendering, twice (a new browser was started for the second try).', { cause });
    this.name = 'PrintBrowserError';
  }
}

function brief(e: unknown): string {
  return (e instanceof Error ? e.message : String(e)).split('\n')[0].slice(0, 200);
}

/**
 * Runs `work` with the shared browser. When it fails because the browser (or its page) closed, that browser is thrown
 * away and `work` runs once more in a new one; a second such failure is a PrintBrowserError. Any other error (a
 * timeout, a bad document) is passed on as it is, without a retry. `work` must open its own context and close it.
 */
export async function withPrintBrowser<T>(work: (browser: Browser) => Promise<T>): Promise<T> {
  let last: unknown = null;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    let browser: Browser | null = null;
    try {
      browser = await printBrowser();
      return await work(browser);
    } catch (e) {
      const gone = isBrowserGone(e) || (browser !== null && !browser.isConnected());
      if (!gone) throw e;
      last = e;
      console.warn(`[print] browser closed during render (try ${attempt} of 2${attempt === 1 ? ', starting a new browser' : ''}): ${brief(e)}`);
      if (browser) await discardPrintBrowser(browser);
    }
  }
  throw new PrintBrowserError(last);
}

/** Closes the shared browser (tests, scripts). */
export async function closePrintBrowser(): Promise<void> {
  const cached = current;
  current = null;
  const b = await cached?.catch(() => null);
  if (b) await within(b.close(), 3_000);
}

/** Tests: start browsers with `fn` instead of Playwright (null = Playwright again). Forgets the shared browser. */
export function setPrintBrowserLauncher(fn: PrintBrowserLauncher | null): void {
  launcher = fn ?? launch;
  current = null;
}
