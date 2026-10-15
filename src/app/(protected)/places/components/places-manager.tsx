'use client';

import { Pencil, Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import { EmptyState } from '@/components/app/empty-state';
import { Tabs } from '@/components/app/tabs';
import { CATEGORY_META, normalizeText, PLACE_CATEGORY_ORDER } from '@/components/places/place-meta';
import { PLACE_TONE } from '@/components/Tourist/category-tone';
import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { Switch } from '@/components/ui/switch/switch';

import { api } from '@/services/api';
import type { PlaceCategory, StaffPlace } from '@/services/api/places';

type PlacesManagerProps = {
  places: StaffPlace[];
};

type CategoryFilter = 'all' | PlaceCategory;

const PAGE_SIZE = 12;

export function PlacesManager({ places: initialPlaces }: PlacesManagerProps) {
  const t = useTranslations('Places.List');
  const [places, setPlaces] = useState(initialPlaces);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const tabs = useMemo(() => [
    { value: 'all' as CategoryFilter, label: t('all'), count: places.length },
    ...PLACE_CATEGORY_ORDER.map(key => ({
      value: key as CategoryFilter,
      label: CATEGORY_META[key].label,
      count: places.filter(place => place.category === key).length,
    })),
  ], [places, t]);

  const filtered = useMemo(() => {
    const term = normalizeText(query.trim());
    return places
      .filter(place => category === 'all' || place.category === category)
      .filter(place => !term || normalizeText(`${place.name} ${place.address ?? ''}`).includes(term))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [places, category, query]);

  const changeCategory = (next: CategoryFilter) => {
    setCategory(next);
    setLimit(PAGE_SIZE);
  };

  const changeQuery = (value: string) => {
    setQuery(value);
    setLimit(PAGE_SIZE);
  };

  const togglePublished = async (place: StaffPlace, published: boolean) => {
    setPendingId(place.id);
    const response = await api.places.update(place.id, { published });
    setPendingId(null);
    if (!response.ok) {
      toast.error(t('toggle_error'));
      return;
    }
    setPlaces(list => list.map(item => (item.id === place.id ? { ...item, published } : item)));
    toast.success(published ? t('published_toast') : t('hidden_toast'));
  };

  let content;
  if (places.length === 0) {
    content = (
      <EmptyState
        title={t('empty')}
        action={(
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/places/new">{t('add_action')}</Link>
          </Button>
        )}
      />
    );
  } else if (filtered.length === 0) {
    content = <EmptyState title={t('no_results')} />;
  } else {
    content = (
      <>
        <ul className="flex flex-col gap-2">
          {filtered.slice(0, limit).map((place) => {
            const meta = CATEGORY_META[place.category];
            const Icon = meta.icon;
            return (
              <li key={place.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', PLACE_TONE[place.category].tile)}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy">{place.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {meta.label}
                      {place.address ? ` · ${place.address}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={place.published}
                      disabled={pendingId === place.id}
                      onCheckedChange={value => togglePublished(place, value)}
                      aria-label={t('switch_label', { name: place.name })}
                    />
                    <span className="w-[76px] text-sm text-muted-foreground">{place.published ? t('published') : t('hidden')}</span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/places/${place.id}`}>
                      <Pencil aria-hidden="true" />
                      {t('edit')}
                    </Link>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        {filtered.length > limit && (
          <Button variant="outline" className="h-11 w-full rounded-full" onClick={() => setLimit(value => value + PAGE_SIZE)}>
            {t('show_more')}
          </Button>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Tabs options={tabs} value={category} onChange={changeCategory} />
      <div className="relative max-w-md">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label={t('search_label')}
          placeholder={t('search_placeholder')}
          value={query}
          onChange={event => changeQuery(event.target.value)}
          className="h-11 rounded-full pl-9"
        />
      </div>
      {content}
    </div>
  );
}
