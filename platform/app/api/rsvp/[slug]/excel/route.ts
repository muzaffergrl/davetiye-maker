// /api/rsvp/<slug>/excel — couple side (G128): Excel (.xlsx) download of all replies — "Replies" + "Summary" sheets, the
// same columns as the Google Sheet (lib/rsvp/table.ts). Edit key: "Authorization: Bearer <key>" or ?k=<key> (a plain
// download link can only use ?k=), like the CSV (../export).
import { getDataAdapter } from '../../../../../lib/data/index.ts';
import { authorizeEditor } from '../../../../../lib/rsvp/couple.ts';
import { errorResult } from '../../../../../lib/rsvp/guest.ts';
import { editKeyFrom, jsonResponse, unauthorized } from '../../../../../lib/rsvp/http.ts';
import { rsvpXlsxForSite } from '../../../../../lib/rsvp/xlsx.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }): Promise<Response> {
  const { slug } = await ctx.params;
  try {
    const adapter = getDataAdapter();
    const site = await authorizeEditor(adapter, slug, editKeyFrom(req));
    if (!site) return unauthorized();
    const { bytes, filename } = await rsvpXlsxForSite(adapter, site);
    return new Response(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': XLSX_TYPE,
        'Content-Disposition': `attachment; filename="${filename.replace(/[^A-Za-z0-9._-]/g, '_')}"`,
        'Cache-Control': 'private, no-store',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    console.error(`[rsvp] excel ${slug}:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}
