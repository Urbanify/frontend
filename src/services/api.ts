/* eslint-disable no-console */

import { Env } from '@/libs/Env';

const mainAPI = Env.API_URL ?? Env.NEXT_PUBLIC_APP_URL;

const buildURL = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') {
    const isFullURL = input.startsWith('http://') || input.startsWith('https://');

    return isFullURL ? input : new URL(input, mainAPI).toString();
  }

  return input.toString();
};

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit, token?: string) => {
  const url = buildURL(input);
  const headers = {
    'Content-Type': `application/json`,
    ...init?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const requestInit = {
    ...init,
    headers,
  };

  console.log(`🚀 =====================================`);
  console.log(`🚀 REQUEST ${init?.method} ${input} ~ ${JSON.stringify(requestInit, null, 2)}`);

  try {
    const response = await fetch(url, requestInit);
    console.log(`🚀 RESPONSE ~ ${JSON.stringify(response, null, 2)}`);
    return response;
  } catch (error) {
    console.error(`🚀 ERROR ~ ${JSON.stringify(error, null, 2)}`);
    return Promise.reject(error);
  }
};
