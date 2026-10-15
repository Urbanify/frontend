import type { RegisterFormData } from '@/components/Auth/register-form';

import { api } from '.';

export const register = (data: RegisterFormData) => {
  return api.instance('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
