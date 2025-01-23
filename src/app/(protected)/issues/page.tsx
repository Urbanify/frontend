import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { api } from '@/services/api';

import { IssuesTable } from './components/table';

export default async function Page() {
  const t = await getTranslations('Components.Sidebar.General.issues');
  const pageT = await getTranslations('Issues.ListPage');
  const { data: issues } = await api.issues.getAllOpenIssuesPerPeriod({
    start: dayjs().subtract(1, 'month').toISOString(),
    end: dayjs().toISOString(),
    page: 1,
  });

  return (
    <>
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/issues' },
          { label: t('all') },
        ]}
      />
      <div className="px-4">
        <h1 className="mb-4 font-sans text-3xl font-semibold">{pageT('title')}</h1>
        <IssuesTable issues={issues.items} />
      </div>
    </>
  );
}
