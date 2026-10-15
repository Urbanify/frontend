'use client';

import { Marker, useLoadScript } from '@react-google-maps/api';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { formatRelativeTime } from '@/lib/relative-time';
import { Env } from '@/libs/Env';

import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { useViewer } from '@/components/app/use-viewer';
import { GoogleMaps } from '@/components/google-map/google-map';
import { Button } from '@/components/ui/button/button';
import { Skeleton } from '@/components/ui/skeleton/skeleton';

import { AssignBanner } from './assign-banner';
import { IssueComments } from './issue-comments';
import { IssueHistoryDetails } from './issue-history-details';
import { IssuePhotos } from './issue-photos';

import type { IssueDetails } from '@/types/Issue';
import { issueCategories } from '@/types/Issue';

type IssueDetailmentProps = {
  issue: IssueDetails;
};

// Mobile (one column): header, next step, photos, description, map, timeline, conversation.
// Desktop: left column holds photos, description, map and conversation; right column holds next step and timeline.
export function IssueDetailment({ issue }: IssueDetailmentProps) {
  const t = useTranslations('IssueDetail');
  const tIssues = useTranslations('Issues');
  const router = useRouter();
  const viewer = useViewer();

  const CategoryIcon = issueCategories.find(option => option.value === issue.category)?.icon;
  const position = { lat: +issue.latitude, lng: +issue.longitude };

  const { isLoaded } = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: Env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-x-6">
      <div className="flex flex-col gap-3 lg:col-span-2">
        <Button variant="ghost" className="-ml-3 self-start" onClick={() => (window.history.length > 1 ? router.back() : router.push('/issues'))}>
          <ArrowLeft aria-hidden />
          {t('back')}
        </Button>

        <PageHeader
          title={tIssues(`types.${issue.type}`)}
          action={(
            <StatusBadge
              status={issue.status}
              audience={viewer.audience}
              needsYou={issue.reporterId === viewer.id || issue.fiscalId === viewer.id}
              since={issue.updatedAt}
            />
          )}
        />

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            {CategoryIcon && <CategoryIcon className="size-4" aria-hidden />}
            {tIssues(`types.${issue.category}`)}
          </span>
          <span className="tabular-nums">{`${t('protocol')} #${issue.id.slice(0, 6)}`}</span>
          <span>{t('reportedAgo', { time: formatRelativeTime(issue.createdAt) })}</span>
        </p>
      </div>

      {/* Left column on desktop. "contents" makes its children flow with the right column on mobile. */}
      <div className="contents lg:flex lg:flex-col lg:gap-6">
        {!!issue.photos?.length && <IssuePhotos photos={issue.photos} className="order-3" />}

        <section className="order-4 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">{t('description')}</h2>
          <p className="mt-2 whitespace-pre-line text-base text-foreground">{issue.description}</p>
        </section>

        <section className="order-5 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">{t('location')}</h2>
          <div className="mt-3 h-[200px] overflow-hidden rounded-md">
            {isLoaded
              ? (
                  <GoogleMaps center={position} zoom={15}>
                    <Marker position={position} />
                  </GoogleMaps>
                )
              : <Skeleton className="h-[200px]" />}
          </div>
        </section>

        <IssueComments issue={issue} viewer={viewer} className="order-7" />
      </div>

      {/* Right column on desktop. */}
      <div className="contents lg:flex lg:flex-col lg:gap-4">
        <AssignBanner issue={issue} viewer={viewer} className="order-2" />
        <IssueHistoryDetails issue={issue} viewer={viewer} className="order-6" />
      </div>
    </div>
  );
}
