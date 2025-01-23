import { getSession } from 'next-auth/react';

import type { EditFeatureFormData } from '@/components/Features/EditFeatureForm';
import type { FeatureFormData } from '@/components/Features/FeatureForm';

import { api } from '.';

import type { FeatureFlag } from '@/types/FeatureFlag';

export const create = async (data: FeatureFormData) => {
  const session = await getSession();
  return api.instance('/feature-flags', {
    method: 'POST',
    body: JSON.stringify(data),
  }, session?.access_token);
};

export const getAll = async () => {
  const { promise, mutate } = await api.get('/feature-flags', true, 'list-features');
  const response = await promise;
  let data = [];
  if (response.ok) {
    data = await response.json() ?? [];
  }
  return {
    data: data as FeatureFlag[],
    mutate,
  };
};

export const getById = async (ffId: string) => {
  const { promise, mutate } = await api.get(`/feature-flags/${ffId}`, true, `get-ff-${ffId}`);
  const response = await promise;
  let data = {};
  if (response.ok) {
    data = await response.json() ?? {};
  }
  return {
    data: data as FeatureFlag,
    mutate,
  };
};

export const update = async (data: EditFeatureFormData) => {
  const session = await getSession();
  return api.instance(`/feature-flags/${data.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }, session?.access_token);
};

export const deleteById = async (ffId: string) => {
  const session = await getSession();
  return api.instance(`/feature-flags/${ffId}`, {
    method: 'DELETE',
  }, session?.access_token);
};
