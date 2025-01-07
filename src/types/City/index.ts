import type { FeatureFlag } from '../FeatureFlag';

export type City = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  featureFlags: Array<FeatureFlag>;
};
