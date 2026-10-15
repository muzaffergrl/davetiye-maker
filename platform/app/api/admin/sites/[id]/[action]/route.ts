// /api/admin/sites/<id>/<action> — support actions of the shop admin (G087): confirm, reissue, grant, archive,
// unpublish, delete. Signed-in shop only, same-origin writes only (lib/admin/api.ts).
import { siteAction } from '../../../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, ctx: { params: Promise<{ id: string; action: string }> }): Promise<Response> {
  const { id, action } = await ctx.params;
  return siteAction(req, id, action);
}
