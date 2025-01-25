'use client';

import { Command } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Urbanify</span>
                  <span className="truncate text-xs">
                    {isAdmin
                      ? 'ADMIN'
                      : city === null ? <Skeleton className="h-4 w-2/3" /> : city.name}

                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
          <NavUser user={parsedJWT.user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
