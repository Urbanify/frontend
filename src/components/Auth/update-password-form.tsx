'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { handleSubmit } from '@/app/(auth)/update-password/action';
import { updatePasswordSchema } from '@/schemas/auth/update-password.schema';

export type UpdatePasswordFormData = {
  token: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export function UpdatePasswordForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const t = useTranslations('Auth.UpdatePassword');
  const formSchema = updatePasswordSchema(t as unknown as (arg: string) => string);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { register, ...methods } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      token,
      newPassword: '',
      newPasswordConfirmation: '',
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const onSubmit = async (data: UpdatePasswordFormData) => {
    setErrorMessage(null);
    try {
      const response = await handleSubmit(data, t);

      if (response.ok) {
        setSuccess(true);
      }
    } catch (error: any) {
      if (error.message !== 'NEXT_REDIRECT') {
        setErrorMessage(error.message);
      }
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex h-60 flex-1 flex-col items-center justify-around">
            <span className="text-center text-base text-accent-foreground">{t('success')}</span>

            <Button
              asChild
              className="w-full"
            >
              <Link href="/login">
                {t('go_login')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FormProvider {...methods} register={register}>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-8">
                  <div className="relative grid gap-2">
                    {/* TODO: UPDATE TRANSLATE */}
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password" type="password" placeholder="********" required {...register('newPassword')} />
                    {methods.formState.errors.newPassword && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.newPassword.message}</span>}
                  </div>
                  <div className="relative grid gap-2">
                    {/* TODO: UPDATE TRANSLATE */}
                    <Label htmlFor="passwordConfirmation">{t('password_confirmation')}</Label>
                    <Input id="passwordConfirmation" type="password" placeholder="********" required {...register('newPasswordConfirmation')} />
                    {methods.formState.errors.newPasswordConfirmation && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.newPasswordConfirmation.message}</span>}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Button
                      disabled={
                        disableButton
                      }
                      isLoading={methods.formState.isSubmitting}
                      type="submit"
                      className="w-full"
                    >
                      {t('button')}
                    </Button>

                    {errorMessage && (
                      <span className="text-center text-sm text-red-500">
                        {errorMessage}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>

  );
}
