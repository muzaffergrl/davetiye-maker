// /api/rsvp/<slug>/export — couple side: CSV download of all replies (oldest first, formula-safe cells).
// Edit key: "Authorization: Bearer <key>" or ?k=<key> (a plain download link can only use ?k=).
import { getDataAdapter } from '../../../../../lib/data/index.ts';
import { authorizeEditor, rsvpCsvForSite } from '../../../../../lib/rsvp/couple.ts';
import { errorResult } from '../../../../../lib/rsvp/guest.ts';
import { csvResponse, editKeyFrom, jsonResponse, unauthorized } from '../../../../../lib/rsvp/http.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, editKeyFrom(req));
    if (!site) return unauthorized();
    const { csv, filename } = await rsvpCsvForSite(adapter, site);
    return csvResponse(csv, filename);
  } catch (e) {
    console.error(`[rsvp] export ${slug}:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}
