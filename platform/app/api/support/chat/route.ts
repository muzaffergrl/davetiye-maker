// /api/support/chat — the AI support assistant (sales site and panel). Handlers: lib/support/chat.ts.
import { supportChat, supportStatus } from '../../../../lib/support/chat.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  return supportStatus();
}

export async function POST(req: Request): Promise<Response> {
  return supportChat(req);
}
