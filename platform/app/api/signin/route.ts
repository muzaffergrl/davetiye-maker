// /api/signin — e-mail sign-in (G060, docs/16 §12). There is no e-mail provider yet: the endpoint answers
// 503 "unavailable" and sends nothing (lib/panel/signin.ts). The edit link is the way into the editor.
import { getSignInMailer, SIGN_IN_UNAVAILABLE } from '../../../lib/panel/signin.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
};

export async function POST(): Promise<Response> {
  if (!getSignInMailer().enabled) {
    return new Response(JSON.stringify({ ok: false, code: 'unavailable', message: SIGN_IN_UNAVAILABLE }), { status: 503, headers: HEADERS });
  }
  // An enabled mailer needs the token / session flow of docs/16 §12.2, which is not built yet.
  return new Response(JSON.stringify({ ok: false, code: 'unavailable', message: SIGN_IN_UNAVAILABLE }), { status: 503, headers: HEADERS });
}
