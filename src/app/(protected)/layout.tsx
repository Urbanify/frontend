import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarFabTrigger } from '@/components/app-sidebar/sidebar-fab-trigger';
import CheckAuth from '@/components/Auth/check-auth';
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
        {/* Simulated ads are hidden until the ads module exists (SPEC 4.13). */}
        <AdProvider>
          <div className="relative my-4">{children}</div>
        </AdProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
