// POST /api/start — claim a website: Etsy order number + email + names -> draft site + edit link (G045).
import { handleClaim } from '../../../lib/claim/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return handleClaim(req);
}
