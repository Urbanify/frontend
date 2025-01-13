import { getTranslations } from 'next-intl/server';

import EditCityForm from '@/components/Cities/EditCityForm';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { api } from '@/services/api';

export default async function EditCity({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cityId = (await params).id;
  const { data: city } = await api.city.getById(cityId);
  const t = await getTranslations('Components.Sidebar.Admin.cities');
  // const pageT = await getTranslations('Cities.CreatePage');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/cities' },
          { label: t('edit') },
        ]}
      />

      {city ? <EditCityForm city={city} /> : null}
    </div>
  );
}
