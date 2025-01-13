'use client';
import { toast } from 'sonner';

import type { UpdatePasswordFormData } from '@/components/Auth/update-password-form';

import { api } from '@/services/api';

// eslint-disable-next-line ts/no-unsafe-function-type
export const handleSubmit = async (data: UpdatePasswordFormData, t: Function) => {
  try {
    const response = await api.auth.updatePassword(data);

    if (!response.ok) {
      throw new Error(t('error'));
    }

    return response;
  } catch (error: any) {
    toast.error(t('error'));
    throw new Error(error.message);
  }
};
