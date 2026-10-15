'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Combobox, type ComboboxOptions } from '@/components/ui/combobox/combobox';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { handleSubmit } from '@/app/(auth)/register/action';
import { registerSchema } from '@/schemas/auth/register.schema';

export type RegisterFormData = {
  name: string;
  surname: string;
  email: string;
  cpf: string;
  cityId: string;
};

type FormProps = {
  cities: ComboboxOptions;
};

// Shows 000.000.000-00 while typing. The schema strips the mask before the API call.
const maskCpf = (value: string) => value
  .replace(/\D/g, '')
  .slice(0, 11)
  .replace(/^(\d{3})(\d)/, '$1.$2')
  .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
  .replace(/\.(\d{3})(\d)/, '.$1-$2');

const listFormatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

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
      cityId: '',
      email: '',
      name: '',
      surname: '',
    },
  });

  const values = methods.watch();
  const { errors, isValid, isSubmitting } = methods.formState;
  const fields: Array<[keyof RegisterFormData, string]> = [
    ['cityId', t('field_city')],
    ['name', t('field_name')],
    ['surname', t('field_surname')],
    ['email', t('field_email')],
    ['cpf', t('field_cpf')],
  ];
  const missing = fields
    .filter(([key]) => !values[key] || errors[key])
    .map(([, label]) => label);

  return (
    <FormProvider {...methods} register={register}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="border-border bg-card shadow-none">
          <CardHeader className="text-left">
            <CardTitle className="text-2xl">{t('create')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('welcome')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(values => handleSubmit(values, t))}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="relative grid gap-2">
                    <Label>{t('city')}</Label>
                    <Combobox
                      options={cities}
                      placeholder={t('city_placeholder')}
                      setValue={value => methods.setValue('cityId', value)}
                      value={methods.watch('cityId')}
                      shouldTranslate={false}
                    />
                    {errors.cityId && <span className="absolute top-full text-xs text-destructive">{errors.cityId.message}</span>}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative grid gap-2">
                      <Label htmlFor="name">{t('name')}</Label>
                      <Input
                        id="name"
                        type="text"
                        autoComplete="given-name"
                        placeholder={t('name_placeholder')}
                        required
                        {...register('name')}
                      />
                      {errors.name && <span className="absolute top-full text-xs text-destructive">{errors.name.message}</span>}
                    </div>

                    <div className="relative grid gap-2">
                      <Label htmlFor="surname">{t('surname')}</Label>
                      <Input
                        id="surname"
                        type="text"
                        autoComplete="family-name"
                        placeholder={t('surname_placeholder')}
                        required
                        {...register('surname')}
                      />
                      {errors.surname && <span className="absolute top-full text-xs text-destructive">{errors.surname.message}</span>}
                    </div>
                  </div>

                  <div className="relative grid gap-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder={t('email_placeholder')}
                      required
                      {...register('email')}
                    />
                    {errors.email && <span className="absolute top-full text-xs text-destructive">{errors.email.message}</span>}
                  </div>

                  <div className="relative grid gap-2">
                    <Label htmlFor="cpf">{t('cpf')}</Label>
                    <Controller
                      control={methods.control}
                      name="cpf"
                      render={({ field }) => (
                        <Input
                          id="cpf"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          value={field.value}
                          onChange={event => field.onChange(maskCpf(event.target.value))}
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder={t('cpf_placeholder')}
                          required
                        />
                      )}
                    />
                    <p className="text-xs text-muted-foreground">{t('cpf_note')}</p>
                    {errors.cpf && <span className="absolute top-full text-xs text-destructive">{errors.cpf.message}</span>}
                  </div>

                  <Button
                    disabled={!isValid || isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                    className="h-auto min-h-11 w-full whitespace-normal py-2 md:h-10"
                  >
                    {missing.length > 0 ? t('missing', { fields: listFormatter.format(missing) }) : t('button')}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t('have_account')}
                  {' '}
                  <Link href="/login" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">
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
