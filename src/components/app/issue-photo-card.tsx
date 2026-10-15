'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { CategoryTile } from './category';
import { StatusBadge } from './status-badge';
import { useViewer } from './use-viewer';

import type { Issue } from '@/types/Issue';

export type IssuePhotoCardProps = {
  issue: Issue;
  className?: string;
};

// Grid card with the photo on top. The whole card is a link to the issue. Falls back to the category icon.
export function IssuePhotoCard({ issue, className }: IssuePhotoCardProps) {
  const t = useTranslations('App.IssueCard');
  const tTypes = useTranslations('Issues.types');
  const viewer = useViewer();

  const photo = issue.photos?.[0];
  const needsYou = !!viewer.id && (issue.status === 'WAITING_FOR_PROCEDURE'
    ? issue.fiscalId === viewer.id
    : issue.reporterId === viewer.id || issue.fiscalId === viewer.id);

  return (
    <article className={cn('relative flex flex-col overflow-hidden rounded-lg border bg-card focus-within:ring-2 focus-within:ring-ring', className)}>
      <div className={cn('relative flex items-center justify-center bg-muted text-muted-foreground', photo ? 'aspect-[4/3]' : 'h-24')}>
        {photo
          ? <Image src={photo} alt={t('photo_alt')} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
          : <CategoryTile category={issue.category} className="size-16" iconClassName="size-8" />}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* The link covers the whole card. */}
        <Link
          href={`/issues/view/${issue.id}`}
          className="line-clamp-2 font-semibold text-navy after:absolute after:inset-0 after:content-[''] focus:outline-none"
        >
          {tTypes(issue.type)}
        </Link>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-muted-foreground">
          <StatusBadge status={issue.status} audience={viewer.audience} needsYou={needsYou} since={issue.updatedAt} className="max-w-full whitespace-normal" />
          <span className="tabular-nums">{`#${issue.id.slice(0, 6)}`}</span>
        </div>
      </div>
    </article>
  );
}
