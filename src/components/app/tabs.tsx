'use client';

import { cn } from '@/lib/utils';

export type TabOption<T extends string> = { value: T; label: string; count?: number };

export type TabsProps<T extends string> = {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

// Simple underlined tabs. Each tab is a toggle button, so it works with the keyboard without a tablist pattern.
export function Tabs<T extends string>({ options, value, onChange, className }: TabsProps<T>) {
  return (
    <div role="group" className={cn('flex gap-5 overflow-x-auto border-b border-line', className)}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            '-mb-px inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 text-sm font-medium transition-colors active:scale-[0.98]',
            option.value === value
              ? 'border-primary text-navy'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
          {option.count !== undefined && <span className="tabular-nums">{option.count}</span>}
        </button>
      ))}
    </div>
  );
}
