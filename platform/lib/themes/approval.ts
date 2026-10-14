// Which designs are approved for sale, and where /start enforces it (G080).
//
// ONE source of truth: the sales-site design list, lib/marketing/config.ts `designs[]`. A theme is APPROVED when it
// is listed there with `status: 'live'`; every other theme (listed as 'coming', or not listed at all) is IN REVIEW.
// So the sales site and /start can never disagree: what the sales site shows is exactly what a buyer can start, and
// approving a design is the one-line change the integrator already makes when a design goes on sale ('coming' ->
// 'live', docs/14 §6). Nothing about approval lives in the theme folders (themes/<id>/theme.json stays the theme's own
// description), so theme work (G4NN) never touches it.
//
// Where it is enforced: only in production — Vercel's production deployment (VERCEL_ENV=production, set by Vercel)
// or any server started with THEME_APPROVAL=enforce (tests, a local check of the production behaviour). There:
//   - /start?theme=<in review>  -> 404 page with an honest "not available yet" message (app/start/not-found.tsx)
//   - POST /api/start           -> 403 theme_in_review (lib/claim/claim.ts), nothing stored
//   - /start without a theme    -> lists the approved designs only
// The theme demos (/start/demo/<id>) and existing sites stay reachable everywhere: they are how a design in review is
// tested. Locally (next dev / next start), on Vercel previews and in `npm test` every theme can be started, so other
// agents' theme work is never blocked.

import { MARKETING, type MarketingConfig } from '../marketing/config.ts';

export type ThemeApproval = 'approved' | 'review';

/** Approved theme ids (sales-site designs with status 'live'), in config order. */
export function approvedThemeIds(cfg: MarketingConfig = MARKETING): string[] {
  return cfg.designs.filter((d) => d.status === 'live').map((d) => d.id);
}

/** 'approved' when the sales site lists the theme as live, else 'review'. */
export function themeApproval(id: string, cfg: MarketingConfig = MARKETING): ThemeApproval {
  return cfg.designs.some((d) => d.id === id && d.status === 'live') ? 'approved' : 'review';
}

/** Where the gate reads VERCEL_ENV and THEME_APPROVAL: process.env in the app, a plain object in tests. */
export type ApprovalEnv = Readonly<Record<string, string | undefined>>;

/** True where unapproved themes are refused: Vercel production, or THEME_APPROVAL=enforce. */
export function themeApprovalEnforced(env: ApprovalEnv = process.env): boolean {
  return env.VERCEL_ENV === 'production' || env.THEME_APPROVAL === 'enforce';
}

/** May a buyer start a website from this theme on this server? (The theme must also be claimable: lib/claim/themes.ts.) */
export function themeOpenForClaims(id: string, opts: { env?: ApprovalEnv; cfg?: MarketingConfig } = {}): boolean {
  return !themeApprovalEnforced(opts.env ?? process.env) || themeApproval(id, opts.cfg) === 'approved';
}

/** The buyer-facing words for a design in review (API message + /start page). */
export const THEME_IN_REVIEW = {
  title: 'This design is not available yet',
  message:
    'This design is still being finished and is not on sale yet, so a website cannot be started from it. ' +
    'If you bought a design on Etsy, please open the start link from your Etsy download, or message the shop on Etsy.',
} as const;
