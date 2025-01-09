import { getTranslations } from 'next-intl/server';

import CityForm from '@/components/Cities/CityForm';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

export default async function CreateCity() {
  const t = await getTranslations('Components.Sidebar.Admin.cities');
  // const pageT = await getTranslations('Cities.CreatePage');

  return (
    <>
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/cities' },
          { label: t('create') },
        ]}
      />

      <CityForm />
    </>
  );
}
