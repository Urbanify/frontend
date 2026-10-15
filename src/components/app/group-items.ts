import dayjs from 'dayjs';

export type Group<T> = { key: string; items: T[] };

// Puts each item in the bucket its key points to. Returns only the non-empty buckets, in `order`.
export function groupItems<T>(items: T[], bucketOf: (item: T) => string, order: string[]): Group<T>[] {
  const buckets = new Map<string, T[]>(order.map(key => [key, []]));
  for (const item of items) {
    buckets.get(bucketOf(item))?.push(item);
  }

  return order
    .map(key => ({ key, items: buckets.get(key) ?? [] }))
    .filter(group => group.items.length > 0);
}

export const DATE_ORDER = ['today', 'yesterday', 'this_week', 'older'];

// Calendar-day buckets for "Hoje", "Ontem", "Esta semana" and "Antes".
export function dateBucket(iso: string, now = new Date()): string {
  const days = dayjs(now).startOf('day').diff(dayjs(iso).startOf('day'), 'day');

  if (days <= 0) {
    return 'today';
  }
  if (days === 1) {
    return 'yesterday';
  }
  if (days < 7) {
    return 'this_week';
  }
  return 'older';
}

export const WAIT_ORDER = ['over_7', '3_to_7', 'recent'];

// How long an item has been waiting, in days, for the work queue.
export function waitBucket(iso: string, now = Date.now()): string {
  const days = (now - new Date(iso).getTime()) / 86_400_000;

  if (days > 7) {
    return 'over_7';
  }
  if (days >= 3) {
    return '3_to_7';
  }
  return 'recent';
}
