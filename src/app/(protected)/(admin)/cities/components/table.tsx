'use client';
import { Edit, Key, MoreHorizontal, Power } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';

import { BannerAd } from '@/components/ui/ads/banner';
import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
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
import { api } from '@/services/api';
import { mutate } from '@/utils/revalidateTag';

import CityStatusBadge from './city-status-badge';

import type { City } from '@/types/City';

type CitiesTableProps = {
  cities: City[];
};
export function CitiesTable({ cities }: CitiesTableProps) {
  const { currentAd } = useAd();
  const t = useTranslations('Cities.table');
  const [filter, setFilter] = useState('');

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(filter.toLowerCase()),
  );

  const toggleCityStatus = async (city: City) => {
    try {
      if (city.status === 'ACTIVE') {
        const response = await api.city.deactivate(city.id);

        if (!response.ok) {
          throw new Error(t('status_error'));
        }
      }
      if (city.status === 'DISABLED') {
        const response = await api.city.activate(city.id);

        if (!response.ok) {
          throw new Error(t('status_error'));
        }
      }

      mutate('list-cities');
      toast.success(t('status_success'));
    } catch {
      toast.error(t('status_error'));
    }
  };

  return (
    <>
      <Card className="mt-4 border-border/60">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{t('title')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('subtitle', { count: filteredCities.length, total: cities.length })}
            </p>
          </div>
          <Input
            placeholder={t('filterPlaceholder')}
            value={filter}
            onChange={event => setFilter(event.target.value)}
            className="md:max-w-xs"
          />
        </CardHeader>
        <CardContent className="pt-0">
          {filteredCities.length === 0
            ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                  <p className="text-base font-medium">{t('empty_title')}</p>
                  <p className="text-sm text-muted-foreground">{t('empty_description')}</p>
                </div>
              )
            : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-fit min-w-24 max-w-24 truncate md:max-w-72">{t('id')}</TableHead>
                      <TableHead className="w-1/2">{t('name')}</TableHead>
                      <TableHead className="w-full min-w-24">{t('status')}</TableHead>
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
                        {(index + 1) % 5 === 0
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
              )}
        </CardContent>
      </Card>
    </>
  );
}
