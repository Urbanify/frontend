'use client';
import { Edit, Key, MoreHorizontal, Power } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';

import { BannerAd } from '@/components/ui/ads/banner';
import { Button } from '@/components/ui/button/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu/dropdown-menu';
import { Input } from '@/components/ui/input/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

import { useAd } from '@/contexts/ads/useAd';
import { fetcher } from '@/services/api';
import { customRevalidateTag } from '@/utils/revalidateTag';

import CityStatusBadge from './city-status-badge';

import type { City } from '@/types/City';

type CitiesTableProps = {
  cities: City[];
};
export function CitiesTable({ cities }: CitiesTableProps) {
  const { data } = useSession();
  const { currentAd } = useAd();
  const t = useTranslations('Cities.table');
  const [filter, setFilter] = useState('');

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const toggleCityStatus = async (city: City) => {
    try {
      if (city.status === 'ACTIVE') {
        const response = await fetcher(`/cities/${city.id}/deactivate`, {
          method: 'POST',
        }, data?.access_token);

        if (!response.ok) {
          throw new Error(t('status_error'));
        }
      }
      if (city.status === 'DISABLED') {
        const response = await fetcher(`/cities/${city.id}/activate`, {
          method: 'POST',
        }, data?.access_token);

        if (!response.ok) {
          throw new Error(t('status_error'));
        }
      }

      customRevalidateTag('list-cities');
      toast.success(t('status_success'));
    } catch {
      toast.error(t('status_error'));
    }
  };

  return (
    <>
      <Input
        placeholder={t('filterPlaceholder')}
        value={filter}
        onChange={event => setFilter(event.target.value)}
        className="max-w-sm"
      />
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit min-w-24 max-w-24 truncate md:max-w-72">{t('id')}</TableHead>
            <TableHead className="w-1/2">{t('name')}</TableHead>
            <TableHead className="w-full min-w-24">{t('status')}</TableHead>
            <TableHead className="w-full min-w-24">FFs</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCities.map((city, index) => (
            <Fragment key={city.id}>
              <TableRow>
                <TableCell className="w-fit min-w-24 max-w-24 truncate font-medium md:max-w-72">{city.id}</TableCell>
                <TableCell>{city.name}</TableCell>
                <TableCell><CityStatusBadge status={city.status} /></TableCell>
                <TableCell>
                  {city.featureFlags.filter(ff => ff.status).length}
                  /
                  {city.featureFlags.length}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>

                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/cities/edit/${city.id}`}>
                          <Edit size={16} className="mr-2" />
                          {t('edit')}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => toggleCityStatus(city)}>
                        <Power size={16} className="mr-2" />
                        {t(city.status === 'ACTIVE' ? 'deactivate' : 'activate')}
                      </DropdownMenuItem>

                      <DropdownMenuItem disabled>
                        <Key size={16} className="mr-2" />
                        {t('access')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              {(index + 1) % 3 === 0
              && (
                <TableRow className="flex justify-center py-4">
                  <TableCell>
                    <BannerAd
                      href={currentAd?.banner?.href ?? ''}
                      desktopMedia={currentAd?.banner?.desktop ?? ''}
                      mobileMedia={currentAd?.banner?.mobile ?? ''}
                    />
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
