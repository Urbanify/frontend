'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { handleSubmit } from '@/app/(auth)/forgot-password/action';
import { forgotPasswordSchema } from '@/schemas/auth/forgot-password.schema';

export type ForgotPasswordFormData = {
  cpf: string;
};

export function ForgotPasswordForm() {
  const t = useTranslations('Auth.ForgotPassword');
  const formSchema = forgotPasswordSchema(t as unknown as (arg: string) => string);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | undefined>(undefined);

  const { register, ...methods } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      cpf: '',
    },
  });

  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMessage(null);
    try {
      const response = await handleSubmit(data, t);

      const res = await response.json();
      setSentTo(res.sentTo);
    } catch (error: any) {
      if (error.message !== 'NEXT_REDIRECT') {
        setErrorMessage(error.message);
      }
    }
  };

  if (sentTo) {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-border/60 bg-card/90 shadow-lg">
          <CardHeader className="text-left">
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
          </CardHeader>
          <CardContent className="flex h-60 flex-1 flex-col items-center justify-around">
            <span className="text-center text-base text-accent-foreground">{t('success', { email: sentTo })}</span>

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
        <Card className="border-border/60 bg-card/90 shadow-lg">
          <CardHeader className="text-left">
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-8">
                  <div className="relative grid gap-2">
                    <Label htmlFor="cpf">{t('cpf')}</Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder={t('cpf_placeholder')}
                      required
                      {...register('cpf')}
                    />
                    {methods.formState.errors.cpf && <span className="absolute top-full text-xs text-destructive">{methods.formState.errors.cpf.message}</span>}
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
                      <span className="text-center text-sm text-destructive">
                        {errorMessage}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center text-sm">
                  <Link href="/login" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
                    {t('go_login')}
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>

  );
}
