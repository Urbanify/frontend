'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';

import { EmptyState } from '@/components/app/empty-state';
import { DATE_ORDER, dateBucket, groupItems, WAIT_ORDER, waitBucket } from '@/components/app/group-items';
import { GroupedList } from '@/components/app/grouped-list';
import { IssueCard } from '@/components/app/issue-card';
import { FILTER_STATUSES } from '@/components/app/issue-filters';
import { IssuePhotoCard } from '@/components/app/issue-photo-card';
import { PageHeader } from '@/components/app/page-header';
import { Tabs } from '@/components/app/tabs';
import { useViewer } from '@/components/app/use-viewer';
import { IssuesOverview } from '@/components/Issues/issues-overview';
import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';

import type { Issue, IssueStatus } from '@/types/Issue';

const DONE_STATUSES: IssueStatus[] = ['SOLVED', 'CLOSED'];
type ListTab = 'needs_action' | 'in_progress' | 'resolved';
const byUpdatedDesc = (a: Issue, b: Issue) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt);

// Takes the issue for the viewer, then opens it. The API decides who may take it.
function TakeIssueButton({ issueId, label }: { issueId: string; label: string }) {
  const t = useTranslations('Issues.ListPage');
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const take = async () => {
    setPending(true);
    const ok = await api.issues.assignMe(issueId).then(response => response.ok).catch(() => false);

    if (ok) {
      router.push(`/issues/view/${issueId}`);
      return;
    }
    toast.error(t('take_error'));
    setPending(false);
  };

  return (
    <Button type="button" variant="outline" disabled={pending} onClick={take}>
      {label}
    </Button>
  );
}

// Citizens see "Eu verifico" on unassigned issues they did not report. Staff browse without actions.
export function CityIssues({ issues }: { issues: Issue[] }) {
  const t = useTranslations('Issues.ListPage');
  const tLists = useTranslations('App.Lists');
  const viewer = useViewer();
  const [tab, setTab] = useState<ListTab>('needs_action');
  const [view, setView] = useState<'list' | 'map'>('list');

  if (!viewer.role) {
    return null;
  }

  const citizen = viewer.audience === 'citizen';
  const tabs: { value: ListTab; label: string; count: number }[] = [
    { value: 'needs_action', label: tLists('tab_needs_action'), count: issues.filter(issue => FILTER_STATUSES.needs_action?.includes(issue.status)).length },
    { value: 'in_progress', label: tLists('tab_in_progress'), count: issues.filter(issue => FILTER_STATUSES.in_progress?.includes(issue.status)).length },
    { value: 'resolved', label: tLists('tab_resolved'), count: issues.filter(issue => FILTER_STATUSES.resolved?.includes(issue.status)).length },
  ];
  const emptyText: Record<ListTab, string> = {
    needs_action: t('empty_needs_action'),
    in_progress: t('empty_in_progress'),
    resolved: t('empty_resolved'),
  };

  const visible = issues
    .filter(issue => FILTER_STATUSES[tab]?.includes(issue.status))
    .sort(byUpdatedDesc);
  const dateLabels: Record<string, string> = {
    today: tLists('group_today'),
    yesterday: tLists('group_yesterday'),
    this_week: tLists('group_this_week'),
    older: tLists('group_older'),
  };
  const groups = groupItems(visible, issue => dateBucket(issue.createdAt), DATE_ORDER)
    .map(group => ({ ...group, label: dateLabels[group.key] }));

  const canVerify = (issue: Issue) => citizen
    && issue.status === 'WAITING_FOR_FISCAL'
    && !issue.fiscalId
    && issue.reporterId !== viewer.id;

  return (
    <div className="space-y-6">
      <PageHeader
        title={citizen ? t('title_citizen') : t('title_staff')}
        action={citizen
          ? (
              <Tabs
                options={[{ value: 'list', label: tLists('view_list') }, { value: 'map', label: tLists('view_map') }]}
                value={view}
                onChange={setView}
              />
            )
          : undefined}
      />

      {view === 'map'
        ? <IssuesOverview issues={issues} />
        : (
            <>
              <Tabs options={tabs} value={tab} onChange={setTab} />
              {groups.length === 0
                ? <EmptyState title={emptyText[tab]} />
                : (
                    <GroupedList
                      groups={groups}
                      getKey={issue => issue.id}
                      renderItem={issue => (
                        <IssueCard
                          issue={issue}
                          action={canVerify(issue) ? <TakeIssueButton issueId={issue.id} label={t('verify_action')} /> : undefined}
                        />
                      )}
                    />
                  )}
            </>
          )}
    </div>
  );
}

// Manager's work queue: oldest first, grouped by how long each issue has been waiting.
export function QueueIssues({ issues }: { issues: Issue[] }) {
  const t = useTranslations('Issues.OpenIssuesPage');
  const tLists = useTranslations('App.Lists');
  const viewer = useViewer();

  if (!viewer.role) {
    return null;
  }

  // Only managers take queue issues. The API refuses the Responsável, so the button is hidden for them.
  const canTake = viewer.role === 'MANAGER';
  const oldestFirst = [...issues].sort((a, b) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt));
  const waitLabels: Record<string, string> = {
    'over_7': tLists('wait_over_7'),
    '3_to_7': tLists('wait_3_to_7'),
    'recent': tLists('wait_recent'),
  };
  const groups = groupItems(oldestFirst, issue => waitBucket(issue.updatedAt), WAIT_ORDER)
    .map(group => ({ ...group, label: waitLabels[group.key] }));

  return (
    <div className="space-y-6">
      <PageHeader title={t('title')} description={t('description')} />
      {groups.length === 0
        ? <EmptyState title={t('empty_title')} description={t('empty_description')} />
        : (
            <GroupedList
              groups={groups}
              getKey={issue => issue.id}
              renderItem={issue => (
                <IssueCard
                  issue={issue}
                  waiting
                  action={canTake ? <TakeIssueButton issueId={issue.id} label={t('take_action')} /> : undefined}
                />
              )}
            />
          )}
    </div>
  );
}

// Photo grid with two tabs. `by` keeps only the issues where the viewer is that person (fiscal).
export function PhotoTabs({ issues, by, emptyState, emptyTab }: {
  issues: Issue[];
  by?: 'fiscalId';
  emptyState: ReactNode;
  emptyTab: { in_progress: string; done: string };
}) {
  const tLists = useTranslations('App.Lists');
  const viewer = useViewer();
  const [tab, setTab] = useState<'in_progress' | 'done'>('in_progress');

  if (!viewer.id && by) {
    return null;
  }

  const mine = by ? issues.filter(issue => issue[by] === viewer.id) : issues;
  if (mine.length === 0) {
    return <>{emptyState}</>;
  }

  // Issues waiting for the viewer's confirmation come first.
  const inProgress = mine
    .filter(issue => !DONE_STATUSES.includes(issue.status))
    .sort((a, b) => Number(b.status === 'WAITING_FOR_RESOLUTION_VALIDATION') - Number(a.status === 'WAITING_FOR_RESOLUTION_VALIDATION') || byUpdatedDesc(a, b));
  const done = mine.filter(issue => DONE_STATUSES.includes(issue.status)).sort(byUpdatedDesc);
  const visible = tab === 'done' ? done : inProgress;

  return (
    <div className="space-y-6">
      <Tabs
        options={[
          { value: 'in_progress', label: tLists('tab_in_progress'), count: inProgress.length },
          { value: 'done', label: tLists('tab_done'), count: done.length },
        ]}
        value={tab}
        onChange={setTab}
      />
      {visible.length === 0
        ? <EmptyState title={emptyTab[tab]} />
        : (
            <GroupedList
              groups={[{ key: tab, items: visible }]}
              getKey={issue => issue.id}
              renderItem={issue => <IssuePhotoCard issue={issue} />}
              listClassName="grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          )}
    </div>
  );
}

// Manager's board: two columns on desktop, two tabs on mobile.
export function AssignedBoard({ issues }: { issues: Issue[] }) {
  const t = useTranslations('Issues.AssignedPage');
  const viewer = useViewer();
  const [column, setColumn] = useState<'in_progress' | 'waiting'>('in_progress');

  if (!viewer.id) {
    return null;
  }

  const mine = issues.filter(issue => issue.managerId === viewer.id);
  if (mine.length === 0) {
    return (
      <EmptyState
        title={t('empty_title')}
        description={t('empty_description')}
        action={(
          <Button variant="outline" asChild>
            <Link href="/issues/open">{t('empty_action')}</Link>
          </Button>
        )}
      />
    );
  }

  const inProgressColumn = {
    key: 'in_progress' as const,
    title: t('column_in_progress'),
    empty: t('empty_column_in_progress'),
    items: mine.filter(issue => issue.status === 'WAITING_FOR_MANAGER_RESOLUTION').sort(byUpdatedDesc),
  };
  const waitingColumn = {
    key: 'waiting' as const,
    title: t('column_waiting_citizen'),
    empty: t('empty_column_waiting'),
    items: mine.filter(issue => issue.status === 'WAITING_FOR_RESOLUTION_VALIDATION').sort(byUpdatedDesc),
  };
  const columns = [inProgressColumn, waitingColumn];

  const renderColumn = (col: { key: string; title: string; empty: string; items: Issue[] }) => (
    <section key={col.key} className="space-y-3">
      <h2 className="flex items-center justify-between font-semibold text-navy">
        {col.title}
        <span className="tabular-nums text-muted-foreground">{col.items.length}</span>
      </h2>
      {col.items.length === 0
        ? <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">{col.empty}</p>
        : (
            <GroupedList
              groups={[{ key: col.key, items: col.items }]}
              getKey={issue => issue.id}
              renderItem={issue => <IssueCard issue={issue} />}
            />
          )}
    </section>
  );

  const current = column === 'waiting' ? waitingColumn : inProgressColumn;

  return (
    <>
      <div className="space-y-4 md:hidden">
        <Tabs
          options={columns.map(col => ({ value: col.key, label: col.title, count: col.items.length }))}
          value={column}
          onChange={setColumn}
        />
        {renderColumn(current)}
      </div>
      <div className="hidden gap-6 md:grid md:grid-cols-2">
        {columns.map(renderColumn)}
      </div>
    </>
  );
}
