import { useLocale } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

import LocaleSwitcherSelect from './LocaleSwitcherSelect';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const languages = AppConfig.locales.map(lang => ({
    label: lang.toUpperCase(),
    value: lang,
  }));

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={languages}
      // label={t('label')}
      label="Language Selector"
    />
  );
}
