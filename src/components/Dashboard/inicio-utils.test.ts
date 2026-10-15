import { attentionIssues, isStale } from './inicio-utils';

import type { Issue } from '@/types/Issue';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse('2026-10-15T12:00:00Z');

const issue = (id: string, status: Issue['status'], daysAgo: number) =>
  ({ id, status, updatedAt: new Date(now - daysAgo * DAY).toISOString() }) as Issue;

describe('inicio utils', () => {
  it('marks queue issues older than 3 days as stale, and nothing else', () => {
    expect(isStale(issue('a', 'WAITING_FOR_MANAGER', 4), now)).toBe(true);
    expect(isStale(issue('b', 'WAITING_FOR_MANAGER', 2), now)).toBe(false);
    expect(isStale(issue('c', 'SOLVED', 10), now)).toBe(false);
  });

  it('lists the queue and stale unverified issues, oldest first, at most 5', () => {
    const list = attentionIssues([
      issue('recent-queue', 'WAITING_FOR_MANAGER', 1),
      issue('old-queue', 'WAITING_FOR_MANAGER', 9),
      issue('fresh-fiscal', 'WAITING_FOR_FISCAL', 1),
      issue('stale-fiscal', 'WAITING_FOR_FISCAL', 5),
      issue('solved', 'SOLVED', 20),
    ], 5, now);

    expect(list.map(item => item.id)).toEqual(['old-queue', 'stale-fiscal', 'recent-queue']);
  });
});
