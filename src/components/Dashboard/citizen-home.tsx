'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { EmptyState } from '@/components/app/empty-state';
import { IssuePhotoCard } from '@/components/app/issue-photo-card';
import { PageHeader } from '@/components/app/page-header';
import type { Viewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';
import { buttonVariants } from '@/components/ui/button/variants';

import { InicioSection } from './inicio-section';
import { ReportProgress } from './report-progress';

import type { Issue } from '@/types/Issue';

export type CitizenHomeProps = {
  title: string;
  viewer: Viewer;
  cityIssues: Issue[];
  reportedIssues: Issue[];
};

export function CitizenHome({ title, viewer, cityIssues, reportedIssues }: CitizenHomeProps) {
  const t = useTranslations('Dashboard');
  const tTypes = useTranslations('Issues.types');

  // Falta você: confirm a solved report, or finish a verification the viewer took.
  const known = new Map([...reportedIssues, ...cityIssues].map(issue => [issue.id, issue] as const));
  const needsYou = [...known.values()].filter(issue =>
    (issue.status === 'WAITING_FOR_RESOLUTION_VALIDATION' && (issue.reporterId === viewer.id || issue.fiscalId === viewer.id))
    || (issue.status === 'WAITING_FOR_PROCEDURE' && issue.fiscalId === viewer.id),
  );

  const helpCount = cityIssues.filter(issue => issue.status === 'WAITING_FOR_FISCAL' && issue.reporterId !== viewer.id).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 md:px-6">
      <PageHeader
        title={title}
        action={(
          <Button asChild size="lg" className="w-full md:hidden">
            <Link href="/issues/report">
              <Plus aria-hidden />
              {t('report')}
            </Link>
          </Button>
        )}
      />

      {needsYou.length > 0 && (
        <InicioSection title={t('needs_you.title')}>
          <ul className="grid gap-3">
            {needsYou.map((issue) => {
              const isVerifying = issue.status === 'WAITING_FOR_PROCEDURE';

              return (
                <li key={issue.id} className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-0.5">
                    <p className="truncate font-semibold text-navy">{tTypes(issue.type)}</p>
                    <p className="text-sm text-muted-foreground">
                      {isVerifying ? t('needs_you.verify_hint') : t('needs_you.confirm_hint')}
                    </p>
                  </div>
                  <Button asChild variant="outline" className="shrink-0">
                    <Link href={`/issues/view/${issue.id}`}>
                      {isVerifying ? t('needs_you.verify_action') : t('needs_you.confirm_action')}
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </InicioSection>
      )}

      <InicioSection
        title={t('reports.title')}
        action={reportedIssues.length > 0 && (
          <Link href="/issues/mine" className="text-sm font-medium text-primary hover:underline">
            {t('reports.all')}
          </Link>
        )}
      >
        {reportedIssues.length === 0
          ? (
              <EmptyState
                title={t('reports.empty')}
                action={(
                  <Button asChild variant="outline">
                    <Link href="/issues/report">{t('report')}</Link>
                  </Button>
                )}
              />
            )
          : (
              <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:p-0">
                {reportedIssues.slice(0, 3).map(issue => (
                  <li key={issue.id} className="flex w-[78%] shrink-0 snap-start flex-col gap-3 md:w-auto">
                    <IssuePhotoCard issue={issue} className="flex-1" />
                    <ReportProgress status={issue.status} />
                  </li>
                ))}
              </ul>
            )}
      </InicioSection>

      <InicioSection title={t('help.title')}>
        <Link
          href="/issues"
          className="flex flex-col gap-4 rounded-lg border bg-card p-5 transition-colors hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-base text-navy">
            {helpCount > 0 ? t('help.count', { count: helpCount }) : t('help.none')}
          </p>
          <span className={buttonVariants({ variant: 'outline' })}>{t('help.action')}</span>
        </Link>
      </InicioSection>
    </div>
  );
}
