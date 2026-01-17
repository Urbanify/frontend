import { getSession } from 'next-auth/react';

import { api } from '.';

type CrimePayload = {
  category: string;
  type: string;
  address: string;
  latitude: string;
  longitude: string;
  happenedAt: string;
  description: string;
};

type ListCrimesParams = {
  page?: number;
  take?: number;
  category?: string;
  type?: string;
  cityId?: string;
  from?: string;
  to?: string;
};

export const create = async (payload: CrimePayload) => {
  const session = await getSession();
  return api.instance('/crimes', {
    method: 'POST',
    body: JSON.stringify(payload),
  }, session?.access_token);
};

export const list = async ({ page, take, category, type, cityId, from, to }: ListCrimesParams = {}) => {
  const session = await getSession();
  const query = new URLSearchParams({
    ...(typeof page === 'number' ? { page: String(page) } : {}),
    ...(typeof take === 'number' ? { take: String(take) } : {}),
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
    ...(cityId ? { cityId } : {}),
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  });
  return api.instance(`/crimes?${query.toString()}`, {
    method: 'GET',
  }, session?.access_token);
};

export const getById = async (crimeId: string) => {
  const session = await getSession();
  return api.instance(`/crimes/${crimeId}`, {
    method: 'GET',
  }, session?.access_token);
};

export const remove = async (crimeId: string) => {
  const session = await getSession();
  return api.instance(`/crimes/${crimeId}`, {
    method: 'DELETE',
  }, session?.access_token);
};
