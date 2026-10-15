import { dateBucket, groupItems, waitBucket } from './group-items';

describe('groupItems', () => {
  it('keeps the bucket order and drops empty buckets', () => {
    const groups = groupItems(['a', 'bb', 'c'], item => (item.length > 1 ? 'long' : 'short'), ['empty', 'short', 'long']);

    expect(groups).toEqual([
      { key: 'short', items: ['a', 'c'] },
      { key: 'long', items: ['bb'] },
    ]);
  });
});

describe('dateBucket', () => {
  const now = new Date(2026, 9, 15, 12);

  it('buckets by calendar day', () => {
    expect(dateBucket(new Date(2026, 9, 15, 1).toISOString(), now)).toBe('today');
    expect(dateBucket(new Date(2026, 9, 14, 23).toISOString(), now)).toBe('yesterday');
    expect(dateBucket(new Date(2026, 9, 10).toISOString(), now)).toBe('this_week');
    expect(dateBucket(new Date(2026, 8, 1).toISOString(), now)).toBe('older');
  });
});

describe('waitBucket', () => {
  const now = Date.parse('2026-10-15T12:00:00Z');
  const daysAgo = (days: number) => new Date(now - days * 86_400_000).toISOString();

  it('splits the queue by days waiting', () => {
    expect(waitBucket(daysAgo(9), now)).toBe('over_7');
    expect(waitBucket(daysAgo(3), now)).toBe('3_to_7');
    expect(waitBucket(daysAgo(1), now)).toBe('recent');
  });
});
