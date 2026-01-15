import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ReportIssueForm } from '@/components/Issues/report-issue-form';

export default async function ReportIssuePage() {
  return (
    <div className="px-4">
      <ReportIssueForm />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Issues.Report');
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
