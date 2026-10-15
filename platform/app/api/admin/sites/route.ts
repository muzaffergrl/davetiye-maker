// /api/admin/sites — every website with its admin summary and the counts (G087). Signed-in shop only.
import { listRoute } from '../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return listRoute(req);
}
