'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { maskCnpj, maskPhone } from '@/lib/brazil';
import { submitResellerLead } from '@/lib/reseller-actions';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';

import { type ResellerLeadInput, resellerLeadSchema } from '@/schemas/reseller/reseller-lead.schema';

const experienceOptions = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'some', label: 'Alguma' },
  { value: 'strong', label: 'Forte' },
];

const failureMessages = {
  invalid: 'Algum dado não passou na validação. Confira o formulário e envie de novo.',
  rate_limited: 'Você já enviou várias candidaturas nesta hora. Tente de novo mais tarde.',
  error: 'Não conseguimos enviar agora. Tente de novo em instantes ou escreva para contato@urbanify.com.br.',
};

const fieldClass = 'h-11 md:h-10';

export function ResellerForm() {
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<keyof typeof failureMessages | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResellerLeadInput>({
    resolver: zodResolver(resellerLeadSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      cnpj: '',
      region: '',
      citiesOfInterest: '',
      experience: '',
      howHeard: '',
      message: '',
      consent: false,
      website: '',
    },
  });

  useEffect(() => {
    if (sent) {
      successRef.current?.focus();
    }
  }, [sent]);

  const onSubmit = handleSubmit(async (values) => {
    setFailure(null);
    const result = await submitResellerLead(values);

    if (result.ok) {
      setSent(true);
      return;
    }

    setFailure(result.reason);
  });

  if (sent) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-2xl border border-border bg-card p-6 outline-none md:p-8">
        <h2 className="font-display text-display-md text-navy">Recebemos sua candidatura.</h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Respondemos em até 2 dias úteis, sempre com sim ou não. Enquanto isso, você pode
          {' '}
          <Link href="/" className="text-primary underline underline-offset-4 hover:text-navy">voltar ao início</Link>
          .
        </p>
      </div>
    );
  }

  const ariaFor = (name: keyof ResellerLeadInput) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const errorText = (name: keyof ResellerLeadInput) => errors[name] && (
    <p id={`${name}-error`} className="text-[13px] text-destructive">{errors[name]?.message}</p>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8" aria-busy={isSubmitting}>
      {/* Honeypot: hidden from people and from the tab order. Bots that fill it get a 202 and nothing else. */}
      <div aria-hidden="true" className="absolute left-[-9999px] size-px overflow-hidden">
        <Label htmlFor="website">Site</Label>
        <Input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" autoComplete="name" className={fieldClass} {...register('name')} {...ariaFor('name')} />
        {errorText('name')}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" inputMode="email" autoComplete="email" className={fieldClass} {...register('email')} {...ariaFor('email')} />
          {errorText('email')}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone com DDD</Label>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(11) 98765-4321"
                className={fieldClass}
                value={field.value}
                onChange={e => field.onChange(maskPhone(e.target.value))}
                onBlur={field.onBlur}
                name={field.name}
                {...ariaFor('phone')}
              />
            )}
          />
          {errorText('phone')}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Razão social</Label>
          <Input id="company" autoComplete="organization" className={fieldClass} {...register('company')} {...ariaFor('company')} />
          {errorText('company')}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Controller
            control={control}
            name="cnpj"
            render={({ field }) => (
              <Input
                id="cnpj"
                autoCapitalize="characters"
                autoComplete="off"
                placeholder="00.000.000/0000-00"
                className={fieldClass}
                value={field.value}
                onChange={e => field.onChange(maskCnpj(e.target.value))}
                onBlur={field.onBlur}
                name={field.name}
                {...ariaFor('cnpj')}
              />
            )}
          />
          {errorText('cnpj')}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Cidade e estado onde você atua</Label>
        <Input id="region" placeholder="Ex.: Aracaju, SE" className={fieldClass} {...register('region')} {...ariaFor('region')} />
        {errorText('region')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="citiesOfInterest">
          Cidades que você quer atender
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="citiesOfInterest" className={fieldClass} {...register('citiesOfInterest')} {...ariaFor('citiesOfInterest')} />
        {errorText('citiesOfInterest')}
      </div>

      <fieldset className="space-y-2" aria-invalid={errors.experience ? true : undefined} aria-describedby={errors.experience ? 'experience-error' : undefined}>
        <legend className="mb-2 text-sm font-medium leading-none text-navy">Experiência com prefeituras e câmaras</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {experienceOptions.map(option => (
            <label
              key={option.value}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-input bg-background px-3 text-[15px] text-navy',
                'has-[:checked]:border-primary has-[:checked]:ring-1 has-[:checked]:ring-primary',
              )}
            >
              <input type="radio" value={option.value} className="size-4 accent-[hsl(var(--primary))]" {...register('experience')} />
              {option.label}
            </label>
          ))}
        </div>
        {errorText('experience')}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="howHeard">
          Como você conheceu a Urbanify?
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input id="howHeard" className={fieldClass} {...register('howHeard')} {...ariaFor('howHeard')} />
        {errorText('howHeard')}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Conte um pouco sobre você ou a sua empresa
          <span className="ml-1 font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea id="message" rows={4} {...register('message')} {...ariaFor('message')} />
        {errorText('message')}
      </div>

      <div className="space-y-2">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] text-muted-foreground">
          <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[hsl(var(--primary))]" {...register('consent')} {...ariaFor('consent')} />
          <span>
            Concordo em ser contatado pela Urbanify sobre esta candidatura e li a
            {' '}
            <Link href="/privacidade" className="text-primary underline underline-offset-4 hover:text-navy">Política de Privacidade</Link>
            .
          </span>
        </label>
        {errorText('consent')}
      </div>

      {failure && (
        <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-[15px] text-destructive">
          {failureMessages[failure]}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-full text-base md:h-11">
        {isSubmitting ? 'Enviando…' : 'Enviar candidatura'}
      </Button>
    </form>
  );
}
