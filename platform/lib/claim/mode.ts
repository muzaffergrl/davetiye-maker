// CLAIM_ORDER_VERIFICATION, parsed in ONE place (pure, no imports): the verifier choice (lib/claim/verify.ts
// getOrderVerifier), the admin card and the cron (lib/etsy/config.ts verificationMode re-exports it) and the sales
// site's launch gate (lib/marketing/placeholders.ts launchProblems, at build time) all read the same words.

/** CLAIM_ORDER_VERIFICATION as the code sees it: unset / "off" = off; an unknown word = invalid (never silently off). */
export type VerificationMode = 'off' | 'manual' | 'etsy' | 'trust' | 'invalid';

export function verificationMode(env: Readonly<Record<string, string | undefined>> = process.env): VerificationMode {
  const mode = (env.CLAIM_ORDER_VERIFICATION ?? '').trim().toLowerCase();
  if (mode === '' || mode === 'off') return 'off';
  if (mode === 'manual' || mode === 'etsy' || mode === 'trust') return mode;
  return 'invalid';
}
