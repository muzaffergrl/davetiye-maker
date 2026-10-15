// Server-side gate of the admin pages (G087): is the admin on, is this browser signed in.
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, adminConfig, verifySessionToken, type AdminConfig } from './auth.ts';

export async function adminPageState(): Promise<{ config: AdminConfig['state']; signedIn: boolean }> {
  const cfg = adminConfig();
  if (cfg.state !== 'on') return { config: cfg.state, signedIn: false };
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return { config: 'on', signedIn: verifySessionToken(token, cfg.password) };
}
