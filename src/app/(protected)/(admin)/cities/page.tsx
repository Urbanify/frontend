import { getTranslations } from 'next-intl/server';

import { loadCities } from '@/lib/loaders/loadCities';

import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { CitiesTable } from './components/table';

export default async function ListCities() {
  const t = await getTranslations('Components.Sidebar.Admin.cities');
  const pageT = await getTranslations('Cities.ListPage');
  const cities = await loadCities();

  return (
    <>
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/cities' },
          { label: t('create') },
        ]}
      />
      <div className="px-4">
        <h1 className="mb-4 font-sans text-3xl font-semibold">{pageT('title')}</h1>
        <CitiesTable cities={cities} />
      </div>
    </>
  );
}
