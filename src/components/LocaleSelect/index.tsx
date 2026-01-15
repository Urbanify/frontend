import { useLocale, useTranslations } from 'next-intl';

import { AppConfig } from '@/utils/AppConfig';

import LocaleSwitcherSelect from './locale-switcher-select';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Components.LocaleSwitcher');

  const languageMap: Record<string, { label: string; flag: string }> = {
    br: { label: 'Português (BR)', flag: '🇧🇷' },
    en: { label: 'English', flag: '🇺🇸' },
    es: { label: 'Español', flag: '🇪🇸' },
  };

  const languages = AppConfig.locales.map(lang => ({
    label: languageMap[lang]?.label ?? lang.toUpperCase(),
    value: lang,
    flag: languageMap[lang]?.flag ?? '',
  }));

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={languages}
      label={t('label')}
    />
  );
}
