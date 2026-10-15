'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ComingSoon } from '@/components/app/coming-soon';
import { useViewer } from '@/components/app/use-viewer';
import { Button } from '@/components/ui/button/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar/sidebar';

import { parseJwt } from '@/utils/decodeJWT';

import { CityName } from './city-name';
import { menuFor } from './menu';
import { NavUser } from './nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const viewer = useViewer();
  const pathname = usePathname();
  const t = useTranslations('App');
  const menu = menuFor(viewer.role, viewer.cityId);
  const user = parseJwt(viewer.token)?.user;

  // Highlight the longest menu link that contains the current page.
  const activeHref = pathname.startsWith('/issues/report')
    ? undefined
    : menu?.links
      .map(link => link.href)
      .filter(href => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b.length - a.length)[0];

  return (
    <Sidebar className="px-0" variant="inset" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
            <Image src="/logo.svg" alt="Urbanify" width={32} height={32} className="size-8 shrink-0" />
            <span className="grid min-w-0 leading-tight">
              <span className="font-semibold">Urbanify</span>
              <CityName className="text-[13px] text-muted-foreground" />
            </span>
          </Link>
          <SidebarTrigger className="hidden md:inline-flex" aria-label={t('Header.toggle_menu')} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {viewer.role === 'RESIDENT' && (
          <Button asChild className="mb-3 w-full justify-start gap-2">
            <Link href="/issues/report">
              <Plus aria-hidden />
              {t('Menu.report')}
            </Link>
          </Button>
        )}

        {menu && (
          <SidebarGroup className="p-0">
            <nav aria-label={t('Menu.label')}>
              <SidebarMenu>
                {menu.links.map(link => (
                  <SidebarMenuItem key={link.key}>
                    <SidebarMenuButton asChild isActive={link.href === activeHref} className="h-10">
                      <Link href={link.href} aria-current={link.href === activeHref ? 'page' : undefined}>
                        <link.icon aria-hidden />
                        <span>{t(`Menu.${link.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        )}

        {menu && menu.soon.length > 0 && (
          <>
            <SidebarSeparator className="my-3" />
            <SidebarMenu>
              {menu.soon.map(item => (
                <SidebarMenuItem key={item.key}>
                  <ComingSoon
                    label={t(`Menu.soon.${item.key}.label`)}
                    hint={t(`Menu.soon.${item.key}.hint`)}
                    icon={item.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>

      {user && (
        <SidebarFooter className="px-2 pb-3">
          <SidebarSeparator />
          <NavUser user={user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
