#!/usr/bin/env node
// G153: only the colour-palette checks of theme-check (scripts/lib/variant-check.ts) — quick to run while palettes are
// made (tools/recolor_parts.py) and reviewed. Needs a production build.
//
//   npm run build && NODE_PATH=/opt/node22/lib/node_modules node scripts/variant-check.cjs --theme <id> [--out <dir>]
//
// Output: <out>/variants/<palette>_<page>_390.png + summary.json; exit 1 on any error. <out> defaults to
// previews/g153/<theme>.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 3313);
const PAGES = ['index', 'home', 'story', 'details', 'rsvp'];

(async () => {
  const arg = (name) => {
    const i = process.argv.indexOf(name);
    return i > 0 ? process.argv[i + 1] : null;
  };
  const themeId = arg('--theme');
  if (!themeId) {
    console.error('variant-check: --theme <id> is required');
    process.exit(2);
  }
  const { loadTheme } = await import('../lib/theme/theme.ts');
  const theme = await loadTheme(themeId);
  if (!theme) {
    console.error(`variant-check: theme ${themeId} not found`);
    process.exit(2);
  }
  if (!fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'))) {
    console.error('No production build: run `npm run build` first.');
    process.exit(2);
  }
  const out = path.resolve(arg('--out') || path.join(ROOT, 'previews', 'g153', themeId));
  const { loadChromium, startNext, waitForServer } = await import('./lib/browser.ts');
  const { checkVariants } = await import('./lib/variant-check.ts');
  const results = { errors: [], warnings: [], passed: [] };
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'platform-variant-check-'));
  const server = startNext({ port: PORT, dataDir });
  let browser;
  try {
    await waitForServer(`${server.base}/`, 60_000, server);
    browser = await loadChromium().launch();
    const pages = PAGES.filter((p) => theme.manifest.pages[p]);
    const summary = await checkVariants({
      browser,
      base: server.base,
      themeId,
      variants: theme.manifest.variants,
      pages,
      out,
      err: (m) => (results.errors.push(m), console.log('FAIL  ' + m)),
      warn: (m) => (results.warnings.push(m), console.log('WARN  ' + m)),
      ok: (m) => (results.passed.push(m), console.log('PASS  ' + m)),
    });
    if (!theme.manifest.variants.length) console.log(`${themeId}: no colour palettes in theme.json`);
    fs.writeFileSync(path.join(out, 'variants', 'checks.json'), JSON.stringify({ theme: themeId, summary, ...results }, null, 1) + '\n');
  } catch (e) {
    results.errors.push(String(e && e.stack || e));
    console.error(e);
  } finally {
    if (browser) await browser.close();
    server.stop();
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  console.log(`\n${results.passed.length} passed, ${results.errors.length} failed, ${results.warnings.length} warnings → ${path.relative(ROOT, out)}/variants`);
  process.exit(results.errors.length ? 1 : 0);
})();
