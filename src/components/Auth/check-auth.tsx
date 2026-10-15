'use client';

import { useEffect } from 'react';

import { checkUser } from '@/lib/loaders/checkUser';
import { signOut, useSession } from '@/lib/session-client';

import { parseJwt } from '@/utils/decodeJWT';

export default function CheckAuth() {
  const { data } = useSession();

  const parsedJWT = parseJwt(data?.access_token);
  const role = parsedJWT?.user?.role;
  const cityId = parsedJWT?.user?.cityId ?? '';
  const isAdmin = role === 'ADMIN';

  const checkIsAuthed = async () => {
    const response = await checkUser({
      token: data?.access_token ?? '',
      cityId,
      isAdmin,
    });

    if (response.status === 401) {
      return signOut();
    }
  };

  useEffect(() => {
    if (parsedJWT) {
      checkIsAuthed();
    }
  }, [parsedJWT]);

  return null;
}
