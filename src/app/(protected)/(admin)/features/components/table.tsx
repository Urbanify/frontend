'use client';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
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

import { unslugify } from '@/utils/slugify';

import { DeleteFeatureDialog } from './delete-dialog';

import type { FeatureFlag } from '@/types/FeatureFlag';

type FeaturesTableProps = {
  features: FeatureFlag[];
};

export function FeaturesTable({ features }: FeaturesTableProps) {
  const t = useTranslations('Features.table');
  const [filter, setFilter] = useState('');
  const [featureToDelete, setFeatureToDelete] = useState<FeatureFlag | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const filteredFeatures = features.filter((feature) => {
    return unslugify(feature.slug).toLowerCase().includes(filter.toLowerCase());
  });

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
            <TableHead className="w-full min-w-24">{t('slug')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFeatures.map(feature => (
            <TableRow key={feature.id}>
              <TableCell className="w-fit min-w-24 max-w-24 truncate font-medium md:max-w-72">{feature.id}</TableCell>
              <TableCell>{unslugify(feature.slug)}</TableCell>
              <TableCell>{feature.slug}</TableCell>
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
                      <Link href={`/features/edit/${feature.id}`}>
                        <Edit size={16} className="mr-2" />
                        {t('edit')}
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {
                      setFeatureToDelete(feature);
                      setOpenDialog(true);
                    }}
                    >
                      <Trash2 size={16} className="mr-2" />
                      {t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteFeatureDialog setOpen={setOpenDialog} open={openDialog} feature={featureToDelete} />
    </>
  );
}
