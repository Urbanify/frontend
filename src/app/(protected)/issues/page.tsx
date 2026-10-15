import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { api } from '@/services/api';

import { CityIssues } from './components/issue-views';

export default async function Page() {
  const { data } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(1, 'year').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 200,
  });

  return (
    <div className="px-4 md:px-6">
      <CityIssues issues={data.items ?? []} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Issues.List');
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
