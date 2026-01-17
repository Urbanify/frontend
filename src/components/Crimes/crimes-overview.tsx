'use client';

import { useLoadScript } from '@react-google-maps/api';
import { Info, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { Badge } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Switch } from '@/components/ui/switch/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/tooltip';

type CategoryKey =
  | 'VIOLENCE'
  | 'THEFT'
  | 'VANDALISM'
  | 'FRAUD'
  | 'DRUGS'
  | 'TRAFFIC';

type CategoryMeta = {
  key: CategoryKey;
  color: string;
  count: number;
  gradient: string[];
  types: Array<{ type: string; count: number }>;
  points: Array<google.maps.LatLngLiteral & { weight: number }>;
};

type HeatmapPoint = {
  location: google.maps.LatLng;
  weight: number;
};

export function CrimesOverview() {
  const t = useTranslations('Crimes.OverviewPage');
  const typesT = useTranslations('Crimes.types');
  const [enabled, setEnabled] = useState<Record<CategoryKey, boolean>>({
    VIOLENCE: true,
    THEFT: true,
    VANDALISM: true,
    FRAUD: false,
    DRUGS: true,
    TRAFFIC: true,
  });
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const heatmapLayersRef = useRef<Record<CategoryKey, google.maps.visualization.HeatmapLayer | null>>({
    VIOLENCE: null,
    THEFT: null,
    VANDALISM: null,
    FRAUD: null,
    DRUGS: null,
    TRAFFIC: null,
  });

  const categories = useMemo<CategoryMeta[]>(() => ([
    {
      key: 'VIOLENCE',
      color: '#EF4444',
      count: 28,
      gradient: [
        'rgba(239,68,68,0.05)',
        'rgba(239,68,68,0.35)',
        'rgba(239,68,68,0.6)',
        'rgba(239,68,68,0.9)',
      ],
      types: [
        { type: 'ASSAULT', count: 10 },
        { type: 'ROBBERY', count: 8 },
        { type: 'ARMED_ROBBERY', count: 7 },
        { type: 'THREAT', count: 3 },
      ],
      points: [
        { lat: -23.5489, lng: -46.6388, weight: 6 },
        { lat: -23.5512, lng: -46.6335, weight: 4 },
        { lat: -23.5455, lng: -46.6419, weight: 2 },
      ],
    },
    {
      key: 'THEFT',
      color: '#F97316',
      count: 21,
      gradient: [
        'rgba(249,115,22,0.05)',
        'rgba(249,115,22,0.35)',
        'rgba(249,115,22,0.6)',
        'rgba(249,115,22,0.9)',
      ],
      types: [
        { type: 'BURGLARY', count: 9 },
        { type: 'VEHICLE_THEFT', count: 7 },
        { type: 'PICKPOCKET', count: 5 },
      ],
      points: [
        { lat: -23.5592, lng: -46.6585, weight: 5 },
        { lat: -23.5561, lng: -46.6474, weight: 3 },
        { lat: -23.5524, lng: -46.6519, weight: 4 },
      ],
    },
    {
      key: 'VANDALISM',
      color: '#8B5CF6',
      count: 15,
      gradient: [
        'rgba(139,92,246,0.05)',
        'rgba(139,92,246,0.35)',
        'rgba(139,92,246,0.6)',
        'rgba(139,92,246,0.9)',
      ],
      types: [
        { type: 'VANDALISM_PROPERTY', count: 6 },
        { type: 'GRAFFITI', count: 5 },
        { type: 'PUBLIC_DAMAGE', count: 4 },
      ],
      points: [
        { lat: -23.5423, lng: -46.6299, weight: 5 },
        { lat: -23.5402, lng: -46.6381, weight: 3 },
        { lat: -23.5468, lng: -46.6343, weight: 2 },
      ],
    },
    {
      key: 'FRAUD',
      color: '#64748B',
      count: 9,
      gradient: [
        'rgba(100,116,139,0.05)',
        'rgba(100,116,139,0.35)',
        'rgba(100,116,139,0.6)',
        'rgba(100,116,139,0.9)',
      ],
      types: [
        { type: 'SCAM', count: 4 },
        { type: 'DOCUMENT_FRAUD', count: 3 },
        { type: 'CARD_FRAUD', count: 2 },
      ],
      points: [
        { lat: -23.5615, lng: -46.6427, weight: 4 },
        { lat: -23.5579, lng: -46.6395, weight: 2 },
      ],
    },
    {
      key: 'DRUGS',
      color: '#10B981',
      count: 13,
      gradient: [
        'rgba(16,185,129,0.05)',
        'rgba(16,185,129,0.35)',
        'rgba(16,185,129,0.6)',
        'rgba(16,185,129,0.9)',
      ],
      types: [
        { type: 'DRUG_TRAFFICKING', count: 8 },
        { type: 'DRUG_USE', count: 5 },
      ],
      points: [
        { lat: -23.5341, lng: -46.6282, weight: 5 },
        { lat: -23.5318, lng: -46.6349, weight: 3 },
        { lat: -23.5372, lng: -46.6265, weight: 2 },
      ],
    },
    {
      key: 'TRAFFIC',
      color: '#FACC15',
      count: 11,
      gradient: [
        'rgba(250,204,21,0.05)',
        'rgba(250,204,21,0.35)',
        'rgba(250,204,21,0.6)',
        'rgba(250,204,21,0.9)',
      ],
      types: [
        { type: 'TRAFFIC_ACCIDENT', count: 5 },
        { type: 'DUI', count: 4 },
        { type: 'DANGEROUS_DRIVING', count: 2 },
      ],
      points: [
        { lat: -23.5631, lng: -46.6572, weight: 4 },
        { lat: -23.5674, lng: -46.6511, weight: 2 },
      ],
    },
  ]), []);

  const { isLoaded } = useLoadScript({
    id: 'google-map-heatmap',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['visualization'],
  });

  const heatmapData = useMemo<Record<CategoryKey, HeatmapPoint[]> | null>(() => {
    if (!isLoaded) {
      return null;
    }

    const toHeatmap = (points: CategoryMeta['points']) => points.map(point => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      weight: point.weight,
    }));

    const record = categories.reduce((acc, category) => {
      acc[category.key] = toHeatmap(category.points);
      return acc;
    }, {} as Record<CategoryKey, HeatmapPoint[]>);

    return record;
  }, [categories, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapInstance || !heatmapData) {
      return;
    }

    categories.forEach((category) => {
      const existingLayer = heatmapLayersRef.current[category.key];
      if (!existingLayer) {
        const layer = new google.maps.visualization.HeatmapLayer({
          data: heatmapData[category.key],
          gradient: category.gradient,
          radius: 28,
          opacity: 0.82,
          maxIntensity: 10,
          map: enabled[category.key] ? mapInstance : null,
        });
        heatmapLayersRef.current[category.key] = layer;
        return;
      }

      existingLayer.setData(heatmapData[category.key]);
      existingLayer.setOptions({
        gradient: category.gradient,
        radius: 28,
        opacity: 0.82,
        maxIntensity: 10,
      });
      existingLayer.setMap(enabled[category.key] ? mapInstance : null);
    });
  }, [categories, enabled, heatmapData, isLoaded, mapInstance]);

  useEffect(() =>
    () => {
      Object.values(heatmapLayersRef.current).forEach((layer) => {
        layer?.setMap(null);
      });
    }, []);

  return (
    <TooltipProvider>
      <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">
        <Card className="border-border/60">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">{t('heatmap_title')}</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <MapPin className="size-3.5" />
              {t('description')}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[460px] w-full overflow-hidden rounded-2xl border border-border/60 bg-background/70 sm:h-[87vh]">
              {isLoaded && (
                <GoogleMaps
                  center={{ lat: -23.5505, lng: -46.6333 }}
                  zoom={13}
                  onLoad={setMapInstance}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/60">
            <CardHeader className="space-y-2">
              <CardTitle className="text-lg">{t('type_breakdown_title')}</CardTitle>
              <CardDescription>{t('type_breakdown_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map(category => (
                <div key={category.key} className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                    <div>
                      <p className="text-sm font-semibold">{typesT(category.key)}</p>
                      <p className="text-xs text-muted-foreground">{category.count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="rounded-full border border-border/60 p-1 text-muted-foreground hover:text-foreground">
                          <Info className="size-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="w-56">
                        <div className="space-y-2 text-xs">
                          <p className="text-sm font-semibold">{typesT(category.key)}</p>
                          {category.types.map(item => (
                            <div key={item.type} className="flex items-center justify-between">
                              <span>{typesT(item.type as any)}</span>
                              <span className="font-semibold">{item.count}</span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      checked={enabled[category.key]}
                      onCheckedChange={() => setEnabled(prev => ({
                        ...prev,
                        [category.key]: !prev[category.key],
                      }))}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg">{t('recent_title')}</CardTitle>
              <Button asChild size="sm">
                <Link href="/crimes/report">{t('cta_report')}</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">CR-1023</p>
                  <p className="text-xs text-muted-foreground">Av. Central</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">14:20</p>
                  <Badge variant="secondary">{typesT('ROBBERY')}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">CR-1024</p>
                  <p className="text-xs text-muted-foreground">Praça Norte</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">15:05</p>
                  <Badge variant="secondary">{typesT('ASSAULT')}</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm">
                <div>
                  <p className="font-semibold">CR-1025</p>
                  <p className="text-xs text-muted-foreground">Rua 12</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">16:40</p>
                  <Badge variant="secondary">{typesT('TRAFFIC_ACCIDENT')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
