// Shop admin: email sending and the Etsy shop connection (G147). Route contract:
//
//   GET  /api/admin/connections                 {ok, mail: MailStatus, etsy: EtsyStatus}
//   POST /api/admin/connections {action}        "mail-test"     -> sends the test email to the shop's own address
//                                               "etsy-connect"  -> {url}: Etsy's consent page (the admin goes there);
//                                                                  sets the state cookie (HttpOnly, SameSite=Lax, 10 min, Path=/api/etsy)
//                                               "etsy-disconnect" -> forgets the shop's tokens
//                                               "etsy-recheck"  -> re-checks every pending order with Etsy (RecheckSummary)
//                                                                  and runs trust mode's check of provisional orders
//                                                                  (lib/claim/trust.ts; `trust`: TrustSweepSummary)
//        Signed-in shop only; writes same-origin only (lib/admin/api.ts adminGuard).
//   GET  /api/etsy/callback?code&state          Etsy's redirect (registered as the app's callback URL): checks the state
//                                               (cookie = parameter = stored hash, 10 min, used once), stores the sealed
//                                               tokens, answers a small Turkish page with a link back to /admin. The admin
//                                               session cookie is SameSite=Strict, so it is NOT sent on Etsy's redirect:
//                                               the callback is authorised by the state alone, and the way back is a link
//                                               the owner taps (a same-site navigation, so the session is there again).

import { getDataAdapter } from '../data/index.ts';
import { sweepProvisionalOrders } from '../claim/trust.ts';
import { recheckPendingOrders } from '../etsy/recheck.ts';
import { disconnectEtsy, ETSY_STATE_COOKIE, ETSY_STATE_TTL_MS, etsyStatus, finishEtsyConnect, startEtsyConnect, type EtsyCallbackResult } from '../etsy/shop.ts';
import { EtsyError } from '../etsy/client.ts';
import { MailSendError, mailStatus, sendTestEmail } from '../mail/index.ts';
import { fail, json, readLimitedBytes, requestOrigin } from '../panel/http.ts';
import { adminGuard } from './api.ts';

const secureCookie = (origin: string) => origin.startsWith('https://');

async function readAction(req: Request): Promise<string | null> {
  try {
    const bytes = await readLimitedBytes(req, 2048);
    const body = bytes.length ? (JSON.parse(Buffer.from(bytes).toString('utf8')) as { action?: unknown }) : {};
    return typeof body?.action === 'string' ? body.action : null;
  } catch {
    return null;
  }
}

/** Turkish words for a failed test email (codes from nodemailer; never the server's text). */
export function mailErrorText(e: unknown): string {
  const code = e instanceof MailSendError ? e.code : 'ESEND';
  if (code === 'NOT_CONFIGURED') return 'E-posta gönderimi ayarlı değil (SMTP_HOST, SMTP_USER, SMTP_PASS).';
  if (code === 'EAUTH') return 'Giriş reddedildi (EAUTH): SMTP_USER / SMTP_PASS yanlış. Gmail için hesap şifresi değil, 16 harfli uygulama şifresi gerekir.';
  if (code === 'ETIMEDOUT' || code === 'ECONNECTION' || code === 'ESOCKET' || code === 'EDNS') {
    return `Sunucuya bağlanılamadı (${code}): SMTP_HOST ve SMTP_PORT'u kontrol edin (Gmail: smtp.gmail.com, 465).`;
  }
  if (code === 'ETLS') return 'TLS kurulamadı (ETLS): 465 için güvenli bağlantı, 587 için STARTTLS kullanılır; SMTP_PORT doğru mu?';
  if (code === 'EENVELOPE') return 'Alıcı ya da gönderici adresi kabul edilmedi (EENVELOPE): ADMIN_NOTIFY_EMAIL / MAIL_FROM kontrol edin.';
  return `Gönderilemedi (${code}). Ayarları kontrol edip tekrar deneyin.`;
}

export async function connectionsStatus(req: Request): Promise<Response> {
  const denied = adminGuard(req);
  if (denied) return denied;
  return json(200, { ok: true, mail: mailStatus(), etsy: await etsyStatus(getDataAdapter()) });
}

export async function connectionsAction(req: Request): Promise<Response> {
  const denied = adminGuard(req, { write: true });
  if (denied) return denied;
  const action = await readAction(req);
  const adapter = getDataAdapter();
  const origin = requestOrigin(req);
  try {
    if (action === 'mail-test') {
      try {
        await sendTestEmail(`${origin}/admin`);
      } catch (e) {
        return fail(502, 'mail_failed', mailErrorText(e));
      }
      return json(200, { ok: true, mail: mailStatus() });
    }
    if (action === 'etsy-connect') {
      let started: { url: string; state: string };
      try {
        started = await startEtsyConnect(adapter, origin);
      } catch (e) {
        if (e instanceof EtsyError && e.code === 'not_configured') return fail(503, 'not_configured', 'Etsy uygulama ayarları eksik (ETSY_API_KEY, ETSY_SHARED_SECRET, GOOGLE_TOKEN_KEY).');
        throw e;
      }
      const cookie = [
        `${ETSY_STATE_COOKIE}=${started.state}`,
        'Path=/api/etsy',
        `Max-Age=${Math.floor(ETSY_STATE_TTL_MS / 1000)}`,
        'HttpOnly',
        'SameSite=Lax',
        ...(secureCookie(origin) ? ['Secure'] : []),
      ].join('; ');
      return json(200, { ok: true, url: started.url }, { 'Set-Cookie': cookie });
    }
    if (action === 'etsy-disconnect') {
      await disconnectEtsy(adapter);
      return json(200, { ok: true, etsy: await etsyStatus(adapter) });
    }
    if (action === 'etsy-recheck') {
      const summary = await recheckPendingOrders(adapter);
      if (!summary.ok) {
        return fail(409, summary.problem ?? 'not_connected', summary.problem === 'not_configured' ? 'Etsy uygulama ayarları eksik.' : 'Etsy mağazası bağlı değil: önce "Etsy mağazasını bağla".');
      }
      const trust = await sweepProvisionalOrders(adapter, { origin });
      return json(200, { ok: true, summary, trust, etsy: await etsyStatus(adapter) });
    }
    return fail(400, 'unknown_action', 'Bilinmeyen işlem.');
  } catch (e) {
    console.error(`[admin] connections ${action ?? '?'}: ${e instanceof EtsyError ? e.code : e instanceof Error ? e.name : 'error'}`);
    return fail(500, 'server', 'Bir şeyler ters gitti. Tekrar deneyin.');
  }
}

// ---------------------------------------------------------------------------------------------
// Etsy's redirect

function cookieValue(header: string | null, name: string): string | null {
  for (const part of (header ?? '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const RESULT_TEXT: Record<'ok' | Extract<EtsyCallbackResult, { ok: false }>['reason'], { title: string; body: string }> = {
  ok: { title: 'Etsy mağazası bağlandı', body: 'Yeni siparişler artık Etsy\'den kendiliğinden kontrol edilebilir.' },
  denied: { title: 'Etsy bağlanmadı', body: 'Etsy izin vermedi; hiçbir şey değişmedi. Yönetimden yeniden deneyebilirsiniz.' },
  state: { title: 'Bu bağlantının süresi doldu', body: 'Yönetime dönüp "Etsy mağazasını bağla"ya yeniden basın (10 dakika içinde tamamlanmalı, aynı tarayıcıda).' },
  etsy: { title: 'Etsy bağlantısı tamamlanamadı', body: 'Etsy isteği kabul etmedi (uygulama henüz onaylanmamış olabilir ya da callback adresi uygulamada kayıtlı değil). Birkaç dakika sonra yeniden deneyin.' },
  no_shop: { title: 'Bu Etsy hesabında mağaza yok', body: 'Mağazanın sahibi olan Etsy hesabıyla giriş yapıp yeniden bağlayın.' },
  not_configured: { title: 'Etsy ayarlı değil', body: 'ETSY_API_KEY, ETSY_SHARED_SECRET ve GOOGLE_TOKEN_KEY ortam değişkenleri eksik.' },
};

function callbackPage(result: EtsyCallbackResult): string {
  const key = result.ok ? 'ok' : result.reason;
  const t = RESULT_TEXT[key];
  const shop = result.ok && result.shopName ? ` (${esc(result.shopName)})` : '';
  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(t.title)}</title>
<style>body{margin:0;font:18px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;background:#EDE5D7;color:#2B1526}
main{max-width:30rem;margin:12vh auto;padding:0 20px}h1{font-size:1.5rem;line-height:1.25;margin:0 0 .5em}
a{display:inline-block;margin-top:1.25rem;padding:14px 22px;border-radius:999px;background:#2B1526;color:#FBF8F2;text-decoration:none;font-weight:600}</style></head>
<body><main data-etsy-result="${esc(key)}"><h1>${esc(t.title)}${shop}</h1><p>${esc(t.body)}</p>
<a href="/admin#connections">Yönetime dön</a></main></body></html>`;
}

export async function etsyCallback(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let result: EtsyCallbackResult;
  try {
    result = await finishEtsyConnect(
      getDataAdapter(),
      {
        state: url.searchParams.get('state'),
        code: url.searchParams.get('code'),
        error: url.searchParams.get('error'),
        cookieState: cookieValue(req.headers.get('cookie'), ETSY_STATE_COOKIE),
      },
      requestOrigin(req),
    );
  } catch (e) {
    console.error(`[etsy] callback: ${e instanceof Error ? e.name : 'error'}`);
    result = { ok: false, reason: 'etsy' };
  }
  return new Response(callbackPage(result), {
    status: result.ok ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
      'X-Frame-Options': 'DENY',
      // The state cookie is used once.
      'Set-Cookie': `${ETSY_STATE_COOKIE}=; Path=/api/etsy; Max-Age=0; HttpOnly; SameSite=Lax`,
    },
  });
}

/** For the admin page (server side). */
export async function connectionsView(): Promise<{ mail: ReturnType<typeof mailStatus>; etsy: Awaited<ReturnType<typeof etsyStatus>> }> {
  return { mail: mailStatus(), etsy: await etsyStatus(getDataAdapter()) };
}
