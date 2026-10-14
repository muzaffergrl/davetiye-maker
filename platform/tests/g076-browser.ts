// Browser journey of the optional guest password (G076, K28): real `next start` + Chromium at 390 × 844 (phone, touch).
// Not part of `npm test` (needs a build):
//
//   npm run build
//   NODE_PATH=/opt/node22/lib/node_modules node tests/g076-browser.ts
//
// Couple (panel, Share): turn the password on (suggested password, 3-character one refused) → guest: the password page
// in the design's own colours (names only) → wrong password → right password → the website opens (photo, .ics, RSVP
// status) → couple sets a new password → the guest is asked again → new password works. Also: olive-ivory password page,
// the panel preview never asks, cookie flags, axe-core on the password page and the Share card, touch targets, no
// horizontal scroll at 320 / 390. Screenshots + checks.json → previews/g076/ (or $G076_SHOTS_DIR). Exit 1 on a failed check.
// Uses the global Playwright and /opt/pw-browsers (never `playwright install`); data lives in a temporary folder.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { loadChromium, startNext, waitForServer } from '../scripts/lib/browser.ts';
import { loadThemeEnv, ROOT } from '../scripts/lib/theme-env.ts';

const require = createRequire(import.meta.url);
const AXE = require.resolve('axe-core/axe.min.js');
const PORT = Number(process.env.PORT || 3376);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = process.env.G076_SHOTS_DIR || path.join(ROOT, 'previews/g076');
const EXTRA = process.env.G076_EXTRA_DIR || null; // optional: password pages of every other theme (not committed)
if (!existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
  console.error('No production build: run `npm run build` first.');
  process.exit(2);
}
const chromium = loadChromium();
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'g076-browser-data-'));
mkdirSync(OUT, { recursive: true });

/** Seeds a published demo site of `theme` (its own demo record and sample photos) and returns its slug + edit key. */
function seed(theme: string, slug: string): { slug: string; editKey: string } {
  const env = loadThemeEnv({ theme });
  const contentFile = path.join(dataDir, `${slug}.json`);
  writeFileSync(contentFile, JSON.stringify(env.demo));
  const res = spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts/seed.ts'), '--theme', theme, '--slug', slug, '--content', contentFile, ...(env.photosDir ? ['--photos', env.photosDir] : ['--no-photos'])],
    { cwd: ROOT, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local' }, encoding: 'utf8' },
  );
  if (res.status !== 0) throw new Error(`seed ${theme} failed:\n${res.stdout}\n${res.stderr}`);
  const keys = JSON.parse(readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8')) as { editKey: string };
  return { slug, editKey: keys.editKey };
}

const blush = seed('blush-garden-rose', 'clara-and-julian');
const olive = seed('olive-ivory', 'olive-wedding');
const others = EXTRA ? ['mediterranean-lemon', 'vintage-airmail-love-letter'].map((t) => ({ theme: t, ...seed(t, `${t}-site`) })) : [];

const checks: Array<{ name: string; ok: boolean; detail?: string }> = [];
const check = (name: string, ok: unknown, detail = '') => {
  checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};
async function block(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    check(`${name}: ran to the end`, false, String((e as Error)?.stack ?? e).slice(0, 600));
  }
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'en-US', timezoneId: 'America/New_York' };
const shot = async (page: any, name: string, dir = OUT) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(dir, `${name}.png`) });
};
const overflow = (page: any) => page.evaluate(() => Math.max(document.documentElement.scrollWidth, window.innerWidth) - window.innerWidth);
async function axe(page: any, view: string) {
  await page.addScriptTag({ path: AXE }).catch(async () => {
    // the password page's CSP allows only its own script: evaluate axe's source instead of adding a <script>
    await page.evaluate(readFileSync(AXE, 'utf8'));
  });
  const res = await page.evaluate(async () => {
    const r = await (window as any).axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical').map((v: any) => `${v.id}: ${v.nodes.map((n: any) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
  });
  check(`a11y (axe-core 4.13.0): ${view} has no serious/critical violations`, !res.length, res.join(' ; '));
}
async function smallTargets(page: any, scope = 'body'): Promise<string[]> {
  return page.evaluate((sel: string) => {
    const out: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>(`${sel} button, ${sel} a[href], ${sel} input:not([type=hidden]), ${sel} [role="switch"]`)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none' || el.hidden) continue;
      if (el.matches('[role="switch"]')) continue; // 32 px track with a 44 px hit area (panel tokens)
      if (r.height < 43.5 || r.width < 43.5) out.push(`${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return out;
  }, scope);
}
const isGate = (page: any) => page.evaluate(() => document.documentElement.hasAttribute('data-site-gate'));
const gateState = (page: any) => page.evaluate(() => document.documentElement.getAttribute('data-site-gate'));

const server = startNext({ port: PORT, dataDir });
let browser: any;
try {
  await waitForServer(`${BASE}/start`, 40_000, server);
  browser = await chromium.launch();
  const coupleCtx = await browser.newContext(PHONE);
  await coupleCtx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  const couple = await coupleCtx.newPage();
  const guestCtx = await browser.newContext(PHONE);
  const guest = await guestCtx.newPage();
  let password = '';

  await block('couple turns the password on', async () => {
    const before = await guest.goto(`${BASE}/clara-and-julian/home`);
    check('before: the website is open (no password by default)', before.status() === 200 && !(await isGate(guest)));
    await couple.goto(`${BASE}/edit/clara-and-julian?k=${encodeURIComponent(blush.editKey)}#share`);
    // K29: the guest password is a folded section under the link and the QR code; its title says "Off".
    const fold = couple.locator('[data-disclosure="password"] button[aria-expanded]');
    await fold.waitFor();
    check('Share (K29): the password section is folded and says "Off"', (await fold.getAttribute('aria-expanded')) === 'false' && (await fold.innerText()).includes('Off'), await fold.innerText());
    await fold.click();
    await couple.waitForSelector('[data-guest-password]');
    check('Share: the password card is there, off by default', (await couple.getAttribute('[data-guest-password]', 'data-guest-password')) === 'off');
    const sw = couple.locator('#guest-password-switch');
    await sw.scrollIntoViewIfNeeded();
    await sw.click();
    await couple.waitForSelector('[data-guest-password-input]');
    const suggested = await couple.inputValue('[data-guest-password-input]');
    check('switching on suggests a password (two words + number)', /^[A-Z][a-z]+[A-Z][a-z]+\d\d$/.test(suggested), suggested);
    await couple.click('[data-guest-password-suggest]');
    const second = await couple.inputValue('[data-guest-password-input]');
    check('"Suggest a password" gives another one', second !== suggested && /^[A-Z][a-z]+[A-Z][a-z]+\d\d$/.test(second), `${suggested} → ${second}`);
    check('hint: add the password to your invitation message', (await couple.locator('[data-guest-password]').innerText()).includes('Add the password to your invitation message'));
    await couple.fill('[data-guest-password-input]', 'abc');
    await couple.click('[data-guest-password-save]');
    await couple.waitForSelector('[data-guest-password] [role="alert"]');
    check('a 3-character password is refused with a clear message', (await couple.locator('[data-guest-password] [role="alert"]').innerText()).includes('at least 4 characters'));
    check('still off on the server after the refusal', (await couple.getAttribute('[data-guest-password]', 'data-guest-password')) === 'opening');
    await couple.fill('[data-guest-password-input]', second);
    await couple.click('[data-guest-password-save]');
    await couple.waitForSelector('[data-guest-password="on"]');
    await couple.waitForSelector('[data-snackbar]');
    check('turned on: snackbar says guests need it', (await couple.locator('[data-snackbar]').innerText()).includes('Guests need it'));
    check('Share (K29): the folded section now says "On"', (await fold.innerText()).includes('On'), await fold.innerText());
    password = await couple.inputValue('[data-guest-password-input]');
    check('the couple sees their password (to share it)', password === second);
    await couple.click('[data-guest-password-copy]');
    const copied = await couple.evaluate(() => navigator.clipboard.readText()).catch(() => '');
    check('"Copy password" copies it', copied === password, copied);
    check('Share: no horizontal scroll at 390 px', (await overflow(couple)) <= 0);
    const small = await smallTargets(couple, '[data-guest-password]');
    check('Share password card: touch targets ≥ 44 px', !small.length, small.join(', '));
    await couple.locator('[data-guest-password]').scrollIntoViewIfNeeded();
    await couple.waitForTimeout(6500); // let the snackbar go
    await couple.locator('[data-guest-password]').evaluate((el: HTMLElement) => el.scrollIntoView({ block: 'start' }));
    await couple.evaluate(() => window.scrollBy(0, -72));
    await shot(couple, '01_share_password_on');
    await axe(couple, 'Share with the password on');
  });

  await block('guest: password page, wrong, right', async () => {
    await guest.goto(`${BASE}/clara-and-julian/home`);
    check('guest (already on the site) is asked for the password on the next page', await isGate(guest));
    await guestCtx.clearCookies();
    const res = await guest.goto(`${BASE}/clara-and-julian`);
    check('guest: the password page answers 200, private, no-store', res.status() === 200 && res.headers()['cache-control'] === 'private, no-store');
    check('guest: password page instead of the envelope', (await isGate(guest)) && (await gateState(guest)) === 'ask');
    const text = await guest.locator('body').innerText();
    check('password page: the names, "You’re invited", no date / venue', text.includes('Clara & Julian') && /You.re invited/i.test(text) && !/2027|Rosewater|Savannah|May/.test(text), text.slice(0, 200));
    check('password page: no photos', (await guest.locator('img').count()) === 0);
    const bg = await guest.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    check('password page: the theme’s own page colour (--page #F2D8D7)', bg === 'rgb(242, 216, 215)', bg);
    const font = await guest.evaluate(() => getComputedStyle(document.querySelector('.sg-names')!).fontFamily);
    check('password page: the names in the theme’s script font', /Great Vibes/.test(font), font);
    check('password page: no horizontal scroll at 390 px', (await overflow(guest)) <= 0);
    const small = await smallTargets(guest);
    check('password page: touch targets ≥ 44 px', !small.length, small.join(', '));
    const errors: string[] = [];
    const onConsole = (m: any) => m.type() === 'error' && errors.push(m.text());
    guest.on('console', onConsole);
    await guest.reload();
    await guest.waitForLoadState('networkidle');
    guest.off('console', onConsole);
    check('no console errors on the password page (CSP: theme CSS, fonts, the one hashed script)', !errors.length, errors.join(' | '));
    await shot(guest, '02_guest_password_blush-garden-rose');
    await axe(guest, 'password page (blush-garden-rose)');
    await guest.click('#sg-show');
    check('"Show" reveals the typed password (progressive script under the CSP)', (await guest.getAttribute('#sg-password', 'type')) === 'text');
    await guest.click('#sg-show');

    await guest.fill('#sg-password', 'not the password');
    await Promise.all([guest.waitForNavigation(), guest.click('.sg-submit')]);
    check('wrong password: the page again with the message', (await gateState(guest)) === 'wrong' && (await guest.locator('[role="alert"]').innerText()).includes('isn’t right'));
    check('wrong password: the field is marked invalid and focused', (await guest.getAttribute('#sg-password', 'aria-invalid')) === 'true' && (await guest.evaluate(() => document.activeElement?.id)) === 'sg-password');
    await shot(guest, '03_guest_wrong_password');
    await axe(guest, 'password page, wrong password');

    await guest.fill('#sg-password', `  ${password.toLowerCase()} `);
    await Promise.all([guest.waitForNavigation(), guest.click('.sg-submit')]);
    check('right password (any case, extra spaces): the envelope opens at the same address', !(await isGate(guest)) && new URL(guest.url()).pathname === '/clara-and-julian');
    const cookies = await guestCtx.cookies();
    const c = cookies.find((x: any) => x.name.startsWith('__Host-guest-'));
    check('cookie: __Host-, HttpOnly, Secure, SameSite=Lax, ~90 days', Boolean(c && c.httpOnly && c.secure && c.sameSite === 'Lax' && c.path === '/' && Math.abs(c.expires - (Date.now() / 1000 + 90 * 86400)) < 120), JSON.stringify(c ?? null));
    check('cookie: not readable by page scripts', (await guest.evaluate(() => document.cookie)).includes('__Host-guest-') === false);
    await guest.goto(`${BASE}/clara-and-julian/home`);
    await guest.waitForLoadState('networkidle');
    check('home opens with the cookie', !(await isGate(guest)) && (await guest.locator('body').innerText()).includes('Rosewater'));
    const photos = await guest.evaluate(() =>
      [...document.querySelectorAll<HTMLImageElement>('img[src*="/media/"]')].map((i) => ({ src: i.currentSrc || i.src, ok: i.complete && i.naturalWidth > 0, lazy: i.loading === 'lazy' })),
    );
    check('the couple’s photos load with the cookie', photos.length > 0 && photos.filter((p: any) => !p.lazy).every((p: any) => p.ok), JSON.stringify(photos).slice(0, 300));
    // fetched by the page itself: the browser's cookie jar (Playwright's request API does not send Secure cookies over http)
    const ics = await guest.evaluate(async () => {
      const r = await fetch('/clara-and-julian/event.ics', { credentials: 'same-origin' });
      return { status: r.status, cache: r.headers.get('cache-control'), text: await r.text() };
    });
    check('.ics with the cookie: the calendar file, private', ics.status === 200 && ics.text.includes('BEGIN:VCALENDAR') && ics.cache === 'private, no-store', `${ics.status} ${ics.cache}`);
    const status = await guest.evaluate(async () => (await fetch('/api/rsvp/clara-and-julian', { credentials: 'same-origin' })).status);
    check('RSVP status with the cookie: 200', status === 200, String(status));
    const photoUrl = photos[0]?.src ? new URL(photos[0].src).pathname : null;
    const anon = await browser.newContext(PHONE);
    if (photoUrl) {
      const p = await anon.request.get(`${BASE}${photoUrl}`);
      check('the same photo URL without the cookie: 401, no image', p.status() === 401 && !(p.headers()['content-type'] ?? '').startsWith('image/'));
    }
    const anonIcs = await anon.request.get(`${BASE}/clara-and-julian/event.ics`, { maxRedirects: 0 });
    check('.ics without the cookie: 303 to the password page', anonIcs.status() === 303 && anonIcs.headers()['location'] === '/clara-and-julian');
    const anonRsvp = await anon.request.post(`${BASE}/api/rsvp/clara-and-julian`, { data: { name: 'Bot', attending: true, guests: 1 } });
    check('RSVP POST without the cookie: 401 password_required', anonRsvp.status() === 401 && (await anonRsvp.json()).code === 'password_required');
    await anon.close();
  });

  await block('panel preview never asks', async () => {
    const state = await couple.evaluate(async (key: string) => (await (await fetch('/api/edit/clara-and-julian', { headers: { Authorization: `Bearer ${key}` } })).json()).state, blush.editKey);
    const p = await coupleCtx.newPage();
    await p.goto(`${BASE}/clara-and-julian/home?preview=${encodeURIComponent(state.previewToken)}`);
    check('panel preview token: the page, no password (couple has no guest cookie)', !(await isGate(p)) && (await p.locator('body').innerText()).includes('Rosewater'));
    await p.close();
  });

  await block('couple changes the password → guest asked again', async () => {
    const next = 'Velvet Swan 81';
    await couple.fill('[data-guest-password-input]', next);
    check('changing it warns that guests will be asked again', (await couple.locator('[data-guest-password-warning]').count()) === 1);
    await couple.click('[data-guest-password-save]');
    await couple.waitForFunction((v: string) => (document.querySelector('[data-snackbar]')?.textContent ?? '').includes('asked for it again') && (document.querySelector('[data-guest-password-input]') as HTMLInputElement)?.value === v, next);
    check('new password saved: snackbar "Guests will be asked for it again"', true);
    await guest.reload();
    check('guest: asked for the password again after the change', (await isGate(guest)) && (await gateState(guest)) === 'ask');
    await guest.fill('#sg-password', password);
    await Promise.all([guest.waitForNavigation(), guest.click('.sg-submit')]);
    check('guest: the old password no longer works', (await gateState(guest)) === 'wrong');
    await guest.fill('#sg-password', 'velvet swan 81');
    await Promise.all([guest.waitForNavigation(), guest.click('.sg-submit')]);
    check('guest: the new password opens the page they were on', !(await isGate(guest)) && new URL(guest.url()).pathname === '/clara-and-julian/home');
  });

  await block('olive-ivory password page + 320 px', async () => {
    const res = await couple.evaluate(
      async (key: string) => (await fetch('/api/edit/olive-wedding/access', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true, password: 'Olive Grove 7' }) })).status,
      olive.editKey,
    );
    check('olive-ivory: protected through the panel API', res === 200);
    const page = await guestCtx.newPage();
    await page.goto(`${BASE}/olive-wedding`);
    check('olive-ivory: password page (the cookie of the other website does not count)', await isGate(page));
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
    check('olive-ivory: the theme’s page colour (#EDE4D0)', bg === 'rgb(237, 228, 208)', bg);
    await shot(page, '04_guest_password_olive-ivory');
    await axe(page, 'password page (olive-ivory)');
    await page.setViewportSize({ width: 320, height: 640 });
    check('password page: no horizontal scroll at 320 px', (await overflow(page)) <= 0);
    await page.close();
    for (const o of others) {
      await couple.evaluate(
        async ([slug, key]: string[]) => fetch(`/api/edit/${slug}/access`, { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled: true, password: 'Test Pass 12' }) }),
        [o.slug, o.editKey],
      );
      const p = await guestCtx.newPage();
      await p.goto(`${BASE}/${o.slug}`);
      check(`${o.theme}: password page`, await isGate(p));
      mkdirSync(EXTRA!, { recursive: true });
      await shot(p, `guest_password_${o.theme}`, EXTRA!);
      await p.close();
    }
  });
} finally {
  await browser?.close().catch(() => undefined);
  server.stop();
  rmSync(dataDir, { recursive: true, force: true });
}

writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify({ when: new Date().toISOString().slice(0, 10), passed: checks.filter((c) => c.ok).length, total: checks.length, checks }, null, 2) + '\n');
const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed → ${path.relative(ROOT, OUT)}`);
process.exit(failed.length ? 1 : 0);
