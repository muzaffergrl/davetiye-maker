// "My website" (/my, G095): the editors opened on THIS device, so the sales site's "My website" button can take
// the buyer straight back to their panel. Kept only in this browser's localStorage (the edit link is already in its
// history); never sent anywhere. The buyer can remove an entry on /my. No Node imports (browser module).

export const REMEMBER_KEY = 'bke:editors';
const MAX = 5;

export interface RememberedEditor {
  slug: string;
  /** "/edit/<slug>?k=<key>" (same origin, no hash). */
  path: string;
  names: string;
  at: string;
}

function valid(e: unknown): e is RememberedEditor {
  const r = e as RememberedEditor;
  return Boolean(r && typeof r.slug === 'string' && typeof r.path === 'string' && r.path.startsWith(`/edit/${r.slug}?k=`) && typeof r.at === 'string');
}

export function readEditors(storage: Pick<Storage, 'getItem'> = window.localStorage): RememberedEditor[] {
  try {
    const list = JSON.parse(storage.getItem(REMEMBER_KEY) ?? '[]');
    return Array.isArray(list) ? list.filter(valid).sort((a, b) => b.at.localeCompare(a.at)) : [];
  } catch {
    return [];
  }
}

export function rememberEditor(entry: RememberedEditor, storage: Pick<Storage, 'getItem' | 'setItem'> = window.localStorage): void {
  try {
    const rest = readEditors(storage).filter((e) => e.slug !== entry.slug);
    storage.setItem(REMEMBER_KEY, JSON.stringify([entry, ...rest].slice(0, MAX)));
  } catch {
    /* storage full or blocked: the button then explains how to open the editor */
  }
}

export function forgetEditor(slug: string, storage: Pick<Storage, 'getItem' | 'setItem'> = window.localStorage): void {
  try {
    storage.setItem(REMEMBER_KEY, JSON.stringify(readEditors(storage).filter((e) => e.slug !== slug)));
  } catch {
    /* ignore */
  }
}

/** An edit link pasted on /my → its same-origin path, or null when it is not one of our edit links. */
export function editPathFromLink(text: string, origin: string): string | null {
  const v = text.trim();
  if (!v) return null;
  let url: URL;
  try {
    url = new URL(v, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin) return null;
  const m = /^\/edit\/([a-z0-9-]{3,48})$/.exec(url.pathname);
  const k = url.searchParams.get('k');
  return m && k ? `/edit/${m[1]}?k=${encodeURIComponent(k)}` : null;
}
