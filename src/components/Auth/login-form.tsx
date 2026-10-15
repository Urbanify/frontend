'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { completeSignup, requestCode, verifyCode } from '@/lib/auth-actions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Combobox, type ComboboxOptions } from '@/components/ui/combobox/combobox';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { codeSchema, emailSchema, signupSchema } from '@/schemas/auth/login.schema';

const RESEND_COOLDOWN_SECONDS = 60;

const listFormatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

type EmailFormData = { email: string };
type CodeFormData = { code: string };
type SignupFormData = { name: string; surname: string; cityId: string };

type LoginFormProps = React.ComponentPropsWithoutRef<'div'> & {
  cities: ComboboxOptions;
};

export function LoginForm({
  className,
  cities,
  ...props
}: LoginFormProps) {
  const t = useTranslations('Auth.Login');
  const terms = useTranslations('Auth.terms_and_policy');
  const comingSoon = useTranslations('App.ComingSoon');
  const router = useRouter();
  const [sentTo, setSentTo] = useState<string | null>(null);
  // Set only for a new email: the session starts after step 3 (name, surname, city).
  const [signupToken, setSignupToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema(t as unknown as (arg: string) => string)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema(t as unknown as (arg: string) => string)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { code: '' },
  });
  const { setFocus } = codeForm;

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema(t as unknown as (arg: string) => string)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { name: '', surname: '', cityId: '' },
  });
  const signupValues = signupForm.watch();
  const { errors: signupErrors, isValid: signupIsValid, isSubmitting: signupIsSubmitting } = signupForm.formState;
  const signupFields: Array<[keyof SignupFormData, string]> = [
    ['name', t('field_name')],
    ['surname', t('field_surname')],
    ['cityId', t('field_city')],
  ];
  const missing = signupFields
    .filter(([key]) => !signupValues[key] || signupErrors[key])
    .map(([, label]) => label);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setTimeout(() => setCooldown(seconds => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (sentTo) {
      setFocus('code');
    }
  }, [sentTo, setFocus]);

  const sendCode = async (email: string) => {
    const result = await requestCode(email);

    if (result.ok) {
      setSentTo(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setErrorMessage(null);
      return;
    }

    if (result.reason === 'rate_limited') {
      // A code was sent less than a minute ago: let the person type it instead of blocking them.
      setSentTo(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setErrorMessage(t('already_sent'));
      return;
    }

    setErrorMessage(t('request_error'));
  };

  const onEmailSubmit = async ({ email }: EmailFormData) => {
    setErrorMessage(null);
    await sendCode(email);
  };

  const onCodeSubmit = async ({ code }: CodeFormData) => {
    if (!sentTo) {
      return;
    }
    setErrorMessage(null);

    const result = await verifyCode(sentTo, code);

    if (!result.ok) {
      setErrorMessage(result.reason === 'invalid_code' ? t('code_invalid') : t('verify_error'));
      return;
    }

    if ('needsSignup' in result) {
      setSignupToken(result.signupToken);
      return;
    }

    router.replace(result.landing);
  };

  const onSignupSubmit = async ({ name, surname, cityId }: SignupFormData) => {
    if (!signupToken) {
      return;
    }
    setErrorMessage(null);

    const result = await completeSignup(signupToken, name, surname, cityId);

    if (result.ok) {
      router.replace(result.landing);
      return;
    }

    if (result.reason === 'error') {
      setErrorMessage(t('signup_error'));
      return;
    }

    // The email already has an account, or the signup token expired: start again from the email.
    setSignupToken(null);
    setSentTo(null);
    codeForm.reset();
    setErrorMessage(result.reason === 'already_registered' ? t('already_registered') : t('signup_invalid'));
  };

  const onResend = async () => {
    if (sentTo) {
      setErrorMessage(null);
      await sendCode(sentTo);
    }
  };

  const onChangeEmail = () => {
    setSentTo(null);
    setSignupToken(null);
    setErrorMessage(null);
    codeForm.reset();
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border bg-card shadow-none">
        <CardHeader className="text-left">
          <CardTitle className="text-2xl">{signupToken ? t('signup_title') : t('welcome')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {signupToken ? t('signup_note') : t('login_with')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentTo === null
            ? (
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                  <div className="grid gap-6">
                    <div className="relative grid gap-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder={t('email_placeholder')}
                        required
                        {...emailForm.register('email')}
                      />
                      {emailForm.formState.errors.email && <span className="absolute top-full text-xs text-destructive">{emailForm.formState.errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <Button
                        disabled={!emailForm.formState.isValid || emailForm.formState.isSubmitting}
                        isLoading={emailForm.formState.isSubmitting}
                        type="submit"
                        className="w-full"
                      >
                        {t('button')}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">{t('code_hint')}</p>
                      {errorMessage && (
                        <span role="alert" className="text-center text-sm text-destructive">
                          {errorMessage}
                        </span>
                      )}
                    </div>
                  </div>
                </form>
              )
            : signupToken
              ? (
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
                    <div className="grid gap-6">
                      <div className="grid gap-6 md:grid-cols-2 md:items-start">
                        <div className="relative grid gap-2">
                          <Label htmlFor="name">{t('name')}</Label>
                          <Input
                            id="name"
                            type="text"
                            autoComplete="given-name"
                            placeholder={t('name_placeholder')}
                            required
                            {...signupForm.register('name')}
                          />
                          {signupErrors.name && <span className="text-xs text-destructive">{signupErrors.name.message}</span>}
                        </div>

                        <div className="relative grid gap-2">
                          <Label htmlFor="surname">{t('surname')}</Label>
                          <Input
                            id="surname"
                            type="text"
                            autoComplete="family-name"
                            placeholder={t('surname_placeholder')}
                            required
                            {...signupForm.register('surname')}
                          />
                          {signupErrors.surname && <span className="text-xs text-destructive">{signupErrors.surname.message}</span>}
                        </div>
                      </div>

                      <div className="relative grid gap-2">
                        <Label>{t('city')}</Label>
                        <Combobox
                          options={cities}
                          placeholder={t('city_placeholder')}
                          setValue={value => signupForm.setValue('cityId', value, { shouldValidate: true })}
                          value={signupValues.cityId}
                          shouldTranslate={false}
                        />
                        {signupErrors.cityId && <span className="text-xs text-destructive">{signupErrors.cityId.message}</span>}
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Button
                          disabled={!signupIsValid || signupIsSubmitting}
                          isLoading={signupIsSubmitting}
                          type="submit"
                          className="h-auto min-h-11 w-full whitespace-normal py-2"
                        >
                          {missing.length > 0 ? t('missing', { fields: listFormatter.format(missing) }) : t('signup_button')}
                        </Button>
                        {errorMessage && (
                          <span role="alert" className="text-center text-sm text-destructive">
                            {errorMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  </form>
                )
              : (
                  <form onSubmit={codeForm.handleSubmit(onCodeSubmit)}>
                    <div className="grid gap-6">
                      <p className="text-sm text-muted-foreground">{t('code_sent', { email: sentTo })}</p>
                      <div className="relative grid gap-2">
                        <Label htmlFor="code">{t('code_label')}</Label>
                        <Input
                          id="code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder={t('code_placeholder')}
                          required
                          {...codeForm.register('code')}
                        />
                        {codeForm.formState.errors.code && <span className="absolute top-full text-xs text-destructive">{codeForm.formState.errors.code.message}</span>}
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <Button
                          disabled={!codeForm.formState.isValid || codeForm.formState.isSubmitting}
                          isLoading={codeForm.formState.isSubmitting}
                          type="submit"
                          className="w-full"
                        >
                          {t('verify_button')}
                        </Button>
                        {errorMessage && (
                          <span role="alert" className="text-center text-sm text-destructive">
                            {errorMessage}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Button type="button" variant="ghost" size="sm" onClick={onChangeEmail}>
                          {t('change_email')}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" disabled={cooldown > 0} onClick={onResend}>
                          {cooldown > 0 ? t('resend_in', { seconds: cooldown }) : t('resend_button')}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        {terms('text')}
        {' '}
        <span>
          {terms('terms')}
          <span className="ml-1 rounded-full bg-tone-neutral-bg px-2 py-0.5 text-[13px] text-tone-neutral-fg">{comingSoon('badge')}</span>
        </span>
        {' '}
        {terms('and')}
        {' '}
        <span>
          {terms('privacy_policy')}
          <span className="ml-1 rounded-full bg-tone-neutral-bg px-2 py-0.5 text-[13px] text-tone-neutral-fg">{comingSoon('badge')}</span>
        </span>
        .
      </div>
    </div>
  );
}
