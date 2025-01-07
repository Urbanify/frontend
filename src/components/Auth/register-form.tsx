'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { handleSubmit } from '@/app/(auth)/register/action';
import { registerSchema } from '@/schemas/auth/register.schema';

import { Button } from '../ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card/card';
import { Combobox } from '../ui/combobox/combobox';
import { Input } from '../ui/input/input';
import { Label } from '../ui/label/label';

export type RegisterFormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  cpf: string;
  cityId: string;
};

type FormProps = {
  cities: Array<{ value: string; label: string }>;
};

export function RegisterForm({
  className,
  cities,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & FormProps) {
  const t = useTranslations('Auth.Register');
  const terms = useTranslations('Auth.terms_and_policy');
  const formSchema = registerSchema(t as unknown as (arg: string) => string);

  const { register, ...methods } = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      cpf: '',
      password: '',
      email: '',
      name: '',
      surname: '',
    },
  });
  const disableButton = !methods.formState.isValid
    || methods.formState.isSubmitting;

  return (
    <FormProvider {...methods} register={register}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t('create')}</CardTitle>
            <CardDescription>
              {t('welcome')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(values => handleSubmit(values, t))}>
              <div className="grid gap-6">
                <div className="grid gap-8">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <div className="relative grid gap-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder={t('name_placeholder')}
                        required
                        {...register('name')}
                      />
                      {methods.formState.errors.name && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.name.message}</span>}
                    </div>

                    <div className="relative grid gap-2">
                      <Label htmlFor="surname">{t('surname')}</Label>
                      <Input
                        id="surname"
                        type="text"
                        placeholder={t('surname_placeholder')}
                        required
                        {...register('surname')}
                      />
                      {methods.formState.errors.surname && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.surname.message}</span>}
                    </div>
                  </div>

                  <div className="relative grid gap-2">
                    <Label htmlFor="cpf">{t('cpf')}</Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder={t('cpf_placeholder')}
                      required
                      {...register('cpf')}
                    />
                    {methods.formState.errors.cpf && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.cpf.message}</span>}
                  </div>

                  <div className="relative grid gap-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder={t('email_placeholder')}
                      required
                      {...register('email')}
                    />
                    {methods.formState.errors.email && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.email.message}</span>}
                  </div>

                  <div className="relative grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t('password')}</Label>
                    </div>
                    <Input id="password" type="password" placeholder="********" required {...register('password')} />
                    {methods.formState.errors.password && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.password.message}</span>}
                  </div>

                  <div className="relative grid gap-2">
                    <Combobox
                      options={cities}
                      placeholder={t('city_placeholder')}
                      setValue={value => methods.setValue('cityId', value)}
                      value={methods.watch('cityId')}
                    />
                    {methods.formState.errors.cityId && <span className="absolute top-full text-xs text-red-500">{methods.formState.errors.cityId.message}</span>}
                  </div>

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
                </div>
                <div className="text-center text-sm">
                  {t('have_account')}
                  {' '}
                  <Link href="/login" className="underline underline-offset-4">
                    {t('go_login')}
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          {terms('text')}
          {' '}
          <Link href="/terms">{terms('terms')}</Link>
          {' '}
          {terms('and')}
          {' '}
          <Link href="/policies">{terms('privacy_policy')}</Link>
          .
        </div>
      </div>
    </FormProvider>

  );
}
