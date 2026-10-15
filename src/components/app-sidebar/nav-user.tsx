'use client';

import { ChevronsUpDown, LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { signOut } from '@/lib/session-client';

import { ThemeRadioGroup } from '@/components/theme-toggle';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar/sidebar';
import { useSidebar } from '@/components/ui/sidebar/useSidebar';

import type { TokenData } from '@/types/JWT';
import type { UserRole } from '@/types/User';

export function NavUser({ user }: { user: TokenData['user'] }) {
  const { isMobile } = useSidebar();
  const t = useTranslations('App');
  const initials = `${user.name.slice(0, 1)}${user.surname?.slice(0, 1) ?? ''}`.toUpperCase();
  const fullName = `${user.name} ${user.surname}`.trim();
  const roleLabel = t(`Roles.${user.role as UserRole}`);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              aria-label={t('UserMenu.open')}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-9 rounded-full">
                <AvatarFallback className="rounded-full bg-tone-blue-bg text-sm font-semibold text-tone-blue-fg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">{fullName}</span>
                <span className="truncate text-[13px] text-muted-foreground">{roleLabel}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" aria-hidden />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <span className="block truncate font-semibold">{fullName}</span>
              <span className="block truncate text-[13px] text-muted-foreground">{roleLabel}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserRound />
                {t('UserMenu.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[13px] font-normal text-muted-foreground">{t('UserMenu.theme')}</DropdownMenuLabel>
            <ThemeRadioGroup />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              {t('UserMenu.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
