// Where a logged-in person lands. Pure, so the middleware (edge) can use it too.
// Residents with reports are sent to /issues/mine by the login action, which checks the API.
export function landingPathFor(role?: string, cityId?: string): string {
  if (!role || role === 'RESIDENT') {
    return '/issues';
  }
  if (role === 'ADMIN' && !cityId) {
    return '/cities';
  }
  return '/issues/open';
}
