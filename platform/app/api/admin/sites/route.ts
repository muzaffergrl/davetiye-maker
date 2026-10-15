// /api/admin/sites — GET: every website with its admin summary and the counts (G087). POST: the shop starts a website
// for a buyer ("Yeni sipariş", lib/admin/create.ts). Signed-in shop only; writes same-origin only.
import { createRoute, listRoute } from '../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return listRoute(req);
}

export async function POST(req: Request): Promise<Response> {
  return createRoute(req);
}
