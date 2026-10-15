import type { UserRole } from '@/types/User';

const CITY_ROLES: UserRole[] = ['OWNER', 'MANAGER', 'FINANCIAL', 'RESIDENT'];

// Roles the viewer may pick for this user, without the current role. Mirrors changeRole in
// api/src/modules/user/user.service.ts, plus the narrower rules from PAPEIS.md (5.4).
// ADMIN is never offered: it is set by an internal command and hidden from city lists.
export function assignableRoles(viewer: UserRole | undefined, target: UserRole): UserRole[] {
  if (target === 'ADMIN') {
    return [];
  }

  switch (viewer) {
    case 'ADMIN':
      return CITY_ROLES.filter(role => role !== target);
    case 'OWNER':
      return target === 'OWNER' ? [] : CITY_ROLES.filter(role => role !== target);
    case 'MANAGER':
      if (target === 'RESIDENT') {
        return ['MANAGER'];
      }
      return target === 'MANAGER' ? ['RESIDENT'] : [];
    case 'FINANCIAL':
      return target === 'RESIDENT' ? ['FINANCIAL'] : [];
    default:
      return [];
  }
}
