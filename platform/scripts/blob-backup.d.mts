// Types of scripts/blob-backup.mjs (G955) for the TypeScript tests.
export const REPO_ROOT: string;
export function safeRelative(pathname: string): string | null;
export function insideRepo(dir: string, repoRoot?: string): boolean;

export interface BackupBlob {
  pathname: string;
  size: number;
  uploadedAt: string | null;
}
export interface BackupFile {
  pathname: string;
  size: number;
  sha256: string;
  uploadedAt: string | null;
}
export interface BackupClient {
  list(options: { prefix?: string; cursor?: string; limit?: number; token?: string }): Promise<{
    blobs: Array<{ pathname: string; size: number; uploadedAt: Date | string }>;
    cursor?: string;
    hasMore: boolean;
  }>;
  get(pathname: string, options: { access: 'private'; token?: string; useCache?: boolean }): Promise<unknown>;
}
export interface BackupSummary {
  dryRun?: boolean;
  complete?: boolean;
  startedAt: string;
  finishedAt?: string;
  prefix?: string | null;
  count: number;
  bytes: number;
  prefixes: Record<string, number>;
  copied?: number;
  skipped?: number;
  files: BackupFile[];
  failed: Array<{ pathname: string; error: string }>;
}
export function listStore(client: BackupClient, token: string | undefined, prefix?: string): Promise<BackupBlob[]>;
export function runBackup(opts: {
  client: BackupClient;
  token?: string;
  out: string;
  dryRun?: boolean;
  prefix?: string;
  concurrency?: number;
  verify?: boolean;
  log?: (line: string) => void;
  now?: () => Date;
}): Promise<BackupSummary>;
