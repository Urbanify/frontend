import { redirect } from 'next/navigation';
import type React from 'react';

import { auth } from '@/auth';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

type PlacesLayoutProps = {
  children: React.ReactNode;
};

// OWNER, and ADMIN inside a city. Everyone else goes back to the home screen.
export default async function PlacesLayout({ children }: PlacesLayoutProps) {
  const session = await auth();
  const viewer = parseJwtUniversal(session?.access_token)?.user;
  const canManage = viewer?.role === 'OWNER' || (viewer?.role === 'ADMIN' && !!viewer.cityId);

  if (!canManage) {
    redirect('/inicio');
  }

  return children;
}
