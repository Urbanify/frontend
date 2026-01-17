'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import dayjs from 'dayjs';
import { Info, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';
import { Badge, type BadgeVariant } from '@/components/ui/badge/badge';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Switch } from '@/components/ui/switch/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/tooltip';

import type { Issue, IssueCategory } from '@/types/Issue';

type IssueCategoryKey = IssueCategory;

type IssuePin = {
  id: string;
  code: string;
  category: IssueCategoryKey;
  type: Issue['type'];
  position: google.maps.LatLngLiteral;
  createdAt: string;
};

type CategoryMeta = {
  key: IssueCategoryKey;
  color: string;
  badge: BadgeVariant;
};

const CATEGORY_META: Record<IssueCategoryKey, CategoryMeta> = {
  INFRASTRUCTURE: { key: 'INFRASTRUCTURE', color: '#5B8CFF', badge: 'info' },
  ENVIRONMENT: { key: 'ENVIRONMENT', color: '#22C55E', badge: 'success' },
  TRANSPORTATION: { key: 'TRANSPORTATION', color: '#F59E0B', badge: 'warning' },
  SAFETY: { key: 'SAFETY', color: '#EF4444', badge: 'destructive' },
  COMUNITY: { key: 'COMUNITY', color: '#8B5CF6', badge: 'secondary' },
};

const CATEGORY_ORDER: IssueCategoryKey[] = [
  'INFRASTRUCTURE',
  'ENVIRONMENT',
  'TRANSPORTATION',
  'SAFETY',
  'COMUNITY',
];

const buildIssues = (issues: Issue[]): IssuePin[] => (
  issues
    .map((issue) => {
      const lat = Number.parseFloat(issue.latitude);
      const lng = Number.parseFloat(issue.longitude);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
      }

      return {
        id: issue.id,
        code: `IS-${issue.id.slice(0, 4).toUpperCase()}`,
        category: issue.category,
        type: issue.type,
        position: { lat, lng },
        createdAt: issue.createdAt,
      } satisfies IssuePin;
    })
    .filter((issue): issue is IssuePin => Boolean(issue))
);

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

type IssuesOverviewProps = {
  issues: Issue[];
};

export function IssuesOverview({ issues }: IssuesOverviewProps) {
  const t = useTranslations('Issues.OverviewPage');
  const typesT = useTranslations('Issues.types');
  const [enabled, setEnabled] = useState<Record<IssueCategoryKey, boolean>>({
    INFRASTRUCTURE: true,
    ENVIRONMENT: true,
    TRANSPORTATION: true,
    SAFETY: true,
    COMUNITY: true,
  });
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const issuePins = useMemo(() => buildIssues(issues), [issues]);
  const visibleIssues = useMemo(
    () => issuePins.filter(issue => enabled[issue.category]),
    [issuePins, enabled],
  );
  const selectedIssue = visibleIssues.find(issue => issue.id === selectedIssueId)
    ?? visibleIssues[0]
    ?? null;

  const categories = useMemo(() => (
    CATEGORY_ORDER.map((key) => {
      const items = issues.filter(issue => issue.category === key);
      const typeCounts = items.reduce<Record<string, number>>((acc, issue) => {
        acc[issue.type] = (acc[issue.type] ?? 0) + 1;
        return acc;
      }, {});

      return {
        key,
        count: items.length,
        types: Object.entries(typeCounts)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count),
      };
    })
  ), [issues]);

  const { isLoaded } = useLoadScript({
    id: 'google-map-issues',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!mapInstance || !selectedIssue) {
      return;
    }
    mapInstance.panTo(selectedIssue.position);
  }, [mapInstance, selectedIssue]);

  return (
    <TooltipProvider>
      <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">
        <Card className="border-border/60">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg">{t('map_title')}</CardTitle>
              <CardDescription>{t('map_description')}</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <MapPin className="size-3.5" />
              {t('map_badge')}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[460px] w-full overflow-hidden rounded-2xl border border-border/60 bg-background/70 sm:h-[87vh]">
              {isLoaded && (
                <GoogleMaps
                  center={{ lat: -23.5505, lng: -46.6333 }}
                  zoom={13}
                  onLoad={setMapInstance}
                  options={{ clickableIcons: false }}
                >
                  {visibleIssues.map(issue => (
                    <Marker
                      key={issue.id}
                      position={issue.position}
                      onClick={() => setSelectedIssueId(issue.id)}
                      icon={getPinIcon(
                        CATEGORY_META[issue.category].color,
                        selectedIssue?.id === issue.id,
                      )}
                    />
                  ))}
                </GoogleMaps>
              )}
            </div>
            {selectedIssue && (
              <div className="mt-4 rounded-2xl border border-border/60 bg-card/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{selectedIssue.code}</p>
                    <p className="text-xs text-muted-foreground">{t('location_hint')}</p>
                  </div>
                  <Badge
                    variant={CATEGORY_META[selectedIssue.category].badge}
                    className="text-xs"
                  >
                    {typesT(selectedIssue.category)}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-semibold">{typesT(selectedIssue.type)}</span>
                  <span className="ml-2">{dayjs(selectedIssue.createdAt).format('HH:mm')}</span>
                </p>
              </div>
            )}
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
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_META[category.key].color }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{typesT(category.key)}</p>
                      <p className={cn('text-xs', enabled[category.key] ? 'text-muted-foreground' : 'text-muted-foreground/60')}>
                        {category.count}
                      </p>
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
                <Link href="/issues/report">{t('cta_report')}</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {issuePins
                .slice()
                .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
                .slice(0, 3)
                .map(issue => (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => setSelectedIssueId(issue.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-left text-sm transition',
                      selectedIssue?.id === issue.id && 'border-primary/40 bg-card shadow-sm',
                    )}
                  >
                    <div>
                      <p className="font-semibold">{issue.code}</p>
                      <p className="text-xs text-muted-foreground">{t('location_hint')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{dayjs(issue.createdAt).format('HH:mm')}</p>
                      <Badge variant={CATEGORY_META[issue.category].badge} className="text-xs">
                        {typesT(issue.type)}
                      </Badge>
                    </div>
                  </button>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
