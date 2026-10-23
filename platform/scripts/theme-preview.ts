// Light preview server for theme work (docs/35 §6b, 2026-10-22): serves /start/demo/<theme>[/<page>] through the real
// demo handler (lib/claim/demo-page.ts) and every other path as a static file (themes/… from themes/, the rest from
// public/), without Next.js — several theme sessions can run side by side on a small machine. Not for production.
//
//   node scripts/theme-preview.ts --port 3123            # then open http://localhost:3123/start/demo/<theme>
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleDemoPage } from '../lib/claim/demo-page.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const i = process.argv.indexOf('--port');
const PORT = Number(i > 0 ? process.argv[i + 1] : 3199);
const TYPES: Record<string, string> = { '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.json': 'application/json',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp4': 'video/mp4' };

createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const m = /^\/start\/demo\/([a-z0-9_-]+)(?:\/([a-z]+))?\/?$/.exec(url.pathname);
  try {
    if (m) {
      const r = await handleDemoPage(new Request(url), m[1], m[2] || 'index');
      res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'text/html' });
      res.end(Buffer.from(await r.arrayBuffer()));
      return;
    }
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (rel.includes('..')) throw new Error('bad path');
    // /themes/<id>/~<variant>/… → the original file
    const file = rel.startsWith('themes/') ? path.join(ROOT, rel.replace(/\/~[a-z0-9-]+\//, '/')) : path.join(ROOT, 'public', rel);
    if (!(await stat(file)).isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
}).listen(PORT, () => console.log(`theme-preview: http://localhost:${PORT}/start/demo/<theme>`));
