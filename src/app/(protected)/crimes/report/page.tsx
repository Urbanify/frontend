import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { ReportCrimeForm } from '@/components/Crimes/report-crime-form';

export default async function ReportCrimePage() {
  return (
    <div className="px-4">
      <ReportCrimeForm />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Crimes.Report');
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
