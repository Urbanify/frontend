import { auth } from '@/auth';
import { fetcher } from '@/services/api';

import type { FeatureFlag } from '@/types/FeatureFlag';

export const loadFeatures = async () => {
  const token = await auth();
  const response = await fetcher('/feature-flags', {
    method: 'GET',
  }, token?.access_token);
  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }
  return data as FeatureFlag[];
};
