// POST /api/my/continue — open your editor on any device with the Etsy order number + email (G146, lib/claim/continue.ts).
import { handleContinue } from '../../../../lib/claim/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return handleContinue(req);
}
