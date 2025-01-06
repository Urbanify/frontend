'use server';
import { signIn } from '@/auth';

import type { LoginForm } from './page';

export const handleSubmit = async (data: LoginForm) => {
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
