'use client';
import { useContext } from 'react';

import { AdContext } from './context';

type AdMedia = {
  href: string;
  mobile: string;
  desktop: string;

};

export type Ad = {
  banner?: AdMedia;
  fixed?: AdMedia;
  vertical?: AdMedia;
  square?: AdMedia;
};

export type AdContextType = {
  currentAd: Ad;
  preloadedImages: Map<string, boolean>;
  setAdIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const useAd = (): AdContextType => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAd must be used within an AdProvider');
  }
  return context;
};
