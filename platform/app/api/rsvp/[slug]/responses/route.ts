// /api/rsvp/<slug>/responses — couple side: replies (newest first), counts, form window.
// Edit key: "Authorization: Bearer <key>" or ?k=<key>. Wrong key and unknown site both -> 401.
import { getDataAdapter } from '../../../../../lib/data/index.ts';
import { authorizeEditor, rsvpSummary } from '../../../../../lib/rsvp/couple.ts';
import { errorResult } from '../../../../../lib/rsvp/guest.ts';
import { editKeyFrom, jsonResponse, unauthorized } from '../../../../../lib/rsvp/http.ts';

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
