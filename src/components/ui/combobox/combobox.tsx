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

export type ComboboxOptions = {
  value: string;
  label: string;
  isHeading?: boolean;
}[];

export type ComboboxProps = {
  options: ComboboxOptions;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  popoverClassName?: string;
  shouldTranslate?: boolean;
};

export function Combobox({
  options,
  placeholder,
  setValue,
  value,
  popoverClassName,
  shouldTranslate = true,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations('Components.Combobox');
  const labelTranslated = useTranslations();
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  const getLabel = (label: string) => {
    return shouldTranslate ? labelTranslated(label as any) : label;
  };

  const handleFilter = (search: string) => {
    const sanitizedSearch = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const searchRegex = new RegExp(sanitizedSearch, 'i');

    const filtered = options.filter((option) => {
      if (option.isHeading) {
        return true;
      }
      return searchRegex.test(getLabel(option.label ?? ''));
    },
    );

    setFilteredOptions(filtered);
  };

  const getGroupedOptions = () => {
    const groups: { heading: string | null; options: ComboboxOptions }[] = [];
    let currentGroup: { heading: string | null; options: ComboboxOptions } | null = null;

    filteredOptions.forEach((option) => {
      if (option.isHeading) {
        // Iniciar um novo grupo, se for um heading
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { heading: option.label, options: [] };
      } else {
        // Adicionar a opção ao grupo atual
        if (!currentGroup) {
          // Se não há grupo, criamos um "grupo sem heading" para as opções soltas
          currentGroup = { heading: null, options: [] };
        }
        currentGroup.options.push(option);
      }
    });

    // Adicionar o último grupo ao array
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  };

  const groupedOptions = getGroupedOptions();

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? '' : currentValue);
    setOpen(false);
    setFilteredOptions(options);
  };

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
            ? getLabel(
                options.find(option => option.value === value)?.label ?? '',
              )
            : placeholder}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-[200px] p-0', popoverClassName)}>
        <Command
          shouldFilter={false}
        >
          <CommandInput placeholder={placeholder} onValueChange={handleFilter} />
          <CommandList className="max-h-[165px] sm:max-h-[300px]">
            <CommandEmpty>{t('not_found')}</CommandEmpty>
            {groupedOptions
              .filter(group => group.options.length > 0)
              .map((group, index) => (
                <CommandGroup
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${group.heading}-${index}`}
                  heading={group.heading ? getLabel(group.heading ?? '') : undefined}
                >
                  {group.options.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={v => handleSelect(v)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {getLabel(option.label ?? '')}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
