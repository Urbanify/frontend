import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import EditCityForm from '@/components/Cities/EditCityForm';

import { api } from '@/services/api';

export default async function EditCity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cityId = (await params).id;
  const { data: city } = await api.city.getById(cityId);
  // const pageT = await getTranslations('Cities.CreatePage');

  return (
    <div className="px-4">
      {city ? <EditCityForm city={city} /> : null}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const t = await getTranslations('SEO.Cities.Edit');
  return {
    title: t('title', { id: params.id }),
    description: t('description'),
    openGraph: {
      title: t('title', { id: params.id }),
      description: t('description'),
    },
    twitter: {
      title: t('title', { id: params.id }),
      description: t('description'),
    },
  };
}
