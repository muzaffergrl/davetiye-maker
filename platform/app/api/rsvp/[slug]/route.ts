// /api/rsvp/<slug> — guest side (public).
//   GET   form status {open, reason, message, closesAt, deadline, maxGuests, preview}; ?preview=<key> reads the draft
//   POST  one reply, JSON body {name, email, attending, guests, message, answers?{<question id>: value} (G051), website(honeypot)}
// Used by /rsvp/form.js (the theme form contract, README "RSVP").
import { getDataAdapter } from '../../../../lib/data/index.ts';
import { BODY_MAX_BYTES } from '../../../../lib/rsvp/config.ts';
import { errorResult, getRsvpStatus, submitRsvp } from '../../../../lib/rsvp/guest.ts';
import { BodyTooLargeError, clientIp, isJsonRequest, jsonResponse, readLimitedText } from '../../../../lib/rsvp/http.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  try {
    const preview = new URL(req.url).searchParams.get('preview');
    return jsonResponse(await getRsvpStatus({ adapter: getDataAdapter() }, slug, preview));
  } catch (e) {
    console.error(`[rsvp] status ${slug}:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const { slug } = await ctx.params;
  if (!isJsonRequest(req)) return jsonResponse(errorResult(415, 'unsupported'));
  let body: unknown;
  try {
    const text = await readLimitedText(req, BODY_MAX_BYTES);
    body = JSON.parse(text);
  } catch (e) {
    if (e instanceof BodyTooLargeError) return jsonResponse(errorResult(413, 'too_large'));
    return jsonResponse(errorResult(400, 'unsupported'));
  }
  try {
    return jsonResponse(await submitRsvp({ adapter: getDataAdapter(), ip: clientIp(req) }, slug, body));
  } catch (e) {
    console.error(`[rsvp] submit ${slug}:`, e);
    return jsonResponse(errorResult(500, 'server'));
  }
}
