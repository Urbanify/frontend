'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { formatRelativeTime } from '@/lib/relative-time';
import { cn } from '@/lib/utils';

import { StatusBadge } from './status-badge';
import { useViewer } from './use-viewer';

import { type Issue, issueCategories } from '@/types/Issue';

export type IssueCardProps = {
  issue: Issue;
  /** Extra action, such as "Assumir chamado". Rendered beside the link, never inside it. */
  action?: ReactNode;
  className?: string;
};

export function IssueCard({ issue, action, className }: IssueCardProps) {
  const t = useTranslations('App.IssueCard');
  const tTypes = useTranslations('Issues.types');
  const viewer = useViewer();

  const CategoryIcon = issueCategories.find(option => option.value === issue.category)?.icon;
  const photo = issue.photos?.[0];
  const protocol = issue.id.slice(0, 6);
  const needsYou = !!viewer.id && (issue.reporterId === viewer.id || issue.fiscalId === viewer.id);

  return (
    <article className={cn('relative flex gap-4 rounded-lg border bg-card p-4 focus-within:ring-2 focus-within:ring-ring', className)}>
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
        {photo
          ? <Image src={photo} alt={t('photo_alt')} width={64} height={64} className="size-16 object-cover" />
          : CategoryIcon && <CategoryIcon className="size-6" aria-hidden />}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="min-w-0 space-y-0.5">
          {/* The link covers the whole card, so the card is clickable without nesting controls in a link. */}
          <Link
            href={`/issues/view/${issue.id}`}
            className="block truncate font-semibold text-navy after:absolute after:inset-0 after:rounded-lg after:content-[''] focus:outline-none"
          >
            {tTypes(issue.type)}
          </Link>
          <p className="line-clamp-1 text-sm text-muted-foreground">{issue.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
          <StatusBadge status={issue.status} audience={viewer.audience} needsYou={needsYou} since={issue.updatedAt} />
          <time dateTime={issue.createdAt} className="tabular-nums">{formatRelativeTime(issue.createdAt)}</time>
          <span className="tabular-nums">
            <span className="sr-only">{t('protocol', { id: protocol })}</span>
            <span aria-hidden="true">{`#${protocol}`}</span>
          </span>
        </div>
      </div>

      {action && <div className="relative z-10 flex shrink-0 items-center">{action}</div>}
    </article>
  );
}
