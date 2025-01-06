/* eslint-disable no-console */
import { auth } from '@/auth';

const mainAPI = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const buildURL = (input: RequestInfo | URL): string => {
  if (typeof input === 'string') {
    const isFullURL = input.startsWith('http://') || input.startsWith('https://');

    return isFullURL ? input : new URL(input, mainAPI).toString();
  }

  return input.toString();
};

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit, authed: boolean = true) => {
  const url = buildURL(input);
  const authRes = authed ? await auth() : null;

  const headers = {
    ...init?.headers,
    ...(authed && authRes ? { Authorization: `Bearer ${authRes?.access_token}` } : {}),
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
