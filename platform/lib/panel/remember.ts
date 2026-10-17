// "My website" (/my, G095): the editors opened on THIS device, so the sales site's "My website" button can take
// the buyer straight back to their panel. Kept only in this browser's localStorage (the edit link is already in its
// history); never sent anywhere. The buyer can remove an entry on /my. No Node imports (browser module).
// G146: an entry may hold a device key (order number + email on /my or /start) instead of the edit key; same checks.

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

export type EditorCheck = 'ok' | 'gone' | 'unknown';

/**
 * Does a remembered editor still open (G135)? Asks the panel API with the stored key (same origin, key in the
 * Authorization header as the panel sends it). 401/404/410 = the website was deleted or the link was replaced by a
 * new one: "gone". Network errors, 5xx and rate limits are "unknown" (kept: the link may well work later).
 */
export async function checkEditor(e: RememberedEditor, fetcher: typeof fetch = fetch): Promise<EditorCheck> {
  const key = new URL(e.path, 'http://x').searchParams.get('k');
  if (!key) return 'gone';
  try {
    const res = await fetcher(`/api/edit/${encodeURIComponent(e.slug)}`, { headers: { authorization: `Bearer ${key}` }, cache: 'no-store' });
    if (res.ok) return 'ok';
    return res.status === 401 || res.status === 404 || res.status === 410 ? 'gone' : 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Checks every remembered editor and forgets the ones that no longer open. Returns what is left and what was dropped. */
export async function dropGoneEditors(
  storage: Pick<Storage, 'getItem' | 'setItem'> = window.localStorage,
  fetcher: typeof fetch = fetch,
): Promise<{ editors: RememberedEditor[]; gone: RememberedEditor[] }> {
  const list = readEditors(storage);
  const checks = await Promise.all(list.map((e) => checkEditor(e, fetcher)));
  const gone = list.filter((_, i) => checks[i] === 'gone');
  for (const e of gone) forgetEditor(e.slug, storage);
  return { editors: readEditors(storage), gone };
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

// ---------------------------------------------------------------------------------------------
// G146: hand-overs between /my, /start and the panel in THIS tab (sessionStorage, never the URL: an email address or an
// order number must not end up in the address bar, the history or a server log).

/** /my → /start: the order number and email the buyer already typed (read once by the /start form). */
export const START_PREFILL_KEY = 'bke:start-prefill';
/** /start → panel: "this order already has a website — we opened it for you" (the slug it was opened for). */
export const OPENED_EXISTING_KEY = 'bke:opened-existing';
const PREFILL_MAX_AGE_MS = 30 * 60_000;

export interface StartPrefill {
  orderNumber: string;
  email: string;
}

type SessionStore = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function session(): SessionStore | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveStartPrefill(value: StartPrefill, storage: SessionStore | null = session()): void {
  try {
    storage?.setItem(START_PREFILL_KEY, JSON.stringify({ orderNumber: value.orderNumber.slice(0, 40), email: value.email.slice(0, 254), at: Date.now() }));
  } catch {
    /* private mode: the buyer types them again */
  }
}

/** The /my prefill (once: it is removed when read), or null when there is none or it is older than 30 minutes. */
export function takeStartPrefill(storage: SessionStore | null = session(), now: number = Date.now()): StartPrefill | null {
  try {
    const raw = storage?.getItem(START_PREFILL_KEY);
    storage?.removeItem(START_PREFILL_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { orderNumber?: unknown; email?: unknown; at?: unknown };
    if (typeof v.orderNumber !== 'string' || typeof v.email !== 'string' || typeof v.at !== 'number') return null;
    if (now - v.at > PREFILL_MAX_AGE_MS || v.at > now + 60_000) return null;
    return { orderNumber: v.orderNumber, email: v.email };
  } catch {
    return null;
  }
}

export function markOpenedExisting(slug: string, storage: SessionStore | null = session()): void {
  try {
    storage?.setItem(OPENED_EXISTING_KEY, slug);
  } catch {
    /* the panel opens without the note */
  }
}

/** True once when /start opened this site's editor for an order that already had a website. */
export function takeOpenedExisting(slug: string, storage: SessionStore | null = session()): boolean {
  try {
    if (storage?.getItem(OPENED_EXISTING_KEY) !== slug) return false;
    storage?.removeItem(OPENED_EXISTING_KEY);
    return true;
  } catch {
    return false;
  }
}
