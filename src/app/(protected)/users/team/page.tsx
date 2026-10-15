import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';

import { api } from '@/services/api';

import { UsersTable } from '../components/table';

const ROLES = ['OWNER', 'MANAGER', 'FINANCIAL'] as const;

export default async function TeamPage() {
  const t = await getTranslations('Users.TeamPage');
  const response = await api.users.list({
    roles: [...ROLES],
    fetchServerSide: true,
  });
  const payload = response.ok ? await response.json() : null;
  const users = payload?.items ?? [];
  const tTable = await getTranslations('Users.table');

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:py-10">
      <PageHeader title={t('title')} description={t('description')} />
      {response.ok
        ? <UsersTable users={users} roles={[...ROLES]} />
        : <EmptyState title={tTable('no_access')} />}
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Users.Team');
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
