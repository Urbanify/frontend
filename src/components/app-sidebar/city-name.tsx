'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { signOut } from '@/lib/session-client';
import { cn } from '@/lib/utils';

import { useViewer } from '@/components/app/use-viewer';

import { api } from '@/services/api';

import type { City } from '@/types/City';

// Module-level cache: the sidebar and the mobile bar show the same city and share one request.
const cityRequests = new Map<string, Promise<City | null>>();

const loadCity = (cityId: string, token: string) => {
  let request = cityRequests.get(cityId);
  if (!request) {
    request = api.instance(`/cities/${cityId}`, { method: 'GET' }, token).then(async (response) => {
      if (response.status === 401) {
        await signOut();
        return null;
      }
      return response.ok ? await response.json() as City : null;
    });
    cityRequests.set(cityId, request);
  }
  return request;
};

export function CityName({ className }: { className?: string }) {
  const t = useTranslations('App.Header');
  const viewer = useViewer();
  const [city, setCity] = useState<City | null>(null);

  useEffect(() => {
    if (!viewer.cityId || !viewer.token) {
      return;
    }
    let active = true;
    loadCity(viewer.cityId, viewer.token).then((value) => {
      if (active) {
        setCity(value);
      }
    });
    return () => {
      active = false;
    };
  }, [viewer.cityId, viewer.token]);

  if (viewer.role === 'ADMIN' && !viewer.cityId) {
    return <span className={cn('truncate', className)}>{t('admin')}</span>;
  }

  if (!city) {
    return <span aria-hidden="true" className={cn('block h-4 w-2/3 animate-pulse rounded-md bg-muted', className)} />;
  }

  return <span className={cn('truncate', className)}>{city.name}</span>;
}
