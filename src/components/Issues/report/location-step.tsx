'use client';

import { Autocomplete, Marker, useLoadScript } from '@react-google-maps/api';
import { LocateFixed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Skeleton } from '@/components/ui/skeleton/skeleton';

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';

import type { Coordinates, StepProps } from './draft';

export function LocationStep({ draft, onChange, onNext }: StepProps) {
  const t = useTranslations('Report.location');
  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<'denied' | 'unavailable' | null>(null);

  const useMyLocation = () => {
    setGeoError(null);

    if (!navigator.geolocation) {
      setGeoError('unavailable');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        onChange({ location: { lat: coords.latitude, lng: coords.longitude } });
      },
      (error) => {
        setLocating(false);
        setGeoError(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const onPlaceChanged = () => {
    const place = autocomplete?.getPlace();
    const location = place?.geometry?.location;

    if (!place || !location) {
      return;
    }

    onChange({
      address: place.formatted_address ?? '',
      location: { lat: location.lat(), lng: location.lng() },
    });
  };

  const setPin = (point: google.maps.LatLng | null | undefined) => {
    if (point) {
      onChange({ location: point.toJSON() as Coordinates });
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy md:text-[28px]">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="space-y-2">
        <Button variant="outline" size="lg" className="h-12 w-full" isLoading={locating} onClick={useMyLocation}>
          <LocateFixed aria-hidden />
          {t('use_mine')}
        </Button>
        <p className="text-sm text-muted-foreground">{t('use_mine_help')}</p>
        {geoError && (
          <p role="alert" className="text-sm text-destructive">
            {t(geoError === 'denied' ? 'denied' : 'unavailable')}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('search_label')}</Label>
        {isLoaded
          ? (
              <Autocomplete onLoad={setAutocomplete} onPlaceChanged={onPlaceChanged}>
                <Input
                  id="address"
                  type="text"
                  autoComplete="off"
                  placeholder={t('search_placeholder')}
                  value={draft.address}
                  onChange={event => onChange({ address: event.target.value })}
                  className="h-12 text-base"
                />
              </Autocomplete>
            )
          : <Skeleton className="h-12" />}
      </div>

      <div className="space-y-2">
        <div className="h-72 overflow-hidden rounded-xl border md:h-96">
          {isLoaded
            ? (
                <GoogleMaps
                  center={draft.location ?? BRAZIL_POSITION}
                  zoom={draft.location ? 16 : 4}
                  onClick={event => setPin(event.latLng)}
                  options={{ controlSize: 30, draggableCursor: 'pointer', draggingCursor: 'all-scroll' }}
                >
                  {draft.location && (
                    <Marker
                      position={draft.location}
                      draggable
                      onDragEnd={event => setPin(event.latLng)}
                    />
                  )}
                </GoogleMaps>
              )
            : <Skeleton className="size-full rounded-none" />}
        </div>
        <p className="text-sm text-muted-foreground">{t('map_help')}</p>
      </div>

      <Button className="h-12 w-full" disabled={!draft.location} onClick={onNext}>
        {draft.location ? t('continue') : t('missing')}
      </Button>
    </section>
  );
}
