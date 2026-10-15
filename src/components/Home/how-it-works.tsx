'use client';

import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Camera, CircleCheck, FileText, History, ListChecks, MapPin, MessageSquare, ShieldCheck, Smartphone, UserCheck, Wrench } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { SectionHeading } from '@/components/Home/section-heading';

type Step = {
  tab: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  text: string;
  lines: Array<{ icon: LucideIcon; text: string }>;
};

const STEPS: Step[] = [
  {
    tab: 'Reportar',
    eyebrow: '01 · REPORTAR',
    icon: MapPin,
    title: 'Tire a foto, marque o local.',
    text: 'Escolha o tipo de problema e descreva em poucas palavras.',
    lines: [
      { icon: Camera, text: 'Até 5 fotos' },
      { icon: MapPin, text: 'Local marcado no mapa' },
      { icon: Smartphone, text: 'Funciona pelo navegador, no celular ou no computador' },
    ],
  },
  {
    tab: 'Verificar',
    eyebrow: '02 · VERIFICAR',
    icon: BadgeCheck,
    title: 'Alguém confere no local.',
    text: 'Um fiscal, que pode ser um cidadão voluntário ou um servidor, vai até o endereço.',
    lines: [
      { icon: CircleCheck, text: 'Diz se o problema existe' },
      { icon: MessageSquare, text: 'Pode registrar um comentário' },
      { icon: ShieldCheck, text: 'Evita chamado que não existe' },
    ],
  },
  {
    tab: 'Resolver',
    eyebrow: '03 · RESOLVER',
    icon: Wrench,
    title: 'A prefeitura resolve.',
    text: 'Depois de verificado, o chamado entra na fila e um gestor assume.',
    lines: [
      { icon: ListChecks, text: 'Fila de atendimento da prefeitura' },
      { icon: UserCheck, text: 'Gestor responsável pelo chamado' },
      { icon: FileText, text: 'A solução fica registrada' },
    ],
  },
  {
    tab: 'Confirmar',
    eyebrow: '04 · CONFIRMAR',
    icon: CircleCheck,
    title: 'Você confirma que foi resolvido.',
    text: 'Quem reportou responde se o problema acabou. Se não, o motivo fica no histórico.',
    lines: [
      { icon: MessageSquare, text: 'Resposta de quem reportou' },
      { icon: History, text: 'Histórico completo de cada etapa' },
      { icon: CircleCheck, text: 'Resolvido só depois da confirmação' },
    ],
  },
];

const ExampleTag = () => (
  <span className="absolute right-4 top-4 z-10 rounded-full border border-border bg-card/90 px-2.5 py-1 text-[13px] font-medium text-muted-foreground">
    Exemplo
  </span>
);

const Card = ({ className, children }: { className?: string; children: ReactNode }) => (
  <div className={cn('w-full max-w-[360px] rounded-xl border border-border bg-card p-4 shadow-float sm:p-5', className)}>
    {children}
  </div>
);

const Badge = ({ tone, children }: { tone: string; children: ReactNode }) => (
  <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[13px] font-semibold', tone)}>{children}</span>
);

const ghostButton = 'flex h-12 w-full items-center justify-center rounded-full border border-border bg-card text-base font-medium text-navy';
const primaryButton = 'flex h-12 w-full items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground';

// Illustrations of the product. Decorative and inert: they show the state, they do nothing.
function StepVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <>
        <Image src="/landing/map-aracaju-near.jpg" alt="" fill sizes="(min-width: 1024px) 544px, 100vw" className="object-cover dark:brightness-[.8]" />
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-card p-4 shadow-float">
          <p className="font-semibold text-navy">Buraco na rua</p>
          <p className="text-sm text-muted-foreground">2 fotos · local marcado no mapa</p>
        </div>
        <ExampleTag />
      </>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
      {index === 1 && (
        <Card>
          <Badge tone="bg-tone-blue-bg text-tone-blue-fg">Em verificação no local</Badge>
          <p className="mt-3 text-[15px] text-navy">Vá até o local e diga se o problema existe.</p>
          <div className="mt-4 space-y-2">
            <button type="button" disabled className={ghostButton}>O problema existe</button>
            <button type="button" disabled className={ghostButton}>Não encontrei o problema</button>
          </div>
        </Card>
      )}
      {index === 2 && (
        <Card>
          <Badge tone="bg-tone-blue-bg text-tone-blue-fg">Prefeitura resolvendo</Badge>
          <p className="mt-3 text-sm font-semibold text-navy">O que foi feito?</p>
          <div className="mt-2 rounded-lg border border-input bg-background p-3 text-[15px] text-navy">
            Equipe de manutenção enviada, serviço executado.
          </div>
          <button type="button" disabled className={cn(primaryButton, 'mt-4 opacity-50')}>Registrar solução</button>
        </Card>
      )}
      {index === 3 && (
        <Card>
          <Badge tone="bg-tone-amber-bg text-tone-amber-fg">Aguardando confirmação</Badge>
          <p className="mt-3 text-[15px] text-navy">A prefeitura informou que resolveu. Foi resolvido?</p>
          <div className="mt-4 space-y-2">
            <button type="button" disabled className={primaryButton}>Sim, foi resolvido</button>
            <button type="button" disabled className={ghostButton}>Não, ainda não</button>
          </div>
          <ul className="mt-4 space-y-2 border-t border-border pt-3 text-[13px] tabular-nums text-muted-foreground">
            {['Reportado', 'Verificado no local', 'Solução registrada'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <CircleCheck aria-hidden="true" className="size-4 text-tone-green-fg" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}
      <ExampleTag />
    </div>
  );
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);

  // The step under the middle of the viewport is the active one.
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    setActive(index);
    stepRefs.current[index]?.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="mx-auto w-full max-w-[1160px] scroll-mt-24 px-6 py-16 md:py-24 lg:py-36">
      <SectionHeading id="como-funciona-title" eyebrow="Como funciona" title="Do relato à solução, em quatro passos." align="center" />

      <div className="mt-16 lg:grid lg:grid-cols-[1fr_544px] lg:gap-16">
        <ol className="space-y-16 lg:space-y-0">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.eyebrow}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-index={i}
                className="lg:flex lg:min-h-[70svh] lg:flex-col lg:justify-center"
              >
                <div className={cn('transition-opacity duration-500', active !== i && 'lg:opacity-40')}>
                  <p className="flex items-center gap-2 text-eyebrow font-semibold uppercase text-primary">
                    <Icon aria-hidden="true" className="size-4" />
                    {step.eyebrow}
                  </p>
                  <h3 className="mt-4 font-display text-display-md text-navy">{step.title}</h3>
                  <p className="mt-4 text-lg text-muted-foreground">{step.text}</p>
                  <ul className="mt-6">
                    {step.lines.map(line => (
                      <li key={line.text} className="flex items-center gap-3 border-t border-border py-3.5 text-[15px] text-navy last:border-b">
                        <line.icon aria-hidden="true" className="size-5 shrink-0 text-primary" />
                        {line.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div aria-hidden="true" className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-accent/60 lg:hidden">
                  <StepVisual index={i} />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div aria-hidden="true" className="relative h-[640px] overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-card to-accent/60">
            {STEPS.map((step, i) => (
              <div
                key={step.eyebrow}
                inert={active !== i}
                className={cn(
                  'absolute inset-0 transition-opacity duration-300',
                  active === i ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
              >
                <StepVisual index={i} />
              </div>
            ))}
          </div>

          <div role="group" aria-label="Passos" className="mt-4 flex gap-2">
            {STEPS.map((step, i) => (
              <button
                key={step.tab}
                type="button"
                aria-pressed={active === i}
                onClick={() => goTo(i)}
                className={cn(
                  'flex h-11 flex-1 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors',
                  active === i ? 'bg-navy text-background' : 'border border-border bg-card text-navy hover:bg-accent',
                )}
              >
                {step.tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
