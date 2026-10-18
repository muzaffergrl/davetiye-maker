// G181: the buyer's editor is split per view. (1) The shell (Panel.tsx) imports no view module statically — every view and
// sheet comes through lazy.tsx (next/dynamic). (2) On a build (`npm run build` first; skipped without one), the first-load
// JS of /edit/[slug] (scripts/js-budget.cjs: runtime + the route's entry chunks) holds the code of no view: a text that
// only that view's module shows is in none of those files. (3) The deep-link skeleton knows every address the panel
// opens. The browser side (deep links open the right view, the skeleton before hydration, the idle prefetch) is
// tests/g181-browser.ts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { PLATFORM_ROOT } from './helpers.ts';

const require = createRequire(import.meta.url);
const jsBudget = require('../scripts/js-budget.cjs') as { routeJs: (nextDir?: string) => Array<{ route: string; files: string[]; kb: number }> };
const PANEL = path.join(PLATFORM_ROOT, 'components/panel');
const read = (f: string) => readFileSync(path.join(PANEL, f), 'utf8');
/** The code without its comments (a comment may name another view's text). */
const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** A text only this view's module has (checked against the source below, so a moved text fails here, not silently). */
const VIEW_MARKERS: Array<{ view: string; file: string; marker: string }> = [
  { view: 'setup', file: 'Setup.tsx', marker: 'Your names and date' },
  { view: 'home', file: 'views.tsx', marker: 'How ready your website is' },
  { view: 'edit (list)', file: 'EditListView.tsx', marker: 'data-section-row' },
  { view: 'editor page', file: 'EditorPage.tsx', marker: 'Preview this page' },
  { view: 'guests', file: 'guests.tsx', marker: 'Mark as seen' },
  { view: 'share', file: 'ShareView.tsx', marker: 'Take the website offline' },
  { view: 'help sheet', file: 'HelpSheet.tsx', marker: 'How long does my website stay online?' },
  { view: 'names & date sheet', file: 'IdentitySheet.tsx', marker: 'Adding a surname is free.' },
  { view: 'live sheet', file: 'Published.tsx', marker: 'Next, if you like' },
];

const VIEW_MODULES = ['Setup', 'views', 'EditListView', 'EditorPage', 'guests', 'ShareView', 'HelpSheet', 'IdentitySheet', 'Published', 'sections', 'ExtrasFields', 'fields', 'CopyFields', 'PhotosSection', 'ShareKit'];

/** Static imports of a module: `import … from './x.tsx'` (type-only imports vanish from the bundle and are skipped). */
function staticImports(src: string): string[] {
  return [...src.matchAll(/^import\s+(?!type\s)[^;]*?from\s+'\.\/([^']+)\.(?:tsx|ts)';/gms)].map((m) => m[1]);
}

test('markers: each view text is in its own module and in no module the shell imports', () => {
  for (const m of VIEW_MARKERS) assert.ok(read(m.file).includes(m.marker), `${m.file} no longer has ${JSON.stringify(m.marker)}`);
  const shell = ['Panel.tsx', 'context.tsx', 'publish-gate.tsx', 'setup-state.ts', 'next-steps.ts', 'replies.ts', 'lazy.tsx', 'PreviewPane.tsx', 'ui.tsx', 'usePanel.ts', 'pages.ts'];
  for (const f of shell) for (const m of VIEW_MARKERS) assert.ok(!code(f).includes(m.marker), `${f} (shell) has the ${m.view} text ${JSON.stringify(m.marker)}`);
});

test('the shell imports no view module statically; lazy.tsx loads each one with next/dynamic', () => {
  const panel = staticImports(read('Panel.tsx'));
  for (const v of VIEW_MODULES) assert.ok(!panel.includes(v), `Panel.tsx imports ./${v} statically`);
  // nor through the small shell modules it imports
  for (const f of ['context.tsx', 'publish-gate.tsx', 'setup-state.ts', 'next-steps.ts', 'replies.ts', 'PreviewPane.tsx']) {
    for (const v of VIEW_MODULES) assert.ok(!staticImports(read(f)).includes(v), `${f} imports ./${v} statically`);
  }
  const lazy = read('lazy.tsx');
  assert.equal(staticImports(lazy).length, 0, 'lazy.tsx imports no panel module statically');
  for (const v of ['Setup', 'views', 'EditListView', 'EditorPage', 'guests', 'ShareView', 'HelpSheet', 'IdentitySheet', 'Published']) {
    assert.match(lazy, new RegExp(`dynamic\\(\\(\\) => import\\('\\./${v}\\.tsx'\\)`), `lazy.tsx: dynamic() for ${v}`);
  }
  assert.match(lazy, /requestIdleCallback/, 'the other views load when the browser is idle');
});

test('the deep-link skeleton covers every address the panel opens (Panel.tsx BootShell)', () => {
  const src = read('Panel.tsx');
  assert.match(src, /function BootShell\(/);
  // the addresses parseHash knows, besides setup steps
  for (const h of ["'home'", "'edit'", "'guests'", "'guests/results'", "'guests/print'", "'share'"]) assert.ok(src.includes(h), `bootTargets lists ${h}`);
  assert.match(src, /PAGE_IDS\.map\(\(p\) => `edit\/\$\{p\}`\)/);
  assert.match(src, /SECTION_IDS\.map\(\(id\) => `edit\/\$\{id\}`\)/);
  // the skeleton goes before the real view's first paint
  assert.match(src, /useLayoutEffect\(\(\) => \{\s*if \(ready\) for \(const el of document\.querySelectorAll\('\[data-boot\]'\)\) el\.removeAttribute\('data-boot'\);/);
  const css = read('panel.module.css');
  assert.match(css, /\.app\[data-boot\] > :not\(\.bootShell\) \{\s*display: none !important;/);
});

const BUILD = path.join(PLATFORM_ROOT, '.next');
const built = existsSync(path.join(BUILD, 'BUILD_ID')) && existsSync(path.join(BUILD, 'build-manifest.json'));
/** The newest panel source (components/panel, recursively): a build older than it would test yesterday's split. */
function newestPanelSource(dir = PANEL): number {
  let newest = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    newest = Math.max(newest, e.isDirectory() ? newestPanelSource(p) : statSync(p).mtimeMs);
  }
  return newest;
}
const buildSkip = !built
  ? 'no build (npm run build)'
  : statSync(path.join(BUILD, 'BUILD_ID')).mtimeMs < newestPanelSource()
    ? 'the build is older than components/panel (npm run build)'
    : false;

test('build: the first-load JS of /edit/[slug] holds no view’s code', { skip: buildSkip }, () => {
  const edit = jsBudget.routeJs(BUILD).find((r) => r.route === '/edit/[slug]');
  assert.ok(edit, 'the build has /edit/[slug]');
  const first = edit!.files.map((f) => readFileSync(path.join(BUILD, f), 'utf8')).join('\n');
  // the shell itself is there (a text of Panel.tsx's own changes bar)…
  assert.ok(first.includes('Unpublished changes'), 'the panel shell is in the first load');
  // …and no view
  const found = VIEW_MARKERS.filter((m) => first.includes(m.marker)).map((m) => m.view);
  assert.deepEqual(found, [], `views in the first-load JS of /edit/[slug]: ${found.join(', ')}`);
  // each view's code is in the build (in a chunk of its own, loaded later)
  const chunks = path.join(BUILD, 'static/chunks');
  const all = require('node:fs').readdirSync(chunks).filter((f: string) => f.endsWith('.js')).map((f: string) => readFileSync(path.join(chunks, f), 'utf8'));
  for (const m of VIEW_MARKERS) assert.ok(all.some((c: string) => c.includes(m.marker)), `${m.view}: its chunk is in the build`);
});
