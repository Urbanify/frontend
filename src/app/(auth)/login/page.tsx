import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { LoginForm } from '@/components/Auth/login-form';
import type { ComboboxOptions } from '@/components/ui/combobox/combobox';

import { api } from '@/services/api';

export default async function LoginPage() {
  const t = await getTranslations('Auth.Login');
  const { data: cities } = await api.city.getAll();
  const citiesOptions: ComboboxOptions = cities.map(city => ({
    value: city.id,
    label: city.name,
  }));

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10 md:p-10">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14">
        <div className="flex flex-col gap-8">
          <Link href="/" className="flex w-fit items-center gap-2 font-semibold text-navy">
            <Image src="/logo.svg" alt="Urbanify" width={32} height={32} />
            <span className="text-lg">Urbanify</span>
          </Link>
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-2xl font-semibold leading-tight text-navy md:text-3xl">{t('panel_citizen')}</h1>
            <p className="text-muted-foreground">{t('panel_city')}</p>
          </div>
        </div>

        <LoginForm cities={citiesOptions} className="min-w-0" />
      </div>
    </main>
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
