// /api/rsvp/<slug>/responses — couple side.
//   GET   replies (newest first, held ones flagged), counts, form window.
//         Edit key: "Authorization: Bearer <key>" or ?k=<key>. Wrong key and unknown site both -> 401.
//   POST  {action: "remove" | "keep", ids: [...]} -> remove replies for good / keep held ones; answers
//         with the updated summary. Bearer only (a link or another site's form cannot act).
//         G069: {action: "add", reply: {name, email, attending, guests, message, answers, party}} -> a reply the couple
//         got another way ("Added by you"); {action: "update", id, reply: {...}} -> the couple's correction of a reply.
//         Same fields and messages as the guest form: 400 {code: "invalid", message, fields} · 404 not_found (reply
//         gone). Answers with {ok, reply, …summary}. An archived site: 403 like every other change.
import { getDataAdapter } from '../../../../../lib/data/index.ts';
import { addCoupleReply, authorizeEditor, manageRsvps, MAX_RSVP_ACTION_IDS, rsvpSummary, updateCoupleReply } from '../../../../../lib/rsvp/couple.ts';
import { errorResult } from '../../../../../lib/rsvp/guest.ts';
import { BodyTooLargeError, editKeyFrom, isJsonRequest, jsonResponse, readLimitedText, unauthorized } from '../../../../../lib/rsvp/http.ts';
import { bearerKey } from '../../../../../lib/panel/http.ts';
import { ARCHIVED_MESSAGE, isArchived } from '../../../../../lib/panel/rights.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, editKeyFrom(req));
    if (!site) return unauthorized();
    return jsonResponse({ status: 200, body: { ok: true, ...(await rsvpSummary(adapter, site)) } });
  } catch (e) {
    console.error(`[rsvp] responses ${slug}:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}

const bad = (message: string) => jsonResponse({ status: 400, body: { ok: false, code: 'invalid', message } });

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, bearerKey(req));
    if (!site) return unauthorized();
    // An archived site (G060) keeps its replies readable (list, CSV) but no longer changes them.
    if (isArchived(site)) return jsonResponse({ status: 403, body: { ok: false, code: 'archived', message: ARCHIVED_MESSAGE } });
    if (!isJsonRequest(req)) return jsonResponse(errorResult(415, 'unsupported'));
    let body: { action?: unknown; ids?: unknown; id?: unknown; reply?: unknown };
    try {
      body = JSON.parse(await readLimitedText(req, 64 * 1024)) as typeof body;
    } catch (e) {
      if (e instanceof BodyTooLargeError) return jsonResponse(errorResult(413, 'too_large'));
      return bad('This request could not be read.');
    }
    const action = body?.action;
    if (action === 'add' || action === 'update') {
      const result = action === 'add' ? await addCoupleReply(adapter, site, body.reply) : await updateCoupleReply(adapter, site, body.id, body.reply);
      if (!result.ok) {
        const code = result.status === 404 ? 'not_found' : 'invalid';
        return jsonResponse({ status: result.status, body: { ok: false, code, message: result.message, ...(result.fields ? { fields: result.fields } : {}) } });
      }
      return jsonResponse({ status: 200, body: { ok: true, reply: result.reply, ...(await rsvpSummary(adapter, site)) } });
    }
    const ids = body?.ids;
    if (action !== 'remove' && action !== 'keep') return bad('Unknown action.');
    if (!Array.isArray(ids) || !ids.length || ids.length > MAX_RSVP_ACTION_IDS || !ids.every((id) => typeof id === 'string')) {
      return bad('Choose the replies first.');
    }
    const changed = await manageRsvps(adapter, site, action, ids as string[]);
    return jsonResponse({ status: 200, body: { ok: true, changed, ...(await rsvpSummary(adapter, site)) } });
  } catch (e) {
    console.error(`[rsvp] responses ${slug} POST:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}
