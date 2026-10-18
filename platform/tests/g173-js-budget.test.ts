// G173: scripts/js-budget.cjs (postbuild) — first-load JS per page route against its budget, on a fake build folder
// (the real build is checked by `npm run build` itself; this test runs before any build).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { PLATFORM_ROOT, tmpDir } from './helpers.ts';

const require = createRequire(import.meta.url);
const jsBudget = require('../scripts/js-budget.cjs') as {
  BUDGETS: Array<[string, number]>;
  budgetFor: (route: string) => number;
  routeOf: (key: string) => string;
  checkBudgets: (nextDir: string) => { rows: Array<{ route: string; files: string[]; kb: number; budget: number }>; problems: string[] };
};

/** A .next folder with a runtime chunk, a polyfill and two pages; `pageKB` of incompressible JS in the second page. */
function fakeBuild(pageKB: number): string {
  const dir = tmpDir('g173-js-');
  const chunks = path.join(dir, 'static/chunks');
  mkdirSync(chunks, { recursive: true });
  writeFileSync(path.join(chunks, 'runtime.js'), 'x'.repeat(50_000)); // compresses to almost nothing
  writeFileSync(path.join(chunks, 'polyfill.js'), randomBytes(400_000).toString('base64'));
  writeFileSync(path.join(chunks, 'page.js'), randomBytes(pageKB * 1024));
  writeFileSync(path.join(dir, 'build-manifest.json'), JSON.stringify({ polyfillFiles: ['static/chunks/polyfill.js'], rootMainFiles: ['static/chunks/runtime.js'] }));
  const page = (rel: string, key: string, files: string[]) => {
    mkdirSync(path.join(dir, 'server/app', rel), { recursive: true });
    const m = { entryJSFiles: { [`[project]/app${key}`]: files } };
    writeFileSync(path.join(dir, 'server/app', rel, 'page_client-reference-manifest.js'), `globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};\nglobalThis.__RSC_MANIFEST[${JSON.stringify(key)}] = ${JSON.stringify(m)};\n`);
  };
  page('(marketing)/(en)/faq', '/(marketing)/(en)/faq/page', ['static/chunks/runtime.js']);
  page('edit/[slug]', '/edit/[slug]/page', ['static/chunks/page.js', 'static/chunks/polyfill.js']);
  return dir;
}

test('route names drop route groups; budgets per group, the sales site is the fallback', () => {
  assert.equal(jsBudget.routeOf('/(marketing)/(en)/designs/[design]/page'), '/designs/[design]');
  assert.equal(jsBudget.routeOf('/(marketing)/(en)/page'), '/');
  assert.equal(jsBudget.budgetFor('/edit/[slug]'), 270);
  assert.equal(jsBudget.budgetFor('/start'), 160);
  assert.equal(jsBudget.budgetFor('/i18n/[lang]/faq'), 155);
  assert.ok(jsBudget.BUDGETS.every(([, kb]) => kb <= 270), 'no budget above the measured editor + margin');
});

test('sums runtime + entry chunks (gzip), leaves the noModule polyfill out, flags a route over budget', () => {
  const ok = jsBudget.checkBudgets(fakeBuild(200));
  assert.deepEqual(ok.problems, []);
  const edit = ok.rows.find((r) => r.route === '/edit/[slug]')!;
  assert.ok(!edit.files.includes('static/chunks/polyfill.js'), 'polyfill excluded');
  assert.ok(edit.kb > 195 && edit.kb < 215, `random bytes do not compress: ${edit.kb}`);
  assert.ok(ok.rows.find((r) => r.route === '/faq')!.kb < 5);
  const big = jsBudget.checkBudgets(fakeBuild(300));
  assert.equal(big.problems.length, 1);
  assert.match(big.problems[0], /^\/edit\/\[slug\]: \d+(\.\d)? KB gzip first-load JS > budget 270 KB$/);
});

test('npm run build runs the budget after trace-check', () => {
  const pkg = JSON.parse(readFileSync(path.join(PLATFORM_ROOT, 'package.json'), 'utf8')) as { scripts: Record<string, string> };
  assert.equal(pkg.scripts.postbuild, 'node scripts/trace-check.cjs && node scripts/js-budget.cjs');
});
