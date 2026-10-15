import { api } from '@/services/api';

type CheckUserParams = {
  cityId?: string;
  isAdmin?: boolean;
  token: string;
};

export const checkUser = async ({ cityId, isAdmin, token }: CheckUserParams) => {
  // Checked by GET on the city, so the token is validated without a body. POST /cities returned 400 here.
  if (cityId) {
    return await api.instance(`/cities/${cityId}`, {
      method: 'GET',
    }, token);
  }

  if (isAdmin) {
    return await api.instance(`/cities`, {
      method: 'POST',
    }, token);
  }

  return Promise.reject(new Error('Invalid request'));
};
