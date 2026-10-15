'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input/input';

import { EmptyState } from './empty-state';
import { IssueCard } from './issue-card';

import type { Issue, IssueStatus } from '@/types/Issue';

type FilterKey = 'all' | 'in_progress' | 'needs_action' | 'resolved';

const FILTER_STATUSES: Record<FilterKey, IssueStatus[] | null> = {
  all: null,
  in_progress: ['WAITING_FOR_FISCAL', 'WAITING_FOR_PROCEDURE', 'WAITING_FOR_MANAGER', 'WAITING_FOR_MANAGER_RESOLUTION'],
  needs_action: ['WAITING_FOR_RESOLUTION_VALIDATION'],
  resolved: ['SOLVED', 'CLOSED'],
};

const FILTER_KEYS = Object.keys(FILTER_STATUSES) as FilterKey[];

export type IssueListProps = {
  issues: Issue[];
  /** Optional action per card, for example "Assumir chamado". */
  renderAction?: (issue: Issue) => ReactNode;
  /** Shown when the list has no issues at all. Defaults to a plain sentence. */
  emptyState?: ReactNode;
};

export function IssueList({ issues, renderAction, emptyState }: IssueListProps) {
  const t = useTranslations('App.IssueList');
  const tTypes = useTranslations('Issues.types');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');

  const visible = useMemo(() => {
    const statuses = FILTER_STATUSES[filter];
    const term = query.trim().toLowerCase().replace(/^#/, '');

    return issues.filter((issue) => {
      if (statuses && !statuses.includes(issue.status)) {
        return false;
      }
      if (!term) {
        return true;
      }

      return tTypes(issue.type).toLowerCase().includes(term)
        || tTypes(issue.category).toLowerCase().includes(term)
        || issue.id.slice(0, 6).toLowerCase().includes(term);
    });
  }, [issues, query, filter, tTypes]);

  if (issues.length === 0) {
    return emptyState ?? <EmptyState title={t('empty')} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            aria-label={t('search_label')}
            placeholder={t('search_placeholder')}
            value={query}
            onChange={event => setQuery(event.target.value)}
            className="pl-9"
          />
        </div>

        <div role="group" aria-label={t('filters_label')} className="flex flex-wrap gap-2">
          {FILTER_KEYS.map(key => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                'min-h-11 rounded-full border px-4 text-sm font-medium transition-colors md:min-h-9',
                filter === key
                  ? 'border-primary bg-tone-blue-bg text-tone-blue-fg'
                  : 'border-input bg-card text-foreground hover:bg-secondary',
              )}
            >
              {t(key)}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0
        ? <p role="status" className="py-8 text-center text-sm text-muted-foreground">{t('empty_filtered')}</p>
        : (
            <ul className="grid gap-3">
              {visible.map(issue => (
                <li key={issue.id}>
                  <IssueCard issue={issue} action={renderAction?.(issue)} />
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}
