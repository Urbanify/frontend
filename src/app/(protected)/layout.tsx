import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarFabTrigger } from '@/components/app-sidebar/sidebar-fab-trigger';
import CheckAuth from '@/components/Auth/check-auth';
import GlobalAds from '@/components/global-ads/global-ads';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar/sidebar';

import { AdProvider } from '@/contexts/ads/ad';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider>
      <CheckAuth />
      <AppSidebar />
      <SidebarInset>
        <SidebarFabTrigger />
        <AdProvider>
          <GlobalAds>
            {children}
          </GlobalAds>
        </AdProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
