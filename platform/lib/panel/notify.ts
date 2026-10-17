// Panel API of "Email me when a guest replies" (G152, Guests). Server only. The emails themselves: lib/rsvp/notify.ts.
//
//   GET  /api/edit/<slug>/notify                     {notify: {available, enabled, to}}
//   POST /api/edit/<slug>/notify {enabled: boolean}  -> {notify}
//
// Edit key as "Authorization: Bearer <key>" only (owner or a signed-in device). The shop's own link (G145) sees the
// setting but cannot change it: the emails go to the couple. While the platform cannot send email the switch cannot be
// turned on (503). Never logs the address.

import { getDataAdapter } from '../data/index.ts';
import { msg } from '../i18n/translate.ts';
import { editorAccess } from '../rsvp/couple.ts';
import { getRsvpNotifier } from '../mail/index.ts';
import { notifyView, setNotify } from '../rsvp/notify.ts';
import { BodyTooLargeError, bearerKey, fail, json, mediaType, readLimitedBytes, unauthorized } from './http.ts';

function serverError(where: string, e: unknown): Response {
  console.error(`[notify] ${where}: ${e instanceof Error ? e.name : 'error'}`);
  return fail(500, 'server', 'Something went wrong. Please try again.');
}

export async function getNotify(req: Request, slug: string): Promise<Response> {
  try {
    const adapter = getDataAdapter();
    const opened = await editorAccess(adapter, slug, bearerKey(req));
    if (!opened) return unauthorized();
    return json(200, { ok: true, notify: await notifyView(adapter, opened.site) });
  } catch (e) {
    return serverError('status', e);
  }
}

export async function notifyAction(req: Request, slug: string): Promise<Response> {
  try {
    const adapter = getDataAdapter();
    const opened = await editorAccess(adapter, slug, bearerKey(req));
    if (!opened) return unauthorized();
    if (mediaType(req) !== 'application/json') return fail(415, 'unsupported_media_type', 'Send the changes as JSON.');
    let enabled: unknown;
    try {
      enabled = (JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, 256))) as { enabled?: unknown })?.enabled;
    } catch (e) {
      if (e instanceof BodyTooLargeError) return fail(413, 'too_large', 'This request is too large.');
      return fail(400, 'bad_json', 'This request could not be read. Please reload the page.');
    }
    if (typeof enabled !== 'boolean') return fail(400, 'invalid', 'Unknown action.');
    if (opened.access.kind === 'shop') return fail(403, 'shop_session', msg("The shop's edit link cannot change the couple's reply emails."));
    if (enabled && !getRsvpNotifier().enabled) return fail(503, 'unavailable', msg('Reply emails are not available yet.'));
    if (enabled && !opened.site.ownerEmail) return fail(409, 'no_email', msg('This website has no email address to send to. Please message the shop.'));
    await setNotify(adapter, opened.site, enabled);
    return json(200, { ok: true, notify: await notifyView(adapter, opened.site) });
  } catch (e) {
    return serverError('change', e);
  }
}
