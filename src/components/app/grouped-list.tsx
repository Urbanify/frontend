'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';

export type ListGroup<T> = { key: string; label?: string; items: T[] };

export type GroupedListProps<T> = {
  groups: ListGroup<T>[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  /** Items shown per step, counted across all groups. */
  pageSize?: number;
  /** Classes for each group's list, for example a photo grid. */
  listClassName?: string;
};

// Shows the first `pageSize` items, with a group heading above each visible group, and a "Mostrar mais" button.
export function GroupedList<T>({ groups, getKey, renderItem, pageSize = 12, listClassName }: GroupedListProps<T>) {
  const t = useTranslations('App.Lists');
  const [shown, setShown] = useState(pageSize);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  let budget = shown;
  const visible = groups
    .map((group) => {
      const items = group.items.slice(0, budget);
      budget -= items.length;
      return { ...group, items };
    })
    .filter(group => group.items.length > 0);

  return (
    <div className="space-y-6">
      {visible.map(group => (
        <section key={group.key} className="space-y-3">
          {group.label && <h2 className="text-sm font-semibold text-muted-foreground">{group.label}</h2>}
          <ul className={cn('grid grid-cols-[minmax(0,1fr)] gap-3', listClassName)}>
            {group.items.map(item => (
              <li key={getKey(item)}>{renderItem(item)}</li>
            ))}
          </ul>
        </section>
      ))}

      {total > shown && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setShown(shown + pageSize)}>
            {t('show_more')}
          </Button>
        </div>
      )}
    </div>
  );
}
