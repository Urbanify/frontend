import { getSession } from 'next-auth/react';

import type { CityFormData } from '@/components/Cities/CreateCityForm';
import type { EditCityFormData } from '@/components/Cities/EditCityForm';

import { api } from '.';

import type { City } from '@/types/City';

export const deactivate = async (cityId: string) => {
  const session = await getSession();
  return api.instance(`/cities/${cityId}/deactivate`, {
    method: 'POST',
  }, session?.access_token);
};

export const activate = async (cityId: string) => {
  const session = await getSession();
  return api.instance(`/cities/${cityId}/activate`, {
    method: 'POST',
  }, session?.access_token);
};

export const create = async (data?: CityFormData) => {
  const session = await getSession();
  return api.instance('/cities/', {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  }, session?.access_token);
};

export const update = async (data: EditCityFormData) => {
  const session = await getSession();
  return api.instance(`/cities/${data.id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, session?.access_token);
};

export const getAll = async () => {
  const { promise, mutate } = await api.get('/cities', true, 'list-cities');
  const response = await promise;
  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }
  return {
    data: data as City[],
    mutate,
  };
};

export const getById = async (cityId: string) => {
  const { promise, mutate } = await api.get(`/cities/${cityId}`, true, `get-city-${cityId}`);
  const response = await promise;
  let data = {};
  if (response.ok) {
    data = await response.json() ?? {};
  }
  return {
    data: data as City,
    mutate,
  };
};
