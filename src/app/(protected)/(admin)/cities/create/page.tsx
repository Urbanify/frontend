import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import CreateCityForm from '@/components/Cities/CreateCityForm';

export default function CreateCity() {
  return (
    <div className="px-4">
      <CreateCityForm />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Cities.Create');
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
