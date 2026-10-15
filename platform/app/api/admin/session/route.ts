// /api/admin/session — shop admin sign in (POST {password}) and sign out (DELETE). G087.
import { signIn, signOut } from '../../../../lib/admin/api.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request): Promise<Response> {
  return signIn(req);
}

export async function DELETE(req: Request): Promise<Response> {
  return signOut(req);
}
