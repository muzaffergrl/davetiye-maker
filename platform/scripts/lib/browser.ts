// Shared browser-check plumbing (G052): Playwright from the global install, `next start` on a temporary data folder,
// and in-page helpers that find a theme's painted cards from img/manifest.json (scripts/lib/theme-env.ts).
// Never runs `playwright install`; browsers come from /opt/pw-browsers.

import { spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { ROOT, type CheckProfile } from './theme-env.ts';

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const require = createRequire(import.meta.url);

/** Playwright's chromium from NODE_PATH or /opt/node22; exits with code 2 when it is not installed. */
export function loadChromium(): any {
  for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try {
      return require(id).chromium;
    } catch {
      /* next location */
    }
  }
  console.error('playwright not found: run with NODE_PATH=/opt/node22/lib/node_modules');
  process.exit(2);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Waits until the server answers at `url`. With `server` (from startNext) it first waits for THAT process to say it
 * listens ("Ready") and aborts with its log when it exits: a port that is already taken (another `next start`, an
 * orphaned server of an old checkout) makes next exit with EADDRINUSE, and every check would otherwise run against
 * the other server and blame the theme.
 */
export async function waitForServer(url: string, ms = 30_000, server?: NextServer): Promise<void> {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (server) {
      const { exitCode, signalCode } = server.proc;
      if (exitCode !== null || signalCode !== null) {
        const log = server.log();
        const busy = /EADDRINUSE/.test(log) ? ` — port in use: another server listens there (stop it or set PORT)` : '';
        throw new Error(`next start exited (${exitCode ?? signalCode}) before it answered at ${url}${busy}\n${log.slice(-1500)}`);
      }
      if (!/\bReady\b|started server on/i.test(server.log())) {
        await sleep(200);
        continue;
      }
    }
    try {
      await fetch(url);
      return;
    } catch {
      await sleep(300);
    }
  }
  throw new Error(`server did not start at ${url}${server ? `\n${server.log().slice(-1500)}` : ''}`);
}

export interface NextServer {
  base: string;
  proc: ChildProcess;
  log: () => string;
  stop: () => void;
}

const themeAssets = require('../theme-assets.cjs') as { syncThemeAssets: (o: { themesDir: string }) => unknown };

/**
 * `next start` of the production build in platform/, on 127.0.0.1:<port>, with the given data folder.
 * G159: the build serves theme CSS/JS/images from its static copies (public/themes, scripts/theme-assets.cjs); they are
 * brought up to date with themes/ first, so a check after a theme edit sees the edited files without a new build. (A
 * server with its own PLATFORM_THEMES_DIR leaves them alone: its themes without a copy come from that folder.)
 */
export function startNext(opts: { port: number; dataDir: string; env?: Record<string, string> }): NextServer {
  const themesDir = opts.env?.PLATFORM_THEMES_DIR ?? process.env.PLATFORM_THEMES_DIR;
  if (!themesDir || path.resolve(themesDir) === path.join(ROOT, 'themes')) themeAssets.syncThemeAssets({ themesDir: path.join(ROOT, 'themes') });
  const proc = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(opts.port), '-H', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env, PLATFORM_DATA_DIR: opts.dataDir, NEXT_TELEMETRY_DISABLED: '1', ...(opts.env ?? {}) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let log = '';
  proc.stdout!.on('data', (d) => (log += d));
  proc.stderr!.on('data', (d) => (log += d));
  return { base: `http://127.0.0.1:${opts.port}`, proc, log: () => log, stop: () => void proc.kill('SIGTERM') };
}

export interface CardBox {
  key: string;
  cls: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  /** The card holds schedule rows (data-repeat-item="schedule.N"). */
  schedule: boolean;
}

/**
 * Marks the painted cards of the page: the card element gets data-qa-card="<manifest key>", its card image
 * data-qa-card-img. Cards = profile.cards selectors, or (default) the parent of every <img> showing a manifest part
 * with a free_zone. Returns the image boxes (viewport px). Idempotent; harmless for layout (data attributes only).
 */
export async function markCards(page: any, profile: Pick<CheckProfile, 'cards' | 'freeZones'>): Promise<CardBox[]> {
  return page.evaluate(({ keys, cards }: { keys: string[]; cards: Record<string, string> | null }) => {
    document.querySelectorAll('[data-qa-card]').forEach((e) => e.removeAttribute('data-qa-card'));
    document.querySelectorAll('[data-qa-card-img]').forEach((e) => e.removeAttribute('data-qa-card-img'));
    if (!keys.length) return [];
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|/)img/(${keys.map(esc).join('|')})-\\d+\\.(?:webp|png|jpe?g|avif)(?:[?#]|$)`);
    const keyOf = (img: HTMLImageElement) => re.exec(img.getAttribute('src') || '')?.[1] ?? re.exec(img.currentSrc || '')?.[1] ?? null;
    if (cards) {
      for (const [sel, key] of Object.entries(cards)) {
        for (const el of Array.from(document.querySelectorAll(sel))) {
          el.setAttribute('data-qa-card', key);
          const img = Array.from(el.querySelectorAll('img')).find((i) => keyOf(i) === key);
          if (img) img.setAttribute('data-qa-card-img', '');
        }
      }
    } else {
      for (const img of Array.from(document.querySelectorAll('img'))) {
        const key = keyOf(img);
        if (!key) continue;
        let host = img.parentElement;
        if (host && host.tagName === 'PICTURE') host = host.parentElement;
        if (!host || host === document.body) continue;
        host.setAttribute('data-qa-card', key);
        img.setAttribute('data-qa-card-img', '');
      }
    }
    return Array.from(document.querySelectorAll('[data-qa-card]')).map((el) => {
      const img = Array.from(el.querySelectorAll('[data-qa-card-img]')).find((i) => {
        const host = i.parentElement && i.parentElement.tagName === 'PICTURE' ? i.parentElement.parentElement : i.parentElement;
        return host === el;
      });
      const b = (img ?? el).getBoundingClientRect();
      return {
        key: el.getAttribute('data-qa-card')!, cls: String((el as HTMLElement).className || el.tagName).slice(0, 40),
        left: b.left, top: b.top, right: b.right, bottom: b.bottom, width: b.width, height: b.height,
        schedule: Boolean(el.querySelector('[data-repeat-item^="schedule."]')),
      };
    });
  }, { keys: Object.keys(profile.freeZones), cards: profile.cards });
}

/** Do two boxes overlap (more than half a pixel)? */
export const overlaps = (a: { left: number; right: number; top: number; bottom: number }, b: { left: number; right: number; top: number; bottom: number }) =>
  a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
