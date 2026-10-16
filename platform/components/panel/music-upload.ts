// Browser side of POST /api/edit/<slug>/music (G126, lib/panel/music.ts): the file goes in parts of at most 3.5 MB.
// The part size and limits are repeated here (not imported) so the panel bundle does not pull server modules.

export const MUSIC_MAX_BYTES = 10 * 1024 * 1024;
const PART_BYTES = 3.5 * 1024 * 1024;
export const MUSIC_ACCEPT = 'audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/aac,.mp3,.m4a,.aac';
const EXT_RE = /\.(mp3|m4a|aac)$/i;

export interface MusicUploadResult {
  ok: boolean;
  url?: string;
  message?: string;
}

/** A first check in the browser (the server checks the bytes again). */
export function musicFileProblem(file: File): string | null {
  if (!file.size) return 'The file is empty.';
  if (file.size > MUSIC_MAX_BYTES) return 'The music file is larger than 10 MB. Please choose a shorter or smaller file.';
  const typeOk = !file.type || /^audio\/(mpeg|mp3|mpeg3|x-mpeg|mp4|x-m4a|m4a|aac|x-aac|aacp)$/i.test(file.type);
  if (!typeOk || (!EXT_RE.test(file.name) && !file.type)) return 'Please choose an MP3 or M4A (AAC) music file.';
  return null;
}

function uploadId(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

export async function uploadMusicFile(slug: string, editKey: string, file: File, onProgress?: (share: number) => void): Promise<MusicUploadResult> {
  const problem = musicFileProblem(file);
  if (problem) return { ok: false, message: problem };
  const id = uploadId();
  const parts = Math.max(1, Math.ceil(file.size / PART_BYTES));
  for (let i = 0; i < parts; i++) {
    const chunk = file.slice(i * PART_BYTES, Math.min(file.size, (i + 1) * PART_BYTES));
    let res: Response;
    try {
      res = await fetch(`/api/edit/${encodeURIComponent(slug)}/music`, {
        method: 'POST',
        cache: 'no-store',
        credentials: 'same-origin',
        headers: {
          Authorization: `Bearer ${editKey}`,
          'Content-Type': 'application/octet-stream',
          'X-Upload-Id': id,
          'X-Upload-Part': String(i),
          'X-Upload-Parts': String(parts),
          'X-Upload-Type': file.type || '',
        },
        body: chunk,
      });
    } catch {
      return { ok: false, message: 'No connection. Please try again when you are back online.' };
    }
    let body: { ok?: boolean; url?: string; message?: string } = {};
    try {
      body = await res.json();
    } catch {
      /* not JSON */
    }
    if (!res.ok || body.ok === false) return { ok: false, message: body.message ?? 'The music could not be uploaded.' };
    onProgress?.((i + 1) / parts);
    if (i === parts - 1) return typeof body.url === 'string' ? { ok: true, url: body.url } : { ok: false, message: 'The music could not be uploaded.' };
  }
  return { ok: false, message: 'The music could not be uploaded.' };
}
