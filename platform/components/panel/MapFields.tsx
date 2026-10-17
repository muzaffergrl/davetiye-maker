'use client';

// Day & place → "Map & directions" (G127). Per place: show the map / directions (default: on when the place can be
// found), how guests' maps find it (the pin of the map link, else the address), a small on-demand preview, and an
// optional second place (the reception). Short share links (maps.app.goo.gl/…) are read on the server once.

import { MapPin, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ContentRecord, MapPlaceSettings, ReceptionPlace } from '../../lib/content/types.ts';
import { allMapPlaces, coordsFromMapLink, DEFAULT_LABELS, directionLinks, isShortMapLink, mapEmbedUrl, type MapPlace, type MapPlaceKey } from '../../lib/maps.ts';
import { Group, Switch, TextField, UrlField, usePanelContext } from './fields.tsx';
import { Button } from './ui.tsx';
import styles from './panel.module.css';
import own from './map-fields.module.css';
import { t } from '../../lib/i18n/client.ts';

type Change = (c: ContentRecord) => void;

function settingsOf(c: ContentRecord, key: MapPlaceKey): MapPlaceSettings {
  c.maps = { ...(c.maps ?? {}) };
  if (key === 'venue') return (c.maps.venue = { ...(c.maps.venue ?? {}) });
  return (c.maps.reception = { ...(c.maps.reception ?? { name: '' }) });
}

/** Sets lat/lng from a map link (null when the link has no pin): a link without a pin no longer moves the map. */
function pinFromLink(s: MapPlaceSettings, link: string | null): void {
  const pin = coordsFromMapLink(link);
  s.lat = pin?.lat ?? null;
  s.lng = pin?.lng ?? null;
}

/** Reads a short share link once (per link) and stores its pin. */
function useShortLink(key: MapPlaceKey, link: string | null | undefined) {
  const { edit, resolveMapLink } = usePanelContext();
  const [state, setState] = useState<{ link: string; status: 'busy' | 'done' | 'failed'; message?: string } | null>(null);
  const asked = useRef<string | null>(null);
  useEffect(() => {
    if (!link || !isShortMapLink(link) || !resolveMapLink || asked.current === link) return;
    asked.current = link;
    const timer = setTimeout(() => {
      setState({ link, status: 'busy' });
      void resolveMapLink(link).then((res) => {
        if (res.ok && typeof res.body.lat === 'number' && typeof res.body.lng === 'number') {
          const { lat, lng } = res.body;
          edit((c) => {
            const current = key === 'venue' ? c.urls?.map : c.maps?.reception?.link;
            if (current !== link) return; // changed meanwhile
            const s = settingsOf(c, key);
            s.lat = lat;
            s.lng = lng;
          });
          setState({ link, status: 'done' });
        } else {
          setState({ link, status: 'failed', message: res.body.message });
        }
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [key, link, edit, resolveMapLink]);
  return state && state.link === link ? state : null;
}

function FoundBy({ place, short }: { place: MapPlace | undefined; short: ReturnType<typeof useShortLink> }) {
  if (!place) return <p className={styles.hint}>{t('Add a street address or a map link so guests can find the place.')}</p>;
  if (short?.status === 'busy') return <p className={styles.hint}>{t('Reading your map link…')}</p>;
  if (place.coords) {
    return (
      <p className={styles.hint} data-map-found="pin">
        {t('Guests’ maps go to the map pin ({lat}, {lng}).', { lat: place.coords.lat.toFixed(5), lng: place.coords.lng.toFixed(5) })}
      </p>
    );
  }
  return (
    <p className={styles.hint} data-map-found="address">
      {short?.status === 'failed' ? `${t('We could not read the pin of this link.')} ` : ''}
      {t('Guests’ maps search for:')} <strong>{place.destination}</strong>
    </p>
  );
}

/** A small preview: the card guests see, the Google Maps frame only after "Preview map". */
function Preview({ place }: { place: MapPlace }) {
  const [open, setOpen] = useState<string | null>(null);
  const src = mapEmbedUrl(place);
  return (
    <div className={own.preview} data-map-preview={place.key}>
      {open === src ? (
        <iframe className={own.frame} src={src} title={place.name ? t('Map preview of {place}', { place: place.name }) : t('Map preview of the place')} referrerPolicy="no-referrer" loading="lazy" />
      ) : (
        <div className={own.card}>
          <MapPin size={22} strokeWidth={1.5} aria-hidden="true" />
          {place.name ? <span className={own.name}>{place.name}</span> : null}
          {place.address ? <span className={own.address}>{place.address}</span> : null}
          {place.showMap ? (
            <Button small variant="secondary" onClick={() => setOpen(src)} data-map-preview-open>
              {t('Preview map')}
            </Button>
          ) : null}
        </div>
      )}
      {place.showDirections ? (
        <p className={own.links}>
          {t('Test directions:')}{' '}
          {directionLinks(place).map((l, i) => (
            <span key={l.id}>
              {i ? ' · ' : ''}
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function PlaceSwitches({ keyName, place, setting }: { keyName: MapPlaceKey; place: MapPlace | undefined; setting: MapPlaceSettings | undefined | null }) {
  const { edit } = usePanelContext();
  const set = (field: 'show_map' | 'show_directions', on: boolean) => edit((c) => void (settingsOf(c, keyName)[field] = on));
  const showMap = place ? place.showMap : setting?.show_map === true;
  const showDir = place ? place.showDirections : setting?.show_directions === true;
  return (
    <>
      <Switch
        id={`map-${keyName}-show`}
        label={t('Show map')}
        hint={t('Guests tap “Show map” to load Google Maps. Nothing loads before.')}
        checked={showMap}
        onChange={(on) => set('show_map', on)}
      />
      <Switch
        id={`map-${keyName}-directions`}
        label={t('Show directions')}
        hint={t('Get directions with Google Maps, Apple Maps or Waze.')}
        checked={showDir}
        onChange={(on) => set('show_directions', on)}
      />
    </>
  );
}

/** Below the venue's "Map link": the venue's map settings + the reception place. */
export function MapFields() {
  const { content, edit, locked } = usePanelContext();
  const places = allMapPlaces(content);
  const venue = places.find((p) => p.key === 'venue');
  const reception = places.find((p) => p.key === 'reception');
  const r = content.maps?.reception ?? null;
  const venueShort = useShortLink('venue', content.urls?.map);
  const receptionShort = useShortLink('reception', r?.link);
  const two = Boolean(r);
  const upd = (change: (s: ReceptionPlace) => void): void =>
    edit(((c) => {
      const s = settingsOf(c, 'reception') as ReceptionPlace;
      change(s);
    }) as Change);
  return (
    <Group title={t('Map & directions')} data-map-fields>
      <FoundBy place={venue} short={venueShort} />
      <PlaceSwitches keyName="venue" place={venue} setting={content.maps?.venue} />
      {venue && (venue.showMap || venue.showDirections) ? <Preview place={venue} /> : null}
      {two ? (
        <TextField
          path="maps.venue.label"
          label={t('Heading for this place')}
          optional
          placeholder={DEFAULT_LABELS.venue}
          maxLength={40}
          value={content.maps?.venue?.label}
          onChange={(x) => edit((c) => void (settingsOf(c, 'venue').label = x.trim() ? x : null))}
        />
      ) : null}

      {r ? (
        <div className={own.second} data-map-reception>
          <p className={own.subhead}>{t('Reception at another place')}</p>
          <TextField
            path="maps.reception.label"
            label={t('Heading')}
            optional
            placeholder={DEFAULT_LABELS.reception}
            maxLength={40}
            value={r.label}
            onChange={(x) => upd((s) => void (s.label = x.trim() ? x : null))}
          />
          <TextField path="maps.reception.name" label={t('Place name')} maxLength={80} value={r.name} onChange={(x) => upd((s) => void (s.name = x))} />
          <TextField
            path="maps.reception.address"
            label={t('Street address')}
            optional
            maxLength={200}
            value={r.address}
            onChange={(x) => upd((s) => void (s.address = x.trim() ? x : null))}
          />
          <TextField path="maps.reception.city" label={t('City')} optional maxLength={80} value={r.city} onChange={(x) => upd((s) => void (s.city = x.trim() ? x : null))} />
          <UrlField
            path="maps.reception.link"
            label={t('Map link')}
            optional
            hint={t('Paste a Google Maps or Apple Maps link to the place.')}
            value={r.link}
            onChange={(x) =>
              upd((s) => {
                s.link = x;
                pinFromLink(s, x);
              })
            }
          />
          <FoundBy place={reception} short={receptionShort} />
          <PlaceSwitches keyName="reception" place={reception} setting={r} />
          {reception && (reception.showMap || reception.showDirections) ? <Preview place={reception} /> : null}
          <div className={styles.buttonRow}>
            <Button variant="dangerText" icon={Trash2} disabled={locked} onClick={() => edit((c) => void (c.maps = { ...(c.maps ?? {}), reception: null }))} data-map-reception-remove>
              {t('Remove this place')}
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.buttonRow}>
          <Button
            variant="secondary"
            icon={Plus}
            disabled={locked}
            onClick={() => edit((c) => void (c.maps = { ...(c.maps ?? {}), reception: { name: '', address: null, city: null, link: null } }))}
            data-map-reception-add
          >
            {t('Add a reception place')}
          </Button>
        </div>
      )}
    </Group>
  );
}

/** The venue's "Map link" field changed: its pin follows (G127). */
export function venueMapLinkChange(c: ContentRecord, link: string | null): void {
  c.urls = { ...(c.urls ?? {}), map: link };
  if (link === null && !c.maps?.venue) return;
  pinFromLink(settingsOf(c, 'venue'), link);
}
