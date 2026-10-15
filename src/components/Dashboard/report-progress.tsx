'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { PROGRESS } from './inicio-utils';

import type { IssueStatus } from '@/types/Issue';

const STEPS = ['reported', 'verified', 'in_progress', 'solved'] as const;

// Four steps for the citizen: Reportado, Verificado, Em atendimento, Resolvido. Closed issues have no bar.
export function ReportProgress({ status }: { status: IssueStatus }) {
  const t = useTranslations('Dashboard.steps');
  const progress = PROGRESS[status];

  if (!progress) {
    return null;
  }

  const waitingForYou = status === 'WAITING_FOR_RESOLUTION_VALIDATION';

  return (
    <ol className="grid grid-cols-4 gap-1.5">
      {STEPS.map((step, index) => {
        const isDone = index < progress.done;
        const isCurrent = index === progress.current;

        return (
          <li key={step} className="min-w-0 space-y-1.5">
            <span
              className={cn(
                'block h-1.5 rounded-full',
                isDone && 'bg-primary',
                isCurrent && !isDone && (waitingForYou ? 'bg-tone-amber-fg' : 'bg-primary/40'),
                !isDone && !isCurrent && 'bg-muted',
              )}
              aria-hidden
            />
            <span className={cn('block text-[13px] leading-4', isCurrent ? 'font-semibold text-navy' : 'text-muted-foreground')}>
              {t(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
