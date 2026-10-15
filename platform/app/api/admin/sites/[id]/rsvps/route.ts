// /api/admin/sites/<id>/rsvps — a site's guest replies as CSV (shop admin). Signed-in shop only.
import { rsvpCsvRoute } from '../../../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await ctx.params;
  return rsvpCsvRoute(req, id);
}
