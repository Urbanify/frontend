import { getRequestConfig } from 'next-intl/server';

import { getUserLocale } from '@/services/locale';

// Using internationalization in Server Components
export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
