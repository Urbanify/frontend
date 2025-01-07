import type React from 'react';

import LocaleSwitcher from '@/components/LocaleSelect';

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="relative">
      <div className="absolute right-4 top-2">
        <LocaleSwitcher />
      </div>
      {children}
    </div>
  );
}
