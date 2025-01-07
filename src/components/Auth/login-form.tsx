'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { handleSubmit } from '@/app/(auth)/login/action';
import { loginSchema } from '@/schemas/auth/login.schema';

import { Button } from '../ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card/card';
import { Input } from '../ui/input/input';
import { Label } from '../ui/label/label';

export type LoginFormData = {
  cpf: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('Auth.Login');
  const formSchema = loginSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      cpf: '',
      password: '',
    },
  });
  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  return (
    <FormProvider {...methods} register={register}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('welcome')}</CardTitle>
            <CardDescription>
              {t('login_with')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">{t('cpf')}</Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder={t('cpf_placeholder')}
                      required
                      {...register('cpf')}
                    />
                    {methods.formState.errors.cpf && <span className="text-red-500">{methods.formState.errors.cpf.message}</span>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t('password')}</Label>
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        {t('forgot_password')}
                      </a>
                    </div>
                    <Input id="password" type="password" placeholder="********" required {...register('password')} />
                    {methods.formState.errors.password && <span className="text-red-500">{methods.formState.errors.password.message}</span>}
                  </div>

                  <input type="hidden" name="redirectTo" value="/issues" />

                  <Button
                    disabled={
                      disableButton
                    }
                    type="submit"
                    className="w-full"
                  >
                    {t('button')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('no_account')}
                  {' '}
                  <a href="/register" className="underline underline-offset-4">
                    {t('sign_up')}
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our
          {' '}
          <a href="/terms">Terms of Service</a>
          {' '}
          and
          {' '}
          <a href="/policies">Privacy Policy</a>
          .
        </div>
      </div>
    </FormProvider>

  );
}
