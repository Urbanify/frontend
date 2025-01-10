import { getTranslations } from 'next-intl/server';

import FeatureForm from '@/components/Features/FeatureForm';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

export default async function CreateFeature() {
  const t = await getTranslations('Components.Sidebar.Admin.features');
  // const pageT = await getTranslations('Cities.CreatePage');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/features' },
          { label: t('create') },
        ]}
      />

      <FeatureForm />
    </div>
  );
}
