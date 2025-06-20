import * as React from 'react';
import type { RefCallBack } from 'react-hook-form';

import { cn } from '@/lib/utils';

const Textarea = ({ ref, className, ...props }: React.ComponentProps<'textarea'> & { ref?: React.RefObject<HTMLTextAreaElement> | RefCallBack }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
Textarea.displayName = 'Textarea';

export { Textarea };
