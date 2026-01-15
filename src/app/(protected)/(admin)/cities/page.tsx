import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { api } from '@/services/api';

import { CitiesTable } from './components/table';

export default async function ListCities() {
  const pageT = await getTranslations('Cities.ListPage');
  const { data: cities } = await api.city.getAll();

  return (
    <div className="px-4">
      <h1 className="mb-4 pl-12 font-sans text-3xl font-semibold">{pageT('title')}</h1>
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
