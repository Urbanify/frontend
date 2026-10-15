import type { PlaceCategory } from '@/components/Tourist/aracaju-places';

// One hue per place category, kept apart from the issue status tones (neutral, blue, amber, green).
// Light and dark variants. Full class names, so Tailwind picks them up. Text stays neutral; the hue
// goes on the chip fill, the dot, the icon tile and the accent border. Contrast checked for AA.
type PlaceTone = {
  /** Selected chip: filled with the hue, text on top. */
  solid: string;
  /** Unselected chip: small dot. */
  dot: string;
  /** Icon inside a tinted rounded square. */
  tile: string;
  /** Accent on the detail card (left border). */
  accent: string;
};

export const PLACE_TONE: Record<PlaceCategory, PlaceTone> = {
  orla: {
    solid: 'border-transparent bg-[#0E7490] text-white dark:bg-[#22D3EE] dark:text-[#070D1C]',
    dot: 'bg-[#0E7490] dark:bg-[#22D3EE]',
    tile: 'bg-[#0E7490]/10 text-[#0E7490] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]',
    accent: 'border-l-[#0E7490] dark:border-l-[#22D3EE]',
  },
  cultura: {
    solid: 'border-transparent bg-[#4338CA] text-white dark:bg-[#A5B4FC] dark:text-[#070D1C]',
    dot: 'bg-[#4338CA] dark:bg-[#A5B4FC]',
    tile: 'bg-[#4338CA]/10 text-[#4338CA] dark:bg-[#A5B4FC]/15 dark:text-[#A5B4FC]',
    accent: 'border-l-[#4338CA] dark:border-l-[#A5B4FC]',
  },
  comer: {
    solid: 'border-transparent bg-[#A21CAF] text-white dark:bg-[#F0ABFC] dark:text-[#070D1C]',
    dot: 'bg-[#A21CAF] dark:bg-[#F0ABFC]',
    tile: 'bg-[#A21CAF]/10 text-[#A21CAF] dark:bg-[#F0ABFC]/15 dark:text-[#F0ABFC]',
    accent: 'border-l-[#A21CAF] dark:border-l-[#F0ABFC]',
  },
  lazer: {
    solid: 'border-transparent bg-[#4D7C0F] text-white dark:bg-[#BEF264] dark:text-[#070D1C]',
    dot: 'bg-[#4D7C0F] dark:bg-[#BEF264]',
    tile: 'bg-[#4D7C0F]/10 text-[#4D7C0F] dark:bg-[#BEF264]/15 dark:text-[#BEF264]',
    accent: 'border-l-[#4D7C0F] dark:border-l-[#BEF264]',
  },
};

// Map pins sit on the light map in both themes, so one hex per category.
export const PLACE_PIN: Record<PlaceCategory, string> = {
  orla: '#0E7490',
  cultura: '#4338CA',
  comer: '#A21CAF',
  lazer: '#4D7C0F',
};
