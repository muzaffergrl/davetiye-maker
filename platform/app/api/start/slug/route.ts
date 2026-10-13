// GET /api/start/slug?value=<address> — live availability hint for the /start form (G045).
import { handleSlugCheck } from '../../../../lib/claim/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return handleSlugCheck(req);
}
