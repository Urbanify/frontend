const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

const formatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });

// "há 3 dias", "ontem", "há 5 minutos". Strings come from Intl, not from br.json.
export function formatRelativeTime(date: string | Date, now = Date.now()): string {
  const seconds = Math.round((new Date(date).getTime() - now) / 1000);

  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) {
      return formatter.format(Math.round(seconds / size), unit);
    }
  }

  return formatter.format(seconds, 'second');
}
