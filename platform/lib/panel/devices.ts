// Panel API of "Use on another device" (G146, Share): which devices are signed in with the order number, and "Sign out
// other devices". Server only. Device keys themselves: lib/device-keys.ts.
//
//   GET  /api/edit/<slug>/devices                          {access, devices: [{id, label, createdAt, via, current}]}
//   POST /api/edit/<slug>/devices {action: "sign-out-others"} removes every device key but the one in use (the private
//                                                          edit link is never changed by it) -> {removed, access, devices}
//
// Edit key as "Authorization: Bearer <key>" only. The shop's own link (G145) can see the list but not sign anyone out.

import { getDataAdapter } from '../data/index.ts';
import { listDevices, signOutOtherDevices } from '../device-keys.ts';
import { msg } from '../i18n/translate.ts';
import { editorAccess } from '../rsvp/couple.ts';
import type { EditAccess } from '../sites.ts';
import type { SiteRecord } from '../data/types.ts';
import { BodyTooLargeError, bearerKey, fail, json, mediaType, readLimitedBytes, unauthorized } from './http.ts';

export interface DeviceView {
  id: string;
  label: string;
  createdAt: string;
  via: 'continue' | 'start' | 'email';
  /** The device this request came from. */
  current: boolean;
}

async function devicesBody(site: SiteRecord, access: EditAccess): Promise<{ access: EditAccess['kind']; devices: DeviceView[] }> {
  const current = access.kind === 'device' ? access.deviceId : null;
  const devices = (await listDevices(getDataAdapter(), site)).map((d) => ({ ...d, current: d.id === current }));
  return { access: access.kind, devices };
}

function serverError(where: string, e: unknown): Response {
  // Never the key or the request: only the error's name.
  console.error(`[devices] ${where}: ${e instanceof Error ? e.name : 'error'}`);
  return fail(500, 'server', 'Something went wrong. Please try again.');
}

export async function getDevices(req: Request, slug: string): Promise<Response> {
  try {
    const opened = await editorAccess(getDataAdapter(), slug, bearerKey(req));
    if (!opened) return unauthorized();
    return json(200, { ok: true, ...(await devicesBody(opened.site, opened.access)) });
  } catch (e) {
    return serverError('list', e);
  }
}

export async function deviceAction(req: Request, slug: string): Promise<Response> {
  try {
    const opened = await editorAccess(getDataAdapter(), slug, bearerKey(req));
    if (!opened) return unauthorized();
    if (mediaType(req) !== 'application/json') return fail(415, 'unsupported_media_type', 'Send the changes as JSON.');
    let action: unknown;
    try {
      action = (JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readLimitedBytes(req, 512))) as { action?: unknown })?.action;
    } catch (e) {
      if (e instanceof BodyTooLargeError) return fail(413, 'too_large', 'This request is too large.');
      return fail(400, 'bad_json', 'This request could not be read. Please reload the page.');
    }
    if (action !== 'sign-out-others') return fail(400, 'invalid', 'Unknown action.');
    if (opened.access.kind === 'shop') return fail(403, 'shop_session', msg("The shop's edit link cannot sign out the couple's devices."));
    const removed = await signOutOtherDevices(getDataAdapter(), opened.site, opened.access.kind === 'device' ? opened.access.deviceId : null);
    return json(200, { ok: true, removed, ...(await devicesBody(opened.site, opened.access)) });
  } catch (e) {
    return serverError('sign out', e);
  }
}
