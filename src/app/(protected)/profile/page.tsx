import dayjs from 'dayjs';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/app/page-header';

import { auth } from '@/auth';
import { api } from '@/services/api';
import { parseJwtUniversal } from '@/utils/decodeJWTUniversal';

import { SignOutButton } from './components/sign-out-button';

// Shows the first 3 and last 2 digits only, e.g. 111.***.***-44.
const maskCpf = (cpf?: string) => {
  const digits = cpf?.replace(/\D/g, '') ?? '';
  return digits.length === 11 ? `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}` : '—';
};

export default async function ProfilePage() {
  const t = await getTranslations('Profile');
  const session = await auth();
  const cityId = parseJwtUniversal(session?.access_token)?.user?.cityId;
  const [response, cityResponse] = await Promise.all([
    api.users.getMe({ fetchServerSide: true }),
    cityId ? api.city.getById(cityId) : null,
  ]);
  const payload = response.ok ? await response.json() : null;
  const cityName = cityResponse?.data.name;
  const fullName = payload ? `${payload.name} ${payload.surname}` : '';
  const initials = payload ? `${payload.name?.[0] ?? ''}${payload.surname?.[0] ?? ''}`.toUpperCase() : '';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:py-10">
      <PageHeader title={t('title')} />

      <section className="flex items-center gap-4 rounded-xl border bg-card p-6">
        <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-tone-blue-bg text-xl font-semibold text-tone-blue-fg">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-navy">{fullName}</p>
          <p className="truncate text-sm text-muted-foreground">{payload?.email}</p>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/issues/mine"
          className="flex flex-col gap-1 rounded-xl border bg-card p-5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-display text-3xl font-semibold tabular-nums text-navy">{payload?.createdIssuesCount ?? 0}</span>
          <span className="text-sm text-muted-foreground">{t('stats.reported')}</span>
          <span className="mt-2 text-sm font-medium text-primary">{t('stats.see_list')}</span>
        </Link>
        <Link
          href="/issues/verifying"
          className="flex flex-col gap-1 rounded-xl border bg-card p-5 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-display text-3xl font-semibold tabular-nums text-navy">{payload?.fiscalOfIssuesCount ?? 0}</span>
          <span className="text-sm text-muted-foreground">{t('stats.fiscal')}</span>
          <span className="mt-2 text-sm font-medium text-primary">{t('stats.see_list')}</span>
        </Link>
      </section>

      <section className="rounded-xl border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold text-navy">{t('details_title')}</h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">{t('fields.city')}</dt>
            <dd className="font-medium">{cityName ?? '—'}</dd>
          </div>
          {payload?.cpf && (
            <div>
              <dt className="text-sm text-muted-foreground">{t('fields.cpf')}</dt>
              <dd className="font-medium tabular-nums">{maskCpf(payload.cpf)}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-muted-foreground">{t('fields.created_at')}</dt>
            <dd className="font-medium tabular-nums">{payload?.createdAt ? dayjs(payload.createdAt).format('DD/MM/YYYY') : '—'}</dd>
          </div>
        </dl>
      </section>

      <div>
        <SignOutButton />
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Profile');
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
