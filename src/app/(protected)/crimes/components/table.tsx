'use client';

import dayjs from 'dayjs';
import { MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

import type { CrimeReport } from '@/types/Crime';

type CrimesTableProps = {
  crimes: CrimeReport[];
};

export function CrimesTable({ crimes }: CrimesTableProps) {
  const t = useTranslations('Crimes.ListPage');
  const typesT = useTranslations('Crimes.types');
  const [filter, setFilter] = useState('');

  const filtered = crimes.filter(crime =>
    `${crime.type} ${crime.address} ${crime.happenedAt}`
      .toLowerCase()
      .includes(filter.toLowerCase()),
  );

  return (
    <Card className="mt-4 border-border/60">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Input
          placeholder={t('filterPlaceholder')}
          value={filter}
          onChange={event => setFilter(event.target.value)}
          className="md:max-w-xs"
        />
      </CardHeader>
      <CardContent className="pt-0">
        {filtered.length === 0
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
                    <TableHead>{t('table.id')}</TableHead>
                    <TableHead>{t('table.type')}</TableHead>
                    <TableHead>{t('table.location')}</TableHead>
                    <TableHead>{t('table.date')}</TableHead>
                    <TableHead className="text-right">{t('table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(crime => (
                    <TableRow key={crime.id}>
                      <TableCell className="font-medium">
                        #
                        {crime.id.slice(0, 6)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="warning">{typesT(crime.type)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          {crime.address}
                        </div>
                      </TableCell>
                      <TableCell>{dayjs(crime.happenedAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        ...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
      </CardContent>
    </Card>
  );
}
