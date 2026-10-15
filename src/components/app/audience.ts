export type Audience = 'citizen' | 'staff';

const STAFF_ROLES = ['ADMIN', 'OWNER', 'MANAGER', 'FINANCIAL'];

// Staff see the internal view of a status (StatusBadge). Everyone else sees the citizen view.
export function getAudience(role?: string | null): Audience {
  return role && STAFF_ROLES.includes(role) ? 'staff' : 'citizen';
}
