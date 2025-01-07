'use client';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import type { RegisterFormData } from '@/components/Auth/register-form';

import { fetcher } from '@/services/api';

// eslint-disable-next-line ts/no-unsafe-function-type
export const handleSubmit = async (data: RegisterFormData, t: Function) => {
  try {
    const response = await fetcher('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(t('error')); // Use a translated error message
    }

    toast.success(t('success')); // Use a translated success message
    return redirect('/login');
  } catch {
    toast.error(t('error')); // Use the same translated error message
  }
};
