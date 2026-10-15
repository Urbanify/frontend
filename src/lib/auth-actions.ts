'use server';

import { cookies } from 'next/headers';

import { landingPathFor } from '@/lib/landing';
import { SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';

import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

type CodeRequestResult = { ok: true } | { ok: false; reason: 'rate_limited' | 'error' };
type VerifyResult =
  | { ok: true; landing: string }
  | { ok: true; needsSignup: true; signupToken: string }
  | { ok: false; reason: 'invalid_code' | 'error' };
type SignupResult = { ok: true; landing: string } | { ok: false; reason: 'invalid' | 'already_registered' | 'error' };

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

// Stores the session cookie and returns where this person lands.
async function startSession(token: string): Promise<string> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  const user = parseJwtUniversal(token)?.user;

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

    const data = response.ok ? await response.json() as { token?: string; signupToken?: string } : null;

    // New email: no session yet, the form asks for name, surname and city first.
    if (data?.signupToken) {
      return { ok: true, needsSignup: true, signupToken: data.signupToken };
    }

    if (!data?.token) {
      return { ok: false, reason: 'error' };
    }

    return { ok: true, landing: await startSession(data.token) };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function completeSignup(signupToken: string, name: string, surname: string, cityId: string): Promise<SignupResult> {
  try {
    const response = await postToApi('/auth/signup', { signupToken, name, surname, cityId });

    if (response.status === 409) {
      return { ok: false, reason: 'already_registered' };
    }

    if (response.status === 400) {
      return { ok: false, reason: 'invalid' };
    }

    const data = response.ok ? await response.json() as { token?: string } : null;

    if (!data?.token) {
      return { ok: false, reason: 'error' };
    }

    return { ok: true, landing: await startSession(data.token) };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
}
