import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { BannerAd } from './banner';
import { FixedAd } from './fixed';
import { SquareAd } from './square';
import { VerticalBannerAd } from './vertical';

export default {
  title: 'Components/AdComponents',
  component: BannerAd,
} as Meta;

// Configuração padrão para links e mídias
const defaultArgs = {
  href: 'https://exemplo.com',
  desktopMedia: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif',
  mobileMedia: 'https://media.giphy.com/media/l4pTfx2qLszoacZRS/giphy.gif',
};

// **1. Banner Horizontal**
export const OverviewBannerAd: StoryFn = () => (
  <BannerAd
    href={defaultArgs.href}
    desktopMedia={defaultArgs.desktopMedia}
    mobileMedia={defaultArgs.mobileMedia}
  />
);

export const BannerAdSizes: StoryFn = () => (
  <BannerAd
    href={defaultArgs.href}
    desktopMedia="https://placehold.co/728x90/png"
    mobileMedia="https://placehold.co/300x100/png"
  />
);

// **2. Banner Vertical**
export const OverviewVerticalBannerAd: StoryFn = () => (
  <VerticalBannerAd
    href={defaultArgs.href}
    desktopMedia="https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"
    mobileMedia="https://media.giphy.com/media/xUPGcEliCc7bETyfO8/giphy.gif"
  />
);

export const VerticalBannerAdSizes: StoryFn = () => (
  <VerticalBannerAd
    href={defaultArgs.href}
    desktopMedia="https://placehold.co/160x600/png"
    mobileMedia="https://placehold.co/120x240/png"
  />
);

// **3. Anúncio Quadrado**
export const OverviewSquareAdBanner: StoryFn = () => (
  <SquareAd
    href={defaultArgs.href}
    desktopMedia="https://media.giphy.com/media/l378zKVk7Eh3yHoJi/giphy.gif" // 300x300 GIF
    mobileMedia="https://media.giphy.com/media/l378zKVk7Eh3yHoJi/giphy.gif" // 300x300 GIF
  />
);

export const SquareAdSizes: StoryFn = () => (
  <SquareAd
    href={defaultArgs.href}
    desktopMedia="https://placehold.co/300x300/png"
    mobileMedia="https://placehold.co/300x300/png"
  />
);

// **4. Anúncio Fixo com Minimização**
export const OverviewFixedAdBanner: StoryFn = () => (
  <FixedAd
    href={defaultArgs.href}
    desktopMedia="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" // 300x250 GIF
    mobileMedia={defaultArgs.mobileMedia}
  />
);

export const FixedAdBannerSizes: StoryFn = () => (
  <FixedAd
    href={defaultArgs.href}
    desktopMedia="https://placehold.co/728x66/png"
    mobileMedia="https://placehold.co/320x50/png"
  />
);
