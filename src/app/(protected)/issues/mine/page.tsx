import { ClipboardList } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';

import { PhotoTabs } from '../components/issue-views';

export default async function Page() {
  const t = await getTranslations('Issues.MyIssuesPage');
  const { data } = await api.issues.getAllMyIssues({
    page: 1,
  });

  return (
    <div className="space-y-6 px-4 md:px-6">
      <PageHeader title={t('title')} />
      <PhotoTabs
        issues={data.items ?? []}
        emptyTab={{ in_progress: t('empty_in_progress'), done: t('empty_done') }}
        emptyState={(
          <EmptyState
            icon={ClipboardList}
            title={t('empty_title')}
            action={(
              <Button asChild>
                <Link href="/issues/report">{t('empty_action')}</Link>
              </Button>
            )}
          />
        )}
      />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Issues.Mine');
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
