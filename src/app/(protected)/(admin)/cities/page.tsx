import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button/button';

import { api } from '@/services/api';

import { CitiesTable } from './components/table';

export default async function ListCities() {
  const pageT = await getTranslations('Cities.ListPage');
  const { data: cities } = await api.city.getAll();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:py-10">
      <PageHeader
        title={pageT('title')}
        action={(
          <Button asChild>
            <Link href="/cities/create">{pageT('new')}</Link>
          </Button>
        )}
      />
      <CitiesTable cities={cities} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Cities.List');
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
