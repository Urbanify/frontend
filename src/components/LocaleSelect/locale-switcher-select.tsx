'use client';

import { useTransition } from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select/select';

import { setUserLocale } from '@/services/locale';
import type { Locale } from '@/utils/AppConfig';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
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
    <div className="max-w-fit">
      <span>{label}</span>
      <Select defaultValue={defaultValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

  );
}
