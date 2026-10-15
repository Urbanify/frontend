import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';
import { cityCenter } from '@/components/places/place-meta';

import { auth } from '@/auth';
import { api } from '@/services/api';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

import { PlaceForm } from '../components/place-form';

export default async function NewPlacePage() {
  const t = await getTranslations('Places.Form');
  const session = await auth();
  const cityId = parseJwtUniversal(session?.access_token)?.user?.cityId;
  const { data: cities } = await api.city.getAll();
  const city = cities.find(item => item.id === cityId);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6">
      <PageHeader title={t('new_title')} />
      <PlaceForm cityCenter={cityCenter(city)} />
    </div>
  );
}
