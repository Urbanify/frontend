import { Camera, GraduationCap, HeartPulse, Landmark, type LucideIcon, Recycle, Trees } from 'lucide-react';

import type { PlaceCategory } from '@/services/api/places';

// Order of the chips and tabs: what residents use most comes first. Turismo is last.
export const PLACE_CATEGORY_ORDER: PlaceCategory[] = ['HEALTH', 'WASTE', 'EDUCATION', 'SERVICES', 'LEISURE', 'TOURISM'];

export const CATEGORY_META: Record<PlaceCategory, { label: string; icon: LucideIcon }> = {
  HEALTH: { label: 'Saúde', icon: HeartPulse },
  WASTE: { label: 'Coleta e reciclagem', icon: Recycle },
  EDUCATION: { label: 'Educação', icon: GraduationCap },
  SERVICES: { label: 'Serviços públicos', icon: Landmark },
  LEISURE: { label: 'Lazer', icon: Trees },
  TOURISM: { label: 'Turismo', icon: Camera },
};

// Lowercase and without accents, so "saude" finds "Saúde".
export const normalizeText = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Map center for a city. Brazil is the fallback when the city has no coordinates.
const BRAZIL_CENTER = { lat: -14.235, lng: -51.925 };

export const cityCenter = (city?: { latitude: string; longitude: string }) => ({
  lat: Number.parseFloat(city?.latitude ?? '') || BRAZIL_CENTER.lat,
  lng: Number.parseFloat(city?.longitude ?? '') || BRAZIL_CENTER.lng,
});
