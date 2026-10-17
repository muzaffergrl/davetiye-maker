// G139: the headless Chromium that turns print HTML into PDF (website PDF, printable invitation).
//
// Why a real browser: the PDFs must look like the design — its web fonts, GPT images, CSS layout — and only a browser
// lays the theme pages out exactly as guests see them. On Vercel the browser is @sparticuz/chromium (a Chromium build
// for serverless Linux, unpacked to /tmp on the first call of an instance); elsewhere (local, tests) playwright-core
// finds the installed Playwright Chromium (PLAYWRIGHT_BROWSERS_PATH, here /opt/pw-browsers) or PRINT_CHROMIUM_PATH.
// The two packages are pinned as a pair: playwright-core 1.56 drives Chromium 141 = @sparticuz/chromium 141.

import type { Browser } from 'playwright-core';

let launching: Promise<Browser> | null = null;

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

/**
 * One browser per process, started on first use and reused (a warm function instance makes the next PDF in ~1 s).
 * A browser that died is started again.
 */
export async function printBrowser(): Promise<Browser> {
  if (launching) {
    const b = await launching.catch(() => null);
    if (b && b.isConnected()) return b;
  }
  launching = launch();
  const browser = await launching;
  browser.on('disconnected', () => {
    launching = null;
  });
  return browser;
}

/** Closes the shared browser (tests, scripts). */
export async function closePrintBrowser(): Promise<void> {
  const current = launching;
  launching = null;
  const b = await current?.catch(() => null);
  await b?.close().catch(() => undefined);
}
