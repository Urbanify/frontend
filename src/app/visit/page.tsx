import type { Metadata } from 'next';

import { LandingHeader } from '@/components/Home/landing-header';
import { TouristCityVisitExplorer } from '@/components/Tourist/city-visit-explorer';

import { api } from '@/services/api';

export const metadata: Metadata = {
  title: 'Explore Aracaju',
  description: 'Veja pontos conhecidos de Aracaju num mapa, como orla, museus e parques, sem criar conta.',
};

type VisitPageProps = {
  searchParams?: Promise<{
    city?: string;
    place?: string;
  }>;
};

export default async function VisitPage({ searchParams }: VisitPageProps) {
  const { data: cities } = await api.city.getAll();
  const params = await searchParams;

  return (
    <div id="main" className="min-h-svh bg-background text-foreground">
      <LandingHeader variant="compact" />

      <div className="mx-auto w-full max-w-screen-xl px-6 py-8 lg:py-6">
        <TouristCityVisitExplorer
          cities={cities}
          initialCityId={params?.city ?? ''}
          initialPlaceId={params?.place ?? ''}
        />

        <p className="mt-6 text-[13px] text-muted-foreground">
          © 2026 Urbanify. Mapa © Google. Pontos de exemplo da cidade de demonstração, com posições aproximadas.
        </p>
      </div>
    </div>
  );
}
