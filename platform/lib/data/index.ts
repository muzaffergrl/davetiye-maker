// Adapter selection. DATA_ADAPTER=local (default) | blob (Vercel Blob, G048) | supabase (G043, not built yet).
// PLATFORM_DATA_DIR sets the local folder (default: <cwd>/.data).
// blob: BLOB_READ_WRITE_TOKEN of a *private* Blob store (Vercel adds it when the store is connected
// to the project; or Vercel OIDC with BLOB_STORE_ID). The token is never logged.

import { createHash } from 'node:crypto';
import path from 'node:path';
import { BlobAdapter } from './blob/index.ts';
import { LocalAdapter } from './local/index.ts';
import type { DataAdapter } from './types.ts';

export * from './types.ts';

const instances = new Map<string, DataAdapter>();

export function localDataDir(): string {
  return process.env.PLATFORM_DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), '.data');
}

export function getDataAdapter(): DataAdapter {
  const kind = process.env.DATA_ADAPTER || 'local';
  if (kind === 'local') {
    const dir = localDataDir();
    const key = `local:${dir}`;
    let adapter = instances.get(key);
    if (!adapter) {
      adapter = new LocalAdapter(dir);
      instances.set(key, adapter);
    }
    return adapter;
  }
  if (kind === 'blob') {
    const token = process.env.BLOB_READ_WRITE_TOKEN || undefined;
    if (!token && !process.env.BLOB_STORE_ID) {
      throw new Error(
        'DATA_ADAPTER=blob needs BLOB_READ_WRITE_TOKEN (added by Vercel when a private Blob store is connected to the project).',
      );
    }
    // One instance per token (keyed by a hash, so the map never holds the token as a key).
    const key = `blob:${createHash('sha256').update(token ?? '').digest('hex').slice(0, 16)}`;
    let adapter = instances.get(key);
    if (!adapter) {
      adapter = new BlobAdapter({ token });
      instances.set(key, adapter);
    }
    return adapter;
  }
  if (kind === 'supabase') {
    throw new Error('DATA_ADAPTER=supabase is not implemented yet (task G043, needs user approval).');
  }
  throw new Error(`Unknown DATA_ADAPTER "${kind}"`);
}
