'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import type { Audience } from './audience';

import type { IssueStatus } from '@/types/Issue';

type Tone = 'neutral' | 'blue' | 'amber' | 'green';

const TONE_BY_STATUS: Record<IssueStatus, Tone> = {
  WAITING_FOR_FISCAL: 'neutral',
  WAITING_FOR_PROCEDURE: 'blue',
  WAITING_FOR_MANAGER: 'neutral',
  WAITING_FOR_MANAGER_RESOLUTION: 'blue',
  WAITING_FOR_RESOLUTION_VALIDATION: 'amber',
  SOLVED: 'green',
  CLOSED: 'neutral',
};

const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-bg text-tone-neutral-fg',
  blue: 'bg-tone-blue-bg text-tone-blue-fg',
  amber: 'bg-tone-amber-bg text-tone-amber-fg',
  green: 'bg-tone-green-bg text-tone-green-fg',
};

// Staff queue statuses turn amber when nobody has touched the issue for 3 days.
const STALE_STAFF_STATUSES: IssueStatus[] = ['WAITING_FOR_FISCAL', 'WAITING_FOR_MANAGER'];
const STALE_AFTER_MS = 3 * 24 * 60 * 60 * 1000;

export type StatusBadgeProps = {
  status: IssueStatus;
  audience: Audience;
  /** The viewer reported the issue or verifies it, so the confirmation is theirs. */
  needsYou?: boolean;
  /** When the issue entered its current status (updatedAt). Used for the staff 3-day rule. */
  since?: string;
  className?: string;
};

export function StatusBadge({ status, audience, needsYou = false, since, className }: StatusBadgeProps) {
  const t = useTranslations('App.Status');

  const isYourConfirmation = needsYou && audience === 'citizen' && status === 'WAITING_FOR_RESOLUTION_VALIDATION';
  const isStale = audience === 'staff'
    && since !== undefined
    && STALE_STAFF_STATUSES.includes(status)
    && Date.now() - new Date(since).getTime() > STALE_AFTER_MS;

  const tone: Tone = isStale ? 'amber' : TONE_BY_STATUS[status];
  const label = isYourConfirmation ? t('needs_you') : t(`${status}.${audience}`);

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-medium leading-5',
        TONE_CLASS[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
