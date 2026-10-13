import type { NextConfig } from 'next';

// Theme files are read from disk at request time (route handlers and pages), so they must be
// traced into the serverless bundles explicitly. Keys are picomatch globs over route paths, so
// the brackets of dynamic segments are escaped. Every route that reads a theme is listed (the
// automatic tracing finds theme.json files only for some of them); `npm run build` runs
// scripts/trace-check.cjs afterwards and fails when one of these bundles misses theme pages.
const themeFiles = ['./themes/**/*'];

const THEME_ROUTES = [
  '/\\[slug\\]',
  '/\\[slug\\]/\\[page\\]',
  '/themes/\\[theme\\]/\\[\\.\\.\\.path\\]',
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
  // Panel, RSVP and /start read theme.json / pages too (G044: needed on Vercel).
  outputFileTracingIncludes: Object.fromEntries(THEME_ROUTES.map((r) => [r, themeFiles])),
  async headers() {
    return [
      { source: '/edit/:path*', headers: SECRET_PAGE_HEADERS },
      { source: '/start', headers: SECRET_PAGE_HEADERS },
    ];
  },
};

export default config;
