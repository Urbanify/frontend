import { formatRelativeTime } from './relative-time';

describe('formatRelativeTime', () => {
  const now = Date.parse('2026-10-15T12:00:00Z');

  it('formats days in pt-BR', () => {
    expect(formatRelativeTime('2026-10-12T12:00:00Z', now)).toBe('há 3 dias');
  });

  it('uses the largest unit that fits', () => {
    expect(formatRelativeTime('2026-10-15T11:00:00Z', now)).toBe('há 1 hora');
    expect(formatRelativeTime('2026-10-15T11:55:00Z', now)).toBe('há 5 minutos');
  });

  it('uses seconds below a minute and "agora" for now', () => {
    expect(formatRelativeTime('2026-10-15T11:59:45Z', now)).toBe('há 15 segundos');
    expect(formatRelativeTime(new Date(now), now)).toBe('agora');
  });
});
