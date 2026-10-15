'use client';

import { useEffect, useState } from 'react';

import { getSession, type Session } from '@/lib/session-client';

import { parseJwt } from '@/utils/decodeJWT';

import { type Audience, getAudience } from './audience';

import type { UserRole } from '@/types/User';

// One session request per page load, shared by every badge and card on the page.
let sessionRequest: Promise<Session | null> | null = null;

const loadSession = () => {
  sessionRequest ??= getSession().then((session) => {
    if (!session) {
      sessionRequest = null;
    }
    return session;
  });
  return sessionRequest;
};

export type Viewer = {
  token?: string;
  id?: string;
  role?: UserRole;
  cityId?: string;
  audience: Audience;
};

export function useViewer(): Viewer {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    loadSession().then((value) => {
      if (active) {
        setSession(value);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const user = parseJwt(session?.access_token)?.user;

  return {
    token: session?.access_token,
    id: user?.id,
    role: user?.role,
    cityId: user?.cityId,
    audience: getAudience(user?.role),
  };
}
