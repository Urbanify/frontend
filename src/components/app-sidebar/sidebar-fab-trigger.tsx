'use client';

import { SidebarTrigger } from '@/components/ui/sidebar/sidebar';
import { useSidebar } from '@/components/ui/sidebar/useSidebar';

export function SidebarFabTrigger() {
  const { state, isMobile } = useSidebar();

  if (!isMobile && state === 'expanded') {
    return null;
  }

  return (
    <div className="fixed left-4 top-4 z-30">
      <SidebarTrigger className="size-9 rounded-full bg-background/90 shadow-md hover:bg-background" />
    </div>
  );
}
