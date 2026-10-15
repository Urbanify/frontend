import { History, ListChecks, Map as MapIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { SectionHeading } from '@/components/Home/section-heading';
import { Button } from '@/components/ui/button/button';

const POINTS = [
  { icon: ListChecks, text: 'Fila de atendimento com os chamados já verificados' },
  { icon: MapIcon, text: 'Mapa dos chamados, com a cor de cada status' },
  { icon: History, text: 'Histórico de cada chamado, do relato à confirmação' },
  { icon: ShieldCheck, text: 'Cada cidade vê apenas os seus próprios dados' },
];

const SOON = ['App no celular', 'Painel de resultados', 'Vitrine da cidade'];

export function PublicSector() {
  return (
    <section id="prefeitura" aria-labelledby="prefeitura-title" className="mx-auto w-full max-w-[1160px] scroll-mt-24 px-6 py-16 md:py-24 lg:py-36">
      <div className="grid gap-12 rounded-[28px] bg-navy-glow p-8 text-white md:rounded-[40px] md:p-14 lg:grid-cols-2 lg:items-center lg:p-16">
        <div>
          <SectionHeading
            id="prefeitura-title"
            tone="dark"
            eyebrow="Para a prefeitura"
            title="Cada chamado com etapa, responsável e histórico."
          />
          <p className="reveal mt-6 text-lead text-[#B9C3DD]">
            Um só lugar para receber, verificar, resolver e comprovar o que acontece na cidade.
          </p>

          <ul className="mt-8">
            {POINTS.map(point => (
              <li key={point.text} className="flex items-center gap-3 border-t border-white/15 py-3.5 text-[15px] last:border-b">
                <point.icon aria-hidden="true" className="size-5 shrink-0 text-mint" />
                {point.text}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button asChild className="h-12 rounded-full bg-white px-6 text-base text-navy hover:bg-white/90 lg:h-[52px]">
              <a href="mailto:contato@urbanify.com.br?subject=Quero%20conhecer%20a%20Urbanify">Falar com a Urbanify</a>
            </Button>
            <Link href="/visit" className="inline-flex min-h-11 items-center text-[15px] text-white underline underline-offset-4">
              Ver a cidade de demonstração
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2 text-[13px] text-white/70">
            {SOON.map(item => (
              <li key={item} className="rounded-full border border-white/25 px-3.5 py-1.5">
                {item}
                <span className="ml-1.5 text-white/60">· Em breve</span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="reveal">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15">
            <Image
              src="/landing/map-aracaju-pins.jpg"
              alt="Mapa de Aracaju com chamados de exemplo, em cores por status"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover [object-position:65%_40%]"
            />
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-navy">
              Visão do gestor
            </span>
          </div>
          <figcaption className="mt-3 text-[13px] text-[#B9C3DD]">Exemplo, com dados fictícios.</figcaption>
        </figure>
      </div>
    </section>
  );
}
