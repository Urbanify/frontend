import { getSession } from 'next-auth/react';

import { auth } from '@/auth';

import { api } from '.';

import type { UserRole } from '@/types/User';

type ListUsersParams = {
  page?: number;
  take?: number;
  roles?: Array<UserRole>;
  search?: string;
};

type ListUsersOptions = ListUsersParams & {
  fetchServerSide?: boolean;
  token?: string;
};

const listClientSide = async ({ page, take, roles, search, token }: ListUsersParams & { token?: string } = {}) => {
  const session = token ? null : await getSession();
  const accessToken = token ?? session?.access_token;
  const query = new URLSearchParams({
    ...(typeof page === 'number' ? { page: String(page) } : {}),
    ...(typeof take === 'number' ? { take: String(take) } : {}),
    ...(search ? { search } : {}),
  });

  roles?.forEach((role) => {
    query.append('roles', role);
  });

  return api.instance(`/users?${query.toString()}`, {
    method: 'GET',
  }, accessToken);
};

export const updateRole = async (
  userId: string,
  role: NonNullable<ListUsersParams['roles']>[number],
  token?: string,
) => {
  const session = token ? null : await getSession();
  const accessToken = token ?? session?.access_token;
  return api.instance(`/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  }, accessToken);
};

const getMeClientSide = async () => {
  const session = await getSession();
  return api.instance('/users/me', {
    method: 'GET',
  }, session?.access_token);
};

const listServerSide = async ({ page, take, roles, search }: ListUsersParams = {}) => {
  const session = await auth();
  const query = new URLSearchParams({
    ...(typeof page === 'number' ? { page: String(page) } : {}),
    ...(typeof take === 'number' ? { take: String(take) } : {}),
    ...(search ? { search } : {}),
  });

  roles?.forEach((role) => {
    query.append('roles', role);
  });

  return api.instance(`/users?${query.toString()}`, {
    method: 'GET',
  }, session?.access_token);
};

const getMeServerSide = async () => {
  const session = await auth();
  return api.instance('/users/me', {
    method: 'GET',
  }, session?.access_token);
};

export const list = async ({ fetchServerSide, ...params }: ListUsersOptions = {}) => {
  if (fetchServerSide) {
    return await listServerSide(params);
  }
  return await listClientSide(params);
};

export const getMe = async ({ fetchServerSide }: { fetchServerSide?: boolean } = {}) => {
  if (fetchServerSide) {
    return getMeServerSide();
  }
  return getMeClientSide();
};
