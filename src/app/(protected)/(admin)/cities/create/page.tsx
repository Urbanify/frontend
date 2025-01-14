import { getTranslations } from 'next-intl/server';

import CreateCityForm from '@/components/Cities/CreateCityForm';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

export default async function CreateCity() {
  const t = await getTranslations('Components.Sidebar.Admin.cities');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/cities' },
          { label: t('create') },
        ]}
      />

      <CreateCityForm />
    </div>
  );
}
