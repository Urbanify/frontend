import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { LoginForm } from '@/components/Auth/login-form';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary/50 to-muted px-4 py-6 md:p-10">
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 size-80 rounded-full bg-accent/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-10 size-48 -translate-x-1/2 rounded-full bg-secondary/70 blur-2xl" />

      <div className="relative w-full max-w-5xl duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid gap-8 rounded-3xl border border-border/60 bg-card/80 px-4 py-6 shadow-2xl backdrop-blur md:grid-cols-2 md:p-10">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 font-semibold">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-card shadow-sm">
                <Image src="/logo.svg" alt="Urbanify" width={32} height={32} />
              </div>
              <span className="text-lg">Urbanify</span>
            </Link>
            <div className="space-y-3">
              <p className="text-3xl font-semibold leading-tight">
                Gestão urbana simples e elegante.
              </p>
              <p className="text-sm text-muted-foreground">
                Acesse o painel para acompanhar ocorrências, cidades e indicadores em um só lugar.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Visão centralizada dos chamados
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent" />
                Fluxos rápidos para equipes
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-secondary" />
                Métricas claras para decisões
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Auth.Login');
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
