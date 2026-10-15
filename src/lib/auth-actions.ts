'use server';

import { cookies } from 'next/headers';

import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

type CodeRequestResult = { ok: true } | { ok: false; reason: 'rate_limited' | 'error' };
type VerifyResult = { ok: true } | { ok: false; reason: 'invalid_code' | 'error' };

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

    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
}
