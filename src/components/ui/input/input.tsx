'use client';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';
import type { RefCallBack } from 'react-hook-form';

import { cn } from '@/lib/utils';

const Input = ({ ref, className, type, ...props }: React.ComponentProps<'input'> & { ref?: React.RefObject<HTMLInputElement> | RefCallBack }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const commonClassNames = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';
  const iconDisabledClasses = props.disabled ? 'cursor-not-allowed opacity-50' : '';
  if (type === 'password') {
    return (
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          className={cn(commonClassNames, className)}
          ref={ref}
          {...props}
        />
        <button
          data-testid="password-input-toggle"
          type="button"
          onClick={() => {
            !props.disabled && setShowPassword(!showPassword);
          }}
          className={cn('absolute right-2 top-2 p-1 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', iconDisabledClasses)}
        >
          {showPassword ? <EyeOff className={iconDisabledClasses} size={20} /> : <Eye className={iconDisabledClasses} size={20} />}
        </button>
      </div>
    );
  }

  return (
    <input
      type={type}
      className={cn(
        commonClassNames,
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};
Input.displayName = 'Input';

export { Input };
