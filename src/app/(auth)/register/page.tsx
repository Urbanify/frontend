import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { RegisterForm } from '@/components/Auth/register-form';
import type { ComboboxOptions } from '@/components/ui/combobox/combobox';

import { api } from '@/services/api';

export default async function RegisterPage() {
  const t = await getTranslations('Auth.Register');
  const { data: cities } = await api.city.getAll();
  const citiesOptions: ComboboxOptions = cities?.map(city => ({
    value: city.id,
    label: city.name,
  }));

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10 md:p-10">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-10 md:grid-cols-[1fr_1.2fr] md:items-start md:gap-14">
        <div className="flex min-w-0 flex-col gap-8">
          <Link href="/" className="flex w-fit items-center gap-2 font-semibold text-navy">
            <Image src="/logo.svg" alt="Urbanify" width={32} height={32} />
            <span className="text-lg">Urbanify</span>
          </Link>
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-2xl font-semibold leading-tight text-navy md:text-3xl">{t('panel_title')}</h1>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">
              <li>{t('panel_step_report')}</li>
              <li>{t('panel_step_verify')}</li>
              <li>{t('panel_step_solve')}</li>
            </ol>
          </div>
        </div>

        <RegisterForm cities={citiesOptions} className="min-w-0" />
      </div>
    </main>
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
