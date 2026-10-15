import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';

import { api } from '@/services/api';

import { RolesGuide } from './components/roles-guide';
import { UsersTable } from './components/table';

const ROLES = ['RESIDENT'] as const;

export default async function UsersPage() {
  const t = await getTranslations('Users.ListPage');
  const response = await api.users.list({
    roles: [...ROLES],
    fetchServerSide: true,
  });
  const payload = response.ok ? await response.json() : null;
  const users = payload?.items ?? [];
  const tTable = await getTranslations('Users.table');

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:py-10">
      <PageHeader title={t('title')} description={t('description')} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="lg:col-start-2 lg:row-start-1">
          <RolesGuide roles={['citizen']} />
        </div>
        <div className="lg:col-start-1 lg:row-start-1">
          {response.ok
            ? <UsersTable users={users} roles={[...ROLES]} />
            : <EmptyState title={tTable('no_access')} />}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Users.List');
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
