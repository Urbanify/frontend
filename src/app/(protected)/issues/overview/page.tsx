import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { IssuesOverview } from '@/components/Issues/issues-overview';

import { api } from '@/services/api';

export default async function IssuesOverviewPage() {
  const t = await getTranslations('Issues.OverviewPage');
  const { data } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(1, 'year').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 200,
  });

  return (
    <div className="px-4 md:px-6">
      <h1 className="sr-only">{t('title')}</h1>
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
