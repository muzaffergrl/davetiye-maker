/** "Europe/Istanbul" → "Istanbul" (the city of an IANA time zone, for the panel's sentences). */
export const zoneCity = (zone: string | undefined) => (zone ? (zone.split('/').pop() ?? zone).replace(/_/g, ' ') : '');
