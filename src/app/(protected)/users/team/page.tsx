import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { api } from '@/services/api';

import { UsersTable } from '../components/table';

export default async function TeamPage() {
  const t = await getTranslations('Users.TeamPage');
  const response = await api.users.list({
    roles: ['OWNER', 'MANAGER', 'FINANCIAL'],
    fetchServerSide: true,
  });
  const payload = response.ok ? await response.json() : null;
  const users = payload?.items ?? [];

  return (
    <div className="px-4">
      <h1 className="mb-4 pl-12 font-sans text-3xl font-semibold">{t('title')}</h1>
      <UsersTable title={t('table_title')} description={t('table_description')} users={users} showCpf />
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
