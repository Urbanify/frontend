'use client';
import { Edit, Key, MoreHorizontal, Power } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCities.map(city => (
            <TableRow key={city.id}>
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

                    <DropdownMenuItem disabled>
                      <Edit size={16} className="mr-2" />
                      {t('edit')}
                    </DropdownMenuItem>

                    <DropdownMenuItem disabled>
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
          ))}
        </TableBody>
      </Table>
    </>
  );
}
