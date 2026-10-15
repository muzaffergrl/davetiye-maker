import type { NextConfig } from 'next';

// Theme files are read from disk at request time (route handlers and pages), so they must be
// traced into the serverless bundles explicitly. Keys are picomatch globs over route paths, so
// the brackets of dynamic segments are escaped. Every route that reads a theme is listed (the
// automatic tracing finds theme.json files only for some of them); `npm run build` runs
// scripts/trace-check.cjs afterwards and fails when a bundle misses what it needs or carries
// what it must not.
//
// G055 (docs/11 §14 #7): theme IMAGES (and CSS/JS) go only into the theme asset route, the one
// route that serves them. Every other theme route reads only templates and JSON (theme.json,
// content.demo.json, img/manifest.json: lib/theme/share.ts decides from it whether a theme has
// its share image / tab icon), so it traces *.html and *.json only. Before: every theme route
// carried all theme images (2 themes: ~2.9 MB per function; 20 themes would be ~55 MB).
const THEME_TEMPLATES = ['./themes/**/*.html', './themes/**/*.json'];
/** = THEME_ASSET_TYPES of lib/site/static.ts (what /themes/<theme>/<path> serves; trace-check compares them). */
export const THEME_ASSET_EXTENSIONS = ['css', 'js', 'mjs', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'ico', 'mp4', 'webm'];
const THEME_ASSETS = [`./themes/**/*.{${THEME_ASSET_EXTENSIONS.join(',')}}`];

export const THEME_ASSET_ROUTE = '/themes/\\[theme\\]/\\[\\.\\.\\.path\\]';

/** Routes that read theme templates / theme.json (not the asset route). */
export const THEME_ROUTES = [
  '/\\[slug\\]',
  '/\\[slug\\]/\\[page\\]',
  '/edit/\\[slug\\]',
  '/api/edit/\\[slug\\]',
  '/api/edit/\\[slug\\]/photo',
  '/api/edit/\\[slug\\]/publish',
  '/api/edit/\\[slug\\]/unpublish',
  '/api/rsvp/\\[slug\\]',
  '/api/rsvp/\\[slug\\]/export',
  '/api/rsvp/\\[slug\\]/responses',
  '/start',
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
  // Panel, RSVP and /start read theme.json / pages too (G044: needed on Vercel). Images: asset route only (G055).
  outputFileTracingIncludes: {
    ...Object.fromEntries(THEME_ROUTES.map((r) => [r, THEME_TEMPLATES])),
    [THEME_ASSET_ROUTE]: THEME_ASSETS,
  },
  async headers() {
    return [
      { source: '/edit/:path*', headers: SECRET_PAGE_HEADERS },
      { source: '/start', headers: SECRET_PAGE_HEADERS },
      // G087: the shop admin shows buyers' emails and, once, a fresh edit link.
      { source: '/admin', headers: SECRET_PAGE_HEADERS },
      { source: '/admin/:path*', headers: SECRET_PAGE_HEADERS },
    ];
  },
};

export default config;
