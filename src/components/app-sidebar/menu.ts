import {
  Building2,
  CalendarClock,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Construction,
  FileText,
  Inbox,
  Landmark,
  List,
  type LucideIcon,
  Map as MapIcon,
  MapPin,
  Megaphone,
  Smartphone,
  Store,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';

import type { UserRole } from '@/types/User';

// Each entry is a translation key under App.Menu (and App.Menu.soon for coming-soon items).
export type LinkKey = 'city_issues' | 'my_reports' | 'my_verifications' | 'open_queue' | 'my_assignments' | 'overview' | 'all_issues' | 'team' | 'citizens' | 'cities';
export type SoonKey = 'public_notices' | 'city_works' | 'mobile_app' | 'results' | 'deadlines' | 'reports' | 'departments' | 'showcase';

export type MenuLink = { key: LinkKey; href: string; icon: LucideIcon };
export type SoonItem = { key: SoonKey; icon: LucideIcon };
export type RoleMenu = { links: MenuLink[]; soon: SoonItem[] };

const RESIDENT_LINKS: MenuLink[] = [
  { key: 'city_issues', href: '/issues', icon: MapPin },
  { key: 'my_reports', href: '/issues/mine', icon: ClipboardList },
  { key: 'my_verifications', href: '/issues/verifying', icon: ClipboardCheck },
];

const MANAGER_LINKS: MenuLink[] = [
  { key: 'open_queue', href: '/issues/open', icon: Inbox },
  { key: 'my_assignments', href: '/issues/assigned', icon: Wrench },
  { key: 'overview', href: '/issues/overview', icon: MapIcon },
  { key: 'all_issues', href: '/issues', icon: List },
];

const OWNER_LINKS: MenuLink[] = [
  ...MANAGER_LINKS,
  { key: 'team', href: '/users/team', icon: Users },
  { key: 'citizens', href: '/users', icon: UserRound },
];

const CITIES_LINK: MenuLink = { key: 'cities', href: '/cities', icon: Building2 };

const MANAGER_SOON: SoonItem[] = [
  { key: 'results', icon: ChartColumn },
  { key: 'deadlines', icon: CalendarClock },
  { key: 'reports', icon: FileText },
];

export const ROLE_MENUS: Record<UserRole, RoleMenu> = {
  RESIDENT: {
    links: RESIDENT_LINKS,
    soon: [
      { key: 'public_notices', icon: Megaphone },
      { key: 'city_works', icon: Construction },
      { key: 'mobile_app', icon: Smartphone },
    ],
  },
  MANAGER: { links: MANAGER_LINKS, soon: MANAGER_SOON },
  FINANCIAL: { links: MANAGER_LINKS, soon: MANAGER_SOON },
  OWNER: {
    links: OWNER_LINKS,
    soon: [
      { key: 'results', icon: ChartColumn },
      { key: 'departments', icon: Landmark },
      { key: 'showcase', icon: Store },
      { key: 'reports', icon: FileText },
    ],
  },
  ADMIN: { links: [CITIES_LINK], soon: [] },
};

// An admin working inside a city also gets the Responsável menu.
export function menuFor(role?: UserRole, cityId?: string): RoleMenu | null {
  if (!role) {
    return null;
  }
  if (role === 'ADMIN' && cityId) {
    return { links: [CITIES_LINK, ...OWNER_LINKS], soon: [] };
  }
  return ROLE_MENUS[role];
}
