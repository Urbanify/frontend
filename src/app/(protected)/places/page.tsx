import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button/button';

import { auth } from '@/auth';
import { api } from '@/services/api';

import { PlacesManager } from './components/places-manager';

export default async function PlacesPage() {
  const t = await getTranslations('Places.ListPage');
  const session = await auth();
  const places = await api.places.listStaff(session?.access_token);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6">
      <PageHeader
        title={t('title')}
        description={t('description')}
        action={(
          <Button asChild>
            <Link href="/places/new">{t('add')}</Link>
          </Button>
        )}
      />
      <PlacesManager places={places} />
    </div>
  );
}
