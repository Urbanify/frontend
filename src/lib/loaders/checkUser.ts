import { fetcher } from '@/services/api';

type CheckUserParams = {
  cityId?: string;
  isAdmin?: boolean;
  token: string;
};

export const checkUser = async ({ cityId, isAdmin, token }: CheckUserParams) => {
  if (isAdmin) {
    return await fetcher(`/cities`, {
      method: 'POST',
    }, token);
  }

  if (cityId) {
    return await fetcher(`/cities/${cityId}`, {
      method: 'GET',
    }, token);
  }

  return Promise.reject(new Error('Invalid request'));
};
