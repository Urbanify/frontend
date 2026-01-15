'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import type { Landmark } from 'lucide-react';
import { Building2, Hospital, Mountain, Route, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { Badge, type BadgeVariant } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Combobox, type ComboboxOptions } from '@/components/ui/combobox/combobox';
import { Label } from '@/components/ui/label/label';
import { Switch } from '@/components/ui/switch/switch';

import { BRAZIL_POSITION } from '@/constants/BRAZIL_POSITION';

import type { City } from '@/types/City';

type PinCategory = 'tourism' | 'ubs' | 'hospital' | 'works' | 'services';

type TouristPin = {
  id: string;
  name: string;
  description: string;
  category: PinCategory;
  position: google.maps.LatLngLiteral;
};

type TouristCityVisitExplorerProps = {
  cities: City[];
  initialCityId?: string;
};

const CATEGORY_META: Record<
  PinCategory,
  {
    label: string;
    icon: typeof Landmark;
    badge: BadgeVariant;
    pinColor: string;
  }
> = {
  tourism: { label: 'Turismo', icon: Mountain, badge: 'info', pinColor: '#7C5CFA' },
  ubs: { label: 'UBSs', icon: Hospital, badge: 'success', pinColor: '#4CC9A7' },
  hospital: { label: 'Hospitais', icon: Building2, badge: 'secondary', pinColor: '#5B8CFF' },
  works: { label: 'Obras', icon: Route, badge: 'warning', pinColor: '#F2C94C' },
  services: { label: 'Servicos', icon: Search, badge: 'outline', pinColor: '#9CA3AF' },
};

// TODO: Replace with real data fetching
const buildPins = (city?: City): TouristPin[] => {
  if (!city) {
    return [];
  }

  const baseLat = Number.parseFloat(city.latitude) || BRAZIL_POSITION.lat;
  const baseLng = Number.parseFloat(city.longitude) || BRAZIL_POSITION.lng;

  const offsets = [
    { lat: 0.006, lng: 0.004 },
    { lat: -0.004, lng: 0.005 },
    { lat: 0.003, lng: -0.006 },
    { lat: -0.006, lng: -0.003 },
    { lat: 0.008, lng: -0.002 },
  ];

  return [
    {
      id: 'tourism-1',
      name: 'Centro Historico',
      description: 'Ponto de encontro para passeios culturais e gastronomia.',
      category: 'tourism',
      position: { lat: baseLat + offsets[0]!.lat, lng: baseLng + offsets[0]!.lng },
    },
    {
      id: 'tourism-2',
      name: 'Mirante da Cidade',
      description: 'Vista panoramica com acesso publico.',
      category: 'tourism',
      position: { lat: baseLat + offsets[1]!.lat, lng: baseLng + offsets[1]!.lng },
    },
    {
      id: 'ubs-1',
      name: 'UBS Central',
      description: 'Atendimento basico com triagem rapida.',
      category: 'ubs',
      position: { lat: baseLat + offsets[2]!.lat, lng: baseLng + offsets[2]!.lng },
    },
    {
      id: 'hospital-1',
      name: 'Hospital Municipal',
      description: 'Emergencia 24h e pronto atendimento.',
      category: 'hospital',
      position: { lat: baseLat + offsets[3]!.lat, lng: baseLng + offsets[3]!.lng },
    },
    {
      id: 'works-1',
      name: 'Obra em andamento',
      description: 'Requalificacao de via principal.',
      category: 'works',
      position: { lat: baseLat + offsets[4]!.lat, lng: baseLng + offsets[4]!.lng },
    },
    {
      id: 'services-1',
      name: 'Servico de coleta',
      description: 'Rota de coleta programada para quarta.',
      category: 'services',
      position: { lat: baseLat - 0.0025, lng: baseLng + 0.006 },
    },
  ];
};

const getPinIcon = (color: string, isActive: boolean) => {
  const size = isActive ? 42 : 34;
  const stroke = isActive ? '#1F2937' : '#FFFFFF';
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.37 11.48 7.3 12.36.4.38 1.01.38 1.4 0C13.63 21.48 20 15.25 20 10c0-4.42-3.58-8-8-8Z" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>
      <circle cx="12" cy="10" r="3.5" fill="#FFFFFF"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;utf-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size - 2),
  };
};

export function TouristCityVisitExplorer({ cities, initialCityId }: TouristCityVisitExplorerProps) {
  const cityOptions: ComboboxOptions = useMemo(() => cities.map(city => ({
    value: city.id,
    label: city.name,
  })), [cities]);

  const [selectedCityId, setSelectedCityId] = useState(() => {
    if (initialCityId && cities.some(city => city.id === initialCityId)) {
      return initialCityId;
    }
    return cities[0]?.id ?? '';
  });
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<PinCategory, boolean>>({
    tourism: true,
    ubs: true,
    hospital: true,
    works: true,
    services: false,
  });

  const selectedCity = cities.find(city => city.id === selectedCityId) ?? cities[0];
  const pins = useMemo(() => buildPins(selectedCity), [selectedCity]);

  const visiblePins = useMemo(
    () => pins.filter(pin => filters[pin.category]),
    [pins, filters],
  );

  const selectedPin = visiblePins.find(pin => pin.id === selectedPinId)
    ?? visiblePins[0]
    ?? null;

  const center = useMemo(() => ({
    lat: Number.parseFloat(selectedCity?.latitude ?? '') || BRAZIL_POSITION.lat,
    lng: Number.parseFloat(selectedCity?.longitude ?? '') || BRAZIL_POSITION.lng,
  }), [selectedCity]);

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!selectedCityId) {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('city', selectedCityId);
    window.history.replaceState({}, '', url.toString());
  }, [selectedCityId]);

  useEffect(() => {
    setSelectedPinId(null);
  }, [selectedCityId]);

  const handleToggleFilter = (category: PinCategory) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="order-2 space-y-6 lg:order-1">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <Search className="size-3.5" />
            Visitante
          </span>
          <h1 className="mt-3 text-3xl font-semibold">Explore a cidade sem precisar de login</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Escolha uma cidade e visualize pontos turisticos, UBSs, hospitais e obras.
            Filtre os pinos no mapa para planejar sua visita com rapidez.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm sm:p-5">
          <Label className="text-xs text-muted-foreground">Cidade</Label>
          <div className="mt-2">
            <Combobox
              options={cityOptions}
              placeholder="Escolha a cidade"
              value={selectedCityId}
              setValue={setSelectedCityId}
              shouldTranslate={false}
              popoverClassName="w-[260px]"
            />
          </div>
          <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-xs text-muted-foreground">Filtros ativos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(CATEGORY_META)
                .filter(([key]) => filters[key as PinCategory])
                .map(([key, meta]) => (
                  <Badge key={key} variant={meta.badge}>
                    <meta.icon className="mr-1.5 size-3.5" />
                    {meta.label}
                  </Badge>
                ))}
              {Object.values(filters).every(value => !value) && (
                <span className="text-xs text-muted-foreground">
                  Nenhum filtro ativo
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {(Object.entries(CATEGORY_META) as Array<[PinCategory, typeof CATEGORY_META.tourism]>).map(([key, meta]) => (
              <div key={key} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center gap-3">
                  <div className={cn('flex size-9 items-center justify-center rounded-full border border-border/60 bg-card/90')}>
                    <meta.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{meta.label}</p>
                    <p className="text-xs text-muted-foreground">Mostrar no mapa</p>
                  </div>
                </div>
                <Switch checked={filters[key]} onCheckedChange={() => handleToggleFilter(key)} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Detalhes do ponto</p>
            {selectedPin && (
              <Badge variant={CATEGORY_META[selectedPin.category].badge}>
                {CATEGORY_META[selectedPin.category].label}
              </Badge>
            )}
          </div>
          {selectedPin
            ? (
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold">{selectedPin.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPin.description}</p>
                </div>
              )
            : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Ative pelo menos um filtro para visualizar pontos no mapa.
                </p>
              )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link href="/login">Acessar painel completo</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">Voltar para a landing</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="order-1 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-2xl lg:order-2">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-semibold">Mapa da cidade</p>
            <p className="text-xs text-muted-foreground">Clique nos pinos para detalhes</p>
          </div>
          {selectedCity && (
            <Badge variant="secondary">{selectedCity.name}</Badge>
          )}
        </div>
        <div className="mt-4 h-[520px] overflow-hidden rounded-2xl border border-border/60 bg-background/60 sm:h-[560px] lg:h-[520px]">
          {isLoaded && selectedCity
            ? (
                <GoogleMaps center={center} zoom={13}>
                  {visiblePins.map(pin => (
                    <Marker
                      key={pin.id}
                      position={pin.position}
                      onClick={() => setSelectedPinId(pin.id)}
                      icon={getPinIcon(
                        CATEGORY_META[pin.category].pinColor,
                        selectedPin?.id === pin.id,
                      )}
                    />
                  ))}
                </GoogleMaps>
              )
            : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Carregando mapa...
                </div>
              )}
        </div>
        <div className="mt-4 space-y-2">
          {visiblePins.map(pin => (
            <button
              key={pin.id}
              type="button"
              onClick={() => setSelectedPinId(pin.id)}
              className={cn(
                'w-full rounded-2xl border border-border/60 bg-background/70 p-4 text-left transition hover:bg-card',
                selectedPin?.id === pin.id && 'border-primary/40 bg-card shadow-sm',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{pin.name}</span>
                <Badge variant={CATEGORY_META[pin.category].badge}>
                  {CATEGORY_META[pin.category].label}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{pin.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
