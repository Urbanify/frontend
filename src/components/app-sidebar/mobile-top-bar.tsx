'use client';

import { useTranslations } from 'next-intl';

import { SidebarTrigger } from '@/components/ui/sidebar/sidebar';

import { CityName } from './city-name';

// Mobile only: a slim bar with the menu button and the city name, so no floating button covers page titles.
export function MobileTopBar() {
  const t = useTranslations('App.Header');

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
      <SidebarTrigger className="size-11" aria-label={t('toggle_menu')} />
      <CityName className="min-w-0 text-sm font-semibold" />
    </header>
  );
}
