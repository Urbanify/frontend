export type City = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  status: CityStatus;
  createdAt: string;
  updatedAt: string;
  featureFlags: Array<CityFeatureFlag>;
};

export type CityStatus = 'ACTIVE' | 'DISABLED';

export type CityFeatureFlag = {
  cityId: string;
  featureFlagId: string;
  slug: string;
  description: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};
