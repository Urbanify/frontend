import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { IssuesOverview } from '@/components/Issues/issues-overview';

import { api } from '@/services/api';

export default async function IssuesOverviewPage() {
  const t = await getTranslations('Issues.OverviewPage');
  const { data } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(30, 'day').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 200,
  });

  return (
    <div className="px-4">
      <div className="mb-6 pl-12">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <IssuesOverview issues={data.items ?? []} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Issues.Overview');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      title: t('title'),
      description: t('description'),
    },
  };
}
