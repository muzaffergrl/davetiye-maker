// Local platform server with a theme's seeded demo site (same seeding as tools/listing_templates/capture.ts).
// usage: node serve.ts <theme> <info.json>   — writes {base, slug, key}, keeps running until killed.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const PLATFORM = process.env.DM_ROOT ? path.join(process.env.DM_ROOT, 'platform') : 'C:/Users/Foto/Documents/davetiye-maker/platform';
const { startNext, waitForServer } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/browser.ts')).href);
const { loadThemeEnv, demoSlug } = await import(pathToFileURL(path.join(PLATFORM, 'scripts/lib/theme-env.ts')).href);
const [THEME, INFO] = process.argv.slice(2);
const PUBLIC_URL = 'https://bkestudio.com';
const env = loadThemeEnv({ theme: THEME });
const demo = structuredClone(env.demo);
demo.optional_blocks = { ...demo.optional_blocks, faq: true };
demo.faq = [
  { q: 'Is there parking at the venue?', a: 'Yes, free parking next to the main house.\nThe gate opens at 3:00 PM.' },
  { q: 'Can we bring our children?', a: 'We love your little ones, but this is an adults-only celebration so everyone can relax and dance.' },
];
demo.rsvp = { ...demo.rsvp, questions: [{ id: 'meal', label: 'Meal choice', type: 'choice', options: ['Chicken', 'Fish', 'Vegetarian'] }] };
const SLUG = demoSlug(demo);
const dataDir = mkdtempSync(path.join(os.tmpdir(), 'vid-data-'));
const contentFile = path.join(dataDir, 'demo-content.json');
writeFileSync(contentFile, JSON.stringify(demo));
const ownPhotos = String((demo.media as Record<string, unknown> | undefined)?.hero_portrait ?? '').startsWith(`/themes/${THEME}/`);
const seedPhotos = env.photosDir && !(ownPhotos && env.photosSource.includes('fallback')) ? ['--photos', env.photosDir] : ['--no-photos'];
const seed = spawnSync(process.execPath, [path.join(PLATFORM, 'scripts/seed.ts'), '--theme', THEME, '--slug', SLUG, '--content', contentFile, ...seedPhotos],
  { cwd: PLATFORM, env: { ...process.env, PLATFORM_DATA_DIR: dataDir, DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL }, encoding: 'utf8' });
if (seed.status !== 0) { console.error(`seed failed:\n${seed.stdout}\n${seed.stderr}`); process.exit(1); }
const keys = JSON.parse(readFileSync(path.join(dataDir, 'seed-keys.json'), 'utf8'));
// a free port from the OS (several servers run side by side; a random pick could collide)
const port: number = await new Promise((resolve, reject) => {
  const s = net.createServer();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => { const p = (s.address() as { port: number }).port; s.close(() => resolve(p)); });
});
const server = startNext({ port, dataDir, env: { DATA_ADAPTER: 'local', PLATFORM_PUBLIC_URL: PUBLIC_URL } });
await waitForServer(`${server.base}/`, 60_000, server);
const replies = [
  { name: 'Olivia Bennett', email: '', attending: 'yes', guests: 2, message: 'We would not miss it!', answers: { meal: 'Fish' } },
  { name: 'Marcus Reed', email: '', attending: 'yes', guests: 1, message: '', answers: { meal: 'Vegetarian' } },
  { name: 'Hannah Clarke', email: '', attending: 'no', guests: 0, message: 'So sorry to miss it. Sending love!', answers: {} },
  { name: 'The Alvarez Family', email: '', attending: 'yes', guests: 4, message: 'Counting the days.', answers: { meal: 'Chicken' } },
];
for (const r of replies) await fetch(`${server.base}/api/rsvp/${SLUG}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...r, website: '' }) });
writeFileSync(INFO, JSON.stringify({ base: server.base, slug: SLUG, key: keys.editKey, dataDir }, null, 1));
console.log('ready', server.base, SLUG);
process.on('SIGINT', () => { server.stop(); process.exit(0); });
process.on('SIGTERM', () => { server.stop(); process.exit(0); });
setInterval(() => writeFileSync(INFO.replace(/\.json$/, '.log'), server.log()), 2000);
