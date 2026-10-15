export const SESSION_COOKIE = 'urbanify_session';
export const SESSION_MAX_AGE = 8 * 60 * 60; // 8h, same as the API JWT

export type Session = { access_token: string };

// Only checks the `exp` claim. The API verifies the signature on every request.
// Uses atob (not Buffer) so it also runs in the middleware (edge) runtime.
export const isTokenValid = (token?: string): token is string => {
  if (!token) {
    return false;
  }

  try {
    const base64 = (token.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
