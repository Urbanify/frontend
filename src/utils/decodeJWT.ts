'use client';
const atobUniversal = (base64: string): string => {
  /* c8 ignore start */
  if (typeof window !== 'undefined' && window.atob) {
    return window.atob(base64);
  }
  /* c8 ignore end */
  // eslint-disable-next-line node/prefer-global/buffer
  return Buffer.from(base64, 'base64').toString('binary');
};

export const parseJwt = (token?: string): ParseResponse => {
  if (!token) {
    return null;
  }
  const base64Url = token.split('.')[1] ?? '';
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atobUniversal(base64).split('').map((c) => {
    return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
  }).join(''));

  return JSON.parse(jsonPayload);
};

type ParseResponse = {
  exp: number;
  iat: number;
  // TODO: Add user properties
  user: {
    role: string;
    cityId: string | null;
  };
} | null;
