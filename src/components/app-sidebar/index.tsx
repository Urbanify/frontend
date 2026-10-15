'use client';

import { ChevronDown, Landmark, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { departmentBySlug, DEPARTMENTS } from '@/lib/departments';
import { cn } from '@/lib/utils';

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
  const searchParams = useSearchParams();
  const t = useTranslations('App');
  const menu = menuFor(viewer.role, viewer.cityId);
  const user = parseJwt(viewer.token)?.user;

  // A department page is /issues?secretaria=<slug>. Its group opens by itself.
  const department = pathname === '/issues' ? departmentBySlug(searchParams.get('secretaria')) : undefined;
  const [departmentsOpen, setDepartmentsOpen] = useState(!!department);
  useEffect(() => {
    if (department) {
      setDepartmentsOpen(true);
    }
  }, [department]);

  // Anyone who works in a city can report, staff included. An admin needs a city first.
  const canReport = !!viewer.role && (viewer.role !== 'ADMIN' || !!viewer.cityId);

  // Highlight the longest menu link that contains the current page. Report and department pages keep no highlight.
  const activeHref = (pathname.startsWith('/issues/report') || department)
    ? undefined
    : menu?.links
      .map(link => link.href)
      .filter(href => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b.length - a.length)[0];

  return (
    <Sidebar className="px-0" variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:flex-col">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
            <Image src="/logo.svg" alt="Urbanify" width={32} height={32} className="size-8 shrink-0" />
            <span className="grid min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-semibold">Urbanify</span>
              <CityName className="text-[13px] text-muted-foreground" />
            </span>
          </Link>
          <SidebarTrigger className="hidden md:inline-flex" aria-label={t('Header.toggle_menu')} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {canReport && (
          <Button
            asChild
            variant={viewer.audience === 'citizen' ? 'default' : 'outline'}
            className="mb-3 w-full justify-start gap-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          >
            <Link href="/issues/report" aria-label={t('Menu.report')}>
              <Plus aria-hidden />
              <span className="group-data-[collapsible=icon]:hidden">{t('Menu.report')}</span>
            </Link>
          </Button>
        )}

        {menu && (
          <SidebarGroup className="p-0">
            <nav aria-label={t('Menu.label')}>
              <SidebarMenu>
                {menu.links.map(link => (
                  <SidebarMenuItem key={link.key}>
                    <SidebarMenuButton asChild isActive={link.href === activeHref} className="h-10" tooltip={t(`Menu.${link.key}`)}>
                      <Link href={link.href} aria-current={link.href === activeHref ? 'page' : undefined}>
                        <link.icon aria-hidden />
                        <span className="group-data-[collapsible=icon]:hidden">{t(`Menu.${link.key}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroup>
        )}

        {menu?.departments && (
          <SidebarMenu className="mt-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-10"
                tooltip={t('Menu.departments')}
                aria-expanded={departmentsOpen}
                onClick={() => setDepartmentsOpen(open => !open)}
              >
                <Landmark aria-hidden />
                <span className="flex-1 text-left group-data-[collapsible=icon]:hidden">{t('Menu.departments')}</span>
                <ChevronDown aria-hidden className={cn('size-4 transition-transform group-data-[collapsible=icon]:hidden', departmentsOpen && 'rotate-180')} />
              </SidebarMenuButton>
            </SidebarMenuItem>
            {departmentsOpen && (
              <>
                <SidebarMenuItem className="px-2 pb-1 text-[13px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                  {t('Menu.departments_hint')}
                </SidebarMenuItem>
                {DEPARTMENTS.map(item => (
                  <SidebarMenuItem key={item.slug} className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton asChild isActive={department === item} className="h-9 pl-9">
                      <Link href={`/issues?secretaria=${item.slug}`}>{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
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
