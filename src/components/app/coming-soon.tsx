'use client';

import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/tooltip';

export type ComingSoonProps = {
  label: string;
  /** One sentence on what is coming, shown in a tooltip. */
  hint: string;
  icon?: LucideIcon;
  className?: string;
};

// A menu entry that is not available yet. Not a link: it is announced as disabled.
export function ComingSoon({ label, hint, icon: Icon, className }: ComingSoonProps) {
  const t = useTranslations('App.ComingSoon');

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-disabled="true"
            className={cn('flex min-h-9 w-full cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground group-data-[collapsible=icon]:justify-center', className)}
          >
            {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
            <span className="min-w-0 flex-1 leading-5 group-data-[collapsible=icon]:hidden">{label}</span>
            <span className="shrink-0 rounded-full bg-tone-neutral-bg px-2 py-0.5 text-[13px] text-tone-neutral-fg group-data-[collapsible=icon]:hidden">
              {t('badge')}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
