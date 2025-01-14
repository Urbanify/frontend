'use client';
import type { ReactNode } from 'react';

import { useAd } from '@/contexts/ads/useAd';

import { FixedAd } from '../ui/ads/fixed';

type GlobalAdsProps = {
  children: ReactNode;
};

export default function GlobalAds({ children }: GlobalAdsProps) {
  const { currentAd } = useAd();

  return (
    <div className="relative my-20">
      <FixedAd
        href={currentAd?.fixed?.href ?? ''}
        desktopMedia={currentAd?.fixed?.desktop ?? ''}
        mobileMedia={currentAd?.fixed?.mobile ?? ''}
      />
      {children}
    </div>
  );
}
