import { ArrowRight, BadgeCheck, Camera, CircleCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button/button';

const HEADLINE = [
  ...'Problema na rua? Reporte e'.split(' ').map(word => ({ word, accent: false })),
  ...'acompanhe até resolver.'.split(' ').map(word => ({ word, accent: true })),
];

type Chip = {
  icon: typeof Camera;
  tone: string;
  title: string;
  text: string;
  className: string;
  delay: string;
  desktopOnly?: boolean;
};

const CHIPS: Chip[] = [
  {
    icon: Camera,
    tone: 'bg-tone-neutral-bg text-tone-neutral-fg',
    title: 'Buraco na rua',
    text: 'Foto e local anexados',
    className: 'top-[10%] left-4 md:top-[16%] md:left-[6%]',
    delay: '0s',
  },
  {
    icon: BadgeCheck,
    tone: 'bg-tone-blue-bg text-tone-blue-fg',
    title: 'Verificado no local',
    text: 'Segue para a prefeitura',
    className: 'bottom-[10%] right-4 md:top-[40%] md:right-[6%] md:bottom-auto',
    delay: '1.2s',
  },
  {
    icon: CircleCheck,
    tone: 'bg-tone-green-bg text-tone-green-fg',
    title: 'Resolvido',
    text: 'Confirmado por quem reportou',
    className: 'bottom-[12%] left-[30%]',
    delay: '2.4s',
    desktopOnly: true,
  },
];

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="scroll-mt-24 bg-hero-glow pt-10 md:pt-16">
      <div className="mx-auto w-full max-w-[1160px] px-6">
        <div className="mx-auto max-w-[880px] text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-tone-blue-bg px-3.5 py-1.5 text-[13px] font-semibold text-tone-blue-fg">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            Zeladoria urbana, do relato à solução
          </p>

          <h1 id="hero-title" className="mt-6 font-display text-display-xl text-navy">
            {HEADLINE.map(({ word, accent }, i) => (
              <span key={word + i}>
                {i > 0 && ' '}
                <span
                  className={cn('word', accent && 'text-primary')}
                  style={{ '--i': i } as CSSProperties}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-[620px] text-lead text-muted-foreground">
            Tire uma foto, marque o local e acompanhe cada etapa. Alguém confere no local, a prefeitura resolve e você confirma.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-full px-6 text-base lg:h-[52px]">
              <Link href="/login">
                Reportar um problema
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-full px-6 text-base lg:h-[52px]">
              <Link href="/visit">Explorar a cidade</Link>
            </Button>
          </div>

          <Link
            href="#prefeitura"
            className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-navy underline underline-offset-4"
          >
            Sou da prefeitura
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="relative mt-12 h-[440px] overflow-hidden rounded-[28px] border border-border bg-card ring-1 ring-inset ring-navy/5 md:mt-16 md:h-[520px] md:rounded-[40px] lg:h-[560px]">
          <Image
            src="/landing/map-aracaju-pins.jpg"
            alt="Mapa de Aracaju com chamados de exemplo marcados por pinos"
            fill
            priority
            quality={80}
            sizes="(min-width: 1200px) 1160px, 100vw"
            className="object-cover [object-position:60%_45%] md:[object-position:center]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/60 to-transparent" />

          {CHIPS.map(chip => (
            <div
              key={chip.title}
              aria-hidden="true"
              style={{ animationDelay: chip.delay }}
              className={cn(
                'animate-float absolute flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-2.5 shadow-float',
                chip.className,
                chip.desktopOnly && 'max-md:hidden',
              )}
            >
              <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-lg', chip.tone)}>
                <chip.icon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-navy">{chip.title}</span>
                <span className="block text-[13px] text-muted-foreground">{chip.text}</span>
              </span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[13px] text-muted-foreground">
          Mapa de demonstração de Aracaju (SE), com chamados fictícios. © OpenStreetMap contributors.
        </p>
      </div>
    </section>
  );
}
