import type { PlaceCategory } from '@/services/api/places';

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
  HEALTH: {
    solid: 'border-transparent bg-[#BE123C] text-white dark:bg-[#FB7185] dark:text-[#070D1C]',
    dot: 'bg-[#BE123C] dark:bg-[#FB7185]',
    tile: 'bg-[#BE123C]/10 text-[#BE123C] dark:bg-[#FB7185]/15 dark:text-[#FB7185]',
    accent: 'border-l-[#BE123C] dark:border-l-[#FB7185]',
  },
  WASTE: {
    solid: 'border-transparent bg-[#0F766E] text-white dark:bg-[#2DD4BF] dark:text-[#070D1C]',
    dot: 'bg-[#0F766E] dark:bg-[#2DD4BF]',
    tile: 'bg-[#0F766E]/10 text-[#0F766E] dark:bg-[#2DD4BF]/15 dark:text-[#2DD4BF]',
    accent: 'border-l-[#0F766E] dark:border-l-[#2DD4BF]',
  },
  EDUCATION: {
    solid: 'border-transparent bg-[#7C3AED] text-white dark:bg-[#A78BFA] dark:text-[#070D1C]',
    dot: 'bg-[#7C3AED] dark:bg-[#A78BFA]',
    tile: 'bg-[#7C3AED]/10 text-[#7C3AED] dark:bg-[#A78BFA]/15 dark:text-[#A78BFA]',
    accent: 'border-l-[#7C3AED] dark:border-l-[#A78BFA]',
  },
  SERVICES: {
    solid: 'border-transparent bg-[#C2410C] text-white dark:bg-[#FB923C] dark:text-[#070D1C]',
    dot: 'bg-[#C2410C] dark:bg-[#FB923C]',
    tile: 'bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#FB923C]/15 dark:text-[#FB923C]',
    accent: 'border-l-[#C2410C] dark:border-l-[#FB923C]',
  },
  LEISURE: {
    solid: 'border-transparent bg-[#4D7C0F] text-white dark:bg-[#A3E635] dark:text-[#070D1C]',
    dot: 'bg-[#4D7C0F] dark:bg-[#A3E635]',
    tile: 'bg-[#4D7C0F]/10 text-[#4D7C0F] dark:bg-[#A3E635]/15 dark:text-[#A3E635]',
    accent: 'border-l-[#4D7C0F] dark:border-l-[#A3E635]',
  },
  TOURISM: {
    solid: 'border-transparent bg-[#0369A1] text-white dark:bg-[#38BDF8] dark:text-[#070D1C]',
    dot: 'bg-[#0369A1] dark:bg-[#38BDF8]',
    tile: 'bg-[#0369A1]/10 text-[#0369A1] dark:bg-[#38BDF8]/15 dark:text-[#38BDF8]',
    accent: 'border-l-[#0369A1] dark:border-l-[#38BDF8]',
  },
};

// Map pins sit on the light map in both themes, so one hex per category.
export const PLACE_PIN: Record<PlaceCategory, string> = {
  HEALTH: '#BE123C',
  WASTE: '#0F766E',
  EDUCATION: '#7C3AED',
  SERVICES: '#C2410C',
  LEISURE: '#4D7C0F',
  TOURISM: '#0369A1',
};

const pinCache = new Map<string, google.maps.Icon>();

// Small dot per place; the selected one is bigger with a navy ring. Cached so Marker keeps the same icon object.
export const placePinIcon = (category: PlaceCategory, selected: boolean): google.maps.Icon => {
  const key = `${category}-${selected}`;
  const cached = pinCache.get(key);
  if (cached) {
    return cached;
  }
  const size = selected ? 22 : 14;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="${PLACE_PIN[category]}" stroke="${selected ? '#000E2E' : '#FFFFFF'}" stroke-width="2"/></svg>`;
  const icon: google.maps.Icon = {
    url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, size),
    anchor: new google.maps.Point(size / 2, size / 2),
  };
  pinCache.set(key, icon);
  return icon;
};
