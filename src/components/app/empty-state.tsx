import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** At most one action, usually a link. */
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-12 text-center', className)}>
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-tone-blue-bg text-tone-blue-fg">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <div className="max-w-md space-y-1">
        <p className="font-semibold text-navy">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
