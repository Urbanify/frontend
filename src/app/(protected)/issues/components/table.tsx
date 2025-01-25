'use client';
import dayjs from 'dayjs';
import { DoorOpen, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { BannerAd } from '@/components/ui/ads/banner';
import { Button } from '@/components/ui/button/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table/table';

import { useAd } from '@/contexts/ads/useAd';

import IssueStatusBadge from './issue-status-badge';

import type { Issue } from '@/types/Issue';

type IssuesTableProps = {
  issues: Issue[];
};
const defaultIssues: Issue[] = [];

export function IssuesTable({ issues = defaultIssues }: IssuesTableProps) {
  const { currentAd } = useAd();
  const t = useTranslations('Issues');
  // const [filter, setFilter] = useState('');

  // const filteredIssues = issues.filter((issue) => {
  //   return unslugify(issue.).toLowerCase().includes(filter.toLowerCase());
  // },
  // );
  return (
    <>
      {/* <Input
        placeholder={t('table.filterPlaceholder')}
        value={filter}
        onChange={event => setFilter(event.target.value)}
        className="max-w-sm"
      /> */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit min-w-24 max-w-24 truncate md:max-w-72">{t('table.id')}</TableHead>
            <TableHead className="w-fit">{t('table.category')}</TableHead>
            <TableHead className="w-fit min-w-44">{t('table.type')}</TableHead>
            <TableHead className="w-fit min-w-24">{t('table.status')}</TableHead>
            <TableHead className="w-fit min-w-24">{t('table.createdAt')}</TableHead>
            <TableHead className="w-fit text-right">{t('table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issues.map((issue, index) => (
            <Fragment key={issue.id}>
              <TableRow>
                <TableCell className="w-fit min-w-24 max-w-24 truncate font-medium md:max-w-72">{issue.id}</TableCell>
                <TableCell>{t(`types.${issue.category}`)}</TableCell>
                <TableCell>{t(`types.${issue.type}`)}</TableCell>
                <TableCell className="text-center"><IssueStatusBadge status={issue.status} /></TableCell>
                <TableCell className="text-center">{dayjs(issue.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>

                      <DropdownMenuItem asChild>
                        <Link href={`/issues/view/${issue.id}`} className="cursor-pointer">
                          <DoorOpen size={16} className="mr-2" />
                          {t('table.access')}
                        </Link>
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
