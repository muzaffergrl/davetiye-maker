// Date formatting for the shop admin (G087). The shop is in Türkiye (K26) and the admin speaks Turkish: timestamps in
// Europe/Istanbul, calendar dates (YYYY-MM-DD) as they are. Same output on the server and in the browser (no
// hydration mismatch: fixed time zone, no "x minutes ago").

const STAMP = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Istanbul',
});

const DAY = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export function stamp(iso: string | null | undefined): string {
  if (!iso) return '—';
  const t = Date.parse(iso);
  return Number.isFinite(t) ? STAMP.format(new Date(t)) : '—';
}

export function day(isoDate: string | null | undefined): string {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return '—';
  return DAY.format(new Date(`${isoDate}T12:00:00Z`));
}
