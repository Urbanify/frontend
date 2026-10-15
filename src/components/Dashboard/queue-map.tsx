'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';

import { Env } from '@/libs/Env';

import { GoogleMaps } from '@/components/google-map/google-map';

import { STATUS_TONE, type Tone, TONE_HEX } from './inicio-utils';

import type { Issue } from '@/types/Issue';

const LEGEND: { tone: Tone; key: 'legend_queue' | 'legend_in_progress' | 'legend_citizen' | 'legend_solved' }[] = [
  { tone: 'neutral', key: 'legend_queue' },
  { tone: 'blue', key: 'legend_in_progress' },
  { tone: 'amber', key: 'legend_citizen' },
  { tone: 'green', key: 'legend_solved' },
];

// Center and zoom come from fitPins. A controlled center would snap back on every re-render.
const MAP_OPTIONS = { clickableIcons: false };

const pinIcon = (color: string) => ({
  url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="7" fill="${color}" stroke="#FFFFFF" stroke-width="3"/></svg>`)}`,
  scaledSize: new google.maps.Size(20, 20),
  anchor: new google.maps.Point(10, 10),
});

// Small city map. Pins take the color of the status tone.
export function QueueMap({ issues }: { issues: Issue[] }) {
  const t = useTranslations('Dashboard.staff.map');
  const { isLoaded } = useLoadScript({
    id: 'google-map-issues',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const pins = useMemo(() => issues.flatMap((issue) => {
    const lat = Number.parseFloat(issue.latitude);
    const lng = Number.parseFloat(issue.longitude);

    return Number.isNaN(lat) || Number.isNaN(lng)
      ? []
      : [{ id: issue.id, color: TONE_HEX[STATUS_TONE[issue.status]], position: { lat, lng } }];
  }), [issues]);

  const fitPins = useCallback((map: google.maps.Map) => {
    if (pins.length === 1) {
      map.setCenter(pins[0]!.position);
      map.setZoom(15);
    } else if (pins.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      pins.forEach(pin => bounds.extend(pin.position));
      map.fitBounds(bounds, 32);
    }
  }, [pins]);

  return (
    <div className="space-y-3">
      <div className="h-60 overflow-hidden rounded-lg border bg-muted">
        {isLoaded && (
          <GoogleMaps onLoad={fitPins} options={MAP_OPTIONS}>
            {pins.map(pin => (
              <Marker key={pin.id} position={pin.position} icon={pinIcon(pin.color)} />
            ))}
          </GoogleMaps>
        )}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-muted-foreground">
        {LEGEND.map(item => (
          <li key={item.key} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: TONE_HEX[item.tone] }} aria-hidden />
            {t(item.key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
