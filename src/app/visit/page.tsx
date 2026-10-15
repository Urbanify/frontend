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
  const activeCities = cities.filter(city => city.status === 'ACTIVE');
  // The server fetches the places of the city in the URL (or the first active one); the browser handles the rest.
  const initialCity = activeCities.find(city => city.id === params?.city) ?? activeCities[0];
  const initialPlaces = initialCity
    ? await api.places.listPublic(initialCity.id).catch(() => null)
    : null;

  return (
    <div id="main" className="min-h-svh bg-background text-foreground">
      <LandingHeader variant="compact" />

      <div className="mx-auto w-full max-w-screen-xl px-6 py-8 lg:py-6">
        <TouristCityVisitExplorer
          cities={cities}
          initialCityId={initialCity?.id ?? ''}
          initialPlaceId={params?.place ?? ''}
          initialPlaces={initialPlaces}
        />

        <p className="mt-6 text-[13px] text-muted-foreground">
          © 2026 Urbanify. Mapa © Google.
        </p>
      </div>
    </div>
  );
}
