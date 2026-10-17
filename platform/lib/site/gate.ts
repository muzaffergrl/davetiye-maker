// The guest password page of a protected website (G076, K28) and its form handler. Server only.
//
// The page is the platform's, not a theme template: it links the theme's OWN stylesheets (its fonts, colour tokens and
// painted paper background, read from the theme's index.html <head>) and shows only the couple's names, "You're invited"
// and a password box — no date, venue, photos or new decoration (K21). Its meta tags carry the same: names +
// "You're invited" (a link preview of a protected site says nothing else). noindex, private, no-store.
//
// The form posts to the SAME address (so no "next" parameter exists that could redirect elsewhere): the page routes
// accept POST only with the hidden field `site_access`; any other POST stays 405 (the theme's RSVP form without
// JavaScript, README "RSVP"). Order of checks: lib/site/access.ts.

import { createHash } from 'node:crypto';
import * as cheerio from 'cheerio';
import { getDataAdapter } from '../data/index.ts';
import type { SiteRecord } from '../data/types.ts';
import { publicOrigin } from '../panel/http.ts';
import { isArchived } from '../panel/rights.ts';
import { readLimitedText, BodyTooLargeError, clientIp } from '../rsvp/http.ts';
import { ipBucket } from '../rsvp/rate-limit.ts';
import { previewAccess } from '../sites.ts';
import { isReservedSlug, isValidSlugFormat } from '../slug.ts';
import { OG_IMAGE_SIZE } from '../theme/share.ts';
import { loadTheme, readThemePage, SUB_PAGES, type LoadedTheme, type PageName } from '../theme/theme.ts';
import { themeAssetUrl } from '../theme/urls.ts';
import { siteLangs } from '../i18n/content.ts';
import { isLang } from '../i18n/langs.ts';
import { siteDict } from '../i18n/site.ts';
import { makeTranslator, msg } from '../i18n/translate.ts';
import { ACCESS_LIMITS, getAccessRateLimiter, guestMayEnter, guestPasswordMatches, guestSetCookie, isProtected } from './access.ts';

/** Hidden field that marks a POST to a page address as the password form. */
export const ACCESS_FIELD = 'site_access';
/** Meta tags (link previews); the page itself shows the typographic apostrophe. */
export const INVITED_TEXT = msg("You're invited");
const LEAD_TEXT = msg('This website is private. Please enter the password from your invitation.');
const WRONG_TEXT = msg('That password isn’t right. Please check your invitation and try again.');

/** Where the form was shown: a page of the site. (/<slug>/event.ics without the cookie sends the guest to /<slug>.) */
export type GateTarget = PageName;

function isGateTarget(value: string | null): value is GateTarget {
  return value === 'index' || (SUB_PAGES as readonly string[]).includes(value ?? '');
}

export function targetPath(slug: string, target: GateTarget): string {
  return target === 'index' ? `/${slug}` : `/${slug}/${target}`;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** The couple's names as the site shows them ("Clara & Julian"); the only personal text on the password page. */
export function coupleNames(content: unknown): string {
  const c = (content ?? {}) as { name_display?: unknown; partners?: Array<{ display_name?: unknown }> };
  const shown = typeof c.name_display === 'string' ? c.name_display.replace(/\s+/g, ' ').trim() : '';
  if (shown) return shown.slice(0, 120);
  const names = (Array.isArray(c.partners) ? c.partners : [])
    .map((p) => (typeof p?.display_name === 'string' ? p.display_name.trim() : ''))
    .filter(Boolean);
  return names.length ? names.join(' & ').slice(0, 120) : 'Our wedding';
}

interface ThemeHead {
  stylesheets: string[];
  themeColor: string | null;
  googleFonts: boolean;
}

const headCache = new Map<string, ThemeHead>();
const COLOR_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const GOOGLE_FONTS = 'https://fonts.googleapis.com/';

/** The theme's stylesheets and theme-color, from its index page <head> (the same files the envelope page loads). */
async function themeHead(theme: LoadedTheme | null): Promise<ThemeHead> {
  if (!theme) return { stylesheets: [], themeColor: null, googleFonts: false };
  const key = theme.dir;
  const hit = process.env.NODE_ENV === 'production' ? headCache.get(key) : undefined;
  if (hit) return hit;
  const html = (await readThemePage(theme, 'index').catch(() => null)) ?? '';
  const $ = cheerio.load(html);
  const stylesheets: string[] = [];
  $('head link[rel~="stylesheet"][href]').each((_, el) => {
    const href = ($(el).attr('href') ?? '').trim();
    if (href.startsWith(GOOGLE_FONTS)) stylesheets.push(href);
    else if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(href)) {
      const local = themeAssetUrl(theme.manifest.id, href);
      if (local && local.endsWith('.css')) stylesheets.push(local);
    }
  });
  const color = ($('head meta[name="theme-color"]').attr('content') ?? '').trim();
  const head = { stylesheets, themeColor: COLOR_RE.test(color) ? color : null, googleFonts: stylesheets.some((s) => s.startsWith(GOOGLE_FONTS)) };
  if (process.env.NODE_ENV === 'production') headCache.set(key, head);
  return head;
}

// Progressive "Show" button for the password box (the form works without it). Its hash is in the page CSP.
const SHOW_SCRIPT =
  "(function(){var i=document.getElementById('sg-password'),b=document.getElementById('sg-show');if(!i||!b)return;b.hidden=false;" +
  "b.addEventListener('click',function(){var s=i.type==='password';i.type=s?'text':'password';b.setAttribute('aria-pressed',String(s));b.textContent=s?b.getAttribute('data-hide'):b.getAttribute('data-show');i.focus();});})();";
const SHOW_SCRIPT_HASH = `'sha256-${createHash('sha256').update(SHOW_SCRIPT, 'utf8').digest('base64')}'`;

/** CSP of the password page: the theme's own CSS and fonts, one hashed script, the form posts to this origin only. */
export const GATE_CSP = [
  "default-src 'none'",
  `script-src ${SHOW_SCRIPT_HASH}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "base-uri 'none'",
  "object-src 'none'",
].join('; ');

// Theme tokens every design defines (docs/11): --page, --ink, --ink-soft, --ivory, --script; the body font comes from the
// theme's own `body` rule. Plain UI only: a paper-coloured panel for legibility, no drawn ornament (K21). The theme's
// cross-page transition (@view-transition) is switched off here: the error answer replaces the page at once.
const GATE_CSS = `
@view-transition{navigation:none}
.site-gate{margin:0;min-height:100vh;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:24px 16px calc(24px + env(safe-area-inset-bottom))}
.sg{position:relative;z-index:1;box-sizing:border-box;width:100%;max-width:420px;padding:32px 24px 28px;border-radius:16px;text-align:center;color:var(--ink,#2a2724);
background:color-mix(in srgb,var(--ivory,#fffdf8) 90%,transparent);box-shadow:0 1px 2px rgb(0 0 0/.06),0 12px 32px rgb(0 0 0/.08)}
.sg *{box-sizing:border-box}
.sg-kicker{margin:0;font-size:13px;line-height:1.6;letter-spacing:.24em;text-transform:uppercase;color:var(--ink-soft,var(--ink,#45403b))}
.sg-names{margin:6px 0 18px;font-family:var(--script,cursive);font-weight:400;font-size:clamp(36px,10.5vw,52px);line-height:1.3;color:var(--ink,#2a2724);overflow-wrap:anywhere}
.sg-lead{margin:0 0 22px;font-size:17px;line-height:1.5;color:var(--ink-soft,var(--ink,#45403b))}
.sg-form{display:grid;gap:10px;text-align:left}
.sg-label{font-size:15px;line-height:20px;font-weight:600;color:var(--ink,#2a2724)}
.sg-field{position:relative}
.sg-input{display:block;width:100%;min-height:52px;margin:0;padding:12px 76px 12px 14px;border:1px solid var(--ink-soft,#5c584f);border-radius:12px;background:#fff;color:var(--ink,#2a2724);font:inherit;font-size:18px;line-height:24px;letter-spacing:.02em}
.sg-input:focus{outline:2px solid var(--ink,#2a2724);outline-offset:2px}
.sg-input[aria-invalid=true]{border-width:2px}
.sg-show{position:absolute;top:4px;right:4px;min-width:64px;min-height:44px;padding:0 12px;border:0;border-radius:10px;background:transparent;color:var(--ink,#2a2724);font:inherit;font-size:15px;font-weight:600;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.sg-show:focus-visible,.sg-submit:focus-visible{outline:2px solid var(--ink,#2a2724);outline-offset:2px}
.sg-msg{margin:0;padding:10px 12px;border-left:3px solid currentColor;border-radius:0 8px 8px 0;background:rgb(255 255 255/.7);font-size:15px;line-height:1.45;font-weight:600;color:var(--ink,#2a2724)}
.sg-submit{min-height:52px;margin-top:6px;padding:12px 20px;border:0;border-radius:999px;background:var(--ink,#2a2724);color:var(--ivory,#fff);font:inherit;font-size:17px;font-weight:600;letter-spacing:.02em;cursor:pointer}
.sg-note{margin:18px 0 0;font-size:14px;line-height:1.5;color:var(--ink-soft,var(--ink,#45403b))}
@media (prefers-reduced-motion:reduce){.sg *{transition:none!important}}
`.replace(/\n/g, '');

export type GateState = 'ask' | 'wrong' | 'wait';

export interface GatePageInput {
  theme: LoadedTheme | null;
  /** The visible content (published, or the draft for a shared preview link): only the names are read. */
  content: unknown;
  /** Path + query the form posts to (the address the guest opened). */
  action: string;
  /** Public origin, for the absolute og:image of the theme's (name-free) share picture. */
  origin: string;
  state?: GateState;
  retryAfterMs?: number;
  status?: number;
}

function minutes(ms: number): number {
  return Math.max(1, Math.ceil(ms / 60_000));
}

/** The password page (HTML Response). */
export async function gatePage(input: GatePageInput): Promise<Response> {
  const state = input.state ?? 'ask';
  // G144: the language of the page the guest opened (?lang=, one of the site's), else the site's primary language
  const langs = siteLangs(input.content);
  const asked = new URL(input.action, 'http://gate.invalid').searchParams.get('lang');
  const lang = isLang(asked) && langs.all.includes(asked) ? asked : langs.primary;
  const { t, tn } = makeTranslator(lang, await siteDict(lang));
  const names = coupleNames(input.content) === 'Our wedding' ? t('Our wedding') : coupleNames(input.content);
  const invited = t(INVITED_TEXT);
  const head = await themeHead(input.theme);
  const tags: string[] = [];
  const meta = (attr: 'name' | 'property', key: string, value: string) => tags.push(`<meta ${attr}="${key}" content="${esc(value)}">`);
  meta('name', 'robots', 'noindex, nofollow');
  meta('name', 'description', invited);
  meta('property', 'og:type', 'website');
  meta('property', 'og:title', names);
  meta('property', 'og:description', invited);
  meta('name', 'twitter:title', names);
  meta('name', 'twitter:description', invited);
  const theme = input.theme;
  const og = theme?.share.ogImage ? themeAssetUrl(theme.manifest.id, theme.share.ogImage) : null;
  if (og) {
    // The theme's share picture carries no names or details (K24): the same one every site of the design uses.
    meta('property', 'og:image', `${input.origin}${og}`);
    meta('property', 'og:image:type', 'image/jpeg');
    meta('property', 'og:image:width', String(OG_IMAGE_SIZE.width));
    meta('property', 'og:image:height', String(OG_IMAGE_SIZE.height));
    meta('property', 'og:image:alt', t('{names} wedding invitation', { names }));
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:image:alt', t('{names} wedding invitation', { names }));
  }
  if (head.themeColor) meta('name', 'theme-color', head.themeColor);
  const icon = theme?.share.icon ? themeAssetUrl(theme.manifest.id, theme.share.icon) : null;
  if (icon) tags.push(`<link rel="icon" type="image/png" href="${esc(icon)}">`);
  if (head.googleFonts) tags.push('<link rel="preconnect" href="https://fonts.googleapis.com">', '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  for (const href of head.stylesheets) tags.push(`<link rel="stylesheet" href="${esc(href)}">`);

  const message =
    state === 'wrong'
      ? t(WRONG_TEXT)
      : state === 'wait'
        ? tn(minutes(input.retryAfterMs ?? ACCESS_LIMITS.wrongPerSiteIp.windowMs), 'Too many tries. Please wait 1 minute and try again.', 'Too many tries. Please wait {n} minutes and try again.')
        : null;
  const describedBy = message ? 'sg-lead sg-msg' : 'sg-lead';
  const html =
    '<!DOCTYPE html>' +
    `<html lang="${lang}" data-site-gate="${state}"${theme ? ` data-theme="${esc(theme.manifest.id)}"` : ''}>` +
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
    `<title>${esc(names)}</title>${tags.join('')}<style>${GATE_CSS}</style></head>` +
    '<body class="site-gate"><main class="sg" aria-labelledby="sg-names">' +
    `<p class="sg-kicker">${esc(t('You\u2019re invited'))}</p>` +
    `<h1 class="sg-names" id="sg-names">${esc(names)}</h1>` +
    `<p class="sg-lead" id="sg-lead">${esc(t(LEAD_TEXT))}</p>` +
    `<form class="sg-form" method="post" action="${esc(input.action)}">` +
    `<input type="hidden" name="${ACCESS_FIELD}" value="1">` +
    `<label class="sg-label" for="sg-password">${esc(t('Password'))}</label>` +
    '<div class="sg-field">' +
    `<input class="sg-input" id="sg-password" name="password" type="password" required maxlength="200" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" aria-describedby="${describedBy}"${state === 'wrong' ? ' aria-invalid="true" autofocus' : ''}>` +
    `<button class="sg-show" id="sg-show" type="button" aria-controls="sg-password" aria-pressed="false" data-show="${esc(t('Show'))}" data-hide="${esc(t('Hide'))}" hidden>${esc(t('Show'))}</button>` +
    '</div>' +
    (message ? `<p class="sg-msg" id="sg-msg" role="alert">${esc(message)}</p>` : '') +
    `<button class="sg-submit" type="submit">${esc(t('Open the invitation'))}</button>` +
    '</form>' +
    `<p class="sg-note">${esc(t('You only need to enter it once on this device.'))}</p>` +
    `</main><script>${SHOW_SCRIPT}</script></body></html>`;
  const headers = new Headers({
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Security-Policy': GATE_CSP,
    'X-Content-Type-Options': 'nosniff',
    // no Referer to Google Fonts (the address names the couple) and none from a ?preview= link
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'private, no-store',
    Vary: 'Cookie',
    'X-Robots-Tag': 'noindex, nofollow',
  });
  if (state === 'wait') headers.set('Retry-After', String(Math.max(1, Math.ceil((input.retryAfterMs ?? 60_000) / 1000))));
  return new Response(html, { status: input.status ?? 200, headers });
}

// ---------------------------------------------------------------------------------------------- form POST

function plain(status: number, text: string, extra: Record<string, string> = {}): Response {
  return new Response(text, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow', ...extra },
  });
}

/** 303 back to the address the guest opened (a relative path built from the checked slug: never another site). */
function seeOther(location: string, setCookie?: string): Response {
  const headers = new Headers({ Location: location, 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' });
  if (setCookie) headers.append('Set-Cookie', setCookie);
  return new Response(null, { status: 303, headers });
}

const FORM_MAX_BYTES = 4096;

/**
 * POST /<slug>[/<page>] with `site_access=1&password=…` (the password page's form). Right password: the
 * site's cookie + 303 to the same address. Wrong: the page again with an error (401). Too many wrong tries from this
 * address (ACCESS_LIMITS, shared counter on blob): 429 — the right password is refused too until the window ends.
 * Not a password form (no `site_access`): 405 like before G076. Cross-site posts: 403.
 */
export async function handleSiteUnlock(req: Request, slug: string, target: string | null): Promise<Response> {
  const notAllowed = () => plain(405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/x-www-form-urlencoded') return notAllowed();
  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await readLimitedText(req, FORM_MAX_BYTES));
  } catch (e) {
    if (e instanceof BodyTooLargeError) return plain(413, 'Too large');
    return notAllowed();
  }
  if (form.get(ACCESS_FIELD) !== '1') return notAllowed();
  // Another website cannot make a guest's browser try passwords (and use up their tries).
  if ((req.headers.get('sec-fetch-site') ?? '').toLowerCase() === 'cross-site') return plain(403, 'Please open the website and enter the password there.');
  if (!isValidSlugFormat(slug) || isReservedSlug(slug) || !isGateTarget(target)) return plain(404, 'Not found');
  const url = new URL(req.url);
  const back = `${targetPath(slug, target)}${url.search}`;
  const site = await getDataAdapter().getSiteBySlug(slug);
  if (!site) return plain(404, 'Not found');
  const access = previewAccess(site, url.searchParams.get('preview'));
  const visible = access === 'panel' || access === 'shared' ? site.content : site.status === 'published' && !isArchived(site) ? site.publishedContent : null;
  // Nothing to unlock (open site, not published, archived, the panel's own preview, already let in): the GET answers.
  if (!visible || access === 'gone' || access === 'panel' || !isProtected(site) || guestMayEnter(site, req.headers.get('cookie'))) return seeOther(back);

  const ip = ipBucket(clientIp(req));
  const limiter = getAccessRateLimiter();
  const siteKey = `access:wrong:${site.id}:${ip}`;
  const ipKey = `access:wrong-ip:${ip}`;
  const page = async (state: 'wrong' | 'wait', status: number, retryAfterMs?: number) =>
    gatePage({ theme: await loadTheme(site.theme), content: visible, action: back, origin: publicOrigin(req.headers, url.origin), state, status, retryAfterMs });

  for (const [key, rule] of [[siteKey, ACCESS_LIMITS.wrongPerSiteIp], [ipKey, ACCESS_LIMITS.wrongPerIp]] as const) {
    // A limiter that cannot peek counts every attempt instead (stricter, never looser).
    const now = limiter.peek ? await limiter.peek(key, rule) : await limiter.hit(key, rule);
    if (!now.allowed) return page('wait', 429, now.retryAfterMs);
  }
  if (guestPasswordMatches(site.guestAccess, form.get('password'))) return seeOther(back, guestSetCookie(site));

  // Only wrong passwords count; the next attempt after the limit is refused by the peek above.
  if (limiter.peek) {
    await limiter.hit(siteKey, ACCESS_LIMITS.wrongPerSiteIp);
    await limiter.hit(ipKey, ACCESS_LIMITS.wrongPerIp);
  }
  return page('wrong', 401);
}

/**
 * The password page for a locked page GET. 200 (not 401): link previews (WhatsApp, iMessage, Facebook) read the tags
 * only from a 200 answer, and the tags say no more than the names and "You're invited". private, no-store, noindex.
 */
export async function lockedResponse(req: Request, site: SiteRecord, content: unknown, target: GateTarget, slug: string): Promise<Response> {
  const url = new URL(req.url);
  return gatePage({
    theme: await loadTheme(site.theme),
    content,
    action: `${targetPath(slug, target)}${url.search}`,
    origin: publicOrigin(req.headers, url.origin),
  });
}

/**
 * /<slug>/event.ics of a protected website without the guest cookie: 303 to the site's password page (/<slug>, same
 * query). The calendar route reads no theme files (it is not a theme route on Vercel); the address is built from the
 * checked slug, never from the request's input.
 */
export function lockedCalendar(req: Request, slug: string): Response {
  return seeOther(`/${slug}${new URL(req.url).search}`);
}
