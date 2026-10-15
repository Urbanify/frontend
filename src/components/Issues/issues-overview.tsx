'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Env } from '@/libs/Env';

import { IssueCard } from '@/components/app/issue-card';
import { FILTER_STATUSES, type FilterKey } from '@/components/app/issue-filters';
import { useViewer } from '@/components/app/use-viewer';
import { MapLegend } from '@/components/Dashboard/queue-map';
import { GoogleMaps } from '@/components/google-map/google-map';

import type { Issue, IssueStatus } from '@/types/Issue';

// Pin colors come from the status tones (StatusBadge): neutral, blue, amber or green.
const PIN_COLOR: Record<IssueStatus, string> = {
  WAITING_FOR_FISCAL: '#5B6680',
  WAITING_FOR_PROCEDURE: '#034EFF',
  WAITING_FOR_MANAGER: '#5B6680',
  WAITING_FOR_MANAGER_RESOLUTION: '#034EFF',
  WAITING_FOR_RESOLUTION_VALIDATION: '#9A5B00',
  SOLVED: '#12A26B',
  CLOSED: '#5B6680',
};

const FILTER_KEYS: FilterKey[] = ['all', 'needs_action', 'in_progress', 'resolved'];
const FALLBACK_CENTER = { lat: -23.5505, lng: -46.6333 };
// Hides Google's shops and hotels, which are noise on a city issue map.
const MAP_OPTIONS = { clickableIcons: false, styles: [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }] };

const getPinIcon = (color: string, isActive: boolean) => {
  const size = isActive ? 42 : 34;
  const stroke = isActive ? '#000E2E' : '#FFFFFF';
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

export type IssuesOverviewProps = {
  issues: Issue[];
};

// The city map with status chips on top. Tapping a pin opens a small card that links to the issue.
export function IssuesOverview({ issues }: IssuesOverviewProps) {
  const t = useTranslations('App.IssueList');
  const viewer = useViewer();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { isLoaded } = useLoadScript({
    id: 'google-map-issues',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const pins = useMemo(() => issues.flatMap((issue) => {
    const lat = Number.parseFloat(issue.latitude);
    const lng = Number.parseFloat(issue.longitude);
    return Number.isNaN(lat) || Number.isNaN(lng) ? [] : [{ issue, position: { lat, lng } }];
  }), [issues]);

  // Centers on the city's issues, so the map does not jump when a chip changes.
  const center = useMemo(() => (pins.length === 0
    ? FALLBACK_CENTER
    : {
        lat: pins.reduce((sum, pin) => sum + pin.position.lat, 0) / pins.length,
        lng: pins.reduce((sum, pin) => sum + pin.position.lng, 0) / pins.length,
      }), [pins]);

  const statuses = FILTER_STATUSES[filter];
  const visible = pins.filter(pin => !statuses || statuses.includes(pin.issue.status));
  const selected = visible.find(pin => pin.issue.id === selectedId)?.issue ?? null;

  return (
    <div className="relative h-[calc(100dvh-9rem)] min-h-[420px] overflow-hidden rounded-lg border bg-card md:h-[calc(100dvh-7rem)]">
      {isLoaded && (
        <GoogleMaps
          center={center}
          zoom={13}
          options={MAP_OPTIONS}
          onClick={() => setSelectedId(null)}
        >
          {visible.map(pin => (
            <Marker
              key={pin.issue.id}
              position={pin.position}
              onClick={() => setSelectedId(pin.issue.id)}
              icon={getPinIcon(PIN_COLOR[pin.issue.status], selectedId === pin.issue.id)}
            />
          ))}
        </GoogleMaps>
      )}

      <div role="group" aria-label={t('filters_label')} className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
        {FILTER_KEYS.map(key => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              'min-h-11 rounded-full border px-4 text-sm font-medium shadow-none transition-colors md:min-h-9',
              filter === key
                ? 'border-primary bg-tone-blue-bg text-tone-blue-fg'
                : 'border-input bg-card text-foreground hover:bg-secondary',
            )}
          >
            {t(key)}
          </button>
        ))}
      </div>

      {viewer.audience === 'staff' && (
        <div className="absolute bottom-3 left-3 hidden rounded-md bg-card/90 p-2 shadow-sm md:block">
          <MapLegend />
        </div>
      )}

      {selected && (
        <div className="absolute inset-x-3 bottom-3 md:inset-x-auto md:right-3 md:w-96">
          <IssueCard issue={selected} />
        </div>
      )}
    </div>
  );
}
