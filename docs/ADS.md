# Ads Usage Guide

This document defines how ads should be used in the UI to avoid clutter and keep a consistent experience.

## Components

### BannerAd
- File: src/components/ui/ads/banner.tsx
- Size:
  - Mobile: 300x100
  - Desktop: 728x90
- Use for in-content breaks between sections or lists.
- Max frequency: 1 per screen area (avoid stacking with SquareAd).

### SquareAd
- File: src/components/ui/ads/square.tsx
- Size:
  - Mobile: 300x300
  - Desktop: 300x300
- Use as a side panel or secondary section on detail pages.
- Max frequency: 1 per page.

### VerticalBannerAd
- File: src/components/ui/ads/vertical.tsx
- Size:
  - Mobile: not displayed
  - Desktop: 160x600 (120x240 on smaller screens)
- Use on desktop sidebars or large layouts only.

### FixedAd
- File: src/components/ui/ads/fixed.tsx
- Size:
  - Mobile: 320x50
  - Desktop: 728x66
- Global sticky footer ad.
- Always single instance through GlobalAds.

## Media types

- Recommended: static images (jpg/png/webp) sized to component specs.
- Avoid animated GIFs larger than the slot size (performance).
- Make sure the target link is valid and uses https.

## Placement rules

1) Never place more than one ad component in the same vertical cluster.
2) On detail pages, prefer either BannerAd OR SquareAd, not both.
3) In tables/lists, insert BannerAd every 4–6 rows at most.
4) FixedAd is global and should not be duplicated inside pages.

## Current usage (overview)

- Global sticky: FixedAd via src/components/global-ads/global-ads.tsx
- Issues list: BannerAd inside src/app/(protected)/issues/components/table.tsx
- Cities list: BannerAd inside src/app/(protected)/(admin)/cities/components/table.tsx
- Issue details: SquareAd only (see src/app/(protected)/issues/components/issue-details.tsx)
