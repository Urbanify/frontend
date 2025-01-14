import {
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
// import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar/sidebar';

import { parseJwt } from '@/utils/decodeJWT';

import type { UserRole } from '@/types/User';

export function NavOwner() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // const t = useTranslations('Components.Sidebar');

  const parsedJWT = parseJwt(session?.access_token);
  const userRole = parsedJWT?.user?.role as UserRole;
  // TODO: UPDATE HERE TO USE THE CORRECT TYPE
  const roles: UserRole[] = ['ADMIN', 'OWNER'];
  const isOwner = roles.includes(userRole);

  const links = [
    {
      title: 'OWNER LINKS',
      url: '/',
      // icon: Building2,
      isActive: true,
      items: [
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

  if (loading || !isOwner) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* <SidebarGroupLabel>{t('title')}</SidebarGroupLabel> */}
      <SidebarGroupLabel>Owner</SidebarGroupLabel>
      <SidebarMenu>
        {links.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url}>
                {/* <item.icon /> */}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction>
              <ChevronRight />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
