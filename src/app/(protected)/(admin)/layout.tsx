'use client';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { parseJwt } from '@/utils/decodeJWT';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  const parsedJWT = parseJwt(data?.access_token);
  const userRole = parsedJWT?.user?.role;
  // TODO: UPDATE HERE TO USE THE CORRECT TYPE
  const isAdmin = userRole === 'ADMIN';

  if (!parsedJWT) {
    return null;
  }

  if (parsedJWT && !isAdmin) {
    return redirect('/login');
  }

  return <>{children}</>;
}
