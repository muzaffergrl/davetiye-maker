// /api/admin/connections — email sending and the Etsy shop connection (G147): status (GET) and actions (POST {action}).
// Signed-in shop only, same-origin writes only. Contract: lib/admin/connections.ts.
import { connectionsAction, connectionsStatus } from '../../../../lib/admin/connections.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return connectionsStatus(req);
}

export async function POST(req: Request): Promise<Response> {
  return connectionsAction(req);
}
