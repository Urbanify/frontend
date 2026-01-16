import { BadgeAlert, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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

import type { UserRole } from '@/types/User';

export function NavManager() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('Components.Sidebar.Manager');
  const tPeople = useTranslations('Components.Sidebar.People');
  const tCommon = useTranslations('Components.Sidebar.Common');

  const parsedJWT = parseJwt(session?.access_token);
  const userRole = parsedJWT?.user?.role as UserRole;
  const roles: UserRole[] = ['ADMIN', 'OWNER', 'MANAGER', 'FINANCIAL'];
  const isManager = roles.includes(userRole);

  const links = [
    {
      title: t('open_issues'),
      url: '/issues/open',
      icon: BadgeAlert,
    },
    {
      title: tPeople('title'),
      url: '/users',
      icon: Users,
      items: [
        {
          title: tPeople('users'),
          url: '/users',
        },
        {
          title: tPeople('team'),
          url: '/users/team',
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setSession(session);
      setLoading(false);
    };
    fetchSession();
  }, []);

  if (loading || !isManager) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
      <SidebarMenu>
        {links.map(item => (
          <Collapsible key={item.title} asChild defaultOpen={item.url === '/users'}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon ? <item.icon /> : null}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
              {item.items?.length
                ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">{tCommon('toggle')}</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map(subItem => (
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
                : (
                    <SidebarMenuAction>
                      <ChevronRight />
                      <span className="sr-only">{tCommon('more')}</span>
                    </SidebarMenuAction>
                  )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
