'use client';

import { useTransition } from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select/select';

import { setUserLocale } from '@/services/locale';
import type { Locale } from '@/utils/AppConfig';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string; flag?: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [_, startTransition] = useTransition();

  const handleChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="flex max-w-72 flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Select defaultValue={defaultValue} onValueChange={handleChange}>
        <SelectTrigger className="h-9 rounded-full border-border/60 bg-background/70 px-4 shadow-sm backdrop-blur transition-colors hover:bg-background">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/60 bg-popover/95 shadow-xl backdrop-blur">
          <SelectGroup>
            <SelectLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              {label}
            </SelectLabel>
            {items.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                <span className="flex items-center gap-2">
                  {lang.flag && <span aria-hidden="true">{lang.flag}</span>}
                  <span>{lang.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

  );
}
