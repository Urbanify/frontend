'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Button } from '@/components/ui/button/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar/sidebar';
import { Skeleton } from '@/components/ui/skeleton/skeleton';

import { api } from '@/services/api';
import { parseJwt } from '@/utils/decodeJWT';

import { NavAdmin } from './nav-admin';
import { NavFinancial } from './nav-financial';
import { NavGeneral } from './nav-general';
import { NavManager } from './nav-manager';
import { NavOwner } from './nav-owner';
import { NavUser } from './nav-user';

import type { City } from '@/types/City';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useSession();
  const t = useTranslations('Components.Sidebar.General.issues');
  const [city, setCity] = React.useState<City | null>(null);

  const parsedJWT = parseJwt(data?.access_token);
  const role = parsedJWT?.user?.role;
  const cityId = parsedJWT?.user?.cityId ?? '';
  const isAdmin = role === 'ADMIN';

  React.useEffect(() => {
    const fetchCity = async () => {
      if (cityId) {
        const response = await api.instance(`/cities/${cityId}`, {
          method: 'GET',
        }, data?.access_token);

        if (response.status === 401) {
          return signOut({
            redirect: true,
            redirectTo: '/login',
          });
        }

        if (response.ok) {
          const userCity = await response.json() as City;
          setCity(userCity);
        }
      }
    };
    fetchCity();
  }, [cityId]);

  return (
    <Sidebar className="px-0" variant="inset" {...props}>
      <SidebarHeader className="gap-3 border-b border-sidebar-border/60 px-3 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-sidebar-primary/15 text-sidebar-primary-foreground">
              <Image src="/logo.svg" alt="Urbanify" width={24} height={24} />
            </div>
            <div className="grid text-left text-sm leading-tight">
              <span className="truncate font-semibold">Urbanify</span>
              <span className="truncate text-xs text-sidebar-foreground/70">
                {isAdmin
                  ? 'ADMIN'
                  : city === null ? <Skeleton className="h-4 w-2/3" /> : city.name}
              </span>
            </div>
          </Link>
          <SidebarTrigger className="hidden md:inline-flex" />
        </div>
        <Button asChild size="sm" className="w-full justify-start gap-2">
          <Link href="/issues/report">
            <Plus className="size-4" />
            {t('report')}
          </Link>
        </Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavGeneral />
        <NavFinancial />
        <NavManager />
        <NavOwner />
        <NavAdmin />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      {!!parsedJWT?.user && (
        <SidebarFooter>
          <SidebarSeparator />
          <NavUser user={parsedJWT.user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
