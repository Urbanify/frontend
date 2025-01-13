import type { LocalePrefixMode } from 'node_modules/next-intl/dist/types/src/routing/types';

const localePrefix: LocalePrefixMode = 'as-needed';

// FIXME: Update this configuration file based on your project information
const locales = ['br', 'en', 'es'] as const;
export const AppConfig = {
  name: 'Urbanify',
  defaultLocale: 'br',
  localePrefix,
  locales,
};

export type Locale = (typeof locales)[number];
