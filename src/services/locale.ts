'use server';

import { cookies } from 'next/headers';

import { AppConfig, type Locale } from '@/utils/AppConfig';
// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
  return (await cookies()).get(COOKIE_NAME)?.value || AppConfig.defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    // Client-side: Use document.cookie
    document.cookie = `${COOKIE_NAME}=${locale}; path=/`;
  } else {
    // Server-side: Use Next.js cookies API
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, locale);
  }
}
