// /api/google/callback — Google's OAuth redirect (G128). Registered as an authorised redirect URI of the shop's OAuth
// client: https://<public host>/api/google/callback (docs/22_GOOGLE_SHEETS.md). Contract: lib/google/api.ts.
import { googleCallback } from '../../../../lib/google/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  return googleCallback(req);
}
