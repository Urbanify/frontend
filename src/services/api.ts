/* eslint-disable no-console */
import { Env } from '@/libs/Env';

// import { auth } from '@/auth';

const mainAPI = Env.API_URL ?? Env.NEXT_PUBLIC_APP_URL;

const buildURL = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') {
    const isFullURL = input.startsWith('http://') || input.startsWith('https://');

    return isFullURL ? input : new URL(input, mainAPI).toString();
  }

  return input.toString();
};

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit, _authed: boolean = true) => {
  const url = buildURL(input);
  // const authRes = authed ? await auth() : null;

  const headers = {
    'Content-Type': `application/json`,
    ...init?.headers,
    // ...(authed && authRes ? { Authorization: `Bearer ${authRes?.access_token}` } : {}),
  };

  const requestInit = {
    ...init,
    headers,
  };

  const response = await fetch(url, requestInit);

  console.log(`🚀 =====================================`);
  console.log(`🚀 REQUEST ${init?.method} ${input} ~ ${JSON.stringify(requestInit, null, 2)}`);
  console.log(`🚀 RESPONSE ~ ${JSON.stringify(response, null, 2)}`);
  return response;
};
