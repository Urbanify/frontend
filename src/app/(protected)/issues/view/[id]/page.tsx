import { getTranslations } from 'next-intl/server';

import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { api } from '@/services/api';

import { IssueDetailment } from '../../components/issue-details';

export default async function AccessIssue({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const issueId = (await params).id;
  const { data: issue } = await api.issues.getById(issueId);
  const t = await getTranslations('Components.Sidebar.General.issues');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/issues' },
          { label: t('access') },
        ]}
      />

      <IssueDetailment issue={issue} />
    </div>
  );
}
