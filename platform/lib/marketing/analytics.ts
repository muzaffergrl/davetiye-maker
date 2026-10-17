// Marketing events (docs/14 §9.9). Browser-safe: no imports. The provider comes from config via a data attribute
// on the marketing shell (data-analytics="none" | "vercel"), so this file stays tiny on the client.
// - "none" (default, decision 7 open): events are only dispatched as a DOM event (tests listen to it).
// - "vercel": also sent to Vercel Web Analytics through its global queue (window.va, injected by @vercel/analytics
//   once that package is added — not installed yet). No personal data is ever part of an event.

export type MarketingEvent = 'demo_open' | 'etsy_click' | 'start_click' | 'guide_cta' | 'contact_email_click' | 'nav_designs' | 'lang_switch';

export function track(name: MarketingEvent, data: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('mk:track', { detail: { name, data } }));
  const provider = document.querySelector('[data-analytics]')?.getAttribute('data-analytics');
  const va = (window as unknown as { va?: (kind: string, payload: unknown) => void }).va;
  if (provider === 'vercel' && typeof va === 'function') va('event', { name, data });
}
