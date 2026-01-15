'use client';
import dayjs from 'dayjs';
import { DoorOpen, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Fragment, useMemo, useState } from 'react';

import { BannerAd } from '@/components/ui/ads/banner';
import { Badge } from '@/components/ui/badge/badge';
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

import IssueStatusBadge from './issue-status-badge';

import type { Issue } from '@/types/Issue';
import { issueCategories } from '@/types/Issue';

type IssuesTableProps = {
  issues: Issue[];
};
const defaultIssues: Issue[] = [];

export function IssuesTable({ issues = defaultIssues }: IssuesTableProps) {
  const { currentAd } = useAd();
  const t = useTranslations('Issues');
  const [filter, setFilter] = useState('');

  const filteredIssues = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) {
      return issues;
    }

    return issues.filter((issue) => {
      const category = t(`types.${issue.category}`).toLowerCase();
      const type = t(`types.${issue.type}`).toLowerCase();
      return issue.id.toLowerCase().includes(term)
        || category.includes(term)
        || type.includes(term);
    });
  }, [filter, issues, t]);

  const getOptionIcon = (value: string) => {
    return issueCategories.find(option => option.value === value)?.icon;
  };
  const getCategoryVariant = (category: Issue['category']) => {
    switch (category) {
      case 'INFRASTRUCTURE':
        return 'warning';
      case 'ENVIRONMENT':
        return 'success';
      case 'TRANSPORTATION':
        return 'info';
      case 'SAFETY':
        return 'danger';
      case 'COMUNITY':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="mt-4 border-border/60">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">{t('table.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('table.subtitle', { count: filteredIssues.length, total: issues.length })}
          </p>
        </div>
        <Input
          placeholder={t('table.filterPlaceholder')}
          value={filter}
          onChange={event => setFilter(event.target.value)}
          className="md:max-w-xs"
        />
      </CardHeader>
      <CardContent className="pt-0">
        {filteredIssues.length === 0
          ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-base font-medium">{t('table.empty_title')}</p>
                <p className="text-sm text-muted-foreground">{t('table.empty_description')}</p>
              </div>
            )
          : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-fit min-w-20 max-w-24 md:max-w-32">{t('table.id')}</TableHead>
                    <TableHead className="w-40">{t('table.category')}</TableHead>
                    <TableHead className="w-fit min-w-64">{t('table.type')}</TableHead>
                    <TableHead className="w-max min-w-24 max-w-32">{t('table.status')}</TableHead>
                    <TableHead className="w-fit min-w-24">{t('table.createdAt')}</TableHead>
                    <TableHead className="w-fit text-right">{t('table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue, index) => (
                    <Fragment key={issue.id}>
                      <TableRow>
                        <TableCell className="w-20 min-w-20 max-w-24 font-medium text-muted-foreground">
                          #
                          {issue.id.slice(0, 6)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryVariant(issue.category)} className="gap-2">
                            {(() => {
                              const Icon = getOptionIcon(issue.category);
                              return Icon ? <Icon className="size-3.5" /> : null;
                            })()}
                            {t(`types.${issue.category}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getCategoryVariant(issue.category)} className="gap-2">
                            {(() => {
                              const Icon = getOptionIcon(issue.type);
                              return Icon ? <Icon className="size-3.5" /> : null;
                            })()}
                            {t(`types.${issue.type}`)}
                          </Badge>
                        </TableCell>
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
  );
}
