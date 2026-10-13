import type { NextConfig } from 'next';

// Theme files are read from disk at request time (route handlers), so they must be
// traced into the serverless bundles explicitly. Keys are picomatch globs over route
// paths, so the brackets of dynamic segments are escaped.
const themeFiles = ['./themes/**/*'];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // `next dev` would otherwise write platform/AGENTS.md + CLAUDE.md; the repo keeps its own agent rules at the root.
  agentRules: false,
  outputFileTracingIncludes: {
    '/\\[slug\\]': themeFiles,
    '/\\[slug\\]/\\[page\\]': themeFiles,
    '/themes/\\[theme\\]/\\[\\.\\.\\.path\\]': themeFiles,
  },
};

export default config;
