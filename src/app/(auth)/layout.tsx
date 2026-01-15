import type React from 'react';

import LocaleSwitcher from '@/components/LocaleSelect';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative">
      <div className="fixed right-4 top-4 z-50">
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  );
}
