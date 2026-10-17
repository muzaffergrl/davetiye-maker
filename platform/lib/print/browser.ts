// G139: the headless Chromium that turns print HTML into PDF (website PDF, printable invitation).
//
// Why a real browser: the PDFs must look like the design — its web fonts, GPT images, CSS layout — and only a browser
// lays the theme pages out exactly as guests see them. On Vercel the browser is @sparticuz/chromium (a Chromium build
// for serverless Linux, unpacked to /tmp on the first call of an instance); elsewhere (local, tests) playwright-core
// finds the installed Playwright Chromium (PLAYWRIGHT_BROWSERS_PATH, here /opt/pw-browsers) or PRINT_CHROMIUM_PATH.
// The two packages are pinned as a pair: playwright-core 1.56 drives Chromium 141 = @sparticuz/chromium 141.

import type { Browser } from 'playwright-core';

let launching: Promise<Browser> | null = null;
let launcher: (() => Promise<Browser>) | null = null;

function serverless(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

async function launch(): Promise<Browser> {
  if (launcher) return launcher();
  const { chromium } = await import('playwright-core');
  if (serverless()) {
    const sparticuz = (await import('@sparticuz/chromium')).default;
    return chromium.launch({ executablePath: await sparticuz.executablePath(), args: sparticuz.args, headless: true });
  }
  const executablePath = process.env.PRINT_CHROMIUM_PATH || undefined;
  return chromium.launch({ executablePath, headless: true });
}

/** Tests: start fake browsers instead of Chromium (null = the real one again). */
export function setPrintBrowserLauncher(fn: (() => Promise<Browser>) | null): void {
  launcher = fn;
  launching = null;
}

/**
 * One browser per process, started on first use and reused (a warm function instance makes the next PDF in ~1 s).
 * A browser that died is started again.
 */
export async function printBrowser(): Promise<Browser> {
  if (launching) {
    const b = await launching.catch(() => null);
    if (b && b.isConnected()) return b;
  }
  const started = launch();
  launching = started;
  const browser = await started;
  browser.on('disconnected', () => {
    // A browser thrown away earlier may report only now; it must not drop its successor from the cache.
    if (launching === started) launching = null;
  });
  return browser;
}

/** close() of a browser whose process is gone may never answer; give up after a few seconds. */
async function closeQuietly(b: Browser | null | undefined): Promise<void> {
  if (!b) return;
  let timer: NodeJS.Timeout | undefined;
  await Promise.race([
    b.close().catch(() => undefined),
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, 3_000);
      timer.unref();
    }),
  ]);
  clearTimeout(timer);
}

/**
 * Closes the shared browser (tests, scripts). With `only`, closes just that browser and forgets it if it is still the
 * shared one — a browser another request has already started in its place is left alone.
 */
export async function closePrintBrowser(only?: Browser): Promise<void> {
  const current = launching;
  if (!only) launching = null;
  const b = await current?.catch(() => null);
  if (only) {
    if (b === only && launching === current) launching = null;
    await closeQuietly(only);
    return;
  }
  await closeQuietly(b);
}

/**
 * The cached browser can be dead although isConnected() still says true: Vercel freezes an idle function instance and
 * Chromium does not survive the thaw, so the first call after a few idle minutes failed with "Target page, context or
 * browser has been closed". Such an error is not the document's fault.
 */
export function isClosedBrowserError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return /has been closed|Target closed|Browser closed|browser has disconnected/i.test(message);
}

/** Runs `work` in the shared browser; when that browser turns out dead, starts a new one and runs `work` once more. */
export async function withPrintBrowser<T>(work: (browser: Browser) => Promise<T>): Promise<T> {
  const browser = await printBrowser();
  try {
    return await work(browser);
  } catch (err) {
    if (!isClosedBrowserError(err)) throw err;
    console.warn(`[pdf] cached browser was dead, starting a new one: ${err instanceof Error ? err.message : err}`);
    await closePrintBrowser(browser);
    return work(await printBrowser());
  }
}
