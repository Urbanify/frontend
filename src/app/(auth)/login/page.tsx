'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import { loginSchema } from '@/schemas/auth/login.schema';

import { handleSubmit } from './action';

export type LoginForm = {
  cpf: string;
  password: string;
};

export default function Login() {
  const t = useTranslations('Auth.Login');
  const formSchema = loginSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<LoginForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      cpf: '',
      password: '',
    },
  });

  // useEffect(() => {
  //   if (error) {
  //     // toast({
  //     // title: "Sign in error",
  //     // description: error,
  //     // variant: "error",
  //     // });
  //   }
  // }, [error]);

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  return (
    <main className="flex size-full items-center justify-center bg-slate-900">
      <FormProvider {...methods} register={register}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="flex h-fit w-full max-w-xs flex-col gap-3 bg-slate-100 p-4 md:p-8"
        >
          <h1 className="text-center text-xl">Login</h1>

          <label className="flex flex-col">
            <span>CPF</span>
            <input type="text" {...register('cpf')} />
          </label>
          {methods.formState.errors.cpf && <span className="text-red-500">{methods.formState.errors.cpf.message}</span>}

          <label className="flex flex-col">
            <span>Password</span>
            <input type="password" {...register('password')} />
          </label>
          {methods.formState.errors.password && <span className="text-red-500">{methods.formState.errors.password.message}</span>}

          <input type="hidden" name="redirectTo" value="/issues" />

          <button
            disabled={
              disableButton
            }
            type="submit"
            className={`bg-blue-400 hover:bg-blue-500 active:bg-blue-600
              ${disableButton && ' pointer-events-none bg-blue-100'}`}
          >
            Entrar
          </button>
        </form>
      </FormProvider>
    </main>
  );
};
