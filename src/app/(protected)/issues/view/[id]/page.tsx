import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { api } from '@/services/api';

import AssignBanner from '../../components/assign-banner';
import { IssueDetailment } from '../../components/issue-details';

export default async function AccessIssue({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const issueId = (await params).id;
  const { data: issue } = await api.issues.getById(issueId);

  return (
    <div className="px-4">
      <AssignBanner issue={issue} />
      <IssueDetailment issue={issue} />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const t = await getTranslations('SEO.Issues.View');
  return {
    title: t('title', { id: resolvedParams.id }),
    description: t('description'),
    openGraph: {
      title: t('title', { id: resolvedParams.id }),
      description: t('description'),
    },
    twitter: {
      title: t('title', { id: resolvedParams.id }),
      description: t('description'),
    },
  };
}
