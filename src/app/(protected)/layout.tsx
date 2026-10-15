import type React from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { FloatingReport } from '@/components/app-sidebar/floating-report';
import { MobileTopBar } from '@/components/app-sidebar/mobile-top-bar';
import CheckAuth from '@/components/Auth/check-auth';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar/sidebar';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

// Every protected page depends on the signed-in person (session cookie, sidebar reads the URL).
export const dynamic = 'force-dynamic';

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider>
      <CheckAuth />
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <MobileTopBar />
        <div className="relative my-4">{children}</div>
        <FloatingReport />
      </SidebarInset>
    </SidebarProvider>
  );
}
