import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { RegisterForm } from '@/components/Auth/register-form';
import type { ComboboxOptions } from '@/components/ui/combobox/combobox';

import { api } from '@/services/api';

export default async function RegisterPage() {
  const { data: cities } = await api.city.getAll();
  const citiesOptions: ComboboxOptions = cities?.map(city => ({
    value: city.id,
    label: city.name,
  }));

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/50 to-muted px-4 py-6 md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 size-80 rounded-full bg-accent/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-10 size-48 -translate-x-1/2 rounded-full bg-secondary/70 blur-2xl" />

      <div className="relative w-full max-w-6xl duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid gap-8 rounded-3xl border border-border/60 bg-card/80 px-4 py-6 shadow-2xl backdrop-blur md:grid-cols-[1.05fr_1.2fr] md:p-10">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-card shadow-sm">
                <Image src="/logo.svg" alt="Urbanify" width={32} height={32} />
              </div>
              <span className="text-lg">Urbanify</span>
            </Link>
            <div className="space-y-3">
              <p className="text-3xl font-semibold leading-tight">
                Crie sua conta e comece agora.
              </p>
              <p className="text-sm text-muted-foreground">
                Centralize equipes, simplifique fluxos e acompanhe tudo em tempo real.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Cadastro em poucos passos
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent" />
                Gestão de cidades integrada
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-secondary" />
                Acesso imediato ao painel
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <RegisterForm cities={citiesOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Auth.Register');
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
    },
    twitter: {
      title: t('title'),
      description: t('description'),
    },
  };
}
