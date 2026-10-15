import { Wrench } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button/button';

// Placeholder: the list of issues this manager is handling is built later.
export default async function Page() {
  const t = await getTranslations('Issues.AssignedPage');

  return (
    <div className="space-y-6 px-4 md:px-6">
      <PageHeader title={t('title')} description={t('description')} />
      <EmptyState
        icon={Wrench}
        title={t('empty_title')}
        description={t('empty_description')}
        action={(
          <Button variant="outline" asChild>
            <Link href="/issues/open">{t('empty_action')}</Link>
          </Button>
        )}
      />
    </div>
  );
}
