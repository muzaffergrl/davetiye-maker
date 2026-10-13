import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';
import type { ContentRecord } from '../lib/content/types.ts';

export const PLATFORM_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO_ROOT = path.resolve(PLATFORM_ROOT, '..');

/** Demo content of design 03 (the seed record). Fresh copy each call. */
export function demoContent(): ContentRecord {
  const file = path.join(REPO_ROOT, 'collections/03_Blush_Garden_Rose/content.demo.json');
  return JSON.parse(readFileSync(file, 'utf8')) as ContentRecord;
}

export function tmpDir(prefix = 'platform-test-'): string {
  return mkdtempSync(path.join(os.tmpdir(), prefix));
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** A real 1x1 PNG generated in code (no binary fixtures in the repo). */
export function tinyPng(): Uint8Array {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(1, 0);
  ihdr.writeUInt32BE(1, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  const raw = Buffer.from([0, 0xe6, 0xc8, 0xc8]); // filter byte + one pixel
  return new Uint8Array(
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw)),
      chunk('IEND', Buffer.alloc(0)),
    ]),
  );
}
