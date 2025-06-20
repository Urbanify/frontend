import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { badgeVariants } from './variants';

export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

export type BadgeProps = {} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), 'justify-center', className)} {...props} />
  );
}

export { Badge };
