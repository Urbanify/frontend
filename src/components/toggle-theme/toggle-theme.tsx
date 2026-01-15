'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { SidebarMenuButton } from '@/components/ui/sidebar/sidebar';

export function ToggleTheme() {
  const { setTheme, theme } = useTheme();
  const t = useTranslations('Components.Sidebar.User');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  if (theme === 'light') {
    return (
      <SidebarMenuButton asChild size="sm" onClick={toggleTheme}>
        <span className="flex gap-2">
          <Sun data-testid="sun-icon" className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          {t('toggle_theme')}
        </span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild size="sm" onClick={toggleTheme}>
      <span className="flex gap-2">
        <Moon data-testid="moon-icon" className="rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {t('toggle_theme')}
      </span>
    </SidebarMenuButton>
  );
}
