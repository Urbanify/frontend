'use server';

import { cookies } from 'next/headers';

import { landingPathFor } from '@/lib/landing';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

import { api } from '@/services/api';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

type CodeRequestResult = { ok: true } | { ok: false; reason: 'rate_limited' | 'error' };
type VerifyResult = { ok: true; landing: string } | { ok: false; reason: 'invalid_code' | 'error' };

const postToApi = (path: string, body: object) => {
  return fetch(`${process.env.API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
};

export async function requestCode(email: string): Promise<CodeRequestResult> {
  try {
    const response = await postToApi('/auth/otp/request', { email });

    if (response.status === 429) {
      return { ok: false, reason: 'rate_limited' };
    }

    return response.ok ? { ok: true } : { ok: false, reason: 'error' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

// Residents with at least one report go to their reports; everyone else goes to their role's home.
async function landingAfterLogin(token: string): Promise<string> {
  const user = parseJwtUniversal(token)?.user;

  if (user?.role === 'RESIDENT') {
    const response = await api.instance('/issues/reported/me?page=1&take=1', { method: 'GET' }, token);
    const body = response.ok ? await response.json() as { items?: unknown[] } : null;

    if (body?.items?.length) {
      return '/issues/mine';
    }
  }

  return landingPathFor(user?.role, user?.cityId);
}

export async function verifyCode(email: string, code: string): Promise<VerifyResult> {
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, reason: 'invalid_code' };
  }

  try {
    const response = await postToApi('/auth/otp/verify', { email, code });

    if (response.status === 400) {
      return { ok: false, reason: 'invalid_code' };
    }

    const data = response.ok ? await response.json() as { token?: string } : null;

    if (!data?.token) {
      return { ok: false, reason: 'error' };
    }

    (await cookies()).set(SESSION_COOKIE, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });

    return { ok: true, landing: await landingAfterLogin(data.token) };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
}
