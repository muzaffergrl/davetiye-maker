// Adapter selection. DATA_ADAPTER=local (default) | supabase (G043, not built yet).
// PLATFORM_DATA_DIR sets the local folder (default: <cwd>/.data).

import path from 'node:path';
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
  if (kind === 'supabase') {
    throw new Error('DATA_ADAPTER=supabase is not implemented yet (task G043, needs user approval).');
  }
  throw new Error(`Unknown DATA_ADAPTER "${kind}"`);
}
