export type Tone = 'neutral' | 'blue' | 'amber' | 'green';

export const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-tone-neutral-bg text-tone-neutral-fg',
  blue: 'bg-tone-blue-bg text-tone-blue-fg',
  amber: 'bg-tone-amber-bg text-tone-amber-fg',
  green: 'bg-tone-green-bg text-tone-green-fg',
};
