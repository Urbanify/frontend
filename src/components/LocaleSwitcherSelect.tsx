'use client';

import { type ChangeEventHandler, useTransition } from 'react';

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
  const [isPending, startTransition] = useTransition();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const locale = event.target.value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };

  return (
    <div className="relative">
      <h4>{label}</h4>
      <select
        defaultValue={defaultValue}
        onChange={handleChange}
        className={
          `border border-gray-300 font-medium focus:outline-none focus-visible:ring${
            isPending
          }` && 'pointer-events-none opacity-60'
        }
        aria-label="lang-switcher"
      >
        {items.map(lang => (
          <option key={lang.value} value={lang.value}>
            {lang.value === defaultValue && 'Selected '}
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
