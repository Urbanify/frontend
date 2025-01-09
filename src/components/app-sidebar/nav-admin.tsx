'use client';

import {
  Building2,
  ChevronRight,
  Flag,
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar/sidebar';

import { parseJwt } from '@/utils/decodeJWT';

export function NavAdmin() {
  const t = useTranslations('Components.Sidebar.Admin');
  const { data } = useSession();

  const parsedJWT = parseJwt(data?.access_token);
  const userRole = parsedJWT?.user?.role;
  // TODO: UPDATE HERE TO USE THE CORRECT TYPE
  const isAdmin = userRole === 'ADMIN';

  const adminLinks = [
    {
      title: t('cities.title'),
      url: '/cities',
      icon: Building2,
      isActive: true,
      items: [
        {
          title: t('cities.create'),
          url: '/cities/create',
        },
        {
          title: t('cities.list'),
          url: '/cities',
        },
      ],
    },
    {
      title: t('features.title'),
      url: '/features',
      icon: Flag,
      isActive: true,
      items: [
        {
          title: t('features.create'),
          url: '/features/create',
        },
        {
          title: t('features.list'),
          url: '/features',
        },
      ],
    },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
      <SidebarMenu>
        {adminLinks.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length
                ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map(subItem => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  )
                : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
