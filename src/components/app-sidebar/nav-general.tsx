import {
  ChevronRight,
  OctagonAlert,
} from 'lucide-react';
import Link from 'next/link';
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

export function NavGeneral() {
  const t = useTranslations('Components.Sidebar.General');

  const generalLinks = [
    {
      title: t('issues.title'),
      url: '/issues',
      icon: OctagonAlert,
      isActive: true,
      items: [
        {
          title: t('issues.report'),
          url: '/issues/report',
        },
        {
          title: t('issues.all'),
          url: '/issues',
        },
        {
          title: t('issues.mine'),
          url: '/issues/mine',
        },
      ],
    },
    // {
    //   title: t('crime.title'),
    //   url: '/crimes',
    //   icon: Siren,
    //   isActive: true,
    //   items: [
    //     {
    //       title: t('crime.report'),
    //       url: '/crimes/report',
    //     },
    //     {
    //       title: t('crime.all'),
    //       url: '/crimes',
    //     },
    //   ],
    // },
    // {
    //   title: t('building.title'),
    //   url: '/building',
    //   icon: Pickaxe,
    //   isActive: true,
    //   items: [
    //     {
    //       title: t('building.all'),
    //       url: '/building',
    //     },
    //   ],
    // },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('title')}</SidebarGroupLabel>
      <SidebarMenu>
        {generalLinks.map(item => (
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
