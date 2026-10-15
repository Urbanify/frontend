import type { Metadata } from 'next';

import { Closing } from '@/components/Home/closing';
import { ExploreCity } from '@/components/Home/explore-city';
import { Faq } from '@/components/Home/faq';
import { Footer } from '@/components/Home/footer';
import { Hero } from '@/components/Home/hero';
import { HowItWorks } from '@/components/Home/how-it-works';
import { LandingHeader } from '@/components/Home/landing-header';
import { Marquee } from '@/components/Home/marquee';
import { PublicSector } from '@/components/Home/public-sector';

export const metadata: Metadata = {
  title: { absolute: 'Urbanify: reporte problemas da sua cidade e acompanhe até a solução' },
  description: 'Reporte um problema com foto e local, acompanhe a verificação e a solução e confirme quando for resolvido. Para prefeituras, uma fila e um histórico claros.',
};

// The root layout already wraps children in <main>, so this is a plain div with the skip-link target.
export default function HomePage() {
  return (
    <div id="main">
      <LandingHeader />
      <Hero />
      <Marquee />
      <HowItWorks />
      <PublicSector />
      <ExploreCity />
      <Faq />
      <Closing />
      <Footer />
    </div>
  );
}
