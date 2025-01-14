import { getTranslations } from 'next-intl/server';

import { ReportIssueForm } from '@/components/Issues/report-issue-form';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

export default async function ReportIssuePage() {
  const t = await getTranslations('Components.Sidebar.General.issues');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/issues' },
          { label: t('report') },
        ]}
      />

      <ReportIssueForm />
    </div>
  );
}
