import { useTranslations } from 'next-intl';

import BreadcrumbSetter from '@/components/ui/breadcrumb/breadcrumb-setter';

export default function CreateCity() {
  const t = useTranslations('Components.Sidebar.Admin.cities');
  const pageT = useTranslations('Cities.CreatePage');

  return (
    <>
      <BreadcrumbSetter
        breadcrumbs={[
          { label: t('title'), href: '/cities' },
          { label: t('create') },
        ]}
      />
      <div>
        <h1>{pageT('title')}</h1>
      </div>
    </>
  );
}
