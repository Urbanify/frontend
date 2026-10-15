import { getRequestConfig } from 'next-intl/server';

import { AppConfig } from '@/utils/AppConfig';

// The app is pt-BR only: the locale switcher was removed, so the locale is fixed.
export default getRequestConfig(async () => {
  const locale = AppConfig.defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
