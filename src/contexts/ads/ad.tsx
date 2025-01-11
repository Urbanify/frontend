'use client';
import React, { useEffect, useState } from 'react';

import { AdContext } from './context';
import type { Ad } from './useAd';

const DEFAULT_TIMEOUT = 30000;

const mockAds: Ad[] = [
  {
    banner: {
      href: 'https://www.google.com/search?q=banner-1',
      mobile: 'https://picsum.photos/id/1/300/100',
      desktop: 'https://picsum.photos/id/1/728/90',
    },
    fixed: {
      href: 'https://www.google.com/search?q=fixed-1',
      mobile: 'https://picsum.photos/id/1/320/50',
      desktop: 'https://picsum.photos/id/1/728/66',
    },
    vertical: {
      href: 'https://www.google.com/search?q=vertical-1',
      mobile: 'https://picsum.photos/id/1/120/240',
      desktop: 'https://picsum.photos/id/1/160/600',
    },
  },
  {
    banner: {
      href: 'https://www.google.com/search?q=banner-2',
      mobile: 'https://picsum.photos/id/2/300/100',
      desktop: 'https://picsum.photos/id/2/728/90',
    },
    fixed: {
      href: 'https://www.google.com/search?q=fixed-2',
      mobile: 'https://picsum.photos/id/2/320/50',
      desktop: 'https://picsum.photos/id/2/728/66',
    },
    vertical: {
      href: 'https://www.google.com/search?q=vertical-2',
      mobile: 'https://picsum.photos/id/2/120/240',
      desktop: 'https://picsum.photos/id/2/160/600',
    },
  },
  {
    banner: {
      href: 'https://www.google.com/search?q=banner-3',
      mobile: 'https://picsum.photos/id/3/300/100',
      desktop: 'https://picsum.photos/id/3/728/90',
    },
    fixed: {
      href: 'https://www.google.com/search?q=fixed-3',
      mobile: 'https://picsum.photos/id/3/320/50',
      desktop: 'https://picsum.photos/id/3/728/66',
    },
    vertical: {
      href: 'https://www.google.com/search?q=vertical-3',
      mobile: 'https://picsum.photos/id/3/120/240',
      desktop: 'https://picsum.photos/id/3/160/600',
    },
  },
];

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const AdProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Map<string, boolean>>(new Map());

  // TODO: THIS SHOULD COME FROM API
  const ads = mockAds;

  useEffect(() => {
    const currentAd = ads[currentAdIndex];
    const imageUrls = [
      currentAd?.square?.desktop,
      currentAd?.square?.mobile,
      currentAd?.banner?.desktop,
      currentAd?.banner?.mobile,
      currentAd?.fixed?.desktop,
      currentAd?.fixed?.mobile,
      currentAd?.vertical?.desktop,
      currentAd?.vertical?.mobile,
    ];

    // Pré-carregar as imagens em segundo plano
    imageUrls.forEach((url = '') => {
      if (!preloadedImages.has(url)) {
        loadImage(url)
          .then(() => {
            setPreloadedImages(prev => new Map(prev.set(url, true)));
          })
          .catch(err => console.error(`Erro ao carregar a imagem ${url}:`, err));
      }
    });

    const interval = setInterval(() => {
      setCurrentAdIndex(prevIndex => (prevIndex + 1) % ads.length);
    }, DEFAULT_TIMEOUT);

    return () => clearInterval(interval);
  }, [currentAdIndex, preloadedImages]);

  const currentAd = ads[currentAdIndex] as Ad;

  return (
    <AdContext value={{ currentAd, preloadedImages, setAdIndex: setCurrentAdIndex }}>
      {children}
    </AdContext>
  );
};
