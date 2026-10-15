// /api/admin/export — every order as a CSV file (shop admin). Signed-in shop only.
import { exportRoute } from '../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return exportRoute(req);
}
