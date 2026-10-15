import { getSession } from '@/lib/session-client';

import { api } from '.';

export type PlaceCategory = 'HEALTH' | 'EDUCATION' | 'WASTE' | 'TOURISM' | 'SERVICES' | 'LEISURE';

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string | null;
  phone: string | null;
  hours: string | null;
  description: string | null;
  latitude: number;
  longitude: number;
};

export type StaffPlace = Place & {
  published: boolean;
  source: string;
};

export type PlaceInput = {
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address?: string | null;
  phone?: string | null;
  hours?: string | null;
  description?: string | null;
  published?: boolean;
};

const readList = async <T>(response: Response): Promise<T[]> => {
  if (!response.ok) {
    throw new Error(`places request failed with ${response.status}`);
  }
  return await response.json() as T[];
};

// Public, published places of one city. Throws when the request fails.
export const listPublic = async (cityId: string) => {
  const response = await api.instance(`/cities/${cityId}/places`, { method: 'GET' });
  return readList<Place>(response);
};

// OWNER and ADMIN. The server passes its token; the browser reads the session.
export const listStaff = async (token?: string) => {
  const session = token ? null : await getSession();
  const response = await api.instance('/places', { method: 'GET' }, token ?? session?.access_token);
  return readList<StaffPlace>(response);
};

export const create = async (data: PlaceInput) => {
  const session = await getSession();
  return api.instance('/places', {
    method: 'POST',
    body: JSON.stringify(data),
  }, session?.access_token);
};

export const update = async (placeId: string, data: Partial<PlaceInput>) => {
  const session = await getSession();
  return api.instance(`/places/${placeId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, session?.access_token);
};

export const remove = async (placeId: string) => {
  const session = await getSession();
  return api.instance(`/places/${placeId}`, {
    method: 'DELETE',
  }, session?.access_token);
};
