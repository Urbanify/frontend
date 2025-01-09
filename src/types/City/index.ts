import type { FeatureFlag } from '../FeatureFlag';

export type City = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  status: CityStatus;
  createdAt: string;
  updatedAt: string;
  featureFlags: Array<FeatureFlag>;
};

export type CityStatus = 'ACTIVE' | 'INACTIVE';
