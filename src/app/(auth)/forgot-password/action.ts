'use client';
import { toast } from 'sonner';

import type { ForgotPasswordFormData } from '@/components/Auth/forgot-password-form';

import { fetcher } from '@/services/api';

// eslint-disable-next-line ts/no-unsafe-function-type
export const handleSubmit = async (data: ForgotPasswordFormData, t: Function) => {
  try {
    const response = await fetcher('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(t('error'));
    }

    return response;
  } catch (error: any) {
    toast.error(t('error'));
    throw new Error(error.message);
  }
};
