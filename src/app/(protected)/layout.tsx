import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import CheckAuth from '@/components/Auth/check-auth';
import GlobalAds from '@/components/global-ads/global-ads';
import { Separator } from '@/components/ui/separator/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar/sidebar';

import { AdProvider } from '@/contexts/ads/ad';
import { BreadcrumbProvider } from '@/contexts/breacrumbs/breacrumbs';

import Breadcrumbs from './breadcrumbs';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider>
      <BreadcrumbProvider>
        <CheckAuth />
        <AppSidebar />
        <SidebarInset>
          <header className="fixed top-0 z-[1] mb-4 flex h-16 w-[-webkit-fill-available] flex-1 shrink-0 items-center gap-2 bg-primary-foreground">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
          </header>

          <AdProvider>
            <GlobalAds>
              {children}
            </GlobalAds>
          </AdProvider>
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
