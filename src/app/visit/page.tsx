import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { TouristCityVisitExplorer } from '@/components/Tourist/city-visit-explorer';

import { api } from '@/services/api';

type VisitPageProps = {
  searchParams?: Promise<{
    city?: string;
  }>;
};

export default async function VisitPage({ searchParams }: VisitPageProps) {
  const { data: cities } = await api.city.getAll();
  const resolvedSearchParams = await searchParams;
  const requestedCityId = resolvedSearchParams?.city ?? '';

  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-full.svg" alt="Urbanify" width={140} height={40} />
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
        >
          Acessar painel
        </Link>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        {cities.length > 0
          ? (
              <TouristCityVisitExplorer cities={cities} initialCityId={requestedCityId} />
            )
          : (
              <div className="rounded-3xl border border-border/60 bg-card/80 p-8 text-center shadow-sm">
                <h1 className="text-2xl font-semibold">Ainda nao temos cidades publicas</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Em breve voce podera explorar mapas, pontos turisticos e servicos locais.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex items-center justify-center rounded-full border border-border/60 px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Voltar para a landing
                </Link>
              </div>
            )}
      </section>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('SEO.Visit');
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
