// Read-only backup of the production Vercel Blob store (G955, docs/10 §2c "Yedek"): every blob — site records
// (sites/), address and order indexes (slugs/, orders/), guest replies (rsvps/), photos and music (media/), site documents
// (docs/: Google Sheets connection …), shop keys and counters (keys/, limits/ …) — is copied to a LOCAL folder, with a
// manifest (path, size, SHA-256, upload time) so the copy can be checked and restored by hand.
//
//   cd platform
//   vercel env pull --environment=production .env.production.local     # BLOB_READ_WRITE_TOKEN of the production store
//   node --env-file=.env.production.local scripts/blob-backup.mjs --out ~/bke-backups/blob-2026-10-23
//   node --env-file=.env.production.local scripts/blob-backup.mjs --out … --dry-run      # list only: counts and sizes
//
// Options: --out <folder> (required; never inside this repository — the copy holds buyers' emails and guests' replies),
//          --dry-run (lists, downloads and writes nothing), --prefix <p> (only blobs under p, e.g. rsvps/),
//          --concurrency <n> (parallel downloads, default 4, at most 16), --verify (re-hash files already in the folder).
//
// Read-only by construction: the store is only LISTED and READ (list + get); this file never imports or calls put,
// del or copy. Resumable: a stopped run (network, laptop lid) is started again with the same --out: a blob already in
// the folder with the same size and upload time (recorded in progress.jsonl / manifest.json) is not downloaded again.
// Files are written as <name>.part and renamed when complete, so a half-written file never counts as done.
// The token is never printed. Exit code: 0 = every blob copied, 1 = some failed (listed; run again), 2 = usage.
//
// Folder layout:  <out>/files/<blob pathname>   the bytes as stored
//                 <out>/progress.jsonl         one line per copied blob (kept for resuming)
//                 <out>/manifest.json          written at the end: {complete, startedAt, finishedAt, count, bytes,
//                                              prefixes: {sites/: n, …}, files: [{pathname, size, sha256, uploadedAt}],
//                                              failed: [{pathname, error}]}

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync, appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ACCESS = 'private';

/** The repository root (two folders up from platform/scripts): backups must never land inside it. */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** A store pathname as a safe relative file path (no "..", no absolute path, no backslash / NUL), else null. */
export function safeRelative(pathname) {
  if (typeof pathname !== 'string' || !pathname || pathname.length > 1024) return null;
  if (pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0')) return null;
  const parts = pathname.split('/');
  if (parts.some((p) => p === '' || p === '.' || p === '..')) return null;
  return parts.join(path.sep);
}

/** True when `dir` is the repository or inside it. */
export function insideRepo(dir, repoRoot = REPO_ROOT) {
  const rel = path.relative(repoRoot, path.resolve(dir));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

const iso = (d) => (d instanceof Date ? d.toISOString() : typeof d === 'string' ? new Date(d).toISOString() : null);
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const topPrefix = (p) => (p.includes('/') ? `${p.slice(0, p.indexOf('/'))}/` : '(root)');

async function readStream(stream) {
  const chunks = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

/** Every blob of the store (or under `prefix`), sorted by pathname. */
export async function listStore(client, token, prefix) {
  const out = [];
  let cursor;
  do {
    const page = await client.list({ prefix: prefix || undefined, cursor, limit: 1000, token });
    for (const b of page.blobs) out.push({ pathname: b.pathname, size: b.size, uploadedAt: iso(b.uploadedAt) });
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out.sort((a, b) => (a.pathname < b.pathname ? -1 : a.pathname > b.pathname ? 1 : 0));
}

/** What earlier runs into this folder recorded: pathname -> {size, sha256, uploadedAt}. */
function loadDone(out) {
  const done = new Map();
  const manifest = path.join(out, 'manifest.json');
  if (existsSync(manifest)) {
    try {
      for (const f of JSON.parse(readFileSync(manifest, 'utf8')).files ?? []) done.set(f.pathname, f);
    } catch {
      /* a damaged manifest: the progress file and the files decide */
    }
  }
  const progress = path.join(out, 'progress.jsonl');
  if (existsSync(progress)) {
    for (const line of readFileSync(progress, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try {
        const f = JSON.parse(line);
        if (f && typeof f.pathname === 'string') done.set(f.pathname, f);
      } catch {
        /* a line cut by a crash */
      }
    }
  }
  return done;
}

/**
 * One backup run. `client`: {list, get} with the @vercel/blob signatures (tests pass a fake). Never calls anything else
 * on it. Returns the summary that is also written as manifest.json (not in a dry run).
 */
export async function runBackup({ client, token, out, dryRun = false, prefix = '', concurrency = 4, verify = false, log = console.log, now = () => new Date() }) {
  if (!client || typeof client.list !== 'function' || typeof client.get !== 'function') throw new Error('a blob client with list() and get() is needed');
  const startedAt = now().toISOString();
  const blobs = await listStore(client, token, prefix);
  const prefixes = {};
  let bytes = 0;
  for (const b of blobs) {
    const k = topPrefix(b.pathname);
    prefixes[k] = (prefixes[k] ?? 0) + 1;
    bytes += b.size;
  }
  log(`${blobs.length} blobs, ${(bytes / 1024 / 1024).toFixed(1)} MB${prefix ? ` under ${prefix}` : ''}: ${Object.entries(prefixes).map(([k, n]) => `${k} ${n}`).join(', ') || '—'}`);
  if (dryRun) return { dryRun: true, startedAt, count: blobs.length, bytes, prefixes, files: [], failed: [] };

  const filesDir = path.join(out, 'files');
  mkdirSync(filesDir, { recursive: true });
  const progressFile = path.join(out, 'progress.jsonl');
  const done = loadDone(out);
  const files = [];
  const failed = [];
  let copied = 0;
  let skipped = 0;

  const one = async (b) => {
    const rel = safeRelative(b.pathname);
    if (!rel) {
      failed.push({ pathname: b.pathname, error: 'unsafe_pathname' });
      return;
    }
    const target = path.join(filesDir, rel);
    const before = done.get(b.pathname);
    if (before && before.size === b.size && before.uploadedAt === b.uploadedAt && existsSync(target) && statSync(target).size === b.size) {
      if (!verify || sha256(readFileSync(target)) === before.sha256) {
        files.push({ pathname: b.pathname, size: b.size, sha256: before.sha256, uploadedAt: b.uploadedAt });
        skipped++;
        return;
      }
    }
    let lastError = 'error';
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await client.get(b.pathname, { access: ACCESS, token, useCache: false });
        if (!res || res.statusCode !== 200 || !res.stream) throw Object.assign(new Error('not found'), { name: 'BlobNotFound' });
        const buf = await readStream(res.stream);
        // the listing's upload time: the next run compares it with its own listing to skip this blob
        const entry = { pathname: b.pathname, size: buf.length, sha256: sha256(buf), uploadedAt: b.uploadedAt };
        mkdirSync(path.dirname(target), { recursive: true });
        writeFileSync(`${target}.part`, buf);
        renameSync(`${target}.part`, target);
        appendFileSync(progressFile, `${JSON.stringify(entry)}\n`);
        files.push(entry);
        copied++;
        return;
      } catch (e) {
        // Only the error's name: an SDK message can quote a URL; the token is never in it, but nothing is risked.
        lastError = e?.name || 'error';
      }
    }
    failed.push({ pathname: b.pathname, error: lastError });
  };

  const queue = [...blobs];
  const workers = Array.from({ length: Math.max(1, Math.min(16, Math.floor(concurrency) || 1)) }, async () => {
    for (let b = queue.shift(); b; b = queue.shift()) await one(b);
  });
  await Promise.all(workers);

  files.sort((a, b) => (a.pathname < b.pathname ? -1 : 1));
  const summary = {
    complete: failed.length === 0,
    startedAt,
    finishedAt: now().toISOString(),
    prefix: prefix || null,
    count: files.length,
    bytes: files.reduce((n, f) => n + f.size, 0),
    prefixes,
    copied,
    skipped,
    files,
    failed,
  };
  writeFileSync(path.join(out, 'manifest.json.part'), `${JSON.stringify(summary, null, 2)}\n`);
  renameSync(path.join(out, 'manifest.json.part'), path.join(out, 'manifest.json'));
  log(`copied ${copied}, already there ${skipped}, failed ${failed.length}${failed.length ? ' (run the same command again)' : ''} -> ${out}`);
  return summary;
}

function parseArgs(argv) {
  const args = { dryRun: false, verify: false, prefix: '', concurrency: 4, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--verify') args.verify = true;
    else if (a === '--out') args.out = argv[++i] ?? null;
    else if (a === '--prefix') args.prefix = argv[++i] ?? '';
    else if (a === '--concurrency') args.concurrency = Number(argv[++i]);
    else throw new Error(`unknown option ${a}`);
  }
  return args;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is not set (vercel env pull --environment=production .env.production.local, then --env-file).');
    process.exit(2);
  }
  if (!args.dryRun) {
    if (!args.out) {
      console.error('--out <folder> is required (outside this repository).');
      process.exit(2);
    }
    if (insideRepo(args.out)) {
      console.error('--out is inside the repository: the backup holds private data and must never be committed. Choose a folder outside it.');
      process.exit(2);
    }
  }
  const { list, get } = await import('@vercel/blob');
  const summary = await runBackup({ client: { list, get }, token, out: args.out ?? '', dryRun: args.dryRun, prefix: args.prefix, concurrency: args.concurrency, verify: args.verify });
  process.exit(summary.failed.length ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`backup failed: ${e?.name || 'error'}`);
    process.exit(1);
  });
}
