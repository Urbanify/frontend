import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CrimesOverview } from '@/components/Crimes/crimes-overview';

export default async function CrimesOverviewPage() {
  const t = await getTranslations('Crimes.OverviewPage');

  return (
    <div className="px-4">
      <div className="mb-6 pl-12">
        <h1 className="text-3xl font-semibold">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <CrimesOverview />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Crimes.Overview');
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
