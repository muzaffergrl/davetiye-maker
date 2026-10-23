// Placeholder handling for the marketing config (docs/14 §10). A placeholder is an UPPERCASE label in square brackets,
// e.g. "[BRAND]", "[PRICE]", "[SUPPORT EMAIL]", "[ETSY LISTING URL]". Placeholders stay visible on pages until the
// decision is made; they are never written into JSON-LD; with `launched: true` a leftover placeholder stops the build.

import { verificationMode } from '../claim/mode.ts';
import type { DesignCommerce, MarketingConfig } from './config.ts';

/** A whole value that is a placeholder: "[BRAND]". */
export const PLACEHOLDER_RE = /^\[[A-Z0-9][A-Z0-9 :./&_-]*\]$/;
/** A placeholder anywhere inside a text: "Contact [BRAND] at [SUPPORT EMAIL]". */
export const PLACEHOLDER_IN_TEXT_RE = /\[[A-Z0-9][A-Z0-9 :./&_-]*\]/;

export function isPlaceholder(v: unknown): boolean {
  return typeof v === 'string' && PLACEHOLDER_RE.test(v.trim());
}

/** True when the text contains a placeholder anywhere (also "https://[DOMAIN]/x"). */
export function hasPlaceholder(v: unknown): boolean {
  return typeof v === 'string' && PLACEHOLDER_IN_TEXT_RE.test(v);
}

/** The value when it is real (a non-empty string without placeholders), else null. */
export function real(v: string | null | undefined): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t && !hasPlaceholder(t) ? t : null;
}

/** Every placeholder found in any string of a value (deep), as "path: [LABEL]". */
export function findPlaceholders(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    const all = value.match(new RegExp(PLACEHOLDER_IN_TEXT_RE.source, 'g'));
    return all ? all.map((p) => `${path || '(root)'}: ${p}`) : [];
  }
  if (Array.isArray(value)) return value.flatMap((v, i) => findPlaceholders(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => findPlaceholders(v, path ? `${path}.${k}` : k));
  }
  return [];
}

/** A price is usable when it is a real positive number, e.g. "29.40". */
export function realPrice(price: string | null | undefined): string | null {
  const p = real(price ?? null);
  if (!p || !/^\d+(?:\.\d{1,2})?$/.test(p) || Number(p) <= 0) return null;
  return p;
}

/** An Etsy listing link is usable when it is an https URL on etsy.com (shop links: etsy.com or *.etsy.com). */
export function realEtsyUrl(url: string | null | undefined): string | null {
  const u = real(url ?? null);
  if (!u) return null;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== 'https:') return null;
    if (!(parsed.hostname === 'etsy.com' || parsed.hostname.endsWith('.etsy.com'))) return null;
    return u;
  } catch {
    return null;
  }
}

/** Problems that block `launched: true` (empty list = ready). `env`: the build's environment (admin password, K33). */
export function launchProblems(cfg: MarketingConfig, env: Record<string, string | undefined> = process.env): string[] {
  const out: string[] = [];
  // K33: a short temporary admin password is allowed only before launch (lib/admin/auth.ts ADMIN_PASSWORD_MIN = 12).
  if (env.ADMIN_PASSWORD !== undefined && env.ADMIN_PASSWORD.length < 12) {
    out.push('ADMIN_PASSWORD is shorter than 12 characters: set a long shop admin password before launch (K33)');
  }
  if (!real(cfg.brand.name)) out.push('brand.name is a placeholder');
  if (hasPlaceholder(cfg.brand.shortDescription)) out.push('brand.shortDescription contains a placeholder');
  if (cfg.brand.shortDescription.length > 160) out.push('brand.shortDescription is longer than 160 characters');
  if (!real(cfg.domain)) out.push('domain is a placeholder');
  if (!real(cfg.support.email) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cfg.support.email)) out.push('support.email is not a real address');
  if (!real(cfg.support.responseTime)) out.push('support.responseTime is a placeholder');
  if (!real(cfg.etsy.shopName)) out.push('etsy.shopName is a placeholder');
  if (!realEtsyUrl(cfg.etsy.shopUrl)) out.push('etsy.shopUrl is not a real Etsy URL');
  for (const [k, v] of Object.entries(cfg.policies)) if (!real(v)) out.push(`policies.${k} is a placeholder`);
  let origin: URL | null = null;
  try {
    origin = hasPlaceholder(cfg.siteUrl) ? null : new URL(cfg.siteUrl);
  } catch {
    origin = null;
  }
  if (!origin || origin.protocol !== 'https:') out.push('siteUrl is not a real https origin (set MARKETING_SITE_URL)');
  else if (real(cfg.domain) && origin.hostname !== cfg.domain && origin.hostname !== `www.${cfg.domain}`) {
    // docs/14 §9.3: indexing starts on the brand domain, never on the temporary vercel.app address.
    out.push(`siteUrl host ${origin.hostname} is not the brand domain ${cfg.domain}`);
  }
  if (!cfg.verified.editRights) out.push('verified.editRights is false: the 3 name/date changes rule is not live yet (G060)');
  if (!cfg.verified.archive) out.push('verified.archive is false: "online until 12 months after the wedding" is not live yet (G060)');
  if (!cfg.verified.privacyText) out.push('verified.privacyText is false: the privacy notice is still a draft');
  if (!cfg.verified.orderCheck) {
    out.push('verified.orderCheck is false: /start accepts any order number (set CLAIM_ORDER_VERIFICATION=manual, trust or etsy, G060-fix)');
  }
  // The flag above is a promise in the copy; this is the switch itself, read from the BUILD's environment (the production
  // build on Vercel sees the production variables): a launched site whose /start would not check orders must not build.
  const mode = verificationMode(env);
  if (mode === 'off') {
    out.push('CLAIM_ORDER_VERIFICATION is off (or unset) in this build: production /start would accept any order number — set it to trust, manual or etsy');
  } else if (mode === 'invalid') {
    out.push('CLAIM_ORDER_VERIFICATION has an unknown value in this build (use trust, manual or etsy): /start would refuse every claim');
  }
  // K42 services are optional: only one with a real Etsy listing must carry a real price.
  for (const sv of cfg.services ?? []) {
    if (realEtsyUrl(sv.etsyListingUrl) && !realPrice(sv.price)) out.push(`services.${sv.id}.price is not a real price`);
  }
  const live = cfg.designs.filter((d) => d.status === 'live');
  if (!live.length) out.push('no live design');
  for (const d of live) out.push(...designLaunchProblems(d));
  return out;
}

export function designLaunchProblems(d: DesignCommerce): string[] {
  const out: string[] = [];
  if (!realPrice(d.price)) out.push(`designs.${d.id}.price is not a real price`);
  if (d.compareAtPrice !== null && !realPrice(d.compareAtPrice)) out.push(`designs.${d.id}.compareAtPrice is not a real price`);
  if (!realEtsyUrl(d.etsyListingUrl)) out.push(`designs.${d.id}.etsyListingUrl is not a real Etsy URL`);
  // docs/14 §7.2: the Share & Save link is used as Etsy gives it; UTM parameters may break its attribution.
  else if (/[?&]utm_/i.test(d.etsyListingUrl)) out.push(`designs.${d.id}.etsyListingUrl carries utm_ parameters (use the Share & Save link as is)`);
  return out;
}

/** Throws when the site is launched with placeholders left (the build stops: docs/14 §10). `env`: the build's environment. */
export function assertLaunchReady(cfg: MarketingConfig, env: Record<string, string | undefined> = process.env): void {
  if (!cfg.launched) return;
  const problems = launchProblems(cfg, env);
  if (problems.length) {
    throw new Error(`Marketing site is set to launched but is not ready:\n - ${problems.join('\n - ')}\n(lib/marketing/config.ts)`);
  }
}
