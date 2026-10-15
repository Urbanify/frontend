// Where a logged-in person lands. Pure, so the middleware (edge) can use it too.
export function landingPathFor(role?: string, cityId?: string): string {
  if (role === 'ADMIN' && !cityId) {
    return '/cities';
  }
  return '/inicio';
}
