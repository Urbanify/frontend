'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { ExternalLink, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { EmptyState } from '@/components/app/empty-state';
import { GoogleMaps } from '@/components/google-map/google-map';
import { CATEGORY_META, citySlug, type Place, type PlaceCategory, PLACES_BY_CITY } from '@/components/Tourist/aracaju-places';
import { Button } from '@/components/ui/button/button';
import { Combobox, type ComboboxOptions } from '@/components/ui/combobox/combobox';

import type { City } from '@/types/City';

type Filter = 'all' | PlaceCategory;

type TouristCityVisitExplorerProps = {
  cities: City[];
  initialCityId?: string;
  initialPlaceId?: string;
};

const ARACAJU_CENTER = { lat: -10.9472, lng: -37.0731 };
const MAP_OPTIONS: google.maps.MapOptions = { clickableIcons: false, gestureHandling: 'cooperative' };
const CATEGORY_KEYS = Object.keys(CATEGORY_META) as PlaceCategory[];

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

const pinIcon = (selected: boolean): google.maps.Icon => {
  const size = selected ? 42 : 34;
  const fill = selected ? '#000E2E' : '#034EFF';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.37 11.48 7.3 12.36.4.38 1.01.38 1.4 0C13.63 21.48 20 15.25 20 10c0-4.42-3.58-8-8-8Z" fill="${fill}" stroke="#FFFFFF" stroke-width="1.5"/><circle cx="12" cy="10" r="3.5" fill="#FFFFFF"/></svg>`;
  return {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size - 2),
  };
};

export function TouristCityVisitExplorer({ cities, initialCityId, initialPlaceId }: TouristCityVisitExplorerProps) {
  const cityOptions: ComboboxOptions = useMemo(() => cities.map(city => ({ value: city.id, label: city.name })), [cities]);

  const [cityId, setCityId] = useState(() => (cities.some(city => city.id === initialCityId) ? initialCityId ?? '' : cities[0]?.id ?? ''));
  const city = cities.find(item => item.id === cityId) ?? cities[0];
  const places = useMemo<Place[]>(() => (city ? PLACES_BY_CITY[citySlug(city.name)] ?? [] : []), [city]);
  const aracaju = cities.find(item => citySlug(item.name) === 'aracaju');

  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(() => (places.some(place => place.id === initialPlaceId) ? initialPlaceId ?? null : null));
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? places : places.filter(place => place.category === filter)),
    [places, filter],
  );
  const selected = visible.find(place => place.id === selectedId) ?? visible[0] ?? null;
  const center = useMemo(() => ({
    lat: Number.parseFloat(city?.latitude ?? '') || ARACAJU_CENTER.lat,
    lng: Number.parseFloat(city?.longitude ?? '') || ARACAJU_CENTER.lng,
  }), [city]);

  const { isLoaded, loadError } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Keep the visible pins in view when the city or the filter changes.
  useEffect(() => {
    if (!map || visible.length === 0) {
      return;
    }
    if (visible.length === 1) {
      map.panTo(visible[0]!.position);
      if ((map.getZoom() ?? 0) < 15) {
        map.setZoom(15);
      }
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    visible.forEach(place => bounds.extend(place.position));
    map.fitBounds(bounds, 48);
  }, [map, visible]);

  // Keep ?city= and ?place= in the URL without adding history entries.
  useEffect(() => {
    if (!city) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('city', city.id);
    if (selected) {
      url.searchParams.set('place', selected.id);
    } else {
      url.searchParams.delete('place');
    }
    window.history.replaceState(window.history.state, '', url.toString());
  }, [city, selected]);

  const changeCity = (id: string) => {
    setCityId(id);
    setSelectedId(null);
    setFilter('all');
  };

  // List to map: select, pan and zoom in (no animation when reduced motion is on).
  const focusPlace = (place: Place) => {
    setSelectedId(place.id);
    if (!map) {
      return;
    }
    if (prefersReducedMotion()) {
      map.setCenter(place.position);
    } else {
      map.panTo(place.position);
    }
    if ((map.getZoom() ?? 0) < 15) {
      map.setZoom(15);
    }
  };

  // Map to list: select and bring the item into view (only on desktop, where the list is beside the map).
  const selectFromPin = (place: Place) => {
    setSelectedId(place.id);
    if (isDesktop()) {
      document.getElementById(`place-${place.id}`)?.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  const SelectedIcon = selected ? CATEGORY_META[selected.category].icon : MapPin;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-eyebrow font-semibold uppercase text-primary">Cidade de demonstração</p>
          <h1 className="mt-3 font-display text-[28px] font-bold text-navy md:text-[32px]">
            Explore
            {' '}
            {city?.name}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">Escolha um ponto na lista ou no mapa para ver os detalhes.</p>
        </div>
        {cities.length > 1 && (
          <div className="w-full md:w-[260px]">
            <Combobox
              options={cityOptions}
              placeholder="Escolha a cidade"
              value={cityId}
              setValue={changeCity}
              shouldTranslate={false}
              popoverClassName="w-[260px]"
            />
          </div>
        )}
      </div>

      {places.length > 0 && (
        <div role="group" aria-label="Categorias" className="mt-6 flex flex-wrap gap-2">
          {[['all', 'Todos', MapPin] as const, ...CATEGORY_KEYS.map(key => [key, CATEGORY_META[key].label, CATEGORY_META[key].icon] as const)].map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors',
                filter === value ? 'bg-navy text-white' : 'border border-border bg-card text-navy hover:bg-accent',
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {places.length === 0
        ? (
            <div className="mt-6">
              <EmptyState
                icon={MapPin}
                title={`Ainda não há pontos cadastrados para ${city?.name ?? 'esta cidade'}.`}
                action={aracaju && aracaju.id !== city?.id
                  ? (
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href={`/visit?city=${aracaju.id}`}>Ver Aracaju</Link>
                      </Button>
                    )
                  : undefined}
              />
            </div>
          )
        : (
            <div className="mt-6 grid gap-6 lg:h-[calc(100svh-386px)] lg:min-h-[480px] lg:grid-cols-[380px_1fr]">
              <ul className="order-2 flex flex-col gap-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
                {visible.map((place) => {
                  const isSelected = selected?.id === place.id;
                  const meta = CATEGORY_META[place.category];
                  const Icon = meta.icon;
                  return (
                    <li key={place.id}>
                      <button
                        id={`place-${place.id}`}
                        type="button"
                        aria-current={isSelected ? 'true' : undefined}
                        onClick={() => focusPlace(place)}
                        className={cn(
                          'flex min-h-[64px] w-full flex-col justify-center gap-1 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-white',
                          isSelected && 'border-primary bg-white ring-1 ring-primary',
                        )}
                      >
                        <span className="font-semibold text-navy">{place.name}</span>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Icon aria-hidden="true" className="size-4" />
                          {meta.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="relative order-1 flex flex-col gap-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:min-h-0">
                <div className="relative h-[56svh] min-h-[340px] overflow-hidden rounded-2xl border border-border bg-card lg:h-full lg:min-h-0">
                  {isLoaded
                    ? (
                        <GoogleMaps center={center} zoom={12} onLoad={setMap} options={MAP_OPTIONS}>
                          {visible.map(place => (
                            <Marker
                              key={place.id}
                              position={place.position}
                              title={place.name}
                              onClick={() => selectFromPin(place)}
                              icon={pinIcon(selected?.id === place.id)}
                            />
                          ))}
                        </GoogleMaps>
                      )
                    : (
                        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                          {loadError ? 'Não foi possível carregar o mapa. Você ainda pode ver os pontos na lista.' : 'Carregando o mapa…'}
                        </div>
                      )}
                </div>

                <div className="rounded-xl border border-border bg-white p-4 lg:absolute lg:bottom-4 lg:left-4 lg:w-[340px] lg:shadow-float">
                  {selected
                    ? (
                        <>
                          <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                            <SelectedIcon aria-hidden="true" className="size-4" />
                            {CATEGORY_META[selected.category].label}
                          </p>
                          <h2 aria-live="polite" className="mt-2 text-lg font-semibold text-navy">{selected.name}</h2>
                          <p className="mt-2 text-[15px] text-muted-foreground">{selected.description}</p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${selected.position.lat},${selected.position.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-primary underline-offset-4 hover:underline"
                          >
                            Abrir no Google Maps
                            <ExternalLink aria-hidden="true" className="size-4" />
                          </a>
                        </>
                      )
                    : (
                        <p className="text-[15px] text-muted-foreground">Nenhum ponto nesta categoria.</p>
                      )}
                </div>
              </div>
            </div>
          )}
    </div>
  );
}
