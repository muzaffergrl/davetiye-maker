#!/usr/bin/env node
// End-to-end smoke test + 390 px screenshots of the seeded demo site (real `next start`).
//
//   npm run build && npm run screenshot
//
// Uses the globally installed Playwright (NODE_PATH=/opt/node22/lib/node_modules) and the
// browsers in /opt/pw-browsers; never runs `playwright install`. Seeds into a temporary
// data folder, so platform/.data is not touched. Writes previews/sample_<page>_390.png
// and previews/checks.json. Exit code 1 when any check fails.

process.env.PLAYWRIGHT_BROWSERS_PATH ||= '/opt/pw-browsers';
process.env.PLAYWRIGHT_DISABLE_FORCED_CHROMIUM_PROXIED_LOOPBACK ||= '1';

const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

let chromium;
for (const id of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
  try {
    ({ chromium } = require(id));
    break;
  } catch {
    /* try the next location */
  }
}
if (!chromium) {
  console.error('playwright not found: run with NODE_PATH=/opt/node22/lib/node_modules');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'previews');
const PORT = Number(process.env.PORT || 3311);
const BASE = `http://127.0.0.1:${PORT}`;
const PAGES = ['', '/home', '/story', '/details', '/rsvp'];

function seed(dataDir, args) {
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/seed.ts'), ...args], {
    cwd: ROOT,
    env: { ...process.env, PLATFORM_DATA_DIR: dataDir, SEED_BASE_URL: BASE },
    stdio: 'pipe',
  });
  return JSON.parse(fs.readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8'));
}

async function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw new Error(`server did not start at ${url}`);
}

(async () => {
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('No production build: run `npm run build` first.');
    process.exit(2);
  }
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-shot-'));
  const pub = seed(dataDir, []);
  const draft = seed(dataDir, ['--slug', 'draft-demo', '--draft']);

  const server = spawn(process.execPath, [path.join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    cwd: ROOT,
    env: { ...process.env, PLATFORM_DATA_DIR: dataDir, NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverLog = '';
  server.stdout.on('data', (d) => (serverLog += d));
  server.stderr.on('data', (d) => (serverLog += d));

  const checks = [];
  const check = (name, ok, detail = '') => {
    checks.push({ name, ok: Boolean(ok), ...(detail ? { detail } : {}) });
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  };

  let browser;
  try {
    await waitForServer(`${BASE}/`);
    const status = async (p) => (await fetch(`${BASE}${p}`, { redirect: 'manual' })).status;
    check('unknown slug -> 404', (await status('/nobody-here')) === 404);
    check('reserved slug /edit -> 404', (await status('/edit')) === 404);
    check('draft site without key -> 404', (await status('/draft-demo')) === 404);
    check('draft site with wrong key -> 404', (await status('/draft-demo?preview=wrong-key-1234567890')) === 404);
    check('draft site with preview key -> 200', (await status(`/draft-demo/home?preview=${draft.previewKey}`)) === 200);
    check('edit key is not a preview key -> 404', (await status(`/draft-demo?preview=${draft.editKey}`)) === 404);
    check('theme template not served -> 404', (await status('/themes/_sample/index.html')) === 404);
    check('theme css served -> 200', (await status('/themes/_sample/style.css')) === 200);
    check('undeclared page -> 404', (await status('/clara-and-julian/admin')) === 404);

    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    fs.mkdirSync(OUT, { recursive: true });
    for (const p of PAGES) {
      const page = await context.newPage();
      const problems = [];
      page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
      page.on('pageerror', (e) => problems.push(String(e)));
      const res = await page.goto(`${BASE}/${pub.slug}${p}`, { waitUntil: 'networkidle' });
      const name = p ? p.slice(1) : 'index';
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        js: document.documentElement.getAttribute('data-js'),
        inlineRan: document.documentElement.classList.contains('js'),
        h1: document.querySelector('h1')?.textContent ?? null,
        title: document.title,
      }));
      check(`${name}: 200`, res && res.status() === 200);
      check(`${name}: no console/CSP errors`, problems.length === 0, problems.join(' | '));
      check(`${name}: theme site.js ran`, info.js === 'ready');
      check(`${name}: no horizontal overflow at 390px`, info.overflow <= 0, `scrollWidth-innerWidth=${info.overflow}`);
      if (name === 'index') {
        check('index: inline theme script allowed by CSP hash', info.inlineRan);
        check('index: names rendered server side', info.h1 === 'Clara & Julian', info.h1);
        check('index: <title> filled server side', info.title === 'Clara & Julian · May 15, 2027', info.title);
      }
      await page.screenshot({ path: path.join(OUT, `sample_${name}_390.png`), fullPage: true });
      await page.close();
    }
  } catch (e) {
    check('run', false, String(e));
  } finally {
    if (browser) await browser.close();
    server.kill('SIGTERM');
    fs.rmSync(dataDir, { recursive: true, force: true });
  }

  const failed = checks.filter((c) => !c.ok);
  fs.writeFileSync(
    path.join(OUT, 'checks.json'),
    JSON.stringify({ base: 'next start (production build)', viewport: '390x844', theme: '_sample', checks }, null, 2) + '\n',
  );
  if (failed.length) {
    console.error(`\n${failed.length} check(s) failed.\n--- server log ---\n${serverLog.slice(-4000)}`);
    process.exit(1);
  }
  console.log(`\nAll ${checks.length} checks passed; screenshots in ${path.relative(process.cwd(), OUT) || OUT}/`);
})();
