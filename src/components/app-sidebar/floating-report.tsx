'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { useViewer } from '@/components/app/use-viewer';
import { buttonVariants } from '@/components/ui/button/variants';

// Mobile only: a citizen can report from any screen with one thumb. Hidden where the button is already on screen.
export function FloatingReport() {
  const t = useTranslations('App.Menu');
  const viewer = useViewer();
  const pathname = usePathname();

  if (viewer.role !== 'RESIDENT' || pathname === '/inicio' || pathname.startsWith('/issues/report')) {
    return null;
  }

  return (
    <Link
      href="/issues/report"
      className={cn(buttonVariants({ size: 'lg' }), 'fixed bottom-4 right-4 z-30 rounded-full shadow-float md:hidden')}
    >
      <Plus aria-hidden />
      {t('report')}
    </Link>
  );
}
