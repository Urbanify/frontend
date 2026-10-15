import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';
import { cityCenter } from '@/components/places/place-meta';

import { auth } from '@/auth';
import { api } from '@/services/api';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

import { PlaceForm } from '../components/place-form';

type EditPlacePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlacePage({ params }: EditPlacePageProps) {
  const { id } = await params;
  const t = await getTranslations('Places.Form');
  const session = await auth();
  const cityId = parseJwtUniversal(session?.access_token)?.user?.cityId;
  const [places, { data: cities }] = await Promise.all([
    api.places.listStaff(session?.access_token),
    api.city.getAll(),
  ]);
  const place = places.find(item => item.id === id);

  if (!place) {
    notFound();
  }

  const city = cities.find(item => item.id === cityId);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6">
      <PageHeader title={t('edit_title')} />
      <PlaceForm place={place} cityCenter={cityCenter(city)} />
    </div>
  );
}
