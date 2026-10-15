import dayjs from 'dayjs';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';

import { PhotoTabs } from '../components/issue-views';

export default async function Page() {
  const t = await getTranslations('Issues.VerifyingPage');
  // The city list is filtered by fiscal on the client, so it has to cover the same period as the queues.
  const { data } = await api.issues.getAllIssuesPerPeriod({
    start: dayjs().subtract(1, 'year').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
    take: 200,
  });

  return (
    <div className="space-y-6 px-4 md:px-6">
      <PageHeader title={t('title')} description={t('description')} />
      <PhotoTabs
        issues={data.items ?? []}
        by="fiscalId"
        emptyTab={{ in_progress: t('empty_in_progress'), done: t('empty_done') }}
        emptyState={(
          <EmptyState
            icon={ClipboardCheck}
            title={t('empty_title')}
            description={t('empty_description')}
            action={(
              <Button variant="outline" asChild>
                <Link href="/issues">{t('empty_action')}</Link>
              </Button>
            )}
          />
        )}
      />
    </div>
  );
}
