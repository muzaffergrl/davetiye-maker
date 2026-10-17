// /api/etsy/callback — Etsy's OAuth redirect (G147). Listed as a callback URL of the shop's Etsy app:
// https://<public host>/api/etsy/callback (docs/10 §3). Contract: lib/admin/connections.ts.
import { etsyCallback } from '../../../../lib/admin/connections.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return etsyCallback(req);
}
