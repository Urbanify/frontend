import { auth } from '@/auth';
import { fetcher } from '@/services/api';

import type { City } from '@/types/City';

export const loadCity = async (cityId: string) => {
  const session = await auth();
  const response = await fetcher(`/cities/${cityId}`, {
    method: 'GET',
  }, session?.access_token);
  let data = {};
  if (response.ok) {
    data = await response.json() ?? {};
  }
  return data as City;
};
