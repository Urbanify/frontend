'use client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import type { RegisterFormData } from '@/components/Auth/register-form';

import { fetcher } from '@/services/api';

// eslint-disable-next-line ts/no-unsafe-function-type
export const handleSubmit = async (data: RegisterFormData, t: Function): Promise<Response> => {
  try {
    const response = await fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(t('error'));
    }

    return redirect('/login');
  } catch (error: any) {
    if (error.message !== 'NEXT_REDIRECT') {
      toast.error(t('error'));
      throw new Error(t('error'));
    }
    return Promise.reject(error);
  }
};
