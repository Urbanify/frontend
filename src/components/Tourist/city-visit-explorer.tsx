'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { Clock, MapPin, Navigation, Phone, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { EmptyState } from '@/components/app/empty-state';
import { GoogleMaps } from '@/components/google-map/google-map';
import { CATEGORY_META, cityCenter, normalizeText, PLACE_CATEGORY_ORDER } from '@/components/places/place-meta';
import { PLACE_TONE, placePinIcon } from '@/components/Tourist/category-tone';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';

import { api } from '@/services/api';
import type { Place, PlaceCategory } from '@/services/api/places';

import type { City } from '@/types/City';

type Filter = 'all' | PlaceCategory;

type PlaceView = Place & { position: google.maps.LatLngLiteral };

type TouristCityVisitExplorerProps = {
  /** Cities rendered on the server. The browser refreshes the list from GET /cities. */
  cities: City[];
  initialCityId?: string;
  initialPlaceId?: string;
  /** Published places of the initial city, fetched on the server. Null when that request failed. */
  initialPlaces?: Place[] | null;
};

const MAP_OPTIONS: google.maps.MapOptions = { clickableIcons: false, gestureHandling: 'cooperative' };
const CHIP = 'inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors';
const UNSELECTED_CHIP = 'border border-border bg-card text-navy hover:bg-accent';
const PAGE_SIZE = 8;
const DEFAULT_FILTER: PlaceCategory = 'HEALTH';

const isActive = (city: City) => city.status === 'ACTIVE';
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isDesktop = () => window.matchMedia('(min-width: 1024px)').matches;

export function TouristCityVisitExplorer({ cities, initialCityId, initialPlaceId, initialPlaces }: TouristCityVisitExplorerProps) {
  // The server list is the first render. The browser list (GET /cities) replaces it when it loads.
  // If that request fails, the server list stays.
  const [cityList, setCityList] = useState<City[]>(() => cities.filter(isActive));

  useEffect(() => {
    let active = true;
    api.instance('/cities', { method: 'GET' })
      .then(response => (response.ok ? response.json() as Promise<City[]> : null))
      .then((list) => {
        if (active && Array.isArray(list)) {
          setCityList(list.filter(isActive));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  // The URL id is kept even before the list loads. An unknown id falls back to the first city.
  const [cityId, setCityId] = useState(initialCityId ?? '');
  const city = cityList.find(item => item.id === cityId) ?? cityList[0];

  // Places of the selected city. The server's list is used only for the city it was fetched for.
  const [loaded, setLoaded] = useState<{ cityId: string; items: Place[] | null }>(() => ({
    cityId: initialPlaces ? (initialCityId ?? '') : '',
    items: initialPlaces ?? null,
  }));

  useEffect(() => {
    if (!city || loaded.cityId === city.id) {
      return;
    }
    let active = true;
    api.places.listPublic(city.id)
      .then((items) => {
        if (active) {
          setLoaded({ cityId: city.id, items });
        }
      })
      .catch(() => {
        if (active) {
          setLoaded({ cityId: city.id, items: null });
        }
      });
    return () => {
      active = false;
    };
  }, [city, loaded.cityId]);

  const ready = !!city && loaded.cityId === city.id;
  const items = ready ? loaded.items : null;
  const places = useMemo<PlaceView[]>(
    () => (items ?? []).map(place => ({ ...place, position: { lat: place.latitude, lng: place.longitude } })),
    [items],
  );

  const [filter, setFilter] = useState<Filter>(DEFAULT_FILTER);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(initialPlaceId || null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // The list and the map share this set: the chip filter plus the search box.
  const visible = useMemo(() => {
    const term = normalizeText(query.trim());
    return places
      .filter(place => filter === 'all' || place.category === filter)
      .filter(place => !term || normalizeText(`${place.name} ${place.address ?? ''}`).includes(term))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [places, filter, query]);
  const shown = visible.slice(0, limit);
  const selected = (selectedId ? places.find(place => place.id === selectedId) : undefined) ?? visible[0] ?? null;

  const center = useMemo(() => cityCenter(city), [city]);

  const { isLoaded, loadError } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Keep the visible pins in view when the city, the chip or the search changes.
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
    setFilter(DEFAULT_FILTER);
    setQuery('');
    setLimit(PAGE_SIZE);
  };

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setSelectedId(null);
    setLimit(PAGE_SIZE);
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setLimit(PAGE_SIZE);
  };

  // List to map: select, pan and zoom in (no animation when reduced motion is on).
  const focusPlace = (place: PlaceView) => {
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

  // Map to list: select the pin. On desktop, the list item is brought into view when it is shown.
  const selectFromPin = (place: PlaceView) => {
    setSelectedId(place.id);
    if (isDesktop()) {
      document.getElementById(`place-${place.id}`)?.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  };

  if (!city) {
    return (
      <EmptyState
        title="Ainda não temos cidades públicas."
        description="Em breve você poderá explorar mapas e pontos de interesse."
        action={(
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Voltar ao início</Link>
          </Button>
        )}
      />
    );
  }

  const SelectedIcon = selected ? CATEGORY_META[selected.category].icon : MapPin;

  let listContent;
  if (!ready) {
    listContent = <p className="text-sm text-muted-foreground">Carregando os pontos…</p>;
  } else if (items === null) {
    listContent = (
      <EmptyState
        title="Não foi possível carregar os pontos."
        description="Atualize a página para tentar de novo."
      />
    );
  } else if (places.length === 0) {
    listContent = <EmptyState title="Ainda não há pontos publicados nesta cidade." />;
  } else if (visible.length === 0) {
    listContent = query.trim()
      ? (
          <EmptyState
            title={`Nenhum resultado para "${query.trim()}".`}
            action={<Button variant="outline" className="rounded-full" onClick={() => changeQuery('')}>Limpar busca</Button>}
          />
        )
      : <EmptyState title={`Ainda não há pontos de ${CATEGORY_META[filter === 'all' ? DEFAULT_FILTER : filter].label} nesta cidade.`} />;
  } else {
    listContent = (
      <>
        <p className="text-sm tabular-nums text-muted-foreground">
          Mostrando
          {' '}
          {shown.length}
          {' '}
          de
          {' '}
          {visible.length}
        </p>
        <ul className="flex flex-col gap-2">
          {shown.map((place) => {
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
                    'flex min-h-[64px] w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-card',
                    isSelected && 'border-primary bg-card ring-1 ring-primary',
                  )}
                >
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', PLACE_TONE[place.category].tile)}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-semibold text-navy">{place.name}</span>
                    <span className="text-sm text-muted-foreground">{meta.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {visible.length > limit && (
          <Button variant="outline" className="h-11 w-full rounded-full" onClick={() => setLimit(value => value + PAGE_SIZE)}>
            Mostrar mais
          </Button>
        )}
      </>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-eyebrow font-semibold uppercase text-primary">Cidade de demonstração</p>
          <h1 className="mt-3 font-display text-[28px] font-bold text-navy md:text-[32px]">
            Explore
            {' '}
            {city.name}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">Escolha um ponto na lista ou no mapa para ver os detalhes.</p>
        </div>
        <div className="flex items-center gap-3 md:w-[320px]">
          <span className="shrink-0 text-sm font-medium text-muted-foreground">Explorar:</span>
          <Select value={city.id} onValueChange={changeCity}>
            <SelectTrigger aria-label="Escolher a cidade" className="h-11 w-full bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cityList.map(item => (
                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div role="group" aria-label="Categorias" className="mt-6 flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
        {PLACE_CATEGORY_ORDER.map(key => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => changeFilter(key)}
            className={cn(CHIP, filter === key ? PLACE_TONE[key].solid : UNSELECTED_CHIP)}
          >
            {filter !== key && <span aria-hidden="true" className={cn('size-2.5 rounded-full', PLACE_TONE[key].dot)} />}
            {CATEGORY_META[key].label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={filter === 'all'}
          onClick={() => changeFilter('all')}
          className={cn(CHIP, filter === 'all' ? 'bg-navy text-background' : UNSELECTED_CHIP)}
        >
          <MapPin aria-hidden="true" className="size-4" />
          Todos
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:h-[calc(100svh-386px)] lg:min-h-[480px] lg:grid-cols-[380px_1fr]">
        <div className="order-2 flex min-h-0 flex-col gap-3 lg:order-none lg:col-start-1 lg:row-start-1 lg:overflow-y-auto lg:pr-1">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Buscar ponto"
              placeholder="Buscar pelo nome ou endereço"
              value={query}
              onChange={event => changeQuery(event.target.value)}
              className="h-11 rounded-full bg-card pl-9"
            />
          </div>
          {listContent}
        </div>

        <div className="relative order-1 flex flex-col gap-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:min-h-0">
          <div className="relative h-[56svh] min-h-[340px] overflow-hidden rounded-2xl border border-border bg-card dark:brightness-[.85] lg:h-full lg:min-h-0">
            {isLoaded
              ? (
                  <GoogleMaps center={center} zoom={12} onLoad={setMap} options={MAP_OPTIONS}>
                    {visible.map(place => (
                      <Marker
                        key={place.id}
                        position={place.position}
                        title={place.name}
                        onClick={() => selectFromPin(place)}
                        icon={placePinIcon(place.category, selected?.id === place.id)}
                      />
                    ))}
                  </GoogleMaps>
                )
              : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                    {loadError ? 'Não foi possível carregar o mapa. Você ainda pode ver os pontos na lista.' : 'Carregando o mapa…'}
                  </div>
                )}
            <p className="absolute left-2 top-2 z-10 rounded-md bg-background/90 px-2 py-1 text-[13px] text-muted-foreground">
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                © OpenStreetMap contributors
              </a>
            </p>
          </div>

          {selected && (
            <div className={cn('rounded-xl border border-border border-l-4 bg-card p-4 lg:absolute lg:bottom-14 lg:left-4 lg:max-h-[calc(100%-5rem)] lg:w-[340px] lg:overflow-y-auto lg:shadow-float', PLACE_TONE[selected.category].accent)}>
              <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <SelectedIcon aria-hidden="true" className="size-4" />
                {CATEGORY_META[selected.category].label}
              </p>
              <h2 aria-live="polite" className="mt-2 text-lg font-semibold text-navy">{selected.name}</h2>
              {selected.address && (
                <p className="mt-2 flex gap-2 text-[15px] text-muted-foreground">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {selected.address}
                </p>
              )}
              {selected.phone && (
                <p className="mt-1 flex gap-2 text-[15px]">
                  <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <a href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`} className="text-primary underline-offset-4 hover:underline">
                    {selected.phone}
                  </a>
                </p>
              )}
              {selected.hours && (
                <p className="mt-1 flex gap-2 text-[15px] text-muted-foreground">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {selected.hours}
                </p>
              )}
              {selected.description && <p className="mt-2 text-[15px] text-muted-foreground">{selected.description}</p>}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-primary underline-offset-4 hover:underline"
              >
                <Navigation aria-hidden="true" className="size-4" />
                Como chegar
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
