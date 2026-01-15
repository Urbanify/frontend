'use client';
import React, { useEffect, useState } from 'react';

import { AdContext } from './context';
import type { Ad } from './useAd';

const ADS_PER_BLOCK = 60;
const AD_DURATION = 30000; // 30 segundos em milissegundos
const BLOCK_DURATION = 6 * 60 * 60 * 1000; // 6 horas em milissegundos
const DAY_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

const mockAds: Ad[] = Array.from({ length: ADS_PER_BLOCK * 4 }, (_, index) => ({
  banner: {
    href: `https://www.google.com/search?q=banner-${index + 1}`,
    mobile: `https://picsum.photos/id/${index + 1}/300/100`,
    desktop: `https://picsum.photos/id/${index + 1}/728/90`,
  },
  fixed: {
    href: `https://www.google.com/search?q=fixed-${index + 1}`,
    mobile: `https://picsum.photos/id/${index + 1}/320/50`,
    desktop: `https://picsum.photos/id/${index + 1}/728/66`,
  },
  vertical: {
    href: `https://www.google.com/search?q=vertical-${index + 1}`,
    mobile: `https://picsum.photos/id/${index + 1}/120/240`,
    desktop: `https://picsum.photos/id/${index + 1}/160/600`,
  },
  square: {
    href: `https://www.google.com/search?q=square-${index + 1}`,
    mobile: `https://picsum.photos/id/${index + 1}/300`,
    desktop: `https://picsum.photos/id/${index + 1}/300`,
  },
}));

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

const getCurrentAdIndex = (_adsLength: number): number => {
  const now = Date.now();
  const timeOfDay = now % DAY_DURATION; // Horário atual em milissegundos desde o início do dia
  const blockIndex = Math.floor(timeOfDay / BLOCK_DURATION); // Índice do bloco de 6 horas (0 a 3)
  const blockStart = blockIndex * BLOCK_DURATION; // Hora de início do bloco atual
  const elapsedInBlock = timeOfDay - blockStart; // Tempo decorrido no bloco atual
  const adIndex = Math.floor(elapsedInBlock / AD_DURATION) % ADS_PER_BLOCK; // Índice do anúncio no bloco
  return blockIndex * ADS_PER_BLOCK + adIndex; // Índice global do anúncio
};

export const AdProvider = ({ children }: { children: React.ReactNode }) => {
  const [preloadedImages, setPreloadedImages] = useState<Map<string, boolean>>(new Map());
  const [currentAdIndex, setCurrentAdIndex] = useState(getCurrentAdIndex(mockAds.length));

  useEffect(() => {
    const preloadImages = () => {
      const currentAd = mockAds[currentAdIndex];
      const imageUrls = [
        currentAd?.banner?.desktop,
        currentAd?.banner?.mobile,
        currentAd?.fixed?.desktop,
        currentAd?.fixed?.mobile,
        currentAd?.vertical?.desktop,
        currentAd?.vertical?.mobile,
      ];

      imageUrls.forEach((url = '') => {
        if (!preloadedImages.has(url)) {
          loadImage(url)
            .then(() => {
              setPreloadedImages(prev => new Map(prev.set(url, true)));
            });
        }
      });
    };

    preloadImages();

    const remainingTime = AD_DURATION - (Date.now() % AD_DURATION); // Tempo restante até o próximo anúncio
    const interval = setTimeout(() => {
      setCurrentAdIndex(getCurrentAdIndex(mockAds.length));
    }, remainingTime);

    return () => clearTimeout(interval);
  }, [currentAdIndex]);

  const currentAd = mockAds[currentAdIndex] as Ad;

  return (
    <AdContext value={{ currentAd, preloadedImages, setAdIndex: setCurrentAdIndex }}>
      {children}
    </AdContext>
  );
};
