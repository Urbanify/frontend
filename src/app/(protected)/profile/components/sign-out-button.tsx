'use client';

import { useTranslations } from 'next-intl';

import { signOut } from '@/lib/session-client';

import { Button } from '@/components/ui/button/button';

export function SignOutButton() {
  const t = useTranslations('Profile');

  return (
    <Button variant="outline" className="w-full sm:w-auto" onClick={() => signOut()}>
      {t('sign_out')}
    </Button>
  );
}
