import { fetcher } from '@/services/api';

import type { City } from '@/types/City';

export const loadCities = async () => {
  const response = await fetcher('http://localhost:3000/cities', {
    method: 'GET',
  });
  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }
  return data as City[];
};
