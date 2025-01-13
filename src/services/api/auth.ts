import type { ForgotPasswordFormData } from '@/components/Auth/forgot-password-form';
import type { RegisterFormData } from '@/components/Auth/register-form';
import type { UpdatePasswordFormData } from '@/components/Auth/update-password-form';

import { api } from '.';

export const forgotPassword = (data: ForgotPasswordFormData) => {
  return api.instance('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const register = (data: RegisterFormData) => {
  return api.instance('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updatePassword = (data: UpdatePasswordFormData) => {
  return api.instance('/auth/update-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
