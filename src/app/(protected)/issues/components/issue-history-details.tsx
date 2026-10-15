import dayjs from 'dayjs';
import { CheckCheck, CircleCheck, CircleX, type LucideIcon, MapPin, Megaphone, UserRound, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import type { Viewer } from '@/components/app/use-viewer';

import type { IssueDetails } from '@/types/Issue';

type IssueHistoryDetailsProps = {
  issue: IssueDetails;
  viewer: Viewer;
  className?: string;
};

const ICONS: Record<string, LucideIcon> = {
  REPORTED_ISSUE: Megaphone,
  ASSIGNED_AS_FISCAL: MapPin,
  MARKED_AS_VALID: CircleCheck,
  MARKED_AS_UNFOUNDED: CircleX,
  ASSIGNED_AS_MANAGER: UserRound,
  ADDED_RESOLUTION: Wrench,
  REQUESTED_NEW_SOLUTION: Megaphone,
  MARKED_AS_SOLVED: CheckCheck,
};

const KNOWN_ACTIONS = Object.keys(ICONS);

// Visible on the page (replaces the old "Histórico" dialog). Oldest first.
export function IssueHistoryDetails({ issue, viewer, className }: IssueHistoryDetailsProps) {
  const t = useTranslations('IssueDetail.timeline');
  const entries = [...issue.history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <section className={cn('rounded-lg border border-border bg-card p-5', className)}>
      <h2 className="text-sm font-semibold text-navy">{t('title')}</h2>

      {entries.length === 0
        ? <p className="mt-3 text-sm text-muted-foreground">{t('empty')}</p>
        : (
            <ol className="mt-4 space-y-4">
              {entries.map((entry) => {
                const Icon = ICONS[entry.action] ?? Megaphone;
                const isReporter = entry.userId === issue.reporterId;
                const name = viewer.audience === 'citizen' && isReporter ? t('citizen') : entry.userName;
                const isKnown = KNOWN_ACTIONS.includes(entry.action);

                return (
                  <li key={entry.id} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {isKnown ? t(entry.action as 'REPORTED_ISSUE', { name }) : t('other', { name })}
                      </p>
                      <time className="block text-sm tabular-nums text-muted-foreground" dateTime={entry.createdAt}>
                        {dayjs(entry.createdAt).format('DD/MM/YYYY HH:mm')}
                      </time>
                      {!!entry.description && <p className="text-sm text-foreground">{entry.description}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
    </section>
  );
}
