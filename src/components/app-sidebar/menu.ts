import {
  Building2,
  CalendarClock,
  ChartColumn,
  ClipboardCheck,
  ClipboardList,
  Construction,
  FileText,
  House,
  Inbox,
  List,
  type LucideIcon,
  Map as MapIcon,
  MapPin,
  MapPinned,
  Megaphone,
  ShieldAlert,
  Smartphone,
  Store,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';

import type { UserRole } from '@/types/User';

// Each entry is a translation key under App.Menu (and App.Menu.soon for coming-soon items).
export type LinkKey = 'home' | 'city_issues' | 'my_reports' | 'my_verifications' | 'open_queue' | 'my_assignments' | 'overview' | 'all_issues' | 'team' | 'citizens' | 'places' | 'cities';
export type SoonKey = 'public_notices' | 'city_works' | 'mobile_app' | 'neighborhood_safety' | 'safety_map' | 'results' | 'deadlines' | 'reports' | 'showcase';

export type MenuLink = { key: LinkKey; href: string; icon: LucideIcon };
export type SoonItem = { key: SoonKey; icon: LucideIcon };
export type RoleMenu = { links: MenuLink[]; soon: SoonItem[]; departments: boolean };

const HOME_LINK: MenuLink = { key: 'home', href: '/inicio', icon: House };

const RESIDENT_LINKS: MenuLink[] = [
  HOME_LINK,
  { key: 'city_issues', href: '/issues', icon: MapPin },
  { key: 'my_reports', href: '/issues/mine', icon: ClipboardList },
  { key: 'my_verifications', href: '/issues/verifying', icon: ClipboardCheck },
];

const MANAGER_LINKS: MenuLink[] = [
  HOME_LINK,
  { key: 'open_queue', href: '/issues/open', icon: Inbox },
  { key: 'my_assignments', href: '/issues/assigned', icon: Wrench },
  { key: 'overview', href: '/issues/overview', icon: MapIcon },
  { key: 'all_issues', href: '/issues', icon: List },
];

// The Responsável does not take issues in v2, so "Meus atendimentos" stays with the manager.
const OWNER_LINKS: MenuLink[] = [
  ...MANAGER_LINKS.filter(link => link.key !== 'my_assignments'),
  { key: 'team', href: '/users/team', icon: Users },
  { key: 'citizens', href: '/users', icon: UserRound },
  { key: 'places', href: '/places', icon: MapPinned },
];

const CITIES_LINK: MenuLink = { key: 'cities', href: '/cities', icon: Building2 };

const MANAGER_SOON: SoonItem[] = [
  { key: 'safety_map', icon: ShieldAlert },
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
      { key: 'neighborhood_safety', icon: ShieldAlert },
      { key: 'mobile_app', icon: Smartphone },
    ],
    departments: false,
  },
  MANAGER: { links: MANAGER_LINKS, soon: MANAGER_SOON, departments: true },
  FINANCIAL: { links: MANAGER_LINKS, soon: MANAGER_SOON, departments: true },
  OWNER: {
    links: OWNER_LINKS,
    soon: [
      { key: 'safety_map', icon: ShieldAlert },
      { key: 'results', icon: ChartColumn },
      { key: 'showcase', icon: Store },
      { key: 'reports', icon: FileText },
    ],
    departments: true,
  },
  ADMIN: { links: [CITIES_LINK], soon: [], departments: false },
};

// An admin working inside a city also gets the Responsável menu.
export function menuFor(role?: UserRole, cityId?: string): RoleMenu | null {
  if (!role) {
    return null;
  }
  if (role === 'ADMIN' && cityId) {
    return { links: [CITIES_LINK, ...OWNER_LINKS], soon: ROLE_MENUS.OWNER.soon, departments: true };
  }
  return ROLE_MENUS[role];
}
