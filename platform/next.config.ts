import type { NextConfig } from 'next';

// Theme files are read from disk at request time (route handlers and pages), so they must be
// traced into the serverless bundles explicitly. Keys are picomatch globs over route paths, so
// the brackets of dynamic segments are escaped. Every route that reads a theme is listed (the
// automatic tracing finds theme.json files only for some of them); `npm run build` runs
// scripts/trace-check.cjs afterwards and fails when a bundle misses what it needs or carries
// what it must not.
//
// G055 (docs/11 §14 #7): theme routes read only templates and JSON (theme.json, content.demo.json,
// img/manifest.json: lib/theme/share.ts decides from it whether a theme has its share image / tab
// icon), so they trace *.html and *.json only.
//
// G159: theme CSS/JS/images go into NO function. `npm run build` first mirrors them into
// public/themes/ (scripts/theme-assets.cjs, `prebuild`), and Vercel's CDN serves them at the same
// URLs (/themes/<theme>/<path>). Until then the asset route traced every one of them (~100 MB with
// 29 themes and the first palettes, growing ~7 MB per design). The asset route stays for what has
// no copy (404s, `next dev`); trace-check fails the build when any function carries a theme asset
// or more than THEME_BUDGET_MB of theme files.
const THEME_TEMPLATES = ['./themes/**/*.html', './themes/**/*.json'];
/** = THEME_ASSET_TYPES of lib/site/static.ts (what /themes/<theme>/<path> serves; trace-check compares them). */
export const THEME_ASSET_EXTENSIONS = ['css', 'js', 'mjs', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'ico', 'mp4', 'webm'];
/** Kept out of every function trace (G159): the static copies and the theme files they are copied from. */
export const THEME_ASSET_EXCLUDES = ['./public/themes/**', `./themes/**/*.{${THEME_ASSET_EXTENSIONS.join(',')}}`];
/** = lib/site/static.ts THEME_ASSET_CACHE / THEME_FILE_CSP: the route's headers, set on the public copies too. */
export const THEME_ASSET_CACHE = 'public, max-age=3600, s-maxage=86400';
export const THEME_FILE_CSP = "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'";

/**
 * G139: the PDF route runs a headless Chromium. On Vercel it is @sparticuz/chromium: its packed browser (bin/*.br)
 * is read from disk at run time, so it is traced explicitly and both packages stay outside the bundle.
 * G159: it reads the printable invitation's parts from disk, public/print/<theme>/<part>.webp (lib/print/render.ts
 * localAsset) — exactly those are traced; nothing else of public/ (before, the whole folder was: sales-site media, and the
 * palettes' print parts public/print/<theme>/variants/…, which render.ts fetches from the CDN anyway; ~57 MB, growing).
 */
export const PDF_ROUTE = '/api/edit/\\[slug\\]/download';
const CHROMIUM_FILES = ['./node_modules/@sparticuz/chromium/bin/**'];
export const PRINT_PARTS = ['./public/print/*/*.webp'];

export const THEME_ASSET_ROUTE = '/themes/\\[theme\\]/\\[\\.\\.\\.path\\]';

/**
 * G153 + G159: a colour variant's virtual folder /themes/<theme>/~<variant>/<path>. Its own images are static copies
 * (public/themes/<theme>/~<variant>/img/…); everything else falls through to the original, still under the variant URL
 * (a rewrite, not a redirect: relative url(img/…) in the stylesheet must keep resolving inside ~<variant>/). afterFiles
 * = after the public files are checked. When no copy answers (`next dev`, a test's themes folder) the asset route serves
 * from disk and picks the override itself (from ?variant=, or from the address asked for, which `next start` passes on).
 */
export const VARIANT_REWRITE = {
  source: '/themes/:theme/~:variant([a-z][a-z0-9-]{0,31})/:path+',
  destination: '/themes/:theme/:path+?variant=:variant',
};

/**
 * Headers of /themes/… (G159): what the asset route sets, for the public copies. They also land on the route's own
 * answers and win there (so a 404 of a missing .webp carries the Cache-Control too: harmless, Vercel's CDN cache is per
 * deployment).
 */
export const THEME_ASSET_HEADERS = [
  { source: '/themes/:path*', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
  { source: `/themes/:path(.*\\.(?:${THEME_ASSET_EXTENSIONS.join('|')}))`, headers: [{ key: 'Cache-Control', value: THEME_ASSET_CACHE }] },
  { source: '/themes/:path(.*\\.svg)', headers: [{ key: 'Content-Security-Policy', value: THEME_FILE_CSP }] },
];

/** Routes that read theme templates / theme.json (not the asset route). */
export const THEME_ROUTES = [
  '/\\[slug\\]',
  '/\\[slug\\]/\\[page\\]',
  '/edit/\\[slug\\]',
  '/api/edit/\\[slug\\]',
  '/api/edit/\\[slug\\]/photo',
  '/api/edit/\\[slug\\]/publish',
  '/api/edit/\\[slug\\]/unpublish',
  // G153: the colour palette is checked against theme.json
  '/api/edit/\\[slug\\]/variant',
  '/api/edit/\\[slug\\]/download',
  '/api/rsvp/\\[slug\\]',
  '/api/rsvp/\\[slug\\]/export',
  '/api/rsvp/\\[slug\\]/responses',
  '/start',
  // G146: /my lists the startable designs (for a new order without ?theme=).
  '/my',
  '/start/demo/\\[theme\\]',
  '/start/demo/\\[theme\\]/\\[page\\]',
  '/start/demo/\\[theme\\]/event\\.ics',
  '/api/start',
  '/api/start/slug',
];

// Pages that hold the secret edit link (/edit/<slug>?k=…, and /start after a claim): never framed by
// another site, never send the URL on. (They can frame the site preview / theme demo themselves.)
// A script-src policy is not set here: Next's inline bootstrap scripts would need per-request nonces.
const SECRET_PAGE_HEADERS = [
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'none'; object-src 'none'; form-action 'self'" },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // `next dev` would otherwise write platform/AGENTS.md + CLAUDE.md; the repo keeps its own agent rules at the root.
  agentRules: false,
  serverExternalPackages: ['@sparticuz/chromium', 'playwright-core'],
  // G152: no app/layout.tsx (separate root layouts: components/i18n/RootDocument.tsx) → app/global-not-found.tsx answers
  // addresses no route matches.
  experimental: { globalNotFound: true },
  // Panel, RSVP and /start read theme.json / pages too (G044: needed on Vercel). Theme CSS/JS/images: no function (G159).
  outputFileTracingIncludes: Object.fromEntries(
    THEME_ROUTES.map((r) => [r, r === PDF_ROUTE ? [...THEME_TEMPLATES, ...CHROMIUM_FILES, ...PRINT_PARTS] : THEME_TEMPLATES]),
  ),
  // Every route (picomatch over the route path; excludes are applied after the includes).
  outputFileTracingExcludes: { '**': THEME_ASSET_EXCLUDES },
  // G144: the sales site in Turkish, Spanish, German and French lives at /tr, /es, /de, /fr (+ /<lang>/designs …). The
  // pages are app/(marketing)/i18n/[lang]/…: a dynamic [lang] folder at the root would clash with the couple sites at
  // /[slug] (slugs are 3+ characters, so two-letter prefixes are free; lib/slug.ts reserves them and "i18n" anyway).
  // beforeFiles: before the filesystem routes, so /tr never reaches app/[slug].
  // Keep legacy IDN links (including editor keys and deep paths) on the primary ASCII domain.
  async redirects() {
    return ['xn--bkestudo-zkb.com', 'www.xn--bkestudo-zkb.com'].map((host) => ({
      source: '/:path*',
      has: [{ type: 'host' as const, value: host.replaceAll('.', '[.]') }],
      destination: 'https://bkestudio.com/:path*',
      permanent: true,
    }));
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/:lang(tr|es|de|fr)', destination: '/i18n/:lang' },
        { source: '/:lang(tr|es|de|fr)/:path*', destination: '/i18n/:lang/:path*' },
      ],
      // G159: a variant's virtual folder falls back to the original files (VARIANT_REWRITE).
      afterFiles: [VARIANT_REWRITE],
      fallback: [],
    };
  },
  async headers() {
    return [
      // G159: the static theme files (public/themes/) carry what the asset route sends with them (lib/site/static.ts).
      ...THEME_ASSET_HEADERS,
      { source: '/edit/:path*', headers: SECRET_PAGE_HEADERS },
      { source: '/start', headers: SECRET_PAGE_HEADERS },
      // G146: /my opens editors (device keys, saved edit links): never framed, never sends its URL on.
      { source: '/my', headers: SECRET_PAGE_HEADERS },
      // G087: the shop admin shows buyers' emails and, once, a fresh edit link.
      { source: '/admin', headers: SECRET_PAGE_HEADERS },
      { source: '/admin/:path*', headers: SECRET_PAGE_HEADERS },
    ];
  },
};

export default config;
