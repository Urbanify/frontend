'use server';
import type { LoginFormData } from '@/components/Auth/login-form';

import { signIn } from '@/auth';

export const handleSubmit = async (data: LoginFormData) => {
  try {
    await signIn('credentials', {
      cpf: data.cpf,
      password: data.password,
      redirect: true,
      redirectTo: `/issues`,
    });
  } catch (error) {
    console.error({ error });

    throw error;
  }
};
