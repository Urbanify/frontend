'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';

import CityStatusBadge from './city-status-badge';

import type { City } from '@/types/City';

type CitiesTableProps = {
  cities: City[];
};

export function CitiesTable({ cities }: CitiesTableProps) {
  const t = useTranslations('Cities.table');
  const [filter, setFilter] = useState('');

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        aria-label={t('filterPlaceholder')}
        placeholder={t('filterPlaceholder')}
        value={filter}
        onChange={event => setFilter(event.target.value)}
        className="sm:max-w-sm"
      />

      {filteredCities.length === 0
        ? (
            <div className="flex flex-col items-center gap-1 rounded-xl border bg-card py-12 text-center">
              <p className="font-medium text-navy">{t('empty_title')}</p>
              <p className="text-sm text-muted-foreground">{t('empty_description')}</p>
            </div>
          )
        : (
            <ul className="grid gap-3">
              {filteredCities.map(city => (
                <li key={city.id} className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
                  <div className="flex min-w-0 flex-col items-start gap-2">
                    <p className="truncate font-semibold text-navy">{city.name}</p>
                    <CityStatusBadge status={city.status} />
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" disabled>{t('access')}</Button>
                    <Button variant="outline" asChild>
                      <Link href={`/cities/edit/${city.id}`}>{t('edit')}</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}
