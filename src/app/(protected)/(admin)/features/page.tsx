import { getTranslations } from 'next-intl/server';

import { loadFeatures } from '@/lib/loaders/loadFeatures';

import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { FeaturesTable } from './components/table';

export default async function ListFeatures() {
  const t = await getTranslations('Components.Sidebar.Admin.features');
  const pageT = await getTranslations('Features.ListPage');
  const features = await loadFeatures();

  return (
    <>
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/features' },
          { label: t('list') },
        ]}
      />
      <div className="px-4">
        <h1 className="mb-4 font-sans text-3xl font-semibold">{pageT('title')}</h1>
        <FeaturesTable features={features} />
      </div>
    </>
  );
}
