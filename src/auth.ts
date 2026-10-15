'use server';

import { cookies } from 'next/headers';

import { isTokenValid, type Session, SESSION_COOKIE } from '@/lib/session';

export async function auth(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  return isTokenValid(token) ? { access_token: token } : null;
}
