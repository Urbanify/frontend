import dayjs from 'dayjs';
import { CheckCheck, CircleCheck, CircleX, type LucideIcon, MapPin, Megaphone, UserRound, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { type Tone, TONE_CLASS } from '@/components/app/tones';
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

// Tone of the status each step produced (see api issue.service), so the circle matches the StatusBadge.
const TONE_BY_ACTION: Record<string, Tone> = {
  REPORTED_ISSUE: 'neutral',
  ASSIGNED_AS_FISCAL: 'blue',
  MARKED_AS_UNFOUNDED: 'neutral',
  MARKED_AS_VALID: 'neutral',
  ASSIGNED_AS_MANAGER: 'blue',
  ADDED_RESOLUTION: 'amber',
  REQUESTED_NEW_SOLUTION: 'blue',
  MARKED_AS_SOLVED: 'green',
};

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
            <ol className="mt-4">
              {entries.map((entry, index) => {
                const Icon = ICONS[entry.action] ?? Megaphone;
                const isReporter = entry.userId === issue.reporterId;
                const name = viewer.audience === 'citizen' && isReporter ? t('citizen') : entry.userName;
                const isKnown = KNOWN_ACTIONS.includes(entry.action);
                const isLast = index === entries.length - 1;
                const youReported = entry.action === 'REPORTED_ISSUE' && viewer.id === issue.reporterId;

                return (
                  <li key={entry.id} className={cn('relative flex gap-3', !isLast && 'pb-5')}>
                    {!isLast && <span aria-hidden className="absolute bottom-0 left-4 top-8 w-px -translate-x-1/2 bg-border" />}
                    <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full', TONE_CLASS[TONE_BY_ACTION[entry.action] ?? 'neutral'])}>
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {youReported && t('you_reported')}
                        {!youReported && (isKnown ? t(entry.action as 'REPORTED_ISSUE', { name }) : t('other', { name }))}
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
