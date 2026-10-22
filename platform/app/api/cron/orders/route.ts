// GET /api/cron/orders — hourly Vercel Cron (vercel.json): trust mode's "verify later" run over provisional orders.
// Authorised by CRON_SECRET (Vercel sends it as a Bearer token). Contract: lib/claim/trust.ts.
import { cronOrdersRoute } from '../../../../lib/claim/trust.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return cronOrdersRoute(req);
}
