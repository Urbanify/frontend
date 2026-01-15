import { logger } from '@/lib/logger';
import { Env } from '@/libs/Env';

import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

const mainAPI = Env.API_URL ?? Env.NEXT_PUBLIC_API_URL;

const buildURL = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') {
    const isFullURL = input.startsWith('http://') || input.startsWith('https://');

    return isFullURL ? input : new URL(input, mainAPI).toString();
  }

  return input.toString();
};

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit, token?: string) => {
  const url = buildURL(input);
  const parsedJWT = token ? parseJwtUniversal(token) : null;
  const isAdmin = parsedJWT?.user?.role === 'ADMIN';
  const adminCityId = parsedJWT?.user?.cityId;
  const headers = {
    'Content-Type': `application/json`,
    ...init?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isAdmin && adminCityId ? { 'x-cityid': adminCityId } : {}),
  };

  const requestInit = {
    ...init,
    headers,
  };

  logger(`🚀 =====================================`);
  logger(`🚀 REQUEST ${init?.method} ${input} ~ ${JSON.stringify(requestInit, null, 2)}`);

  try {
    const response = await fetch(url, requestInit);
    logger(`🚀 RESPONSE ~ ${JSON.stringify(response, null, 2)}`);
    return response;
  } catch (error) {
    console.error(`🚀 ERROR ~ ${JSON.stringify(error, null, 2)}`);
    return Promise.reject(error);
  }
};
