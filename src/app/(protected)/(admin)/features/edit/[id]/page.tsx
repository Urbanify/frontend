import { getTranslations } from 'next-intl/server';

import EditFeatureForm from '@/components/Features/EditFeatureForm';
import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

import { api } from '@/services/api';

export default async function EditFeature({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const featureId = (await params).id;
  const { data: feature } = await api.ff.getById(featureId);
  const t = await getTranslations('Components.Sidebar.Admin.features');

  return (
    <div className="px-4">
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/features' },
          { label: t('edit') },
        ]}
      />

      {feature ? <EditFeatureForm feature={feature} /> : null}
    </div>
  );
}
