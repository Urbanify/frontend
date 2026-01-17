import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CrimesTable } from './components/table';

export default async function CrimesPage() {
  const pageT = await getTranslations('Crimes.ListPage');

  return (
    <div className="px-4">
      <h1 className="mb-4 pl-12 font-sans text-3xl font-semibold">{pageT('title')}</h1>
      <CrimesTable crimes={[]} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Crimes.List');
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
