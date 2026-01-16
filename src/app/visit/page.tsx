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

      <footer className="border-t border-border/60 bg-card/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo-full.svg" alt="Urbanify" width={160} height={46} />
              </Link>
              <p className="text-sm text-muted-foreground">
                Experiencia publica para visitantes conhecerem a cidade, seus servicos e pontos de interesse.
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Explore</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/" className="hover:text-foreground">Landing page</Link>
                <Link href="/visit" className="hover:text-foreground">Mapa visitante</Link>
                <Link href="/login" className="hover:text-foreground">Acessar painel</Link>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contato</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <a href="mailto:contato@urbanify.com" className="hover:text-foreground">contato@urbanify.com</a>
                <Link href="/" className="hover:text-foreground">Fale com nosso time</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>Urbanify. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <span>Politica de privacidade</span>
              <span>Termos de uso</span>
            </div>
          </div>
        </div>
      </footer>
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
