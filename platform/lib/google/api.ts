// HTTP side of the Google Sheets connection (G128).
//
//   GET  /api/edit/<slug>/google                 status {available, connected, url, lastSyncAt, error, errorAt, reconnect}
//   POST /api/edit/<slug>/google {action}        "connect"    -> {url}: Google's consent page (the panel goes there);
//                                                               sets the state cookie (HttpOnly, SameSite=Lax, 10 min)
//                                                "sync"       -> writes the sheet now, answers the new status
//                                                "disconnect" -> forgets the connection (the sheet stays in Drive)
//        Edit key as "Authorization: Bearer <key>" only (a link or another site's form cannot act). 503 when the shop
//        has not set Google up (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_TOKEN_KEY).
//   GET  /api/google/callback?code&state         Google's redirect: checks state (cookie = parameter, stored hash, 10 min),
//                                                stores the encrypted refresh token, writes the sheet, then a small page
//                                                sends the couple back to their panel (/rsvp/google-return.js).
// CSRF: the POSTs need the Bearer header (no cookie auth); the callback's state ties Google's answer to the browser that
// started it (cookie) AND to the site whose editor started it (hash stored with the site), and is used once.

import { getDataAdapter } from '../data/index.ts';
import { bearerKey, requestOrigin } from '../panel/http.ts';
import { ARCHIVED_MESSAGE, isArchived } from '../panel/rights.ts';
import { authorizeEditor } from '../rsvp/couple.ts';
import { googleConfig } from './config.ts';
import { disconnect, finishConnect, sheetsStatus, startConnect, STATE_COOKIE, STATE_TTL_MS, syncSheet, type CallbackResult } from './sync.ts';

const NO_STORE = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...NO_STORE, ...headers } });
}

const unauthorized = () => json(401, { ok: false, code: 'unauthorized', message: 'This edit link is not valid.' });
const notSetUp = () => json(503, { ok: false, code: 'not_configured', message: 'Google Sheets is coming soon.' });

const secureCookie = (origin: string) => origin.startsWith('https://');

export async function googleStatus(req: Request, slug: string): Promise<Response> {
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, bearerKey(req));
    if (!site) return unauthorized();
    return json(200, { ok: true, status: await sheetsStatus(adapter, site) });
  } catch (e) {
    console.error(`[google] status ${slug}:`, e instanceof Error ? e.name : 'error');
    return json(500, { ok: false, code: 'server', message: 'Something went wrong. Please try again.' });
  }
}

export async function googleAction(req: Request, slug: string): Promise<Response> {
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, bearerKey(req));
    if (!site) return unauthorized();
    let action: unknown;
    try {
      action = ((await req.json()) as { action?: unknown })?.action;
    } catch {
      return json(400, { ok: false, code: 'invalid', message: 'This request could not be read.' });
    }
    if (action === 'disconnect') {
      await disconnect(adapter, site);
      return json(200, { ok: true, status: await sheetsStatus(adapter, site) });
    }
    if (!googleConfig()) return notSetUp();
    if (action === 'connect') {
      if (isArchived(site)) return json(403, { ok: false, code: 'archived', message: ARCHIVED_MESSAGE });
      const origin = requestOrigin(req);
      const { url, state } = await startConnect(adapter, site, origin);
      const cookie = [
        `${STATE_COOKIE}=${state}`,
        'Path=/api/google',
        `Max-Age=${Math.floor(STATE_TTL_MS / 1000)}`,
        'HttpOnly',
        'SameSite=Lax',
        ...(secureCookie(origin) ? ['Secure'] : []),
      ].join('; ');
      return json(200, { ok: true, url }, { 'Set-Cookie': cookie });
    }
    if (action === 'sync') {
      await syncSheet(adapter, site.id);
      return json(200, { ok: true, status: await sheetsStatus(adapter, site) });
    }
    return json(400, { ok: false, code: 'invalid', message: 'Unknown action.' });
  } catch (e) {
    console.error(`[google] ${slug}:`, e instanceof Error ? e.name : 'error');
    return json(500, { ok: false, code: 'server', message: 'Something went wrong. Please try again.' });
  }
}

function cookieValue(header: string | null, name: string): string | null {
  for (const part of (header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const RESULT_TEXT: Record<'ok' | Extract<CallbackResult, { ok: false }>['reason'], { title: string; body: string }> = {
  ok: { title: 'Google Sheets is connected', body: 'Your replies are in a new spreadsheet in your Google Drive, and every new reply is added on its own.' },
  denied: { title: 'Google Sheets was not connected', body: 'Google did not give access, so nothing changed. You can try again from your editing page.' },
  state: { title: 'This link has expired', body: 'Please go back to your editing page and tap “Connect Google Sheets” again.' },
  google: { title: 'Google Sheets could not be connected', body: 'Google did not finish the connection. Please try again from your editing page in a few minutes.' },
  not_configured: { title: 'Google Sheets is coming soon', body: 'This is not switched on yet. Your replies are safe in your editing page.' },
};

/** The page after Google: one sentence and the way back (the panel's own path, kept in this tab's sessionStorage). */
function callbackPage(result: CallbackResult): string {
  const t = RESULT_TEXT[result.ok ? 'ok' : result.reason];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(t.title)}</title>
<style>body{margin:0;font:18px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;background:#EDE5D7;color:#2B1526}
main{max-width:30rem;margin:12vh auto;padding:0 20px}h1{font-size:1.5rem;line-height:1.25;margin:0 0 .5em}
a{display:inline-block;margin-top:1.25rem;padding:14px 22px;border-radius:999px;background:#2B1526;color:#FBF8F2;text-decoration:none;font-weight:600}
.small{font-size:.95rem;opacity:.8}</style></head>
<body><main data-google-result="${result.ok ? 'connected' : esc(result.reason)}">
<h1>${esc(t.title)}</h1><p>${esc(t.body)}</p>
<a href="#" data-google-back hidden>Back to your editing page</a>
<p class="small" data-google-manual>You can close this tab and open your editing link again.</p>
</main><script src="/rsvp/google-return.js" defer></script></body></html>`;
}

export async function googleCallback(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let result: CallbackResult;
  try {
    result = await finishConnect(
      getDataAdapter(),
      {
        state: url.searchParams.get('state'),
        code: url.searchParams.get('code'),
        error: url.searchParams.get('error'),
        cookieState: cookieValue(req.headers.get('cookie'), STATE_COOKIE),
      },
      requestOrigin(req),
    );
  } catch (e) {
    console.error('[google] callback:', e instanceof Error ? e.name : 'error');
    result = { ok: false, slug: null, reason: 'google' };
  }
  return new Response(callbackPage(result), {
    status: result.ok ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...NO_STORE,
      'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      'X-Frame-Options': 'DENY',
      // The state cookie is used once.
      'Set-Cookie': `${STATE_COOKIE}=; Path=/api/google; Max-Age=0; HttpOnly; SameSite=Lax`,
    },
  });
}
