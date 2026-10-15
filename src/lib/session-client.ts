'use client';

import { useEffect, useState } from 'react';

import { signOut as clearSession } from '@/lib/auth-actions';
import type { Session } from '@/lib/session';

export type { Session };

export async function getSession(): Promise<Session | null> {
  try {
    const response = await fetch('/api/session', { cache: 'no-store' });

    return response.ok ? await response.json() as Session | null : null;
  } catch {
    return null;
  }
}

export async function signOut() {
  await clearSession();
  window.location.assign('/login');
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    getSession().then((value) => {
      if (active) {
        setSession(value);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return { data: session };
}
