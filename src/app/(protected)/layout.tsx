import type React from 'react';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar/sidebar';

import { BreadcrumbProvider } from '@/contexts/breacrumbs/breacrumbs';

import Breadcrumbs from './breadcrumbs';

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <SidebarProvider>
      <BreadcrumbProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="mb-4 flex h-16 shrink-0 items-center gap-2 bg-primary-foreground">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
          </header>

          {children}
        </SidebarInset>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
