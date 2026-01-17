import {
  AlertTriangle,
  BadgeAlert,
  Briefcase,
  Car,
  Hand,
  HelpCircle,
  ShieldAlert,
  Siren,
  Skull,
  Sword,
  TrafficCone,
  Users,
  Wallet,
} from 'lucide-react';

import type { ComboboxOptions } from '@/components/ui/combobox/combobox';

export type CrimeCategory =
  | 'VIOLENCE'
  | 'THEFT'
  | 'VANDALISM'
  | 'FRAUD'
  | 'DRUGS'
  | 'TRAFFIC'
  | 'DOMESTIC'
  | 'OTHER';

export type CrimeType =
  | 'ASSAULT'
  | 'ROBBERY'
  | 'ARMED_ROBBERY'
  | 'THREAT'
  | 'BURGLARY'
  | 'VEHICLE_THEFT'
  | 'PICKPOCKET'
  | 'VANDALISM_PROPERTY'
  | 'GRAFFITI'
  | 'PUBLIC_DAMAGE'
  | 'SCAM'
  | 'DOCUMENT_FRAUD'
  | 'CARD_FRAUD'
  | 'DRUG_TRAFFICKING'
  | 'DRUG_USE'
  | 'DUI'
  | 'TRAFFIC_ACCIDENT'
  | 'DANGEROUS_DRIVING'
  | 'DOMESTIC_VIOLENCE'
  | 'NEIGHBORHOOD_CONFLICT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'OTHER_CRIME';

export const crimeCategories: ComboboxOptions = [
  { value: 'VIOLENCE', label: 'Crimes.types.VIOLENCE', isHeading: true, icon: ShieldAlert },
  { value: 'ASSAULT', label: 'Crimes.types.ASSAULT', icon: Hand },
  { value: 'ROBBERY', label: 'Crimes.types.ROBBERY', icon: Wallet },
  { value: 'ARMED_ROBBERY', label: 'Crimes.types.ARMED_ROBBERY', icon: Sword },
  { value: 'THREAT', label: 'Crimes.types.THREAT', icon: AlertTriangle },

  { value: 'THEFT', label: 'Crimes.types.THEFT', isHeading: true, icon: Briefcase },
  { value: 'BURGLARY', label: 'Crimes.types.BURGLARY', icon: Briefcase },
  { value: 'VEHICLE_THEFT', label: 'Crimes.types.VEHICLE_THEFT', icon: Car },
  { value: 'PICKPOCKET', label: 'Crimes.types.PICKPOCKET', icon: Wallet },

  { value: 'VANDALISM', label: 'Crimes.types.VANDALISM', isHeading: true, icon: BadgeAlert },
  { value: 'VANDALISM_PROPERTY', label: 'Crimes.types.VANDALISM_PROPERTY', icon: BadgeAlert },
  { value: 'GRAFFITI', label: 'Crimes.types.GRAFFITI', icon: BadgeAlert },
  { value: 'PUBLIC_DAMAGE', label: 'Crimes.types.PUBLIC_DAMAGE', icon: BadgeAlert },

  { value: 'FRAUD', label: 'Crimes.types.FRAUD', isHeading: true, icon: Briefcase },
  { value: 'SCAM', label: 'Crimes.types.SCAM', icon: Briefcase },
  { value: 'DOCUMENT_FRAUD', label: 'Crimes.types.DOCUMENT_FRAUD', icon: Briefcase },
  { value: 'CARD_FRAUD', label: 'Crimes.types.CARD_FRAUD', icon: Briefcase },

  { value: 'DRUGS', label: 'Crimes.types.DRUGS', isHeading: true, icon: Skull },
  { value: 'DRUG_TRAFFICKING', label: 'Crimes.types.DRUG_TRAFFICKING', icon: Skull },
  { value: 'DRUG_USE', label: 'Crimes.types.DRUG_USE', icon: Skull },

  { value: 'TRAFFIC', label: 'Crimes.types.TRAFFIC', isHeading: true, icon: TrafficCone },
  { value: 'DUI', label: 'Crimes.types.DUI', icon: TrafficCone },
  { value: 'TRAFFIC_ACCIDENT', label: 'Crimes.types.TRAFFIC_ACCIDENT', icon: TrafficCone },
  { value: 'DANGEROUS_DRIVING', label: 'Crimes.types.DANGEROUS_DRIVING', icon: TrafficCone },

  { value: 'DOMESTIC', label: 'Crimes.types.DOMESTIC', isHeading: true, icon: Users },
  { value: 'DOMESTIC_VIOLENCE', label: 'Crimes.types.DOMESTIC_VIOLENCE', icon: Users },
  { value: 'NEIGHBORHOOD_CONFLICT', label: 'Crimes.types.NEIGHBORHOOD_CONFLICT', icon: Users },

  { value: 'OTHER', label: 'Crimes.types.OTHER', isHeading: true, icon: Siren },
  { value: 'SUSPICIOUS_ACTIVITY', label: 'Crimes.types.SUSPICIOUS_ACTIVITY', icon: HelpCircle },
  { value: 'OTHER_CRIME', label: 'Crimes.types.OTHER_CRIME', icon: HelpCircle },
];

export type CrimeReport = {
  id: string;
  cityId: string;
  category: CrimeCategory;
  type: CrimeType;
  address: string;
  latitude: string;
  longitude: string;
  happenedAt: string;
  description: string;
  createdAt: string;
};
