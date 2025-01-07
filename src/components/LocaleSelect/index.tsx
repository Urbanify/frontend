import { useLocale, useTranslations } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

import LocaleSwitcherSelect from './locale-switcher-select';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Components.LocaleSwitcher');

  const languages = AppConfig.locales.map(lang => ({
    label: lang.toUpperCase(),
    value: lang,
  }));

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={languages}
      label={t('label')}
    />
  );
}
