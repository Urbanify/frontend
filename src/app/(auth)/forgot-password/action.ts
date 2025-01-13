'use client';
import { toast } from 'sonner';

import type { ForgotPasswordFormData } from '@/components/Auth/forgot-password-form';

import { api } from '@/services/api/index';

// eslint-disable-next-line ts/no-unsafe-function-type
export const handleSubmit = async (data: ForgotPasswordFormData, t: Function) => {
  try {
    const response = await api.auth.forgotPassword(data);

    if (!response.ok) {
      throw new Error(t('error'));
    }

    return response;
  } catch (error: any) {
    toast.error(t('error'));
    throw new Error(error.message);
  }
};
