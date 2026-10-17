// POST /api/my/signin-link — "Email me a sign-in link" on /my (G146): only while an email provider is set up.
import { handleSignInLink } from '../../../../lib/claim/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return handleSignInLink(req);
}
