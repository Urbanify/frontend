'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover/popover';

export type ComboboxProps = {
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
};

export function Combobox({ options, placeholder, setValue, value }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations('Components.Combobox');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value
            ? options.find(option => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={(value, search) => {
          const sanitizedSearch = search.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            '\\$&',
          );

          const searchRegex = new RegExp(
            sanitizedSearch,
            'i',
          );

          /* c8 ignore start */
          const optionLabel
          = options.find(
            option => option.value === value,
          )?.label || '';
          /* c8 ignore end */

          return searchRegex.test(optionLabel) ? 1 : 0;
        }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{t('not_found')}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  /* c8 ignore start */
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  /* c8 ignore end */
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
