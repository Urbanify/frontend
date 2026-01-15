import dayjs from 'dayjs';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { api } from '@/services/api';

import { IssuesTable } from '../components/table';

export default async function Page() {
  const pageT = await getTranslations('Issues.OpenIssuesPage');
  const { data: issues } = await api.issues.getAllOpenIssuesPerPeriod({
    start: dayjs().subtract(1, 'month').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
  });

  return (
    <div className="px-4">
      <h1 className="mb-4 pl-12 font-sans text-3xl font-semibold">{pageT('title')}</h1>
      <IssuesTable issues={issues.items} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Issues.Open');
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
