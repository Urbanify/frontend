import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { MobileTopBar } from '@/components/app-sidebar/mobile-top-bar';
import CheckAuth from '@/components/Auth/check-auth';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar/sidebar';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider>
      <CheckAuth />
      <AppSidebar />
      <SidebarInset>
        <MobileTopBar />
        <div className="relative my-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
