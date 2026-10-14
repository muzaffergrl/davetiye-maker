// Browser side of the panel API (lib/panel/api.ts). The edit key travels only in the
// Authorization header (never in a URL the panel builds, except the CSV download link).

import type { ContentRecord } from '../../lib/content/types.ts';
import type { Identity } from '../../lib/panel/rights.ts';

export interface ApiResult<T = Record<string, unknown>> {
  ok: boolean;
  /** HTTP status; 0 = network error. */
  status: number;
  body: T & { ok?: boolean; code?: string; message?: string };
}

export type PanelApi = ReturnType<typeof panelApi>;

export function panelApi(slug: string, editKey: string) {
  const base = `/api/edit/${encodeURIComponent(slug)}`;
  const auth = { Authorization: `Bearer ${editKey}` };

  async function call<T>(url: string, init: RequestInit): Promise<ApiResult<T>> {
    try {
      const res = await fetch(url, { cache: 'no-store', credentials: 'same-origin', ...init });
      let body: ApiResult<T>['body'];
      try {
        body = (await res.json()) as ApiResult<T>['body'];
      } catch {
        body = { message: 'Unexpected answer from the server.' } as ApiResult<T>['body'];
      }
      return { ok: res.ok && body.ok !== false, status: res.status, body };
    } catch {
      return { ok: false, status: 0, body: { message: 'No connection. Your changes will be saved when you are back online.' } as ApiResult<T>['body'] };
    }
  }

  const jsonInit = (method: string, data: unknown, extra: RequestInit = {}): RequestInit => ({
    method,
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    ...extra,
  });

  return {
    /** The stored panel state (GET /api/edit/<slug>): {state: {content, updatedAt, …}}. */
    state: () => call<Record<string, unknown>>(base, { headers: auth }),
    saveDraft: (content: ContentRecord, baseUpdatedAt: string) => call<Record<string, unknown>>(base, jsonInit('PUT', { content, baseUpdatedAt })),
    /** Fire-and-forget save while the page is closing (keepalive survives the unload). */
    saveOnUnload(content: ContentRecord, baseUpdatedAt: string): void {
      try {
        void fetch(base, { ...jsonInit('PUT', { content, baseUpdatedAt }), keepalive: true });
      } catch {
        /* nothing more can be done while unloading */
      }
    },
    uploadPhoto: (slot: string, blob: Blob) =>
      call<{ url: string; width: number | null; height: number | null }>(`${base}/photo?slot=${encodeURIComponent(slot)}`, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': blob.type || 'application/octet-stream' },
        body: blob,
      }),
    publish: (baseUpdatedAt: string) => call<Record<string, unknown>>(`${base}/publish`, jsonInit('POST', { baseUpdatedAt })),
    /** Names / date after the first publish (G060): intent "change" confirms using one change. */
    identity: (identity: Identity, intent: 'fix' | 'change', baseUpdatedAt: string) =>
      call<Record<string, unknown>>(`${base}/identity`, jsonInit('POST', { identity, intent, baseUpdatedAt })),
    unpublish: () => call<Record<string, unknown>>(`${base}/unpublish`, { method: 'POST', headers: auth }),
    replies: () => call<Record<string, unknown>>(`/api/rsvp/${encodeURIComponent(slug)}/responses`, { headers: auth }),
    /** "remove" deletes replies for good; "keep" releases replies held for review. Answers with the new summary. */
    manageReplies: (action: 'remove' | 'keep', ids: string[]) =>
      call<Record<string, unknown>>(`/api/rsvp/${encodeURIComponent(slug)}/responses`, jsonInit('POST', { action, ids })),
    /** A reply the couple got another way (G069, "Added by you"); `id` given: their correction of that reply. */
    saveReply: (reply: Record<string, unknown>, id?: string) =>
      call<Record<string, unknown>>(
        `/api/rsvp/${encodeURIComponent(slug)}/responses`,
        jsonInit('POST', id ? { action: 'update', id, reply } : { action: 'add', reply }),
      ),
    /** CSV download (a plain link cannot send a header, so this one carries the key; same origin, no-referrer). */
    repliesCsvUrl: () => `/api/rsvp/${encodeURIComponent(slug)}/export?k=${encodeURIComponent(editKey)}`,
  };
}
