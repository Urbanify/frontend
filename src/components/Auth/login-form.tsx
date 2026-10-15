'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { requestCode, verifyCode } from '@/lib/auth-actions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/card';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

import { codeSchema, emailSchema } from '@/schemas/auth/login.schema';

const RESEND_COOLDOWN_SECONDS = 60;

type EmailFormData = { email: string };
type CodeFormData = { code: string };

type LoginFormProps = React.ComponentPropsWithoutRef<'div'>;

export function LoginForm({
  className,
  ...props
}: LoginFormProps) {
  const t = useTranslations('Auth.Login');
  const terms = useTranslations('Auth.terms_and_policy');
  const router = useRouter();
  const [sentTo, setSentTo] = useState<string | null>(null);
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
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setErrorMessage(t('rate_limited'));
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

    if (result.ok) {
      router.replace(result.landing);
      return;
    }

    setErrorMessage(result.reason === 'invalid_code' ? t('code_invalid') : t('verify_error'));
  };

  const onResend = async () => {
    if (sentTo) {
      setErrorMessage(null);
      await sendCode(sentTo);
    }
  };

  const onChangeEmail = () => {
    setSentTo(null);
    setErrorMessage(null);
    codeForm.reset();
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-border bg-card shadow-none">
        <CardHeader className="text-left">
          <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('login_with')}
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
                    <div className="text-center text-sm">
                      {t('no_account')}
                      {' '}
                      <Link href="/register" className="underline underline-offset-4">
                        {t('sign_up')}
                      </Link>
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
        <Link href="/terms">{terms('terms')}</Link>
        {' '}
        {terms('and')}
        {' '}
        <Link href="/policies">{terms('privacy_policy')}</Link>
        .
      </div>
    </div>
  );
}
