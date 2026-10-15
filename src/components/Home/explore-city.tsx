import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { SectionHeading } from '@/components/Home/section-heading';
import { ARACAJU_PLACES, CATEGORY_META } from '@/components/Tourist/aracaju-places';
import { Button } from '@/components/ui/button/button';

const FEATURED = ['arcos-da-orla', 'museu-da-gente-sergipana', 'parque-da-sementeira'];

export function ExploreCity() {
  const places = ARACAJU_PLACES.filter(place => FEATURED.includes(place.id));

  return (
    <section id="explorar" aria-labelledby="explorar-title" className="scroll-mt-24 border-y border-border bg-card">
      <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-6 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:py-36">
        <div>
          <SectionHeading id="explorar-title" eyebrow="Para quem mora ou visita" title="Conheça Aracaju no mapa." />
          <p className="reveal mt-6 max-w-[560px] text-lead text-muted-foreground">
            Aracaju é a cidade de demonstração. Veja pontos conhecidos, como orla, museus e parques, sem criar conta.
          </p>
          <Button asChild variant="outline" className="reveal mt-8 h-12 rounded-full px-6 text-base lg:h-[52px]">
            <Link href="/visit">
              Explorar a cidade
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <ul className="border-b border-border">
          {places.map((place) => {
            const meta = CATEGORY_META[place.category];
            const Icon = meta.icon;
            return (
              <li key={place.id} className="border-t border-border">
                <Link href={`/visit?place=${place.id}`} className="flex min-h-[72px] items-center gap-4 py-3 transition-colors hover:text-primary">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-navy">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">{place.name}</span>
                    <span className="block text-sm text-muted-foreground">{meta.label}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
