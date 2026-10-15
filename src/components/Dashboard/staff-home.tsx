'use client';

import { CheckCircle2, Inbox, type LucideIcon, UserRound, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/app/empty-state';
import { IssueCard } from '@/components/app/issue-card';
import { PageHeader } from '@/components/app/page-header';
import type { Viewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';

import { InicioSection } from './inicio-section';
import { attentionIssues, isStale, type Tone } from './inicio-utils';
import { QueueMap } from './queue-map';

import type { Issue, IssueStatus } from '@/types/Issue';

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-bg text-tone-neutral-fg',
  blue: 'bg-tone-blue-bg text-tone-blue-fg',
  amber: 'bg-tone-amber-bg text-tone-amber-fg',
  green: 'bg-tone-green-bg text-tone-green-fg',
};

type StatTileProps = {
  href: string;
  icon: LucideIcon;
  tone: Tone;
  label: string;
  count: number;
  warning?: string;
};

// Reminders-style smart list: a big number that opens the filtered list.
function StatTile({ href, icon: Icon, tone, label, count, warning }: StatTileProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-4 rounded-lg border bg-card p-4 transition-[background-color,transform] duration-100 hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] md:p-5"
    >
      <span className={cn('flex size-9 items-center justify-center rounded-full', TONE_CLASS[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="space-y-1">
        <span className="block font-display text-4xl font-semibold tabular-nums leading-none text-navy">{count}</span>
        <span className="block text-sm font-medium text-navy">{label}</span>
        {warning && <span className="block text-[13px] font-medium text-tone-amber-fg">{warning}</span>}
      </span>
    </Link>
  );
}

// Only the manager can take an issue from the queue. The API refuses the rest.
function AssignButton({ issueId }: { issueId: string }) {
  const t = useTranslations('Dashboard.staff.attention');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const assign = async () => {
    setIsLoading(true);
    const response = await api.issues.assignMe(issueId).catch(() => null);

    if (response?.ok) {
      router.push(`/issues/view/${issueId}`);
      return;
    }

    toast.error(t('assign_error'));
    setIsLoading(false);
  };

  return (
    <Button variant="outline" isLoading={isLoading} onClick={assign}>
      {t('assign')}
    </Button>
  );
}

export type StaffHomeProps = {
  title: string;
  viewer: Viewer;
  cityIssues: Issue[];
};

export function StaffHome({ title, viewer, cityIssues }: StaffHomeProps) {
  const t = useTranslations('Dashboard.staff');
  const isOwner = viewer.role === 'OWNER';
  const isManager = viewer.role === 'MANAGER';

  const countStatus = (status: IssueStatus) => cityIssues.filter(issue => issue.status === status).length;
  const queueStale = cityIssues.filter(issue => issue.status === 'WAITING_FOR_MANAGER' && isStale(issue)).length;
  const staleTotal = cityIssues.filter(issue => isStale(issue)).length;
  const assignedToMe = cityIssues.filter(issue =>
    issue.managerId === viewer.id
    && (issue.status === 'WAITING_FOR_MANAGER_RESOLUTION' || issue.status === 'WAITING_FOR_RESOLUTION_VALIDATION'),
  ).length;

  const tiles: StatTileProps[] = [
    {
      href: '/issues/open',
      icon: Inbox,
      tone: 'neutral',
      label: t('tiles.queue'),
      count: countStatus('WAITING_FOR_MANAGER'),
      warning: queueStale > 0 ? t('tiles.queue_stale', { count: queueStale }) : undefined,
    },
    isOwner
      ? { href: '/issues', icon: Wrench, tone: 'blue', label: t('tiles.in_progress'), count: countStatus('WAITING_FOR_MANAGER_RESOLUTION') }
      : { href: '/issues/assigned', icon: Wrench, tone: 'blue', label: t('tiles.assigned'), count: assignedToMe },
    { href: '/issues', icon: UserRound, tone: 'amber', label: t('tiles.waiting_citizen'), count: countStatus('WAITING_FOR_RESOLUTION_VALIDATION') },
    { href: '/issues', icon: CheckCircle2, tone: 'green', label: t('tiles.solved'), count: countStatus('SOLVED') },
  ];

  const attention = attentionIssues(cityIssues);

  const renderAction = (issue: Issue) => (isManager && issue.status === 'WAITING_FOR_MANAGER'
    ? <AssignButton issueId={issue.id} />
    : (
        <Button asChild variant="outline">
          <Link href={`/issues/view/${issue.id}`}>{t('attention.view')}</Link>
        </Button>
      ));

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 md:px-6">
      <PageHeader
        title={title}
        description={staleTotal > 0 ? t('context_stale', { count: staleTotal }) : t('context_ok')}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map(tile => <StatTile key={tile.href + tile.label} {...tile} />)}
      </div>

      {cityIssues.length === 0
        ? <EmptyState title={t('empty')} />
        : (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <InicioSection title={t('attention.title')}>
                {attention.length === 0
                  ? <p className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">{t('attention.none')}</p>
                  : (
                      <ul className="grid gap-3">
                        {attention.map(issue => (
                          <li key={issue.id}>
                            <IssueCard issue={issue} action={renderAction(issue)} />
                          </li>
                        ))}
                      </ul>
                    )}
              </InicioSection>

              <InicioSection
                title={t('map.title')}
                action={<Link href="/issues/overview" className="text-sm font-medium text-primary hover:underline">{t('map.open')}</Link>}
              >
                <QueueMap issues={cityIssues} />
              </InicioSection>
            </div>
          )}
    </div>
  );
}
