import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';

import { api } from '@/services/api';

import { AssignedBoard } from '../components/issue-views';

export default async function Page() {
  const t = await getTranslations('Issues.AssignedPage');
  // The city list is filtered by manager on the client, so it has to cover the same period as the queue.
  const { data } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(1, 'year').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 200,
  });

  return (
    <div className="space-y-6 px-4 md:px-6">
      <PageHeader title={t('title')} description={t('description')} />
      <AssignedBoard issues={data.items ?? []} />
    </div>
  );
}
