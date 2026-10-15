'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';

import { CATEGORIES, type StepProps, TYPE_OPTIONS, type TypeOption } from './draft';

export function TypeStep({ draft, onChange, onNext }: StepProps) {
  const t = useTranslations('Report.type');
  const tTypes = useTranslations('Issues.types');
  const [query, setQuery] = useState('');

  const term = query.trim().toLowerCase();
  const searchResults = term
    ? TYPE_OPTIONS.filter(option => tTypes(option.value).toLowerCase().includes(term))
    : null;
  const categoryTypes = TYPE_OPTIONS.filter(option => option.category === draft.category);

  const selectType = (option: TypeOption) => onChange({ category: option.category, type: option.value });

  return (
    <section className="space-y-6">
      <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight text-navy md:text-[28px]">
        {t('title')}
      </h1>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          aria-label={t('search_label')}
          placeholder={t('search_placeholder')}
          value={query}
          onChange={event => setQuery(event.target.value)}
          className="h-12 pl-9 text-base"
        />
      </div>

      {searchResults && (
        searchResults.length === 0
          ? <p role="status" className="text-sm text-muted-foreground">{t('no_results')}</p>
          : (
              <ul className="grid gap-2">
                {searchResults.map(option => (
                  <li key={option.value}>
                    <TypeButton
                      label={tTypes(option.value)}
                      Icon={option.icon}
                      hint={tTypes(option.category)}
                      selected={draft.type === option.value}
                      onClick={() => selectType(option)}
                    />
                  </li>
                ))}
              </ul>
            )
      )}

      {!searchResults && !draft.category && (
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(category => (
            <button
              key={category.value}
              type="button"
              onClick={() => onChange({ category: category.value, type: '' })}
              className="flex min-h-24 flex-col items-start justify-between gap-3 rounded-xl border bg-card p-4 text-left font-semibold text-navy transition-transform last:col-span-2 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
            >
              {category.icon && <category.icon className="size-6 text-muted-foreground" aria-hidden />}
              <span>{tTypes(category.value)}</span>
            </button>
          ))}
        </div>
      )}

      {!searchResults && draft.category && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t('category_label')}
              {': '}
              <span className="font-semibold text-navy">{tTypes(draft.category)}</span>
            </p>
            <Button variant="link" onClick={() => onChange({ category: '', type: '' })}>
              {t('change_category')}
            </Button>
          </div>
          <ul className="grid gap-2">
            {categoryTypes.map(option => (
              <li key={option.value}>
                <TypeButton
                  label={tTypes(option.value)}
                  Icon={option.icon}
                  selected={draft.type === option.value}
                  onClick={() => selectType(option)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button className="h-12 w-full" disabled={!draft.type} onClick={onNext}>
        {draft.type ? t('continue') : t('missing')}
      </Button>
    </section>
  );
}

type TypeButtonProps = {
  label: string;
  hint?: string;
  Icon?: TypeOption['icon'];
  selected: boolean;
  onClick: () => void;
};

function TypeButton({ label, hint, Icon, selected, onClick }: TypeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        selected ? 'border-primary bg-tone-blue-bg text-tone-blue-fg' : 'bg-card text-navy hover:bg-secondary',
      )}
    >
      {Icon && <Icon className="size-5 shrink-0" aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{label}</span>
        {hint && <span className="block text-sm text-muted-foreground">{hint}</span>}
      </span>
    </button>
  );
}
