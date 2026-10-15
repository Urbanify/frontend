export const SESSION_COOKIE = 'urbanify_session';
export const SESSION_MAX_AGE = 8 * 60 * 60; // 8h, same as the API JWT

export type Session = { access_token: string };

type TokenPayload = { exp?: unknown; user?: { role?: string; cityId?: string } };

// Reads the payload without checking the signature. Uses atob (not Buffer) so it also runs in the middleware (edge) runtime.
const decodePayload = (token?: string): TokenPayload | null => {
  if (!token) {
    return null;
  }

  try {
    const base64 = (token.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// Only checks the `exp` claim. The API verifies the signature on every request.
export const isTokenValid = (token?: string): token is string => {
  const payload = decodePayload(token);

  return typeof payload?.exp === 'number' && payload.exp * 1000 > Date.now();
};

export const tokenUser = (token?: string) => decodePayload(token)?.user ?? null;
