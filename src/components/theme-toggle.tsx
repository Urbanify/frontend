'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu';

// Claro / Escuro / Automático. Shared by the user menu and the public header.
export function ThemeRadioGroup() {
  const t = useTranslations('App.UserMenu');
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuRadioGroup value={theme ?? 'system'} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light">{t('theme_light')}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark">{t('theme_dark')}</DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system">{t('theme_system')}</DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}

// Compact icon button for the public header. The icon shows the theme it switches to.
export function ThemeToggle() {
  const t = useTranslations('App.UserMenu');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme')} className="size-11 md:size-10">
          <Moon className="dark:hidden" aria-hidden />
          <Sun className="hidden dark:block" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuLabel className="text-[13px] font-normal text-muted-foreground">{t('theme')}</DropdownMenuLabel>
        <ThemeRadioGroup />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
